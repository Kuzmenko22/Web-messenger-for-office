'use client'

import Link from 'next/link'

interface Props {
  currentPage: number
  totalPages: number
}

const UsersPagination = ({
  currentPage,
  totalPages,
}: Props) => {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-2">

      <Link
        href={`?page=${Math.max(
          currentPage - 1,
          1
        )}`}
        className={`rounded-xl border px-4 py-2 text-sm transition ${
          currentPage === 1
            ? 'pointer-events-none opacity-50'
            : 'hover:bg-gray-100'
        }`}
      >
        Назад
      </Link>

      {Array.from({
        length: totalPages,
      }).map((_, index) => {
        const page = index + 1

        return (
          <Link
            key={page}
            href={`?page=${page}`}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border hover:bg-gray-100'
            }`}
          >
            {page}
          </Link>
        )
      })}

      <Link
        href={`?page=${Math.min(
          currentPage + 1,
          totalPages
        )}`}
        className={`rounded-xl border px-4 py-2 text-sm transition ${
          currentPage === totalPages
            ? 'pointer-events-none opacity-50'
            : 'hover:bg-gray-100'
        }`}
      >
        Далее
      </Link>
    </div>
  )
}

export default UsersPagination