import type {
  AutomationAction,
  SimulateRequest,
  SimulateResponse
} from '../types/workflow'

const toJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const text = await response.text()

    try {
      const parsed = JSON.parse(text) as { finalMessage?: string; error?: string }
      throw new Error(parsed.finalMessage || parsed.error || 'Request failed')
    } catch {
      throw new Error(text || 'Request failed')
    }
  }

  return (await response.json()) as T
}

export const getAutomations = async (): Promise<AutomationAction[]> => {
  const response = await fetch('/automations')
  return toJson<AutomationAction[]>(response)
}

export const simulateWorkflow = async (payload: SimulateRequest): Promise<SimulateResponse> => {
  const response = await fetch('/simulate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  return toJson<SimulateResponse>(response)
}
