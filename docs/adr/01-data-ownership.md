# ADR01: Data Ownership

* Status: Accepted

## Context and Problem Statement

The proposed solution addresses goal decomposition, but a user still needs to manage
the resulting hierarchy day to day. Given the Need Statement's core aim of eliminating
the cognitive friction of planning and enabling immediate action, what option will
best facilitate this: a dedicated task-management interface, or integration with a tool
the user already uses?

## Decision Drivers

* Adoption friction - learning and adopting a new tool costs cognitive effort.
* The data model needs to be able to hold the four-tier hierarchy
* Task management is not this product's actual problem domain, goal decomposition is.

## Considered Options

* Build a proprietary interface for managing the decomposed plan
* Integrate with Notion
* Integrate with TickTick

## Decision Outcome

Chosen option: Integrate with Notion. It's the only option that has the requisite data model and avoids both the
development cost of building an interface and the adoption cost of a new tool for the persona.

### Consequences

* Good, because using a tool the persona already relies on avoids the adoption cost of a new tool.
* Good, because Notion natively supports custom structure through its database and
  relation model, allowing easy implementation of the 4 tier hierarchy.
* Bad, because the backend must work within Notion's API constraints; adding integration
  complexity a proprietary store wouldn't have.

## Pros and Cons of the Options

### Integrate with Notion (chosen)

Its relational database model is the only one that can hold the four-tier hierarchy and
extensible properties this decomposition needs; TickTick's task model is flatter and
fixed. It also avoids building a proprietary interface, but that flexibility brings
API-dependency and template-fragility overhead.

### Integrate with TickTick

Easy to integrate for standard tasks, needs no interface built, and offers strong
native productivity features (Pomodoro, Eisenhower Matrix, calendar sync), but its API
exposes a flatter model than the up-to-5-level nesting its own app UI allows.

### Build a proprietary interface

Removes any external API or template dependency, with the data model shaped exactly
around the four-tier hierarchy, but building CRUD from scratch duplicates an
already-solved problem.
