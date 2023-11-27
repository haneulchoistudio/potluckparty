import "~/styles/index.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

export default function App(props: AppProps) {
  const { Component, pageProps: moreProps, router: _Router } = props;
  const { session, ...pageProps } = moreProps;
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
