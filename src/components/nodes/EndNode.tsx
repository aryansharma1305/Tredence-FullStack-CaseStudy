import type { NodeProps } from 'reactflow'
import { Handle, Position } from 'reactflow'
import NodeShell from './NodeShell'
import type { EndNodeData } from '../../types/workflow'
import { useNodeIssues } from '../../hooks/useNodeIssues'

const EndNode = ({ id, data, selected }: NodeProps<EndNodeData>) => {
  const issues = useNodeIssues(id)

  return (
    <>
      <NodeShell
        badge="End"
        title={data.message || 'End'}
        subtitle={data.summaryFlag ? 'Summary generated' : 'Summary skipped'}
        icon={<span className="text-base">■</span>}
        tone="rose"
        selected={selected}
        issues={issues}
      />
      <Handle id="in" type="target" position={Position.Left} className="!bg-rose-500" />
    </>
  )
}

export default EndNode
