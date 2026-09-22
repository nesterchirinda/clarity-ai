# Requirements

Functional and non-functional requirements, most derived from the Need Statement identified
in [Design Thinking](../design-thinking/empathise-define.md) - a few (see FR20, FR21) surfaced
later, from testing. All requirements are
prioritised using MoSCoW (Clegg and Barker, 1994): **Must** (non-negotiable), **Should**
(important, not critical), **Could** (nice to have), and **Won't** (out of scope for this delivery).

<br>

## 1. Functional Requirements

| ID | Description | Priority | MVP | Status |
|:---:|---|:---:|:---:|:---:|
| **FR01** | The system must guide the user through onboarding: linking the Notion template, confirming duplication, and connecting the workspace, before allowing goal input | **Must** | 1 | Delivered |
| **FR02** | The system must authenticate with the user's Notion workspace | **Must** | 1 | Delivered |
| **FR03** | The system must persist the user's Notion access securely between sessions | **Must** | 1 | Delivered |
| **FR04** | The system must capture and map the unique data source IDs for the Goal, Milestone, Task, and Subtask tables within the user's connected Notion workspace | **Must** | 1 | Delivered |
| **FR05** | The system must let the user describe and refine a goal through open-ended conversation | **Must** | 1 | Delivered |
| **FR06** | The system must decompose the goal into a four-tier hierarchy of Goal, Milestone, Task, and Subtask | **Must** | 1 | Delivered |
| **FR07** | The system must validate the structure and naming of the output at each tier before proceeding to the next | **Must** | 1 | Delivered |
| **FR08** | The system must generate and format all output using action-oriented naming, logical sequencing, and clear numbering to provide ADHD-appropriate cognitive scaffolding | **Must** | 1 | Delivered |
| **FR09** | The system must present the hierarchy for review, letting the user request changes via conversation for regeneration, and require explicit approval before syncing | **Must** | 1 | Delivered |
| **FR10** | The system must write the approved hierarchy to Notion with correct relational properties, prefixing Milestones and Tasks with their position number, and Subtasks with a number relative to their parent Task | **Must** | 1 | Delivered |
| **FR11** | The system should allow the user to disconnect their Notion workspace at any time, without deleting their account | Should | 2 | Planned |
| **FR12** | The system must allow the user to permanently delete their account and all associated data on request | **Must** | 2 | Planned |
| **FR13** | The system should allow the user to input text via speech in addition to typing | Should | 2 | Delivered |
| **FR14** | The system should allow the user to hear the generated plan read aloud on request | Should | 2 | Delivered |
| **FR15** | The system could support goal input from an uploaded PDF document | Could | 3 | Planned |
| **FR16** | The system could sync task dependencies (which tasks block others) | Could | 3 | Planned |
| **FR17** | The system should tag each task with an estimated time and energy level, to help the user match tasks to their current capacity | Should | 2 | Delivered |
| **FR18** | The system should assign each task a priority label (Do First / Do Next / Do Later) based on its position in the sequence, to help the user decide what to act on first | Should | 2 | Delivered |
| **FR19** | The system should assign realistic due dates to milestones and tasks, paced across the goal's available timeframe | Should | 2 | Delivered |
| [**FR20**](../solution-evaluation/autoethnographic-testing.md) | The system should first attempt to auto-discover the user's Notion data source IDs during setup, falling back to asking for any it can't find rather than requiring full manual entry | Should | 2 | Planned |
| [**FR21**](../solution-evaluation/autoethnographic-testing.md) | The system should let the user directly edit generated plan text inline during review, as an alternative to conversational refinement | Should | 3 | Planned |
| **FR22** | The system must let the user end their current session (log out) without revoking their Notion connection or deleting their account | **Must** | 2 | Planned |

FR20 and FR21 are identified latent needs - surfaced through autoethnographic testing of the solution rather than immediately realised as core needs. They aim to alleviate onboarding friction over manual data source entry (FR20), and address the want for
inline editing as well as conversational refinement (FR21).

<br>

## 2. Non-Functional Requirements

Categorised according to the ISO/IEC 25010 software quality model (International
Organization for Standardization, 2011).

| ID | Theme | Description | Priority | MVP | Status |
|:---:|---|---|:---:|:---:|:---:|
| **NFR01** | Security | The system must protect Notion access tokens from unauthorised access via encryption, protect against cross-site request forgery on authentication, and sanitise all user input before processing | **Must** | 1 | Delivered |
| **NFR02** | Data Privacy | The system must comply with UK GDPR by minimising data collection, retaining goal content no longer than necessary for the user to complete and accept their plan, and securely storing all persisted data | **Must** | 2 | Delivered |
| **NFR03** | Performance | Goal decomposition should complete within 15 seconds, and Notion sync should complete within 5 seconds under normal operating conditions | **Must** | 1 | Partially Verified |
| **NFR04** | Availability | The system should maintain an uptime of 99% during normal use, an acceptable target for a non-critical single-purpose productivity tool | Should | 1 | Unverified |
| **NFR05** | Scalability | The system must support concurrent use by multiple authenticated users, each with an isolated session and workspace connection | **Must** | 1 | Delivered |
| **NFR06** | Usability & Accessibility | All interfaces must comply with WCAG 2.1 AA, apply progressive disclosure to reduce cognitive load for ADHD users, and visually distinguish each hierarchy tier so the user can immediately identify what level they are viewing | **Must** | 1 | Partially Verified |
| **NFR07** | Maintainability | The codebase should follow a clean, layered structure, consistent naming conventions, and inline documentation to remain extendable | Should | 1 | Delivered |
| **NFR08** | Reliability | The system should handle Notion API rate limiting with retry logic, and if the primary LLM provider is unavailable, should attempt the alternate provider before showing the user a plain-English message to try again later | Should | 3 | Planned |
| **NFR09** | Interoperability | The underlying decomposition provider should be swappable without modifying core logic, so future providers could be integrated without altering business logic | **Must** | 1 | Delivered |

<br>

## References

* Clegg, D. and Barker, R. (1994) *Case Method Fast-Track: A RAD Approach*.
  Wokingham: Addison-Wesley.
* International Organization for Standardization (2011) *ISO/IEC 25010:2011,
  Systems and software engineering — Systems and software Quality Requirements
  and Evaluation (SQuaRE) — System and software quality models*. Geneva: ISO.