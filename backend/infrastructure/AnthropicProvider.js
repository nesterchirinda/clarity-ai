// Strategy Pattern (GoF) - ILLMProvider adapter on Anthropic's official SDK (ADR13)
// Replaces the Langchain adapter for the rethink pipeline because it needs
// structured outputs, strict tools, effort and prompt caching directly.
//
// - structured(): output_config.format with a JSON schema - the reply always parses
// - runTools(): manual tool loop with strict tool schemas
// - streaming + a high max_tokens, so long plans are never cut off mid-answer
// - the fixed system prompt is cached; volatile user data lives in messages
// - refusals on the planning model fall back server-side (fallbacks: "default")

const AnthropicSdk = require('@anthropic-ai/sdk');
const { ILLMProvider } = require('../application/llm/ILLMProvider.js');

const Anthropic = AnthropicSdk.default || AnthropicSdk;

const models = {
  fast: process.env.CLARITY_FAST_MODEL || 'claude-haiku-5-5',
  planning: process.env.CLARITY_PLANNING_MODEL || 'claude-opus-5-5'
};

// Models that accept the server-side refusal fallback
const fallbackModels = ['claude-opus-5-5', 'claude-opus-5', 'claude-sonnet-5-5', 'claude-fable-5-2', 'claude-fable-5-1'];
const fallbackBeta = 'server-side-fallback-2026-07-01';

// Replace Magic Number with Named Constant (Martin)
const defaultMaxTokens = 32000;
const maxToolTurns = 12;

class LLMError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'LLMError';
    this.code = code;
  }
}

class AnthropicProvider extends ILLMProvider {
  // The client is injectable so tests never touch the network
  constructor({ client } = {}) {
    super();
    this.client = client || new Anthropic();
  }

  _params({ tier = 'planning', effort, system, messages, maxTokens = defaultMaxTokens }) {
    const model = models[tier] || models.planning;
    const params = {
      model,
      max_tokens: maxTokens,
      system: [{ type: 'text', text: system || '', cache_control: { type: 'ephemeral' } }],
      messages,
      output_config: { effort: effort || (tier === 'fast' ? 'low' : 'high') }
    };
    if (fallbackModels.includes(model)) {
      params.betas = [fallbackBeta];
      params.fallbacks = 'default';
    }
    return params;
  }

  async _send(params) {
    const stream = this.client.beta.messages.stream(params);
    const message = await stream.finalMessage();
    if (message.stop_reason === 'refusal') {
      throw new LLMError('refusal', 'The model declined this request.');
    }
    if (message.stop_reason === 'max_tokens') {
      throw new LLMError('max_tokens', 'The answer was cut off. Try asking for less at once.');
    }
    return message;
  }

  _text(message) {
    return message.content.filter((block) => block.type === 'text').map((block) => block.text).join('');
  }

  async structured(request) {
    const params = this._params(request);
    params.output_config.format = { type: 'json_schema', schema: request.schema };
    const message = await this._send(params);
    try {
      return JSON.parse(this._text(message));
    } catch (error) {
      throw new LLMError('invalid_json', 'The model returned an answer that could not be read.');
    }
  }

  async runTools(request) {
    const params = this._params(request);
    params.tools = request.tools;
    params.tool_choice = { type: 'auto' };
    const messages = [...request.messages];

    for (let turn = 0; turn < maxToolTurns; turn += 1) {
      const message = await this._send({ ...params, messages });
      if (message.stop_reason === 'pause_turn') {
        messages.push({ role: 'assistant', content: message.content });
        continue;
      }
      const calls = message.content.filter((block) => block.type === 'tool_use');
      if (message.stop_reason !== 'tool_use' || calls.length === 0) {
        return { text: this._text(message) };
      }

      // Append the assistant turn unchanged, then every result in one user turn
      messages.push({ role: 'assistant', content: message.content });
      const results = calls.map((call) => {
        const handler = request.handlers[call.name];
        try {
          if (!handler) throw new Error(`Unknown tool ${call.name}`);
          return { type: 'tool_result', tool_use_id: call.id, content: String(handler(call.input)) };
        } catch (error) {
          return { type: 'tool_result', tool_use_id: call.id, content: error.message, is_error: true };
        }
      });
      messages.push({ role: 'user', content: results });
    }
    throw new LLMError('too_many_turns', 'The model kept calling tools without finishing.');
  }

  // Kept so the existing endpoints can move over without changing their calls
  async chat(messages, promptOptions = {}) {
    const message = await this._send(this._params({ system: promptOptions.systemPrompt, messages }));
    return this._text(message);
  }

  async complete(prompt, promptOptions = {}) {
    return this.chat([{ role: 'user', content: prompt }], promptOptions);
  }
}

module.exports = { AnthropicProvider, LLMError, models };
