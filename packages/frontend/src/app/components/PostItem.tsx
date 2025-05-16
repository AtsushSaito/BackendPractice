'use client';

import { useState, useEffect } from 'react';
import { Post } from '../types';
import { api } from '../utils/api';
import CreatePostForm from './CreatePostForm';
import { Collapse, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PostItemProps {
  post: Post;
  onPostCreated: () => void;
  isReply?: boolean;
  fallbackThreadId?: string; // 親からthreadIdを受け取るフォールバック用
}

export default function PostItem({
  post,
  onPostCreated,
  isReply = false,
  fallbackThreadId,
}: PostItemProps) {
  const [replies, setReplies] = useState<Post[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const [replyCount, setReplyCount] = useState(0);

  // 有効なスレッドIDを取得（優先順位：post.threadId -> fallbackThreadId -> post.thread?.id）
  useEffect(() => {
    // 投稿から直接取得
    if (post.threadId) {
      console.log(`PostItem: 投稿から直接threadIdを取得: ${post.threadId}`);
      setThreadId(post.threadId);
      return;
    }

    // フォールバックから取得
    if (fallbackThreadId) {
      console.log(
        `PostItem: フォールバックからthreadIdを取得: ${fallbackThreadId}`,
      );
      setThreadId(fallbackThreadId);
      return;
    }

    // thread関連からの取得を試みる
    if (post.thread?.id) {
      console.log(
        `PostItem: post.thread.idからthreadIdを取得: ${post.thread.id}`,
      );
      setThreadId(post.thread.id);
      return;
    }

    // parentからの取得を試みる
    if (post.parent?.threadId) {
      console.log(`PostItem: 親投稿のthreadIdを使用: ${post.parent.threadId}`);
      setThreadId(post.parent.threadId);
      return;
    }

    console.warn(
      `PostItem: 投稿ID ${post.id} のthreadIdを取得できませんでした`,
    );
  }, [post, fallbackThreadId]);

  // 初期ロード時に返信数を確認
  useEffect(() => {
    const checkReplies = async () => {
      if (!isReply && post.id) {
        try {
          const repliesData = await api.posts.getReplies(post.id);
          setReplyCount(repliesData.length);
        } catch (err) {
          console.error('返信数取得エラー:', err);
        }
      }
    };

    checkReplies();
  }, [post.id, isReply]);

  // 返信を読み込む関数
  const loadReplies = async () => {
    if (!showReplies) {
      try {
        setIsLoadingReplies(true);
        console.log(`投稿 ${post.id} の返信を読み込み中...`);
        const repliesData = await api.posts.getReplies(post.id);
        console.log(`取得した返信数: ${repliesData.length}`, repliesData);
        setReplies(repliesData);
        setReplyCount(repliesData.length);
        setShowReplies(true);
      } catch (err) {
        console.error('返信取得エラー:', err);
      } finally {
        setIsLoadingReplies(false);
      }
    } else {
      setShowReplies(false);
    }
  };

  // 返信が作成された後の処理
  const handleReplyCreated = async () => {
    // 返信フォームを閉じる
    setShowReplyForm(false);

    // 返信を再読み込み
    try {
      const repliesData = await api.posts.getReplies(post.id);
      setReplyCount(repliesData.length);

      if (showReplies) {
        setReplies(repliesData);
      }

      // 返信がある場合は自動的に表示
      if (repliesData.length > 0 && !showReplies) {
        setShowReplies(true);
        setReplies(repliesData);
      }
    } catch (err) {
      console.error('返信更新エラー:', err);
    }

    // 返信が作成されたことを親コンポーネントに通知するが、
    // トップレベルの投稿リストの更新は行わない
    if (!isReply) {
      // 親投稿自体に変更があった場合のみ親コンポーネントに通知
      // これによりトップレベルの投稿リストは更新されなくなる
      // onPostCreated();
    }
  };

  return (
    <div
      className={`border ${isReply ? 'border-gray-200 ml-4 border-l-4 pl-2' : 'border-gray-300'} p-4 rounded mb-4`}
    >
      <div className="mb-2">
        <div className="whitespace-pre-wrap">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                <img 
                  {...props} 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    margin: '8px 0'
                  }} 
                  alt={props.alt || "投稿画像"}
                  loading="lazy"
                />
              ),
              p: ({node, ...props}) => (
                <p {...props} style={{ marginBottom: '0.5rem' }} />
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {post.user?.username && `${post.user.username} | `}
          {new Date(post.createdAt).toLocaleString()}
          {!threadId && (
            <span className="ml-2 text-yellow-600"> (スレッドID検出中...)</span>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        {/* 返信は最上位の投稿にのみ可能にする */}
        {!isReply && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-blue-500 text-sm hover:underline flex items-center"
            disabled={!threadId && showReplyForm}
          >
            <ChatBubbleOutlineIcon fontSize="small" className="mr-1" />
            {showReplyForm ? '返信をキャンセル' : '返信する'}
          </button>
        )}

        {/* 返信がある場合のみ返信表示ボタンを表示 */}
        {!isReply && replyCount > 0 && (
          <button
            onClick={loadReplies}
            className="text-blue-500 text-sm hover:underline flex items-center"
            disabled={isLoadingReplies}
          >
            {isLoadingReplies ? (
              '読み込み中...'
            ) : (
              <>
                {showReplies ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
                <span className="ml-1">
                  {showReplies ? '返信を非表示' : `返信を表示 (${replyCount})`}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 返信フォーム - 最上位投稿にのみ表示 */}
      {!isReply && showReplyForm && (
        <div className="mt-3">
          {threadId ? (
            <Box sx={{ pl: 2, borderLeft: '2px solid #e0e0e0' }}>
              <CreatePostForm
                threadId={threadId}
                parentId={post.id}
                onPostCreated={handleReplyCreated}
                isReply={true}
              />
            </Box>
          ) : (
            <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-yellow-700">
                スレッドIDを取得中です。少々お待ちください...
              </p>
            </div>
          )}
        </div>
      )}

      {/* 返信一覧 - アニメーション付きで表示 */}
      {!isReply && (
        <Collapse in={showReplies} timeout="auto" unmountOnExit>
          {replies.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ ml: 2, mb: 1, color: 'text.secondary' }}
              >
                返信 ({replies.length})
              </Typography>
              <div className="border-l-2 border-gray-200 pl-2">
                {replies.map((reply) => (
                  <PostItem
                    key={reply.id}
                    post={reply}
                    onPostCreated={handleReplyCreated}
                    isReply={true}
                    fallbackThreadId={threadId}
                  />
                ))}
              </div>
            </Box>
          )}
        </Collapse>
      )}
    </div>
  );
}
