// src/context/CategoryContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// 외부 상수로 분리 (eslint warning 방지)
const DEFAULT_CATEGORIES = [
  { id: 1, name: '자유게시판', order: 1 },
  { id: 2, name: '질문답변', order: 2 },
];

// 컨텍스트 생성
export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 📦 초기 카테고리 불러오기
  useEffect(() => {
    const stored = localStorage.getItem('categories');
    try {
      const parsed = stored ? JSON.parse(stored) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        setCategories(parsed);
      } else {
        setCategories(DEFAULT_CATEGORIES);
        localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
      }
    } catch {
      console.error('❌ 카테고리 파싱 오류');
      setCategories(DEFAULT_CATEGORIES);
      localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
    }
  }, []); // 의존성 없음

  // 💾 로컬스토리지 동기화
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // ✅ 카테고리 생성
  const createCategory = ({ name }) => {
    const trimmed = name?.trim();
    if (!trimmed) {
      setError('카테고리명을 입력해주세요.');
      return false;
    }
    if (categories.some(cat => cat.name === trimmed)) {
      setError('이미 존재하는 카테고리명입니다.');
      return false;
    }

    setLoading(true);
    try {
      const newCategory = {
        id: Date.now(),
        name: trimmed,
        order: categories.length + 1,
      };
      setCategories(prev => [...prev, newCategory]);
      return true;
    } catch {
      setError('카테고리 생성 중 오류가 발생했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ 카테고리 수정
  const updateCategory = (id, { name }) => {
    const trimmed = name?.trim();
    if (!trimmed) {
      setError('카테고리명을 입력해주세요.');
      return false;
    }
    if (categories.some(cat => cat.name === trimmed && cat.id !== id)) {
      setError('이미 존재하는 카테고리명입니다.');
      return false;
    }

    setLoading(true);
    try {
      setCategories(prev =>
        prev.map(cat => (cat.id === id ? { ...cat, name: trimmed } : cat))
      );
      return true;
    } catch {
      setError('카테고리 수정 중 오류가 발생했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ 카테고리 삭제
  const deleteCategory = (id) => {
    setLoading(true);
    try {
      const updated = categories
        .filter(cat => cat.id !== id)
        .map((cat, i) => ({ ...cat, order: i + 1 }));
      setCategories(updated);
    } catch {
      setError('카테고리 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ 순서 변경
  const reorderCategories = (draggedId, newOrder) => {
    const dragged = categories.find(cat => cat.id === draggedId);
    if (!dragged) return;

    const others = categories.filter(cat => cat.id !== draggedId);
    others.splice(newOrder - 1, 0, dragged);

    const reordered = others.map((cat, i) => ({ ...cat, order: i + 1 }));
    setCategories(reordered);
  };

  // ❌ 에러 초기화
  const resetError = () => setError(null);

  return (
    <CategoryContext.Provider
      value={{
        categories: [...categories].sort((a, b) => a.order - b.order),
        loading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        resetError,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};