
# 🧑‍💻 React 게시판 웹사이트 만들기 메뉴얼

> 누구나 따라할 수 있도록 상세하게 설명된 안내서입니다. `board.zip` 안의 구조를 기준으로 설명합니다.

---

## 📦 1. 개발 환경 준비

### 💻 필수 설치
- [Node.js](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Google Chrome](https://www.google.com/chrome/)

### 📁 프로젝트 생성

```bash
npx create-react-app board
cd board
npm install react-router-dom
```

---

## 🗂️ 2. 폴더 구조 설명

```
src/
├── App.js                   # 전체 앱 라우팅 및 구성
├── index.js                # 앱 시작점
├── components/             # UI 컴포넌트
│   ├── Header.jsx
│   ├── LoginModal.jsx
│   ├── RegisterModal.jsx
│   ├── SearchModal.jsx
│   └── CategoryManagementModal.jsx
├── pages/
│   └── MainBoard.jsx        # 메인 게시판 페이지
├── context/                # 상태 관리
│   ├── AuthContext.jsx
│   ├── PostContext.jsx
│   └── CategoryContext.jsx
├── styles/
│   ├── Header.css
│   ├── Modal.css
│   └── MainBoard.css
```

---

## 💡 3. 주요 기능 요약

### ✅ `Header.jsx`
- 로고 / 카테고리 / 더보기 메뉴 / 검색 / 글쓰기 / 로그인 표시
- `admin` 계정은 카테고리 관리(⚙️) 버튼 표시됨

### 📝 `MainBoard.jsx`
- 게시글 목록 보여주기
- 최신순/좋아요순 정렬 버튼
- 카테고리별 필터 기능
- 페이지네이션 포함

### 🔐 `AuthContext.jsx`
- 로그인/회원가입/로그아웃 관리
- `admin` 계정은 특별한 권한 부여됨

### 📁 `CategoryContext.jsx`
- 카테고리 추가/수정/삭제/순서 변경
- 관리자만 사용 가능

### ✍️ `PostContext.jsx`
- 게시글 작성, 좋아요, 댓글 수 등 관리

---

## 🎨 4. 스타일 설명 (CSS)

### `MainBoard.css`
- `.card`로 게시글을 카드 형태로 보여줌
- `.category-filter`로 카테고리 버튼 생성
- 반응형 지원 (`@media` 쿼리 포함)

### `Header.css`
- 상단바 고정
- 메뉴 우측 버튼 줄바꿈 없이 유지
- 드롭다운(더보기 버튼)은 작은 화면에서도 정상 동작

---

## 🚀 5. 실행 방법

```bash
npm start
```

> 실행하면 브라우저에서 `http://localhost:3000`으로 열립니다.

---

## 🧪 6. 체크리스트

- [ ] 로그인, 로그아웃 잘 되는가?
- [ ] 게시글 정렬이 최신순/좋아요순으로 바뀌는가?
- [ ] 카테고리가 상단 3개까지만 보이고, 나머지는 더보기로 나오는가?
- [ ] 관리자(admin)만 ⚙️ 버튼 보이는가?
- [ ] 검색 기능이 동작하는가?
- [ ] 반응형으로 화면이 줄어도 메뉴가 한 줄에 유지되는가?

---

## 🔑 관리자 계정 정보

```
ID: admin
PW: admin1234
```

---

## 💬 도움말 명령어

필요한 부분만 다시 보고 싶다면 아래처럼 요청하세요:

- `AuthContext 전체 코드`
- `MainBoard 정렬 추가 설명`
- `카테고리 드롭다운 동작 방식`
- `로그인 모달 구현`
- `좋아요 누르기 기능`

---

**이 매뉴얼을 그대로 따라 하면 완성도 높은 게시판을 만들 수 있습니다!**
