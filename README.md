# 🎮 LEGEND GOMOKU (레전드 오목)

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**프리미엄 웹 기반 오목 게임 - 최고의 UI/UX와 강력한 AI**

[데모 보기](#) | [기능 소개](#-주요-기능) | [시작하기](#-시작하는-방법)

</div>

---

## 💡 프로젝트 개요

**LEGEND GOMOKU**는 전통적인 오목 게임을 현대적인 웹 기술로 재해석한 프리미엄 게임 플랫폼입니다.
Next.js와 TypeScript로 개발되었으며, 세련된 UI/UX와 독창적인 AI 페르소나 시스템을 제공합니다.

### ✨ 주요 기능

#### 🎯 게임 모드
- **🤖 AI 대전 (PvE)**
  - Minimax 알고리즘 + Alpha-Beta 가지치기 기반 강력한 AI
  - 3단계 난이도: 🐣 쉬움 / 🐥 보통 / 🦅 어려움
  - **AI 페르소나 시스템**: 🐯 공격형, 🐢 방어형, 🦊 트릭스터 등 다양한 성격의 AI
  - AI 사고 과정 실시간 표시 및 힌트 시스템

- **👥 로컬 대전 (PvP)**
  - 한 기기에서 2인 플레이
  - 금지수 규칙 (렌주룰) 완벽 적용

- **🧩 묘수 풀이 (Challenge Mode)**
  - 다양한 오목 퍼즐 해결
  - 전략적 수 읽기 능력 향상

#### 🎨 프리미엄 UI/UX
- **✨ 다이내믹 비주얼**
  - **Global Particles Background**: 앱 전체를 감싸는 신비로운 파티클 배경
  - **Glassmorphism UI**: 유려한 반투명 유리 질감의 카드 및 UI 디자인
  - 💎 고급 애니메이션: 돌 드롭 인(Drop-in), 리플(Ripple) 효과, 승리선 글로우

- **🪵 테마 커스터마이징**
  - **🎨 나만의 테마 만들기 (Custom Theme Creator)**: 보드, 배경, 돌 색상을 자유롭게 조합하여 저장
  - 기본 제공 테마: Modern, Wood, Dark, Neon

- **🪵 프리미엄 바둑판**
  - 나무 질감 그라데이션, 다층 그림자 효과
  - 화점 (Star Points) 및 좌표 표시

#### 🏆 게임 시스템 & 소셜
- **💬 이모티콘 채팅 (Emote Chat)**
  - 게임 중 상대방(혹은 AI)에게 감정 표현 보내기 (메아리 기능)

- **⏪ 복기 시스템 (Replay System)**
  - 게임 종료 후 한 수씩 되돌려보며 전략 분석 가능
  - 슬라이더를 통한 직관적인 탐색

- **📊 게임 기록 및 프로필**
  - 승/패/무 전적 자동 저장 및 통계 시각화
  - 최근 10게임 히스토리 관리

---

## ⚙️ 기술 스택

| 구분 | 기술 | 설명 |
|:---|:---|:---|
| **프레임워크** | Next.js 14 | React 기반 풀스택 프레임워크 |
| **언어** | TypeScript 5.0 | 정적 타입 시스템 |
| **스타일링** | Styled-components | CSS-in-JS & Global Theming |
| **데이터베이스** | MongoDB + Mongoose | NoSQL 데이터베이스 (사용자 정보/전적) |
| **상태 관리** | React Hooks (Custom) | 복잡한 게임 로직 캡슐화 |
| **애니메이션** | CSS Keyframes, Canvas | 고성능 애니메이션 및 파티클 |

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
│   ├── core/                 # 게임 핵심 로직 (AI, 엔진)
│   ├── components/           # UI 컴포넌트
│   │   ├── game/            # 게임 관련 (Controls, Status)
│   │   ├── Board.tsx        # 메인 보드
│   │   ├── CustomThemeCreator.tsx # 테마 제작기
│   │   ├── EmoteChat.tsx    # 이모티콘 채팅
│   │   ├── ParticlesBackground.tsx # 배경 효과
│   │   └── ...
│   ├── hooks/               # useGomokuGame (게임 상태 관리)
│   ├── styles/              # Global Style & Theme Defs
│   └── App.tsx              # 메인 애플리케이션 진입점
├── pages/
│   ├── api/                 # Next.js API Routes
│   └── index.tsx
└── public/                  # 정적 리소스
```

---

## 🎮 게임 플레이 가이드

### 기본 규칙
1. 15x15 바둑판에서 진행
2. 흑돌이 먼저 시작 (선수)
3. 5목을 먼저 완성하면 승리 (오목)
4. **금지수 (렌주룰)**: 흑돌은 3-3, 4-4, 6목 이상 금지 (백돌은 허용)

### 조작 방법
- **클릭/터치**: 돌 착수
- **방향키**: 키보드로 커서 이동 후 Space/Enter로 착수 가능
- **Ctrl+Z**: 무르기 (Human vs AI 모드)
- **R**: 재시작

---

## 📊 버전 히스토리

### v2.1.0 (2025-12-07) - 기능 확장 및 시각적 개선
- 🧩 묘수 풀이 (Challenge Mode) 추가
- 🎨 커스텀 테마 제작 기능 (Custom Theme Creator)
- 💬 이모티콘 채팅 시스템 도입
- ✨ Glassmorphism UI 및 Global Particles 적용
- 🤖 AI 페르소나 시스템 (성격 부여)

### v2.0.0 (2025-12-04) - UI/UX 대규모 개선
- 프리미엄 디자인 리뉴얼
- 애니메이션 및 사운드 효과 강화
- 게임 기록 및 복기 시스템

### v1.0.0 - 초기 릴리즈
- 기본 오목 게임 로직 및 AI 구현

---

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면 PR을 보내주세요! 버그 제보와 기능 제안도 환영합니다.

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 👨‍💻 개발자

**박수진 (Park Suejin)**
- GitHub: [@parksuejin1026](https://github.com/parksuejin1026)
- Email: parksuejin1026@naver.com

---

<div align="center">

**⭐ 이 프로젝트가 마음에 드셨다면 Star를 눌러주세요! ⭐**

Made with ❤️ by Park Suejin

</div>
