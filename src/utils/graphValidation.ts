import type { Edge } from 'reactflow'
import type { WorkflowNode } from '../types/workflow'

/**
 * Returns true when the workflow has at least one Start node.
 */
export const hasStartNode = (nodes: WorkflowNode[]): boolean => {
  return nodes.some((node) => node.type === 'start')
}

/**
 * Returns true when the workflow has at least one End node.
 */
export const hasEndNode = (nodes: WorkflowNode[]): boolean => {
  return nodes.some((node) => node.type === 'end')
}

/**
 * Returns node ids that have no incoming and no outgoing edges.
 */
export const hasDisconnectedNodes = (nodes: WorkflowNode[], edges: Edge[]): string[] => {
  const incidentCount = new Map<string, number>()

  nodes.forEach((node) => {
    incidentCount.set(node.id, 0)
  })

  edges.forEach((edge) => {
    incidentCount.set(edge.source, (incidentCount.get(edge.source) ?? 0) + 1)
    incidentCount.set(edge.target, (incidentCount.get(edge.target) ?? 0) + 1)
  })

  return nodes.filter((node) => (incidentCount.get(node.id) ?? 0) === 0).map((node) => node.id)
}

/**
 * Returns true when a cycle exists in the graph.
 */
export const hasCycles = (nodes: WorkflowNode[], edges: Edge[]): boolean => {
  const adjacency = new Map<string, string[]>()

  nodes.forEach((node) => adjacency.set(node.id, []))

  edges.forEach((edge) => {
    const list = adjacency.get(edge.source)

    if (list) {
      list.push(edge.target)
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

  for (const node of nodes) {
    if (dfs(node.id)) {
      return true
    }
  }

  return false
}

/**
 * Validates high-level graph constraints for simulation.
 */
export const validateWorkflow = (
  nodes: WorkflowNode[],
  edges: Edge[]
): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  const startCount = nodes.filter((node) => node.type === 'start').length

  if (startCount === 0) {
    errors.push('No Start node found')
  }

  if (startCount > 1) {
    errors.push('Only one Start node allowed')
  }

  if (!hasEndNode(nodes)) {
    errors.push('No End node found')
  }

  const disconnected = hasDisconnectedNodes(nodes, edges)

  if (disconnected.length > 0) {
    errors.push('Disconnected nodes found')
  }

  if (hasCycles(nodes, edges)) {
    errors.push('Cycle detected in workflow graph')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
