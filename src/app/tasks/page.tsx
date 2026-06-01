'use client'

import { useState } from 'react'
import { addMonths, format } from 'date-fns'
import { ru } from 'date-fns/locale'

import MonthCalendar from '~/app/_components/Tasks/MonthCalendar'
import { api } from '~/trpc/react'

export default function TasksPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const { data, isLoading } = api.task.getByMonth.useQuery({
    date: currentDate,
  })

  const tasks = data ?? []

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4 items-center">
        <button
          onClick={() => setCurrentDate((p) => addMonths(p, -1))}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-lg font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
        >
          ←
        </button>

        <h2 className="text-xl font-bold capitalize text-gray-800">
          {format(currentDate, 'LLLL yyyy', { locale: ru })}
        </h2>

        <button
          onClick={() => setCurrentDate((p) => addMonths(p, 1))}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-lg font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
        >
          →
        </button>
      </div>

      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <MonthCalendar currentDate={currentDate} tasks={tasks} />
      )}
    </div>
  )
}