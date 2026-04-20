import type { Edge } from 'reactflow'
import type { WorkflowNode } from '../types/workflow'
import { createNode } from '../utils/nodeFactory'

const edgeStyle = {
  strokeWidth: 2,
  stroke: '#7a8798'
}

const edgeType = 'smoothstep' as const

const makeEdge = (source: string, target: string): Edge => ({
  id: `edge-${crypto.randomUUID().slice(0, 8)}`,
  source,
  target,
  type: edgeType,
  style: edgeStyle
})

export const buildOnboardingTemplate = () => {
  const start = createNode({ type: 'start', position: { x: 120, y: 120 } })
  const task = createNode({ type: 'task', position: { x: 420, y: 120 } })
  const automated = createNode({ type: 'automated', position: { x: 720, y: 120 } })
  const end = createNode({ type: 'end', position: { x: 1020, y: 120 } })

  const nodes: WorkflowNode[] = [
    {
      ...start,
      data: {
        ...start.data,
        title: 'Employee Hired'
      }
    },
    {
      ...task,
      data: {
        ...task.data,
        title: 'Collect Documents',
        assignee: 'HR Ops'
      }
    },
    {
      ...automated,
      data: {
        ...automated.data,
        title: 'Send Welcome Email',
        actionId: 'send_email',
        actionParams: {
          to: 'employee@company.com',
          subject: 'Welcome aboard'
        }
      }
    },
    {
      ...end,
      data: {
        ...end.data,
        message: 'Onboarding Complete'
      }
    }
  ]

  const edges = [makeEdge(start.id, task.id), makeEdge(task.id, automated.id), makeEdge(automated.id, end.id)]

  return { nodes, edges }
}

export const buildLeaveApprovalTemplate = () => {
  const start = createNode({ type: 'start', position: { x: 120, y: 320 } })
  const task = createNode({ type: 'task', position: { x: 420, y: 320 } })
  const approval = createNode({ type: 'approval', position: { x: 720, y: 320 } })
  const end = createNode({ type: 'end', position: { x: 1020, y: 320 } })

  const nodes: WorkflowNode[] = [
    {
      ...start,
      data: {
        ...start.data,
        title: 'Leave Requested'
      }
    },
    {
      ...task,
      data: {
        ...task.data,
        title: 'Verify Leave Balance',
        assignee: 'HRBP'
      }
    },
    {
      ...approval,
      data: {
        ...approval.data,
        title: 'Manager Approval',
        approverRole: 'Manager'
      }
    },
    {
      ...end,
      data: {
        ...end.data,
        message: 'Leave Finalized'
      }
    }
  ]

  const edges = [makeEdge(start.id, task.id), makeEdge(task.id, approval.id), makeEdge(approval.id, end.id)]

  return { nodes, edges }
}
