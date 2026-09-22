# ADR05: Frontend Stack

* Status: Accepted

## Context and Problem Statement

The frontend covers onboarding, plan review, and sync, and is built and maintained by a single developer. What should it be built with?

## Decision Drivers

* Prefer the simplest option that meets the project's needs (KISS) - too few flows
  (onboarding, plan review, sync) to justify component reuse yet.
* Ideally no build tooling to maintain, due to single-developer context.
* The only CPU-intensive work (the LLM calls) runs server-side, not in the browser.

## Considered Options

* Vanilla HTML/CSS/JS
* TypeScript
* A component framework (React, Vue, Svelte)

## Decision Outcome

Chosen option: Vanilla HTML/CSS/JS, no framework or bundler. Third-party libraries are vendored locally rather than pulled from a CDN, so there is no dependency on an external host's availability.
 
### Consequences

* Good, because there's no build step and no toolchain to maintain.
* Bad, because a single shared mutable state object with manual DOM updates won't scale past a handful of screens.

## Pros and Cons of the Options

### Vanilla HTML/CSS/JS (chosen)

Vanilla JS avoids the framework overhead of TypeScript's compile step or a component framework's build pipeline (KISS), however the manual-DOM-updates scaling limit noted above still applies.

### TypeScript

Type-checking catches a class of bugs vanilla JS can't, but its compile step adds a build command this project doesn't necessitate.

### A component framework (React, Vue, Svelte)

Gives better structure as screens grow and removes the manual-DOM-updates limit, but needs a build pipeline this project doesn't need yet, and there's no CPU-intensive client work for its rendering optimisations to benefit.