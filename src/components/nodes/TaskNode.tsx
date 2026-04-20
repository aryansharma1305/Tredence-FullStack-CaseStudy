import type { NodeProps } from 'reactflow'
import { Handle, Position } from 'reactflow'
import NodeShell from './NodeShell'
import type { TaskNodeData } from '../../types/workflow'
import { useNodeIssues } from '../../hooks/useNodeIssues'

const TaskNode = ({ id, data, selected }: NodeProps<TaskNodeData>) => {
  const issues = useNodeIssues(id)

  return (
    <>
      <NodeShell
        badge="Task"
        title={data.title || 'Task'}
        subtitle={data.description || 'Human task'}
        icon={<span className="text-base">☑</span>}
        tone="emerald"
        selected={selected}
        issues={issues}
        metadata={<span className="text-xs text-slate-500">{data.assignee || 'Unassigned'}</span>}
      >
        {data.dueDate && <p className="mt-2 text-[11px] font-medium text-slate-500">Due {data.dueDate}</p>}
      </NodeShell>
      <Handle id="in" type="target" position={Position.Left} className="!bg-emerald-500" />
      <Handle id="out" type="source" position={Position.Right} className="!bg-emerald-500" />
    </>
  )
}

export default TaskNode
