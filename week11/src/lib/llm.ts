import { GoogleGenerativeAI, Tool, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { getSchemaAsText } from "./schemaReader";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Tool definition ที่ส่งให้ AI รู้จัก
const tools: Tool[] = [
    {
        functionDeclarations: [
            {
                name: "query",
                description: "Query the database using Prisma. Use this to retrieve data.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        model: {
                            type: SchemaType.STRING,
                            description: "The Prisma model name (e.g., User, Order)",
                        },
                        action: {
                            type: SchemaType.STRING,
                            description: "The Prisma action: findMany, findFirst, findUnique, count",
                        },
                        args: {
                            type: SchemaType.OBJECT,
                            description: "Prisma query arguments (where, select, orderBy, take, skip)",
                            properties: {},
                        },
                    },
                    required: ["model", "action"],
                },
            } as FunctionDeclaration,
        ],
    },
];

export async function askAI(userMessage: string): Promise<string> {
    const schemaText = getSchemaAsText();

    const systemInstruction = `
You are an AI assistant that helps users query a database.
You have access to the following database schema:

${schemaText}

## Available Tools
- query(model, action, args): Query the database

## Rules
- ALWAYS use tools to retrieve data. Never answer from memory.
- NEVER write raw SQL or suggest SQL queries.
- Only use models and fields defined in the schema.
- If the user asks for data that doesn't exist in schema, explain it politely.
- Respond in the same language as the user's message.
- Format results clearly. If result is a list, summarize the count first.

## Examples
User: "เอา user ทั้งหมด"
-> Call: query({ model: "User", action: "findMany", args: {} })
-> Reply: "พบ user ทั้งหมด X คน ..."
`.trim();

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        systemInstruction,
        tools,
    });

    const chat = model.startChat();
    let response = await chat.sendMessage(userMessage);

    // Handle function call loop
    while (response.response.functionCalls()?.length) {
        const calls = response.response.functionCalls()!;
        const results = await Promise.all(
            calls.map(async (call) => {
                const { runQuery } = await import("../tools/queryTool");
                const args = call.args as Record<string, unknown>;
                const result = await runQuery({ ...args, model: args.model, action: args.action });
                return {
                    functionResponse: {
                        name: call.name,
                        response: { result },
                    },
                };
            })
        );

        response = await chat.sendMessage(results);
    }

    return response.response.text();
}
