'use client';

import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ThreadList from './components/ThreadList';
import CreateThreadForm from './components/CreateThreadForm';
import {
  Typography,
  Box,
  Alert,
  AlertTitle,
  Paper,
  CircularProgress,
} from '@mui/material';
import Container from './components/ui/Container';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ローカルストレージからトークンを安全に取得する関数
  const getAuthToken = () => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log(
          'Home page checking auth token:',
          token ? 'Token exists' : 'No token',
        );
        return token;
      }
      return null;
    } catch (e) {
      console.error('Failed to get token from localStorage:', e);
      return null;
    }
  };

  useEffect(() => {
    // ログイン状態を確認
    const checkAuth = () => {
      setIsLoading(true);
      const token = getAuthToken();
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };

    checkAuth();

    // ストレージの変更を監視してログイン状態を更新
    const handleStorageChange = () => {
      console.log('Storage change detected');
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    // クリーンアップ関数
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // ログイン状態が変わった時のデバッグ出力
  useEffect(() => {
    console.log(
      'Login state updated:',
      isLoggedIn ? 'Logged in' : 'Not logged in',
    );
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <Navbar />
        <Container>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            my={8}
          >
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', my: 4 }}
        >
          スレッド掲示板
        </Typography>

        {isLoggedIn ? (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <CreateThreadForm />
          </Paper>
        ) : (
          <Alert
            severity="info"
            sx={{
              mb: 4,
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' },
            }}
          >
            <AlertTitle>ログインが必要です</AlertTitle>
            新しいスレッドを作成するには
            <Box
              component="a"
              href="/login"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 'medium',
                mx: 0.5,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              ログイン
            </Box>
            してください。
          </Alert>
        )}

        <ThreadList />
      </Container>
    </Box>
  );
}
