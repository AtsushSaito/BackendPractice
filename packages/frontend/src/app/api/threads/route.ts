import { NextRequest, NextResponse } from 'next/server';

// ローカル環境ではlocalhostを使用
const API_BASE_URL = 'http://localhost:3000';

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
        error: error.toString(),
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}

// スレッド作成
export async function POST(request: NextRequest) {
  try {
    // クライアントから送信されたAuthorizationヘッダーを取得
    const token = request.headers.get('Authorization');
    console.log(
      'Received token in threads API:',
      token ? 'Token present' : 'No token',
    );

    if (!token) {
      return NextResponse.json(
        { message: 'Authorization header is required' },
        { status: 401 },
      );
    }

    // Bearer トークンの形式を確認
    let fullToken = token;
    if (!token.startsWith('Bearer ')) {
      // Bearer プレフィックスがない場合は追加
      fullToken = `Bearer ${token}`;
      console.log('Added Bearer prefix to token');
    }

    // リクエストボディを取得
    const body = await request.json();
    console.log('Creating thread with body:', JSON.stringify(body));

    // バックエンドAPIにリクエストを転送
    console.log('Sending request to:', `${API_BASE_URL}/threads`);
    console.log('With token:', fullToken.substring(0, 20) + '...');

    const response = await fetch(`${API_BASE_URL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: fullToken,
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
      console.error('Error parsing thread creation response:', parseError);
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
    console.error('API error in threads POST:', error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error: error.toString(),
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}
