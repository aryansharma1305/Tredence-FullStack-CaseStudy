import type { Edge, Node, XYPosition } from 'reactflow'

export type WorkflowNodeType = 'start' | 'task' | 'approval' | 'automated' | 'end'

export interface KeyValuePair {
  id: string
  key: string
  value: string
}

export interface StartNodeData {
  title: string
  metadata: KeyValuePair[]
}

export interface TaskNodeData {
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: KeyValuePair[]
}

export interface ApprovalNodeData {
  title: string
  approverRole: string
  autoApproveThreshold: number | ''
}

export interface AutomatedStepNodeData {
  title: string
  actionId: string
  actionParams: Record<string, string>
}

export interface EndNodeData {
  message: string
  summaryFlag: boolean
}

export type WorkflowNodeDataMap = {
  start: StartNodeData
  task: TaskNodeData
  approval: ApprovalNodeData
  automated: AutomatedStepNodeData
  end: EndNodeData
}

export type WorkflowNodeData = WorkflowNodeDataMap[WorkflowNodeType]

export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>

export interface AutomationAction {
  id: string
  label: string
  params: string[]
}

export interface SimulateRequest {
  nodes: WorkflowNode[]
  edges: Edge[]
  forceError?: boolean
}

export type SimulationStatus = 'success' | 'warning' | 'error'

export interface SimulationStep {
  id: string
  nodeId: string
  title: string
  detail: string
  status: SimulationStatus
  timestamp: string
  durationMs?: number
}

export interface SimulateResponse {
  runId: string
  status: 'completed' | 'failed'
  steps: SimulationStep[]
  totalNodes?: number
  executedNodes?: number
  failedNodeId?: string | null
  finalMessage?: string
}

export interface WorkflowGraph {
  nodes: WorkflowNode[]
  edges: Edge[]
}

export interface ValidationIssue {
  id: string
  message: string
  nodeId?: string
  edgeId?: string
}

export type NodeTemplate = {
  type: WorkflowNodeType
  title: string
  subtitle: string
}

export interface CreateNodeInput {
  type: WorkflowNodeType
  position: XYPosition
}
