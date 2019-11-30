import React, { Component } from "react"
import styled from "styled-components"
import { Slider, Button, Typography, Select, Icon, Radio, Checkbox, Popover } from "antd"
import "antd/dist/antd.css"
import { TEXTURES } from "../Constants/Textures"
import { CONFIG } from "../Constants/Config"
import { CONSTANTS } from "../Constants/Constants"

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
  width: 100%;
  display: block;
  min-width: 50px;
`
const Label = styled(Typography.Text)`
  margin-left: 6px;
  display: inline-block;
`

const AnimatedButton = styled(Button)`
  margin-left: 10px;
  margin-right: 10px;

  transition: visibility 0.3s linear, opacity 0.3s linear;
  visibility: ${props => (props.visible ? "visible" : "hidden")};
  opacity: ${props => (props.visible ? "1" : "0")};
`
const StyledSelector = styled(Select)`
  width: 100%;
`
const PopOverContainer = styled.div`
  width: 350px;
`
const playerOptions = props => (
  <PopOverContainer>
    <Label>Player Max Health</Label>
    <StyledSlider
      onChange={value => props.setCharacterMaxHealth(CONSTANTS.PLAYER, value)}
      defaultValue={props.playerMaxHealth}
      disabled={props.inProgress}
      min={1}
      max={10}
      step={1}
      tooltipPlacement={"right"}
    />
    <Label>Player Speed</Label>
    <StyledSlider
      onChange={speed => props.setCharacterSpeed(CONSTANTS.PLAYER, speed)}
      defaultValue={props.playerSpeed}
      min={1}
      max={4}
      step={1}
      tooltipPlacement={"right"}
    />
  </PopOverContainer>
)
const thiefOptions = props => (
  <PopOverContainer>
    <Label>Thief Speed</Label>
    <StyledSlider
      onChange={speed => props.setCharacterSpeed(CONSTANTS.THIEF, speed)}
      defaultValue={props.thiefSpeed}
      min={1}
      max={4}
      step={1}
      tooltipPlacement={"right"}
    />
  </PopOverContainer>
)
const mapOptions = props => (
  <PopOverContainer>
    <Label>Map Scale</Label>
    <StyledSlider
      min={CONFIG.MIN_TEXTURE_SIZE}
      max={CONFIG.MAX_TEXTURE_SIZE}
      onChange={props.setTextureSize}
      disabled={props.inProgress}
      value={props.textureSize}
      tooltipPlacement={"right"}
    />
    <CenterFlexBox style={{ marginBottom: "20px" }}>
      <Label style={{ flexGrow: 1 }}>Search Priority</Label>
      <Radio.Group
        style={{ float: "right" }}
        value={props.searchPriority}
        onChange={e => props.setSearchPriority(e.target.value)}
      >
        <Radio.Button value={CONSTANTS.HEALTH}>HEALTH</Radio.Button>
        <Radio.Button value={CONSTANTS.SPEED}>SPEED</Radio.Button>
      </Radio.Group>
    </CenterFlexBox>
    <Checkbox
      checked={props.allowDiagonalActions}
      onChange={e => props.setAllowDiagonalActions(e.target.checked)}
    >
      Diagonal Moves
    </Checkbox>
    <CenterFlexBox style={{ marginTop: "20px" }}>
      <Label style={{ flexGrow: 1 }}>Pre made Levels</Label>
      <Radio.Group
        style={{ float: "right" }}
        value={props.selectedLevel}
        onChange={e => props.setSelectedLevel(e.target.value)}
      >
        <Radio.Button value={1}>1</Radio.Button>
        <Radio.Button value={2}>2</Radio.Button>
        <Radio.Button value={3}>3</Radio.Button>
        <Radio.Button value={4}>4</Radio.Button>
        <Radio.Button value={5}>5</Radio.Button>
        <Radio.Button value={6}>6</Radio.Button>
      </Radio.Group>
    </CenterFlexBox>
  </PopOverContainer>
)
export default class NavBar extends Component {
  render() {
    return (
      <Container>
        <Left>
          <StyledSelector
            labelInValue
            value={
              this.props.editing
                ? { key: this.props.selectedEditTexture }
                : {
                    key: 0,
                    label: (
                      <span>
                        <Icon style={{ marginRight: "4px" }} type="edit" />
                        Edit Map
                      </span>
                    )
                  }
            }
            onSelect={object => {
              this.props.setEditing(true)
              this.props.setSelectedEditTexture(object.key)
            }}
          >
            <Select.Option value={TEXTURES.OBSIDIAN}>Draw Floor</Select.Option>
            <Select.Option value={TEXTURES.LAVA}>Draw Lava</Select.Option>
            <Select.Option value={TEXTURES.WALL}>Draw Walls</Select.Option>
            <Select.Option value={TEXTURES.HEALTH_PACK}>Add/Remove Health Packs</Select.Option>
          </StyledSelector>
          <AnimatedButton
            visible={Number(this.props.editing)}
            onClick={() => this.props.setEditing(false)}
            type="secondary"
          >
            Done
          </AnimatedButton>
          <Popover trigger="click" content={mapOptions(this.props)}>
            <Button>Map Options</Button>
          </Popover>
        </Left>
        <Center>
          <Popover trigger="click" content={playerOptions(this.props)}>
            <Button>Player Options</Button>
          </Popover>
          {this.props.inProgress ? null : (
            <StyledButton
              onClick={() => this.props.setSelectedEditTexture(TEXTURES.PLAYER_IDLE)}
              type="secondary"
            >
              Place Officer
            </StyledButton>
          )}

          {this.props.inProgress ? (
            <CenterFlexBox style={{ display: "contents" }}>
              <StyledButton onClick={() => this.props.onClickRestart()} type="primary">
                Stop
              </StyledButton>
              {this.props.paused ? (
                <StyledButton type="secondary" onClick={() => this.props.onClickResume()}>
                  Resume
                </StyledButton>
              ) : (
                <StyledButton type="secondary" onClick={() => this.props.onClickPause()}>
                  Pause
                </StyledButton>
              )}
            </CenterFlexBox>
          ) : (
            <StyledButton
              disabled={!this.props.ready}
              onClick={() => this.props.onClickStart()}
              type="primary"
            >
              Start
            </StyledButton>
          )}
          {this.props.inProgress ? null : (
            <StyledButton
              onClick={() => this.props.setSelectedEditTexture(TEXTURES.THIEF_IDLE)}
              type="secondary"
            >
              Place Thief
            </StyledButton>
          )}
          <Popover trigger="click" content={thiefOptions(this.props)}>
            <Button>Thief Options</Button>
          </Popover>
        </Center>
        <Right>
          <StyledButton
            style={{ width: "25%" }}
            onClick={() => this.props.onClickUndo()}
            type="secondary"
          >
            Undo
          </StyledButton>
          <StyledButton
            style={{ width: "25%" }}
            onClick={() => this.props.generateLink()}
            type="secondary"
          >
            Share
          </StyledButton>

          <AnimatedButton
            visible={Number(!this.props.followCursor)}
            style={{ width: "50%" }}
            onClick={() => this.props.enableFollowCursor()}
            type="secondary"
          >
            Follow Cursor
          </AnimatedButton>
        </Right>
      </Container>
    )
  }
}
