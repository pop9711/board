// 📂 src/components/CategoryManagementModal.jsx

import React, { useState, useContext, useEffect, useRef } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { AuthContext } from '../context/AuthContext'; // 👈 관리자 정보 확인용
import '../styles/Modal.css';

const CategoryManagementModal = ({ onClose }) => {
  // 컨텍스트에서 필요한 값 불러오기
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    resetError
  } = useContext(CategoryContext);

  const { user } = useContext(AuthContext); // 👈 현재 로그인 사용자 정보

  // 상태 정의
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [formError, setFormError] = useState('');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const modalRef = useRef();

  // 🔁 에러 발생 시 메시지 표시
  useEffect(() => {
    if (error) {
      setFormError(error);
      resetError();
    }
  }, [error, resetError]);

  // ❌ ESC 또는 외부 클릭 시 모달 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // ➕ 카테고리 추가 처리
  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!user?.isAdmin) return;
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return setFormError('카테고리명을 입력해주세요.');
    if (categories.some(cat => cat.name === trimmedName)) {
      return setFormError('이미 존재하는 카테고리명입니다.');
    }
    const result = createCategory({ name: trimmedName });
    if (result) {
      setNewCategoryName('');
      setFormError('');
    }
  };

  // ⚙️ 기본 카테고리 생성
  const handleAddDefaultCategories = () => {
    if (!user?.isAdmin) return;
    const defaultCats = ['자유게시판', '질문답변'];
    defaultCats.forEach(name => {
      if (!categories.some(cat => cat.name === name)) {
        createCategory({ name });
      }
    });
  };

  // ✏️ 수정 모드 진입
  const handleEditClick = (category) => {
    if (!user?.isAdmin) return;
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  // ⛔ 수정 취소
  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  // 💾 카테고리 저장
  const handleSaveEdit = (id) => {
    if (!user?.isAdmin) return;
    const trimmedName = editingCategoryName.trim();
    if (!trimmedName) return setFormError('카테고리명을 입력해주세요.');
    if (categories.some(cat => cat.name === trimmedName && cat.id !== id)) {
      return setFormError('이미 존재하는 카테고리명입니다.');
    }
    const result = updateCategory(id, { name: trimmedName });
    if (result) {
      setEditingCategoryId(null);
      setFormError('');
    }
  };

  // 🗑️ 삭제 처리
  const handleDeleteCategory = (id) => {
    if (!user?.isAdmin) return;
    if (window.confirm('이 카테고리를 삭제하시겠습니까?')) {
      deleteCategory(id);
    }
  };

  // ⬆⬇ 드래그 이벤트 핸들러
  const handleDragStart = (e, index) => {
    if (!user?.isAdmin) return;
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    if (!user?.isAdmin) return;
    e.currentTarget.style.opacity = '1';
    setDraggedItemIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (!user?.isAdmin || draggedItemIndex === null || draggedItemIndex === dropIndex) return;
    const draggedCategory = categories[draggedItemIndex];
    const dropCategory = categories[dropIndex];
    if (draggedCategory && dropCategory) {
      reorderCategories(draggedCategory.id, dropCategory.order);
    }
  };

  // 🔀 버튼으로 순서 변경
  const handleMoveCategory = (id, direction) => {
    if (!user?.isAdmin) return;
    const category = categories.find(cat => cat.id === id);
    if (!category) return;
    const newOrder = direction === 'up'
      ? Math.max(1, category.order - 1)
      : Math.min(categories.length, category.order + 1);
    if (newOrder !== category.order) {
      reorderCategories(id, newOrder);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content category-modal" ref={modalRef}>
        <h3>카테고리 관리</h3>

        {/* 에러 메시지 */}
        {formError && <div className="error-message">{formError}</div>}

        {/* ✅ 관리자 전용: 기본 카테고리 생성 */}
        {user?.isAdmin && (
          <div className="default-category-btn-wrapper">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddDefaultCategories}
              disabled={loading}
            >
              기본 카테고리 자동 생성
            </button>
          </div>
        )}

        {/* ➕ 카테고리 생성 폼 */}
        {user?.isAdmin && (
          <form onSubmit={handleCreateCategory} className="category-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="새 카테고리명 입력"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>추가</button>
            </div>
          </form>
        )}

        {/* 📋 카테고리 목록 */}
        <div className="category-list">
          <h4>카테고리 목록</h4>
          {categories.length === 0 ? (
            <p className="no-categories">등록된 카테고리가 없습니다.</p>
          ) : (
            <ul>
              {categories.map((category, index) => (
                <li
                  key={category.id}
                  className="category-item"
                  draggable={user?.isAdmin && editingCategoryId !== category.id}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  {editingCategoryId === category.id ? (
                    <div className="category-edit">
                      <input
                        type="text"
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        autoFocus
                      />
                      <div className="category-actions">
                        <button onClick={() => handleSaveEdit(category.id)} className="btn btn-sm btn-save" disabled={loading}>저장</button>
                        <button onClick={handleCancelEdit} className="btn btn-sm btn-cancel">취소</button>
                      </div>
                    </div>
                  ) : (
                    <div className="category-display">
                      <span className="category-name">{category.name}</span>
                      {user?.isAdmin && (
                        <div className="category-actions">
                          <button onClick={() => handleMoveCategory(category.id, 'up')} className="btn btn-sm btn-move" disabled={category.order === 1 || loading}>↑</button>
                          <button onClick={() => handleMoveCategory(category.id, 'down')} className="btn btn-sm btn-move" disabled={category.order === categories.length || loading}>↓</button>
                          <button onClick={() => handleEditClick(category)} className="btn btn-sm btn-edit">수정</button>
                          <button onClick={() => handleDeleteCategory(category.id)} className="btn btn-sm btn-delete">삭제</button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal-help">
          <p>드래그 앤 드롭으로 카테고리 순서를 변경할 수 있습니다.</p>
        </div>

        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default CategoryManagementModal;
