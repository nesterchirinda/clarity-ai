// Strategy Pattern (GoF) - thin wrapper around whichever provider it's given

class PlanningService {
  // No default provider - the core shouldn't construct a concrete adapter itself. Dependency Injection (Fowler)
  constructor(provider) {
    this.provider = provider;
  }

  async chat(messages, promptOptions) {
    return this.provider.chat(messages, promptOptions);
  }

  async complete(prompt, promptOptions) {
    return this.provider.complete(prompt, promptOptions);
  }
}

module.exports = { PlanningService };
