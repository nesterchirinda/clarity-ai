# ClarityAI - Conversational Planning Assistant for Adults with ADHD

A conversational AI planning assistant built for the Software Architecture and Design module.

## Overview

ClarityAI turns an open-ended conversation about a goal into a numbered Goal -> Milestone -> Task -> Subtask plan. The approved plan syncs into the user's own Notion workspace with parent/child relations preserved.

## Tech Stack

- **Backend:** Netlify Functions (Node.js)
- **Database:** PostgreSQL (hosted on Supabase)
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **LLM:** Anthropic Claude via LangChain
- **Authentication:** Notion OAuth 2.0
- **Architecture:** Hexagonal (Ports & Adapters)

## Implemented Features

- FR01/FR02: Staged onboarding - duplicate Notion template, then connect workspace
- FR03/FR04: Notion access persisted securely; data source ids entered once and cached
- FR05: Open-ended goal conversation with follow-up refinement
- FR06/FR07/FR08: Four-tier decomposition (Goal/Milestone/Task/Subtask) with structural validation
- FR09/FR10: Approve-or-refine plan review; syncs the hierarchy to Notion with relations preserved
- FR13/FR14: Speech-to-text input and read-aloud via the Web Speech API
- NFR01: Notion tokens encrypted at rest (AES-256-GCM)

## Setup & Installation

### Prerequisites

- Node.js v18+
- A `.env` file with the following variables:
  SUPABASE_URL, SUPABASE_SERVICE_ROLE, ANTHROPIC_API_KEY, NOTION_CLIENT_ID, NOTION_CLIENT_SECRET, NOTION_REDIRECT_URI, APP_BASE_URL, ENCRYPTION_KEY, JWT_SECRET

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
│   ├── application/     # Application - decomposition generators, LLM strategy
│   ├── infrastructure/  # Adapters - Repository, Notion adapter, Claude provider, encryption
│   └── *.js             # One Netlify Function (driving adapter) per endpoint
├── database/schema.sql
├── docs/                # ADRs, requirements, and design/testing documentation
└── frontend/            # Client (HTML, CSS, JS)
    └── third-party/     # Vendored libraries (marked, DOMPurify)
```

## Architecture

This project implements a Hexagonal (Ports & Adapters) architecture, with each Netlify Function acting as a driving adapter and composition root for the `application/` core it calls into.

- **Strategy Pattern:** applied to LLM provider selection via the `ILLMProvider` port, implemented by `ClaudeProvider`
- **Repository Pattern:** `DatabaseRepository` is the only module that talks to Supabase
- **Adapter Pattern:** `NotionAdapter` is the only module that knows Notion's page/property format
- **Template Method Pattern (via composition):** `runDecompositionStep()` fixes the shared build-prompt, call-model, parse-response sequence; each step (`goalStep`, `milestoneStep`, `taskStep`, `subtaskStep`) supplies its own prompt and parser as a plain config object, not a subclass
