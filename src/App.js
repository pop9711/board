// src/App.js - 메인 애플리케이션 파일
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 📦 주요 페이지 및 컴포넌트
import Header from './components/Header';
import MainBoard from './pages/MainBoard';
import WriteForm from './pages/WriteForm';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';

// 🧩 팝업 모달 컴포넌트
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import SearchModal from './components/SearchModal';
import CategoryModal from './components/CategoryManagementModal';

// 🧠 글로벌 상태 컨텍스트
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import { CategoryProvider } from './context/CategoryContext';

const App = () => {
  // 🔐 모달 상태 관리
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // 🔁 모달 토글 함수 정의
  const toggleLoginModal = () => {
    setShowLoginModal(prev => !prev);
    setShowRegisterModal(false);
  };

  const toggleRegisterModal = () => {
    setShowRegisterModal(prev => !prev);
    setShowLoginModal(false);
  };

  const toggleSearchModal = () => {
    setShowSearchModal(prev => !prev);
  };

  const toggleCategoryModal = () => {
    setShowCategoryModal(prev => !prev);
  };

  // 🔄 로그인 <-> 회원가입 모달 전환
  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <Router>
      {/* 🌐 글로벌 상태 공급자들 */}
      <AuthProvider>
        <PostProvider>
          <CategoryProvider>
            <div className="App">
              {/* 🔝 상단 헤더 */}
              <Header
                toggleLoginModal={toggleLoginModal}
                toggleRegisterModal={toggleRegisterModal}
                toggleSearchModal={toggleSearchModal}
                toggleCategoryModal={toggleCategoryModal}
              />

              {/* 🧭 페이지 라우팅 */}
              <Routes>
                <Route path="/category/:categoryName" element={<MainBoard />} />
                <Route path="/" element={<MainBoard />} />
                <Route path="/write" element={<WriteForm />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/board/:categoryName" element={<MainBoard />} />
              </Routes>

              {/* 📌 팝업 모달들 */}
              {showLoginModal && (
                <LoginModal
                  onClose={toggleLoginModal}
                  switchToRegister={switchToRegister}
                />
              )}

              {showRegisterModal && (
                <RegisterModal
                  onClose={toggleRegisterModal}
                  switchToLogin={switchToLogin}
                />
              )}

              {showSearchModal && (
                <SearchModal onClose={toggleSearchModal} />
              )}

              {showCategoryModal && (
                <CategoryModal onClose={toggleCategoryModal} />
              )}
            </div>
          </CategoryProvider>
        </PostProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;