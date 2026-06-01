import type {
  TaskStatus,
  TaskType,
  Role,
} from '@prisma/client'

export interface Task {
  id: string

  title: string
  description: string | null

  taskType: TaskType
  status: TaskStatus

  dueDate: Date
  completedAt: Date | null

  assignedToId: string
  createdById: string

  clientId: string | null
  contractId: string | null

  amount: number | null
  durationMonths: number | null

  priority: number

  createdAt: Date

  assignedTo: {
    id: string

    firstname: string | null
    surname: string | null
    lastname: string | null

    email: string | null
    phone: string | null

    role: Role
  }

  createdBy: {
    id: string

    firstname: string | null
    surname: string | null
    lastname: string | null

    email: string | null
    phone: string | null

    role: Role
  }

  client: {
    id: string

    name: string
    inn: string

    address: string | null
    phone: string | null
    email: string | null
  } | null

  contract: {
    id: string

    number: string

    amount: number

    startDate: Date
    endDate: Date
  } | null
}