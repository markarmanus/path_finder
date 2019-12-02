import React, { Component } from "react"
import styled from "styled-components"
import {
  Slider,
  Button,
  Typography,
  Select,
  Icon,
  Radio,
  Checkbox,
  Popover,
  Tooltip,
  Modal,
  Input
} from "antd"
import { CONSTANTS } from "../Constants/Constants"
import { CONFIG } from "../Constants/Config"
import { TEXTURES } from "../Constants/Textures"
import { calculateMaxTextureSize, calculateMinTextureSize } from "../HelperFunctions"
const Container = styled.div`
  width: 100%;
  height: fit-content;
  background-color: ${CONFIG.MAIN_APP_COLOR};
  justify-content: center;
  display: flex;
  align-items: center;
  padding-top: 15px;
`
const FlexDivCenter = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`
const StyledText = styled(Typography.Text)`
  color: white !important;
`
const StyledGitButton = styled(Button)`
  display: block;
`
const StyledButton = styled(Button)`
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
  display: flex;
  align-items: center;
`
const StyledTitle = styled(Typography.Title)`
  color: white !important;
`
const PlayButton = styled(Button)`
  margin: ${props => props.margin};
  font-size: ${props => props.fontSize + "px !important"};
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
    const props = this.props
    const { minTextureSize, maxTextureSize, showModal } = this.state
    return (
      <Container>
        <Modal
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
        <Left>
          <div style={{ width: "60%", display: "flex", flexDirection: "column" }}>
            <FlexDivCenter>
              <StyledTitle level={4}>Player Options</StyledTitle>
            </FlexDivCenter>
            <Tooltip placement="topLeft" title="Changes The Player Max Health ">
              <SliderContainer>
                <Label>Max Health</Label>
                <StyledSlider
                  onChange={value => props.setCharacterMaxHealth(CONSTANTS.PLAYER, value)}
                  value={props.playerMaxHealth}
                  disabled={props.inProgress}
                  min={1}
                  max={10}
                  step={1}
                  tooltipPlacement={"top"}
                />
              </SliderContainer>
            </Tooltip>
            <Tooltip placement="topLeft" title="Changes The Player Movement Speed">
              <SliderContainer>
                <Label>Speed</Label>
                <StyledSlider
                  onChange={speed => props.setCharacterSpeed(CONSTANTS.PLAYER, speed)}
                  value={props.playerSpeed}
                  min={1}
                  max={4}
                  step={1}
                  tooltipPlacement={"top"}
                />
              </SliderContainer>
            </Tooltip>
          </div>
        </Left>
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
                Undo Move
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
            <Tooltip placement="bottom" title="Position The Start Location of The Player">
              <StyledButton
                onClick={() => props.setSelectedEditTexture(TEXTURES.PLAYER_IDLE)}
                style={{ margin: "0 10px 0 0" }}
              >
                Place Player
              </StyledButton>
            </Tooltip>
            <Tooltip placement="bottom" title="Position The Start Location of The Thief">
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
          <Tooltip placement="right" title="Loads a Pre Made Level Created By The Developer">
            <FlexDivCenter>
              <Label style={{ width: "30%" }}>Pre made Levels</Label>
              <Radio.Group
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
            </FlexDivCenter>
          </Tooltip>
          <Tooltip
            placement="right"
            title="Changes Wether The Player Maximizes Health or Minimizes Distance"
          >
            <FlexDivCenter>
              <Label style={{ width: "30%" }}>Search Priority</Label>
              <Radio.Group
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
        <Right>
          <div style={{ width: "60%", display: "flex", flexDirection: "column" }}>
            <FlexDivCenter>
              <StyledTitle level={4}>Thief Options</StyledTitle>
            </FlexDivCenter>
            <Tooltip placement="topLeft" title="Changes The Thief Movement Speed">
              <SliderContainer>
                <Label>Speed</Label>
                <StyledSlider
                  onChange={speed => props.setCharacterSpeed(CONSTANTS.THIEF, speed)}
                  value={props.thiefSpeed}
                  min={1}
                  max={4}
                  step={1}
                  tooltipPlacement={"top"}
                />
              </SliderContainer>
            </Tooltip>
          </div>
        </Right>
      </Container>
    )
  }
}
