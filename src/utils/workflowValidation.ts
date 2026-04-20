import type { Edge } from 'reactflow'
import {
  approvalNodeSchema,
  automatedStepNodeSchema,
  endNodeSchema,
  startNodeSchema,
  taskNodeSchema
} from '../types/nodeSchemas'
import type {
  ValidationIssue,
  WorkflowNode
} from '../types/workflow'

const createIssue = (message: string, nodeId?: string, edgeId?: string): ValidationIssue => ({
  id: crypto.randomUUID().slice(0, 10),
  message,
  nodeId,
  edgeId
})

const validateNodeData = (node: WorkflowNode): ValidationIssue[] => {
  if (node.type === 'start') {
    const result = startNodeSchema.safeParse(node.data)

    if (!result.success) {
      return result.error.issues.map((issue) => createIssue(issue.message, node.id))
    }

    return []
  }

  if (node.type === 'task') {
    const result = taskNodeSchema.safeParse(node.data)

    if (!result.success) {
      return result.error.issues.map((issue) => createIssue(issue.message, node.id))
    }

    return []
  }

  if (node.type === 'approval') {
    const result = approvalNodeSchema.safeParse(node.data)

    if (!result.success) {
      return result.error.issues.map((issue) => createIssue(issue.message, node.id))
    }

    return []
  }

  if (node.type === 'automated') {
    const result = automatedStepNodeSchema.safeParse(node.data)

    if (!result.success) {
      return result.error.issues.map((issue) => createIssue(issue.message, node.id))
    }

    const data = result.data
    const missingParam = Object.entries(data.actionParams).find(([, value]) => value.trim().length === 0)

    if (missingParam) {
      return [createIssue(`Action parameter ${missingParam[0]} is required`, node.id)]
    }

    return []
  }

  const result = endNodeSchema.safeParse(node.data)

  if (!result.success) {
    return result.error.issues.map((issue) => createIssue(issue.message, node.id))
  }

  return []
}

const hasCycle = (nodes: WorkflowNode[], edges: Edge[]) => {
  const adjacency = new Map<string, string[]>()
  const nodeIds = nodes.map((node) => node.id)

  nodeIds.forEach((id) => adjacency.set(id, []))

  edges.forEach((edge) => {
    const outgoing = adjacency.get(edge.source)

    if (outgoing) {
      outgoing.push(edge.target)
    }
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

  for (const nodeId of nodeIds) {
    if (dfs(nodeId)) {
      return true
    }
  }

  return false
}

const getReachableNodeIds = (startId: string, edges: Edge[]) => {
  const adjacency = new Map<string, string[]>()

  edges.forEach((edge) => {
    const outgoing = adjacency.get(edge.source) ?? []
    outgoing.push(edge.target)
    adjacency.set(edge.source, outgoing)
  })

  const visited = new Set<string>()
  const queue = [startId]

  while (queue.length > 0) {
    const current = queue.shift() as string

    if (visited.has(current)) {
      continue
    }

    visited.add(current)

    for (const next of adjacency.get(current) ?? []) {
      if (!visited.has(next)) {
        queue.push(next)
      }
    }
  }

  return visited
}

export const validateWorkflow = (nodes: WorkflowNode[], edges: Edge[]): ValidationIssue[] => {
  const issues: ValidationIssue[] = []

  if (nodes.length === 0) {
    issues.push(createIssue('Add at least one node to the workflow'))
    return issues
  }

  const nodeIds = new Set(nodes.map((node) => node.id))
  const incomingCount = new Map<string, number>()
  const outgoingCount = new Map<string, number>()

  nodes.forEach((node) => {
    incomingCount.set(node.id, 0)
    outgoingCount.set(node.id, 0)
  })

  edges.forEach((edge) => {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      issues.push(createIssue('Edge references a missing node', undefined, edge.id))
      return
    }

    incomingCount.set(edge.target, (incomingCount.get(edge.target) ?? 0) + 1)
    outgoingCount.set(edge.source, (outgoingCount.get(edge.source) ?? 0) + 1)
  })

  const starts = nodes.filter((node) => node.type === 'start')
  const ends = nodes.filter((node) => node.type === 'end')

  if (starts.length !== 1) {
    issues.push(createIssue('Workflow must contain exactly one Start node'))
  }

  if (ends.length < 1) {
    issues.push(createIssue('Workflow must contain at least one End node'))
  }

  nodes.forEach((node) => {
    const incoming = incomingCount.get(node.id) ?? 0
    const outgoing = outgoingCount.get(node.id) ?? 0

    if (node.type === 'start' && incoming > 0) {
      issues.push(createIssue('Start node must not have incoming edges', node.id))
    }

    if (node.type !== 'start' && incoming === 0) {
      issues.push(createIssue('Node is missing an incoming connection', node.id))
    }

    if (node.type === 'end' && outgoing > 0) {
      issues.push(createIssue('End node must not have outgoing edges', node.id))
    }

    if (node.type !== 'end' && outgoing === 0) {
      issues.push(createIssue('Node is missing an outgoing connection', node.id))
    }

    issues.push(...validateNodeData(node))
  })

  if (starts.length === 1) {
    const reachable = getReachableNodeIds(starts[0].id, edges)

    nodes.forEach((node) => {
      if (!reachable.has(node.id)) {
        issues.push(createIssue('Node is not reachable from the Start node', node.id))
      }
    })
  }

  if (hasCycle(nodes, edges)) {
    issues.push(createIssue('Workflow graph contains a cycle'))
  }

  const deduped = new Map<string, ValidationIssue>()

  issues.forEach((issue) => {
    const key = `${issue.message}:${issue.nodeId ?? ''}:${issue.edgeId ?? ''}`

    if (!deduped.has(key)) {
      deduped.set(key, issue)
    }
  })

  return Array.from(deduped.values())
}
