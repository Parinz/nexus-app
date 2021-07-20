import { StatusBar } from "expo-status-bar";
import React from "react";
import AppLoading from "expo-app-loading";
import {
	useFonts,
	OpenSans_800ExtraBold,
	OpenSans_300Light,
	OpenSans_400Regular,
} from "@expo-google-fonts/open-sans";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import { createStackNavigator } from "@react-navigation/stack";
import Main from "./components/Main/Main";
import News from "./components/Pages/News/News";
import TeamColor from "./components/Pages/TeamColor/TeamColor";
import Tools from "./components/Pages/Tools/Tools";
import Screen1 from "./components/FirstTime/Screen1";
import Screen2 from "./components/FirstTime/Screen2";
import Screen3 from "./components/FirstTime/Screen3";
import Screen4 from "./components/FirstTime/Screen4";
import { Text, Animated } from "react-native";
import { Asset } from "expo-asset";
import { useState, useEffect } from "react";
import { enableScreens } from "react-native-screens";
import AsyncStorage from "@react-native-async-storage/async-storage";
enableScreens();

const Tab = AnimatedTabBarNavigator();
const Stack = createStackNavigator();

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
	const progress = Animated.add(
		current.progress.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 1],
			extrapolate: "clamp",
		}),
		next
			? next.progress.interpolate({
					inputRange: [0, 1],
					outputRange: [0, 1],
					extrapolate: "clamp",
			  })
			: 0
	);

	return {
		cardStyle: {
			transform: [
				{
					translateX: Animated.multiply(
						progress.interpolate({
							inputRange: [0, 1, 2],
							outputRange: [
								screen.width, // Focused, but offscreen in the beginning
								0, // Fully focused
								screen.width * -0.3, // Fully unfocused
							],
							extrapolate: "clamp",
						}),
						inverted
					),
				},
			],
		},
	};
};

const MainTab = () => {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			detachInactiveScreens={true}
			tabBarOptions={{ inactiveTintColor: "white" }}
			appearance={{
				tabBarBackground: "rgb(70,70,70)",
				floating: true,
			}}
		>
			<Tab.Screen
				name="Home"
				component={Main}
				options={{
					tabBarLabel: "Home",
					tabBarIcon: ({ color, size }) => (
						<FontAwesome5 name="home" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="News"
				component={News}
				options={{
					tabBarLabel: "News",
					tabBarIcon: ({ color, size }) => (
						<FontAwesome5
							name="newspaper"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Team Color"
				component={TeamColor}
				options={{
					tabBarLabel: "Team Color",
					tabBarIcon: ({ color, size }) => (
						<FontAwesome5 name="flag" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Tools"
				component={Tools}
				options={{
					tabBarLabel: "Tools",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="lightbulb-on-outline"
							size={size + 5}
							color={color}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
};

export default function App() {
	const [loading, setLoading] = useState(true);
	const [firstTime, setFirstTime] = useState();

	let [fontsLoaded] = useFonts({
		Now: require("./assets/fonts/NowAlt-Light.otf"),
		Momcake: require("./assets/fonts/Momcake.otf"),
		OpenSans_800ExtraBold,
		OpenSans_300Light,
		OpenSans_400Regular,
	});

	const fetchImages = () => {
		const images = [require("./assets/nexus-logo.png")];

		const cacheImages = images.map((image) => {
			return Asset.fromModule(image).downloadAsync();
		});

		return Promise.all(cacheImages);
	};

	useEffect(() => {
		async function checkFirstTime() {
			AsyncStorage.clear();
			const value = await AsyncStorage.getItem("@firstTime");
			setFirstTime(value === null ? true : false);
		}
		checkFirstTime();
	}, []);

	const preload = async () => {
		const imageAssets = fetchImages();
		await Promise.all([imageAssets]);
	};

	if (loading || !fontsLoaded) {
		return (
			<AppLoading
				startAsync={preload}
				onFinish={() => setLoading(false)}
				onError={(error) => console.log(error)}
			/>
		);
	} else {
		return (
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName={firstTime ? "Screen1" : "Main"}
					detachInactiveScreens={true}
					screenOptions={{
						headerStyle: {
							backgroundColor: "rgb(35,35,35)",
							elevation: 0,
							shadowOpacity: 0,
							borderBottomWidth: 0,
						},
						headerTitleStyle: {
							color: "rgb(35,35,35)",
						},
						cardStyleInterpolator: forSlide,
						headerShown: false,
						gestureEnabled: false,
					}}
				>
					<Stack.Screen name="Screen1" component={Screen1} />
					<Stack.Screen name="Screen2" component={Screen2} />
					<Stack.Screen name="Screen3" component={Screen3} />
					<Stack.Screen name="Screen4" component={Screen4} />
					<Stack.Screen name="Main" component={MainTab} />
				</Stack.Navigator>
				<StatusBar style="light" />
			</NavigationContainer>
		);
	}
}
