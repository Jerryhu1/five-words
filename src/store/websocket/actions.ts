import { createAction } from "typesafe-actions";
import {
  DEFAULT_PREFIX,
  WEBSOCKET_MESSAGE,
} from "@giantmachines/redux-websocket";
export const WS_CONNECT = "WS_CONNECT";
export const WS_CONNECTING = "WS_CONNECTING";
export const WS_CONNECTED = "WS_CONNECTED";
export const WS_DISCONNECT = "WS_DISCONNECT";
export const WS_DISCONNECTED = "WS_DISCONNECTED";
export const WS_SEND_MESSAGE = "WS_NEW_MESSAGE";
export const SET_SESSION = "SET_SESSION";
export const WS_RECEIVE_MESSAGE = `${DEFAULT_PREFIX}::${WEBSOCKET_MESSAGE}`;

export const wsNewMessage = createAction(WS_SEND_MESSAGE, (action) => {
  return (type: string, body: string) =>
    action({
      type: type,
      body: body,
    });
});

export const wsConnect = createAction(WS_CONNECT, (action) => {
  return (host: string) =>
    action({
      host: host,
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

export const setSession = createAction(SET_SESSION, (action) => {
  return (sessionID: string) =>
    action({
      sessionID: sessionID
    })
})