'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { useState } from 'react'

import EditContractModal from './EditContractModal'

import InvoiceButton from '../Invoices/InvoiceButton'

import { api } from '~/trpc/react'

interface Props {
  contract: any
}

const ContractCard = ({ contract }: Props) => {
  const [editOpen, setEditOpen] = useState(false)
  const [renewMonths, setRenewMonths] = useState(12)

  const utils = api.useUtils()

  const renewContract = api.contract.renew.useMutation({
    onSuccess: async () => {
      await utils.clients.getById.invalidate()
    },
  })

  const cancelContract = api.contract.cancel.useMutation({
    onSuccess: async () => {
      await utils.clients.getById.invalidate()
    },
  })

  const isActive = new Date(contract.endDate) > new Date()

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const safeMonths = Math.max(1, Number(renewMonths) || 1)

  return (
    <>
      <div className="rounded-2xl border p-5 transition hover:shadow-md">

        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

          <div className="space-y-3">

            <div className="flex flex-wrap items-center gap-3">

              <h3 className="text-lg font-semibold text-gray-800">
                Договор №{contract.number}
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {isActive ? 'Активен' : 'Истек'}
              </span>

            </div>

            <div className="text-sm text-gray-500">
              {format(
                new Date(contract.startDate),
                'dd MMMM yyyy',
                { locale: ru }
              )}
              {' — '}
              {format(
                new Date(contract.endDate),
                'dd MMMM yyyy',
                { locale: ru }
              )}
            </div>

            <div className="text-sm text-gray-500">
              Менеджер:{' '}
              <span className="font-medium text-gray-700">
                {contract.manager?.surname}{' '}
                {contract.manager?.firstname}
              </span>
            </div>

            {contract.description && (
              <p className="max-w-2xl text-sm text-gray-600">
                {contract.description}
              </p>
            )}

          </div>

          <div className="flex flex-col items-start gap-4 xl:items-end">

            <div>
              <div className="text-sm text-gray-400">
                Сумма
              </div>

              <div className="text-2xl font-bold text-gray-800">
                {formatMoney(contract.amount)}
              </div>
            </div>

            <div className="flex flex-col gap-2">

              <div className="flex items-center gap-2">

                <input
                  type="number"
                  min={1}
                  value={renewMonths}
                  onChange={(e) =>
                    setRenewMonths(
                      Math.max(1, Number(e.target.value))
                    )
                  }
                  className="w-20 rounded-xl border px-2 py-1 text-sm"
                />

                <button
                  onClick={() =>
                    renewContract.mutate({
                      contractId: contract.id,
                      months: safeMonths,
                    })
                  }
                  className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                >
                  Продлить
                </button>

              </div>

              <div className="flex flex-wrap gap-2">

                <button
                  onClick={() => setEditOpen(true)}
                  className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Редактировать данные
                </button>

                <InvoiceButton
                  contractId={contract.id}
                />

                <button
                  onClick={() =>
                    cancelContract.mutate({
                      contractId: contract.id,
                    })
                  }
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Расторгнуть
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>

      <EditContractModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        contract={contract}
      />
    </>
  )
}

export default ContractCard