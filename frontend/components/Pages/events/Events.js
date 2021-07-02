import React from "react";
import styled from "styled-components/native";
import Header from "../Header";
import Content from "../Content";

export default function Events({}) {
    const Container = styled.View`
        flex: 1;
        background-color: rgb(25, 25, 25);
    `;

    return (
        <Container>
            <Header
                imagePath={require("../../../assets/typingMan.gif")}
                text={`UPCOMING${"\n"}EVENTS`}
                fontSize="28"
                imageLeft={false}
                margin="27"
            />
            <Content uri="http://nexussc.herokuapp.com/events/"  mainColor="#ff5758"/>
        </Container>
    );
}
