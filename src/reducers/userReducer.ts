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
    _addFavouriteRepo(state, action: PayloadAction<string>) {
      state.favouriteRepos.push(action.payload);
    },
    _removeFavouriteRepo(state, action: PayloadAction<string>) {
      state.favouriteRepos = state.favouriteRepos.filter(
        (itm) => itm !== action.payload
      );
    },
    _wipe(state) {
      return (state = initialUserState);
    },
  },
});

const { _setGHToken, _addFavouriteRepo, _removeFavouriteRepo, _wipe } =
  userSlice.actions;

/**
 * EXPORTED FUNCTIONS
 */

export const setGHToken = async (token: string) => {
  store.dispatch(_setGHToken(token));
};

export const addFavouriteRepo = async (repoUrl: string) => {
  store.dispatch(_addFavouriteRepo(repoUrl));
};

export const removeFavouriteRepo = async (repoUrl: string) => {
  store.dispatch(_removeFavouriteRepo(repoUrl));
};

export const wipeUser = () => store.dispatch(_wipe());

export const userReducer = userSlice.reducer;
