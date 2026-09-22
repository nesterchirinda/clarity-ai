# ADR06: Data Store

* Status: Accepted

## Context and Problem Statement

The backend must persist users, encrypted Notion tokens, Notion datasource IDs,
and in-progress conversation history, the last because Netlify Functions are stateless
between invocations (ADR04). What should hold this data?

## Decision Drivers

* The data is relational, with per-user uniqueness and foreign-key
  relationships.
* Data must persist reliably across separate, stateless function invocations.
* The project has no budget to run a database server.

## Considered Options

* Relational Database (Postgres via Supabase)
* Self-Managed Relational Database (Postgres)
* NoSQL Document Database (Firestore)


## Decision Outcome

Chosen option: Relational Database (Postgres via Supabase). Foreign keys and per-user
uniqueness need database-level enforcement, and Supabase provides that hosted, avoiding
the server-management cost self-managed Postgres would reintroduce.

### Consequences

* Good, because Supabase's hosted setup avoids any server patching or uptime responsibility.
* Good, because foreign keys and uniqueness constraints are enforced by the database, not application code.
* Bad, because Supabase's serverless client doesn't pool connections by default, which risks exhausting the database's connection limit under concurrent Netlify function invocations.

## Pros and Cons of the Options

### Relational Database (Postgres via Supabase) (chosen)

The only option that's both relational and fully managed. Firestore isn't relational,
self-managed Postgres isn't managed. The connection-pooling gap noted above still
applies.

### Self-Managed Relational Database (Postgres)

Relational, satisfying the FK/uniqueness driver, but reintroduces a server to patch and
keep available, which the no-budget driver rules out.

### NoSQL Document Database (Firestore)

Fully managed, satisfying the no-ops-budget driver, but as a document store it can't
enforce the per-user uniqueness and foreign-key relationships this data needs.

