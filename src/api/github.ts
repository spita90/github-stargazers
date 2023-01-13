import { DomainError, GitHubUser, Repo } from "../types";
import { getGitHubClient, noResponse } from "./client";

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
