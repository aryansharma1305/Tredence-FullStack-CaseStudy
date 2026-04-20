import { create } from 'zustand'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges
} from 'reactflow'
import type {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  XYPosition
} from 'reactflow'
import type {
  AutomationAction,
  SimulateResponse,
  ValidationIssue,
  WorkflowNode,
  WorkflowNodeData,
  WorkflowNodeType
} from '../types/workflow'
import { createInitialGraph, createNode } from '../utils/nodeFactory'

interface WorkflowStore {
  nodes: WorkflowNode[]
  edges: Edge[]
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
  updateNodeData: (
    nodeId: string,
    updater: (current: WorkflowNodeData) => WorkflowNodeData
  ) => void
  setSelectedNodeId: (nodeId: string | null) => void
  setSelectedEdgeId: (edgeId: string | null) => void
  deleteSelected: () => void
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
    stroke: '#0f172a'
  }
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: initialGraph.nodes,
  edges: initialGraph.edges,
  selectedNodeId: null,
  selectedEdgeId: null,
  automations: [],
  validationIssues: [],
  simulationResult: null,
  isSimulating: false,
  addNode: (type, position) => {
    const node = createNode({ type, position })

    set((state) => ({
      nodes: [...state.nodes, node],
      selectedNodeId: node.id,
      selectedEdgeId: null
    }))
  },
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[]
    }))
  },
  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges)
    }))
  },
  onConnect: (connection) => {
    set((state) => ({
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
  deleteSelected: () => {
    set((state) => {
      if (state.selectedNodeId) {
        const nodeId = state.selectedNodeId

        return {
          nodes: state.nodes.filter((node) => node.id !== nodeId),
          edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
          selectedNodeId: null
        }
      }

      if (state.selectedEdgeId) {
        return {
          edges: state.edges.filter((edge) => edge.id !== state.selectedEdgeId),
          selectedEdgeId: null
        }
      }

      return {}
    })
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
