import { Http2SecureServer } from "http2";

import axios, { AxiosInstance } from "axios";

export class RoomClient {
  private http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  createRoom = () => {
    return this.http.get(`/room/create`);
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
