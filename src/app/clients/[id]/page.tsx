import ClientCard from '~/app/_components/Clients/ClientCard'

interface Props {
  params: Promise<{
    id: string
  }>
}

const ClientPage = async ({
  params,
}: Props) => {
  const { id } = await params

  return (
    <div className="space-y-6">
      <ClientCard clientId={id} />
    </div>
  )
}

export default ClientPage