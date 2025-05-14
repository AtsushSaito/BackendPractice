import { NextRequest, NextResponse } from 'next/server';

// Docker環境では下記を使用
const API_BASE_URL = 'http://backend:3000';
// ローカル開発環境ではlocalhostを使用
// const API_BASE_URL = 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    // 認証ヘッダーを取得
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header is missing' },
        { status: 401 },
      );
    }

    console.log('Sending request to:', `${API_BASE_URL}/auth/me`);
    console.log('With auth header:', authHeader.substring(0, 20) + '...');

    // バックエンドAPIにリクエストを転送
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
      cache: 'no-store',
    });

    // バックエンドからのレスポンスデータを取得
    let data;
    try {
      data = await response.json();
      console.log('Response from profile API:', data);
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
        error: error.toString(),
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}
