import { AppProps } from "next/dist/next-server/lib/router/router";
import React from "react";
import { Store } from "redux";
import { AppState } from "..";
import App from "next/app";
import { wrapper } from "../store";

type Props = AppProps & { store: Store<AppState> };
class Application extends App<Props> {
  render() {
    const { Component, pageProps, store } = this.props;
    return <Component {...pageProps} />;
  }
}

export default wrapper.withRedux(Application);
