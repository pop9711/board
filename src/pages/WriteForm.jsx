// src/pages/WriteForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PostContext } from '../context/PostContext';
import { AuthContext } from '../context/AuthContext';
import { CategoryContext } from '../context/CategoryContext';
import '../styles/WriteForm.css';

const WriteForm = () => {
  const { createPost, getPost, updatePost, loading } = useContext(PostContext);
  const { user } = useContext(AuthContext);
  const { categories } = useContext(CategoryContext);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get('edit');

  const [formValues, setFormValues] = useState({
    category: '',
    title: '',
    content: ''
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // ✅ 카테고리 기본 설정 (초기 렌더링 시)
  useEffect(() => {
    if (categories.length > 0 && formValues.category === '') {
      setFormValues(prev => ({
        ...prev,
        category: categories[0].name
      }));
    }
  }, [categories, formValues.category]);

  // ✅ 수정 모드 게시글 불러오기
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (editId) {
      const post = getPost(editId);
      if (post) {
        if (user.id !== post.authorId) {
          navigate(`/post/${editId}`);
          return;
        }

        setFormValues({
          category: post.category,
          title: post.title,
          content: post.content
        });
      } else {
        navigate('/');
      }
    }
  }, [editId, user, navigate, getPost]);

  // ✅ 유효성 검사
  useEffect(() => {
    const { category, title, content } = formValues;
    setIsFormValid(
      category.trim() !== '' &&
      title.trim() !== '' &&
      content.trim() !== ''
    );
  }, [formValues]);

  // ✅ 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    const postData = {
      ...formValues,
      author: user.username,
      authorId: user.id
    };

    if (editId) {
      updatePost(editId, postData);
      navigate(`/post/${editId}`);
    } else {
      const newPost = await createPost(postData);
      if (newPost && newPost.id) {
        navigate(`/post/${newPost.id}`);
      } else {
        alert('게시글 생성 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCancel = () => {
    navigate(editId ? `/post/${editId}` : '/');
  };

  return (
    <div className="write-form-container">
      <div className="write-form">
        <div className="top-bar">
          <button onClick={handleCancel}>←</button>
          <div className="center">{editId ? '게시글 수정' : '새 게시글 작성'}</div>
          <button type="submit" onClick={handleSubmit} disabled={!isFormValid || loading}>
            {loading ? '처리 중...' : '등록'}
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {/* 카테고리 드롭다운 */}
          <select
            name="category"
            value={formValues.category}
            onChange={handleChange}
            required
          >
            <option value="">카테고리를 선택해주세요</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <input
            type="text"
            name="title"
            placeholder="제목을 입력해주세요."
            value={formValues.title}
            onChange={handleChange}
            required
          />

          <div className="author">
            작성자: {user ? user.username : '로그인 필요'}
          </div>

          <textarea
            name="content"
            rows="10"
            placeholder="내용을 입력해주세요."
            value={formValues.content}
            onChange={handleChange}
            required
          />

          <div className="notice">
            토픽에 맞지 않는 글로 판단되어 다른 유저로부터 일정 수 이상의 신고를 받는 경우<br />
            글이 자동으로 숨김처리 될 수 있습니다.
          </div>
        </form>

        <div className="footer-icons">
          <i className="fas fa-camera" title="이미지 첨부"></i>
          <i className="fas fa-chart-bar" title="차트 추가"></i>
          <i className="fas fa-at" title="멘션"></i>
          <i className="fas fa-hashtag" title="해시태그"></i>
        </div>
      </div>
    </div>
  );
};

export default WriteForm;