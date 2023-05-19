import { createTRPCRouter, publicProcedure, privateProcedure, supabase } from '../trpc'
import { z } from 'zod'

export const userRouter = createTRPCRouter({
    createUser: publicProcedure.input(z.object({ 
        email: z.string(), 
        password: z.string(),
        nome: z.string() 
    })).mutation(async ({ ctx, input }) => {
        if (!input.email || !input.password || !input.nome) {
            throw new Error('Preencha todos os campos')
        }
        const { data: createUserData, error: createUserError } = await supabase.auth.admin.createUser({
            email: input.email,
            email_confirm: true,
            password: input.password,
        })
        if (createUserError) {
            throw new Error(createUserError.message)
        }
        if (createUserData.user) {
            const { error: upsertError } = await supabase
                .from('User')
                .upsert({ 
                    id: createUserData.user.id,
                    nome: input.nome,
                    createdAt: createUserData.user.created_at,
                    isAdmin: false,
                    isActive: false,
                    isCliente: false,
                })
            if (upsertError) {
                throw new Error(upsertError.message)
            }
        }
        return { password: input.password, email: input.email }
    })
})