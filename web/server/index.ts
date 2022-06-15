import express from "express";
import next from "next";
import {createProxyMiddleware} from "http-proxy-middleware";

const host = process.env.SERVER_HOST || "127.0.0.1:8080"
const isPro = process.env.NODE_ENV === "production",
  version = process.env.NEXT_PUBLIC_VERSION || "dev mode"
console.log(process.env.NODE_ENV)
export const getWsServerHost = () => {
  if (process.env.NODE_ENV === "production") {
    return `wss://${host}`
  }

  return `ws://${host}`
}

export const getHttpServerHost = () => {
  if (process.env.NODE_ENV === "production") {
    return `https://${host}`
  }

  return `http://${host}`
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

const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();
  const ws = createProxyMiddleware('/socket', {
    target: "http://localhost:8080",
    changeOrigin: true,
    ws: true,
    logLevel: 'debug',
    pathRewrite: {"/socket": ""}
  });

  const api = createProxyMiddleware({
    target: "http://localhost:8080",
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {"^/api": ""}
  });
  server.use(logErrors);
  server.use(ws)
  server.use('/api', api)

  server.get("*", (req, res) => handle(req, res));
  await server.listen(port);


  console.log(`> Ready on http://localhost:${port}`);
})();