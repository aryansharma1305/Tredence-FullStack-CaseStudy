import clsx from 'clsx'
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

interface FormFieldProps {
  label: string
  error?: string
  children: ReactNode
}

export const FormField = ({ label, error, children }: FormFieldProps) => {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</span>
      {children}
      {error && <p className="text-xs font-medium text-rose-300">{error}</p>}
    </label>
  )
}

export const TextInput = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className={clsx(
        'w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#6b7bff] focus:ring-2 focus:ring-[#6b7bff]/25',
        className
      )}
    />
  )
}

export const TextAreaInput = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      {...props}
      className={clsx(
        'w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#6b7bff] focus:ring-2 focus:ring-[#6b7bff]/25',
        className
      )}
    />
  )
}

export const selectInputClass =
  'w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-[#6b7bff] focus:ring-2 focus:ring-[#6b7bff]/25'
