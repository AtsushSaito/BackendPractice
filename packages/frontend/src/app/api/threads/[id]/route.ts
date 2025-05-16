import { NextRequest, NextResponse } from 'next/server';

// ローカル環境ではlocalhostを使用
const API_BASE_URL = 'http://localhost:3000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Next.js 15では動的パラメータは非同期なのでawaitする
    const { id } = await params;
    console.log(`スレッド詳細取得リクエスト - ID: ${id}`);

    // 認証ヘッダーを取得
    const authHeader = request.headers.get('Authorization');
    console.log(`認証ヘッダーの存在: ${authHeader ? 'あり' : 'なし'}`);

    if (authHeader) {
      console.log(`Authorization: ${authHeader.substring(0, 20)}...`);
    }

    // URLを構築してログ出力
    const targetUrl = `${API_BASE_URL}/threads/${id}`;
    console.log(`リクエスト先URL: ${targetUrl}`);

    // バックエンドAPIにリクエストを転送
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      cache: 'no-store',
    });

    console.log(`バックエンドAPIレスポンスステータス: ${response.status}`);

    // バックエンドからのレスポンスデータを取得
    let data;
    try {
      data = await response.json();
      console.log('スレッド詳細レスポンス:', data);
    } catch (parseError) {
      console.error('レスポンスJSONのパースに失敗:', parseError);
      // レスポンスの本文を取得してみる
      const text = await response.text().catch(() => 'レスポンス本文なし');
      console.log('レスポンス本文:', text);

      return NextResponse.json(
        {
          message: 'レスポンスの解析に失敗しました',
          error: parseError.toString(),
          responseText: text,
        },
        { status: 500 },
      );
    }

    // レスポンスのステータスコードに基づいて処理
    if (!response.ok) {
      console.error(
        `スレッド取得エラー - ステータス: ${response.status}、メッセージ:`,
        data,
      );
      return NextResponse.json(data, { status: response.status });
    }

    // 成功した場合はデータを返す
    console.log('スレッド詳細取得成功');
    return NextResponse.json(data);
  } catch (error) {
    console.error('スレッド詳細取得API処理エラー:', error);
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
