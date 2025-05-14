import { NextRequest, NextResponse } from 'next/server';

// Docker環境ではサービス名で接続
const API_BASE_URL = 'http://backend:3000';

export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await request.json();

    console.log('Sending request to:', `${API_BASE_URL}/users`);
    console.log('Request body:', JSON.stringify(body));

    // バックエンドAPIにリクエストを転送
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      // サーバーサイドではCORSに関わらずリクエストが送信できる
      // Next.jsのAPIルート内のfetchはクライアントのfetchとは異なりCORSの影響を受けない
    });

    // エラーレスポンスの場合でもJSONを取得しようとする
    let data;
    try {
      data = await response.json();
      console.log('Response data:', data);
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
