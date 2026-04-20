# Architecture Decision Records

## ADR-001: Zustand over Redux
Date: 2026-04-20
Status: Accepted

Context: The app needs shared state for nodes, edges, selection, validation, and simulation data across canvas, sidebar, forms, and sandbox.

Decision: Used Zustand as the primary store. It keeps the write-path simple for React Flow events and avoids Redux boilerplate for a prototype-scale product.

Rejected:
- Redux Toolkit: strong option, but more ceremony than needed for this case-study scope.
- Context-only state: would cause broad rerenders during frequent graph updates.

## ADR-002: MSW over JSON Server
Date: 2026-04-20
Status: Accepted

Context: The case study asks for a mock API layer with realistic async behavior and no backend persistence.

Decision: Used MSW to expose `/automations` and `/simulate` from the browser runtime. This kept setup simple and preserved a real HTTP boundary for the frontend.

Rejected:
- JSON Server: requires a second process and separate data source.
- Hardcoded arrays in components: reduces API realism and blurs separation of concerns.

## ADR-003: Discriminated Node Data by `type`
Date: 2026-04-20
Status: Accepted

Context: Each node has a different data contract, and forms need compile-time safety when switching by node type.

Decision: Used discriminated unions keyed by `type` plus per-node Zod schemas. This keeps forms type-safe and makes new node type onboarding explicit.

Rejected:
- Single generic node payload: easier short-term, but weak guarantees and poorer maintainability.
- Loose schema-only approach: runtime-safe but weaker editor guidance.
