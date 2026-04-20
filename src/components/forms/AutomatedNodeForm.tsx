import { useMemo } from 'react'
import type { AutomatedStepNodeData } from '../../types/workflow'
import { useWorkflowStore } from '../../store/workflowStore'
import { automatedStepNodeSchema } from '../../types/nodeSchemas'
import { FormField, selectInputClass, TextInput } from './FormPrimitives'

interface AutomatedNodeFormProps {
  nodeId: string
  data: AutomatedStepNodeData
}

const AutomatedNodeForm = ({ nodeId, data }: AutomatedNodeFormProps) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const automations = useWorkflowStore((state) => state.automations)
  const validation = automatedStepNodeSchema.safeParse(data)
  const errors = validation.success ? {} : validation.error.flatten().fieldErrors

  const selectedAction = useMemo(
    () => automations.find((automation) => automation.id === data.actionId),
    [automations, data.actionId]
  )

  return (
    <div className="space-y-3">
      <FormField label="Title" error={errors.title?.[0]}>
        <TextInput
          value={data.title}
          onChange={(event) =>
            updateNodeData(nodeId, (current) => ({
              ...(current as AutomatedStepNodeData),
              title: event.target.value
            }))
          }
          placeholder="Automated action"
        />
      </FormField>
      <FormField label="Action" error={errors.actionId?.[0]}>
        <select
          value={data.actionId}
          onChange={(event) => {
            const nextActionId = event.target.value
            const action = automations.find((automation) => automation.id === nextActionId)
            const nextParams = Object.fromEntries((action?.params ?? []).map((param) => [param, '']))

            updateNodeData(nodeId, (current) => ({
              ...(current as AutomatedStepNodeData),
              actionId: nextActionId,
              actionParams: nextParams
            }))
          }}
          className={selectInputClass}
        >
          <option value="">Select action</option>
          {automations.map((automation) => (
            <option key={automation.id} value={automation.id}>
              {automation.label}
            </option>
          ))}
        </select>
      </FormField>
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-2 rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Action Parameters</p>
          {selectedAction.params.map((param) => (
            <FormField key={param} label={param}>
              <TextInput
                value={data.actionParams[param] ?? ''}
                onChange={(event) =>
                  updateNodeData(nodeId, (current) => ({
                    ...(current as AutomatedStepNodeData),
                    actionParams: {
                      ...(current as AutomatedStepNodeData).actionParams,
                      [param]: event.target.value
                    }
                  }))
                }
              />
            </FormField>
          ))}
        </div>
      )}
    </div>
  )
}

export default AutomatedNodeForm
