// src/components/RegisterModal.jsx
// 회원가입 모달 컴포넌트
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Modal.css';

const RegisterModal = ({ onClose, switchToLogin }) => {
  // 인증 컨텍스트 가져오기
  const { register, loading } = useContext(AuthContext);
  
  // 폼 값 상태
  const [formValues, setFormValues] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
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
    
    const { name, username, password, confirmPassword } = formValues;
    
    // 폼 유효성 검사
    if (!name.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    
    // 이전 오류 지우기
    setError('');
    
    // AuthContext에서 회원가입 함수 호출
    register({
      name,
      username,
      password, // 실제 앱에서는 상태나 localStorage에 비밀번호를 저장하지 않음
    });
    
    // 회원가입 후 모달 닫기
    onClose();
  };
  
  // 모달 외부 클릭 시 모달 닫기
  const handleModalClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };
  
  // 로그인으로 전환 핸들러
  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    switchToLogin();
  };
  
  return (
    <div className="modal" onClick={handleModalClick}>
      <div className="modal-content auth-modal">
        <div className="modal-tabs">
          <button onClick={switchToLogin}>로그인</button>
          <button className="active">회원가입</button>
        </div>
        
        <h3>회원가입</h3>
        
        {/* 오류 메시지 표시 */}
        {error && <div className="error-message">{error}</div>}
        
        {/* 회원가입 폼 */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder="사용할 아이디를 입력하세요"
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={loading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? '가입 중...' : '가입하기'}
          </button>
        </form>
        
        {/* 로그인 링크 */}
        <div className="auth-links">
          <p>
            이미 계정이 있으신가요? <button className="link-button" onClick={handleSwitchToLogin}>로그인</button>
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

export default RegisterModal;