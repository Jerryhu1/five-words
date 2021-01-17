import { ActionType } from "typesafe-actions";
import * as actions from "./actions";

export type SocketActions = ActionType<typeof actions>;
