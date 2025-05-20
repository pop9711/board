// src/pages/Home.jsx
import React, { useState, useContext, useEffect } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { PostContext } from '../context/PostContext';
import '../styles/Home.css';

const Home = () => {
  const { categories } = useContext(CategoryContext);
  const { posts } = useContext(PostContext);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState(1); // '전체' 카테고리 ID
  const [filteredPosts, setFilteredPosts] = useState([]);
  
  // 선택된 카테고리에 따라 게시글 필터링
  useEffect(() => {
    if (selectedCategoryId === 1) {
      // '전체' 카테고리인 경우 모든 게시글 표시
      setFilteredPosts(posts);
    } else {
      // 선택된 카테고리에 해당하는 게시글만 필터링
      const filtered = posts.filter(post => post.categoryId === selectedCategoryId);
      setFilteredPosts(filtered);
    }
  }, [selectedCategoryId, posts]);
  
  return (
    <div className="home-container">
      {/* 카테고리 탭 */}
      <div className="category-tabs">
        {categories
          .sort((a, b) => a.order - b.order) // 순서대로 정렬
          .map(category => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategoryId === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </button>
          ))}
      </div>
      
      {/* 게시글 목록 */}
      <div className="posts-container">
        {/* 여기에 게시글 목록 표시 로직 */}
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className="post-item">
              {/* 게시글 내용 표시 */}
            </div>
          ))
        ) : (
          <div className="no-posts">
            <p>게시글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;