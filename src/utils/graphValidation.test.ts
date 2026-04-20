import { describe, expect, it } from 'vitest'
import type { Edge } from 'reactflow'
import type {
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData,
  StartNodeData,
  TaskNodeData,
  WorkflowNode
} from '../types/workflow'
import { validateWorkflow } from './graphValidation'

const makeStart = (id = 'start-1'): WorkflowNode => ({
  id,
  type: 'start',
  position: { x: 0, y: 0 },
  data: {
    title: 'Start',
    metadata: []
  } satisfies StartNodeData
})

const makeTask = (id = 'task-1'): WorkflowNode => ({
  id,
  type: 'task',
  position: { x: 120, y: 0 },
  data: {
    title: 'Task',
    description: '',
    assignee: '',
    dueDate: '',
    customFields: []
  } satisfies TaskNodeData
})

const makeApproval = (id = 'approval-1'): WorkflowNode => ({
  id,
  type: 'approval',
  position: { x: 240, y: 0 },
  data: {
    title: 'Approval',
    approverRole: 'Manager',
    autoApproveThreshold: ''
  } satisfies ApprovalNodeData
})

const makeAutomated = (id = 'automated-1'): WorkflowNode => ({
  id,
  type: 'automated',
  position: { x: 360, y: 0 },
  data: {
    title: 'Automated',
    actionId: 'send_email',
    actionParams: {
      to: 'x@y.com'
    }
  } satisfies AutomatedStepNodeData
})

const makeEnd = (id = 'end-1'): WorkflowNode => ({
  id,
  type: 'end',
  position: { x: 480, y: 0 },
  data: {
    message: 'Done',
    summaryFlag: true
  } satisfies EndNodeData
})

const link = (source: string, target: string): Edge => ({
  id: `${source}-${target}`,
  source,
  target,
  type: 'smoothstep'
})

describe('validateWorkflow', () => {
  it('fails when start node is missing', () => {
    const nodes = [makeTask(), makeEnd()]
    const edges = [link('task-1', 'end-1')]

    const result = validateWorkflow(nodes, edges)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('No Start node found')
  })

  it('fails when end node is missing', () => {
    const nodes = [makeStart(), makeTask()]
    const edges = [link('start-1', 'task-1')]

    const result = validateWorkflow(nodes, edges)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('No End node found')
  })

  it('fails when graph contains disconnected nodes', () => {
    const nodes = [makeStart(), makeTask(), makeEnd(), makeApproval()]
    const edges = [link('start-1', 'task-1'), link('task-1', 'end-1')]

    const result = validateWorkflow(nodes, edges)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Disconnected nodes found')
  })

  it('fails when graph contains a cycle', () => {
    const nodes = [makeStart(), makeTask(), makeAutomated(), makeEnd()]
    const edges = [
      link('start-1', 'task-1'),
      link('task-1', 'automated-1'),
      link('automated-1', 'task-1'),
      link('automated-1', 'end-1')
    ]

    const result = validateWorkflow(nodes, edges)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Cycle detected in workflow graph')
  })

  it('passes for a valid linear workflow', () => {
    const nodes = [makeStart(), makeTask(), makeApproval(), makeEnd()]
    const edges = [link('start-1', 'task-1'), link('task-1', 'approval-1'), link('approval-1', 'end-1')]

    const result = validateWorkflow(nodes, edges)

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})
