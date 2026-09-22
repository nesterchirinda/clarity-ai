# ADR09: Session Verification

* Status: Accepted

## Context and Problem Statement

ADR07 established the email from Notion's OAuth response as the user's identity, but
that identity is only proven once, at connect time. How should the system recognise the same user on every request afterward?

## Decision Drivers

* Netlify Functions are stateless (ADR04), so sessions can't rely on shared server
  state.
* NFR05 requires isolated sessions per user.
* KISS - no new infrastructure to run or maintain.

## Considered Options

* JSON Web Tokens (JWT)
* Session-Based Authentication

## Decision Outcome

Chosen option: JSON Web Tokens (JWT). The user's email is signed into a token after
the Notion OAuth callback and verified independently on every protected endpoint therefore no session store is needed.

### Consequences

* Good, because it needs no session store or new infrastructure, matching Netlify
  Functions' stateless model (ADR04).
* Good, because every protected endpoint verifies the token independently, with no
  shared session lookup.
* Bad, because a token can't be revoked before its 30-day expiry without extra
  infrastructure.

## Pros and Cons of the Options

### JSON Web Tokens (JWT) (chosen)

Needs no server-side session store, unlike Session-Based Authentication, but can't be revoked before its expiry, per the gap noted above.

### Session-Based Authentication

A session can be revoked immediately by deleting its server-side record, but needs a
shared session store Netlify Functions don't have by default, reintroducing the
stateful infrastructure ADR04 avoided.
