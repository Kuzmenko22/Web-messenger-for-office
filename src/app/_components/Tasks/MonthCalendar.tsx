'use client'

import { getMonthDates, cn } from '~/lib/utils'
import type { Task } from '~/types/task'
import { isSameDay, format, getDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useState } from 'react'

import TasksDialog from './TasksDialog'
import EditTaskModal from './EditTaskModal'
import { api } from '~/trpc/react'

interface MonthCalendarProps {
  currentDate: Date
  tasks: Task[]
}

const MonthCalendar = ({ currentDate, tasks }: MonthCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [newTaskDate, setNewTaskDate] = useState<Date | null>(null)

  const utils = api.useUtils()

  const createTask = api.task.create.useMutation({
    onSuccess: () =>
      utils.task.getByMonth.invalidate({
        date: currentDate,
      }),
  })

  const updateTask = api.task.update.useMutation({
    onSuccess: () =>
      utils.task.getByMonth.invalidate({
        date: currentDate,
      }),
  })

  const monthDates = getMonthDates(currentDate)
  const today = new Date()

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task)
  }

  const handleClose = () => {
    setTaskToEdit(null)
    setNewTaskDate(null)
  }

  const handleSaveTask = (data: any) => {
    const dueDate = new Date(data.date + 'T00:00:00')

    const payload = {
      title: data.title,
      description: data.description || undefined,
      dueDate,
      taskType: data.taskType,
      status: data.status,
      assignedToId: data.assignedToId,
      clientId: data.clientId ?? null,
      contractId: data.contractId ?? null,
      amount: data.amount,
      durationMonths: data.durationMonths,
    }

    if (data.id) {
      updateTask.mutate({ id: data.id, ...payload })
    } else {
      createTask.mutate(payload)
    }

    handleClose()
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-3">
        {monthDates.map(({ date, isCurrentMonth }) => {
          const dayTasks = tasks.filter((t) =>
            isSameDay(new Date(t.dueDate), date)
          )

          const contractCount = dayTasks.filter(
            (t) => t.taskType === 'CONTRACT'
          ).length

          const renewalCount = dayTasks.filter(
            (t) => t.taskType === 'RENEWAL'
          ).length

          const cancelCount = dayTasks.filter(
            (t) => t.taskType === 'CANCEL'
          ).length

          const otherCount = dayTasks.filter(
            (t) => t.taskType === 'OTHER'
          ).length

          const dayOfWeek = getDay(date)
          const weekdayColor =
            dayOfWeek === 0 || dayOfWeek === 6
              ? 'text-red-500'
              : 'text-gray-400'

          return (
            <div
              key={date.toISOString()}
              className={cn(
                'group relative flex min-h-[145px] flex-col rounded-2xl border bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg',

                isSameDay(date, today) &&
                  'border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-blue-100',

                !isCurrentMonth && 'border-gray-200 bg-gray-100 opacity-50'
              )}
            >

              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="text-xl font-bold text-gray-800">
                    {format(date, 'd')}
                  </div>

                  <div className="text-xs text-gray-400">
                    {format(date, 'MMMM', { locale: ru })}
                  </div>
                </div>

                <div className={`text-xs font-medium uppercase ${weekdayColor}`}>
                  {format(date, 'EEE', { locale: ru })}
                </div>
              </div>

              {dayTasks.length > 0 && (
                <div className="space-y-2 text-xs">

                  {contractCount > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-green-50 px-2 py-1">
                      <span className="text-green-700 font-medium">
                        Заключение
                      </span>
                      <span className="bg-green-600 text-white px-2 rounded">
                        {contractCount}
                      </span>
                    </div>
                  )}

                  {renewalCount > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-yellow-50 px-2 py-1">
                      <span className="text-yellow-700 font-medium">
                        Продление
                      </span>
                      <span className="bg-yellow-500 text-white px-2 rounded">
                        {renewalCount}
                      </span>
                    </div>
                  )}

                  {cancelCount > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-red-50 px-2 py-1">
                      <span className="text-red-700 font-medium">
                        Расторжение
                      </span>
                      <span className="bg-red-600 text-white px-2 rounded">
                        {cancelCount}
                      </span>
                    </div>
                  )}

                  {otherCount > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-gray-100 px-2 py-1">
                      <span className="text-gray-700 font-medium">
                        Другое
                      </span>
                      <span className="bg-gray-600 text-white px-2 rounded">
                        {otherCount}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-auto pt-4">
                {dayTasks.length > 0 ? (
                <button
                  onClick={() => setSelectedDate(date)}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-2 text-sm font-medium text-white shadow transition hover:from-blue-700 hover:to-blue-600"
                >
                Задачи ({dayTasks.length})
                </button>
                ) : (
                <button
                  onClick={() => setNewTaskDate(date)}
                  className="flex h-9 w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-2xl text-gray-400 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500"
                >
                +
                </button>
              )}
            </div>
            </div>
          )
        })}
      </div>

      <TasksDialog
        open={!!selectedDate}
        onOpenChange={() => setSelectedDate(null)}
        date={selectedDate}
        tasks={
          selectedDate
            ? tasks.filter((t) =>
                isSameDay(new Date(t.dueDate), selectedDate)
              )
            : []
        }
        onEditTask={handleEditTask}
      />

      <EditTaskModal
        task={taskToEdit}
        onClose={handleClose}
        onSave={handleSaveTask}
      />

      {newTaskDate && (
        <EditTaskModal
          task={null}
          defaultDate={format(newTaskDate, 'yyyy-MM-dd')}
          onClose={handleClose}
          onSave={handleSaveTask}
        />
      )}
    </>
  )
}

export default MonthCalendar