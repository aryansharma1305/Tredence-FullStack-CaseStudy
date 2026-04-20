import type { Edge } from 'reactflow'
import type {
  CreateNodeInput,
  EndNodeData,
  KeyValuePair,
  NodeTemplate,
  WorkflowGraph,
  WorkflowNode,
  WorkflowNodeDataMap,
  WorkflowNodeType
} from '../types/workflow'

const createId = () => crypto.randomUUID().slice(0, 8)

const createPair = (): KeyValuePair => ({
  id: createId(),
  key: '',
  value: ''
})

const defaultData: WorkflowNodeDataMap = {
  start: {
    title: 'Workflow Start',
    metadata: []
  },
  task: {
    title: 'Task Step',
    description: '',
    assignee: '',
    dueDate: '',
    customFields: []
  },
  approval: {
    title: 'Approval Step',
    approverRole: 'Manager',
    autoApproveThreshold: ''
  },
  automated: {
    title: 'Automated Step',
    actionId: '',
    actionParams: {}
  },
  end: {
    message: 'Workflow completed',
    summaryFlag: true
  }
}

export const nodeTemplates: NodeTemplate[] = [
  { type: 'start', title: 'Start', subtitle: 'Workflow entry point' },
  { type: 'task', title: 'Task', subtitle: 'Manual HR step' },
  { type: 'approval', title: 'Approval', subtitle: 'Role-based sign-off' },
  { type: 'automated', title: 'Automated Step', subtitle: 'System-triggered action' },
  { type: 'end', title: 'End', subtitle: 'Workflow completion' }
]

export const createNode = ({ type, position }: CreateNodeInput): WorkflowNode => {
  const id = `${type}-${createId()}`
  const data = structuredClone(defaultData[type])

  return {
    id,
    type,
    position,
    data
  }
}

export const createInitialGraph = (): WorkflowGraph => {
  const startNode = createNode({
    type: 'start',
    position: { x: 180, y: 160 }
  })

  const endNode = createNode({
    type: 'end',
    position: { x: 620, y: 160 }
  })

  const edges: Edge[] = [
    {
      id: `edge-${createId()}`,
      source: startNode.id,
      target: endNode.id,
      animated: false,
      type: 'smoothstep',
      style: {
        strokeWidth: 2,
        stroke: '#0f172a'
      }
    }
  ]

  return {
    nodes: [startNode, endNode],
    edges
  }
}

export const getNodeDisplayTitle = (node: WorkflowNode): string => {
  if (node.type === 'end') {
    return (node.data as EndNodeData).message
  }

  return (node.data as { title: string }).title
}

export const isWorkflowNodeType = (value: string): value is WorkflowNodeType => {
  return nodeTemplates.some((template) => template.type === value)
}

export const createEmptyPair = createPair
