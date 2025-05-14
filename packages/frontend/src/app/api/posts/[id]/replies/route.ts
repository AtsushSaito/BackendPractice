import { NextRequest, NextResponse } from 'next/server';

// Docker環境では下記を使用
const API_BASE_URL = 'http://backend:3000';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    // バックエンドAPIにリクエストを転送
    const response = await fetch(`${API_BASE_URL}/posts/${id}/replies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // バックエンドからのレスポンスデータを取得
    const data = await response.json();

    // レスポンスのステータスコードに基づいて処理
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // 成功した場合はデータを返す
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
