import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { User } from "../types";
import { LanguageData } from "./languageReducer";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { languageReducer } from "./languageReducer";
import { userReducer } from "./userReducer";

export const rootReducer = combineReducers({
  userState: persistReducer(
    {
      key: "store.github-stargazers.user",
      keyPrefix: "",
      storage: AsyncStorage,
    },
    userReducer
  ),
  languageState: persistReducer(
    {
      key: "store.github-stargazers.language",
      keyPrefix: "",
      storage: AsyncStorage,
    },
    languageReducer
  ),
});

export const userState = (state: any) => {
  return state.userState as User;
};

export const languageState = (state: any) => {
  return state.languageState as LanguageData;
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
