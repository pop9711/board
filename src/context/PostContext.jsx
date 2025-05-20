// src/context/PostContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// 게시글 컨텍스트 생성
export const PostContext = createContext();

// 초기 게시글 예시
const initialPosts = [
  {
    id: 1,
    category: '회사생활',
    title: '첫 출근날 실수한 썰',
    content: '오늘 첫 출근을 했는데 지각을 했습니다...',
    author: '홍길동',
    authorId: 1,
    likes: 12,
    likedBy: [2, 3],
    comments: [],
    createdAt: new Date().toISOString()
  }
];

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📦 초기 로딩 시 로컬 스토리지에서 게시글 불러오기
  useEffect(() => {
    setLoading(true);
    const stored = localStorage.getItem('posts');
    try {
      setPosts(stored ? JSON.parse(stored) : initialPosts);
    } catch {
      setPosts(initialPosts);
    } finally {
      setLoading(false);
    }
  }, []);

  // 💾 게시글 저장 함수
  const savePosts = (updated) => {
    setPosts(updated);
    localStorage.setItem('posts', JSON.stringify(updated));
  };

  // ✅ 게시글 생성
  const createPost = (postData) => {
    const newPost = {
      ...postData,
      id: Date.now(),
      category: postData.category || '자유게시판',
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
    return newPost; // 👈 반드시 return 해줘야 이후 navigate 가능
  };

  // 📥 게시글 1개 가져오기
  const getPost = (id) => posts.find(post => post.id === Number(id));

  // ✏️ 게시글 수정
  const updatePost = (id, postData) => {
    const updatedPosts = posts.map(post =>
      post.id === Number(id)
        ? { ...post, ...postData, updatedAt: new Date().toISOString() }
        : post
    );
    savePosts(updatedPosts);
  };

  // ❌ 게시글 삭제
  const deletePost = (id) => {
    const updated = posts.filter(post => post.id !== Number(id));
    savePosts(updated);
  };

  // ❤️ 좋아요 토글
  const toggleLike = (postId, userId) => {
    if (!userId) return;

    const updated = posts.map(post => {
      if (post.id === Number(postId)) {
        const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
        const hasLiked = likedBy.includes(userId);

        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          likedBy: hasLiked
            ? likedBy.filter(id => id !== userId)
            : [...likedBy, userId]
        };
      }
      return post;
    });

    savePosts(updated);
  };

  // 👍 좋아요 여부 확인
  const hasUserLiked = (postId, userId) => {
    const post = posts.find(p => p.id === Number(postId));
    return Array.isArray(post?.likedBy) && post.likedBy.includes(userId);
  };

  // 💬 댓글 추가
  const addComment = (postId, comment) => {
    const updated = posts.map(post => {
      if (post.id === Number(postId)) {
        const newComment = {
          id: Date.now(),
          ...comment,
          createdAt: new Date().toISOString()
        };
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });
    savePosts(updated);
  };

  // ✏️ 댓글 수정
  const updateComment = (postId, commentId, newContent) => {
    const updated = posts.map(post => {
      if (post.id === Number(postId)) {
        const updatedComments = post.comments.map(comment =>
          comment.id === Number(commentId)
            ? { ...comment, content: newContent, updatedAt: new Date().toISOString() }
            : comment
        );
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    savePosts(updated);
  };

  // ❌ 댓글 삭제
  const deleteComment = (postId, commentId) => {
    const updated = posts.map(post => {
      if (post.id === Number(postId)) {
        const filtered = post.comments.filter(c => c.id !== Number(commentId));
        return { ...post, comments: filtered };
      }
      return post;
    });
    savePosts(updated);
  };

  // 🔍 특정 유저의 글만 반환
  const getUserPosts = (userId) =>
    posts.filter(post => post.authorId === Number(userId));

  // 🔍 게시글 검색
  const searchPosts = (query) =>
    posts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.author.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        createPost,
        getPost,
        updatePost,
        deletePost,
        toggleLike,
        hasUserLiked,
        addComment,
        updateComment,
        deleteComment,
        getUserPosts,
        searchPosts
      }}
    >
      {children}
    </PostContext.Provider>
  );
};