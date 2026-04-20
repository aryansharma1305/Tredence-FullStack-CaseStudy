import { useWorkflowStore } from '../../store/workflowStore'
import { FormField, TextInput } from './FormPrimitives'

interface EdgeFormProps {
  edgeId: string
  label: string
}

const EdgeForm = ({ edgeId, label }: EdgeFormProps) => {
  const updateEdgeLabel = useWorkflowStore((state) => state.updateEdgeLabel)

  return (
    <div className="space-y-3">
      <FormField label="Edge label">
        <TextInput
          value={label}
          onChange={(event) => updateEdgeLabel(edgeId, event.target.value)}
          placeholder="Optional transition label"
        />
      </FormField>
      <p className="text-xs text-slate-500">Use edge labels to explain branch conditions or transitions.</p>
    </div>
  )
}

export default EdgeForm
