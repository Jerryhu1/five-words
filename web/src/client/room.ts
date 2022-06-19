import axios, { AxiosInstance, AxiosResponse } from "axios";
import { RoomState } from "../store/room";

class RoomClient {
  private http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  getRoom = (name: string) => {
    return this.http.get<RoomState>("/room/" + name);
  };

  createRoom = (
    owner: string,
    scoreGoal: number,
    lang: string,
    teams: number
  ): Promise<AxiosResponse<RoomState>> => {
    return this.http.post<RoomState>(`/room/create`, {
      owner: owner,
      scoreGoal: scoreGoal,
      language: lang,
      teams: teams
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
  baseURL: "/api",
});

export default new RoomClient(http);
