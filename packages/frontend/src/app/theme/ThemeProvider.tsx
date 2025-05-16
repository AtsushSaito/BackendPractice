'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';
import NoSsr from '@mui/material/NoSsr';
import theme from './theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  // クライアントサイドのレンダリングかどうかをトラッキングする
  const [mounted, setMounted] = useState(false);

  // マウント後にクライアントサイドであることを確認
  useEffect(() => {
    setMounted(true);
  }, []);

  // サーバーサイドレンダリング時はスタイリングなしで初期レンダリング
  // クライアントサイドでのレンダリング時に完全なスタイルを適用
  // これによりハイドレーションの不一致を防ぎます
  return (
    <StyledEngineProvider injectFirst>
      <NoSsr>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </NoSsr>
    </StyledEngineProvider>
  );
}
