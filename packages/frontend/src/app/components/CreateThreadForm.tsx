'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { api } from '../utils/api';

export default function CreateThreadForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<string>('未確認');
  const router = useRouter();

  // コンポーネントマウント時にトークンの状態を確認
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setTokenStatus(`存在（長さ: ${token.length}文字）`);
        console.log('Thread form token check:', token.substring(0, 15) + '...');
      } else {
        setTokenStatus('なし');
        console.log('Thread form: No token found');
      }
    } catch (e) {
      console.error('トークン確認エラー:', e);
      setTokenStatus('エラー');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === '' || description.trim() === '') {
      setError('タイトルと説明を入力してください。');
      return;
    }

    try {
      setIsSubmitting(true);

      // 送信前に再度トークンを確認
      const token = localStorage.getItem('token');
      if (!token) {
        setError('認証トークンがありません。再度ログインしてください。');
        return;
      }

      console.log(
        'Creating thread with token:',
        token.substring(0, 15) + '...',
      );
      const threadData = { title, description };
      console.log('Thread data:', threadData);

      const newThread = await api.threads.create(threadData);
      console.log('Thread created successfully:', newThread);

      // 作成成功後にスレッド詳細ページへ遷移
      router.push(`/threads/${newThread.id}`);
    } catch (err: unknown) {
      console.error('スレッド作成エラー:', err);

      // トークンの状態を再確認
      try {
        const tokenCheck = localStorage.getItem('token');
        console.log('Token after error:', tokenCheck ? 'exists' : 'missing');
      } catch (e) {
        console.error('Error checking token after failure:', e);
      }

      let errorMessage = 'スレッドの作成に失敗しました。';

      // 認証エラーの場合は特定のメッセージを表示
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;

        if (
          err.message?.includes('Unauthorized') ||
          err.message?.includes('401')
        ) {
          errorMessage =
            'ログインセッションが切れています。再度ログインしてください。';
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        新しいスレッドを作成
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          認証状態:
        </Typography>
        <Chip
          label={tokenStatus}
          size="small"
          color={tokenStatus.includes('存在') ? 'success' : 'default'}
          variant="outlined"
        />
      </Box>

      <Divider sx={{ mt: 1, mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          id="title"
          label="タイトル"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="スレッドのタイトル"
          required
          sx={{ mb: 2 }}
        />

        <TextField
          id="description"
          label="説明"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="スレッドの説明"
          required
          sx={{ mb: 3 }}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={isSubmitting}
          sx={{
            minWidth: 150,
            '&.Mui-disabled': {
              backgroundColor: 'action.disabledBackground',
            },
          }}
        >
          スレッドを作成
        </LoadingButton>
      </Box>
    </Box>
  );
}
