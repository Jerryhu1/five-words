export {};
// import { Dispatch } from "react";
// import { Action, AnyAction, Middleware, MiddlewareAPI, Store } from "redux";
// import { addPlayer } from "../store/player/actions";
// import { ADD_PLAYER } from "../store/player/types";
// import { AppActions } from "../store/types";
// import {
//   wsConnected,
//   wsDisconnect,
//   wsDisconnected,
//   WS_CONNECT,
//   WS_DISCONNECT,
//   WS_DISCONNECTED,
// } from "../store/websocket/actions";
// import { SocketActions } from "../store/websocket/types";

// export const setupSocket = () => {
//   const socket = new WebSocket("ws://localhost:8989");

//   socket.onopen = () => {
//     console.log("websocket open");
//   };

//   socket.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     switch (data.type) {
//       case ADD_PLAYER:
//         console.log("add");
//         dispatch(addPlayer(data.name));
//         break;
//     }
//   };
// };

// const socketMiddleware: Middleware = () => {
//   let socket: ?WebSocket = null;

//   const onOpen = (store: Store) => (event: any) => {
//     console.log("websocket open", event.target.url);
//     store.dispatch(wsConnected(event.target.url));
//   };

//   const onClose = (store: Store) => (event: any) => {
//     store.dispatch(wsDisconnected(event.target.url));
//   };

//   const onMessage = (store: Store) => (event: any) => {
//     const payload = JSON.parse(event.data);
//     console.log("received server message");

//     switch (payload.type) {
//       case "ADD_PLAYER":
//         store.dispatch(addPlayer(payload.name));
//         break;
//       default:
//         break;
//     }
//   };

//   return (store: MiddlewareAPI<any>) => (next: Dispatch<AnyAction>) => (
//     action: any
//   ) => {
//     switch (action.type) {
//       case WS_CONNECT:
//         if (socket !== null) {
//           socket.close();
//         }
//         socket = new WebSocket(action.payload.host);

//         socket.onopen = onOpen(api.dispatch);
//         socket.onclose = onClose(store);
//         socket.onmessage = onMessage(store);
//         break;
//       case WS_DISCONNECT:
//         if (socket !== null) {
//           socket.close();
//         }
//         socket = null;
//         console.log("websocket closed");
//         break;
//       default:
//         console.log("the next action: ", action);
//         return next(action);
//     }
//   };
// };
