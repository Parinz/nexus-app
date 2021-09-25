import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components/native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import useStoreInfo from "../../store";
import create from "zustand";

const useStore = create((set) => ({
	enabled: true,
	checkStatus: () => {
		const curr = new Date();
		const due = new Date(2021, 8, 30);
		if (curr > due) {
			set({ enabled: false });
		}
	},
}));

const Tab = createMaterialTopTabNavigator();
var leaderboard_global = {};

export default function PopCat() {
	const [WS, setWS] = useState(
		new WebSocket("ws://nbcis.herokuapp.com/popcat/")
	);
	const status = useStore((state) => state.enabled);
	const checkStatus = useStore((state) => state.checkStatus);
	const Container = styled.View`
		flex: 1;
		background-color: #121212;
		justify-content: center;
		align-items: center;
	`;

	useEffect(() => {
		checkStatus();
		return () => {
			WS.close();
		};
	}, []);

	return status === false ? (
		<Container>
			<LeaderBoard WS={WS} snap={["100%, 100%"]} end={true} />
		</Container>
	) : (
		<Container>
			<Cat WS={WS} />
			<LeaderBoard WS={WS} snap={["20%", "70%"]} />
		</Container>
	);
}

function Cat({ WS }) {
	const [clicked, setClicked] = useState(false);
	const [clicks, setClicks] = useState(0);
	const imgsrc = [
		require("../../../assets/Cat-Closed.png"),
		require("../../../assets/Cat-Open.png"),
	];

	const Cat = styled.Image`
		height: ${moderateScale(400)}px;
		width: ${moderateScale(400)}px;
	`;

	const Pressable = styled.Pressable`
		display: flex;
		flex-direction: column;
	`;

	async function playSound() {
		const { sound } = await Audio.Sound.createAsync(
			require("../../../assets/click.mp3")
		);
		sound.playAsync();
	}
	const onPress = async () => {
		setClicked(true);
		playSound();
		setTimeout(() => {
			setClicked(false);
			setClicks(clicks + 1);
		}, 40);
	};

	const onLongPress = async () => {
		setClicked(true);
		playSound();
		setTimeout(() => {
			setClicked(false);
			setClicks(clicks + 1);
		}, 400);
	};

	const loadCounts = async () => {
		const counts = JSON.parse(await AsyncStorage.getItem("@popcat"));
		if (counts != null) {
			setClicks(counts);
		}
	};

	useEffect(() => {
		loadCounts();
	}, []);

	return (
		<Pressable
			onPress={onPress}
			onLongPress={onLongPress}
			delayLongPress={200}
		>
			<Counter clicks={clicks} WS={WS} />
			<Cat source={clicked === false ? imgsrc[0] : imgsrc[1]} />
		</Pressable>
	);
}

function Counter({ clicks, WS }) {
	const deviceID = useStoreInfo((state) => state.deviceID);
	const name = useStoreInfo((state) => state.name);
	const team = useStoreInfo((state) => state.team);
	const CounterText = styled.Text`
		font-family: System;
		font-size: ${moderateScale(50)}px;
		color: white;
		text-align: center;
		margin-top: -100px;
		margin-bottom: -20px;
	`;

	const updateCounts = async () => {
		if (clicks != 0) {
			try {
				WS.send(
					JSON.stringify({
						deviceID: deviceID,
						name: name,
						team: team,
						clicks: clicks,
					})
				);
			} catch {}
			await AsyncStorage.setItem("@popcat", JSON.stringify(clicks));
		}
	};

	useEffect(() => {
		updateCounts();
	}, [clicks]);

	return <CounterText>{clicks}</CounterText>;
}

function LeaderBoard({ WS, snap, end }) {
	const snapPoints = useMemo(() => snap, []);
	useEffect(() => {
		WS.onmessage = (event) => {
			const data = JSON.parse(event.data);
			leaderboard_global = data;
		};
		if (end === true) {
			Alert.alert(
				"Popcat Has Ended!",
				"Thank you for your participation, Popcat has ended!",
				[{ text: "OK" }]
			);
		}
	}, []);
	return (
		<BottomSheet
			index={0}
			snapPoints={snapPoints}
			backgroundStyle={{ backgroundColor: "#252525" }}
		>
			<LeaderBoard_Tabs />
		</BottomSheet>
	);
}

function Item_Team({ index, name, score }) {
	var bgColor;
	if (name === "red") {
		bgColor = "background-color: #D35D6E;";
	} else if (name === "blue") {
		bgColor = "background-color: #87A7B3;";
	} else if (name === "yellow") {
		bgColor = "background-color: #FFCF64;";
	} else {
		bgColor = "background-color: #83B582";
	}

	const Container = styled.View`
		background-color: #f2e1c1;
		display: flex;
		border-radius: 10px;
		width: ${moderateScale(320)}px;
		height: ${moderateScale(46)}px;
		margin-top: ${verticalScale(14)}px;
		padding: 5px;
		justify-content: center;
		align-content: center;
		align-self: center;
	`;

	const InnerContainer = styled.View`
		display: flex;
		flex-direction: row;
		border-radius: 10px;
		width: ${moderateScale(314)}px;
		height: ${moderateScale(40)}px;
		padding: 5px;
		${bgColor}
		padding-right: 30px;
		padding-left: 10px;
		align-self: center;
		justify-content: space-between;
	`;

	const TitleText = styled.Text`
		color: black;
		font-size: ${moderateScale(17)}px;
		font-family: System;
		font-weight: bold;
		margin-left: 10px;
		align-self: center;
	`;

	const SubtitleText = styled.Text`
		color: black;
		font-size: ${moderateScale(17)}px;
		font-family: System;
		font-weight: bold;
		margin-left: 10px;
		align-self: center;
	`;

	return (
		<Container>
			<InnerContainer>
				<TitleText>
					{`${index}. `}{" "}
					{name.charAt(0).toUpperCase() + name.slice(1)}
				</TitleText>
				<SubtitleText>{score} pt</SubtitleText>
			</InnerContainer>
		</Container>
	);
}

function Item({ index, name, score }) {
	var bgColor;
	if (index === 1) {
		bgColor = "background-color: #f8d62c;";
	} else if (index === 2) {
		bgColor = "background-color: #aab0b3;";
	} else if (index === 3) {
		bgColor = "background-color: #b9722d;";
	} else {
		bgColor = "background-color: #fef9e3";
	}

	const Container = styled.View`
		background-color: #f2e1c1;
		display: flex;
		border-radius: 10px;
		width: ${moderateScale(320)}px;
		height: ${moderateScale(46)}px;
		margin-top: ${verticalScale(14)}px;
		padding: 5px;
		justify-content: center;
		align-content: center;
		align-self: center;
	`;

	const InnerContainer = styled.View`
		display: flex;
		flex-direction: row;
		border-radius: 10px;
		width: ${moderateScale(314)}px;
		height: ${moderateScale(40)}px;
		padding: 5px;
		${bgColor}
		padding-right: 30px;
		padding-left: 10px;
		align-self: center;
		justify-content: space-between;
	`;

	const TitleText = styled.Text`
		color: black;
		font-size: ${moderateScale(17)}px;
		font-family: System;
		font-weight: bold;
		margin-left: 10px;
		align-self: center;
	`;

	const SubtitleText = styled.Text`
		color: black;
		font-size: ${moderateScale(17)}px;
		font-family: System;
		font-weight: bold;
		margin-left: 10px;
		align-self: center;
	`;

	return (
		<Container>
			<InnerContainer>
				<TitleText>
					{`${index}. `} {name}
				</TitleText>
				<SubtitleText>{score} pt</SubtitleText>
			</InnerContainer>
		</Container>
	);
}

function IndividualTab() {
	const [fakeCurrentDate, setFakeCurrentDate] = useState("");
	const leaderboard = leaderboard_global;
	const checkStatus = useStore((state) => state.checkStatus);
	useEffect(() => {
		const ID = setTimeout(() => {
			setFakeCurrentDate(new Date());
			checkStatus();
		}, 1000);
		return () => {
			clearTimeout(ID);
		};
	}, [fakeCurrentDate]);
	return leaderboard != {} ? (
		<BottomSheetFlatList
			data={leaderboard.i}
			renderItem={({ item, index }) => (
				<Item index={index + 1} name={item[0]} score={item[1]} />
			)}
			keyExtractor={(items, index) => {
				return index.toString();
			}}
			scrollEnabled={true}
			style={{
				backgroundColor: "#252525",
			}}
		/>
	) : (
		<View></View>
	);
}

function TeamTab() {
	const [fakeCurrentDate, setFakeCurrentDate] = useState("");
	const leaderboard = leaderboard_global;
	useEffect(() => {
		const ID = setTimeout(() => setFakeCurrentDate(new Date()), 1000);
		return () => {
			clearTimeout(ID);
		};
	}, [fakeCurrentDate]);
	return leaderboard != {} ? (
		<BottomSheetFlatList
			data={leaderboard.t}
			renderItem={({ item, index }) => (
				<Item_Team index={index + 1} name={item[0]} score={item[1]} />
			)}
			keyExtractor={(items, index) => {
				return index.toString();
			}}
			scrollEnabled={true}
			style={{
				backgroundColor: "#252525",
			}}
		/>
	) : (
		<View></View>
	);
}

function LeaderBoard_Tabs() {
	return (
		<NavigationContainer independent={true}>
			<Tab.Navigator
				screenOptions={{ safeAreaInsets: { top: 0 } }}
				tabBarOptions={{
					indicatorStyle: { backgroundColor: "white" },
					style: { backgroundColor: "#252525" },
					labelStyle: { color: "white" },
				}}
			>
				<Tab.Screen name="Individual" component={IndividualTab} />
				<Tab.Screen name="Team" component={TeamTab} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}
