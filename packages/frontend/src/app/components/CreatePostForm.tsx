'use client';

import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Box, TextField, Paper, Typography, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';

interface CreatePostFormProps {
  threadId: string;
  parentId?: string;
  onPostCreated: () => void;
  isReply?: boolean;
}

// TypeScript対応のためのインターフェース
interface FormPaperProps {
  elevation?: number;
}

const FormPaper = styled(Paper)<FormPaperProps>(({ theme, elevation = 1 }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    elevation === 0 ? theme.palette.grey[50] : theme.palette.background.paper,
}));

export default function CreatePostForm({
  threadId,
  parentId,
  onPostCreated,
  isReply,
}: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validThreadId, setValidThreadId] = useState(false);

  // コンポーネント初期化時にスレッドIDをチェック
  useEffect(() => {
    if (!threadId) {
      console.error('CreatePostFormにthreadIdが提供されていません');
      setValidThreadId(false);
      setError(
        'スレッドIDが不足しています。投稿先のスレッドを特定できません。',
      );
    } else {
      console.log(`CreatePostForm初期化 - スレッドID: ${threadId}`);
      setValidThreadId(true);
      setError(null);
    }
  }, [threadId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim() === '') {
      setError('投稿内容を入力してください。');
      return;
    }

    // 再度スレッドIDをチェック
    if (!threadId) {
      console.error('スレッドIDが空です');
      setError('スレッドIDが見つかりません。もう一度お試しください。');
      return;
    }

    try {
      console.log('投稿作成処理を開始...');
      console.log(`スレッドID: ${threadId}, タイプ: ${typeof threadId}`);
      if (parentId) {
        console.log(`親投稿ID: ${parentId}`);
      }

      setIsSubmitting(true);
      const postData = {
        content,
        threadId: threadId.toString(), // 確実に文字列として送信
        parentId, // parentIdが存在する場合はこれが返信になる
      };

      console.log('送信データ:', postData);

      // トークンをチェック
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('トークンがありません - ログインが必要です');
        setError('投稿するにはログインが必要です。');
        setIsSubmitting(false);
        return;
      }

      console.log('トークン確認:', 'あり', '長さ:', token.length);
      console.log('トークン先頭:', token.substring(0, 20) + '...');

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

      // エラーメッセージを適切に設定
      if (
        err.message.includes('Authorization') ||
        err.message.includes('Unauthorized')
      ) {
        setError('ログインが必要です。認証情報が不足しています。');
      } else if (err.message.includes('threadId')) {
        setError('スレッドIDのエラー: 投稿先のスレッドが見つかりません。');
      } else {
        setError(err.message || '投稿の作成に失敗しました。');
      }
    } finally {
      setIsSubmitting(false);
      console.log('投稿処理完了');
    }
  };

  return (
    <FormPaper elevation={parentId || isReply ? 0 : 1}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 500,
          mb: 2,
        }}
      >
        {parentId || isReply ? '返信を投稿' : '新しい投稿を作成'}
        {threadId && (
          <Typography variant="caption" display="block" color="text.secondary">
            スレッドID: {threadId}
          </Typography>
        )}
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
          placeholder={
            parentId || isReply ? '返信内容を入力...' : '投稿内容を入力...'
          }
          required
          sx={{ mb: 2 }}
          disabled={!validThreadId}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            loading={isSubmitting}
            disabled={!validThreadId}
            sx={{ minWidth: 120 }}
          >
            {parentId || isReply ? '返信する' : '投稿する'}
          </LoadingButton>
        </Box>
      </Box>
    </FormPaper>
  );
}
