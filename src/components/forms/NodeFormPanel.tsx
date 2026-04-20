import type {
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData,
  StartNodeData,
  TaskNodeData,
  WorkflowNodeType
} from '../../types/workflow'
import { useWorkflowStore } from '../../store/workflowStore'
import ApprovalNodeForm from './ApprovalNodeForm'
import AutomatedNodeForm from './AutomatedNodeForm'
import EdgeForm from './EdgeForm'
import EndNodeForm from './EndNodeForm'
import StartNodeForm from './StartNodeForm'
import TaskNodeForm from './TaskNodeForm'

const typeLabels: Record<WorkflowNodeType, string> = {
  start: 'Start Node',
  task: 'Task Node',
  approval: 'Approval Node',
  automated: 'Automated Step Node',
  end: 'End Node'
}

const NodeFormPanel = () => {
  const nodes = useWorkflowStore((state) => state.nodes)
  const edges = useWorkflowStore((state) => state.edges)
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId)
  const selectedEdgeId = useWorkflowStore((state) => state.selectedEdgeId)
  const deleteSelected = useWorkflowStore((state) => state.deleteSelected)

  const selectedNode = nodes.find((node) => node.id === selectedNodeId)
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId)
  const selectedNodeType = selectedNode?.type as WorkflowNodeType | undefined

  return (
    <section className="animate-fade-up rounded-xl border border-white/10 bg-[#1f2330] p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg text-slate-100">Node Configuration</h2>
        {(selectedNode || selectedEdge) && (
          <button
            type="button"
            onClick={deleteSelected}
            className="rounded-md border border-white/20 px-2.5 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Delete
          </button>
        )}
      </div>

      {!selectedNode && !selectedEdge && (
        <p className="mt-3 rounded-lg border border-dashed border-white/20 bg-white/5 px-3 py-4 text-sm text-slate-400">
          Select a node or edge on the canvas to edit settings.
        </p>
      )}

      {selectedEdge && !selectedNode && (
        <div className="mt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Selected Edge</p>
          <EdgeForm edgeId={selectedEdge.id} label={String(selectedEdge.label ?? '')} />
        </div>
      )}

      {selectedNode && (
        <div className="mt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {selectedNodeType ? typeLabels[selectedNodeType] : 'Node'}
          </p>
          {selectedNodeType === 'start' && (
            <StartNodeForm nodeId={selectedNode.id} data={selectedNode.data as StartNodeData} />
          )}
          {selectedNodeType === 'task' && (
            <TaskNodeForm nodeId={selectedNode.id} data={selectedNode.data as TaskNodeData} />
          )}
          {selectedNodeType === 'approval' && (
            <ApprovalNodeForm nodeId={selectedNode.id} data={selectedNode.data as ApprovalNodeData} />
          )}
          {selectedNodeType === 'automated' && (
            <AutomatedNodeForm nodeId={selectedNode.id} data={selectedNode.data as AutomatedStepNodeData} />
          )}
          {selectedNodeType === 'end' && (
            <EndNodeForm nodeId={selectedNode.id} data={selectedNode.data as EndNodeData} />
          )}
        </div>
      )}
    </section>
  )
}

export default NodeFormPanel
