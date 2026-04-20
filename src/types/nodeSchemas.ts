import { z } from 'zod'

const keyValueSchema = z.object({
  id: z.string().min(1),
  key: z.string(),
  value: z.string()
})

export const startNodeSchema = z.object({
  title: z.string().trim().min(1, 'Start title is required'),
  metadata: z.array(keyValueSchema)
})

export const taskNodeSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string(),
  assignee: z.string(),
  dueDate: z.string(),
  customFields: z.array(keyValueSchema)
})

export const approvalNodeSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  approverRole: z.string().trim().min(1, 'Approver role is required'),
  autoApproveThreshold: z.union([
    z.literal(''),
    z.number().int().nonnegative('Threshold must be 0 or more')
  ])
})

export const automatedStepNodeSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  actionId: z.string().trim().min(1, 'Select an action'),
  actionParams: z.record(z.string(), z.string())
})

export const endNodeSchema = z.object({
  message: z.string().trim().min(1, 'End message is required'),
  summaryFlag: z.boolean()
})
