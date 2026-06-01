'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import type { Task } from '~/types/task'

import {
  Pencil,
  Plus,
  Calendar,
  User,
  Building2,
  FileText,
} from 'lucide-react'

import { Button } from '../ui/button'

interface TasksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date | null
  tasks: Task[]
  onEditTask: (task: Task) => void
  onAddTask?: () => void
}

const getTypeLabel = (type: Task['taskType']) => {
  switch (type) {
    case 'CONTRACT':
      return 'Заключение'

    case 'RENEWAL':
      return 'Продление'

    case 'CANCEL':
      return 'Расторжение'

    case 'OTHER':
      return 'Другое'

    default:
      return type
  }
}

const getStatusLabel = (status: Task['status']) => {
  switch (status) {
    case 'PENDING':
      return 'Ожидает'

    case 'IN_PROGRESS':
      return 'В работе'

    case 'DONE':
      return 'Выполнено'

    case 'CANCELLED':
      return 'Отменено'

    default:
      return status
  }
}

const getTypeStyles = (type: Task['taskType']) => {
  switch (type) {
    case 'CONTRACT':
      return {
        card: 'border-green-200 bg-green-50/70',
        badge: 'bg-green-600 text-white',
      }

    case 'RENEWAL':
      return {
        card: 'border-yellow-200 bg-yellow-50/70',
        badge: 'bg-yellow-500 text-white',
      }

    case 'CANCEL':
      return {
        card: 'border-red-200 bg-red-50/70',
        badge: 'bg-red-600 text-white',
      }

    default:
      return {
        card: 'border-gray-200 bg-gray-50',
        badge: 'bg-gray-600 text-white',
      }
  }
}

const getStatusStyles = (status: Task['status']) => {
  switch (status) {
    case 'DONE':
      return 'bg-green-100 text-green-700 border-green-200'

    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-700 border-blue-200'

    case 'CANCELLED':
      return 'bg-red-100 text-red-700 border-red-200'

    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const TasksDialog = ({
  open,
  onOpenChange,
  date,
  tasks,
  onEditTask,
  onAddTask,
}: TasksDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-3xl border-0 bg-white p-0 shadow-2xl">

        <div className="border-b bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
              <Calendar size={28} />

              <div>
                Задачи на{' '}
                {date
                  ? format(date, 'd MMMM yyyy', {
                      locale: ru,
                    })
                  : ''}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 text-sm text-blue-100">
            Всего задач: {tasks.length}
          </div>
        </div>

        <div className="p-6">

          {onAddTask && (
            <div className="mb-5 flex justify-end">
              <Button
                onClick={onAddTask}
                className="h-11 rounded-xl bg-green-600 px-5 text-white hover:bg-green-700"
              >
                <Plus size={18} className="mr-2" />
                Новая задача
              </Button>
            </div>
          )}

          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => {
                const styles = getTypeStyles(task.taskType)

                return (
                  <div
                    key={task.id}
                    className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${styles.card}`}
                  >
                    <div className="flex items-start justify-between gap-4">

                      <div className="flex-1">

                        <div className="mb-3 flex items-start gap-3">
                          <div
                            className={`rounded-lg px-3 py-1 text-xs font-semibold ${styles.badge}`}
                          >
                            {getTypeLabel(task.taskType)}
                          </div>

                          <div
                            className={`rounded-lg border px-3 py-1 text-xs ${getStatusStyles(task.status)}`}
                          >
                            {getStatusLabel(task.status)}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">
                          {task.title}
                        </h3>

                        {task.description && (
                          <div className="mt-3 rounded-xl bg-white/70 p-3 text-sm text-gray-700">
                            {task.description}
                          </div>
                        )}

                        <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-700 md:grid-cols-2">

                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>
                              Исполнитель:{' '}
                              {(task as any).assignedTo
                                ? `${(task as any).assignedTo.surname ?? ''} ${(task as any).assignedTo.firstname ?? ''}`
                                : task.assignedToId}
                            </span>
                          </div>

                          {task.clientId && (
                            <div className="flex items-center gap-2">
                              <Building2 size={16} />
                              <span>
                                Клиент:{' '}
                                {(task as any).client?.name ??
                                  task.clientId}
                              </span>
                            </div>
                          )}

                          {task.contractId && (
                            <div className="flex items-center gap-2">
                              <FileText size={16} />
                              <span>
                                Договор:{' '}
                                {(task as any).contract?.number ??
                                  task.contractId}
                              </span>
                            </div>
                          )}

                          {task.amount && (
                            <div>
                              Сумма:{' '}
                              <span className="font-semibold">
                                {task.amount.toLocaleString()} ₽
                              </span>
                            </div>
                          )}

                          {!task.contractId &&
                            task.taskType !== 'OTHER' &&
                            task.durationMonths != null &&
                            task.durationMonths > 0 && (
                              <div>
                                Срок:{' '}
                                <span className="font-semibold">
                                  {task.durationMonths} мес.
                                </span>
                              </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onEditTask(task)}
                        className="rounded-xl bg-white p-3 text-gray-600 shadow-sm transition hover:bg-gray-100 hover:text-black"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-14 text-center">
              <div className="text-lg font-semibold text-gray-700">
                На этот день задач нет
              </div>

              <div className="mt-2 text-sm text-gray-500">
                Можно создать новую задачу
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TasksDialog