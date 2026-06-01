'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface Props {
  data: {
    periodStart: Date
    salary: number
  }[]
}

const SalaryChart = ({
  data,
}: Props) => {

  const chartData = data.map(
    (item) => ({
      month: format(
        new Date(item.periodStart),
        'LLL yyyy',
        {
          locale: ru,
        }
      ),

      salary: item.salary,
    })
  )

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-bold text-gray-800">
        Динамика зарплаты
      </h2>

      <div className="h-[350px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={chartData}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="salary"
              name="ЗП"
              stroke="#2563eb"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  )
}

export default SalaryChart