import WorkflowCanvas from './components/canvas/WorkflowCanvas'
import NodeSidebar from './components/canvas/NodeSidebar'
import NodeFormPanel from './components/forms/NodeFormPanel'
import SimulatePanel from './components/sandbox/SimulatePanel'
import { useAutomations } from './hooks/useAutomations'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useWorkflowValidation } from './hooks/useWorkflowValidation'

const App = () => {
  const { isLoading, error } = useAutomations()
  useWorkflowValidation()
  useKeyboardShortcuts()

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f6]">
      <header className="flex h-14 items-center justify-between border-b border-blue-100 bg-white px-5">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white">HR</div>
          <p className="text-xl font-heading text-blue-900">Workflow Builder</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {isLoading ? 'Loading actions' : 'Actions loaded'}
          </span>
          {error && <span className="text-xs font-semibold text-rose-600">{error}</span>}
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_390px]">
        <NodeSidebar />
        <WorkflowCanvas />

        <aside className="flex min-h-0 flex-col border-t border-blue-900/40 bg-[#10213b] text-slate-100 lg:border-l lg:border-t-0">
          <div className="border-b border-white/10 px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Node Settings</p>
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <NodeFormPanel />
            <SimulatePanel />
          </div>
          <div className="border-t border-white/10 px-5 py-4">
            <p className="text-xs text-slate-400">API Explorer</p>
            <p className="mt-1 text-xs text-slate-500">/automations, /simulate</p>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
