import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useCallback, useEffect, useRef } from "react";
import { Animated, Platform, View } from "react-native";
import Svg from "react-native-svg";
import { useSelector } from "react-redux";
import { i18n } from "../components/core/LanguageLoader";
import { Text } from "../components/Text";
import { languageState } from "../redux/store";
import { MainScreen, ProfileScreen, RepoDetailScreen } from "../screens";
import { useTw } from "../theme";
import { Palette } from "../theme/palette";
import { HomeTabParamList, RootStackParamList } from "./screens";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<HomeTabParamList>();

const ProfileBadge = () => {
  const [tw] = useTw();

  if (
    //TODO
    0 === 0
  )
    return null;
  return (
    <View
      style={tw`absolute p-[2px] w-[20px] h-[20px] items-center justify-center -top-2 -right-2 rounded-lg bg-primary`}
    />
  );
};

export const AppNavigator = () => {
  const language = useSelector(languageState).language;
  const [tw] = useTw();

  const TabNavigator = useCallback(() => {
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
            backgroundColor: Palette.k_tab,
            height: Platform.OS === "ios" ? 96 : 80,
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: Palette.backgroundPrimary,
          tabBarInactiveTintColor: Palette.primary,
        })}
      >
        <Tab.Screen name="MainScreen" component={MainScreen} />
        <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      </Tab.Navigator>
    );
  }, [language]);

  const menuIcons = {
    MainScreen: (focused: boolean) => (
      <Svg width={44} height={32} fillOpacity={focused ? 1 : 0.2} />
    ),
    ProfileScreen: (focused: boolean) => (
      <Svg width={44} height={32} fillOpacity={focused ? 1 : 0.2} />
    ),
  };

  const renderIcon = ({
    name,
    focused,
  }: {
    name: keyof HomeTabParamList;
    focused: boolean;
  }) => {
    const MenuIcon = () => menuIcons[name](focused);
    let label = "";
    switch (name) {
      case "MainScreen":
        label = i18n.t("mainScreenLabel");
        break;
      case "ProfileScreen":
        label = i18n.t("profileScreenLabel");
        break;
    }

    return (
      <View style={{ marginTop: 10, marginBottom: 6, alignItems: "center" }}>
        <MenuIcon />
        <Text
          color={focused ? "k_tab_text_focused" : "k_tab_text"}
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

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, []);

  return (
    <Animated.View
      style={[tw`absolute top-0 w-full h-full`, { opacity: fadeAnim }]}
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
