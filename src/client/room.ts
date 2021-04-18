import { Http2SecureServer } from "http2";

import axios, { AxiosInstance } from "axios";

export class RoomClient {
  private http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  getRoom = (name: string) => {
    return this.http.get("/room/" + name);
  };

  createRoom = (
    scoreGoal: number,
    lang: string
  ) => {
    return this.http.post(`/room/create`, {
      scoreGoal: scoreGoal,
      language: lang,
    });
  };

  addPlayerToRoom = (roomName: string, playerName: string) => {
    return this.http.post(`/room/${roomName}/add?name=${playerName}`);
  };

  setPlayerTeam = (
    roomName: string,
    playerID: string,
    oldTeam: string,
    newTeam: string
  ) => {
    return this.http.post(`/room/${roomName}/setPlayerTeam`, {
      player: playerID,
      oldTeam: oldTeam,
      newTeam: newTeam,
    });
  };
}

const http = axios.create({
  baseURL: "http://localhost:8080",
});

export default new RoomClient(http);
