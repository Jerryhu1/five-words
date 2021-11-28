import React from "react";
import {AppProps} from "next/app";
import './styles/globals.css'
import {store} from "../store";
import {Provider} from "react-redux";

function FiveWords({Component, pageProps}: AppProps) {
  return <Provider store={store}>
    <Component {...pageProps} />
  </Provider>;
}

export default FiveWords;
