# ♟️ LEGEND GOMOKU (오목)

## 💡 프로젝트 개요

이 프로젝트는 **PVE (플레이어 대 AI)** 및 **PVP (플레이어 대 플레이어)** 모드를 지원하는 웹 기반 오목 게임입니다.
Next.js와 TypeScript로 개발되었으며, 강력한 AI, 사운드 효과, 전적 기록 등 다양한 기능을 제공합니다.

### ✨ 주요 기능

- **🤖 스마트 AI (Minimax)**:
  - Minimax 알고리즘과 Alpha-Beta 가지치기를 적용한 강력한 AI
  - **3단계 난이도**: Easy (초보), Medium (중수), Hard (고수)
- **👥 2인용 모드 (PVP)**: 친구와 함께 한 화면에서 대결 가능
- **🎨 몰입감 있는 UI/UX**:
  - 돌을 놓을 때의 타격감 있는 사운드 효과
  - 승리/패배 시 팡파레 및 효과음
  - 긴장감을 더해주는 30초 턴 타이머
- **🏆 전적 시스템**: AI와의 대결 승/패 기록 자동 저장 (Local Storage)

---

## ⚙️ 기술 스택

| 구분 | 기술 스택 | 설명 |
| :--- | :--- | :--- |
| **프레임워크** | **Next.js 14** | React 기반의 풀스택 프레임워크 |
| **언어** | **TypeScript** | 정적 타입을 통한 안정적인 코드 작성 |
| **스타일링** | **Styled-components** | CSS-in-JS를 이용한 컴포넌트 스타일링 |
| **상태 관리** | **React Hooks** | `useState`, `useCallback`, `useEffect` 활용 |
| **오디오** | **Web Audio API** | 외부 파일 없이 브라우저 내장 API로 효과음 합성 |
| **저장소** | **Local Storage** | 사용자 전적 데이터 영구 저장 |

---

## 🚀 시작하는 방법

이 프로젝트는 Node.js와 npm을 사용하여 실행됩니다.

1.  **프로젝트 클론 및 이동:**

    ```bash
    git clone https://github.com/parksuejin1026/LegendProject-2025.git
    cd LegendProject-2025
    ```

2.  **의존성 설치:**

    ```bash
    npm install
    ```

3.  **개발 서버 실행:**
    ```bash
    npm run dev
    ```
    브라우저에서 `http://localhost:3000`으로 접속하여 게임을 즐기세요!

---

## 📁 프로젝트 구조

```
LegendProject-2025/
├── src/
│   ├── core/           # 게임 핵심 로직 (GomokuGame, AI, Sound, Storage)
│   ├── components/     # UI 컴포넌트 (Board, Cell)
│   ├── hooks/          # 커스텀 훅 (useGomokuGame)
│   └── App.tsx         # 메인 앱 컴포넌트
├── pages/              # Next.js 라우팅 (index, game)
├── public/             # 정적 파일
└── ...설정 파일들
```
