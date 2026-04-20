import { useMemo } from 'react'
import { useWorkflowStore } from '../store/workflowStore'

export const useNodeIssues = (nodeId: string) => {
  const issues = useWorkflowStore((state) => state.validationIssues)

  return useMemo(
    () => issues.filter((issue) => issue.nodeId === nodeId).map((issue) => issue.message),
    [issues, nodeId]
  )
}
