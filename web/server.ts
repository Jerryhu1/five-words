import express from "express";
import next from "next";
import {createProxyMiddleware} from "http-proxy-middleware";

const isPro = process.env.NODE_ENV === "production",
  version = process.env.NEXT_PUBLIC_VERSION || "dev mode"

export const getWsServerHost = () => {
  const host = process.env.SERVER_HOST || "127.0.0.1:8080"
  if (process.env.NODE_ENV === "production") {
    return `wss://${host}`
  }

  return `ws://${host}`
}

export const getHttpServerHost = () => {
  const host = process.env.SERVER_HOST || "127.0.0.1:8080"
  if (process.env.NODE_ENV === "production") {
    return `wss://${host}`
  }

  return `ws://${host}`
}
const banner = `

███████╗██╗██╗░░░██╗███████╗  ░██╗░░░░░░░██╗░█████╗░██████╗░██████╗░░██████╗
██╔════╝██║██║░░░██║██╔════╝  ░██║░░██╗░░██║██╔══██╗██╔══██╗██╔══██╗██╔════╝
█████╗░░██║╚██╗░██╔╝█████╗░░  ░╚██╗████╗██╔╝██║░░██║██████╔╝██║░░██║╚█████╗░
██╔══╝░░██║░╚████╔╝░██╔══╝░░  ░░████╔═████║░██║░░██║██╔══██╗██║░░██║░╚═══██╗
██║░░░░░██║░░╚██╔╝░░███████╗  ░░╚██╔╝░╚██╔╝░╚█████╔╝██║░░██║██████╔╝██████╔╝
╚═╝░░░░░╚═╝░░░╚═╝░░░╚══════╝  ░░░╚═╝░░░╚═╝░░░╚════╝░╚═╝░░╚═╝╚═════╝░╚═════╝░

version ${version}
`;

console.log(banner);

//@ts-ignore
const logErrors = (err, req, res, next) => {
  console.error(err.stack);
  next(err);
};

const port = process.env.PORT || 3000;
const app = next({
  dev: !isPro,
});


(async () => {
  await app.prepare();
  const server = express();
  const ws = createProxyMiddleware({
    target: getWsServerHost(),
    ws: true,
  });

  const api = createProxyMiddleware({
    target: getHttpServerHost(),
    ws: true,
    pathRewrite: {"^/api": ""},
  });

  server.use(ws)
  server.use(logErrors);

  await server.listen(port);

  console.log(`> Ready on http://localhost:${port}`);
})();