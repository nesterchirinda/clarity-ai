// Strategy Pattern (GoF) - defines the interface every LLM provider has to implement
class ILLMProvider {
  async chat(_messages, _promptOptions) {
    throw new Error('ILLMProvider.chat() must be implemented by a concrete provider');
  }

  async complete(_prompt, _promptOptions) {
    throw new Error('ILLMProvider.complete() must be implemented by a concrete provider');
  }
}

module.exports = { ILLMProvider };
