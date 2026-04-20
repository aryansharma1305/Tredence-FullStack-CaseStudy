import type { NodeProps } from 'reactflow'
import { Handle, Position } from 'reactflow'
import NodeShell from './NodeShell'
import type { AutomatedStepNodeData } from '../../types/workflow'
import { useNodeIssues } from '../../hooks/useNodeIssues'

const AutomatedNode = ({ id, data, selected }: NodeProps<AutomatedStepNodeData>) => {
  const issues = useNodeIssues(id)
  const actionCount = Object.keys(data.actionParams).length

  return (
    <>
      <NodeShell
        badge="Automated"
        title={data.title || 'Automated Step'}
        subtitle={data.actionId || 'Action not selected'}
        icon={<span className="text-base">⚙</span>}
        tone="violet"
        selected={selected}
        issues={issues}
        metadata={<span className="text-xs text-slate-500">{actionCount} params</span>}
      />
      <Handle id="in" type="target" position={Position.Left} className="!bg-violet-500" />
      <Handle id="out" type="source" position={Position.Right} className="!bg-violet-500" />
    </>
  )
}

export default AutomatedNode
