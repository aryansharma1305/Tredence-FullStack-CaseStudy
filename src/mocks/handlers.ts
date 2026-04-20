import { http, HttpResponse } from 'msw'
import type {
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData,
  SimulateRequest,
  SimulationStep,
  StartNodeData,
  TaskNodeData,
  WorkflowNode
} from '../types/workflow'

const automations = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'create_ticket', label: 'Create IT Ticket', params: ['team', 'priority'] },
  { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] }
]

const getNodeTitle = (node: WorkflowNode) => {
  if (node.type === 'end') {
    return (node.data as EndNodeData).message
  }

  return (node.data as { title: string }).title
}

const getNodeDetail = (node: WorkflowNode) => {
  if (node.type === 'start') {
    const data = node.data as StartNodeData
    return `Workflow starts with ${data.metadata.length} metadata fields`
  }

  if (node.type === 'task') {
    const data = node.data as TaskNodeData
    return data.assignee ? `Assigned to ${data.assignee}` : 'Task ready for assignment'
  }

  if (node.type === 'approval') {
    const data = node.data as ApprovalNodeData
    return `Approval route: ${data.approverRole}`
  }

  if (node.type === 'automated') {
    const data = node.data as AutomatedStepNodeData
    return data.actionId ? `Action ${data.actionId} queued` : 'No action configured'
  }

  const data = node.data as EndNodeData
  return data.summaryFlag ? 'Summary will be generated' : 'Workflow will close without summary'
}

const resolveExecutionPath = (nodes: WorkflowNode[], edges: SimulateRequest['edges']) => {
  const startNode = nodes.find((node) => node.type === 'start')

  if (!startNode) {
    return []
  }

  const nodeMap = new Map(nodes.map((node) => [node.id, node]))
  const outgoingMap = new Map<string, string[]>()

  edges.forEach((edge) => {
    const list = outgoingMap.get(edge.source) ?? []
    list.push(edge.target)
    outgoingMap.set(edge.source, list)
  })

  const queue = [startNode.id]
  const visited = new Set<string>()
  const ordered: WorkflowNode[] = []

  while (queue.length > 0) {
    const currentId = queue.shift() as string

    if (visited.has(currentId)) {
      continue
    }

    visited.add(currentId)
    const node = nodeMap.get(currentId)

    if (!node) {
      continue
    }

    ordered.push(node)

    const targets = outgoingMap.get(currentId) ?? []

    targets.forEach((target) => {
      if (!visited.has(target)) {
        queue.push(target)
      }
    })
  }

  return ordered
}

const createSteps = (nodes: WorkflowNode[]): SimulationStep[] => {
  return nodes.map((node, index) => ({
    id: `step-${index + 1}`,
    nodeId: node.id,
    title: getNodeTitle(node),
    detail: getNodeDetail(node),
    status: node.type === 'automated' && !(node.data as AutomatedStepNodeData).actionId ? 'warning' : 'success',
    timestamp: new Date(Date.now() + index * 2400).toISOString()
  }))
}

export const handlers = [
  http.get('/api/automations', () => {
    return HttpResponse.json(automations)
  }),

  http.post('/api/simulate', async ({ request }) => {
    const body = (await request.json()) as SimulateRequest
    const path = resolveExecutionPath(body.nodes, body.edges)

    if (path.length === 0) {
      return HttpResponse.json(
        {
          runId: `run-${crypto.randomUUID().slice(0, 8)}`,
          status: 'failed',
          steps: [
            {
              id: 'step-1',
              nodeId: 'missing-start',
              title: 'Validation failed',
              detail: 'No Start node available for simulation',
              status: 'error',
              timestamp: new Date().toISOString()
            }
          ]
        },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      runId: `run-${crypto.randomUUID().slice(0, 8)}`,
      status: 'completed',
      steps: createSteps(path)
    })
  })
]
