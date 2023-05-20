import { createTRPCRouter, publicProcedure, privateProcedure, supabase } from '../trpc'
import { z } from 'zod'
import { faker } from '@faker-js/faker';
import { Agendamento } from '@prisma/client';

export interface AgendamentoRecente extends Agendamento {
    funcionario: {
        nome: string
    }
    cliente: {
        nome: string
    }
}

interface AgendamentoOnlyData {
    data: string
}
export const agendamentoRouter = createTRPCRouter({
    getRendaHoje: privateProcedure.query(async ({ ctx }) => {
        const initToday = new Date()
        initToday.setHours(0, 0, 0, 0)
        const endToday = new Date()
        endToday.setHours(23, 59, 59, 999)

        const { data: agendamentos, error } = await supabase
            .from('Agendamento')
            .select('preco')
            .eq('confirmado', true)
            .gte('data', initToday.toISOString())
            .lte('data', endToday.toISOString())
        if (error) {
            throw new Error(error.message)
        }
        return agendamentos
    }),
    getAgendamentosHoje: privateProcedure.query(async ({ ctx }) => {
        const initToday = new Date()
        initToday.setHours(0, 0, 0, 0)
        const endToday = new Date()
        endToday.setHours(23, 59, 59, 999)

        const { data: agendamentos, error } = await supabase
            .from('Agendamento')
            .select('confirmado')
            .gte('data', initToday.toISOString())
            .lte('data', endToday.toISOString())
        if (error) {
            throw new Error(error.message)
        }
        return {
            confirmados: agendamentos.filter(agendamento => agendamento.confirmado === true).length,
            total: agendamentos.length
        }
    }),
    getAgendamentosAnuais: privateProcedure.query(async ({ ctx }) => {
        const { data: agendamentos, error } = await supabase
            .from('Agendamento')
            // join with user table using hint disambiguantion
            .select('data')
            .gte('data', new Date(new Date().getFullYear(), 0, 1).toISOString())
            .lte('data', new Date(new Date().getFullYear(), 11, 31).toISOString())
        if (error) {
            throw new Error(error.message)
        }
        return agendamentos as AgendamentoOnlyData[]
    }),
    getAgendamentosRecentes: privateProcedure.query(async ({ ctx }) => {
        const { data: agendamentos, error } = await supabase
            .from('Agendamento')
            // join with user table using hint disambiguantion
            .select('*, funcionario:funcionarioId(nome), cliente:clienteId(nome)')
            .order('data', { ascending: true })
            .gte('data', new Date().toISOString())
            .lte('data', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString())
            .limit(5)
        if (error) {
            throw new Error(error.message)
        }
        return agendamentos as AgendamentoRecente[]
    }),
    countAgendamentosEsseMes: privateProcedure.query(async ({ ctx }) => {
        const { data: agendamentos, error } = await supabase
            .from('Agendamento')
            .select('*', { count: 'exact' })
            .gte('data', new Date().toISOString())
            .lte('data', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString())
            
        if (error) {
            throw new Error(error.message)
        }
        return agendamentos.length
    }),
})