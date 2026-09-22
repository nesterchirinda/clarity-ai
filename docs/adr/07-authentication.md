# ADR07: User Authentication (Identity)

* Status: Accepted

## Context and Problem Statement

A user is identified by their email, but the app needs to trust that the email is theirs before storing it. Where should that trusted email come from?

## Decision Drivers

* Notion already hands over a verified email during connection.
* NFR06 requires reducing cognitive load for ADHD users; fewer signup steps are ideal.

## Considered Options

* Use the email from Notion's connection
* Sign up with email + password
* Send Magic link or OTP

## Decision Outcome

Chosen option: Use the email from Notion's connection as the user's identity. This collapses identity and the Notion connection into one step.

### Consequences

* Good, because there's one connect flow and no password to store or leak.
* Bad, because it depends entirely on Notion granting email access; if missing there's no fallback identity.
* Bad, because identity has no existence apart from the Notion OAuth flow itself, the only way to re-establish it is to go through that flow again.

## Pros and Cons of the Options

### Use the email from Notion's connection (chosen)

Needs no separate account or password to reconcile against the Notion connection, but comes with the missing-email gap noted above.

### Sign up with email + password

Doesn't depend on Notion granting email access, but a password means hashing and protecting it, plus building reset/forgot-password handling neither alternative needs.

### Send Magic link or OTP

Confirms the user owns the email without storing a password, but needs an
email-sending service to re-verify an email Notion already confirms.