"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { api } from "~/utils/api"

const data = [
  {
    name: "Jan",
    total: 0,
    i: 0
  },
  {
    name: "Fev",
    total: 0,
    i: 1
  },
  {
    name: "Mar",
    total: 0,
    i: 2
  },
  {
    name: "Abr",
    total: 0,
    i: 3
  },
  {
    name: "Mai",
    total: 0,
    i: 4
  },
  {
    name: "Jun",
    total: 0,
    i: 5
  },
  {
    name: "Jul",
    total: 0,
    i: 6
  },
  {
    name: "Ago",
    total: 0,
    i: 7
  },
  {
    name: "Set",
    total: 0,
    i: 8
  },
  {
    name: "Out",
    total: 0,
    i: 9
  },
  {
    name: "Nov",
    total: 0,
    i: 10
  },
  {
    name: "Dez",
    total: 0,
    i: 11
  },
]
export function Overview() {
  const { data: agendamentos, error, isLoading } = api.agendamento.getAgendamentosAnuais.useQuery()
  if (error) return <div>Error: {error.message}</div>
  if (isLoading) return <div></div>
  const monthMap = new Map<number, number>()
  for (const { data } of agendamentos) {
    const agendamentoDate = new Date(data) 
    if (agendamentoDate.getFullYear() !== new Date().getFullYear()) continue
    const month = agendamentoDate.getMonth()
    const total = monthMap.get(month) || 0
    monthMap.set(month, total + 1)
  }
  for (const item of data) {
    item.total = monthMap.get(item.i) || item.total
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value:string) => `${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
