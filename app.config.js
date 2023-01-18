module.exports = {
  name: "GitHubStargazers",
  displayName: "GitHubStargazers",
  expo: {
    name: "GitHubStargazers",
    slug: "GitHubStargazers",
    version: "1.0.0",
    extra: {
      environment: process.env.STAGE,
      version: process.env.APP_VERSION,
    },
    orientation: "portrait",
    icon: "./assets/favicon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/favicon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/favicon.png",
        backgroundColor: "#FFFFFF",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
};
