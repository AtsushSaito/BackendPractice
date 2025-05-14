'use client';

import { useState } from 'react';
import { api } from '../utils/api';
import { Box, TextField, Paper, Typography, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';

interface CreatePostFormProps {
  threadId: string;
  parentId?: string;
  onPostCreated: () => void;
}

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: (props) =>
    props.elevation === 0
      ? theme.palette.grey[50]
      : theme.palette.background.paper,
}));

export default function CreatePostForm({
  threadId,
  parentId,
  onPostCreated,
}: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim() === '') {
      setError('投稿内容を入力してください。');
      return;
    }

    try {
      console.log('投稿作成処理を開始...');
      console.log(`スレッドID: ${threadId}`);
      if (parentId) {
        console.log(`親投稿ID: ${parentId}`);
      }

      setIsSubmitting(true);
      const postData = {
        content,
        threadId,
        parentId, // parentIdが存在する場合はこれが返信になる
      };

      console.log('送信データ:', postData);
      console.log(
        'トークンの確認:',
        localStorage.getItem('token') ? 'あり' : 'なし',
      );

      // トークンをチェック
      const token = localStorage.getItem('token');
      if (token) {
        console.log('トークン先頭:', token.substring(0, 20) + '...');
      }

      console.log('API呼び出し前...');
      await api.posts.create(postData);
      console.log('投稿作成成功');

      // 投稿成功後にフォームをリセット
      setContent('');
      setError(null);

      // 親コンポーネントに投稿が作成されたことを通知
      onPostCreated();
    } catch (err: any) {
      console.error('投稿作成エラー:', err);
      console.error('エラーメッセージ:', err.message);
      console.error('エラータイプ:', typeof err);
      if (err.stack) {
        console.error('スタックトレース:', err.stack);
      }

      setError(err.message || '投稿の作成に失敗しました。ログインが必要です。');
    } finally {
      setIsSubmitting(false);
      console.log('投稿処理完了');
    }
  };

  return (
    <FormPaper elevation={parentId ? 0 : 1}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 500,
          mb: 2,
        }}
      >
        {parentId ? '返信を投稿' : '新しい投稿を作成'}
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 1,
          }}
        >
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentId ? '返信内容を入力...' : '投稿内容を入力...'}
          required
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            loading={isSubmitting}
            sx={{ minWidth: 120 }}
          >
            {parentId ? '返信する' : '投稿する'}
          </LoadingButton>
        </Box>
      </Box>
    </FormPaper>
  );
}
