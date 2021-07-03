import React from 'react'
import styled from "styled-components/native"
import { moderateScale, verticalScale } from 'react-native-size-matters';

export default function Header({imagePath, text, fontSize, imageLeft, margin, alignRight}) {
    const Container = styled.View`
        margin: 0 auto;
        align-items: center;
        margin-top: ${verticalScale(1)}px;
        display: flex;
        width: ${moderateScale(295)}px;
        height: ${moderateScale(85)}px;
        flex-direction: ${imageLeft ? "row" : "row-reverse"};
    `

    const Icon = styled.Image`
        height: ${moderateScale(85)}px;
        width: ${moderateScale(155)}px;
        ${imageLeft ? margin && `margin-left: -${margin}px;` : margin && `margin-right: -${margin}px;`}
    `

    const MenuText = styled.Text`
        font-family: "OpenSans_800ExtraBold";
        color: white;
        align-self: center;
        font-size: ${moderateScale(parseInt(fontSize))}px;
        ${alignRight ? `text-align: right`: ""}
    `;

    return (
        <Container>
            <Icon source={imagePath}></Icon>
            <MenuText>{text}</MenuText>
        </Container> 
    )
}
