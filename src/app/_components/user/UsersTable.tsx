'use client'

import Link from 'next/link'

import { useMemo, useState } from 'react'

import { api } from '~/trpc/react'

import UserAddForm from './UserAddForm'
import UsersPagination from './UsersPagination'

interface Props {
  currentPage: number
  search: string
}

const ITEMS_PER_PAGE = 10

const UsersTable = ({
  currentPage,
  search,
}: Props) => {
  const [searchValue, setSearchValue] =
    useState(search)

  const [openCreate, setOpenCreate] =
    useState(false)

  const utils = api.useUtils()

  const { data: users = [], isLoading } =
    api.user.getAll.useQuery()

  const { data: currentUser } =
    api.user.getCurrent.useQuery()

  const createUser =
    api.user.create.useMutation({
      onSuccess: async () => {
        await utils.user.getAll.invalidate()

        setOpenCreate(false)
      },
    })

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const value =
        searchValue.toLowerCase()

      const fullName = `${user.surname ?? ''} ${user.firstname ?? ''} ${user.lastname ?? ''}`.toLowerCase()

      return (
        fullName.includes(value) ||
        user.email
          ?.toLowerCase()
          .includes(value)
      )
    })
  }, [users, searchValue])

  const totalPages = Math.ceil(
    filteredUsers.length /
      ITEMS_PER_PAGE
  )

  const paginatedUsers =
    filteredUsers.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,

      currentPage * ITEMS_PER_PAGE
    )

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

  return (
    <div className="space-y-5">

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        <input
          placeholder="Поиск сотрудника по ФИО или Email..."
          value={searchValue}
          onChange={(e) =>
            setSearchValue(
              e.target.value
            )
          }
          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 md:max-w-md"
        />

      {currentUser?.role === 'ADMIN' && (
        <button
          onClick={() =>
            setOpenCreate(true)
          }
          className="rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Добавить сотрудника
        </button>
      )}

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">

        <table className="w-full border-collapse">

          <thead className="bg-gray-50">

            <tr className="text-left text-sm text-gray-500">

              <th className="px-6 py-4">
                Сотрудник
              </th>

              <th className="px-6 py-4">
                Email
              </th>

              <th className="px-6 py-4">
                Роль
              </th>

              <th className="px-6 py-4">
                Задачи
              </th>

              <th className="px-6 py-4">
                Договоры
              </th>

            </tr>
          </thead>

          <tbody>

            {!isLoading &&
              paginatedUsers.map(
                (user) => (
                  <tr
                    key={user.id}
                    className="border-t transition hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">

                      <Link
                        href={`/user/${user.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {user.surname}{' '}
                        {
                          user.firstname
                        }{' '}
                        {
                          user.lastname
                        }
                      </Link>

                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">

                        {getRoleLabel(
                          user.role
                        )}

                      </span>

                    </td>

                    <td className="px-6 py-4">
                      {
                        user.tasks.length
                      }
                    </td>

                    <td className="px-6 py-4">
                      {
                        user.contracts
                          .length
                      }
                    </td>

                  </tr>
                )
              )}

          </tbody>
        </table>

        {!isLoading &&
          filteredUsers.length ===
            0 && (
            <div className="p-10 text-center text-gray-500">
              Сотрудники не найдены
            </div>
          )}

      </div>

      <UsersPagination
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <UserAddForm
        open={openCreate}
        onClose={() =>
          setOpenCreate(false)
        }
        onSave={(data) =>
          createUser.mutate(data)
        }
      />
    </div>
  )
}

export default UsersTable