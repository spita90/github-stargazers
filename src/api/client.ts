import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { store } from "../reducers/store";
import { DomainError } from "../types";
import { Buffer } from "buffer";
import { Platform } from "react-native";

const githubApiBaseUrl = "https://api.github.com";

let _gitHubClient: AxiosInstance;

const clientSetGHToken = (token: string) => {
  if (!_gitHubClient) return;
  _gitHubClient.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${Buffer.from(token, "base64").toString()}`;
};

export const clientResetGHToken = () => {
  if (!_gitHubClient) return;
  _gitHubClient.defaults.headers.common["Authorization"] = undefined;
  delete _gitHubClient.defaults.headers.common["Authorization"];
};

export const getGitHubClient = () => {
  if (!_gitHubClient) {
    _gitHubClient = axios.create({
      baseURL: githubApiBaseUrl,
    });

    _gitHubClient.interceptors.request.use(async (request) => {
      const { userState } = store.getState();
      if (
        !_gitHubClient.defaults.headers.common["Authorization"] &&
        userState.ghToken
      ) {
        clientSetGHToken(userState.ghToken);
        //@ts-ignore
        request.headers["Authorization"] = `Bearer ${Buffer.from(
          userState.ghToken,
          "base64"
        ).toString()}`;
      }
      return request;
    });

    _gitHubClient.interceptors.response.use(
      async (response) => {
        if (__DEV__ && Platform.OS === "web") console.log(response);
        return response;
      },
      async (error) => {
        return Promise.reject(error);
      }
    );

    axiosRetry(_gitHubClient, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
    });
  }
  return _gitHubClient;
};

export const noResponse = (response: AxiosResponse) => {
  return response === undefined || response.data === undefined;
};

export const hasError = (result: any) =>
  result instanceof Error ||
  result instanceof AxiosError ||
  result instanceof DomainError;
