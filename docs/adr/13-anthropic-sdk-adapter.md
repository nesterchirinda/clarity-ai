# ADR13: Anthropic SDK Adapter for the LLM Provider

* Status: Proposed

## Context and Problem Statement

ADR10 put the LLM behind the `ILLMProvider` interface. The existing adapter,
`ClaudeProvider`, calls Claude through Langchain with a fixed `maxTokens` of 2048 and
returns plain text. The planning pipeline (ADR12) needs features Langchain doesn't
expose directly: structured outputs, strict tool schemas, effort control, prompt
caching, streaming long answers and server-side refusal fallback. Which adapter should
implement the interface?

## Decision Drivers

* NFR09: the provider stays swappable - the domain must not depend on the SDK.
* Reliable JSON and long answers that are never cut off.
* Access to new model features without waiting for a wrapper library to add them.

## Considered Options

* Keep Langchain (`ClaudeProvider`)
* Add an adapter on Anthropic's official SDK (`AnthropicProvider`)

## Decision Outcome

Chosen option: add `AnthropicProvider` (`backend/infrastructure/AnthropicProvider.js`)
on `@anthropic-ai/sdk`, implementing the same interface plus two methods:

* `structured(request)` - `output_config.format` with the stage's JSON schema; returns a
  parsed object.
* `runTools(request)` - a tool loop with strict tool schemas; returns the final text.

It uses two model tiers, configurable by environment variable: `fast`
(`CLARITY_FAST_MODEL`, default `claude-haiku-5-5`) for classification, and `planning`
(`CLARITY_PLANNING_MODEL`, default `claude-opus-5-5`) for everything that needs
judgement. Requests stream with `max_tokens` 32000, cache the fixed system prompt, set
effort per stage, and use the server-side refusal fallback on the planning model.
Refusals, cut-offs and unreadable answers raise `LLMError` with a code the endpoint
returns to the client.

`chat()` and `complete()` are kept, so the existing endpoints can move over by changing
one constructor. `ClaudeProvider` stays until they have.

### Consequences

* Good, because the domain still depends only on `ILLMProvider` (NFR09 holds).
* Good, because new API features are available as soon as the SDK ships them.
* Bad, because there are two adapters until the existing endpoints are migrated.

## Pros and Cons of the Options

### Anthropic SDK adapter (chosen)

Direct access to structured outputs, tools, effort, caching and streaming. Ties this
adapter to one vendor's SDK, which the interface already contains.

### Keep Langchain

No new dependency, and Langchain can wrap other vendors, but it lags new features and
hides the controls this pipeline relies on.
