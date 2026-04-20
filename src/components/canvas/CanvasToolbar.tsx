import { useRef, useState } from 'react'
import { useWorkflowStore } from '../../store/workflowStore'
import { downloadWorkflow, parseWorkflow, serializeWorkflow } from '../../utils/workflowSerializer'

const CanvasToolbar = () => {
  const nodes = useWorkflowStore((state) => state.nodes)
  const edges = useWorkflowStore((state) => state.edges)
  const undo = useWorkflowStore((state) => state.undo)
  const redo = useWorkflowStore((state) => state.redo)
  const applyAutoLayout = useWorkflowStore((state) => state.applyAutoLayout)
  const importWorkflow = useWorkflowStore((state) => state.importWorkflow)
  const pastCount = useWorkflowStore((state) => state.past.length)
  const futureCount = useWorkflowStore((state) => state.future.length)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="absolute left-4 top-14 z-20 flex flex-col gap-2">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <button
          type="button"
          onClick={undo}
          disabled={pastCount === 0}
          className="rounded-md px-2 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={futureCount === 0}
          className="rounded-md px-2 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ↷
        </button>
        <button
          type="button"
          onClick={applyAutoLayout}
          className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Auto Layout
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <button
          type="button"
          onClick={() => downloadWorkflow(serializeWorkflow(nodes, edges))}
          className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Import JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0]

            if (!file) {
              return
            }

            try {
              const content = await file.text()
              importWorkflow(parseWorkflow(content))
              setImportError(null)
            } catch (error) {
              setImportError(error instanceof Error ? error.message : 'Failed to import workflow')
            }
          }}
        />
      </div>

      {importError && <p className="max-w-xs rounded-lg bg-rose-100 px-3 py-2 text-xs font-medium text-rose-700">{importError}</p>}
    </div>
  )
}

export default CanvasToolbar
