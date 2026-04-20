import clsx from 'clsx'
import { useMemo } from 'react'
import { useWorkflowStore } from '../../store/workflowStore'
import { nodeTemplates } from '../../utils/nodeFactory'
import { buildLeaveApprovalTemplate, buildOnboardingTemplate } from '../../constants/workflowTemplates'

const tones: Record<string, string> = {
  start: 'border-emerald-300 text-emerald-700',
  task: 'border-slate-300 text-slate-800',
  approval: 'border-amber-400 text-amber-700',
  automated: 'border-sky-400 border-dashed text-sky-700',
  end: 'border-rose-400 text-rose-700'
}

const icons: Record<string, string> = {
  start: '▶',
  task: '☑',
  approval: '⚑',
  automated: '⚡',
  end: '■'
}

const NodeSidebar = () => {
  const nodes = useWorkflowStore((state) => state.nodes)
  const importWorkflow = useWorkflowStore((state) => state.importWorkflow)

  const hasStartNode = useMemo(() => nodes.some((node) => node.type === 'start'), [nodes])

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-slate-200 bg-[#f7f8fb]">
      <div className="border-b border-slate-200 px-5 py-5">
        <p className="text-xl font-semibold text-slate-800">Toolbox</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Drag onto canvas</p>
      </div>

      <div className="space-y-4 px-5 py-6">
        {nodeTemplates.map((template) => {
          const disabled = template.type === 'start' && hasStartNode

          return (
            <button
              key={template.type}
              type="button"
              draggable={!disabled}
              disabled={disabled}
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', template.type)
                event.dataTransfer.effectAllowed = 'move'
              }}
              className={clsx(
                'flex w-full items-center justify-center gap-2 rounded-2xl border-2 bg-white px-4 py-3 text-base font-semibold transition',
                tones[template.type],
                disabled ? 'cursor-not-allowed opacity-40' : 'hover:shadow-sm'
              )}
            >
              <span className="text-sm">{icons[template.type]}</span>
              <span>{template.title}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-auto border-t border-slate-200 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Quick Templates</p>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => importWorkflow(buildOnboardingTemplate())}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Basic Onboarding
          </button>
          <button
            type="button"
            onClick={() => importWorkflow(buildLeaveApprovalTemplate())}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Leave Approval
          </button>
        </div>
      </div>
    </aside>
  )
}

export default NodeSidebar
