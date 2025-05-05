import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const question = body.question?.trim();

  if (!question) {
    return NextResponse.json({ error: 'Không có câu hỏi.' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
        temperature: 0.7,
      }),
    });

    const json = await res.json();

    const answer = json.choices?.[0]?.message?.content?.trim() || 'Không có phản hồi.';
    return NextResponse.json({ answer });
  } catch (err) {
    console.error('GPT API error:', err);
    return NextResponse.json({ error: 'Lỗi gọi GPT.' }, { status: 500 });
  }
}
