import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { z } from "zod";


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient ({ adapter });


const QueryInputSchema = z.object({
    model: z.enum(["User", "Order"]),
    action: z.enum(["findMany", "findFirst", "findUnique", "count"]),
    args: z
        .object({
            where: z.record(z.string(), z.unknown()).optional(),
            select: z.record(z.string(), z.boolean()).optional(),
            orderBy: z.record(z.string(), z.unknown()).optional(),
            take: z.number().int().positive().max(100).optional(),
            skip: z.number().int().nonnegative().optional(),
        })
        .optional()
        .default({}),
});

export type QueryInput = z.infer<typeof QueryInputSchema>;

export async function runQuery(input: unknown) {
    const { model, action, args } = QueryInputSchema.parse(input);

    const prismaModel = prisma[model.toLowerCase() as keyof typeof prisma] as any;
    if (!prismaModel || typeof prismaModel[action] !== "function") {
        throw new Error(`Invalid model or action: ${model}.${action}`); 
    }

    const result = await prismaModel[action](args);
    return result;
}

