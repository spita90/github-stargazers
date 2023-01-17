/**
 * A custom Error class
 * @param messageLocaleKey the key string for the i18n translatable message
 * @param fatal if true, local data will be erased
 */
export class DomainError extends Error {
  constructor(messageLocaleKey: string, fatal: boolean = false) {
    super(messageLocaleKey);
    this.name = "DomainError";
    this.stack = messageLocaleKey;
    this.fatal = fatal;
  }
  fatal: boolean;
}

export type User = {
  ghToken?: string;
  favouriteRepos: string[];
};

export type Repo = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubUser;
  html_url: string;
  description: string;
  created_at: string;
  stargazers_count: number;
  language: string; // programming language
};

export type GitHubUser = {
  login: string; //username
  id: number;
  avatar_url: string;
  html_url: string;
};
