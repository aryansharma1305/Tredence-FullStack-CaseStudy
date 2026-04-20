import clsx from 'clsx'
import { useMemo } from 'react'
import { useWorkflowStore } from '../../store/workflowStore'
import { nodeTemplates } from '../../utils/nodeFactory'
import { buildLeaveApprovalTemplate, buildOnboardingTemplate } from '../../constants/workflowTemplates'

const tones: Record<string, string> = {
  start: 'border-blue-500 text-blue-700',
  task: 'border-blue-400 text-blue-700',
  approval: 'border-blue-400 text-blue-700',
  automated: 'border-blue-300 border-dashed text-blue-700',
  end: 'border-blue-600 text-blue-800'
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
