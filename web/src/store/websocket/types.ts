export enum ReceiveMessageType {
  SetRoom = "SET_ROOM",
  ClientRegistered = "CLIENT_REGISTERED",
  AddMessage = "ADD_MESSAGE",
}

export interface SocketMessage {
  body: any;
  type: ReceiveMessageType;
}
