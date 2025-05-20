// 📄 src/pages/MainBoard.jsx
// ✅ 모든 게시글을 표시하는 메인 보드 컴포넌트

import React, { useContext, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PostContext } from '../context/PostContext';
import { CategoryContext } from '../context/CategoryContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/MainBoard.css';

const MainBoard = () => {
  // 🔁 필요한 전역 상태 가져오기
  const { posts, loading, toggleLike } = useContext(PostContext);
  const { categories } = useContext(CategoryContext);
  const { user } = useContext(AuthContext);
  const { categoryName } = useParams(); // 📌 URL에서 카테고리명 추출

  const [filteredPosts, setFilteredPosts] = useState([]); // 🔍 필터링된 게시글 목록
  const [currentPage, setCurrentPage] = useState(1);       // 📄 현재 페이지
  const [sortType, setSortType] = useState('latest');      // 🔽 정렬 기준: 최신순/좋아요순
  const postsPerPage = 5;                                  // 📌 페이지당 게시글 수

  // 🔄 게시글 필터링 및 정렬 처리
  useEffect(() => {
    let filtered = [...posts];

    // 📂 선택된 카테고리로 필터링
    if (categoryName && categoryName !== 'all') {
      filtered = filtered.filter(post => post.category === categoryName);
    }

    // ⏳ 정렬 방식에 따른 정렬 처리
    if (sortType === 'latest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortType === 'likes') {
      filtered.sort((a, b) => b.likes - a.likes);
    }

    setFilteredPosts(filtered); // 결과 저장
  }, [categoryName, posts, sortType]);

  // 📊 페이지 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // ❤️ 좋아요 클릭 처리
  const handleLike = (e, id) => {
    e.preventDefault();
    if (user && user.id) {
      toggleLike(id, user.id);
    } else {
      alert('로그인 후 좋아요를 누를 수 있습니다.');
    }
  };

  // 📅 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 📦 전체 카테고리 필터 옵션 구성
  const filterOptions = ['all', ...categories.map(cat => cat.name)];

  return (
    <div className="main-container">
      <div className="banner">광고 문의 </div>
      <div className="board-container">
        <div className="board-header">
          <div className="board-title">📚 최신 게시글</div>

          {/* 🔘 정렬 버튼 */}
          <div className="sort-buttons">
            <button
              className={`category-btn ${sortType === 'latest' ? 'active' : ''}`}
              onClick={() => setSortType('latest')}
            >
              최신순
            </button>
            <button
              className={`category-btn ${sortType === 'likes' ? 'active' : ''}`}
              onClick={() => setSortType('likes')}
            >
              좋아요순
            </button>
          </div>
        </div>

        {/* ✅ 카테고리 필터 (상단 3개만 고정 표시 가능) */}
        <div className="category-filter">
          {filterOptions.slice(0, 3).map(category => (
            <Link
              key={category}
              to={category === 'all' ? '/' : `/category/${encodeURIComponent(category)}`}
              className={`category-btn ${categoryName === category || (categoryName === undefined && category === 'all') ? 'active' : ''}`}
              onClick={() => setCurrentPage(1)}
            >
              {category === 'all' ? '전체' : category}
            </Link>
          ))}
        </div>

        {/* 🔄 게시글 목록 */}
        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : currentPosts.length > 0 ? (
          <>
            {currentPosts.map(post => (
              <Link to={`/post/${post.id}`} key={post.id} className="post-link">
                <div className="card">
                  <div className="category">[{post.category}]</div>
                  <div className="title">{post.title}</div>
                  <div className="content-preview">{post.content.substring(0, 100)}...</div>
                  <div className="meta">
                    <span>작성자: {post.author}</span>
                    <span>
                      <button className="like-btn" onClick={(e) => handleLike(e, post.id)}>
                        ❤️ {post.likes}
                      </button> ·
                      댓글 {post.comments.length} ·
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* ✅ 페이지네이션 */}
            {filteredPosts.length > postsPerPage && (
              <div className="pagination">
                {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="no-posts">게시글이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MainBoard;