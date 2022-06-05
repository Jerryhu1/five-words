import React from "react";
import { AppProps } from "next/app";
import "./styles/globals.css";
import { store } from "../store";
import { Provider } from "react-redux";
import SocketProvider from "../components/SocketProvider";

function FiveWords({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <SocketProvider>
        <Component {...pageProps} />
      </SocketProvider>
    </Provider>
  );
}

export default FiveWords;
