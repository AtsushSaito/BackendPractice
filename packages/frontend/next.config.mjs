/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // 必要に応じて実験的な機能を有効化
  },
  // ポート設定はDocker Composeの環境変数を使用
};

export default nextConfig;
