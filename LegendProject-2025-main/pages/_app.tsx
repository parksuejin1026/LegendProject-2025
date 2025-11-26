// 파일 경로: pages/_app.tsx

import { AppProps } from 'next/app';
// 전역 스타일 파일 import (src/index.css를 styles/globals.css로 이동/변경해야 함)
import '../styles/globals.css';
import { ThemeProvider } from 'styled-components';

// 프로젝트에서 사용할 실제 테마 객체로 교체해야 합니다.
const theme = {};

function CustomApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default CustomApp;