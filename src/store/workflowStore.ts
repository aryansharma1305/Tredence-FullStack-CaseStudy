import { create } from 'zustand'
import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow'
import type { Connection, Edge, EdgeChange, NodeChange, XYPosition } from 'reactflow'
import type {
  AutomationAction,
  SimulateResponse,
  ValidationIssue,
  WorkflowNode,
  WorkflowNodeData,
  WorkflowNodeType
} from '../types/workflow'
import { layoutWorkflow } from '../utils/autoLayout'
import { createInitialGraph, createNode } from '../utils/nodeFactory'

type Snapshot = {
  nodes: WorkflowNode[]
  edges: Edge[]
}

interface WorkflowStore {
  nodes: WorkflowNode[]
  edges: Edge[]
  past: Snapshot[]
  future: Snapshot[]
  selectedNodeId: string | null
  selectedEdgeId: string | null
  automations: AutomationAction[]
  validationIssues: ValidationIssue[]
  simulationResult: SimulateResponse | null
  isSimulating: boolean
  addNode: (type: WorkflowNodeType, position: XYPosition) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  updateNodeData: (nodeId: string, updater: (current: WorkflowNodeData) => WorkflowNodeData) => void
  setSelectedNodeId: (nodeId: string | null) => void
  setSelectedEdgeId: (edgeId: string | null) => void
  updateEdgeLabel: (edgeId: string, label: string) => void
  deleteSelected: () => void
  undo: () => void
  redo: () => void
  applyAutoLayout: () => void
  importWorkflow: (payload: { nodes: WorkflowNode[]; edges: Edge[] }) => void
  setAutomations: (automations: AutomationAction[]) => void
  setValidationIssues: (issues: ValidationIssue[]) => void
  setSimulationResult: (result: SimulateResponse | null) => void
  setIsSimulating: (value: boolean) => void
  clearSimulation: () => void
}

const initialGraph = createInitialGraph()

const defaultEdge = {
  animated: false,
  type: 'smoothstep' as const,
  style: {
    strokeWidth: 2,
    stroke: '#2f4869'
  }
}

const cloneSnapshot = (snapshot: Snapshot): Snapshot => ({
  nodes: structuredClone(snapshot.nodes),
  edges: structuredClone(snapshot.edges)
})

const captureState = (state: Pick<WorkflowStore, 'nodes' | 'edges'>): Snapshot => ({
  nodes: structuredClone(state.nodes),
  edges: structuredClone(state.edges)
})

const shouldCaptureNodeChanges = (changes: NodeChange[]) => {
  return changes.some((change) => {
    if (change.type === 'position') {
      return !change.dragging
    }

    return true
  })
}

const shouldCaptureEdgeChanges = (changes: EdgeChange[]) => {
  return changes.some((change) => change.type !== 'select')
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: initialGraph.nodes,
  edges: initialGraph.edges,
  past: [],
  future: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  automations: [],
  validationIssues: [],
  simulationResult: null,
  isSimulating: false,

  addNode: (type, position) => {
    const node = createNode({ type, position })

    set((state) => ({
      past: [...state.past, captureState(state)],
      future: [],
      nodes: [...state.nodes, node],
      selectedNodeId: node.id,
      selectedEdgeId: null
    }))
  },

  onNodesChange: (changes) => {
    set((state) => {
      const nextNodes = applyNodeChanges(changes, state.nodes) as WorkflowNode[]

      if (!shouldCaptureNodeChanges(changes)) {
        return { nodes: nextNodes }
      }

      return {
        past: [...state.past, captureState(state)],
        future: [],
        nodes: nextNodes
      }
    })
  },

  onEdgesChange: (changes) => {
    set((state) => {
      const nextEdges = applyEdgeChanges(changes, state.edges)

      if (!shouldCaptureEdgeChanges(changes)) {
        return { edges: nextEdges }
      }

      return {
        past: [...state.past, captureState(state)],
        future: [],
        edges: nextEdges
      }
    })
  },

  onConnect: (connection) => {
    set((state) => ({
      past: [...state.past, captureState(state)],
      future: [],
      edges: addEdge(
        {
          ...connection,
          id: `edge-${crypto.randomUUID().slice(0, 8)}`,
          ...defaultEdge
        },
        state.edges
      )
    }))
  },

  updateNodeData: (nodeId, updater) => {
    set((state) => ({
      past: [...state.past, captureState(state)],
      future: [],
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: updater(node.data)
            }
          : node
      )
    }))
  },

  setSelectedNodeId: (selectedNodeId) => {
    set({ selectedNodeId })
  },

  setSelectedEdgeId: (selectedEdgeId) => {
    set({ selectedEdgeId })
  },

  updateEdgeLabel: (edgeId, label) => {
    set((state) => ({
      past: [...state.past, captureState(state)],
      future: [],
      edges: state.edges.map((edge) =>
        edge.id === edgeId
          ? {
              ...edge,
              label
            }
          : edge
      )
    }))
  },

  deleteSelected: () => {
    set((state) => {
      if (state.selectedNodeId) {
        const nodeId = state.selectedNodeId

        return {
          past: [...state.past, captureState(state)],
          future: [],
          nodes: state.nodes.filter((node) => node.id !== nodeId),
          edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
          selectedNodeId: null
        }
      }

      if (state.selectedEdgeId) {
        return {
          past: [...state.past, captureState(state)],
          future: [],
          edges: state.edges.filter((edge) => edge.id !== state.selectedEdgeId),
          selectedEdgeId: null
        }
      }

      return {}
    })
  },

  undo: () => {
    const state = get()

    if (state.past.length === 0) {
      return
    }

    const previous = state.past[state.past.length - 1]
    const rest = state.past.slice(0, -1)

    set({
      nodes: cloneSnapshot(previous).nodes,
      edges: cloneSnapshot(previous).edges,
      past: rest,
      future: [captureState(state), ...state.future],
      selectedNodeId: null,
      selectedEdgeId: null
    })
  },

  redo: () => {
    const state = get()

    if (state.future.length === 0) {
      return
    }

    const next = state.future[0]
    const remaining = state.future.slice(1)

    set({
      nodes: cloneSnapshot(next).nodes,
      edges: cloneSnapshot(next).edges,
      past: [...state.past, captureState(state)],
      future: remaining,
      selectedNodeId: null,
      selectedEdgeId: null
    })
  },

  applyAutoLayout: () => {
    set((state) => {
      const { nodes, edges } = layoutWorkflow(state.nodes, state.edges)

      return {
        past: [...state.past, captureState(state)],
        future: [],
        nodes,
        edges,
        selectedNodeId: null,
        selectedEdgeId: null
      }
    })
  },

  importWorkflow: (payload) => {
    set((state) => ({
      past: [...state.past, captureState(state)],
      future: [],
      nodes: payload.nodes,
      edges: payload.edges,
      selectedNodeId: null,
      selectedEdgeId: null,
      simulationResult: null
    }))
  },

  setAutomations: (automations) => {
    set({ automations })
  },

  setValidationIssues: (validationIssues) => {
    set({ validationIssues })
  },

  setSimulationResult: (simulationResult) => {
    set({ simulationResult })
  },

  setIsSimulating: (isSimulating) => {
    set({ isSimulating })
  },

  clearSimulation: () => {
    set({ simulationResult: null })
  }
}))
