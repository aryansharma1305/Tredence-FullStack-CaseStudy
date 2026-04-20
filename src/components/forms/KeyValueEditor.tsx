import type { KeyValuePair } from '../../types/workflow'
import { createEmptyPair } from '../../utils/nodeFactory'
import { TextInput } from './FormPrimitives'

interface KeyValueEditorProps {
  label: string
  pairs: KeyValuePair[]
  onChange: (pairs: KeyValuePair[]) => void
}

const KeyValueEditor = ({ label, pairs, onChange }: KeyValueEditorProps) => {
  return (
    <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/70 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
        <button
          type="button"
          onClick={() => onChange([...pairs, createEmptyPair()])}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Add
        </button>
      </div>
      {pairs.length === 0 && <p className="text-xs text-slate-500">No entries</p>}
      {pairs.map((pair) => (
        <div key={pair.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <TextInput
            value={pair.key}
            onChange={(event) =>
              onChange(
                pairs.map((entry) =>
                  entry.id === pair.id
                    ? {
                        ...entry,
                        key: event.target.value
                      }
                    : entry
                )
              )
            }
            placeholder="Key"
          />
          <TextInput
            value={pair.value}
            onChange={(event) =>
              onChange(
                pairs.map((entry) =>
                  entry.id === pair.id
                    ? {
                        ...entry,
                        value: event.target.value
                      }
                    : entry
                )
              )
            }
            placeholder="Value"
          />
          <button
            type="button"
            onClick={() => onChange(pairs.filter((entry) => entry.id !== pair.id))}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

export default KeyValueEditor
