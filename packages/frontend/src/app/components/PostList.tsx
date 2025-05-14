'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Post } from '../types';
import { api } from '../utils/api';
import PostItem from './PostItem';

interface PostListProps {
  threadId: string;
}

const PostList = forwardRef<
  { handlePostCreated: () => Promise<void> },
  PostListProps
>(function PostList({ threadId }, ref) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 新しい投稿が作成された後に投稿リストを更新するためのコールバック
  const handlePostCreated = async () => {
    try {
      setIsLoading(true);
      const postsData = await api.posts.getByThreadId(threadId);
      const topLevelPosts = postsData.filter((post) => !post.parentId);
      setPosts(topLevelPosts);
    } catch (err) {
      console.error('投稿更新エラー:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // refを通じてhandlePostCreatedメソッドを公開
  useImperativeHandle(ref, () => ({
    handlePostCreated,
  }));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const postsData = await api.posts.getByThreadId(threadId);
        const topLevelPosts = postsData.filter((post) => !post.parentId);
        setPosts(topLevelPosts);
        setError(null);
      } catch (err) {
        console.error('投稿取得エラー:', err);
        setError('投稿の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    if (threadId) {
      fetchPosts();
    }
  }, [threadId]);

  if (isLoading) {
    return <div className="text-center p-4">投稿を読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center p-4">
        まだ投稿がありません。最初の投稿をしてみましょう。
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold">投稿一覧</h3>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            onPostCreated={handlePostCreated}
          />
        ))}
      </div>
    </div>
  );
});

export default PostList;
