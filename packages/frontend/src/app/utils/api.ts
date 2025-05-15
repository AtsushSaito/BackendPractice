// Nextのフロントエンドからアクセスするときは相対パスで十分
const API_BASE_URL = '';

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

// トークン状態のデバッグログ出力用関数
function logTokenState() {
  if (typeof window === 'undefined') return;

  try {
    const token = localStorage.getItem('token');
    if (token) {
      console.log(
        'Token exists:',
        token.substring(0, 15) + '...',
        'Length:',
        token.length,
      );
    } else {
      console.warn('No token found in localStorage');
    }
  } catch (e) {
    console.error('Error checking token:', e);
  }
}

// API初期化時にトークン状態をログに出力
if (typeof window !== 'undefined') {
  console.log('API client initialized, checking token...');
  setTimeout(() => {
    logTokenState();
  }, 100);
}

// APIリクエスト用の関数を定義
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // リクエスト前にトークン状態をログに出力
  logTokenState();

  // デフォルトのヘッダーを設定
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  } as Record<string, string>;

  // JWTトークンがローカルストレージにあれば追加
  const token = getSavedToken();
  if (token) {
    // 'Bearer 'プレフィックスを確認して、なければ追加する
    headers['Authorization'] = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`;

    console.log(
      `Request to ${endpoint} with Auth header:`,
      headers['Authorization'].substring(0, 20) + '...',
    );
  } else {
    console.warn(`No auth token available for request to: ${endpoint}`);
  }

  // リクエスト情報をログに出力
  console.log(`API request to ${endpoint}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // レスポンスのステータスを詳細にログ出力
  console.log(`API response status for ${endpoint}: ${response.status}`);

  // レスポンスが成功しなかった場合はエラーをスロー
  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
      console.error(`API error response for ${endpoint}:`, errorData);
    } catch (e) {
      console.error(`Failed to parse error response for ${endpoint}:`, e);
      const text = await response.text().catch(() => 'No response body');
      console.error(`Raw error response for ${endpoint}:`, text);
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
      `API response data for ${endpoint} (summary):`,
      typeof data === 'object'
        ? `Object with ${Object.keys(data).length} keys`
        : typeof data,
    );
    return data;
  } catch (e) {
    console.error(`Failed to parse success response for ${endpoint}:`, e);
    const text = await response.text().catch(() => 'No response body');
    console.error(`Raw success response for ${endpoint}:`, text);
    throw new Error(`Failed to parse response: ${e.message}`);
  }
}

// 各APIエンドポイントに対応する関数
export const api = {
  // スレッド関連
  threads: {
    getAll: () => {
      console.log('Getting all threads');
      return fetchApi<any[]>('/api/threads');
    },

    getById: (id: string) => {
      console.log(`Getting thread by ID: ${id}`);
      return fetchApi<any>(`/api/threads/${id}`);
    },

    create: (data: any) => {
      console.log('Creating new thread:', data);
      return fetchApi<any>('/api/threads', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  // 投稿関連
  posts: {
    getByThreadId: (threadId: string) => {
      console.log(`Getting posts for thread: ${threadId}`);
      return fetchApi<any[]>(`/api/posts?threadId=${threadId}`);
    },

    getById: (id: string) => {
      console.log(`Getting post by ID: ${id}`);
      return fetchApi<any>(`/api/posts/${id}`);
    },

    getReplies: (postId: string) => {
      console.log(`Getting replies for post: ${postId}`);
      return fetchApi<any[]>(`/api/posts/${postId}/replies`);
    },

    create: (data: any) => {
      console.log('Creating new post:', data);
      // ここでトークンを再確認（デバッグ用）
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log('トークンの存在:', token ? 'あり' : 'なし');
        if (token) {
          console.log('トークン先頭部分:', token.substring(0, 15) + '...');
        }
      }

      return fetchApi<any>('/api/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  // 認証関連
  auth: {
    login: async (data: any) => {
      console.log('Logging in user:', data.username);
      const response = await fetchApi<any>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // レスポンスをデバッグ出力
      console.log('Auth login response:', response);

      return response;
    },
    register: (data: any) => {
      console.log('Registering new user:', data.username);
      return fetchApi<any>('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getCurrentUser: () => {
      console.log('Getting current user profile');
      return fetchApi<any>('/api/auth/profile');
    },
  },
};
