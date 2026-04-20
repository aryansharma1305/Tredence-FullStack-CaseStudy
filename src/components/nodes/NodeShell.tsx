import clsx from 'clsx'
import type { ReactNode } from 'react'

interface NodeShellProps {
  badge: string
  title: string
  subtitle?: string
  icon?: ReactNode
  tone: 'sky' | 'emerald' | 'amber' | 'violet' | 'rose'
  selected?: boolean
  issues: string[]
  metadata?: ReactNode
  children?: ReactNode
}

const toneStyles = {
  sky: 'border-l-4 border-l-blue-600',
  emerald: 'border-l-4 border-l-blue-500',
  amber: 'border-l-4 border-l-blue-400',
  violet: 'border-l-4 border-l-blue-300',
  rose: 'border-l-4 border-l-blue-700'
}

const badgeStyles = {
  sky: 'border-blue-200 bg-blue-100 text-blue-700',
  emerald: 'border-blue-200 bg-blue-50 text-blue-700',
  amber: 'border-blue-200 bg-blue-50 text-blue-600',
  violet: 'border-blue-200 bg-blue-50 text-blue-600',
  rose: 'border-blue-200 bg-blue-100 text-blue-800'
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
        {icon && <div className="mt-0.5 text-slate-700">{icon}</div>}
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
