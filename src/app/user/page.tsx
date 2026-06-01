import UsersTable from '~/app/_components/user/UsersTable'

interface Props {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

const UsersPage = async ({
  searchParams,
}: Props) => {
  const params = await searchParams

  const page = Number(params.page ?? 1)

  const search = params.search ?? ''

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Центр сотрудников
        </h1>

        <p className="mt-2 text-gray-500">
          Управление сотрудниками и статистика
        </p>
      </div>

      <UsersTable
        currentPage={page}
        search={search}
      />
    </div>
  )
}

export default UsersPage