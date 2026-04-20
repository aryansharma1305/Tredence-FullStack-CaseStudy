import { useEffect } from 'react'
import { useWorkflowStore } from '../store/workflowStore'
import { validateWorkflow } from '../utils/workflowValidation'

export const useWorkflowValidation = () => {
  const nodes = useWorkflowStore((state) => state.nodes)
  const edges = useWorkflowStore((state) => state.edges)
  const setValidationIssues = useWorkflowStore((state) => state.setValidationIssues)

  useEffect(() => {
    setValidationIssues(validateWorkflow(nodes, edges))
  }, [nodes, edges, setValidationIssues])
}
