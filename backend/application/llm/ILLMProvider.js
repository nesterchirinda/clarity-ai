// Strategy Pattern (GoF) - defines the interface every LLM provider has to implement
class ILLMProvider {
  async chat(_messages, _promptOptions) {
    throw new Error('ILLMProvider.chat() must be implemented by a concrete provider');
  }

  async complete(_prompt, _promptOptions) {
    throw new Error('ILLMProvider.complete() must be implemented by a concrete provider');
  }

  // Returns a parsed object that matches `schema` (ADR12)
  // request: { tier: 'fast' | 'planning', effort, system, messages, schema }
  async structured(_request) {
    throw new Error('ILLMProvider.structured() must be implemented by a concrete provider');
  }

  // Runs a tool loop until the model stops calling tools; returns { text } (ADR12)
  // request: { tier, effort, system, messages, tools, handlers: { name: (input) => string } }
  async runTools(_request) {
    throw new Error('ILLMProvider.runTools() must be implemented by a concrete provider');
  }
}

module.exports = { ILLMProvider };
