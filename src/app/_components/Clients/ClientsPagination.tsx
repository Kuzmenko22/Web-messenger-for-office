'use client'

import Link from 'next/link'

interface Props {
  currentPage: number
  totalPages: number
}

const ClientsPagination = ({
  currentPage,
  totalPages,
}: Props) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">

      {Array.from({
        length: totalPages,
      }).map((_, i) => {
        const page = i + 1

        return (
          <Link
            key={page}
            href={`/clients?page=${page}`}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              currentPage === page
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {page}
          </Link>
        )
      })}
    </div>
  )
}

export default ClientsPagination