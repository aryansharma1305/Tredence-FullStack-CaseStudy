import WorkflowCanvas from './components/canvas/WorkflowCanvas'
import NodeFormPanel from './components/forms/NodeFormPanel'
import SimulatePanel from './components/sandbox/SimulatePanel'
import { useAutomations } from './hooks/useAutomations'
import { useWorkflowValidation } from './hooks/useWorkflowValidation'
import { useWorkflowStore } from './store/workflowStore'

const App = () => {
  const { isLoading, error } = useAutomations()
  useWorkflowValidation()

  const nodes = useWorkflowStore((state) => state.nodes)
  const edges = useWorkflowStore((state) => state.edges)

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
        <header className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-panel">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Tredence Case Study</p>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
              {nodes.length} nodes
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
              {edges.length} edges
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
              {isLoading ? 'Loading automations' : 'Mock API ready'}
            </span>
          </div>
          <h1 className="mt-2 font-heading text-3xl text-slate-900 md:text-4xl">HR Workflow Designer</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
            Build and test onboarding, approvals, and HR automations using a visual canvas.
          </p>
          {error && <p className="mt-2 text-sm font-medium text-rose-600">{error}</p>}
        </header>

        <main className="grid min-h-[calc(100vh-220px)] gap-4 xl:grid-cols-[1fr_360px]">
          <WorkflowCanvas />
          <div className="flex flex-col gap-4">
            <NodeFormPanel />
            <SimulatePanel />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
