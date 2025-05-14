'use client';

import { useState, useEffect } from 'react';
import { Post } from '../types';
import { api } from '../utils/api';
import CreatePostForm from './CreatePostForm';

interface PostItemProps {
  post: Post;
  onPostCreated: () => void;
  isReply?: boolean;
}

export default function PostItem({
  post,
  onPostCreated,
  isReply = false,
}: PostItemProps) {
  const [replies, setReplies] = useState<Post[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  // 返信を読み込む関数
  const loadReplies = async () => {
    if (!showReplies) {
      try {
        setIsLoadingReplies(true);
        const repliesData = await api.posts.getReplies(post.id);
        setReplies(repliesData);
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
    if (showReplies) {
      try {
        const repliesData = await api.posts.getReplies(post.id);
        setReplies(repliesData);
      } catch (err) {
        console.error('返信更新エラー:', err);
      }
    }

    // 親コンポーネントに通知
    onPostCreated();
  };

  return (
    <div
      className={`border ${isReply ? 'border-gray-200 ml-8' : 'border-gray-300'} p-4 rounded`}
    >
      <div className="mb-2">
        <p className="whitespace-pre-wrap">{post.content}</p>
        <div className="mt-2 text-sm text-gray-500">
          {post.user?.username && `${post.user.username} | `}
          {new Date(post.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-blue-500 text-sm hover:underline"
        >
          {showReplyForm ? '返信をキャンセル' : '返信する'}
        </button>

        {!isReply && replies.length > 0 && (
          <button
            onClick={loadReplies}
            className="text-blue-500 text-sm hover:underline"
            disabled={isLoadingReplies}
          >
            {isLoadingReplies
              ? '読み込み中...'
              : showReplies
                ? '返信を非表示'
                : `返信を表示 (${replies.length})`}
          </button>
        )}
      </div>

      {showReplyForm && (
        <div className="mt-3">
          <CreatePostForm
            threadId={post.threadId}
            parentId={post.id}
            onPostCreated={handleReplyCreated}
          />
        </div>
      )}

      {showReplies && replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {replies.map((reply) => (
            <PostItem
              key={reply.id}
              post={reply}
              onPostCreated={handleReplyCreated}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
