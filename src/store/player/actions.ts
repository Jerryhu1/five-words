import {
  ADD_PLAYER,
  ADD_TEAM_PLAYER,
  ADD_TEAM_PLAYER_OK,
  FETCH_ACTIVE_PLAYER,
  Player,
  REMOVE_TEAM_PLAYER,
  SET_ACTIVE_PLAYER,
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

export const fetchActivePlayer = createAction(FETCH_ACTIVE_PLAYER, (action) => {
  return (name: string) =>
    action({
      name: name,
    });
});

export const setActivePlayer = createAction(SET_ACTIVE_PLAYER, (action) => {
  return (id: string, name: string, teamID: string) => action({
    id: id,
    name: name,
    teamID: teamID
  });
});

export const addTeamPlayer = createAction(ADD_TEAM_PLAYER, (action) => {
  return (
    roomName: string,
    playerName: string,
    newTeam: string,
    oldTeam: string
  ) =>
    action({
      roomName: roomName,
      playerID: playerName,
      newTeam: newTeam,
      oldTeam: oldTeam,
    });
});

export const addTeamPlayerOk = createAction(ADD_TEAM_PLAYER_OK, (action) => {
  return (player: Player, index: number) =>
    action({
      player: player,
      teamIndex: index,
    });
});
