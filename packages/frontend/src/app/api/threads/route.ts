import { NextRequest, NextResponse } from 'next/server';

// バックエンドのAPIエンドポイント
// サーバーサイドとクライアントサイドで異なるURLを使用
const API_BASE_URL =
  typeof process.env.BACKEND_URL !== 'undefined'
    ? process.env.BACKEND_URL
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// スレッド一覧取得
export async function GET() {
  try {
    console.log('Fetching threads from:', `${API_BASE_URL}/threads`);

    // バックエンドAPIにリクエストを転送
    const response = await fetch(`${API_BASE_URL}/threads`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    // バックエンドからのレスポンスデータを取得
    let data;
    try {
      data = await response.json();
      console.log('Threads response:', data);
    } catch (parseError) {
      console.error('Error parsing threads response:', parseError);
      const text = await response.text().catch(() => 'No response body');
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
    console.error('API error in threads GET:', error);
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

// スレッド作成
export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await request.json();

    // Authorizationヘッダーを取得
    const token = request.headers.get('Authorization');
    if (!token) {
      return NextResponse.json(
        { message: 'Authorization header is missing' },
        { status: 401 },
      );
    }

    console.log('Sending request to:', `${API_BASE_URL}/threads`);
    console.log('Request body:', JSON.stringify(body));

    // バックエンドAPIにリクエストを転送
    const response = await fetch(`${API_BASE_URL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    // バックエンドからのレスポンスデータを取得
    let data;
    try {
      data = await response.json();
      console.log('Thread creation response:', data);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
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
