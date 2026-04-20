import type { NodeProps } from 'reactflow'
import { Handle, Position } from 'reactflow'
import NodeShell from './NodeShell'
import type { StartNodeData } from '../../types/workflow'
import { useNodeIssues } from '../../hooks/useNodeIssues'

const StartNode = ({ id, data, selected }: NodeProps<StartNodeData>) => {
  const issues = useNodeIssues(id)

  return (
    <>
      <NodeShell
        badge="Start"
        title={data.title || 'Start'}
        subtitle="Entry point"
        tone="sky"
        selected={selected}
        issues={issues}
        metadata={<span className="text-xs text-slate-500">{data.metadata.length} meta</span>}
      />
      <Handle id="out" type="source" position={Position.Right} className="!bg-blue-600" />
    </>
  )
}

export default StartNode
