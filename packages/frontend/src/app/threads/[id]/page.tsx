'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import * as React from 'react';
import Navbar from '../../components/Navbar';
import PostList from '../../components/PostList';
import CreatePostForm from '../../components/CreatePostForm';
import { Thread } from '../../types';
import { api } from '../../utils/api';
import { useAuthContext } from '../../context/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Container from '../../components/ui/Container';

export default function ThreadDetailPage() {
  const params = useParams();
  const rawThreadId = Array.isArray(params.id) ? params.id[0] : params.id;

  // スレッドIDを確実に文字列として取得し、デバッグ出力
  const threadId = String(rawThreadId);
  console.log(`スレッドID取得: ${threadId}, タイプ: ${typeof threadId}`);

  const postListRef = useRef<{ handlePostCreated: () => Promise<void> } | null>(
    null,
  );

  const [thread, setThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AuthContextからログイン状態を取得
  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    console.log(`スレッド詳細ページがマウントされました - ID: ${threadId}`);

    // スレッド情報を取得
    const fetchThread = async () => {
      console.log(`スレッド情報の取得を開始 - ID: ${threadId}`);
      try {
        setIsLoading(true);
        console.log('API呼び出し前...');
        const threadData = await api.threads.getById(threadId);
        console.log('取得したスレッド情報:', threadData);
        setThread(threadData);
        setError(null);
      } catch (err) {
        console.error('スレッド取得エラー:', err);
        console.error('エラーの詳細:', err.message);
        setError('スレッドの取得に失敗しました。');
      } finally {
        setIsLoading(false);
        console.log('スレッド情報取得処理完了');
      }
    };

    if (threadId) {
      fetchThread();
    } else {
      console.error('スレッドIDが不正です');
      setError('スレッドIDが不正です');
      setIsLoading(false);
    }
  }, [threadId]);

  // 投稿が作成された後の処理
  const handlePostCreated = () => {
    console.log('新しい投稿が作成されました');
    // PostListコンポーネントの更新メソッドを呼び出す
    if (postListRef.current) {
      postListRef.current.handlePostCreated();
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
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

  if (error || !thread) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Container>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'スレッドが見つかりません。'}
          </Alert>
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBackIcon />}
            color="primary"
          >
            ホームに戻る
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
          color="primary"
        >
          スレッド一覧に戻る
        </Button>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            {thread.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              whiteSpace: 'pre-wrap',
              color: 'text.primary',
            }}
          >
            {thread.description}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            <Typography variant="body2">
              作成日: {new Date(thread.createdAt).toLocaleString()}
            </Typography>
            {thread.user && (
              <>
                <Divider orientation="vertical" flexItem />
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  作成者:
                  <Chip
                    label={thread.user.username}
                    size="small"
                    sx={{ ml: 1 }}
                    variant="outlined"
                  />
                </Typography>
              </>
            )}
            <Divider orientation="vertical" flexItem />
            <Typography
              variant="body2"
              component="span"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              スレッドID: {threadId}
            </Typography>
          </Box>
        </Paper>

        {isLoggedIn ? (
          <Box sx={{ mb: 4 }}>
            {threadId ? (
              <CreatePostForm
                threadId={threadId}
                onPostCreated={handlePostCreated}
              />
            ) : (
              <Alert severity="error" sx={{ mb: 2 }}>
                スレッドIDが取得できないため投稿できません
              </Alert>
            )}
          </Box>
        ) : (
          <Alert
            severity="info"
            sx={{ mb: 4 }}
            action={
              <Button
                color="inherit"
                size="small"
                component={Link}
                href="/login"
              >
                ログイン
              </Button>
            }
          >
            投稿するにはログインしてください。
          </Alert>
        )}

        <PostList threadId={threadId} ref={postListRef} />
      </Container>
    </Box>
  );
}
