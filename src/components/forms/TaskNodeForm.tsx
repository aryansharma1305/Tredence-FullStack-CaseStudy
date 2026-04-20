import type { TaskNodeData } from '../../types/workflow'
import { useWorkflowStore } from '../../store/workflowStore'
import { taskNodeSchema } from '../../types/nodeSchemas'
import KeyValueEditor from './KeyValueEditor'
import { FormField, TextAreaInput, TextInput } from './FormPrimitives'

interface TaskNodeFormProps {
  nodeId: string
  data: TaskNodeData
}

const TaskNodeForm = ({ nodeId, data }: TaskNodeFormProps) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const validation = taskNodeSchema.safeParse(data)
  const errors = validation.success ? {} : validation.error.flatten().fieldErrors

  return (
    <div className="space-y-3">
      <FormField label="Title" error={errors.title?.[0]}>
        <TextInput
          value={data.title}
          onChange={(event) =>
            updateNodeData(nodeId, (current) => ({
              ...(current as TaskNodeData),
              title: event.target.value
            }))
          }
          placeholder="Collect documents"
        />
      </FormField>
      <FormField label="Description" error={errors.description?.[0]}>
        <TextAreaInput
          value={data.description}
          onChange={(event) =>
            updateNodeData(nodeId, (current) => ({
              ...(current as TaskNodeData),
              description: event.target.value
            }))
          }
          rows={3}
          placeholder="Share details for this task"
        />
      </FormField>
      <FormField label="Assignee" error={errors.assignee?.[0]}>
        <TextInput
          value={data.assignee}
          onChange={(event) =>
            updateNodeData(nodeId, (current) => ({
              ...(current as TaskNodeData),
              assignee: event.target.value
            }))
          }
          placeholder="HR Ops"
        />
      </FormField>
      <FormField label="Due date" error={errors.dueDate?.[0]}>
        <TextInput
          type="date"
          value={data.dueDate}
          onChange={(event) =>
            updateNodeData(nodeId, (current) => ({
              ...(current as TaskNodeData),
              dueDate: event.target.value
            }))
          }
        />
      </FormField>
      <KeyValueEditor
        label="Custom fields"
        pairs={data.customFields}
        onChange={(pairs) =>
          updateNodeData(nodeId, (current) => ({
            ...(current as TaskNodeData),
            customFields: pairs
          }))
        }
      />
    </div>
  )
}

export default TaskNodeForm
