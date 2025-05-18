import { NextRequest, NextResponse } from 'next/server';

// バックエンドのAPIエンドポイント
// Docker環境では'backend'コンテナ名を使用
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // id パラメータを取得
    const { id } = await params;

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
