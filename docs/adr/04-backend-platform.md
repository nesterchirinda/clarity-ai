# ADR04: Backend Platform

* Status: Accepted

## Context and Problem Statement

With Node.js chosen as the backend language (ADR03), the system needs somewhere to run
it that's buildable and deployable by a single developer. What should the backend run
on?

## Decision Drivers

* Prefer the simplest option that meets the project's needs (KISS) - avoid infrastructure
  or setup this project doesn't require.
* Traffic is bursty per user, not sustained.
* Once deployed (not just running locally), the backend needs to fit a free hosting tier.

## Considered Options

* Netlify Functions
* Node/Express server
* Vercel Functions

## Decision Outcome

Chosen option: Netlify Functions. It ships frontend and backend from a single deploy,
needs no server to provision, and its free tier covers this project's traffic.

### Consequences

* Good, because there's no infrastructure to manage.
* Good, because every push auto-deploys via Netlify's native GitHub integration, with no
  separate CI/CD pipeline to build or maintain.
* Bad, because each invocation has a hard 10-second ceiling, so decomposing a goal into its four-tier hierarchy has to be split across several sequential calls rather than generated in one.

## Pros and Cons of the Options

### Netlify Functions (chosen)

Ships frontend and backend from one deploy with no server to provision, and its free
tier covers this project's bursty traffic without paying for idle capacity, but comes
with the 10-second ceiling noted above.

### Node/Express server

Removes the timeout ceiling entirely, but needs CI/CD built from scratch, only stays
free running locally, and runs continuously regardless of demand, a mismatch for
bursty, per-user traffic.

### Vercel Functions

Functionally equivalent to Netlify Functions, but offers no technical advantage over a
workflow that's already familiar.
