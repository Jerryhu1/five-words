import axios, { AxiosInstance, AxiosResponse } from "axios";
import { RoomState } from "../store/room";

class RoomClient {
  private http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  getRoom = (name: string) => {
    return this.http.get<RoomState>("/rooms/" + name);
  };

  createRoom = (
    owner: string,
    scoreGoal: number,
    lang: string,
    teams: number
  ): Promise<AxiosResponse<RoomState>> => {
    return this.http.post<RoomState>(`/rooms`, {
      owner: owner,
      scoreGoal: scoreGoal,
      language: lang,
      teams: teams
    });
  };
}

const http = axios.create({
  baseURL: "/api",
});

export default new RoomClient(http);
