import React, { Component } from "react"
import styled from "styled-components"
import { Slider, Button, Typography, Radio, Tooltip, Modal, Input } from "antd"
import { CONSTANTS } from "../Constants/Constants"
import { CONFIG } from "../Constants/Config"
import { TEXTURES } from "../Constants/Textures"
import { BREAKPOINTS } from "../Constants/BreakPoints"

import { calculateMaxTextureSize, calculateMinTextureSize } from "../HelperFunctions"
const Container = styled.div`
  width: 100%;
  height: fit-content;
  background-color: ${CONFIG.MAIN_APP_COLOR};
  justify-content: center;
  display: flex;
  align-items: center;
  padding-top: 15px;
  @media (max-height: ${BREAKPOINTS.SMALL_HEIGHT}) {
    font-size: 11px;
  }
  @media (max-width: ${BREAKPOINTS.SMALL_WIDTH}) {
    font-size: 11px;
  }
`
const FlexDivCenter = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  @media (max-height: ${BREAKPOINTS.MEDIUM_HEIGHT}) {
    margin-bottom: 6px;
  }
  @media (max-height: ${BREAKPOINTS.SMALL_HEIGHT}) {
    margin-bottom: 4px;
  }
  @media (max-height: ${BREAKPOINTS.VERY_SMALL_HEIGHT}) {
    margin-bottom: 2px;
  }
`
const StyledText = styled(Typography.Text)`
  color: white !important;
`
const StyledGitButton = styled(Button)`
  display: block;
`
const StyledButton = styled(Button)`
  @media (max-height: ${BREAKPOINTS.MEDIUM_HEIGHT}) {
    height: 35px !important;
  }
  @media (max-height: ${BREAKPOINTS.SMALL_HEIGHT}) {
    height: 30px !important;
  }
  @media (max-height: ${BREAKPOINTS.VERY_SMALL_HEIGHT}) {
    height: 25px !important;
  }
  border-radius: 20px !important;
  height: 43px !important;
`
const Left = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  align-self: flex-start;
  padding-top: 30px;
`
const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  flex-direction: column;
  align-self: center;
  flex-grow: 0.3;
`
const Right = styled.div`
  display: flex;
  height: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  margin: auto;
  flex-direction: column;
  flex-grow: 1;
  align-self: flex-end;
  padding-top: 30px;
`
const Label = styled(Typography.Text)`
  margin-left: 6px;
  margin-right: 6px;
  display: inline-block;
  width: 20%;
  color: white !important;
`
const StyledSlider = styled(Slider)`
  width: 70%;
  display: inline-block;
  min-width: 50px;
  margin: 0 !important;
`
const SliderContainer = styled.div`
  width: 100%;
  margin-bottom: 60px;
  @media (max-width: ${BREAKPOINTS.VERY_SMALL_WIDTH}) {
    margin-bottom: 0;
  }
  display: flex;
  align-items: center;
`
const StyledTitle = styled(Typography.Title)`
  color: white !important;
`
const LeftRightContainer = styled.div`
  width: 60%;
  @media (max-width: ${BREAKPOINTS.MEDIUM_WIDTH}) {
    width: 100%;
  }
  display: flex;
  flex-direction: column;
`
const PlayButton = styled(Button)`
  margin: ${props => props.margin};
  font-size: ${props => props.fontSize + "px !important"};
  @media (max-height: ${BREAKPOINTS.MEDIUM_HEIGHT}) {
    font-size: 25px !important;
  }
  height: fit-content !important;
  width: fit-content !important;
  &:focus,
  &:active {
    color: white !important;
  }
  &:hover {
    color: #40a9ff !important;
  }
`
const playerMaxHealth = (props, smallScreen) => {
  const component = [
    <Label key="playerMaxHealthLabel">{smallScreen ? "Player Max Health" : "Max Health"}</Label>,
    <StyledSlider
      key="playerMaxHealthSlider"
      onChange={value => props.setCharacterMaxHealth(CONSTANTS.PLAYER, value)}
      value={props.playerMaxHealth}
      disabled={props.inProgress}
      min={1}
      max={10}
      step={1}
      tooltipPlacement={"top"}
    />
  ]
  return smallScreen ? (
    component
  ) : (
    <Tooltip placement="topLeft" title="Changes The Player Max Health ">
      <SliderContainer>{component.map(item => item)}</SliderContainer>
    </Tooltip>
  )
}
const playerSpeed = (props, smallScreen) => {
  const component = [
    <Label key="playerSpeedLabel">{smallScreen ? "Player Speed" : "Speed"}</Label>,
    <StyledSlider
      key="playerSpeedSlider"
      onChange={speed => props.setCharacterSpeed(CONSTANTS.PLAYER, speed)}
      value={props.playerSpeed}
      min={1}
      max={4}
      step={1}
      tooltipPlacement={"top"}
    />
  ]

  return smallScreen ? (
    component
  ) : (
    <Tooltip placement="topLeft" title="Changes The Player Movement Speed">
      <SliderContainer>{component.map(item => item)}</SliderContainer>
    </Tooltip>
  )
}
const thiefSpeed = (props, smallScreen) => {
  const component = [
    <Label key="thiefSpeedLabel">{smallScreen ? "Thief Speed" : "Speed"}</Label>,
    <StyledSlider
      key="thiefSpeedSlider"
      onChange={speed => props.setCharacterSpeed(CONSTANTS.THIEF, speed)}
      value={props.thiefSpeed}
      min={1}
      max={4}
      step={1}
      tooltipPlacement={"top"}
    />
  ]

  return smallScreen ? (
    component
  ) : (
    <Tooltip placement="topLeft" title="Changes The Thief Movement Speed">
      <SliderContainer>{component.map(item => item)}</SliderContainer>
    </Tooltip>
  )
}
const getPlayButton = props => {
  return props.inProgress ? (
    <div>
      <PlayButton
        disabled={!props.ready}
        type={"link"}
        fontSize={30}
        onClick={() => (props.paused ? props.onClickResume() : props.onClickPause())}
        ghost={true}
        margin={"0 4px 0 15px"}
        icon={props.paused ? "play-circle" : "pause-circle"}
      ></PlayButton>
      <PlayButton
        disabled={!props.ready}
        type={"link"}
        fontSize={30}
        onClick={() => props.onClickRestart()}
        margin={"0 15px 0 4px"}
        ghost={true}
        icon={"stop"}
      ></PlayButton>
    </div>
  ) : (
    <PlayButton
      disabled={!props.ready}
      type={"link"}
      ghost={true}
      fontSize={35}
      margin={"0 15px 0 15px"}
      onClick={() => props.onClickStart()}
      icon={"play-circle"}
    ></PlayButton>
  )
}
export default class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minTextureSize: calculateMinTextureSize(window),
      maxTextureSize: calculateMaxTextureSize(window)
    }
  }
  componentDidMount() {
    window.addEventListener("resize", e => {
      this.setState({
        minTextureSize: calculateMinTextureSize(window),
        maxTextureSize: calculateMaxTextureSize(window)
      })
    })
  }
  copyLinkToClipBoard() {
    let el = document.getElementById("shareLinkInput")
    el.select()
    el.setSelectionRange(0, 99999)
    document.execCommand("copy")
  }
  render() {
    const smallScreenWidth = window.innerWidth <= parseInt(BREAKPOINTS.VERY_SMALL_WIDTH, 10)
    const smallScreenHeight = window.innerHeight <= parseInt(BREAKPOINTS.SMALL_HEIGHT, 10)
    const props = this.props
    const { minTextureSize, maxTextureSize, showModal } = this.state
    return (
      <Container>
        <Modal
          closable={false}
          footer={[
            <Button key={1} type="primary" onClick={() => this.setState({ showModal: false })}>
              Ok
            </Button>
          ]}
          visible={showModal}
          title={"Share Your Map!"}
        >
          <Typography.Text>Copy This Link and Send it To your Friends</Typography.Text>
          <div>
            <Input
              id={"shareLinkInput"}
              style={{ margin: "20px 20px 20px 0", width: "80%" }}
              defaultValue={window.location.href}
            ></Input>
            <Button onClick={() => this.copyLinkToClipBoard()} type="secondary">
              Copy
            </Button>
          </div>
          <Typography.Text type={"secondary"}>
            Note that your friend's screen needs to be at least as big as your screen to maintain
            the shape of the map!
          </Typography.Text>
        </Modal>
        {smallScreenWidth ? null : (
          <Left>
            <LeftRightContainer>
              <FlexDivCenter>
                <StyledTitle level={4}>Player Options</StyledTitle>
              </FlexDivCenter>
              {playerMaxHealth(props, false)}
              {playerSpeed(props, false)}
            </LeftRightContainer>
          </Left>
        )}

        <Center>
          <FlexDivCenter>
            <Tooltip placement="top" title="The Player Will Follow The Mouse Cursor on The Screen">
              <StyledButton onClick={() => props.enableFollowCursor()} style={{ margin: "0" }}>
                Follow Cursor
              </StyledButton>
            </Tooltip>
          </FlexDivCenter>
          <FlexDivCenter>
            <Tooltip placement="left" title="Undo The Last Edit to The Map">
              <StyledButton onClick={() => props.onClickUndo()} style={{ margin: "0 15px 0 0" }}>
                Undo Edit
              </StyledButton>
            </Tooltip>
            {getPlayButton(props)}
            <Tooltip placement="right" title="Share This Map With a Friend">
              <StyledButton
                onClick={() => {
                  props.generateLink()
                  this.setState({ showModal: true })
                }}
                style={{ margin: "0 0 0 15px" }}
              >
                Share Map
              </StyledButton>
            </Tooltip>
          </FlexDivCenter>
          <FlexDivCenter>
            <Tooltip placement="left" title="Position The Start Location of The Player">
              <StyledButton
                onClick={() => props.setSelectedEditTexture(TEXTURES.PLAYER_IDLE)}
                style={{ margin: "0 10px 0 0" }}
              >
                Place Player
              </StyledButton>
            </Tooltip>
            <Tooltip placement="right" title="Position The Start Location of The Thief">
              <StyledButton
                onClick={() => props.setSelectedEditTexture(TEXTURES.THIEF_IDLE)}
                style={{ margin: "0 0 0 10px" }}
              >
                Place Thief
              </StyledButton>
            </Tooltip>
          </FlexDivCenter>
          <Tooltip placement="right" title="Changes The Grid Size">
            <FlexDivCenter>
              <Label>Map Scale</Label>
              <StyledSlider
                min={minTextureSize}
                max={maxTextureSize}
                onChange={props.setTextureSize}
                disabled={props.inProgress}
                value={props.textureSize}
                tooltipPlacement={"top"}
              />
            </FlexDivCenter>
          </Tooltip>
          {smallScreenWidth
            ? [
                <Tooltip key={1} placement="topLeft" title="Changes The Player Max Health">
                  <FlexDivCenter>{playerMaxHealth(props, true)}</FlexDivCenter>
                </Tooltip>,
                <Tooltip key={2} placement="topLeft" title="Changes The Player Movement Speed">
                  <FlexDivCenter>{playerSpeed(props, true)}</FlexDivCenter>
                </Tooltip>,
                <Tooltip key={3} placement="topLeft" title="Changes The Thief Movement Speed">
                  <FlexDivCenter>{thiefSpeed(props, true)}</FlexDivCenter>
                </Tooltip>
              ]
            : null}

          <Tooltip placement="right" title="Loads a Pre Made Level Created By The Developer">
            <FlexDivCenter>
              <Label style={{ width: "30%" }}>Pre made Levels</Label>
              <Radio.Group
                value={props.selectedLevel}
                size={smallScreenHeight || smallScreenWidth ? "small" : "default"}
                onChange={e => props.setSelectedLevel(e.target.value)}
              >
                <Radio.Button value={1}>1</Radio.Button>
                <Radio.Button value={2}>2</Radio.Button>
                <Radio.Button value={3}>3</Radio.Button>
                <Radio.Button value={4}>4</Radio.Button>
                <Radio.Button value={5}>5</Radio.Button>
                <Radio.Button value={6}>6</Radio.Button>
              </Radio.Group>
            </FlexDivCenter>
          </Tooltip>
          <Tooltip
            placement="right"
            title="Changes Wether The Player Maximizes Health or Minimizes Distance"
          >
            <FlexDivCenter>
              <Label style={{ width: "30%" }}>Search Priority</Label>
              <Radio.Group
                size={smallScreenHeight || smallScreenWidth ? "small" : "default"}
                value={props.searchPriority}
                onChange={e => props.setSearchPriority(e.target.value)}
              >
                <Radio.Button value={CONSTANTS.HEALTH}>HEALTH</Radio.Button>
                <Radio.Button value={CONSTANTS.SPEED}>SPEED</Radio.Button>
              </Radio.Group>
            </FlexDivCenter>
          </Tooltip>
          <StyledText>Made By Mark Armanious © 2019</StyledText>
          <StyledGitButton
            href={"https://github.com/markarmanus/path_finder"}
            target={"_blank"}
            shape={"circle"}
            ghost={true}
            icon={"github"}
            type={"link"}
          ></StyledGitButton>
        </Center>
        {smallScreenWidth ? null : (
          <Right>
            <LeftRightContainer>
              <FlexDivCenter>
                <StyledTitle level={4}>Thief Options</StyledTitle>
              </FlexDivCenter>
              {thiefSpeed(props, false)}
            </LeftRightContainer>
          </Right>
        )}
      </Container>
    )
  }
}
