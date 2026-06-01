import UserCard from '~/app/_components/user/UserCard'

interface Props {
  params: Promise<{
    id: string
  }>
}

const UserPage = async ({
  params,
}: Props) => {
  const { id } = await params

  return (
    <div className="space-y-6">

      <UserCard userId={id} />

    </div>
  )
}

export default UserPage