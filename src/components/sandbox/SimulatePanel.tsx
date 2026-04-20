import clsx from 'clsx'
import { useState } from 'react'
import { useWorkflowStore } from '../../store/workflowStore'
import { useSimulate } from '../../hooks/useSimulate'

const statusStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  error: 'border-rose-200 bg-rose-50 text-rose-700'
}

const SimulatePanel = () => {
  const simulationResult = useWorkflowStore((state) => state.simulationResult)
  const isSimulating = useWorkflowStore((state) => state.isSimulating)
  const validationIssues = useWorkflowStore((state) => state.validationIssues)
  const { runSimulation, workflowJson } = useSimulate()
  const [copied, setCopied] = useState(false)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-panel">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-lg text-slate-900">Sandbox</h2>
        <span
          className={clsx(
            'rounded-full px-2 py-0.5 text-xs font-semibold',
            validationIssues.length === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          )}
        >
          {validationIssues.length === 0 ? 'Ready' : `${validationIssues.length} issues`}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            void runSimulation()
          }}
          disabled={isSimulating}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSimulating ? 'Running...' : 'Run Workflow'}
        </button>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(workflowJson)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1500)
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {copied ? 'Copied JSON' : 'Export JSON'}
        </button>
      </div>

      {validationIssues.length > 0 && (
        <div className="mt-3 space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-3">
          {validationIssues.slice(0, 4).map((issue) => (
            <p key={issue.id} className="text-xs text-amber-800">
              {issue.message}
            </p>
          ))}
          {validationIssues.length > 4 && (
            <p className="text-xs font-medium text-amber-800">+{validationIssues.length - 4} more</p>
          )}
        </div>
      )}

      <div className="mt-3 space-y-2">
        {simulationResult?.steps.length ? (
          simulationResult.steps.map((step, index) => (
            <div
              key={step.id}
              className={clsx('rounded-lg border px-3 py-2 text-sm', statusStyles[step.status])}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">
                  {index + 1}. {step.title}
                </p>
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">{step.status}</span>
              </div>
              <p className="mt-1 text-xs opacity-90">{step.detail}</p>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-500">
            Run the workflow to view an execution timeline.
          </div>
        )}
      </div>
    </section>
  )
}

export default SimulatePanel
