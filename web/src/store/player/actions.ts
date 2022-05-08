import { ADD_TEAM_PLAYER } from "./types";
import { createAction } from "typesafe-actions";

//Saga
export const addTeamPlayer = createAction(ADD_TEAM_PLAYER, action => {
  return (roomName: string, playerID: string, newTeam: string) =>
    action({
      roomName: roomName,
      playerID: playerID,
      newTeam: newTeam,
    });
});
