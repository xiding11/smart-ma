import "../components/rangeCalendar/aria.css";
import "../styles/globals.css";
import "../styles/time-field-aria.css";

import { AppProps } from "next/app";

import App from "../components/app";

function MyApp({ Component, pageProps, router }: AppProps) {
    return <App Component={Component} pageProps={pageProps} router={router} />;
}

export default MyApp;
