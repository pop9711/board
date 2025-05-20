// src/index.js 수정
// React 애플리케이션의 진입점
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 스타일 임포트 경로 수정
import './index.css';  // 경로 수정

// 루트 요소 생성
const root = ReactDOM.createRoot(document.getElementById('root'));

// 애플리케이션 렌더링
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);