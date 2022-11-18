import "../styles/style.scss";

import { PointsProvider } from "../context/context";
import { AccountContextProvider } from "../context/accountContext";

import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <AccountContextProvider>
      <PointsProvider>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <Component {...pageProps} />
      </PointsProvider>
    </AccountContextProvider>
  );
}

export default MyApp;
