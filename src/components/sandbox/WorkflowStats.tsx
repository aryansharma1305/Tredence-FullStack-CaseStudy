import { useMemo } from 'react'
import type { Edge } from 'reactflow'
import type { WorkflowNode, WorkflowNodeType } from '../../types/workflow'

interface WorkflowStatsProps {
  nodes: WorkflowNode[]
  edges: Edge[]
}

const durationMap: Record<WorkflowNodeType, number> = {
  start: 0,
  task: 30,
  approval: 60,
  automated: 5,
  end: 0
}

const WorkflowStats = ({ nodes, edges }: WorkflowStatsProps) => {
  const stats = useMemo(() => {
    const byType = nodes.reduce(
      (acc, node) => {
        const nodeType = node.type as WorkflowNodeType
        acc[nodeType] += 1
        return acc
      },
      {
        start: 0,
        task: 0,
        approval: 0,
        automated: 0,
        end: 0
      }
    )

    const estimatedMinutes = nodes.reduce((sum, node) => {
      const nodeType = node.type as WorkflowNodeType
      return sum + durationMap[nodeType]
    }, 0)

    const complexity = nodes.length < 5 ? 'Simple' : nodes.length <= 10 ? 'Medium' : 'Complex'

    return {
      byType,
      estimatedMinutes,
      complexity
    }
  }, [nodes])

  return (
    <div className="rounded-lg border border-blue-400/25 bg-blue-500/10 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-200">Workflow Stats</p>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-200">
        <p>Total nodes: {nodes.length}</p>
        <p>Total edges: {edges.length}</p>
        <p>Est. duration: {stats.estimatedMinutes} min</p>
        <p>Complexity: {stats.complexity}</p>
      </div>
      <p className="mt-2 text-[11px] text-slate-300">
        Start {stats.byType.start} • Task {stats.byType.task} • Approval {stats.byType.approval} • Automated{' '}
        {stats.byType.automated} • End {stats.byType.end}
      </p>
    </div>
  )
}

export default WorkflowStats
