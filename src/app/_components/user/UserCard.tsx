'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { useState } from 'react'

import { api } from '~/trpc/react'

import EditUserModal from './EditUserModal'

import SalaryCalculator from '../Finances/SalaryCalculator'

import SalaryChart from '../Finances/SalaryChart'

interface Props {
  userId: string
}

const UserCard = ({
  userId,
}: Props) => {
  const [editOpen, setEditOpen] =
    useState(false)

  const utils = api.useUtils()

  const { data: user, isLoading } =
    api.user.getById.useQuery({
      id: userId,
    })

    const { data: history = [] } =
    api.finances.getHistory.useQuery({
      userId,
    })

  const { data: currentUser } =
    api.user.getCurrent.useQuery()

  const role = currentUser?.role

  const canViewFinance =
    role === 'ADMIN' ||
    role === 'SENIOR_MANAGER' ||
    (role === 'MANAGER' && currentUser?.id === userId)

  const updateUser =
    api.user.update.useMutation({
      onSuccess: async () => {
        await utils.user.getById.invalidate({
          id: userId,
        })

        setEditOpen(false)
      },
    })

  const getRoleLabel = (
    role: string
  ) => {
    switch (role) {
      case 'ADMIN':
        return 'Администратор'

      case 'SENIOR_MANAGER':
        return 'Старший менеджер'

      default:
        return 'Менеджер'
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        Загрузка...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        Сотрудник не найден
      </div>
    )
  }


  return (
    <div className="space-y-6">

      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-lg">

        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              {user.surname}{' '}
              {user.firstname}{' '}
              {user.lastname}
            </h1>

            <div className="mt-3 flex flex-wrap gap-3">

              <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
                {getRoleLabel(
                  user.role
                )}
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
                {user.email}
              </span>

            </div>

          </div>

        {currentUser?.role === 'ADMIN' && (
          <button
            onClick={() =>
              setEditOpen(true)
            }
            className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/20"
          >
            Редактировать
          </button>
        )}

        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        <div className="rounded-3xl border bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Доп. информация
          </h2>

          <div className="space-y-4 text-sm">

            <div>
              <div className="text-gray-400">
                Телефон
              </div>

              <div className="mt-1 font-medium text-gray-700">
                {user.phone || '—'}
              </div>
            </div>

            <div>
              <div className="text-gray-400">
                Количество задач
              </div>

              <div className="mt-1 text-2xl font-bold text-gray-800">
                {user.tasks.length}
              </div>
            </div>

            <div>
              <div className="text-gray-400">
                Количество договоров
              </div>

              <div className="mt-1 text-2xl font-bold text-gray-800">
                {user.contracts.length}
              </div>
            </div>

          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm xl:col-span-2">

          <h2 className="mb-5 text-xl font-bold text-gray-800">
            Договоры
          </h2>

          <div className="space-y-4">

            {user.contracts.map(
              (contract) => (
                <div
                  key={contract.id}
                  className="rounded-2xl border p-5"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <div className="text-lg font-semibold text-gray-800">
                        Договор №
                        {
                          contract.number
                        }
                      </div>

                      <div className="mt-1 text-sm text-gray-500">
                        Клиент:{' '}
                        {
                          contract.client
                            .name
                        }
                      </div>

                    </div>

                    <div className="text-right">

                      <div className="text-sm text-gray-400">
                        Сумма
                      </div>

                      <div className="text-xl font-bold text-gray-800">

                        {new Intl.NumberFormat(
                          'ru-RU',
                          {
                            style:
                              'currency',
                            currency:
                              'RUB',
                            maximumFractionDigits: 0,
                          }
                        ).format(
                          contract.amount
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        </div>

      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xl font-bold text-gray-800">
          Задачи сотрудника
        </h2>

        <div className="space-y-3">

          {user.tasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-2xl border p-4 ${
                task.taskType === 'CONTRACT'
                  ? 'border-green-200 bg-green-50'
                  : task.taskType === 'RENEWAL'
                    ? 'border-yellow-200 bg-yellow-50'
                    : task.taskType === 'CANCEL'
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
              }`}
            >

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <div className="font-semibold text-gray-800">
                    {task.title}
                  </div>

                  {task.client && (
                    <div className="mt-1 text-sm text-gray-500">
                      Клиент:{' '}
                      {
                        task.client
                          .name
                      }
                    </div>
                  )}

                </div>

                <div className="text-sm text-gray-500">

                  {format(
                    new Date(
                      task.dueDate
                    ),
                    'dd MMMM yyyy',
                    {
                      locale: ru,
                    }
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>
      </div>

    {canViewFinance && (
      <SalaryCalculator
        user={user}
      />
    )}

    {canViewFinance && (
      <SalaryChart
        data={history}
      />
    )}

      <EditUserModal
        open={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
        user={user}
        onSave={(data) =>
          updateUser.mutate(data)
        }
      />

    </div>
  )
}

export default UserCard