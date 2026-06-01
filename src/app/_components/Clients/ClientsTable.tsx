'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

import { AlertTriangle, Search, Plus } from 'lucide-react'

import { api } from '~/trpc/react'

import ClientsPagination from './ClientsPagination'
import CreateClientModal from './CreateClientModal'

interface Props {
  currentPage: number
  search: string
}

const ITEMS_PER_PAGE = 10

const ClientsTable = ({
  currentPage,
  search,
}: Props) => {
  const [searchValue, setSearchValue] =
    useState(search)

  const [openCreate, setOpenCreate] =
    useState(false)

  const utils = api.useUtils()

  const { data: clients = [], isLoading } =
    api.clients.getAll.useQuery()

  const createClient =
    api.clients.create.useMutation({
      onSuccess: async () => {
        await utils.clients.getAll.invalidate()
        setOpenCreate(false)
      },
    })

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const value =
        searchValue.toLowerCase()

      return (
        client.name
          .toLowerCase()
          .includes(value) ||
        client.inn
          .toLowerCase()
          .includes(value)
      )
    })
  }, [clients, searchValue])

  const totalPages = Math.ceil(
    filteredClients.length /
      ITEMS_PER_PAGE
  )

  const paginatedClients =
    filteredClients.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    )

  const getContractsCount = (
    client: any
  ) => client.contracts.length

  const getActiveContractsCount = (
    client: any
  ) => {
    return client.contracts.filter(
      (contract: any) =>
        new Date(contract.endDate) >
        new Date()
    ).length
  }

  const hasExpiringContract = (
    client: any
  ) => {
    const now = new Date()

    const oneMonthLater =
      new Date()

    oneMonthLater.setMonth(
      now.getMonth() + 1
    )

    return client.contracts.some(
      (contract: any) => {
        const endDate =
          new Date(
            contract.endDate
          )

        return (
          endDate > now &&
          endDate <= oneMonthLater
        )
      }
    )
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="relative w-full lg:max-w-md">

          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            placeholder="Поиск по названию или ИНН..."
            value={searchValue}
            onChange={(e) =>
              setSearchValue(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <button
          onClick={() =>
            setOpenCreate(true)
          }
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-medium text-white shadow-lg transition hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600"
        >
          <Plus className="h-4 w-4" />
          Добавить клиента
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">

              <tr className="text-left text-sm font-semibold text-gray-600">

                <th className="px-6 py-5">
                  Клиент
                </th>

                <th className="px-6 py-5">
                  ИНН
                </th>

                <th className="px-6 py-5">
                  Договоры
                </th>

                <th className="px-6 py-5">
                  Активные
                </th>

                <th className="px-6 py-5">
                  Задачи
                </th>

              </tr>
            </thead>

            <tbody>

              {!isLoading &&
                paginatedClients.map(
                  (client) => {

                    const expiring =
                      hasExpiringContract(
                        client
                      )

                    return (
                      <tr
                        key={client.id}
                        className="border-t border-gray-100 transition hover:bg-blue-50/40"
                      >

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <Link
                              href={`/clients/${client.id}`}
                              className="font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
                            >
                              {client.name}
                            </Link>

                            {expiring && (
                              <div
                                title="Есть договор, истекающий менее чем через месяц"
                                className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                              >
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Скоро истекает
                              </div>
                            )}

                          </div>

                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {client.inn}
                        </td>

                        <td className="px-6 py-5">

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                            {getContractsCount(
                              client
                            )}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                            {getActiveContractsCount(
                              client
                            )}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                            {
                              client.tasks
                                .length
                            }
                          </span>

                        </td>

                      </tr>
                    )
                  }
                )}

            </tbody>
          </table>

        </div>

        {isLoading && (
          <div className="p-12 text-center text-gray-500">
            Загрузка клиентов...
          </div>
        )}

        {!isLoading &&
          filteredClients.length ===
            0 && (
            <div className="p-12 text-center text-gray-500">
              Клиенты не найдены
            </div>
          )}
      </div>

      <ClientsPagination
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <CreateClientModal
        open={openCreate}
        onClose={() =>
          setOpenCreate(false)
        }
        onSave={(data) =>
          createClient.mutate(data)
        }
      />
    </div>
  )
}

export default ClientsTable