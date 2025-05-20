// 📦 React 기본 훅 및 라우팅 관련 도구 import
import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// 🧠 전역 상태 관리: 인증 및 카테고리 컨텍스트 불러오기
import { AuthContext } from '../context/AuthContext';
import { CategoryContext } from '../context/CategoryContext';

// 🎨 CSS 스타일 import
import '../styles/Header.css';

// 📌 Header 컴포넌트 시작
const Header = ({
  toggleLoginModal,       // 로그인 모달 토글
  toggleRegisterModal,    // 회원가입 모달 토글 (사용하지 않는다면 제거 가능)
  toggleSearchModal,      // 검색 모달 토글
  toggleCategoryModal     // 카테고리 관리 모달 토글
}) => {
  // ✅ 로그인 사용자 정보 및 로그아웃 함수
  const { user, logout } = useContext(AuthContext);

  // ✅ 카테고리 목록 가져오기
  const { categories } = useContext(CategoryContext);

  // ✅ 페이지 이동 및 현재 경로 확인
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ '더보기' 드롭다운 상태 관리
  const [showMore, setShowMore] = useState(false);

  // 🔓 로그아웃 처리 함수
  const handleLogout = () => {
    logout();                     // 사용자 정보 제거
    navigate('/board/all');      // 전체 게시판으로 이동
  };

  // 🔐 로그인 버튼 클릭 시
  const handleLoginClick = (e) => {
    e.preventDefault();
    toggleLoginModal();          // 로그인 모달 열기
  };

  // 📝 글쓰기 버튼 클릭 시
  const handleWriteClick = (e) => {
    e.preventDefault();
    if (!user) {
      toggleLoginModal();        // 로그인 안되어있으면 로그인 모달 열기
    } else {
      navigate('/write');        // 로그인된 경우 글쓰기 페이지 이동
    }
  };

  // 🔍 검색 버튼 클릭 시
  const handleSearchClick = (e) => {
    e.preventDefault();
    toggleSearchModal();         // 검색 모달 열기
  };

  // ⚙️ 관리자 카테고리 관리 버튼 클릭 시
  const handleCategoryManage = (e) => {
    e.preventDefault();
    toggleCategoryModal();       // 카테고리 설정 모달 열기
  };

  // 📚 카테고리 중 처음 3개는 바로 보이고, 이후는 '더보기'로 처리
  const visibleCategories = categories.slice(0, 3);
  const hiddenCategories = categories.slice(3);

  return (
    <header className="header">
      {/* 🎯 로고 클릭 시 전체 게시판으로 이동 */}
      <div className="logo" onClick={() => navigate('/board/all')}>
        MyBoard
      </div>

      {/* 📂 카테고리 네비게이션 바 */}
      <nav className="nav">
        {/* ✅ '전체' 카테고리 항상 표시 */}
        <Link
          to="/board/all"
          className={`nav-link ${location.pathname === '/board/all' ? 'active' : ''}`}
        >
          <b>전체</b>
        </Link>

        {/* ✅ 고정으로 표시할 상위 3개 카테고리 */}
        {visibleCategories.map((cat) => (
          <Link
            key={cat.id}
            to={`/board/${encodeURIComponent(cat.name)}`}
            className={`nav-link ${location.pathname === `/board/${encodeURIComponent(cat.name)}` ? 'active' : ''}`}
          >
            {cat.name}
          </Link>
        ))}

        {/* ⏬ 더보기 드롭다운 */}
        {hiddenCategories.length > 0 && (
          <div className="nav-dropdown">
            <button
              className="nav-link more-btn"
              onClick={() => setShowMore((prev) => !prev)}
            >
              더보기 ▾
            </button>
            {showMore && (
              <div className="dropdown-menu">
                {hiddenCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/board/${encodeURIComponent(cat.name)}`}
                    className="dropdown-item"
                    onClick={() => setShowMore(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* 📦 우측 메뉴 영역 */}
      <div className="right">
        {/* ⚙️ 관리자만 보이는 카테고리 관리 버튼 */}
        {user?.isAdmin && (
          <button onClick={handleCategoryManage} className="btn btn-manage" title="카테고리 관리">
            ⚙️
          </button>
        )}

        {/* 🔍 검색 버튼 */}
        <button onClick={handleSearchClick} className="btn btn-search">검색</button>

        {/* ✍️ 글쓰기 버튼 */}
        <button onClick={handleWriteClick} className="btn btn-write">글쓰기</button>

        {/* 👤 로그인 상태에 따라 버튼 다르게 표시 */}
        {user ? (
          <>
            <Link to="/profile" className="user-name">{user.username} 님</Link>
            <button onClick={handleLogout} className="btn btn-logout">로그아웃</button>
          </>
        ) : (
          <button onClick={handleLoginClick} className="btn btn-login">로그인</button>
        )}
      </div>
    </header>
  );
};

export default Header;