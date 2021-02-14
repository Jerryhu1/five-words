import { Http2SecureServer } from "http2";

import axios, { AxiosInstance } from "axios";

export class RoomClient {
  private http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  createRoom = (
    name: string,
    playerName: string,
    scoreGoal: number,
    lang: string
  ) => {
    return this.http.post(`/room/create`, {
      room: name,
      playerName: playerName,
      scoreGoal: scoreGoal,
      language: lang,
    });
  };

  addPlayerToRoom = (roomName: string, playerName: string) => {
    return this.http.post(`/room/${roomName}/add`, {
      name: playerName,
    });
  };
}

const http = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

export default new RoomClient(http);
