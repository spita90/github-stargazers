import axios, { AxiosError } from "axios";
import { DomainError, GitHubUser, GitHubRepo } from "../types";
import { getGitHubClient, noResponse } from "./client";

/**
 * Returns the repo of specified name and user
 * @param userName the repo owner
 * @param repoName the repo name
 */
export const getRepo = async (
  userName: string,
  repoName: string
): Promise<GitHubRepo> =>
  getGitHubClient()
    .get<GitHubRepo>(`repos/${userName}/${repoName}`)
    .then((response) => {
      if (noResponse(response)) {
        throw new DomainError("cannotGetRepoData");
      }
      return response.data;
    });

/**
 * Returns the repos belonging to a GitHub user
 * @param userName the GitHub user
 * @param resultsPerPage how many items per page
 * @param page results page
 */
export const getUserRepos = async (
  userName: string,
  resultsPerPage: number,
  page: number
): Promise<GitHubRepo[]> =>
  getGitHubClient()
    .get<GitHubRepo[]>(`users/${userName}/repos`, {
      params: { per_page: resultsPerPage, page: page },
    })
    .then((response) => {
      if (noResponse(response)) {
        throw new DomainError("cannotGetUserRepos");
      }
      return response.data;
    });

/**
 * Returns the GitHub users that starred the specified repo
 * @param userName the repo owner
 * @param repoName the repo name
 * @param resultsPerPage how many items per page
 * @param page results page
 */
export const getRepoStargazers = async (
  userName: string,
  repoName: string,
  resultsPerPage: number,
  page: number
): Promise<GitHubUser[]> =>
  getGitHubClient()
    .get<GitHubUser[]>(`repos/${userName}/${repoName}/stargazers`, {
      params: { per_page: resultsPerPage, page: page },
    })
    .then((response) => {
      if (noResponse(response)) {
        throw new DomainError("cannotGetRepoStargazers");
      }
      return response.data;
    });

/**
 * Tests the specified GitHub token
 * @param token
 */
export const testGHToken = async (token: string): Promise<boolean> =>
  getGitHubClient()
    .get<GitHubRepo[]>(`user`, {
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
