import {
  User,
  Thread,
  Post,
  LoginData,
  RegisterData,
  AuthResponse,
} from '../types';

// Docker Compose環境ではバックエンドコンテナ名を指定
// 環境変数から取得するように変更（環境による分岐を可能に）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// トークン取得用の安全なヘルパー関数
function getSavedToken(): string | null {
  // ブラウザ環境でのみ実行
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('localStorage内にトークンが見つかりません');
      return null;
    }
    return token;
  } catch (e) {
    console.error('ローカルストレージからトークンの取得に失敗:', e);
    return null;
  }
}

// デバッグ用のトークン状態ロギング関数
function logTokenState() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      console.log(
        'Token exists:',
        token.substring(0, 15) + '...',
        'length:',
        token.length,
      );
    } else {
      console.log('No token in localStorage');
    }
  } catch (e) {
    console.error('Unable to check token state:', e);
  }
}

// クライアントサイドでのみ実行される初期化関数
let initialized = false;
if (typeof window !== 'undefined') {
  // ビルド時/サーバー側では実行せず、クライアントでのみ実行
  if (!initialized) {
    initialized = true;
    // setTimeout をネストして処理順序を確実にする
    setTimeout(() => {
      console.log('API client initialized, checking token...');
      logTokenState();
    }, 0);
  }
}

// APIリクエスト用の関数を定義
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  // エンドポイントから先頭の/apiプレフィックスを削除（既存のコードとの互換性のため）
  const cleanEndpoint = endpoint.startsWith('/api')
    ? endpoint.substring(4)
    : endpoint;

  const url = `${API_BASE_URL}${cleanEndpoint}`;

  // サーバーサイドレンダリング時は一部の処理をスキップ
  const isClient = typeof window !== 'undefined';

  // リクエスト前にトークン状態をログに出力（クライアントサイドのみ）
  if (isClient) {
    logTokenState();
  }

  // デフォルトのヘッダーを設定
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  } as Record<string, string>;

  // JWTトークンがローカルストレージにあれば追加（クライアントサイドのみ）
  if (isClient) {
    const token = getSavedToken();
    if (token) {
      // 'Bearer 'プレフィックスを確認して、なければ追加する
      headers['Authorization'] = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;

      console.log(
        `Request to ${cleanEndpoint} with Auth header:`,
        headers['Authorization'].substring(0, 20) + '...',
      );
    } else {
      console.warn(`No auth token available for request to: ${cleanEndpoint}`);
    }
  }

  // リクエスト情報をログに出力
  console.log(`API request to ${cleanEndpoint}`);

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // CORSリクエストでCookieを送信
  });

  // レスポンスのステータスを詳細にログ出力
  console.log(`API response status for ${cleanEndpoint}: ${response.status}`);

  // レスポンスが成功しなかった場合はエラーをスロー
  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
      console.error(`API error response for ${cleanEndpoint}:`, errorData);
    } catch (error) {
      console.error(
        `Failed to parse error response for ${cleanEndpoint}:`,
        error,
      );
      const text = await response.text().catch(() => 'No response body');
      console.error(`Raw error response for ${cleanEndpoint}:`, text);
      errorData = { message: text };
    }

    throw new Error(
      errorData.message || `API error with status: ${response.status}`,
    );
  }

  // レスポンスデータをパースして返す
  try {
    const data = await response.json();
    console.log(
      `API response data for ${cleanEndpoint} (summary):`,
      typeof data === 'object'
        ? `Object with ${Object.keys(data).length} keys`
        : typeof data,
    );
    return data as T;
  } catch (error) {
    console.error(
      `Failed to parse success response for ${cleanEndpoint}:`,
      error,
    );
    const text = await response.text().catch(() => 'No response body');
    console.error(`Raw success response for ${cleanEndpoint}:`, text);
    throw new Error(
      `Failed to parse response: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

// FormDataを使ったファイルアップロード用関数
export async function uploadFile<T>(file: File): Promise<T> {
  console.log(
    `Uploading file: ${file.name}, size: ${file.size}bytes, type: ${file.type}`,
  );

  const formData = new FormData();
  formData.append('file', file);

  const isClient = typeof window !== 'undefined';

  // トークンの取得
  let token = null;
  if (isClient) {
    token = getSavedToken();
    if (!token) {
      console.warn('No auth token available for file upload');
      throw new Error('Authentication required for file upload');
    }
  }

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/images/upload`, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include', // CORSリクエストでCookieを送信
  });

  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
      console.error('File upload error:', errorData);
    } catch (error) {
      console.error('Failed to parse error response for file upload:', error);
      const text = await response.text().catch(() => 'No response body');
      console.error('Raw error response for file upload:', text);
      errorData = { message: text };
    }

    throw new Error(
      errorData.message || `File upload error with status: ${response.status}`,
    );
  }

  const data = await response.json();
  console.log('File upload response:', data);
  return data as T;
}

// 各APIエンドポイントに対応する関数
export const api = {
  // スレッド関連
  threads: {
    getAll: () => {
      console.log('Getting all threads');
      return fetchApi<Thread[]>('/threads');
    },

    getById: (id: string) => {
      console.log(`Getting thread by ID: ${id}`);
      return fetchApi<Thread>(`/threads/${id}`);
    },

    create: (data: { title: string; description: string }) => {
      console.log('Creating new thread:', data);
      return fetchApi<Thread>('/threads', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  // 投稿関連
  posts: {
    getByThreadId: (threadId: string) => {
      console.log(`Getting posts for thread: ${threadId}`);
      return fetchApi<Post[]>(`/posts?threadId=${threadId}`);
    },

    getById: (id: string) => {
      console.log(`Getting post by ID: ${id}`);
      return fetchApi<Post>(`/posts/${id}`);
    },

    getReplies: (postId: string) => {
      console.log(`Getting replies for post: ${postId}`);
      return fetchApi<Post[]>(`/posts/${postId}/replies`);
    },

    create: (data: {
      content: string;
      threadId: string;
      parentId?: string;
    }) => {
      console.log('Creating new post:', data);
      // ここでトークンを再確認（デバッグ用）
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log('トークンの存在:', token ? 'あり' : 'なし');
        if (token) {
          console.log('トークン先頭部分:', token.substring(0, 15) + '...');
        }
      }

      return fetchApi<Post>('/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  // 画像関連
  images: {
    upload: (file: File) => {
      console.log('Uploading image:', file.name);
      return uploadFile<{ message: string; location: string }>(file);
    },
  },

  // 認証関連
  auth: {
    login: async (data: LoginData) => {
      console.log('Logging in user:', data.username);
      const response = await fetchApi<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // レスポンスをデバッグ出力
      console.log('Auth login response:', response);

      return response;
    },
    register: (data: RegisterData) => {
      console.log('Registering new user:', data.username);
      return fetchApi<AuthResponse>('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getCurrentUser: () => {
      console.log('Getting current user profile');
      return fetchApi<User>('/auth/me');
    },
  },
};
