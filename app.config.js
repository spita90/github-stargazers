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
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
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
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
};