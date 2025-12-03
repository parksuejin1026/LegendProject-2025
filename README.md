# 🎮 LEGEND GOMOKU (레전드 오목)

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**프리미엄 웹 기반 오목 게임 - 최고의 UI/UX와 강력한 AI**

[데모 보기](#) | [기능 소개](#-주요-기능) | [시작하기](#-시작하는-방법)

</div>

---

## 💡 프로젝트 개요

**LEGEND GOMOKU**는 전통적인 오목 게임을 현대적인 웹 기술로 재해석한 프리미엄 게임 플랫폼입니다.
Next.js와 TypeScript로 개발되었으며, 세련된 UI/UX와 강력한 AI를 제공합니다.

### ✨ 주요 기능

#### 🎯 게임 모드
- **🤖 AI 대전 (PvE)**
  - Minimax 알고리즘 + Alpha-Beta 가지치기 기반 강력한 AI
  - 3단계 난이도: 🐣 쉬움 / 🐥 보통 / 🦅 어려움
  - AI 사고 과정 실시간 표시
  - 힌트 시스템 (AI 평가 점수 히트맵)

- **👥 로컬 대전 (PvP)**
  - 한 기기에서 2인 플레이
  - 금지수 규칙 적용
  - 턴제 게임플레이

#### 🎨 프리미엄 UI/UX
- **⏱️ 원형 프로그레스 타이머**
  - 시간에 따른 색상 변화 (녹색 → 빨간색)
  - 10초 이하 긴박감 표현 (펄스 애니메이션)
  - 첫 수 이후 자동 시작

- **💎 고급 애니메이션**
  - 💧 돌 드롭 인 효과 (위에서 떨어짐)
  - 🌊 리플 효과 (물결 퍼짐)
  - ✨ 승리선 글로우 효과
  - 🎊 승리 시 Confetti

- **🪵 프리미엄 바둑판**
  - 나무 질감 그라데이션 배경
  - 전통 방식 교차점 기반 돌 배치
  - 화점 (Star Points) 표시
  - 다층 그림자 효과

- **🎴 모드 선택 페이지**
  - 3D 카드 디자인
  - 호버 시 Float 애니메이션
  - 각 모드별 상세 설명

#### 🏆 게임 시스템
- **📊 게임 기록 시스템**
  - 최근 10게임 자동 저장
  - 승률 실시간 계산
  - 게임 통계 시각화
  - LocalStorage 활용

- **🎯 결과 모달**
  - 승리/패배/무승부 전용 화면
  - 게임 통계 표시 (총 수, 소요 시간)
  - 부드러운 애니메이션

- **🎵 사운드 효과**
  - 돌 놓는 소리
  - 승리/패배 효과음
  - 음소거 토글

#### 🎨 테마 시스템
- **Modern**: 현대적이고 깔끔한 디자인
- **Wood**: 전통 나무 바둑판 느낌
- **Dark**: 다크 모드
- **Neon**: 네온 사이버펑크 스타일

#### 📱 모바일 최적화
- 반응형 디자인
- 터치 최적화
- 하단 네비게이션 바
- 모바일 전용 레이아웃

---

## ⚙️ 기술 스택

| 구분 | 기술 | 설명 |
|:---|:---|:---|
| **프레임워크** | Next.js 14 | React 기반 풀스택 프레임워크 |
| **언어** | TypeScript 5.0 | 정적 타입 시스템 |
| **스타일링** | Styled-components | CSS-in-JS |
| **데이터베이스** | MongoDB + Mongoose | NoSQL 데이터베이스 |
| **상태 관리** | React Hooks | useState, useCallback, useEffect |
| **애니메이션** | Keyframes, Canvas Confetti | 부드러운 애니메이션 |

---

## 🚀 시작하는 방법

### 필수 요구사항
- Node.js 18.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **프로젝트 클론**
   ```bash
   git clone https://github.com/parksuejin1026/LegendProject-2025.git
   cd LegendProject-2025
   ```

2. **환경 변수 설정**
   
   `.env.local` 파일 생성:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **의존성 설치**
   ```bash
   npm install
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   
   브라우저에서 `http://localhost:3000` 접속

5. **프로덕션 빌드**
   ```bash
   npm run build
   npm start
   ```

---

## 📁 프로젝트 구조

```
LegendProject-2025/
├── src/
│   ├── core/                 # 게임 핵심 로직
│   │   ├── GomokuGame.ts    # 메인 게임 엔진
│   │   ├── AI.ts            # Minimax AI
│   │   ├── SoundManager.ts  # 사운드 관리
│   │   ├── StorageManager.ts # 로컬 저장소
│   │   └── HistoryManager.ts # 게임 기록
│   ├── components/           # UI 컴포넌트
│   │   ├── Board.tsx        # 게임 보드
│   │   ├── Cell.tsx         # 개별 셀
│   │   ├── ModeSelection.tsx # 모드 선택
│   │   ├── GameResultModal.tsx # 결과 모달
│   │   ├── GameHistory.tsx  # 게임 기록
│   │   ├── LandingPage.tsx  # 랜딩 페이지
│   │   ├── ProfileView.tsx  # 프로필
│   │   └── ...
│   ├── hooks/               # 커스텀 훅
│   │   └── useGomokuGame.ts
│   ├── styles/              # 스타일
│   │   └── theme.ts
│   └── App.tsx              # 메인 앱
├── pages/
│   ├── api/                 # API 라우트
│   │   ├── auth/           # 인증
│   │   ├── game/           # 게임 데이터
│   │   └── rankings.ts     # 랭킹
│   └── index.tsx
└── public/                  # 정적 파일
```

---

## 🎮 게임 플레이 가이드

### 기본 규칙
1. 15x15 바둑판에서 진행
2. 흑돌이 먼저 시작
3. 가로, 세로, 대각선으로 5개를 먼저 놓으면 승리
4. 금지수 규칙 적용 (렌주룰)

### 조작 방법
- **마우스**: 교차점 클릭으로 돌 배치
- **터치**: 모바일에서 탭으로 배치
- **되돌리기**: 이전 수로 복귀
- **다시 시작**: 새 게임 시작

---

## 📊 버전 히스토리

### v2.0.0 (2025-12-04) - UI/UX 대규모 개선
- ⏱️ 원형 프로그레스 타이머 추가
- 💧 돌 놓기 애니메이션 (드롭 인 + 리플)
- 🤖 AI 사고 중 인디케이터
- 🪵 프리미엄 바둑판 디자인
- 🎯 교차점 기반 돌 배치
- 🏆 승리/패배 전용 모달
- 📊 게임 기록 시스템
- 🎴 모드 선택 전용 페이지

### v1.x - 기본 기능
- 기본 게임 로직
- AI 구현
- 테마 시스템
- MongoDB 연동

---

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 👨‍💻 개발자

**박수진 (Park Suejin)**
- GitHub: [@parksuejin1026](https://github.com/parksuejin1026)
- Email: parksuejin1026@gmail.com

---

## 🙏 감사의 말

이 프로젝트는 다음 기술들을 사용하여 만들어졌습니다:
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Styled Components](https://styled-components.com/)
- [MongoDB](https://www.mongodb.com/)
- [Canvas Confetti](https://www.kirilv.com/canvas-confetti/)

---

<div align="center">

**⭐ 이 프로젝트가 마음에 드셨다면 Star를 눌러주세요! ⭐**

Made with ❤️ by Park Suejin

</div>
