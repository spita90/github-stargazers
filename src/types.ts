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
  favouriteRepos: string[];
};
