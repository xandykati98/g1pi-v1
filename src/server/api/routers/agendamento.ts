import { createTRPCRouter, publicProcedure, privateProcedure, supabase } from '../trpc'
import { z } from 'zod'
import { faker } from '@faker-js/faker';
import { Agendamento } from '@prisma/client';
import { prisma } from '~/server/db';

export interface AgendamentoJoin extends Agendamento {
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
    toggleConfirmado: privateProcedure.input(z.object({ id: z.string(), new_val: z.boolean() })).mutation(async ({ ctx, input }) => {
        const { data, error } = await supabase
            .from('Agendamento')
            .update({ confirmado: input.new_val })
            .eq('id', input.id)
        if (error) {
            throw new Error(error.message)
        }
        return { ok: true }
    }),
    getAgendamentos: privateProcedure.query(async ({ ctx }) => {
        const { data: agendamentos, error } = await supabase
            .from('Agendamento')
            // join with user table using hint disambiguantion
            .select('*, funcionario:funcionarioId(nome), cliente:clienteId(nome)')
        if (error) {
            throw new Error(error.message)
        }
        return agendamentos as AgendamentoJoin[]
    }),
    deleteAgendamentos: privateProcedure.input(z.object({ ids: z.array(z.string()) })).mutation(async ({ ctx, input }) => {
        const { error } = await supabase
            .from('Agendamento')
            .delete()
            .in('id', input.ids)
        if (error) {
            throw new Error(error.message)
        }
        return { ok: true }
    }),
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
            .select('confirmado, cliente:clienteId(nome)')
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
        return agendamentos as AgendamentoJoin[]
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
    createAgendamento: privateProcedure.input(z.object({
        data: z.string(),
        preco: z.number(),
        confirmado: z.boolean(),
        funcionarioId: z.string(),
        clienteId: z.string(),
        descricao: z.string().optional()
    })).mutation(async ({ ctx, input }) => {
        const { data, error } = await supabase.from('Agendamento').insert([{
            id: faker.datatype.uuid(),
            data: new Date(input.data),
            preco: input.preco,
            confirmado: input.confirmado,
            funcionarioId: input.funcionarioId,
            clienteId: input.clienteId,
            descricao: input.descricao
        }])
        if (error) {
            throw new Error(error.message)
        }
        return { ok: true }
    }),
    /*
    __gerarAgendamentos: privateProcedure.mutation(async ({ ctx }) => {
        const {data:ids_funcionarios} = (await supabase.from('User').select('id').eq('isFuncionario', true))
        const {data:ids_clientes} = (await supabase.from('User').select('id').eq('isCliente', true))
        if (!ids_clientes) return { ok: false }
        if (!ids_funcionarios) return { ok: false }

        const agendamentos = []

        for (let i = 0; i < 100; i++) {
            const agendamento = {
                id: faker.datatype.uuid(),
                data: faker.date.anytime().toISOString(),
                preco: faker.datatype.number({ min: 10, max: 100 }),
                confirmado: faker.datatype.boolean(),
                funcionarioId: faker.helpers.arrayElement(ids_funcionarios).id as string,
                clienteId: faker.helpers.arrayElement(ids_clientes).id as string,
                descricao: faker.lorem.sentence(),
                createdAt: faker.date.anytime().toISOString()
            }
            agendamentos.push(agendamento)
        }
        for (const agendamento of agendamentos) {
            const a = await supabase.from('Agendamento').upsert(agendamento)
            console.log(a.statusText, a.error)
        }
    })
    */
})