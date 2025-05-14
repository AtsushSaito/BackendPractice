import { NextRequest, NextResponse } from 'next/server';

// Docker環境ではサービス名で接続
const API_BASE_URL = 'http://backend:3000';

export async function GET(request: NextRequest) {
  try {
    // クライアントから送信されたAuthorizationヘッダーを取得
    const token = request.headers.get('Authorization');

    // ヘッダー情報を表示
    console.log(
      'Debug - All headers:',
      Object.fromEntries(request.headers.entries()),
    );
    console.log('Debug - Authorization header:', token);

    if (!token) {
      return NextResponse.json(
        {
          message: 'デバッグ情報: 認証ヘッダーがありません',
          headers: Object.fromEntries(request.headers.entries()),
        },
        { status: 200 },
      );
    }

    // バックエンドAPIにテストリクエストを転送
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      cache: 'no-store',
    });

    // レスポンスステータスを表示
    console.log('Debug - Backend response status:', response.status);
    console.log(
      'Debug - Backend response headers:',
      Object.fromEntries(response.headers.entries()),
    );

    // バックエンドからのレスポンスデータを取得
    let data;
    try {
      data = await response.json();
      console.log('Debug - Backend response data:', data);
    } catch (parseError) {
      console.error('Debug - Error parsing response:', parseError);
      const text = await response.text().catch(() => 'No response body');
      console.log('Debug - Response text:', text);
      data = { responseText: text };
    }

    // デバッグ情報を返す
    return NextResponse.json({
      message: 'デバッグ情報',
      clientToken: token,
      tokenStartsWith: token?.substring(0, 15),
      tokenLength: token?.length,
      backendResponseStatus: response.status,
      backendResponseData: data,
      backendResponseHeaders: Object.fromEntries(response.headers.entries()),
    });
  } catch (error) {
    console.error('デバッグAPIエラー:', error);
    return NextResponse.json(
      {
        message: 'デバッグAPIエラー',
        error: error.toString(),
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}
