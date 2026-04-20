import { useMemo } from 'react'
import { simulateWorkflow } from '../api/workflowApi'
import { useWorkflowStore } from '../store/workflowStore'
import { validateWorkflow } from '../utils/workflowValidation'

export const useSimulate = () => {
  const nodes = useWorkflowStore((state) => state.nodes)
  const edges = useWorkflowStore((state) => state.edges)
  const setValidationIssues = useWorkflowStore((state) => state.setValidationIssues)
  const setSimulationResult = useWorkflowStore((state) => state.setSimulationResult)
  const setIsSimulating = useWorkflowStore((state) => state.setIsSimulating)

  const workflowJson = useMemo(
    () =>
      JSON.stringify(
        {
          nodes,
          edges
        },
        null,
        2
      ),
    [nodes, edges]
  )

  const runSimulation = async (options?: { forceError?: boolean }) => {
    const issues = validateWorkflow(nodes, edges)
    setValidationIssues(issues)

    if (issues.length > 0) {
      setSimulationResult(null)
      return {
        ok: false as const,
        issues
      }
    }

    setIsSimulating(true)

    try {
      const result = await simulateWorkflow({ nodes, edges, forceError: options?.forceError })
      setSimulationResult(result)

      return {
        ok: true as const,
        issues: []
      }
    } catch (error) {
      setSimulationResult({
        runId: `run-${crypto.randomUUID().slice(0, 8)}`,
        status: 'failed',
        finalMessage: error instanceof Error ? error.message : 'Unknown error',
        steps: [
          {
            id: 'step-error',
            nodeId: 'api',
            title: 'Simulation failed',
            detail: error instanceof Error ? error.message : 'Unknown error',
            status: 'error',
            timestamp: new Date().toISOString()
          }
        ]
      })

      return {
        ok: false as const,
        issues: []
      }
    } finally {
      setIsSimulating(false)
    }
  }

  return {
    runSimulation,
    workflowJson
  }
}
