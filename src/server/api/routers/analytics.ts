import { z } from "zod";
import { kv } from "@vercel/kv";
import { createTRPCRouter, publicProcedure, privateProcedure  } from "~/server/api/trpc";

export const analyticsRouter = createTRPCRouter({
    getTotalAccessSite: privateProcedure.query(async () => {
        const totalAccessSite = await kv.get("totalAccessSite");
        return totalAccessSite
    })
});
