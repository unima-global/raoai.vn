import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  const body = await req.json()
  const prompt = body.prompt || ''

  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    })

    return NextResponse.json({
      response: completion.choices[0].message.content,
    })
  } catch (err: any) {
    console.error('❌ GPT error:', err)
    return NextResponse.json({ error: 'Lỗi khi gọi GPT', detail: err.message || err }, { status: 500 })
  }
}
