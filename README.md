# ClarityAI - Conversational Planning Assistant for Adults with ADHD

A conversational AI planning assistant built for the Software Architecture and Design module.

## Overview

ClarityAI decomposes a goal, described conversationally, into a numbered
Goal → Milestone → Task → Subtask plan, giving the user one clear next action at
every step. The approved plan syncs to the user's Notion workspace with parent-child
relations preserved.

## Tech Stack

- **Backend:** Netlify Functions (Node.js)
- **Database:** PostgreSQL (hosted on Supabase)
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **LLM:** Anthropic Claude via LangChain
- **Authentication:** Notion OAuth 2.0
- **Architecture:** Hexagonal (Ports & Adapters)

## Setup & Installation

### Prerequisites

- Node.js v18+
- A `.env` file with the following variables:

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE` | Supabase service role key |
| `ANTHROPIC_API_KEY` | Claude API key |
| `NOTION_CLIENT_ID` | Notion integration client ID |
| `NOTION_CLIENT_SECRET` | Notion integration client secret |
| `NOTION_REDIRECT_URI` | OAuth redirect URI registered with Notion |
| `APP_BASE_URL` | Base URL of the running app |
| `ENCRYPTION_KEY` | Key used to encrypt stored Notion tokens |
| `JWT_SECRET` | Key used to sign session tokens |

### Database Setup

- Run `/database/schema.sql` in your Supabase SQL Editor to create tables

### Installation

```bash
npm install
```

### Running the app

```bash
npm run dev
```

Then open `http://localhost:8888` in your browser.

## Running Tests

```bash
npm test
```

## Documentation

- [Requirements](docs/requirements/requirements.md)
- [Architecture Decision Records](docs/adr/README.md)
- [C4 Diagrams](docs/c4/c4-diagrams.md)
- [Testing](docs/testing/testing.md)
- [Design Thinking](docs/design-thinking/)
- [Solution Evaluation](docs/solution-evaluation/)

## Project Structure

```
clarity-ai/
├── backend/
│   ├── application/     # Decomposition generators, LLM strategy (Application layer)
│   ├── infrastructure/  # Repository, Notion adapter, Claude provider, encryption (Infrastructure layer)
│   ├── tests/           # Jest unit tests
│   └── *.js             # One Netlify Function (driving adapter) per endpoint
├── database/schema.sql
├── docs/                # ADRs, requirements, and design/testing documentation
└── frontend/            # Client (HTML, CSS, JS)
    ├── assets/         # Logo
    └── third-party/     # Vendored libraries (marked, DOMPurify)
```
