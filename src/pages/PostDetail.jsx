// src/pages/PostDetail.jsx
// 게시글과 댓글을 표시하는 게시글 상세 컴포넌트
import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PostContext } from '../context/PostContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getPost,
    deletePost,
    toggleLike,
    addComment,
    updateComment,
    deleteComment,
    loading
  } = useContext(PostContext);
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    const fetchPost = () => {
      const postData = getPost(id);
      if (postData) {
        setPost(postData);
      } else {
        navigate('/');
      }
    };
    fetchPost();
  }, [id, getPost, navigate]);

  const handleLike = () => {
    if (!user || !user.id) {
      alert('로그인 후 좋아요를 누를 수 있습니다.');
      return;
    }
    toggleLike(id, user.id);
    setPost(prev => ({
      ...prev,
      likes: prev.likedBy?.includes(user.id) ? prev.likes - 1 : prev.likes + 1,
      likedBy: prev.likedBy?.includes(user.id)
        ? prev.likedBy.filter(uid => uid !== user.id)
        : [...(prev.likedBy || []), user.id]
    }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (commentContent.trim() === '') return;
    const comment = {
      authorId: user.id,
      author: user.username,
      content: commentContent
    };
    addComment(id, comment);
    setPost(prev => ({
      ...prev,
      comments: [...prev.comments, {
        id: Date.now(),
        ...comment,
        createdAt: new Date().toISOString()
      }]
    }));
    setCommentContent('');
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentContent('');
  };

  const handleSaveComment = (commentId) => {
    if (editCommentContent.trim() === '') return;
    updateComment(id, commentId, editCommentContent);
    setPost(prev => ({
      ...prev,
      comments: prev.comments.map(comment =>
        comment.id === commentId
          ? { ...comment, content: editCommentContent, updatedAt: new Date().toISOString() }
          : comment
      )
    }));
    setEditingCommentId(null);
    setEditCommentContent('');
  };

  const handleDeleteCommentClick = (commentId) => {
    setCommentToDelete(commentId);
  };

  const handleDeleteComment = () => {
    if (!commentToDelete) return;
    deleteComment(id, commentToDelete);
    setPost(prev => ({
      ...prev,
      comments: prev.comments.filter(comment => comment.id !== commentToDelete)
    }));
    setCommentToDelete(null);
  };

  const handleDeletePost = () => {
    deletePost(id);
    navigate('/');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  if (loading || !post) return <div className="loading-container">로딩 중...</div>;

  return (
    <div className="post-detail-container">
      <div className="post-header">
        <div className="category">[{post.category}]</div>
        <h1 className="title">{post.title}</h1>
        <div className="post-meta">
          <span className="author">작성자: {post.author}</span>
          <span className="date">{formatDate(post.createdAt)}</span>
        </div>
      </div>
      <div className="post-content">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="post-actions">
        <button className="like-btn" onClick={handleLike}>
          ❤️ 좋아요 ({post.likes})
        </button>
        {user && user.id === post.authorId && (
          <div className="author-actions">
            <Link to={`/write?edit=${post.id}`} className="edit-btn">✏️ 수정</Link>
            <button className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>🗑️ 삭제</button>
          </div>
        )}
      </div>
      {showDeleteConfirm && (
        <div className="modal">
          <div className="modal-content delete-confirm">
            <h3>게시글 삭제</h3>
            <p>정말 이 게시글을 삭제하시겠습니까?</p>
            <div className="confirm-buttons">
              <button className="confirm-yes" onClick={handleDeletePost}>예, 삭제합니다</button>
              <button className="confirm-no" onClick={() => setShowDeleteConfirm(false)}>아니오, 취소합니다</button>
            </div>
          </div>
        </div>
      )}
      <div className="comments-section">
        <h3>댓글 {post.comments.length}개</h3>
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            placeholder={user ? "댓글을 입력하세요..." : "댓글을 작성하려면 로그인하세요."}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            disabled={!user}
          />
          <button type="submit" disabled={!user || commentContent.trim() === ''}>댓글 작성</button>
        </form>
        <div className="comments-list">
          {post.comments.length > 0 ? (
            post.comments.map(comment => (
              <div key={comment.id} className="comment">
                {editingCommentId === comment.id ? (
                  <div className="comment-edit-form">
                    <textarea
                      value={editCommentContent}
                      onChange={(e) => setEditCommentContent(e.target.value)}
                      autoFocus
                    />
                    <div className="comment-edit-actions">
                      <button className="comment-save-btn" onClick={() => handleSaveComment(comment.id)} disabled={editCommentContent.trim() === ''}>저장</button>
                      <button className="comment-cancel-btn" onClick={handleCancelEdit}>취소</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="comment-meta">
                      <span className="comment-author">{comment.author}</span>
                      <div className="comment-date-actions">
                        {comment.createdAt && (
                          <span className="comment-date">
                            {comment.updatedAt ? '수정됨: ' : ''}{formatDate(comment.updatedAt || comment.createdAt)}
                          </span>
                        )}
                        {user && user.id === comment.authorId && (
                          <div className="comment-actions">
                            <button className="comment-edit-btn" onClick={() => handleEditComment(comment)}>수정</button>
                            <button className="comment-delete-btn" onClick={() => handleDeleteCommentClick(comment.id)}>삭제</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="no-comments">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</div>
          )}
        </div>
      </div>
      {commentToDelete && (
        <div className="modal">
          <div className="modal-content delete-confirm">
            <h3>댓글 삭제</h3>
            <p>정말 이 댓글을 삭제하시겠습니까?</p>
            <div className="confirm-buttons">
              <button className="confirm-yes" onClick={handleDeleteComment}>예, 삭제합니다</button>
              <button className="confirm-no" onClick={() => setCommentToDelete(null)}>아니오, 취소합니다</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;