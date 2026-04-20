import type { NodeProps } from 'reactflow'
import { Handle, Position } from 'reactflow'
import NodeShell from './NodeShell'
import type { ApprovalNodeData } from '../../types/workflow'
import { useNodeIssues } from '../../hooks/useNodeIssues'

const ApprovalNode = ({ id, data, selected }: NodeProps<ApprovalNodeData>) => {
  const issues = useNodeIssues(id)

  return (
    <>
      <NodeShell
        badge="Approval"
        title={data.title || 'Approval'}
        subtitle={data.approverRole || 'Role not set'}
        icon={<span className="text-base">✔</span>}
        tone="amber"
        selected={selected}
        issues={issues}
        metadata={
          <span className="text-xs text-slate-500">
            {data.autoApproveThreshold === '' ? 'Manual' : `Auto ${data.autoApproveThreshold}`}
          </span>
        }
      />
      <Handle id="in" type="target" position={Position.Left} className="!bg-amber-500" />
      <Handle id="out" type="source" position={Position.Right} className="!bg-amber-500" />
    </>
  )
}

export default ApprovalNode
