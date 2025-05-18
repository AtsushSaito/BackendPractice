import { NextRequest, NextResponse } from 'next/server';

// バックエンドのAPIエンドポイント
// サーバーサイドとクライアントサイドで異なるURLを使用
const API_BASE_URL =
  typeof process.env.BACKEND_URL !== 'undefined'
    ? process.env.BACKEND_URL
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    console.log('画像アップロードリクエスト受信');

    // クライアントから送信されたAuthorizationヘッダーを取得
    const token = request.headers.get('Authorization');
    console.log(`認証ヘッダーの存在: ${token ? 'あり' : 'なし'}`);

    if (!token) {
      console.error('認証ヘッダーが不足しています');
      return NextResponse.json(
        { message: 'Authorization header is required' },
        { status: 401 },
      );
    }

    // FormDataからファイルを取得
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('ファイルが見つかりません');
      return NextResponse.json(
        { message: 'File is required' },
        { status: 400 },
      );
    }

    console.log(
      `受信したファイル: ${file.name}, サイズ: ${file.size}bytes, タイプ: ${file.type}`,
    );

    // バックエンドに送信するためのFormDataを作成
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // URLを構築してログ出力
    const targetUrl = `${API_BASE_URL}/images/upload`;
    console.log(`画像アップロードリクエスト先URL: ${targetUrl}`);

    // バックエンドAPIにリクエストを転送
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: backendFormData,
    });

    console.log(`画像アップロードレスポンスステータス: ${response.status}`);

    // バックエンドからのレスポンスデータを取得
    let data;
    try {
      data = await response.json();
      console.log('画像アップロードレスポンス:', data);
    } catch (parseError) {
      console.error('画像アップロードレスポンスのパースに失敗:', parseError);
      const text = await response.text().catch(() => 'レスポンス本文なし');

      return NextResponse.json(
        {
          message: 'レスポンスの解析に失敗しました',
          error: (parseError as any).toString(),
          responseText: text,
        },
        { status: 500 },
      );
    }

    // レスポンスのステータスコードに基づいて処理
    if (!response.ok) {
      console.error(
        `画像アップロードエラー - ステータス: ${response.status}、メッセージ:`,
        data,
      );
      return NextResponse.json(data, { status: response.status });
    }

    // 成功した場合はデータを返す
    console.log('画像アップロード成功');
    return NextResponse.json(data);
  } catch (error) {
    console.error('画像アップロードAPI処理エラー:', error);
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
