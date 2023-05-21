import Layout from './layout'
import { Metadata, type NextPage } from "next";
import { Button } from "components/ui/button"

import { Activity, CreditCard, DollarSign, Download, Users } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"
import { CalendarDateRangePicker } from "components/dashboard/date-range-picker"
import { MainNav } from "components/dashboard/main-nav2"
import { Overview } from "components/dashboard/overview"
import { RecentSales } from "components/dashboard/recent-sales"
import { Search } from "components/dashboard/search"
import TeamSwitcher from "components/dashboard/team-switcher"
import { UserNav } from "components/dashboard/user-nav"
import { api } from '~/utils/api';
import { dateToDDMMYYYY } from '~/utils/datestuff';
import { useState } from 'react';
import { DataTable } from 'components/clientes/data-table/data-table-component';
import { columns } from 'components/clientes/data-table/columns-agendamentos';
import { Input } from 'components/ui/input';
import { User } from '@prisma/client';

export default function Page() {
    const { data: agendamentos, error, isLoading, refetch } = api.agendamento.getAgendamentos.useQuery()
    const mutationToggleStatus = api.agendamento.toggleConfirmado.useMutation();
    const mutationDelete = api.agendamento.deleteAgendamentos.useMutation();

    const mutateExcluir = async (ids: string[]) => {
        await mutationDelete.mutateAsync({ids})
        await refetch()
        return { ok: true }
    }
    const mutateToggleStatus = async (id: string, new_val: boolean) => {
        await mutationToggleStatus.mutateAsync({id, new_val})
        await refetch()
        return { ok: true }
    }
    const [nameFilter, setNameFilter] = useState('')
    if (isLoading) return <div></div>
    if (error) return <div>Erro: {error.message}</div>

    const filteredAgendamentos = agendamentos.filter(agendamento => agendamento.cliente.nome.toLowerCase().includes(nameFilter.toLowerCase()))

    return <div className="flex-1 space-y-4 p-8 pt-6">
    <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Agendamentos</h2>
        <div className="flex items-center space-x-2">
        
            <Input
                type="search"
                placeholder="Busque por nome de cliente"
                className="h-9 md:w-[100px] lg:w-[300px]"
                onChange={e => setNameFilter(e.target.value)}
                value={nameFilter}
            />
            <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
            </Button>
        </div>
    </div>
    <DataTable columns={columns} deleteMutate={mutateExcluir} refetch={refetch} data={filteredAgendamentos
    .map(agendamento => ({
        ...agendamento, 
        mutateExcluir: () => mutateExcluir([agendamento.id]),
        mutateToggleStatus: () => mutateToggleStatus(agendamento.id, !agendamento.confirmado ),
    })).sort((a, b) => new Date(b.data).getTime()-new Date(a.data).getTime())
    } />
    </div>
}

Page.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}