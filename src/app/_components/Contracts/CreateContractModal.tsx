'use client'

import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

import { api } from '~/trpc/react'

interface Props {
  open: boolean
  onClose: () => void
  clientId: string
  onSuccess?: () => void
}

const CreateContractModal = ({
  open,
  onClose,
  clientId,
  onSuccess,
}: Props) => {
  const utils = api.useUtils()

  const { data: users = [] } =
    api.user.getAll.useQuery()

  const createContract =
    api.contract.create.useMutation({
      onSuccess: async () => {
        await utils.clients.getById.invalidate()

        onSuccess?.()
        onClose()
      },
    })

  const [form, setForm] = useState({
    number: '',
    managerId: '',
    startDate: '',
    endDate: '',
    amount: '',
    description: '',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    setForm((p) => ({
      ...p,
      [name]: value,
    }))
  }

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    createContract.mutate({
      number: form.number,
      clientId,
      managerId: form.managerId,
      startDate: new Date(
        form.startDate
      ),
      endDate: new Date(
        form.endDate
      ),
      amount: Number(form.amount),
      description:
        form.description || undefined,
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-2xl rounded-3xl border-0 p-0 shadow-2xl">

        <div className="rounded-t bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 text-white">

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Новый договор
            </DialogTitle>
          </DialogHeader>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          <div>
            <label className="mb-1 block text-sm font-medium">
              Номер договора
            </label>

            <input
              name="number"
              value={form.number}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Ответственный менеджер
            </label>

            <select
              name="managerId"
              value={form.managerId}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">
                Выберите сотрудника
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.surname}{' '}
                  {user.firstname}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Дата начала
              </label>

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 p-3"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Дата окончания
              </label>

              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 p-3"
                required
              />
            </div>

          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Сумма договора
            </label>

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-3"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Описание
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full resize-none rounded-xl border border-gray-300 p-3"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2 hover:bg-gray-100"
            >
              Отмена
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Создать
            </button>

          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateContractModal