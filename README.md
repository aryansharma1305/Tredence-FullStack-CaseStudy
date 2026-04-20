# HR Workflow Designer

A production-style case-study prototype for designing and simulating HR workflows (onboarding, leave approval, automation chains) with React Flow.

## Stack

- React + TypeScript + Vite
- React Flow
- Zustand
- Zod
- MSW
- Tailwind CSS

## What Is Implemented

- 5 custom node types: Start, Task, Approval, Automated Step, End
- Left toolbox sidebar with drag-to-canvas cards
- Start-node card auto-disables once Start exists
- Quick templates: Basic Onboarding and Leave Approval
- Center canvas with:
  - connect/select/delete nodes and edges
  - built-in Controls + MiniMap + dotted background
  - toolbar actions: Undo, Redo, Auto Layout, Import JSON, Export JSON
- Right dark control panel with:
  - type-specific node configuration forms
  - edge label editing
  - simulation panel with execution timeline
- Dynamic Automated Step form:
  - loads actions from `GET /automations`
  - renders dynamic action parameters based on selected action
- Workflow validation:
  - exactly one Start
  - at least one End
  - no invalid connection structure
  - no cycles
  - node-level form validation
- Simulation engine (`POST /simulate`):
  - validates payload and graph
  - traverses workflow from Start
  - returns structured step logs
  - supports optional force-error mode for failure-path testing
- Keyboard shortcuts:
  - `Delete` / `Backspace`: remove selected
  - `Esc`: clear selection
  - `Cmd/Ctrl + Z`: undo
  - `Cmd/Ctrl + Shift + Z`: redo

## Folder Structure

```text
src/
  api/
    workflowApi.ts
  components/
    canvas/
      CanvasToolbar.tsx
      NodeSidebar.tsx
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
  constants/
    workflowTemplates.ts
  hooks/
    useAutomations.ts
    useKeyboardShortcuts.ts
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
    autoLayout.ts
    nodeFactory.ts
    workflowSerializer.ts
    workflowValidation.ts
```

## API Contract

### `GET /automations`

Returns mock action catalog:

```json
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject", "body"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] },
  { "id": "send_slack", "label": "Send Slack Message", "params": ["channel", "message"] },
  { "id": "create_ticket", "label": "Create JIRA Ticket", "params": ["project", "summary"] }
]
```

### `POST /simulate`

Accepts:

```json
{
  "nodes": [...],
  "edges": [...],
  "forceError": false
}
```

Returns a structured run summary with `status`, `finalMessage`, `executedNodes`, `totalNodes`, and `steps` timeline entries.

## How to Run

```bash
npm install
npm run dev
```

## Build and Lint

```bash
npm run build
npm run lint
```

## How to Add a New Node Type

1. Add data/type interface in `src/types/workflow.ts`
2. Add validation schema in `src/types/nodeSchemas.ts`
3. Add default node payload in `src/utils/nodeFactory.ts`
4. Add node renderer in `src/components/nodes/`
5. Register in `src/components/nodes/index.ts`
6. Add node form in `src/components/forms/`
7. Add routing case in `src/components/forms/NodeFormPanel.tsx`
8. Extend workflow validation and simulation messaging

## Notes

- No auth and no backend persistence by design for this case study.
- Data stays in-memory and is intended for local prototyping/demo.
