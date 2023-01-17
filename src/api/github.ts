import axios, { AxiosError } from "axios";
import { DomainError, GitHubUser, Repo } from "../types";
import { getGitHubClient, noResponse } from "./client";

export const getUserRepos = async (
  userName: string,
  resultsPerPage: number,
  page: number
): Promise<Repo[]> =>
  getGitHubClient()
    .get<Repo[]>(`users/${userName}/repos`, {
      params: { per_page: resultsPerPage, page: page },
    })
    .then((response) => {
      if (noResponse(response)) {
        throw new DomainError("cannotGetUserRepos");
      }
      return response.data;
    })
    .catch((e) => {
      if (isError404NotFound(e)) {
        throw new DomainError("userNotFound");
      }
      throw e;
    });

export const testGHToken = async (token: string): Promise<boolean> =>
  getGitHubClient()
    .get<Repo[]>(`users/github/repos`, {
      params: { per_page: 1 },
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      if (noResponse(response)) {
        throw new DomainError("cannotTestToken");
      }
      return (
        !!response.headers["x-ratelimit-limit"] &&
        Number(response.headers["x-ratelimit-limit"]) > 60
      );
    })
    .catch((e) => {
      if (isError401BadCredentials(e)) return false;
      throw e;
    });

export const getRepo = async (
  userName: string,
  repoName: string
): Promise<Repo> =>
  getGitHubClient()
    .get<Repo>(`repos/${userName}/${repoName}`)
    .then((response) => {
      if (noResponse(response)) {
        throw new DomainError("cannotGetRepoData");
      }
      return response.data;
    })
    .catch((e) => {
      if (isError404NotFound(e)) {
        throw new DomainError("repoNotFound");
      }
      throw e;
    });

export const getRepoStargazers = async (
  userName: string,
  repoName: string
): Promise<GitHubUser[]> =>
  getGitHubClient()
    .get<GitHubUser[]>(`repos/${userName}/${repoName}/stargazers`)
    .then((response) => {
      if (noResponse(response)) {
        throw new DomainError("cannotGetRepoStargazers");
      }
      return response.data;
    });

export const isError404NotFound = (e: any) => {
  return (
    axios.isAxiosError(e) &&
    e.code === AxiosError.ERR_BAD_REQUEST &&
    e.response &&
    e.response.status === 404
  );
};

export const isError401BadCredentials = (e: any) => {
  return (
    axios.isAxiosError(e) &&
    e.code === AxiosError.ERR_BAD_REQUEST &&
    e.response &&
    e.response.status === 401 &&
    e.response.data.message.includes("Bad credentials")
  );
};

export const rateLimitExcedeed = (e: any) => {
  return (
    axios.isAxiosError(e) &&
    e.code === AxiosError.ERR_BAD_REQUEST &&
    e.response &&
    e.response.status === 403 &&
    e.response.data.message.includes("API rate limit exceeded")
  );
};
