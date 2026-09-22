# ADR10: LLM Provider

* Status: Accepted

## Context and Problem Statement

The system needs an LLM provider to power goal decomposition. How should the backend
integrate with it?

## Decision Drivers

* NFR09 requires the decomposition provider to be swappable without modifying core
  logic.
* An LLM vendor's outages or rate limits shouldn't take the whole product down (NFR08).

## Considered Options

* Call the SDK directly
* Provider interface (Strategy Pattern)

## Decision Outcome

Chosen option: Provider interface (Strategy Pattern). The planning service depends only on the interface, not the SDK directly. This satisfies NFR09 and enables NFR08's failover.

### Consequences

* Good, because the interface isolates the domain from the SDK, so a second provider
  can be added without touching core logic (DIP).
* Bad, because it adds boilerplate that direct SDK calls wouldn't need.

## Pros and Cons of the Options

### Provider interface (Strategy Pattern) (chosen)

Keeps the domain independent of any one provider, satisfying NFR09's swap
requirement, but adds boilerplate that calling the SDK directly wouldn't need.

### Call the SDK directly

The least code for a single-vendor system, but couples core logic directly to the
SDK, violating NFR09 and reducing interoperability.

