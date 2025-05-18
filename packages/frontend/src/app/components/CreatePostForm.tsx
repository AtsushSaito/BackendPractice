'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import {
  Box,
  TextField,
  Paper,
  Typography,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';

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

interface ImageUploadInfo {
  id: string;
  url: string;
  filename: string;
}

const FormPaper = styled(Paper)<FormPaperProps>(({ theme, elevation = 1 }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    elevation === 0 ? theme.palette.grey[50] : theme.palette.background.paper,
}));

const ImagePreview = styled('img')({
  maxWidth: '100%',
  maxHeight: '200px',
  objectFit: 'contain',
  marginTop: '8px',
  marginBottom: '8px',
  borderRadius: '4px',
});

const HiddenInput = styled('input')({
  display: 'none',
});

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<ImageUploadInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];

    try {
      setIsUploading(true);
      setError(null);

      console.log('画像アップロード開始:', file.name);
      const result = await api.images.upload(file);
      console.log('画像アップロード成功:', result);

      const newImage = {
        id: Date.now().toString(),
        url: result.location,
        filename: file.name,
      };

      setUploadedImages([...uploadedImages, newImage]);

      // カーソル位置にURLを挿入
      if (textFieldRef.current) {
        const cursorPosition =
          textFieldRef.current.selectionStart || content.length;
        const textBefore = content.substring(0, cursorPosition);
        const textAfter = content.substring(cursorPosition);

        // 画像のMarkdown記法を挿入
        const imageMarkdown = `![${file.name}](${result.location})`;
        const newContent = textBefore + imageMarkdown + textAfter;

        setContent(newContent);
      }
    } catch (err: unknown) {
      console.error('画像アップロードエラー:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'エラーが発生しました';
      setError(`画像のアップロードに失敗しました: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      // ファイル選択をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
      setUploadedImages([]);

      // 親コンポーネントに投稿が作成されたことを通知
      onPostCreated();
    } catch (err: unknown) {
      console.error('投稿作成エラー:', err);

      if (err instanceof Error) {
        console.error('エラーメッセージ:', err.message);
        console.error('エラータイプ:', typeof err);
        if (err.stack) {
          console.error('スタックトレース:', err.stack);
        }

        const errorMsg = err.message;
        if (
          errorMsg.includes('Authorization') ||
          errorMsg.includes('Unauthorized')
        ) {
          setError('ログインが必要です。認証情報が不足しています。');
        } else if (errorMsg.includes('threadId')) {
          setError('スレッドIDのエラー: 投稿先のスレッドが見つかりません。');
        } else {
          setError(errorMsg || '投稿の作成に失敗しました。');
        }
      } else {
        setError('投稿の作成に失敗しました。');
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
          disabled={!validThreadId || isSubmitting}
          inputRef={textFieldRef}
        />

        <HiddenInput
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          disabled={!validThreadId || isSubmitting || isUploading}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button
            startIcon={<ImageIcon />}
            onClick={handleImageButtonClick}
            disabled={!validThreadId || isSubmitting || isUploading}
            variant="outlined"
            color="primary"
            size="small"
          >
            {isUploading ? '画像アップロード中...' : '画像を追加'}
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            loading={isSubmitting}
            disabled={!validThreadId || isUploading}
            sx={{ minWidth: 120 }}
          >
            {parentId || isReply ? '返信する' : '投稿する'}
          </LoadingButton>
        </Box>

        {uploadedImages.length > 0 && (
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              アップロードした画像がコンテンツに挿入されています
            </Typography>
            {uploadedImages.map((image) => (
              <Box
                key={image.id}
                sx={{ position: 'relative', display: 'inline-block' }}
              >
                <ImagePreview src={image.url} alt={image.filename} />
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </FormPaper>
  );
}
