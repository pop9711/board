// 📦 리액트 훅과 컨텍스트 관련 함수들 import
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

// 🧠 AuthContext 생성: 로그인 정보를 전역에서 공유하기 위한 컨텍스트 객체
export const AuthContext = createContext();

// ✅ AuthProvider 컴포넌트: 로그인 관련 전역 상태를 관리하고 자식 컴포넌트에 제공
export const AuthProvider = ({ children }) => {
  // 로그인된 사용자 정보 상태 (null이면 로그인 안 됨)
  const [user, setUser] = useState(null);

  // 로그인 또는 회원가입 등의 요청 중 표시용 로딩 상태
  const [loading, setLoading] = useState(false);

  // 🔁 앱 첫 실행 시 localStorage에 저장된 사용자 정보 불러오기
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // 문자열 -> 객체
    }
  }, []);

  // 🔐 로그인 처리 함수 (관리자 계정 판별 포함)
  const login = useCallback((userData) => {
    setLoading(true);

    setTimeout(() => {
      let isAdmin = false;

      // 관리자 계정 판별: username과 password가 정확히 일치할 경우
      if (
        userData.username === 'admin' &&
        userData.password === 'admin1234'
      ) {
        isAdmin = true;
      }

      // 로그인 사용자 객체 생성
      const loginUser = {
        id: Date.now(),
        username: userData.username,
        isAdmin: isAdmin, // 관리자 여부 지정
      };

      // 상태 및 localStorage에 저장
      setUser(loginUser);
      localStorage.setItem('user', JSON.stringify(loginUser));
      setLoading(false);
    }, 1000); // 1초 지연 (서버 통신을 가정한 UX 개선용)
  }, []);

  // 🚪 로그아웃 함수: 상태 및 로컬스토리지 초기화
  const logout = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('user');
      setLoading(false);
    }, 500);
  }, []);

  // 🆕 회원가입 처리 (일반 사용자만 가능)
  const register = useCallback((userData) => {
    setLoading(true);
    setTimeout(() => {
      const newUser = {
        ...userData,
        id: Date.now(),
        isAdmin: false, // 회원가입 사용자는 관리자 아님
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setLoading(false);
    }, 1000);
  }, []);

  // 📝 사용자 프로필 정보 수정
  const updateProfile = useCallback((updatedData) => {
    setLoading(true);
    setTimeout(() => {
      const updatedUser = { ...user, ...updatedData }; // 기존 정보 유지 + 변경된 데이터
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setLoading(false);
    }, 1000);
  }, [user]);

  // ❌ 계정 삭제 함수
  const deleteAccount = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('user');
      setLoading(false);
    }, 1000);
  }, []);

  // 🔑 비밀번호 변경 함수
  const changePassword = useCallback((newPassword) => {
    setLoading(true);
    setTimeout(() => {
      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setLoading(false);
    }, 1000);
  }, [user]);

  // ✅ 로그인 여부를 boolean 값으로 리턴
  const isAuthenticated = useMemo(() => !!user, [user]);

  // 🌐 자식 컴포넌트에서 사용할 수 있도록 전역 상태/함수들을 제공
  const value = {
    user,                 // 로그인 사용자 객체
    isAuthenticated,      // 로그인 여부
    loading,              // 로딩 상태
    login,                // 로그인 함수
    logout,               // 로그아웃 함수
    register,             // 회원가입 함수
    updateProfile,        // 프로필 수정 함수
    deleteAccount,        // 계정 삭제 함수
    changePassword        // 비밀번호 변경 함수
  };

  // 🌍 Context로 하위 컴포넌트 감싸기
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};