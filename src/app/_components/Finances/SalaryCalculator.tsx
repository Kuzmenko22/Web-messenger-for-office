'use client'

import { useState } from 'react'

import { api } from '~/trpc/react'

interface Props {
  user: any
}

const SalaryCalculator = ({
  user,
}: Props) => {
  const [selectedMonth, setSelectedMonth] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 7)
    )

    const parts =
    selectedMonth
      .split('-')
      .map(Number)
  
    const year = parts[0]!
    const month = parts[1]!

  const { data: stats, isLoading } =
    api.finances.calculateSalary.useQuery({
      userId: user.id,

      year,

      month,
    })

  const generateReport =
    api.finances.generateMonthlyReport.useMutation({
      onSuccess: () => {
        alert('Отчет успешно сохранен')
      },
    })

  const formatMoney = (
    amount: number
  ) => {
    return new Intl.NumberFormat(
      'ru-RU',
      {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
      }
    ).format(amount)
  }

  if (isLoading || !stats) {
    return (
      <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
        Загрузка финансовой статистики...
      </div>
    )
  }

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">
            Калькулятор заработной платы
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Финансовая статистика сотрудника за выбранный месяц
          </p>

        </div>

        <div className="flex items-center gap-3">

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(
            e.target.value
            )
          }
          className="rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
        />

        <button
          onClick={() =>
            generateReport.mutate({
              userId: user.id,
              year,
              month,
            })
          }
          disabled={generateReport.isPending}
          className="rounded-2xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {generateReport.isPending
            ? 'Сохранение...'
            : 'Сохранить отчет'}
        </button>

      </div>

      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-green-100 bg-green-50 p-5">

          <div className="text-sm text-green-500">
            Новые договоры
          </div>

          <div className="mt-2 text-3xl font-bold text-green-700">
            {stats.contractTasks}
          </div>

        </div>

        <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-5">

          <div className="text-sm text-yellow-600">
            Продления
          </div>

          <div className="mt-2 text-3xl font-bold text-yellow-700">
            {stats.renewalTasks}
          </div>

        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

          <div className="text-sm text-blue-600">
            Выполненные другие задачи
          </div>

          <div className="mt-2 text-3xl font-bold text-blue-700">
            {stats.completedTasks}
          </div>

        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">

          <div className="text-sm text-purple-600">
            Сумма зайдествованных в данный месяц договоров
          </div>

          <div className="mt-2 text-2xl font-bold text-purple-700">
            {formatMoney(
              stats.totalContractsAmount
            )}
          </div>

        </div>

      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">

        <div className="rounded-3xl border bg-gray-50 p-6">

          <div className="text-sm text-gray-500">
            Базовая ставка
          </div>

          <div className="mt-2 text-3xl font-bold text-gray-800">
            {formatMoney(
              stats.baseSalary
            )}
          </div>

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

          <div className="text-sm text-blue-500">
            Бонусы
          </div>

          <div className="mt-2 text-3xl font-bold text-blue-700">

            {formatMoney(
              stats.kpi +
                stats.contractPercent
            )}

          </div>

        </div>

        <div className="rounded-3xl border border-green-200 bg-green-50 p-6">

          <div className="text-sm text-green-600">
            Итоговая заработная плата
          </div>

          <div className="mt-2 text-4xl font-bold text-green-700">

            {formatMoney(
              stats.finalSalary
            )}

          </div>

        </div>

      </div>

      <div className="mt-6 rounded-3xl border border-dashed p-5 text-sm text-gray-600">

        <div className="font-semibold text-gray-800">
          Формула расчета
        </div>

        <div className="mt-3 space-y-2">

        <div>
          • Базовая ставка:
          {' '}
          {formatMoney(stats.baseSalary)}
        </div>

          <div>
            • Заключение нового договора:
            +3000 ₽ Бонус
          </div>

          <div>
            • Успешное продление договора:
            +1500 ₽ Бонус
          </div>

          <div>
            • Выполненная другая задача:
            +500 ₽ Бонус
          </div>

          <div>
            • Процент от суммы новых заключенных договоров:
            5%
          </div>

        </div>

      </div>

    </div>
  )
}

export default SalaryCalculator