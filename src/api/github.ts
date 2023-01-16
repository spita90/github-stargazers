import axios, { Axios, AxiosError } from "axios";
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
        return [];
      }
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

const isError404NotFound = (e: Error) => {
  return (
    axios.isAxiosError(e) &&
    e.code === AxiosError.ERR_BAD_REQUEST &&
    e.response &&
    e.response.status === 404
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
