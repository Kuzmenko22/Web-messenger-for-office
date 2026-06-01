'use client'

import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/app/_components/ui/dialog'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (data: any) => void
}

const CreateClientModal = ({
  open,
  onClose,
  onSave,
}: Props) => {
  const [form, setForm] = useState({
    name: '',
    inn: '',
    phone: '',
    email: '',
    address: '',
  })

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    onSave(form)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-xl rounded-3xl">

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Новый клиент
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            placeholder="Название компании"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
            required
          />

          <input
            placeholder="ИНН"
            value={form.inn}
            onChange={(e) =>
              setForm({
                ...form,
                inn: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
            required
          />

          <input
            placeholder="Телефон"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />

          <textarea
            placeholder="Адрес"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
            rows={4}
          />

          <div className="flex justify-end gap-3">

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
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateClientModal