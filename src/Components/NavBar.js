import React, { Component } from "react"
import styled from "styled-components"
import { Slider, Button, Typography, Select, Icon } from "antd"
import "antd/dist/antd.css"
import { CONFIG } from "../Constants/Config"

const Container = styled.div`
  vertical-align: middle;
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  background-color: #1b2a41;
`

const CenterFlexBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  flex-grow: 1;
`
const StyledButton = styled(Button)`
  margin: 10px 0.7%;
  width: 5%;
  min-width: fit-content;
`

const Left = styled(CenterFlexBox)`
  align-self: flex-start;
  padding-left: 10px;
  flex-grow: 1;
`
const Center = styled(CenterFlexBox)`
  align-self: center;
  flex-grow: 4;
`

const Right = styled(CenterFlexBox)`
  align-self: flex-end;
  padding-right: 10px;
`
const StyledSlider = styled(Slider)`
  width: 75%;
  display: inline-block;
  min-width: 50px;
`
const Label = styled(Typography.Text)`
  color: white !important;
  margin-left: 6px;
  display: inline-block;
  width: 25%;
`

const Title = styled(Typography.Title)`
  color: white !important;
  display: inline-block;
  font-size: 2vw !important;

  text-align: center;

  margin: 0 5px !important;
`
const StyledSelector = styled(Select)`
  width: 100%;
`
const SliderContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 30%;
  align-items: center;
`
export default class NavBar extends Component {
  render() {
    return (
      <Container>
        <Left>
          <StyledSelector
            defaultValue={
              <span>
                <Icon style={{ marginRight: "4px" }} type="edit" />
                Edit Map
              </span>
            }
            styled={{ width: "100%" }}
          >
            <Select.Option value="Floor">Draw Floor</Select.Option>
            <Select.Option value="Lava">Draw Lava</Select.Option>
            <Select.Option value="Walls">Draw Walls</Select.Option>
          </StyledSelector>
        </Left>
        <Center>
          <SliderContainer>
            <Label>Player Speed</Label>
            <StyledSlider tooltipPlacement={"right"} />
          </SliderContainer>
          <StyledButton type="secondary">Place Officer</StyledButton>
          <StyledButton type="primary">Start</StyledButton>
          <StyledButton type="secondary">Place Thief</StyledButton>
          <SliderContainer>
            <Label>Map Scale</Label>
            <StyledSlider
              min={50}
              max={150}
              onChange={this.props.setTextureSize}
              tooltipPlacement={"right"}
            />
          </SliderContainer>
        </Center>
        <Right>
          <StyledButton
            style={{ width: "50%", margin: "10px 5%" }}
            type="secondary"
          >
            Undo
          </StyledButton>
          <StyledButton
            style={{ width: "50%", margin: "10px 5%" }}
            type="secondary"
          >
            Redo
          </StyledButton>
        </Right>
      </Container>
    )
  }
}
