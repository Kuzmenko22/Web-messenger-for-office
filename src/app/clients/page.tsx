import ClientsTable from '~/app/_components/Clients/ClientsTable'

interface Props {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

const ClientsPage = async ({
  searchParams,
}: Props) => {
  const params = await searchParams

  const page = Number(params.page ?? '1')
  const search = params.search ?? ''

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Клиенты
          </h1>

          <p className="mt-1 text-gray-500">
            Управление клиентами и договорами
          </p>
        </div>
      </div>

      <ClientsTable
        currentPage={page}
        search={search}
      />
    </div>
  )
}

export default ClientsPage