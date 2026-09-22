# ADR02: Architectural Style

* Status: Accepted

## Context and Problem Statement

The system's backend relies on three external systems: an LLM, Notion, and a database.
The core planning logic shouldn't have to change if any of them ever do. How should the backend be structured so its logic is decoupled from these external services?

## Decision Drivers

* Swapping a dependency should mean changing one file, not touching the core logic
  everywhere it's used.
* The core logic should be testable without the real services, as a consequence of that
  isolation.
* The architecture style should support a single developer context.

## Considered Options

* Hexagonal (Ports & Adapters)
* Layered architecture (N tier)
* Transaction script
* Microservices

## Decision Outcome

Chosen option: Hexagonal (Ports & Adapters), starting with a single port: the LLM
provider interface. The domain logic only depends on interfaces it defines, not
on Notion, Postgres, or the LLM directly. Notion and the database are called directly by
the outer layer instead, since only the LLM has a specific short-term need for swapping implementations.

### Consequences

* Good, because swapping an external service means changing one file, not the core logic (DIP).
* Good, because the core logic can be tested with a fake provider.
* Bad, because the boundary relies on discipline, not the language.
* Bad, because the outer layer that calls Notion and Postgres directly is coupled to
  their request shapes, unlike the LLM path, which remains shape-agnostic behind its port.

## Pros and Cons of the Options

### Hexagonal (Ports & Adapters) (chosen)

Isolates domain logic behind interfaces it defines. Layered and Transaction script
couple directly to implementations, and Microservices adds deployment overhead a
single developer doesn't need, but this option adds more files than the system
strictly needs.

### Layered architecture

Simpler with less boilerplate, but its layers depend on specific implementations
directly, making swaps harder than in Hexagonal.

### Transaction script

Self-contained, easy-to-read functions with no upfront abstraction, but shared logic
would be duplicated across functions.

### Microservices

Scales each part independently with strict separation by design, but adds deployment
overhead this single-developer system doesn't need.
