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
import Analytics from 'components/dashboard/analytics';
import { useContext } from 'react';
import AuthContext from 'components/auth_context';

export default function Page() {
    const auth_context = useContext(AuthContext)
    
    const { data: agendamentosCount, error: agendamentosCountError} = api.agendamento.countAgendamentosEsseMes.useQuery();
    
    const { data: rendaHojeData, error: rendaHojeError, isLoading: isLoadingRenda } = api.agendamento.getRendaHoje.useQuery();

    const { data: agendamentosRecentes, error: errorAgendamentosRecentes, isLoading: isLoadingAgendamentosRecentes } =  api.agendamento.getAgendamentosRecentes.useQuery()

    const { data: agendamentosHoje, error: agendamentosHojeError, isLoading: isLoadingAgendamentosHoje } = api.agendamento.getAgendamentosHoje.useQuery();

    const rendaHoje = rendaHojeData?.reduce((prev, curr) => { prev+=curr.preco ;return prev;}, 0) || 0;

    if (agendamentosCountError) return <div>Error: {agendamentosCountError.message}</div>
    if (rendaHojeError) return <div>Error: {rendaHojeError.message}</div>
    if (agendamentosHojeError) return <div>Error: {agendamentosHojeError.message}</div>
    if (errorAgendamentosRecentes) return <div>Error: {errorAgendamentosRecentes.message}</div>

    const nextAgendamento = agendamentosRecentes?.[0];

    return <div className="flex-1 space-y-4 p-8 pt-6">
    <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
        <CalendarDateRangePicker />
        <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
        </Button>
        </div>
    </div>
    <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
            <TabsTrigger value="overview">Visão geral</TabsTrigger>
            <TabsTrigger value="analytics" disabled={!auth_context.isAdmin}>
                Analytics
            </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Renda estimada hoje
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{isLoadingRenda ? 'Carregando...' : `R$ ${rendaHoje}`}</div>
                <p className="text-xs text-muted-foreground">
                Soma de todos os valores de agendamentos de hoje
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Agendamentos hoje
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{ isLoadingAgendamentosHoje ? 'Carregando...' : agendamentosHoje.total }</div>
                <p className="text-xs text-muted-foreground">
                    Agendamentos <b>confirmados:</b> { isLoadingAgendamentosHoje ? 'Carregando...' : agendamentosHoje.confirmados }
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximo agendamento</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{nextAgendamento ? nextAgendamento?.funcionario.nome : 'Indef.'}</div>
                <p className="text-xs text-muted-foreground">
                {nextAgendamento ? `Cliente: ${nextAgendamento.cliente.nome}, Data: ${dateToDDMMYYYY(new Date(nextAgendamento.data))}` : 'Nenhum agendamento próximo'}
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Visitas no site
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                Campo desabilitado 
                </p>
            </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Agendamentos anuais</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <Overview />
                </CardContent>
            </Card>
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Agendamentos Próximos</CardTitle>
                    <CardDescription>
                    {
                        agendamentosCountError ? 'Erro ao carregar os agendamentos deste mês' : agendamentosCount ? `Um total de ${agendamentosCount} agendamentos estão marcados para este mês` : 'Carregando...'
                    }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RecentSales data={agendamentosRecentes || []} isLoading={isLoadingAgendamentosRecentes} />
                </CardContent>
            </Card>
        </div>
        </TabsContent>
        <TabsContent value="analytics">
            <Analytics/>
        </TabsContent>
    </Tabs>
    </div>
}
 
Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
        {page}
    </Layout>
  )
}