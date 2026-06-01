'use client'

import { useState } from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { api } from '~/trpc/react'

import EditClientModal from './EditClientModal'
import CreateContractModal from '../Contracts/CreateContractModal'

import ContractCard from '../Contracts/ContractCard'

interface Props {
  clientId: string
}

const ClientCard = ({ clientId }: Props) => {
  const [editOpen, setEditOpen] =
    useState(false)

  const [
    createContractOpen,
    setCreateContractOpen,
  ] = useState(false)

  const { data: client, isLoading } =
    api.clients.getById.useQuery({
      id: clientId,
    })

  const utils = api.useUtils()

  const isContractActive = (
    endDate: Date | string
  ) => {
    return (
      new Date(endDate) > new Date()
    )
  }

  const formatMoney = (
    amount: number
  ) => {
    return new Intl.NumberFormat(
      'ru-RU',
      {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
      }
    ).format(amount)
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        Загрузка...
      </div>
    )
  }

  if (!client) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        Клиент не найден
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">

        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-lg">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div>
              <h1 className="text-3xl font-bold">
                {client.name}
              </h1>

              <p className="mt-2 text-blue-100">
                ИНН: {client.inn}
              </p>

              {client.address && (
                <p className="mt-1 text-blue-100">
                  {client.address}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">

              <button
                onClick={() =>
                  setEditOpen(true)
                }
                className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/20"
              >
                Редактировать
              </button>

              <button
                onClick={() =>
                  setCreateContractOpen(
                    true
                  )
                }
                className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
              >
                Новый договор
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="text-sm text-blue-100">
                  Договоров
                </div>

                <div className="mt-1 text-2xl font-bold">
                  {
                    client.contracts
                      .length
                  }
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="text-sm text-blue-100">
                  Задач
                </div>

                <div className="mt-1 text-2xl font-bold">
                  {client.tasks.length}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          <div className="rounded-3xl border bg-white p-6 shadow-sm xl:col-span-1">

            <h2 className="mb-5 text-xl font-bold text-gray-800">
              Информация о клиенте
            </h2>

            <div className="space-y-4 text-sm">

              <div>
                <div className="text-gray-400">
                  Телефон
                </div>

                <div className="mt-1 font-medium text-gray-700">
                  {client.phone || '—'}
                </div>
              </div>

              <div>
                <div className="text-gray-400">
                  Email
                </div>

                <div className="mt-1 font-medium text-gray-700">
                  {client.email || '—'}
                </div>
              </div>

              <div>
                <div className="text-gray-400">
                  Контактное лицо
                </div>

                <div className="mt-1 font-medium text-gray-700">
                  {client.contactName ||
                    '—'}
                </div>
              </div>

              <div>
                <div className="text-gray-400">
                  Должность
                </div>

                <div className="mt-1 font-medium text-gray-700">
                  {client.contactPosition ||
                    '—'}
                </div>
              </div>

              <div>
                <div className="text-gray-400">
                  Контактный телефон
                </div>

                <div className="mt-1 font-medium text-gray-700">
                  {client.contactPhone ||
                    '—'}
                </div>
              </div>

              <div>
                <div className="text-gray-400">
                  Банк
                </div>

                <div className="mt-1 font-medium text-gray-700">
                  {client.bankName ||
                    '—'}
                </div>
              </div>

              <div>
                <div className="text-gray-400">
                  Расчетный счет
                </div>

                <div className="mt-1 font-medium text-gray-700">
                  {client.bankAccount ||
                    '—'}
                </div>
              </div>

              <div>
                <div className="text-gray-400">
                  Корреспондентский счет
                </div>

                <div className="mt-1 font-medium text-gray-700">
                  {client.correspondent ||
                    '—'}
                </div>
              </div>

              <div>
                <div className="text-gray-400">
                  КПП
                </div>

                <div className="mt-1 font-medium text-gray-700">
                  {client.kpp || '—'}
                </div>
              </div>

            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm xl:col-span-2">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold text-gray-800">
                Договоры
              </h2>

              <button
                onClick={() =>
                  setCreateContractOpen(
                    true
                  )
                }
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                +
              </button>
            </div>

            <div className="space-y-4">

              {client.contracts
                .length === 0 && (
                <div className="rounded-2xl border border-dashed p-8 text-center text-gray-500">
                  Договоры отсутствуют
                </div>
              )}

              {client.contracts.map((contract) => (
                <ContractCard
                    key={contract.id}
                    contract={contract}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Связанные задачи
          </h2>

          <div className="space-y-3">

            {client.tasks.length ===
              0 && (
              <div className="rounded-2xl border border-dashed p-8 text-center text-gray-500">
                Задачи отсутствуют
              </div>
            )}

            {client.tasks.map(
              (task) => (
                <div
                  key={task.id}
                  className={`flex flex-col gap-4 rounded-2xl border p-4 lg:flex-row lg:items-center lg:justify-between ${
                    task.taskType === 'CONTRACT'
                      ? 'border-green-200 bg-green-50'
                      : task.taskType === 'RENEWAL'
                        ? 'border-yellow-200 bg-yellow-50'
                        : task.taskType === 'CANCEL'
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                    }`}
                  >

                  <div>
                    <div className="font-medium text-gray-800">
                      {task.title}
                    </div>

                    <div className="mt-1 text-sm text-gray-500">
                      Исполнитель:{' '}
                      {
                        task
                          .assignedTo
                          .surname
                      }{' '}
                      {
                        task
                          .assignedTo
                          .firstname
                      }
                    </div>

                    {task.contract && (
                      <div className="mt-1 text-sm text-blue-600">
                        Договор №
                        {
                          task.contract
                            .number
                        }
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        task.status ===
                        'DONE'
                          ? 'bg-green-700 text-green-100'
                          : task.status ===
                                'IN_PROGRESS'
                            ? 'bg-yellow-700 text-yellow-100'
                            : task.status ===
                                  'CANCELLED'
                              ? 'bg-red-700 text-red-100'
                              : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      {task.status ===
                        'PENDING' &&
                        'Ожидает'}

                      {task.status ===
                        'IN_PROGRESS' &&
                        'В работе'}

                      {task.status ===
                        'DONE' &&
                        'Выполнено'}

                      {task.status ===
                        'CANCELLED' &&
                        'Отменено'}
                    </span>

                    <div className="text-sm text-gray-500">
                      {format(
                        new Date(
                          task.dueDate
                        ),
                        'dd.MM.yyyy'
                      )}
                    </div>

                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <EditClientModal
        open={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
        client={client}
      />

      <CreateContractModal
        open={createContractOpen}
        onClose={() =>
          setCreateContractOpen(
            false
          )
        }
        clientId={client.id}
        onSuccess={() => {
          utils.clients.getById.invalidate(
            {
              id: client.id,
            }
          )
        }}
      />
    </>
  )
}

export default ClientCard