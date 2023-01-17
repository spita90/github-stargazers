import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";
import { store } from "./store";
import { Buffer } from "buffer";

const initialUserState: User = {
  favouriteRepos: [],
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    _setGHToken(state, action: PayloadAction<string>) {
      state.ghToken = Buffer.from(action.payload).toString("base64");
    },
    _setStarred(state, action: PayloadAction<string[]>) {
      state.favouriteRepos = action.payload;
    },
    _starRepo(state, action: PayloadAction<string>) {
      state.favouriteRepos.push(action.payload);
    },
    _unstarRepo(state, action: PayloadAction<string>) {
      state.favouriteRepos = state.favouriteRepos.filter(
        (itm) => itm !== action.payload
      );
    },
    _wipe(state) {
      return (state = initialUserState);
    },
  },
});

const { _setGHToken, _setStarred, _starRepo, _unstarRepo, _wipe } =
  userSlice.actions;

/**
 * EXPORTED FUNCTIONS
 */

export const setGHToken = async (token: string) => {
  store.dispatch(_setGHToken(token));
};

export const setStarred = async (repoUrls: string[]) => {
  store.dispatch(_setStarred(repoUrls));
};

export const starRepo = async (repoUrl: string) => {
  store.dispatch(_starRepo(repoUrl));
};

export const unstarRepo = async (repoUrl: string) => {
  store.dispatch(_unstarRepo(repoUrl));
};

export const wipeUser = () => store.dispatch(_wipe());

export const userReducer = userSlice.reducer;
