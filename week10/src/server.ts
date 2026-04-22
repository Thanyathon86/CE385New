import 'dotenv/config';
import express, { Request, Response } from 'express';
import {  GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env['GEMINI_API_KEY'],
});

app.post('/chat', async (req: Request, res: Response) => {
    try{
        const { message }= req.body as { message? : string };
    
        if (!message || message.trim() === '') {
            res.status(400).json({ error: 'message is required'});
            return;
        }
    
        const response = await ai.models.generateContent({
            model:'gemini-2.5-flash-lite',
            contents: [{ role: 'user',parts: [{text: message}] }]
        });
        res.json({ reply: response.text });

    }catch(error: unknown) {
        if (error instanceof Error) {
            const message = error.message;

            if (message.includes('API_KEY_INVALID') || message.includes('401')) {
                console.error('API key ไม่ถูกต้อง - ตรวจสอบ GEMINI_API_KEY ใน .env');
            } else if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
                console.error('Rate Limit เกิน - รอสักครู่เเล้วลองใหม่ ');
            } else if (message.includes('SAFETY')) {
                console.error('เนื้อหาถุกบล็อคโดย safety filter');
            } else if (message.includes('503') || message.includes('UNAVAILABLE')) {
                console.error('Service ไม่พร้อมใช้งาน - ลองใหม่ภายหลัง');
            } else {
                console.error('เกิดข้อผิดพลาด:',message);
            }
        }  
        return null;
   }
});


app.post('/chat/stream', async (req: Request, res: Response) => {
    const { message } = req.body as { message? : string };

    if (!message || message.trim() === '') {
        res.status(400).json({ error: ',essage is required'});
        return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cahce');
    res.setHeader('Connection', 'keep-alive');
    
    const response = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash-lite',
        contents: [{ role: 'user',parts: [{text: message}] }],
     });

     for await (const chunk of response) {
        if (chunk.text) {
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
     }
     res.write('data: [DONE]\n\n');
     res.end();
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

