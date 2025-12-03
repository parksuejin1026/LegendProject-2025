// 파일 경로: pages/_document.tsx
/**
 * Next.js 커스텀 Document 컴포넌트
 *
 * HTML 문서의 구조(html, head, body)를 커스터마이징합니다.
 * Styled-components의 서버 사이드 렌더링(SSR) 설정을 포함합니다.
 */

import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  // styled-components의 스타일을 SSR을 위해 수집합니다.
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  // 기본 HTML 구조
  render() {
    return (
      <Html lang="ko">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#1a1c20" />
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
