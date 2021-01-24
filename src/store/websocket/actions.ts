import { createAction } from "typesafe-actions";

export const WS_CONNECT = "WS_CONNECT";
export const WS_CONNECTING = "WS_CONNECTING";
export const WS_CONNECTED = "WS_CONNECTED";
export const WS_DISCONNECT = "WS_DISCONNECT";
export const WS_DISCONNECTED = "WS_DISCONNECTED";
export const WS_NEW_MESSAGE = "WS_NEW_MESSAGE";

export const wsNewMessage = createAction(WS_NEW_MESSAGE, (action) => {
  return (message: string) =>
    action({
      message: message,
    });
});

export const wsConnect = createAction(WS_CONNECT, (action) => {
  return (host: string, name: string) =>
    action({
      host: host,
      name: name,
    });
});

export const wsConnecting = createAction(WS_CONNECTING, (action) => {
  return (host: string) =>
    action({
      host: host,
    });
});

export const wsConnected = createAction(WS_CONNECTED, (action) => {
  return (host: string) =>
    action({
      host: host,
    });
});

export const wsDisconnect = createAction(WS_DISCONNECT, (action) => {
  return (host: string) =>
    action({
      host: host,
    });
});

export const wsDisconnected = createAction(WS_DISCONNECTED, (action) => {
  return (host: string) =>
    action({
      host: host,
    });
});
