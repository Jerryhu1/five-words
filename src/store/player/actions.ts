import {
  ADD_PLAYER,
  ADD_TEAM_PLAYER,
  ADD_TEAM_PLAYER_OK,
  Player,
  REMOVE_TEAM_PLAYER,
  SET_ACTIVE_PLAYER, SET_ACTIVE_PLAYER_ID,
} from "./types";
import cuid from "cuid";
import { createAction } from "typesafe-actions";

export const removeTeamPlayer = createAction(REMOVE_TEAM_PLAYER, (action) => {
  return (player: Player, teamIndex: number, playerIndex: number) =>
    action({
      player: player,
      teamIndex: teamIndex,
      playerIndex: playerIndex,
    });
});

export const addPlayer = createAction(ADD_PLAYER, (action) => {
  return (name: string) =>
    action({
      id: cuid(),
      name: name,
    });
});

export const setActivePlayer = createAction(SET_ACTIVE_PLAYER, (action) => {
  return (name: string, teamID: string) => action({
    name: name,
    teamID: teamID
  });
});

export const setActivePlayerId = createAction(SET_ACTIVE_PLAYER_ID, (action) => {
  return (id: string) => action({
    id: id,
  });
});

export const addTeamPlayer = createAction(ADD_TEAM_PLAYER, (action) => {
  return (
    roomName: string,
    playerID: string,
    newTeam: string,
  ) =>
    action({
      roomName: roomName,
      playerID: playerID,
      newTeam: newTeam,
    });
});

export const addTeamPlayerOk = createAction(ADD_TEAM_PLAYER_OK, (action) => {
  return (player: Player, index: number) =>
    action({
      player: player,
      teamIndex: index,
    });
});
