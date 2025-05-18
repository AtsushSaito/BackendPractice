import { NextRequest, NextResponse } from 'next/server';

// バックエンドのAPIエンドポイント
// サーバーサイドとクライアントサイドで異なるURLを使用
const API_BASE_URL =
  typeof process.env.BACKEND_URL !== 'undefined'
    ? process.env.BACKEND_URL
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await request.json();

    console.log('Sending request to:', `${API_BASE_URL}/auth/login`);

    // バックエンドAPIにリクエストを転送
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    // バックエンドからのレスポンスデータを取得
    let data;
    try {
      data = await response.json();
      console.log('Response from login:', data);

      // キー名を変換: accessToken → access_token
      if (data && data.accessToken) {
        data = {
          access_token: data.accessToken,
        };
        console.log('Transformed response:', data);
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      // レスポンスの本文を取得してみる
      const text = await response.text().catch(() => 'No response body');
      console.log('Response text:', text);
      data = {
        message: `Failed to parse response: ${response.statusText}`,
        statusCode: response.status,
        responseText: text,
      };
    }

    // レスポンスのステータスコードに基づいて処理
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // 成功した場合はデータを返す
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error: (error as any).toString(),
        stack: (error as any).stack,
      },
      { status: 500 },
    );
  }
}
