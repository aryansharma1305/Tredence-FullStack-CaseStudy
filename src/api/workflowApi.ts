import type {
  AutomationAction,
  SimulateRequest,
  SimulateResponse
} from '../types/workflow'

const API_BASE = '/api'

const toJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Request failed')
  }

  return (await response.json()) as T
}

export const getAutomations = async (): Promise<AutomationAction[]> => {
  const response = await fetch(`${API_BASE}/automations`)
  return toJson<AutomationAction[]>(response)
}

export const simulateWorkflow = async (payload: SimulateRequest): Promise<SimulateResponse> => {
  const response = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  return toJson<SimulateResponse>(response)
}
