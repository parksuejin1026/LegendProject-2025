/** @jsxRuntime classic */
/** @jsxImportSource react */
/* eslint-disable */

/**
 * 게임 페이지
 *
 * 실제 오목 게임이 진행되는 페이지입니다.
 * `src/App` 컴포넌트를 렌더링합니다.
 */

import React from 'react';
import App from '../src/App';
import { NextPage } from 'next';

const GamePage: NextPage = () => {
  return (
    <React.StrictMode>
      {/* 메인 게임 컴포넌트 렌더링 */}
      <App />
    </React.StrictMode>
  );
};

export default GamePage;
