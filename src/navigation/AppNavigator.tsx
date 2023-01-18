import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useRef } from "react";
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

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<HomeTabParamList>();

const ProfileBadge = () => {
  const { ghToken } = useSelector(userState);
  const profileBadgeShowConditions = [!ghToken];

  const [tw] = useTw();
  return profileBadgeShowConditions.some((cond) => cond) ? (
    <View
      style={tw`absolute p-[2px] w-[20px] h-[20px] items-center justify-center -top-[8px] -right-2 rounded-lg bg-red`}
    />
  ) : null;
};

export const AppNavigator = () => {
  const language = useSelector(languageState).language;
  const [tw] = useTw();

  const TabNavigator = () => {
    return (
      <Tab.Navigator
        initialRouteName={"MainScreen"}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) =>
            renderIcon({ name: route.name, focused }),
          tabBarBadge: undefined,
          tabBarStyle: {
            backgroundColor: "black",
            height: NAV_BAR_HEIGHT_PX,
            borderTopWidth: 0,
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
          },
        })}
      >
        <Tab.Screen name="MainScreen" component={MainScreen} />
        <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      </Tab.Navigator>
    );
  };

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
      <View style={{ marginTop: 10, marginBottom: 6, alignItems: "center" }}>
        <TabMenuIcon />
        <Text
          color={focused ? "white" : "white60"}
          size="sm"
          textStyle={{ textAlign: "center" }}
          style={{ marginTop: 6, minWidth: 50 }}
        >
          {label}
        </Text>
        {name === "ProfileScreen" && <ProfileBadge />}
      </View>
    );
  };

  const fadeInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, []);

  return (
    <Animated.View
      style={[tw`absolute top-0 w-full h-full`, { opacity: fadeInAnim }]}
    >
      <NavigationContainer
        documentTitle={{
          formatter: (options, route) => `GitHub Stargazers`,
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
