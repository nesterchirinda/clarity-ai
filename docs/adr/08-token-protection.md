# ADR08: Notion Token Protection

* Status: Accepted

## Context and Problem Statement

The Notion access token issued during OAuth (ADR07) is the live credential the backend uses to read and write a user's workspace, and it's persisted in Supabase (ADR06). NFR01 requires it be protected from unauthorised access. How should it be protected at rest?

## Decision Drivers

* The Notion token should remain secure even if the database itself is exposed.
* Key rotation shouldn't require re-encrypting every row.

## Considered Options

* Application-level AES-256-GCM encryption
* At-rest disk encryption

## Decision Outcome

Chosen option: Application-level AES-256-GCM encryption. Tokens are encrypted before
write and decrypted only at the point of use; a key identifier travels with the
ciphertext so future rotation is additive.

### Consequences

* Good, because a raw database leak alone doesn't expose usable tokens.
* Bad, because the key lives in a single environment variable; losing or misconfiguring it breaks all encryption and decryption at once.

## Pros and Cons of the Options

### Application-level AES-256-GCM encryption (chosen)

Unlike disk-only encryption, protects against row-level DB access, not just physical
theft - but comes with the single-environment-variable risk noted above.

### At-rest disk encryption

Needs no application-level encryption code, but doesn't cover a leaked connection
string or a misconfigured Row Level Security policy.