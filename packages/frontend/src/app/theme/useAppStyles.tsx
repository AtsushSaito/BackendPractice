'use client';

import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

// アプリケーション全体で再利用可能なスタイル定義
export interface AppStyles {
  // 全体的なレイアウト
  layout: {
    container: React.CSSProperties;
    content: React.CSSProperties;
    section: React.CSSProperties;
  };

  // カード要素
  card: {
    root: React.CSSProperties;
    header: React.CSSProperties;
    content: React.CSSProperties;
    action: React.CSSProperties;
  };

  // フォーム要素
  form: {
    container: React.CSSProperties;
    field: React.CSSProperties;
    submit: React.CSSProperties;
  };

  // テキスト
  text: {
    title: React.CSSProperties;
    subtitle: React.CSSProperties;
    paragraph: React.CSSProperties;
    caption: React.CSSProperties;
    error: React.CSSProperties;
    success: React.CSSProperties;
  };

  // スペーシング
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

// テーマをベースにしたスタイル生成関数
const createAppStyles = (theme: Theme): AppStyles => ({
  layout: {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `${theme.spacing(3)}`,
    },
    content: {
      padding: `${theme.spacing(3)}`,
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
    },
    section: {
      marginBottom: theme.spacing(4),
    },
  },

  card: {
    root: {
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1],
      overflow: 'hidden',
      transition: 'box-shadow 0.3s ease-in-out',
      '&:hover': {
        boxShadow: theme.shadows[3],
      },
    },
    header: {
      padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    content: {
      padding: theme.spacing(3),
    },
    action: {
      padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  },

  form: {
    container: {
      marginBottom: theme.spacing(3),
      '& > *': {
        marginBottom: theme.spacing(2),
      },
    },
    field: {
      marginBottom: theme.spacing(2),
      width: '100%',
    },
    submit: {
      marginTop: theme.spacing(3),
    },
  },

  text: {
    title: {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      marginBottom: theme.spacing(2),
      color: theme.palette.text.primary,
    },
    subtitle: {
      fontSize: theme.typography.h6.fontSize,
      fontWeight: theme.typography.fontWeightMedium,
      marginBottom: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    paragraph: {
      marginBottom: theme.spacing(2),
      lineHeight: 1.6,
    },
    caption: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.palette.text.secondary,
    },
    error: {
      color: theme.palette.error.main,
      fontSize: theme.typography.caption.fontSize,
      marginTop: theme.spacing(0.5),
    },
    success: {
      color: theme.palette.success.main,
      fontSize: theme.typography.caption.fontSize,
      marginTop: theme.spacing(0.5),
    },
  },

  spacing: {
    small: theme.spacing(1),
    medium: theme.spacing(2),
    large: theme.spacing(4),
  },
});

// カスタムフック
export const useAppStyles = (): AppStyles => {
  const theme = useTheme();

  // メモ化してレンダリングのたびに再計算されないようにする
  const styles = useMemo(() => createAppStyles(theme), [theme]);

  return styles;
};
