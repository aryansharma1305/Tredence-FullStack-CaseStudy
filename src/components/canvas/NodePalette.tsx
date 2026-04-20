import clsx from 'clsx'
import { nodeTemplates } from '../../utils/nodeFactory'
import { useWorkflowStore } from '../../store/workflowStore'

const tones: Record<string, string> = {
  start: 'border-sky-300 bg-sky-50 text-sky-800',
  task: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  approval: 'border-amber-300 bg-amber-50 text-amber-800',
  automated: 'border-violet-300 bg-violet-50 text-violet-800',
  end: 'border-rose-300 bg-rose-50 text-rose-800'
}

const NodePalette = () => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId)
  const selectedEdgeId = useWorkflowStore((state) => state.selectedEdgeId)
  const deleteSelected = useWorkflowStore((state) => state.deleteSelected)

  return (
    <aside className="absolute left-3 top-3 z-20 w-64 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-panel backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Node Library</p>
      <div className="mt-2 space-y-2">
        {nodeTemplates.map((template) => (
          <button
            key={template.type}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', template.type)
              event.dataTransfer.effectAllowed = 'move'
            }}
            className={clsx(
              'w-full rounded-lg border px-3 py-2 text-left transition hover:translate-x-1 hover:shadow-sm',
              tones[template.type]
            )}
          >
            <p className="text-sm font-semibold">{template.title}</p>
            <p className="text-xs opacity-80">{template.subtitle}</p>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={deleteSelected}
        disabled={!selectedNodeId && !selectedEdgeId}
        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Delete selected
      </button>
    </aside>
  )
}

export default NodePalette
