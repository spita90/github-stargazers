import Constants from "expo-constants";

interface Config {
  environment?: string;
  version?: string;
}

export const config: Config = {
  environment: Constants.expoConfig!.extra?.environment,
  version: Constants.expoConfig!.extra?.version,
};
