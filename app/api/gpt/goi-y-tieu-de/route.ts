import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();
  const prompt = body.prompt || '';

  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Tôi muốn đăng tin rao vặt với mô tả sau: "${prompt}". Hãy gợi ý một tiêu đề hấp dẫn, ngắn gọn.`,
        },
      ],
    });

    const result = completion.choices[0].message.content;
    return NextResponse.json({ result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Lỗi gọi OpenAI' }, { status: 500 });
  }
}
