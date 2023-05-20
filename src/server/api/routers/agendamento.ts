import { createTRPCRouter, publicProcedure, privateProcedure, supabase } from '../trpc'
import { z } from 'zod'
import { faker } from '@faker-js/faker';
/**

model User {
    id          String  @id @default(uuid())
    nome        String
    createdAt   DateTime @default(now())
    isAdmin     Boolean @default(false)
    isActive    Boolean @default(false)
    isCliente   Boolean @default(false)
    FuncionarioAgendamentos Agendamento[] @relation(name: "FuncionarioAgendamentos")
    ClienteAgendamentos Agendamento[] @relation(name: "ClienteAgendamentos")
}

model Agendamento {
    id            String        @id @default(uuid())
    data          DateTime
    descricao     String
    createdAt     DateTime      @default(now())
    funcionario   User?         @relation(name: "FuncionarioAgendamentos", fields: [funcionarioId], references: [id])
    funcionarioId String?
    cliente       User?         @relation(name: "ClienteAgendamentos", fields: [clienteId], references: [id])
    clienteId     String?

    preco         Float?
    confirmado    Boolean       @default(false)
}
 */
export const agendamentoRouter = createTRPCRouter({
    getAgendamentosRecentes: privateProcedure.query(async ({ ctx }) => {
        const { data: agendamentos, error } = await supabase
            .from('Agendamento')
            // join with user table using hint disambiguantion
            .select('*, funcionario:funcionarioId(nome), cliente:clienteId(nome)')
            .order('data', { ascending: false })
            .limit(5)
        if (error) {
            throw new Error(error.message)
        }
        return agendamentos
    }),
    countAgendamentosEsseMes: privateProcedure.query(async ({ ctx }) => {
        const { data: agendamentos, error } = await supabase
            .from('Agendamento')
            .select('*', { count: 'exact' })
            .order('data', { ascending: false })
            .gte('data', new Date().toISOString())
            .lte('data', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString())
            
        if (error) {
            throw new Error(error.message)
        }
        return agendamentos.length
    }),
})