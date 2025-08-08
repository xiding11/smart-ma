import "../styles/globals.css";
import "../components/rangeCalendar/aria.css";

import App from "../components/app";
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <App Component={Component} pageProps={pageProps} router={router} />
  );
}

export default MyApp;
