import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { DomainError } from "../types";

const githubApiBaseUrl = "https://api.github.com";

let _gitHubClient: AxiosInstance;

export const getGitHubClient = () => {
  if (!_gitHubClient) {
    _gitHubClient = axios.create({
      baseURL: githubApiBaseUrl,
    });

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
