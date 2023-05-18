import { createTRPCRouter, publicProcedure, privateProcedure } from '../trpc'
import { z } from 'zod'

export const usersRouter = createTRPCRouter({
    getUserData: privateProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        if (!input.id) {
            throw new Error('No user id provided')
        }
        if (ctx.user.id === input.id) {
            return await ctx.prisma.user.findFirst({
                where: {
                    id: input.id
                }
            })
        } else {
            throw new Error(`You cannot access other users data ${input.id} ${ctx.user.id}`)
        }
    })
})