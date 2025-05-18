/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // 必要に応じて実験的な機能を有効化
  },
  // ポート設定はDocker Composeの環境変数を使用

  // ESLintとTypeScriptのチェックを無効化（本番環境では有効にすることをお勧めします）
  eslint: {
    // Warning: この設定は開発目的でのみ使用してください
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: この設定は開発目的でのみ使用してください
    // TypeScriptエラーがあっても本番ビルドを許可
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
