'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

import { api } from '~/trpc/react'
import { format } from 'date-fns'

type TaskType = 'CONTRACT' | 'RENEWAL' | 'CANCEL' | 'OTHER'

type TaskStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'CANCELLED'

interface FormState {
  title: string
  description?: string
  date: string
  taskType: TaskType
  status: TaskStatus
  assignedToId: string

  clientId?: string
  contractId?: string

  amount?: number
  durationMonths?: number
}

interface Props {
  task: any | null
  onClose: () => void
  onSave: (data: any) => void
  defaultDate?: string
}

const toDateInput = (
  value: Date | string | null | undefined
) => {
  if (!value) return ''

  const d =
    value instanceof Date
      ? value
      : new Date(value)

  return format(d, 'yyyy-MM-dd')
}

const parsePositiveNumber = (
  value: string
) => {
  if (value === '') return undefined

  const n = Number(value)

  if (
    Number.isNaN(n) ||
    n < 0
  ) {
    return undefined
  }

  return n
}

const EditTaskModal = ({
  task,
  onClose,
  onSave,
  defaultDate,
}: Props) => {
  const utils = api.useUtils()

  const { data: users = [] } =
    api.user.getAll.useQuery()

  const { data: clients = [] } =
    api.clients.getAll.useQuery()

  const { data: contracts = [] } =
    api.contract.getAll.useQuery()

  const deleteTask =
    api.task.delete.useMutation({
      onSuccess: async () => {
        await utils.task.getByMonth.invalidate()

        onClose()
      },
    })

  const [form, setForm] =
    useState<FormState>({
      title: '',
      description: '',
      date: defaultDate ?? '',
      taskType: 'OTHER',
      status: 'PENDING',
      assignedToId: '',
    })

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title ?? '',
        description:
          task.description ?? '',

        date: toDateInput(task.dueDate),

        taskType:
          task.taskType ?? 'OTHER',

        status:
          task.status ?? 'PENDING',

        assignedToId:
          task.assignedToId ?? '',

        clientId:
          task.clientId ?? undefined,

        contractId:
          task.contractId ?? undefined,

        amount:
          task.amount ?? undefined,

        durationMonths:
          task.durationMonths ??
          undefined,
      })
    } else {
      setForm({
        title: '',
        description: '',
        date: defaultDate ?? '',
        taskType: 'OTHER',
        status: 'PENDING',
        assignedToId: '',

        clientId: undefined,
        contractId: undefined,

        amount: undefined,
        durationMonths: undefined,
      })
    }
  }, [task, defaultDate])

  const filteredContracts =
    useMemo(() => {
      if (!form.clientId) return []

      return contracts.filter(
        (c) =>
          c.clientId === form.clientId
      )
    }, [contracts, form.clientId])

  const selectedContract =
    contracts.find(
      (c) => c.id === form.contractId
    )

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target

    setForm((prev) => {
      const next = { ...prev }

      if (name === 'clientId') {
        next.clientId =
          value || undefined

        next.contractId =
          undefined

        next.amount =
          undefined

        next.durationMonths =
          undefined

        return next
      }

      if (name === 'contractId') {
        next.contractId =
          value || undefined

        if (value) {
          const contract =
            contracts.find(
              (c) => c.id === value
            )

          next.amount =
            contract?.amount ??
            undefined

          next.durationMonths =
            undefined
        } else {
          next.amount =
            undefined
        }

        return next
      }

      if (
        name === 'amount' ||
        name === 'durationMonths'
      ) {
        next[
          name as
            | 'amount'
            | 'durationMonths'
        ] = parsePositiveNumber(value)

        return next
      }

      ;(
        next as Record<
          string,
          string | number | undefined
        >
      )[name] = value

      return next
    })
  }

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    onSave({
      id: task?.id,

      ...form,

      clientId:
        form.clientId || null,

      contractId:
        form.contractId || null,

      amount: form.contractId
        ? selectedContract?.amount
        : form.amount,

      durationMonths:
        form.contractId
          ? undefined
          : form.durationMonths,
    })

    onClose()
  }

  return (
    <Dialog
      open={!!task || !!defaultDate}
      onOpenChange={onClose}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-0 p-0 shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {task
                ? 'Редактирование задачи'
                : 'Создание задачи'}
            </DialogTitle>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Название
            </label>

            <input
              name="title"
              value={form.title ?? ''}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Тип задачи
            </label>

            <select
              name="taskType"
              value={form.taskType}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            >
              <option value="OTHER">
                Другое
              </option>

              <option value="CONTRACT">
                Заключение
              </option>

              <option value="RENEWAL">
                Продление
              </option>

              <option value="CANCEL">
                Расторжение
              </option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Статус
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            >
              <option value="PENDING">
                Ожидает
              </option>

              <option value="IN_PROGRESS">
                В работе
              </option>

              <option value="DONE">
                Выполнено
              </option>

              <option value="CANCELLED">
                Отменено
              </option>
            </select>
          </div>

          {form.taskType !== 'OTHER' && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                Клиент
              </label>

              <select
                name="clientId"
                value={form.clientId ?? ''}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              >
                <option value="">
                  Выберите клиента
                </option>

                {clients.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                  >
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.taskType !== 'OTHER' &&
            form.clientId && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Договор
                </label>

                <select
                  name="contractId"
                  value={
                    form.contractId ?? ''
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >
                  <option value="">
                    Выберите договор
                  </option>

                  {filteredContracts.map(
                    (c) => (
                      <option
                        key={c.id}
                        value={c.id}
                      >
                        {c.number}
                      </option>
                    )
                  )}
                </select>

                <a
                  href={`/clients/${form.clientId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  Открыть карточку клиента
                </a>

                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium">
                    Сумма
                  </label>

                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    name="amount"
                    value={
                      form.amount ?? ''
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !!form.contractId
                    }
                    placeholder="Введите сумму"
                    className="w-full rounded-xl border p-3 disabled:bg-gray-100 disabled:text-gray-500"
                  />

                  {form.contractId && (
                    <div className="mt-1 text-xs text-gray-500">
                      Сумма автоматически
                      взята из договора
                    </div>
                  )}
                </div>

                {!form.contractId && (
                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium">
                      Срок (месяцы)
                    </label>

                    <input
                      type="number"
                      min={0}
                      step={1}
                      name="durationMonths"
                      value={
                        form.durationMonths ??
                        ''
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Например: 3"
                      className="w-full rounded-xl border p-3"
                    />
                  </div>
                )}
              </div>
            )}

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              value={form.date ?? ''}
              onChange={handleChange}
              className="rounded-xl border p-3"
              required
            />

            <select
              name="assignedToId"
              value={
                form.assignedToId ?? ''
              }
              onChange={handleChange}
              className="rounded-xl border p-3"
              required
            >
              <option value="">
                Исполнитель
              </option>

              {users.map((u) => (
                <option
                  key={u.id}
                  value={u.id}
                >
                  {u.surname}{' '}
                  {u.firstname}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="description"
            value={
              form.description ?? ''
            }
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            rows={4}
          />

          <div className="flex items-center justify-between gap-3">
            {task && (
              <button
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      'Удалить задачу?'
                    )
                  ) {
                    deleteTask.mutate({
                      id: task.id,
                    })
                  }
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
              >
                Удалить
              </button>
            )}

            <div className="ml-auto flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border px-4 py-2"
              >
                Отмена
              </button>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2 text-white"
              >
                Сохранить
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTaskModal