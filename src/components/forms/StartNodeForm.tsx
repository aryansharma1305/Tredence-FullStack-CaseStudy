import type { StartNodeData } from '../../types/workflow'
import { useWorkflowStore } from '../../store/workflowStore'
import { startNodeSchema } from '../../types/nodeSchemas'
import KeyValueEditor from './KeyValueEditor'
import { FormField, TextInput } from './FormPrimitives'

interface StartNodeFormProps {
  nodeId: string
  data: StartNodeData
}

const StartNodeForm = ({ nodeId, data }: StartNodeFormProps) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const validation = startNodeSchema.safeParse(data)
  const errors = validation.success ? {} : validation.error.flatten().fieldErrors

  return (
    <div className="space-y-3">
      <FormField label="Start title" error={errors.title?.[0]}>
        <TextInput
          value={data.title}
          onChange={(event) =>
            updateNodeData(nodeId, (current) => ({
              ...(current as StartNodeData),
              title: event.target.value
            }))
          }
          placeholder="Workflow start"
        />
      </FormField>
      <KeyValueEditor
        label="Metadata"
        pairs={data.metadata}
        onChange={(pairs) =>
          updateNodeData(nodeId, (current) => ({
            ...(current as StartNodeData),
            metadata: pairs
          }))
        }
      />
    </div>
  )
}

export default StartNodeForm
