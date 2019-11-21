import React, { Component } from "react"
import styled from "styled-components"
import { Slider, Button, Typography, Select, Icon } from "antd"
import "antd/dist/antd.css"
import { TEXTURES } from "../Constants/Textures"
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

const DoneButton = styled(Button)`
  margin-left: 10px;
  transition: visibility 0.3s linear, opacity 0.3s linear;
  visibility: ${props => (props.visible ? "visible" : "hidden")};
  opacity: ${props => (props.visible ? "1" : "0")};
`
const StyledSelector = styled(Select)`
  width: 90%;
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
            value={
              this.props.editing ? (
                this.props.selectedEditTexture
              ) : (
                <span>
                  <Icon style={{ marginRight: "4px" }} type="edit" />
                  Edit Map
                </span>
              )
            }
            onSelect={texture => {
              this.props.setEditing(true)
              this.props.onSelectEditTexture(texture)
            }}
          >
            <Select.Option value={TEXTURES.OBSIDIAN}>Draw Floor</Select.Option>
            <Select.Option value={TEXTURES.LAVA}>Draw Lava</Select.Option>
            <Select.Option value={TEXTURES.PLAYER_RUNNING}>Draw Walls</Select.Option>
          </StyledSelector>
          <DoneButton
            visible={this.props.editing}
            onClick={() => this.props.setEditing(false)}
            type="secondary"
          >
            Done
          </DoneButton>
        </Left>
        <Center>
          <SliderContainer>
            <Label>Player Speed</Label>
            <StyledSlider tooltipPlacement={"right"} />
          </SliderContainer>
          <StyledButton
            onClick={() => this.props.onSelectEditTexture(TEXTURES.PLAYER_IDLE)}
            type="secondary"
          >
            Place Officer
          </StyledButton>
          <StyledButton onClick={() => this.props.onClickStart()} type="primary">
            Start
          </StyledButton>
          <StyledButton
            onClick={() => this.props.onSelectEditTexture(TEXTURES.THIEF_IDLE)}
            type="secondary"
          >
            Place Thief
          </StyledButton>
          <SliderContainer>
            <Label>Map Scale</Label>
            <StyledSlider
              min={CONFIG.MIN_TEXTURE_SIZE}
              max={CONFIG.MAX_TEXTURE_SIZE}
              onChange={this.props.setTextureSize}
              defaultValue={this.props.textureSize}
              tooltipPlacement={"right"}
            />
          </SliderContainer>
        </Center>
        <Right>
          <StyledButton
            style={{ width: "50%" }}
            onClick={() => this.props.onClickUndo()}
            type="secondary"
          >
            Undo
          </StyledButton>
        </Right>
      </Container>
    )
  }
}
