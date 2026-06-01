'use client'

import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

import { api } from '~/trpc/react'

interface Props {
  client: any
  open: boolean
  onClose: () => void
}

interface FormState {
  name: string
  inn: string
  address?: string

  kpp?: string

  bankAccount?: string
  bankName?: string
  correspondent?: string

  phone?: string
  email?: string

  contactName?: string
  contactPosition?: string
  contactPhone?: string
}

const EditClientModal = ({
  client,
  open,
  onClose,
}: Props) => {
  const utils = api.useUtils()

  const updateClient =
    api.clients.update.useMutation({
      onSuccess: async () => {
        await utils.clients.getById.invalidate({
          id: client.id,
        })

        await utils.clients.getAll.invalidate()

        onClose()
      },
    })

  const [form, setForm] =
    useState<FormState>({
      name: '',
      inn: '',
    })

  useEffect(() => {
    if (!client) return

    setForm({
      name: client.name ?? '',
      inn: client.inn ?? '',
      address: client.address ?? '',

      kpp: client.kpp ?? '',

      bankAccount:
        client.bankAccount ?? '',

      bankName: client.bankName ?? '',

      correspondent:
        client.correspondent ?? '',

      phone: client.phone ?? '',
      email: client.email ?? '',

      contactName:
        client.contactName ?? '',

      contactPosition:
        client.contactPosition ?? '',

      contactPhone:
        client.contactPhone ?? '',
    })
  }, [client])

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
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

    updateClient.mutate({
      id: client.id,

      name: form.name,
      inn: form.inn,
      address: form.address,

      kpp: form.kpp,

      bankAccount:
        form.bankAccount,

      bankName: form.bankName,

      correspondent:
        form.correspondent,

      phone: form.phone,
      email: form.email,

      contactName:
        form.contactName,

      contactPosition:
        form.contactPosition,

      contactPhone:
        form.contactPhone,
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-3xl border-0 p-0 shadow-2xl">

        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 text-white">

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Редактирование клиента
            </DialogTitle>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Название компании
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 p-3"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                ИНН
              </label>

              <input
                name="inn"
                value={form.inn}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 p-3"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                КПП
              </label>

              <input
                name="kpp"
                value={form.kpp}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 p-3"
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
                className="w-full rounded-xl border border-gray-300 p-3"
              />
            </div>

          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Адрес
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-300 p-3"
            />
          </div>

          <div className="rounded-2xl bg-gray-50 p-5">

            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Банковские реквизиты
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Банк
                </label>

                <input
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 p-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Расчетный счет
                </label>

                <input
                  name="bankAccount"
                  value={form.bankAccount}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 p-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  Корреспондентский счет
                </label>

                <input
                  name="correspondent"
                  value={form.correspondent}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 p-3"
                />
              </div>

            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 p-5">

            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Контактное лицо
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div>
                <label className="mb-1 block text-sm font-medium">
                  ФИО
                </label>

                <input
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 p-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Должность
                </label>

                <input
                  name="contactPosition"
                  value={
                    form.contactPosition
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 p-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Телефон
                </label>

                <input
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 p-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Email
                </label>

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 p-3"
                />
              </div>

            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2 hover:bg-gray-100"
            >
              Отмена
            </button>

            <button
              type="submit"
              disabled={
                updateClient.isPending
              }
              className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {updateClient.isPending
                ? 'Сохранение...'
                : 'Сохранить'}
            </button>

          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditClientModal