import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import * as React from 'react';

interface DocumentType {
  (props: DocumentProps): React.ReactNode;
  getInitialProps?: (context: DocumentContext) => Promise<DocumentInitialProps>;
}

const Document: DocumentType = React.memo(() => {
  return (
    <Html>
      <Head>
        <link rel="shortcut icon" type="image/png" href="static/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
});

Document.getInitialProps = NextDocument.getInitialProps;

export default Document;
