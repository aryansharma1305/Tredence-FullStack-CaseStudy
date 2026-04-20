import { http, HttpResponse } from 'msw'
import type {
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData,
  SimulateRequest,
  SimulateResponse,
  SimulationStep,
  StartNodeData,
  TaskNodeData,
  WorkflowNode
} from '../types/workflow'

const automations = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'send_slack', label: 'Send Slack Message', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary'] }
]

const now = () => new Date().toISOString()

const getNodeTitle = (node: WorkflowNode) => {
  if (node.type === 'end') {
    return (node.data as EndNodeData).message
  }

  return (node.data as { title: string }).title
}

const getNodeMessage = (node: WorkflowNode) => {
  if (node.type === 'start') {
    const data = node.data as StartNodeData
    return `Workflow initiated with ${data.metadata.length} metadata pairs`
  }

  if (node.type === 'task') {
    const data = node.data as TaskNodeData
    return data.assignee
      ? `Task "${data.title}" assigned to ${data.assignee}`
      : `Task "${data.title}" completed without assignee`
  }

  if (node.type === 'approval') {
    const data = node.data as ApprovalNodeData
    return `Approval by ${data.approverRole} completed`
  }

  if (node.type === 'automated') {
    const data = node.data as AutomatedStepNodeData
    return data.actionId
      ? `Automated action "${data.actionId}" executed`
      : 'Automated step ran with no action selected'
  }

  const data = node.data as EndNodeData
  return data.summaryFlag ? `Workflow completed: ${data.message}` : `Workflow ended: ${data.message}`
}

const hasCycle = (nodes: WorkflowNode[], edges: SimulateRequest['edges']) => {
  const adjacency = new Map<string, string[]>()

  nodes.forEach((node) => adjacency.set(node.id, []))

  edges.forEach((edge) => {
    const sourceNode = nodes.find((node) => node.id === edge.source)

    if (sourceNode?.type === 'end') {
      return
    }

    adjacency.set(edge.source, [...(adjacency.get(edge.source) ?? []), edge.target])
  })

  const visiting = new Set<string>()
  const visited = new Set<string>()

  const dfs = (nodeId: string): boolean => {
    if (visiting.has(nodeId)) {
      return true
    }

    if (visited.has(nodeId)) {
      return false
    }

    visiting.add(nodeId)

    for (const next of adjacency.get(nodeId) ?? []) {
      if (dfs(next)) {
        return true
      }
    }

    visiting.delete(nodeId)
    visited.add(nodeId)

    return false
  }

  for (const node of nodes) {
    if (dfs(node.id)) {
      return true
    }
  }

  return false
}

const buildExecutionOrder = (nodes: WorkflowNode[], edges: SimulateRequest['edges']) => {
  const start = nodes.find((node) => node.type === 'start')

  if (!start) {
    return []
  }

  const nodeMap = new Map(nodes.map((node) => [node.id, node]))
  const outgoing = new Map<string, string[]>()

  nodes.forEach((node) => outgoing.set(node.id, []))

  edges.forEach((edge) => {
    outgoing.set(edge.source, [...(outgoing.get(edge.source) ?? []), edge.target])
  })

  const ordered: WorkflowNode[] = []
  const visited = new Set<string>()
  const queue = [start.id]

  while (queue.length > 0) {
    const current = queue.shift() as string

    if (visited.has(current)) {
      continue
    }

    visited.add(current)
    const node = nodeMap.get(current)

    if (!node) {
      continue
    }

    ordered.push(node)

    for (const target of outgoing.get(current) ?? []) {
      if (!visited.has(target)) {
        queue.push(target)
      }
    }
  }

  return ordered
}

const validatePayload = (nodes: WorkflowNode[], edges: SimulateRequest['edges']) => {
  const starts = nodes.filter((node) => node.type === 'start')
  const ends = nodes.filter((node) => node.type === 'end')

  if (starts.length !== 1) {
    return 'Workflow must contain exactly one Start node.'
  }

  if (ends.length === 0) {
    return 'Workflow must contain at least one End node.'
  }

  const incident = new Map<string, number>()
  nodes.forEach((node) => incident.set(node.id, 0))

  edges.forEach((edge) => {
    incident.set(edge.source, (incident.get(edge.source) ?? 0) + 1)
    incident.set(edge.target, (incident.get(edge.target) ?? 0) + 1)
  })

  const disconnected = nodes.find((node) => (incident.get(node.id) ?? 0) === 0)

  if (disconnected) {
    return `Disconnected node found: ${getNodeTitle(disconnected)}`
  }

  if (hasCycle(nodes, edges)) {
    return 'Execution halted: cyclical path detected.'
  }

  return null
}

const createFailure = (message: string): SimulateResponse => ({
  runId: `run-${crypto.randomUUID().slice(0, 8)}`,
  status: 'failed',
  totalNodes: 0,
  executedNodes: 0,
  failedNodeId: null,
  finalMessage: message,
  steps: []
})

const createSteps = (ordered: WorkflowNode[], forceError?: boolean) => {
  const steps: SimulationStep[] = []

  for (let index = 0; index < ordered.length; index += 1) {
    const node = ordered[index]
    const shouldFail = Boolean(forceError) && node.type !== 'start' && index >= 1

    steps.push({
      id: `step-${index + 1}`,
      nodeId: node.id,
      title: getNodeTitle(node),
      detail: shouldFail ? 'Mock API failure triggered for this step' : getNodeMessage(node),
      status: shouldFail ? 'error' : 'success',
      timestamp: now(),
      durationMs: Math.floor(110 + Math.random() * 240)
    })

    if (shouldFail) {
      break
    }
  }

  return steps
}

export const handlers = [
  http.get('/automations', () => {
    return HttpResponse.json(automations)
  }),

  http.post('/simulate', async ({ request }) => {
    const body = (await request.json()) as SimulateRequest

    if (!body || !Array.isArray(body.nodes) || !Array.isArray(body.edges)) {
      return HttpResponse.json(createFailure('Invalid payload: nodes and edges are required.'), { status: 400 })
    }

    const error = validatePayload(body.nodes, body.edges)

    if (error) {
      return HttpResponse.json(createFailure(error), { status: 400 })
    }

    const ordered = buildExecutionOrder(body.nodes, body.edges)

    if (ordered.length === 0) {
      return HttpResponse.json(createFailure('No executable path found from Start node.'), { status: 400 })
    }

    const steps = createSteps(ordered, body.forceError)
    const failed = steps.find((step) => step.status === 'error')

    return HttpResponse.json({
      runId: `run-${crypto.randomUUID().slice(0, 8)}`,
      status: failed ? 'failed' : 'completed',
      totalNodes: body.nodes.length,
      executedNodes: steps.length,
      failedNodeId: failed?.nodeId ?? null,
      finalMessage: failed ? 'Simulation stopped due to a forced API failure.' : 'Workflow completed successfully.',
      steps
    })
  })
]
