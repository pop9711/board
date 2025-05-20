// src/components/LoginModal.jsx
// 로그인 모달 컴포넌트
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Modal.css';

const LoginModal = ({ onClose, switchToRegister }) => {
  // 인증 컨텍스트 가져오기
  const { login, loading } = useContext(AuthContext);
  
  // 폼 값 상태
  const [formValues, setFormValues] = useState({
    username: '',
    password: ''
  });
  // 폼 오류 상태
  const [error, setError] = useState('');
  
  // 폼 입력 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { username, password } = formValues;
    
    // 폼 유효성 검사
    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    // 이전 오류 지우기
    setError('');
    
    // 비밀번호 길이 체크 (데모 목적)
    if (password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    
    // AuthContext에서 로그인 함수 호출
    login({
      id: Date.now(), // 임시 ID 생성
      username,
      password, // 실제 앱에서는 상태나 localStorage에 비밀번호를 저장하지 않음
    });
    
    // 로그인 후 모달 닫기
    onClose();
  };
  
  // 모달 외부 클릭 시 모달 닫기
  const handleModalClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };
  
  // 회원가입으로 전환 핸들러
  const handleSwitchToRegister = (e) => {
    e.preventDefault();
    switchToRegister();
  };
  
  return (
    <div className="modal" onClick={handleModalClick}>
      <div className="modal-content auth-modal">
        <div className="modal-tabs">
          <button className="active">로그인</button>
          <button onClick={switchToRegister}>회원가입</button>
        </div>
        
        <h3>로그인</h3>
        
        {/* 오류 메시지 표시 */}
        {error && <div className="error-message">{error}</div>}
        
        {/* 로그인 폼 */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              disabled={loading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        {/* 회원가입 링크 */}
        <div className="auth-links">
          <p>
            계정이 없으신가요? <button className="link-button" onClick={handleSwitchToRegister}>회원가입</button>
          </p>
        </div>
        
        {/* 닫기 버튼 */}
        <button className="close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default LoginModal;