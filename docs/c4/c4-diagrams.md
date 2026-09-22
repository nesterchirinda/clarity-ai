# C4 Diagrams

Architectural diagrams modelling the system using the [C4 model](https://c4model.com/)
(Brown, 2026): Context, Container, Component, and Code.

## Level 1: Context Diagram

A technology-agnostic, high-level view of ClarityAI, its user, and the external systems it depends on.

<p align="center">
<img src="../assets/context.svg" width="550" alt="System context diagram showing the ADHD User, ClarityAI, the LLM Provider, and the Notion API"><br>
<sub><b>Figure 1.</b> A context diagram for ClarityAI.</sub>
</p>

<br>

## Level 2: Container Diagram

The separately deployable pieces and the technology each one runs on.

<p align="center">
<img src="../assets/container.svg" width="800" alt="Container diagram showing the Frontend, Backend, and Database containers, and their external dependencies"><br>
<sub><b>Figure 2.</b> A container diagram for ClarityAI.</sub>
</p>

<br>

## Level 3: Component Diagram

The Netlify Functions container's components, and how they connect to each other. Only the LLM path is decoupled behind an interface, ILLMProvider, Notion and Supabase are called directly.

<p align="center">
<img src="../assets/component.svg" width="1000" alt="Component diagram showing the backend's application layer and infrastructure adapters"><br>
<sub><b>Figure 3.</b> A component diagram for ClarityAI's backend.</sub>
</p>

<br>

## Level 4: Code Diagrams

### Class Diagram

The Strategy pattern (GoF) used to communicate with the LLM. PlanningService depends on the ILLMProvider interface, not a concrete provider, so ClaudeProvider can be swapped without changing it.

<p align="center">
<img src="../assets/class.svg" width="600" alt="Class diagram showing ILLMProvider, PlanningService, ClaudeProvider, and a hypothetical OpenAIProvider"><br>
<sub><b>Figure 4.</b> A UML Class diagram for ClarityAI's backend.</sub>
</p>

<br>

### Sequence Diagram

One request traced end to end: generating milestones. The session check gates access before the Strategy pattern (PlanningService → ILLMProvider) runs twice in one request, once to build the Goal then again to build the Milestones.

<p align="center">
<img src="../assets/sequence.svg" width="800" alt="Sequence diagram tracing one request end to end through the backend"><br>
<sub><b>Figure 5.</b> A UML Sequence diagram for ClarityAI's backend.</sub>
</p>

<br>

### Entity Relationship Diagram

The database schema: conversation_sessions exists so state can persist between stateless Netlify Function calls.

<p align="center">
<img src="../assets/erd.svg" width="600" alt="Entity relationship diagram showing the users, notion_connections, notion_database_refs, and conversation_sessions tables"><br>
<sub><b>Figure 6.</b> An Entity Relationship Diagram for ClarityAI's database.</sub>
</p>

<br>

## References

* Brown, S. (2026) *The C4 model for visualising software architecture*. Available at:
  https://c4model.com/
