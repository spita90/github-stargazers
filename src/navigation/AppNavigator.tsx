import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useCallback, useEffect, useRef } from "react";
import { Animated, Platform, View } from "react-native";
import { useSelector } from "react-redux";
import { i18n } from "../components/core/LanguageLoader";
import { Text } from "../components/Text";
import { languageState, userState } from "../reducers/store";
import { MainScreen, ProfileScreen, RepoDetailScreen } from "../screens";
import { GitHubMarkSvg, ProfileIconSvg } from "../svgs";
import { useTw } from "../theme";
import { HomeTabParamList, RootStackParamList } from "./screens";

export const NAV_BAR_HEIGHT_PX = 80;

/**
 * The root level navigator
 */
export const AppNavigator = () => {
  const tw = useTw();

  /**
   * Triggers app re-render on language change
   */
  const { code: languageCode } = useSelector(languageState);

  /**
   * Handles the root level screens
   */
  const Stack = createStackNavigator<RootStackParamList>();

  /**
   * Handles the screens in the bottom navigation bar
   */
  const Tab = createBottomTabNavigator<HomeTabParamList>();

  const fadeInAnim = useRef(new Animated.Value(0)).current;

  /**
   * Handles the fade-in effect after the initial loading screen
   */
  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, []);

  /**
   * A red round icon that draws user attention
   * about profile related actions
   */
  const ProfileBadge = () => {
    const { ghToken } = useSelector(userState);
    const showProfileBadge = [!ghToken];

    const tw = useTw();
    return showProfileBadge.some((cond) => cond) ? (
      <View
        style={tw`absolute p-[2px] w-[20px] h-[20px] items-center justify-center -top-[8px] -right-2 rounded-lg bg-red`}
      />
    ) : null;
  };

  /**
   * The bottom tab navigator
   */
  const TabNavigator = useCallback(
    () => (
      <Tab.Navigator
        initialRouteName={"MainScreen"}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) =>
            renderIcon({ name: route.name, focused }),
          tabBarStyle: [
            tw`bg-black rounded-t-xl`,
            { height: NAV_BAR_HEIGHT_PX },
          ],
        })}
      >
        <Tab.Screen name="MainScreen" component={MainScreen} />
        <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      </Tab.Navigator>
    ),
    [languageCode]
  );

  const tabMenuIcons = {
    MainScreen: (focused: boolean) => (
      <GitHubMarkSvg
        width={44}
        height={42}
        color={"white"}
        fillOpacity={focused ? 1 : 0.6}
      />
    ),
    ProfileScreen: (focused: boolean) => (
      <ProfileIconSvg
        width={44}
        height={42}
        color={"white"}
        fillOpacity={focused ? 1 : 0.6}
      />
    ),
  };

  const renderIcon = ({
    name,
    focused,
  }: {
    name: keyof HomeTabParamList;
    focused: boolean;
  }) => {
    const TabMenuIcon = () => tabMenuIcons[name](focused);

    let label = "";
    switch (name) {
      case "MainScreen":
        label = i18n.t("stargazers");
        break;
      case "ProfileScreen":
        label = i18n.t("profile");
        break;
    }

    return (
      <View style={tw`mt-[10px] mb-[6px] items-center`}>
        <TabMenuIcon />
        <Text
          color={focused ? "white" : "white60"}
          size="sm"
          textStyle={tw`text-center`}
          style={tw`mt-[6px] min-w-[50px]`}
        >
          {label}
        </Text>
        {name === "ProfileScreen" && <ProfileBadge />}
      </View>
    );
  };

  return (
    <Animated.View
      style={[tw`absolute top-0 w-full h-full`, { opacity: fadeInAnim }]}
    >
      <NavigationContainer
        documentTitle={{
          formatter: () => `GitHub Stargazers`,
        }}
      >
        <Stack.Navigator
          detachInactiveScreens={true}
          initialRouteName={"TabNavigation"}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="RepoDetailScreen"
            component={RepoDetailScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="TabNavigation" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Animated.View>
  );
};
