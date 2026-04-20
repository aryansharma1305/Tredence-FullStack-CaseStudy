import type {
  AutomationAction,
  SimulateRequest,
  SimulateResponse
} from '../types/workflow'
import { automationActions, runMockSimulation } from './workflowRuntime'

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
  try {
    const response = await fetch('/automations')

    if (response.status === 404) {
      return automationActions
    }

    return await toJson<AutomationAction[]>(response)
  } catch {
    return automationActions
  }
}

export const simulateWorkflow = async (payload: SimulateRequest): Promise<SimulateResponse> => {
  try {
    const response = await fetch('/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.status === 404) {
      return runMockSimulation(payload)
    }

    return await toJson<SimulateResponse>(response)
  } catch {
    return runMockSimulation(payload)
  }
}
