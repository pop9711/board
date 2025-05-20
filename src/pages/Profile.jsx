// src/pages/Profile.jsx
// 사용자 프로필 관리를 위한 프로필 컴포넌트
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import '../styles/Profile.css';

const Profile = () => {
  // 컨텍스트 가져오기
  const { user, updateProfile, changePassword, deleteAccount, loading } = useContext(AuthContext);
  const { getUserPosts } = useContext(PostContext);
  
  const navigate = useNavigate();
  
  // 다양한 탭 상태
  const [activeTab, setActiveTab] = useState('posts');
  // 사용자 게시글 상태
  const [userPosts, setUserPosts] = useState([]);
  // 프로필 폼 상태
  const [profileForm, setProfileForm] = useState({
    name: '',
    username: ''
  });
  // 비밀번호 폼 상태
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  // 폼 오류 상태
  const [error, setError] = useState('');
  // 성공 메시지 상태
  const [successMessage, setSuccessMessage] = useState('');
  // 삭제 확인 상태
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // 로그인하지 않은 경우 리디렉션
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    } else {
      // 사용자 데이터로a 프로필 폼 초기화
      setProfileForm({
        name: user.name || '',
        username: user.username || ''
      });
      
      // 사용자 게시글 가져오기
      const posts = getUserPosts(user.id);
      setUserPosts(posts);
    }
  }, [user, navigate, getUserPosts]);
  
  // 프로필 폼 변경 처리
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };
  
  // 비밀번호 폼 변경 처리
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };
  
  // 프로필 업데이트 처리
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    
    const { name, username } = profileForm;
    
    // 폼 유효성 검사
    if (!name.trim() || !username.trim()) {
      setError('모든 필드를 입력해주세요.');
      setSuccessMessage('');
      return;
    }
    
    // 이전 오류 및 메시지 지우기
    setError('');
    setSuccessMessage('');
    
    // AuthContext에서 프로필 업데이트 함수 호출
    updateProfile({ name, username });
    
    // 성공 메시지 표시
    setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
  };
  
  // 비밀번호 변경 처리
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    
    // 폼 유효성 검사
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('모든 필드를 입력해주세요.');
      setSuccessMessage('');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      setSuccessMessage('');
      return;
    }
    
    if (newPassword.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      setSuccessMessage('');
      return;
    }
    
    // 실제 앱에서는 API에 대해 현재 비밀번호를 검증
    // 데모 목적으로 이 단계를 건너뜁니다
    if (currentPassword !== user.password) {
      setError('현재 비밀번호가 일치하지 않습니다.');
      setSuccessMessage('');
      return;
    }
    
    // 이전 오류 및 메시지 지우기
    setError('');
    setSuccessMessage('');
    
    // AuthContext에서 비밀번호 변경 함수 호출
    changePassword(newPassword);
    
    // 폼 초기화
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // 성공 메시지 표시
    setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
  };
  
  // 계정 삭제 처리
  const handleDeleteAccount = () => {
    deleteAccount();
    navigate('/');
  };
  
  // 날짜 표시 형식 지정
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // 로그인하지 않은 경우
  if (!user) {
    return null; // useEffect에서 리디렉션 발생
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>내 프로필</h2>
      </div>
      
      {/* 프로필 탭 */}
      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          내 게시글
        </button>
        <button 
          className={`tab ${activeTab === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          프로필 수정
        </button>
        <button 
          className={`tab ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          비밀번호 변경
        </button>
        <button 
          className={`tab ${activeTab === 'delete' ? 'active' : ''}`}
          onClick={() => setActiveTab('delete')}
        >
          회원탈퇴
        </button>
      </div>
      
      {/* 오류 또는 성공 메시지 표시 */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      {/* 내 게시글 탭 */}
      {activeTab === 'posts' && (
        <div className="posts-tab">
          <h3>내가 작성한 글</h3>
          
          {userPosts.length > 0 ? (
            <div className="user-posts">
              {userPosts.map(post => (
                <div 
                  key={post.id} 
                  className="post-item"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <div className="post-category">[{post.category}]</div>
                  <div className="post-title">{post.title}</div>
                  <div className="post-meta">
                    <span>좋아요 {post.likes}</span>
                    <span>댓글 {post.comments.length}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-posts">
              작성한 게시글이 없습니다.
            </div>
          )}
        </div>
      )}
      
      {/* 프로필 수정 탭 */}
      {activeTab === 'edit' && (
        <div className="edit-tab">
          <h3>프로필 수정</h3>
          
          <form className="profile-form" onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
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
                value={profileForm.username}
                onChange={handleProfileChange}
                disabled={loading}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="update-btn"
              disabled={loading}
            >
              {loading ? '업데이트 중...' : '프로필 업데이트'}
            </button>
          </form>
        </div>
      )}
      
      {/* 비밀번호 변경 탭 */}
      {activeTab === 'password' && (
        <div className="password-tab">
          <h3>비밀번호 변경</h3>
          
          <form className="password-form" onSubmit={handlePasswordUpdate}>
            <div className="form-group">
              <label htmlFor="currentPassword">현재 비밀번호</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">새 비밀번호</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">새 비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                disabled={loading}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="update-btn"
              disabled={loading}
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        </div>
      )}
      
      {/* 계정 삭제 탭 */}
      {activeTab === 'delete' && (
        <div className="delete-tab">
          <h3>회원탈퇴</h3>
          
          <div className="delete-warning">
            <p>회원탈퇴를 하시면 계정과 관련된 모든 정보가 삭제되며 복구할 수 없습니다.</p>
            <p>정말로 탈퇴하시겠습니까?</p>
          </div>
          
          <button 
            className="delete-btn"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
          >
            회원탈퇴
          </button>
        </div>
      )}
      
      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="modal">
          <div className="modal-content delete-confirm">
            <h3>회원탈퇴 확인</h3>
            <p>정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="confirm-buttons">
              <button 
                className="confirm-yes" 
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                예, 탈퇴합니다
              </button>
              <button 
                className="confirm-no"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                아니오, 취소합니다
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
