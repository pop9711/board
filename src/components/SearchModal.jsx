// src/components/SearchModal.jsx
// 게시글 검색을 위한 검색 모달 컴포넌트
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostContext } from '../context/PostContext';
import '../styles/Modal.css';

const SearchModal = ({ onClose }) => {
  // 검색어 상태
  const [query, setQuery] = useState('');
  // 검색 결과 상태
  const [results, setResults] = useState([]);
  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState(false);
  
  // 게시글 컨텍스트 가져오기
  const { searchPosts } = useContext(PostContext);
  const navigate = useNavigate();
  
  // 모달 외부 클릭 감지를 위한 참조
  const modalRef = React.useRef();
  // 검색 입력 필드에 대한 참조
  const inputRef = React.useRef();
  
  // 모달이 열리면 자동으로 검색 입력란에 포커스
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // 외부 클릭 시 모달 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    // 이벤트 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);
    
    // ESC 키를 누르면 모달 닫기
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    // 이벤트 리스너 정리
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // 검색어 변경 처리
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // 검색어가 2자 이상이면 게시글 검색
    if (value.length >= 2) {
      setIsLoading(true);
      
      // 디바운싱 효과를 위해 setTimeout 사용
      const timer = setTimeout(() => {
        const searchResults = searchPosts(value);
        setResults(searchResults);
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  };

  // 검색 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (query.length >= 2) {
      const searchResults = searchPosts(query);
      setResults(searchResults);
    }
  };

  // 결과 클릭 시 해당 게시글로 이동
  const handleResultClick = (postId) => {
    navigate(`/post/${postId}`);
    onClose();
  };

  // 날짜 표시 형식 지정
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="modal">
      <div className="modal-content search-modal" ref={modalRef}>
        <h3>게시글 검색</h3>
        
        {/* 검색 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="search-input-container">
            <input
              type="text"
              placeholder="검색어를 입력하세요 (최소 2글자)"
              value={query}
              onChange={handleSearch}
              ref={inputRef}
              autoComplete="off"
            />
          </div>
        </form>
        
        {/* 검색 결과 */}
        <div className="search-results">
          {isLoading ? (
            <div className="loading-message">검색 중...</div>
          ) : results.length > 0 ? (
            results.map(post => (
              <div 
                key={post.id} 
                className="search-result-item"
                onClick={() => handleResultClick(post.id)}
              >
                <div className="search-result-title">{post.title}</div>
                <div className="search-result-meta">
                  <span>{post.category}</span>
                  <span>{post.author}</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
            ))
          ) : query.length >= 2 ? (
            <div className="no-results">검색 결과가 없습니다.</div>
          ) : null}
        </div>
        
        {/* 닫기 버튼 */}
        <button className="close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default SearchModal;