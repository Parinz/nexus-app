import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import Header from "../Header";
import { LogBox, RefreshControl } from "react-native";
import Scores from "./Scores";
import Content from "../Content";

function useForceUpdate() {
	const [value, setValue] = useState(0);
	return () => setValue((value) => value + 1);
}

export default function Activities({}) {
	const [refreshing, setRefreshing] = React.useState(false);
	const Container = styled.View`
		flex: 1;
		background-color: #121212;
		justify-content: center;
		align-content: center;
	`;

	const AnotherContainer = styled.ScrollView``;

	const forceUpdate = useForceUpdate();

	useEffect(() => {
		LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
	}, []);

	return (
		<Container>
			<Header text="Team Colors" fontSize="35" />
			<AnotherContainer
				refreshControl={
					<RefreshControl
						tintColor="white"
						colors={["white"]}
						refreshing={refreshing}
						onRefresh={forceUpdate}
					/>
				}
			>
				<Scores
					uri="http://nbcis.herokuapp.com/scores/"
					mainColor="#ff9151"
				/>

				<Content
					uri="http://nbcis.herokuapp.com/events/"
					mainColor="#5F939A"
					type="activities"
				/>
			</AnotherContainer>
		</Container>
	);
}
