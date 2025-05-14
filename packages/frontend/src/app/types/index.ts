// ユーザー関連の型
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// スレッド関連の型
export interface Thread {
  id: string;
  title: string;
  description: string;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

// 投稿関連の型
export interface Post {
  id: string;
  content: string;
  userId: string;
  threadId: string;
  parentId?: string;
  user?: User;
  thread?: Thread;
  parent?: Post;
  replies?: Post[];
  createdAt: string;
  updatedAt: string;
}

// 認証関連の型
export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  // バックエンドから返される可能性のある両方のフォーマットに対応
  access_token?: string;
  accessToken?: string;
  user?: User;
}
