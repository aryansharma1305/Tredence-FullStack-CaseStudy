import clsx from 'clsx'
import type { ReactNode } from 'react'

interface NodeShellProps {
  badge: string
  title: string
  subtitle?: string
  icon: ReactNode
  tone: 'sky' | 'emerald' | 'amber' | 'violet' | 'rose'
  selected?: boolean
  issues: string[]
  metadata?: ReactNode
  children?: ReactNode
}

const toneStyles = {
  sky: 'border-sky-300 bg-sky-50/90 text-sky-900',
  emerald: 'border-emerald-300 bg-emerald-50/90 text-emerald-900',
  amber: 'border-amber-300 bg-amber-50/90 text-amber-900',
  violet: 'border-violet-300 bg-violet-50/90 text-violet-900',
  rose: 'border-rose-300 bg-rose-50/90 text-rose-900'
}

const NodeShell = ({
  badge,
  title,
  subtitle,
  icon,
  tone,
  selected,
  issues,
  metadata,
  children
}: NodeShellProps) => {
  return (
    <div
      className={clsx(
        'min-w-[220px] max-w-[260px] rounded-xl border bg-white p-3 shadow-sm transition',
        selected ? 'border-slate-800 shadow-lg' : 'border-slate-200',
        issues.length > 0 && 'border-rose-500'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={clsx('rounded-full border px-2 py-0.5 text-[11px] font-semibold', toneStyles[tone])}>
          {badge}
        </span>
        {metadata}
      </div>
      <div className="mt-2 flex items-start gap-2">
        <div className="mt-0.5 text-slate-700">{icon}</div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
          {subtitle && <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {children}
      {issues.length > 0 && (
        <div className="mt-2 space-y-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5">
          {issues.slice(0, 2).map((issue) => (
            <p key={issue} className="text-[11px] font-medium text-rose-700">
              {issue}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default NodeShell
