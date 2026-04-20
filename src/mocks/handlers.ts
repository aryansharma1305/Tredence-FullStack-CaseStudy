import { http, HttpResponse } from 'msw'
import {
  automationActions,
  createFailureResponse,
  runMockSimulation
} from '../api/workflowRuntime'
import type { SimulateRequest } from '../types/workflow'

const isSimulateRequest = (value: unknown): value is SimulateRequest => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const payload = value as { nodes?: unknown; edges?: unknown }
  return Array.isArray(payload.nodes) && Array.isArray(payload.edges)
}

export const handlers = [
  http.get('/automations', () => {
    return HttpResponse.json(automationActions)
  }),

  http.post('/simulate', async ({ request }) => {
    const body = await request.json()

    if (!isSimulateRequest(body)) {
      return HttpResponse.json(createFailureResponse('Invalid payload: nodes and edges are required.'), {
        status: 400
      })
    }

    const result = runMockSimulation(body)
    const shouldFailRequest = result.status === 'failed' && result.steps.length === 0

    return HttpResponse.json(result, shouldFailRequest ? { status: 400 } : undefined)
  })
]
