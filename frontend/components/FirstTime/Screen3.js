import React, { useState, useEffect } from "react";
import {
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	View,
	Alert,
} from "react-native";
import styled from "styled-components/native";
import { verticalScale, moderateScale } from "react-native-size-matters";
import { FontAwesome5 } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { Input, CheckBox } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogicPart = ({ navigation }) => {
	const [teamColor, setTeamColor] = useState("red");
	const [name, setName] = useState();
	const [grade, setGrade] = useState();
	const [honors, setHonors] = useState(false);
	const [standards, setStandards] = useState(false);
	const [buttonDisabled, setButtonDisabled] = useState(true);

	const [items, setItems] = useState([
		{ label: "Red Team", value: "red" },
		{ label: "Blue Team", value: "blue" },
		{ label: "Green Team", value: "green" },
		{ label: "Yellow Team", value: "yellow" },
	]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (name != null && grade != null) {
			setButtonDisabled(false);
		}
	}, [name, grade]);

	const handleGrade = (text) => {
		if (text[0] === "0") {
			text = text.slice(1);
		}
		text = parseInt(text);
		setGrade(text);
	};

	const handleStandards = () => {
		setStandards(!standards);
	};

	const handleHonors = () => {
		setHonors(!honors);
	};

	const onSubmit = async () => {
		if (grade > 12) {
			Alert.alert(
				"Invalid Grade",
				"Invalid grade level, please enter again.",
				[{ text: "OK" }]
			);
			return;
		} else if (standards === honors) {
			if (standards === true) {
				Alert.alert(
					"Invalid Class",
					"Please select standards OR honors.",
					[{ text: "OK" }]
				);
				return;
			} else {
				Alert.alert(
					"Invalid Class",
					"Please select either standards or honors."
				);
			}
		} else {
			const JSONName = JSON.stringify(name);
			const JSONGrade = JSON.stringify(grade);
			const JSONTeam = JSON.stringify(teamColor);
			const JSONHonors = JSON.stringify(honors);
			await AsyncStorage.setItem("@honors", JSONHonors);
			await AsyncStorage.setItem("@name", JSONName);
			await AsyncStorage.setItem("@grade", JSONGrade);
			await AsyncStorage.setItem("@team", JSONTeam);

			navigation.navigate("Screen4");
		}
	};

	return (
		<View>
			<Input
				label="Nickname"
				labelStyle={{
					marginTop: verticalScale(20),
					marginLeft: moderateScale(20),
					color: "white",
				}}
				placeholder="John"
				leftIcon={
					<FontAwesome5 name="address-book" size={24} color="white" />
				}
				inputContainerStyle={{
					marginLeft: moderateScale(20),
					marginRight: moderateScale(20),
				}}
				inputStyle={{ color: "white" }}
				maxLength={10}
				onChangeText={(text) => setName(text)}
			/>
			<Input
				label="Grade Level"
				labelStyle={{
					marginLeft: moderateScale(20),
					color: "white",
				}}
				placeholder="7"
				leftIcon={
					<FontAwesome5 name="address-card" size={24} color="white" />
				}
				inputContainerStyle={{
					marginRight: moderateScale(20),
					marginLeft: moderateScale(20),
				}}
				maxLength={2}
				inputStyle={{ color: "white" }}
				keyboardType="numeric"
				onChangeText={(text) => handleGrade(text)}
			/>
			<View
				style={{
					alignSelf: "center",
					marginBottom: verticalScale(20),
					width: "85%",
					marginLeft: 0,
					marginRight: 0,
					justifyContent: "space-between",
					flexDirection: "row",
				}}
			>
				<CheckBox
					title="Honors"
					textStyle={{ color: "white" }}
					checked={honors}
					containerStyle={{
						backgroundColor: "#292d3e",
						alignSelf: "center",
						width: "40%",
						marginBottom: verticalScale(20),
						marginLeft: 0,
					}}
					onPress={handleHonors}
				/>
				<CheckBox
					title="Standards"
					textStyle={{ color: "white" }}
					checked={standards}
					containerStyle={{
						backgroundColor: "#292d3e",
						alignSelf: "center",
						width: "40%",
						marginBottom: verticalScale(20),
						marginRight: 0,
					}}
					onPress={handleStandards}
				/>
			</View>
			<DropDownPicker
				open={open}
				value={teamColor}
				items={items}
				setOpen={setOpen}
				setValue={setTeamColor}
				setItems={setItems}
				containerStyle={{
					alignSelf: "center",
					width: "85%",
					borderColor: "white",
					borderWidth: 1,
					borderRadius: 9,
					marginBottom: verticalScale(20),
				}}
				dropDownContainerStyle={{
					borderColor: "white",
					borderWidth: 1,
				}}
				dropDownDirection="TOP"
				theme="DARK"
			/>
			<TouchableOpacity disabled={buttonDisabled} onPress={onSubmit}>
				<FontAwesome5
					name="arrow-circle-right"
					size={50}
					color={buttonDisabled ? "grey" : "white"}
					style={{
						alignSelf: "center",
					}}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default function Screen3({ navigation }) {
	const InsideContainer = styled.View`
		justify-content: center;
		align-content: center;
	`;

	const HiText = styled.Text`
		text-align: center;
		font-size: ${moderateScale(25)}px;
		margin-bottom: -10px;
		font-family: Now;
		color: white;
	`;

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{
				flex: 1,
				flexDirection: "column",
				alignContent: "center",
				justifyContent: "center",
				backgroundColor: "rgb(35,35,35)",
			}}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<InsideContainer>
					<LottieView
						source={require("../../assets/ID.json")}
						autoPlay
						loop={true}
						speed={0.7}
						style={{
							position: "relative",
							width: moderateScale(150),
							height: moderateScale(150),
							alignSelf: "center",
						}}
					/>
					<HiText>Almost Done!</HiText>

					<LogicPart navigation={navigation} />
				</InsideContainer>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}
