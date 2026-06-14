import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    const openai = new OpenAI({
      baseURL: process.env.AI_BASE_URL || 'https://api.groq.com/openai/v1',
      apiKey: process.env.AI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Say "AI connection successful" in exactly 3 words.' }],
      max_tokens: 20,
    });

    return NextResponse.json({
      success: true,
      message: response.choices[0]?.message?.content,
      model: process.env.AI_MODEL,
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error',
    }, { status: 500 });
  }
}
