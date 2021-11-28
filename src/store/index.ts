import sessionReducer from "./websocket/reducers";
import chatReducer from "./chat/reducer";
import {configureStore} from "@reduxjs/toolkit";
import roomReducer from "./room";

export const store = configureStore({
  reducer: {
    room: roomReducer,
    session: sessionReducer,
    chat: chatReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch