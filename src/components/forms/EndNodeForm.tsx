import type { EndNodeData } from '../../types/workflow'
import { useWorkflowStore } from '../../store/workflowStore'
import { endNodeSchema } from '../../types/nodeSchemas'
import { FormField, TextInput } from './FormPrimitives'

interface EndNodeFormProps {
  nodeId: string
  data: EndNodeData
}

const EndNodeForm = ({ nodeId, data }: EndNodeFormProps) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const validation = endNodeSchema.safeParse(data)
  const errors = validation.success ? {} : validation.error.flatten().fieldErrors

  return (
    <div className="space-y-3">
      <FormField label="End message" error={errors.message?.[0]}>
        <TextInput
          value={data.message}
          onChange={(event) =>
            updateNodeData(nodeId, (current) => ({
              ...(current as EndNodeData),
              message: event.target.value
            }))
          }
          placeholder="Workflow complete"
        />
      </FormField>
      <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
        <span className="font-medium">Include summary</span>
        <input
          type="checkbox"
          checked={data.summaryFlag}
          onChange={(event) =>
            updateNodeData(nodeId, (current) => ({
              ...(current as EndNodeData),
              summaryFlag: event.target.checked
            }))
          }
          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-300"
        />
      </label>
    </div>
  )
}

export default EndNodeForm
