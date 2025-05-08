import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sampleData = [
      {
        id: 'test1',
        title: 'Bài viết thử nghiệm',
        image: 'https://via.placeholder.com/600x300',
        created_at: new Date().toISOString(),
        status: 'active',
      },
    ];

    return NextResponse.json(sampleData);
  } catch (err: any) {
    console.error('Lỗi server:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
