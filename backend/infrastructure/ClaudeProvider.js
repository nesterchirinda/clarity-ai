// Strategy Pattern (GoF) implementation - talks to Claude through Langchain
// Concrete adapter for the ILLMProvider port

const { ChatAnthropic } = require('@langchain/anthropic');
const { HumanMessage, AIMessage, SystemMessage } = require('@langchain/core/messages');
const { ILLMProvider } = require('../application/llm/ILLMProvider.js');

const defaultModel = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

class ClaudeProvider extends ILLMProvider {
  constructor() {
    super();
    this.chatModel = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: defaultModel,
      temperature: 0.4,
      maxTokens: 2048
    });
    // Langchain sets a bad default here for this model
    this.chatModel.topP = undefined;
  }

  async chat(messages, promptOptions = {}) {
    const langchainMessages = this._buildLangChainMessages(messages, promptOptions.systemPrompt);
    const response = await this.chatModel.invoke(langchainMessages);
    return response.content;
  }

  async complete(prompt, promptOptions = {}) {
    const langchainMessages = this._buildLangChainMessages(
      [{ role: 'user', content: prompt }],
      promptOptions.systemPrompt
    );
    const response = await this.chatModel.invoke(langchainMessages);
    return response.content;
  }

  // Langchain requires its own message classes, not plain { role, content } objects
  _buildLangChainMessages(messages, systemPrompt) {
    const out = [];
    if (systemPrompt) out.push(new SystemMessage(systemPrompt));
    for (const m of messages) {
      if (m.role === 'assistant') out.push(new AIMessage(m.content));
      else out.push(new HumanMessage(m.content));
    }
    return out;
  }
}

module.exports = { ClaudeProvider };
