import type { ApprovalNodeData } from '../../types/workflow'
import { useWorkflowStore } from '../../store/workflowStore'
import { approvalNodeSchema } from '../../types/nodeSchemas'
import { FormField, TextInput } from './FormPrimitives'

interface ApprovalNodeFormProps {
  nodeId: string
  data: ApprovalNodeData
}

const options = ['Manager', 'HRBP', 'Director']

const ApprovalNodeForm = ({ nodeId, data }: ApprovalNodeFormProps) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const validation = approvalNodeSchema.safeParse(data)
  const errors = validation.success ? {} : validation.error.flatten().fieldErrors

  return (
    <div className="space-y-3">
      <FormField label="Title" error={errors.title?.[0]}>
        <TextInput
          value={data.title}
          onChange={(event) =>
            updateNodeData(nodeId, (current) => ({
              ...(current as ApprovalNodeData),
              title: event.target.value
            }))
          }
          placeholder="Manager approval"
        />
      </FormField>
      <FormField label="Approver role" error={errors.approverRole?.[0]}>
        <select
          value={data.approverRole}
          onChange={(event) =>
            updateNodeData(nodeId, (current) => ({
              ...(current as ApprovalNodeData),
              approverRole: event.target.value
            }))
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Auto-approve threshold" error={errors.autoApproveThreshold?.[0]}>
        <TextInput
          type="number"
          min={0}
          value={data.autoApproveThreshold}
          onChange={(event) =>
            updateNodeData(nodeId, (current) => ({
              ...(current as ApprovalNodeData),
              autoApproveThreshold: event.target.value === '' ? '' : Number(event.target.value)
            }))
          }
          placeholder="Leave blank for manual"
        />
      </FormField>
    </div>
  )
}

export default ApprovalNodeForm
