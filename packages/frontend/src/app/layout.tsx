import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import ThemeProvider from './theme/ThemeProvider';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '掲示板アプリ',
  description: 'スレッドベースの掲示板アプリケーション',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={roboto.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
