# HR Workflow Designer

A case-study prototype for an HR admin to design and test workflows visually.

## Stack

- React + TypeScript + Vite
- React Flow for graph canvas
- Zustand for app state
- Zod for form and node-data validation
- MSW for mock API endpoints
- Tailwind CSS for UI styling

## Features Implemented

- Drag-and-drop canvas for 5 node types: Start, Task, Approval, Automated Step, End
- Edge creation and selection on React Flow canvas
- Node and edge deletion from inspector or keyboard delete key
- Node-specific configuration panel with controlled inputs
- Dynamic action parameter form for Automated Step based on API action definition
- Live workflow validation with node-level visual errors
- Sandbox panel that:
  - serializes graph to JSON
  - validates graph structure
  - calls mock `POST /simulate`
  - renders step-by-step execution logs
- Mock API with:
  - `GET /automations`
  - `POST /simulate`

## Folder Structure

```text
src/
  api/
    workflowApi.ts
  components/
    canvas/
      NodePalette.tsx
      WorkflowCanvas.tsx
    forms/
      ApprovalNodeForm.tsx
      AutomatedNodeForm.tsx
      EdgeForm.tsx
      EndNodeForm.tsx
      FormPrimitives.tsx
      KeyValueEditor.tsx
      NodeFormPanel.tsx
      StartNodeForm.tsx
      TaskNodeForm.tsx
    nodes/
      ApprovalNode.tsx
      AutomatedNode.tsx
      EndNode.tsx
      NodeShell.tsx
      StartNode.tsx
      TaskNode.tsx
      index.ts
    sandbox/
      SimulatePanel.tsx
  hooks/
    useAutomations.ts
    useNodeIssues.ts
    useSimulate.ts
    useWorkflowValidation.ts
  mocks/
    browser.ts
    handlers.ts
  store/
    workflowStore.ts
  types/
    nodeSchemas.ts
    workflow.ts
  utils/
    nodeFactory.ts
    workflowValidation.ts
```

## Architecture Notes

- Canvas logic is isolated in `components/canvas` and only interacts with store actions.
- Node rendering is isolated in `components/nodes`, one component per node type.
- Form logic is isolated in `components/forms`, one form per node type.
- API calls are abstracted in `api/workflowApi.ts`; UI never calls `fetch` directly.
- Validation is centralized in `utils/workflowValidation.ts` and reused by live validation + simulation guard.
- Zustand keeps graph, selection, validation, and simulation state in one predictable state layer.

## JD Requirement Mapping

- Canvas with Start/Task/Approval/Automated/End nodes: implemented with custom React Flow node components
- Drag nodes from sidebar to canvas: implemented in `NodePalette` + drop handling in `WorkflowCanvas`
- Connect, select, and delete nodes/edges: implemented with controlled React Flow + store actions
- Basic constraints (including Start-first behavior): implemented in `workflowValidation` (single Start, no incoming to Start, reachability, cycles)
- Node form panel per type: implemented with dedicated form files under `components/forms`
- Dynamic automated action params: implemented from `GET /automations` response schema
- Mock API layer: implemented with MSW handlers and a separate API client layer
- Sandbox simulation panel: implemented with `useSimulate` and timeline render
- README architecture + decisions + extension guidance: included below

## Validation Rules

- Exactly one Start node must exist
- At least one End node must exist
- Start node cannot have incoming edges
- End node cannot have outgoing edges
- Non-start nodes must have at least one incoming edge
- Non-end nodes must have at least one outgoing edge
- All nodes must be reachable from Start
- Cycles are blocked
- Node data must satisfy type-specific schema
- Automated Step requires selected action and non-empty action params

## Mock API Contract

### `GET /automations`

Returns action definitions:

```json
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] }
]
```

### `POST /simulate`

Input:

```json
{
  "nodes": [...],
  "edges": [...]
}
```

Output:

```json
{
  "runId": "run-xxxx",
  "status": "completed",
  "steps": [
    {
      "id": "step-1",
      "nodeId": "start-...",
      "title": "Workflow Start",
      "detail": "Workflow starts with 0 metadata fields",
      "status": "success",
      "timestamp": "2026-04-20T..."
    }
  ]
}
```

## How To Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## How To Add a New Node Type

1. Add the node type and data interface in `src/types/workflow.ts`
2. Add its Zod schema in `src/types/nodeSchemas.ts`
3. Add default data and palette template in `src/utils/nodeFactory.ts`
4. Create a node UI component in `src/components/nodes/`
5. Register it in `src/components/nodes/index.ts`
6. Create the form component in `src/components/forms/`
7. Add form routing logic in `src/components/forms/NodeFormPanel.tsx`
8. Extend `validateNodeData` in `src/utils/workflowValidation.ts`
9. Optionally extend simulation detail logic in `src/mocks/handlers.ts`

## Assumptions

- Single-user editing in-memory only
- No auth and no persistence by design for this case-study scope
- Validation is strict enough to block invalid simulation runs

## What I Would Add With More Time

- Import JSON + restore canvas state
- Undo/redo history and optimistic action stack
- Better branching simulation semantics for conditional approvals
- Auto-layout and workflow templates
- Persistent backend storage + version history
- Unit tests for validation and node form reducers
