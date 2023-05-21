import { prisma } from '~/server/db'
import { createTRPCRouter, publicProcedure, privateProcedure, supabase, adminProcedure } from '../trpc'
import { z } from 'zod'
import { faker } from '@faker-js/faker'

export const funcionarioRouter = createTRPCRouter({
    getFuncionarioData: privateProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        if (!input.id) {
            throw new Error('No user id provided')
        }
        if (ctx.user.id === input.id) {
            return await ctx.prisma.user.findFirst({
                where: {
                    id: input.id,
                    isFuncionario: true,
                }
            })
        } else {
            throw new Error(`You cannot access other users data ${input.id} ${ctx.user.id}`)
        }
    }),
    getFuncionarios: privateProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.user.findMany({
            where: {
                isFuncionario: true,
            }
        })
    }),
    createFuncionario: adminProcedure.input(z.object({ email: z.string(), password: z.string(), nome: z.string(), isAdmin: z.boolean() })).mutation(async ({ ctx, input }) => {
        try {
            await prisma.user.create({
                data: {
                    email: input.email,
                    nome: input.nome,
                    createdAt: new Date(),
                    id: faker.datatype.uuid(),
                    isAdmin: input.isAdmin,
                    isFuncionario: true,
                    isCliente: false
                }
            })
            const { data, error } = await supabase.auth.admin.createUser({
                email: input.email,
                email_confirm: true,
                password: input.password,
            })
            if (error) throw new Error(error.message)
            return { ok: true }
        } catch (error) {
            console.log(error)
        }
    }),
    deleteFuncionarios: privateProcedure.input(z.object({ ids: z.array(z.string()) })).mutation(async ({ ctx, input }) => {
        try {
            for await (const id of input.ids) {
                await supabase.auth.admin.deleteUser(id)
            }
        } catch (e) {
            console.log(e)
        }
        return await ctx.prisma.user.deleteMany({
            where: {
                id: {
                    in: input.ids,
                },
            },
        })
    })
})