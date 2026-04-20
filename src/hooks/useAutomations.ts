import { useEffect, useState } from 'react'
import { getAutomations } from '../api/workflowApi'
import { useWorkflowStore } from '../store/workflowStore'

export const useAutomations = () => {
  const setAutomations = useWorkflowStore((state) => state.setAutomations)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true)
        const data = await getAutomations()
        setAutomations(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load automation actions')
      } finally {
        setIsLoading(false)
      }
    }

    void run()
  }, [setAutomations])

  return {
    isLoading,
    error
  }
}
