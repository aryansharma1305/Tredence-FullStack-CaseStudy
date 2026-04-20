import type { Edge } from 'reactflow'
import type { WorkflowNode } from '../types/workflow'

export const serializeWorkflow = (nodes: WorkflowNode[], edges: Edge[]) => {
  return JSON.stringify({ nodes, edges }, null, 2)
}

export const downloadWorkflow = (json: string) => {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'workflow.json'
  anchor.click()
  URL.revokeObjectURL(url)
}

export const parseWorkflow = (content: string): { nodes: WorkflowNode[]; edges: Edge[] } => {
  const parsed = JSON.parse(content) as {
    nodes?: WorkflowNode[]
    edges?: Edge[]
  }

  if (!parsed.nodes || !parsed.edges || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
    throw new Error('Invalid workflow JSON format')
  }

  return {
    nodes: parsed.nodes,
    edges: parsed.edges
  }
}
