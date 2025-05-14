'use client';

import React from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// 拡張されたボタンプロパティ
export interface ButtonProps extends Omit<MuiButtonProps, 'color'> {
  variant?: 'text' | 'outlined' | 'contained';
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'neutral';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

// ニュートラルカラー対応のためのスタイル
const StyledButton = styled(MuiButton)<{
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'neutral';
}>(({ theme, color = 'primary', variant = 'contained' }) => {
  if (color === 'neutral') {
    return {
      backgroundColor:
        variant === 'contained' ? theme.palette.grey[300] : 'transparent',
      color:
        variant === 'contained'
          ? theme.palette.grey[800]
          : theme.palette.grey[700],
      borderColor:
        variant === 'outlined' ? theme.palette.grey[400] : 'transparent',
      '&:hover': {
        backgroundColor:
          variant === 'contained'
            ? theme.palette.grey[400]
            : theme.palette.grey[100],
        borderColor:
          variant === 'outlined' ? theme.palette.grey[600] : 'transparent',
      },
    };
  }
  return {};
});

export default function Button({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      variant={variant}
      color={color === 'neutral' ? undefined : color}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={
        loading ? <CircularProgress size={20} color="inherit" /> : startIcon
      }
      endIcon={endIcon}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
}
