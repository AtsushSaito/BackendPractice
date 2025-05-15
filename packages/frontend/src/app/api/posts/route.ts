import { NextRequest, NextResponse } from 'next/server';

// Docker環境では下記を使用
const API_BASE_URL = 'http://backend:3000';
// ローカル開発環境ではlocalhostを使用
// const API_BASE_URL = 'http://localhost:3000';

// 投稿一覧取得（スレッドIDでフィルタリングできる）
export async function GET(request: NextRequest) {
  try {
    // クエリパラメータを取得
    const searchParams = request.nextUrl.searchParams;
    const threadId = searchParams.get('threadId');

    const url = threadId
      ? `${API_BASE_URL}/posts?threadId=${threadId}`
      : `${API_BASE_URL}/posts`;

    console.log(`GET投稿一覧リクエスト - URL: ${url}`);

    // バックエンドAPIにリクエストを転送
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log(`GET投稿一覧レスポンスステータス: ${response.status}`);

    // バックエンドからのレスポンスデータを取得
    let data;
    try {
      data = await response.json();
      console.log('GET投稿一覧レスポンスデータ:', data);
    } catch (parseError) {
      console.error('GET投稿一覧レスポンスのパースに失敗:', parseError);
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
        `GET投稿一覧エラー - ステータス: ${response.status}、メッセージ:`,
        data,
      );
      return NextResponse.json(data, { status: response.status });
    }

    // 成功した場合はデータを返す
    console.log('GET投稿一覧取得成功');
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET投稿一覧API処理エラー:', error);
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

// 投稿作成
export async function POST(request: NextRequest) {
  try {
    console.log('投稿作成リクエスト受信');

    // クライアントから送信されたAuthorizationヘッダーを取得
    const token = request.headers.get('Authorization');
    console.log(`認証ヘッダーの存在: ${token ? 'あり' : 'なし'}`);

    if (token) {
      console.log(`Authorization: ${token.substring(0, 20)}...`);
    }

    if (!token) {
      console.error('認証ヘッダーが不足しています');
      return NextResponse.json(
        { message: 'Authorization header is required' },
        { status: 401 },
      );
    }

    // リクエストボディを先に取得してチェック
    let body;
    try {
      body = await request.json();
      console.log('投稿リクエストボディ:', body);

      // threadIdのバリデーション
      if (!body.threadId) {
        console.error('スレッドIDが不足しています:', body);
        return NextResponse.json(
          { message: 'threadId is required' },
          { status: 400 },
        );
      }

      console.log(`スレッドID確認: ${body.threadId}`);
    } catch (jsonError) {
      console.error('リクエストボディのパースに失敗:', jsonError);
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 },
      );
    }

    // 認証ヘッダーが正しい形式かチェック
    if (!token.startsWith('Bearer ')) {
      console.error(
        '認証ヘッダーが正しい形式ではありません: Bearer プレフィックスがありません',
      );
      // 自動修正を試みる
      const fixedToken = `Bearer ${token}`;
      console.log(`修正された認証ヘッダー: ${fixedToken.substring(0, 20)}...`);

      // URLを構築してログ出力
      const targetUrl = `${API_BASE_URL}/posts`;
      console.log(`投稿リクエスト先URL: ${targetUrl}`);

      // バックエンドAPIにリクエストを転送（修正したトークンで）
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: fixedToken,
        },
        body: JSON.stringify(body),
      });

      console.log(`投稿レスポンスステータス: ${response.status}`);

      // バックエンドからのレスポンスデータを取得
      let data;
      try {
        data = await response.json();
        console.log('投稿レスポンス:', data);
      } catch (parseError) {
        console.error('投稿レスポンスのパースに失敗:', parseError);
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

      if (!response.ok) {
        console.error(
          `投稿エラー - ステータス: ${response.status}、メッセージ:`,
          data,
        );
        return NextResponse.json(data, { status: response.status });
      }

      console.log('投稿作成成功');
      return NextResponse.json(data);
    }

    // URLを構築してログ出力
    const targetUrl = `${API_BASE_URL}/posts`;
    console.log(`投稿リクエスト先URL: ${targetUrl}`);

    // バックエンドAPIにリクエストを転送
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    console.log(`投稿レスポンスステータス: ${response.status}`);

    // バックエンドからのレスポンスデータを取得
    let data;
    try {
      data = await response.json();
      console.log('投稿レスポンス:', data);
    } catch (parseError) {
      console.error('投稿レスポンスのパースに失敗:', parseError);
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
        `投稿エラー - ステータス: ${response.status}、メッセージ:`,
        data,
      );
      return NextResponse.json(data, { status: response.status });
    }

    // 成功した場合はデータを返す
    console.log('投稿作成成功');
    return NextResponse.json(data);
  } catch (error) {
    console.error('投稿作成API処理エラー:', error);
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
