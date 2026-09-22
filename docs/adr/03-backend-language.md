# ADR03: Backend Language

* Status: Accepted

## Context and Problem Statement

The system needs a backend language and framework to talk to an LLM provider, Notion, and a database. What language and framework should it use?

## Decision Drivers

* Prefer the simplest option that meets the project's needs (KISS).
* Frontend runs as JavaScript regardless of framework, so matching it
  avoids a second language.

## Considered Options

* Node.js
* Python with Django
* C# with ASP.NET Core MVC

## Decision Outcome

Chosen option: Node.js, with no framework - this is a small set of API
endpoints, not big enough to justify the structure a framework would add (KISS).

### Consequences

* Good, because one language across the stack means less context-switching.
* Good, because there's no framework to configure beyond Netlify's own handler API.
* Bad, because there's no built-in structure, so auth, logging, and data access all
  need manual setup.

## Pros and Cons of the Options

### Node.js (chosen)

Notion's official SDK is JS/TS only, and unlike Django or ASP.NET Core it needs no
second language to context-switch to, but it comes with the manual-setup trade-off
above that those frameworks avoid by including structure out of the box.

### Python with Django

Comes with a built-in ORM, auth, and admin tooling, but its MVT pattern adds structure
this API doesn't need (KISS), it's a second language to context-switch to, and Notion
has no official SDK for it (ADR01).

### C# with ASP.NET Core MVC

A mature, enterprise-grade framework, but its DI container and MVC conventions are more
structure than a small API needs (KISS), it's a second language to context-switch to,
and Notion has no official SDK for it (ADR01).
