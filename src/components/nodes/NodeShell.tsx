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
  sky: 'border-l-4 border-l-sky-500',
  emerald: 'border-l-4 border-l-emerald-500',
  amber: 'border-l-4 border-l-amber-500',
  violet: 'border-l-4 border-l-violet-500',
  rose: 'border-l-4 border-l-rose-500'
}

const badgeStyles = {
  sky: 'border-sky-200 bg-sky-100 text-sky-700',
  emerald: 'border-emerald-200 bg-emerald-100 text-emerald-700',
  amber: 'border-amber-200 bg-amber-100 text-amber-700',
  violet: 'border-violet-200 bg-violet-100 text-violet-700',
  rose: 'border-rose-200 bg-rose-100 text-rose-700'
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
        'min-w-[220px] max-w-[260px] rounded-2xl border border-slate-300 bg-white p-3 shadow-sm transition',
        toneStyles[tone],
        selected ? 'ring-2 ring-[#5e6bff]' : '',
        issues.length > 0 && 'border-rose-400'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={clsx('rounded-full border px-2 py-0.5 text-[11px] font-semibold', badgeStyles[tone])}>
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
