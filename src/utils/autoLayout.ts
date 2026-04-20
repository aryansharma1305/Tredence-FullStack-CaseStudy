import type { Edge } from 'reactflow'
import type { WorkflowNode } from '../types/workflow'

const LAYER_X = 300
const NODE_GAP_Y = 170
const LAYER_START_X = 140
const LAYER_START_Y = 110

const getDepthMap = (nodes: WorkflowNode[], edges: Edge[]) => {
  const incomingCount = new Map<string, number>()
  const outgoing = new Map<string, string[]>()

  nodes.forEach((node) => {
    incomingCount.set(node.id, 0)
    outgoing.set(node.id, [])
  })

  edges.forEach((edge) => {
    incomingCount.set(edge.target, (incomingCount.get(edge.target) ?? 0) + 1)
    outgoing.set(edge.source, [...(outgoing.get(edge.source) ?? []), edge.target])
  })

  const startCandidates = nodes.filter((node) => node.type === 'start').map((node) => node.id)
  const queue = startCandidates.length > 0 ? [...startCandidates] : nodes.map((node) => node.id)

  const depth = new Map<string, number>()

  queue.forEach((id) => depth.set(id, 0))

  while (queue.length > 0) {
    const id = queue.shift() as string
    const currentDepth = depth.get(id) ?? 0

    for (const target of outgoing.get(id) ?? []) {
      const nextDepth = Math.max(depth.get(target) ?? 0, currentDepth + 1)
      const previousIncoming = incomingCount.get(target) ?? 0
      incomingCount.set(target, Math.max(0, previousIncoming - 1))

      if (nextDepth !== depth.get(target)) {
        depth.set(target, nextDepth)
      }

      if (!queue.includes(target) && incomingCount.get(target) === 0) {
        queue.push(target)
      }
    }
  }

  nodes.forEach((node, index) => {
    if (!depth.has(node.id)) {
      depth.set(node.id, index)
    }
  })

  return depth
}

export const layoutWorkflow = (nodes: WorkflowNode[], edges: Edge[]) => {
  const depthMap = getDepthMap(nodes, edges)
  const layerMap = new Map<number, WorkflowNode[]>()

  nodes.forEach((node) => {
    const layer = depthMap.get(node.id) ?? 0
    const list = layerMap.get(layer) ?? []
    list.push(node)
    layerMap.set(layer, list)
  })

  const nextNodes: WorkflowNode[] = []

  Array.from(layerMap.entries())
    .sort(([a], [b]) => a - b)
    .forEach(([layer, layerNodes]) => {
      layerNodes.forEach((node, row) => {
        nextNodes.push({
          ...node,
          position: {
            x: LAYER_START_X + layer * LAYER_X,
            y: LAYER_START_Y + row * NODE_GAP_Y
          }
        })
      })
    })

  return {
    nodes: nextNodes,
    edges
  }
}
