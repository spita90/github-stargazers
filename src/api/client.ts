import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { store } from "../reducers/store";
import { DomainError } from "../types";
import { Buffer } from "buffer";
import { Platform } from "react-native";

const githubApiBaseUrl = "https://api.github.com";
const githubAcceptHeader = "application/vnd.github+json";
const githubApiVersion = "2022-11-28";

let _gitHubClient: AxiosInstance;

export const clientSetGHToken = (token?: string) => {
  if (!_gitHubClient) return;
  let tokenToUse: string;
  if (token) {
    tokenToUse = token;
  } else {
    const { ghToken } = store.getState().userState;
    if (!ghToken) return; // no token
    tokenToUse = Buffer.from(ghToken, "base64").toString();
  }
  if (!_gitHubClient.defaults.headers.common["Authorization"]) {
    _gitHubClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${tokenToUse}`;
  }
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

    _gitHubClient.defaults.headers.common["Accept"] = githubAcceptHeader;

    // When in browser, if this header is specified, the request will be
    // CORS-blocked. No problem in native mode.
    // It is a known issue in GitHub API. See
    // https://github.com/orgs/community/discussions/40619
    if (Platform.OS !== "web")
      _gitHubClient.defaults.headers.common["X-GitHub-Api-Version"] =
        githubApiVersion;

    _gitHubClient.interceptors.request.use(async (request) => {
      if (__DEV__ && Platform.OS === "web") console.log(request);
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
