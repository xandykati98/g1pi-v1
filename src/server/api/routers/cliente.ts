import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure, supabase  } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const clienteRouter = createTRPCRouter({
    getClientes: privateProcedure.query(async ({ ctx, input }) => {
        const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('isCliente', true)
        
        if (error) throw new Error(error.message)
        return data as User[]
    }),
    deleteClientes: privateProcedure.input(z.object({ ids: z.array(z.string()) })).mutation(async ({ ctx, input }) => {
        try {
            for await (const id of input.ids) {
                await supabase.auth.admin.deleteUser(id)
            }
        } catch (e) {
            console.log(e)
        }

        const { error } = await supabase
        .from('User')
        .delete()
        .in('id', input.ids)
        
        if (error) throw new Error(error.message)
        return { ok: true }
    })
});
