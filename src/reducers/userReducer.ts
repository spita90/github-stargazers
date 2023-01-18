import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";
import { store } from "./store";
import { Buffer } from "buffer";

const initialUserState: User = {};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    /**
     * Token is not stored in plain text
     * but is base64 encoded
     * */
    _setGHToken(state, action: PayloadAction<string>) {
      state.ghToken = Buffer.from(action.payload).toString("base64");
    },
    _wipe(state) {
      return (state = initialUserState);
    },
  },
});

const { _setGHToken, _wipe } = userSlice.actions;

/**
 * EXPORTED FUNCTIONS
 */

export const setGHToken = async (token: string) => {
  store.dispatch(_setGHToken(token));
};

export const wipeUser = () => store.dispatch(_wipe());

export const userReducer = userSlice.reducer;
