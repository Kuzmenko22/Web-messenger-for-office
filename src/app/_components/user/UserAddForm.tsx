'use client'

import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

import { Role } from '@prisma/client'

interface Props {
  open: boolean
  onClose: () => void

  onSave: (data: {
    firstname: string
    surname: string
    lastname?: string
    email: string
    phone?: string
    role: Role
  }) => void
}

const UserAddForm = ({
  open,
  onClose,
  onSave,
}: Props) => {
  const [form, setForm] = useState({
    firstname: '',
    surname: '',
    lastname: '',
    email: '',
    phone: '',
    role: 'MANAGER' as Role,
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    onSave({
      ...form,
      lastname:
        form.lastname || undefined,
      phone:
        form.phone || undefined,
    })

    setForm({
      firstname: '',
      surname: '',
      lastname: '',
      email: '',
      phone: '',
      role: 'MANAGER',
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
              Новый сотрудник
            </DialogTitle>
          </DialogHeader>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Имя
              </label>

              <input
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Фамилия
              </label>

              <input
                name="surname"
                value={form.surname}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
                required
              />
            </div>

          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Отчество
            </label>

            <input
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Телефон
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Роль
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            >
              <option value="MANAGER">
                Менеджер
              </option>

              <option value="SENIOR_MANAGER">
                Старший менеджер
              </option>

              <option value="ADMIN">
                Администратор
              </option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2 hover:bg-gray-100"
            >
              Отмена
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Создать
            </button>

          </div>

        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UserAddForm