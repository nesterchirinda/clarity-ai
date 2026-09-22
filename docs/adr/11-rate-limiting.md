# ADR11: Rate Limiting

* Status: Proposed

## Context and Problem Statement

Every chat turn, decomposition tier, and sync calls a paid or rate-limited external
API. What should bound request volume?

## Decision Drivers

* Netlify Functions are stateless (ADR04) - an in-memory counter can't work across
  instances.
* Prefer the simplest option that meets the project's needs (KISS).

## Considered Options

* In-memory counter
* Postgres counter table

## Decision Outcome

Chosen option: Postgres counter table. Postgres already holds shared state, unlike an
in-memory counter, which can't work across Netlify's stateless functions.

### Consequences

* Good, because it needs no new infrastructure.
* Good, because limits are counted per action, not per request, so one action's
  several calls aren't mistaken for abuse.
* Bad, because every check depends on Supabase availability.

## Pros and Cons of the Options

### Postgres counter table (chosen)

Works across Netlify's stateless functions since state lives in the database, but
every check depends on Supabase's availability.

### In-memory counter

The simplest possible implementation, but not feasible as separate function instances don't share
memory or state.
