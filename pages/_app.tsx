// 파일 경로: pages/_app.tsx
/**
 * Next.js 커스텀 App 컴포넌트
 *
 * 모든 페이지의 초기화를 처리합니다.
 * 전역 스타일을 임포트하고, 테마 프로바이더 등을 설정할 수 있습니다.
 */

import { AppProps } from 'next/app';
// 전역 스타일 파일 import
// 전역 스타일 파일 import
import '../styles/globals.css';

import Head from 'next/head';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default CustomApp;
