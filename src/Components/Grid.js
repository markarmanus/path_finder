import React, { Component } from "react"
import styled from "styled-components"
import Texture from "./Texture"
import { TEXTURES, TEXTURE_DATA } from "../Constants/Textures"
import { CONFIG } from "../Constants/Config"
import Character from "./Character"
import getNextAction from "../AStar.js"
import { Modal, Button, Typography } from "antd"

import { CONSTANTS } from "../Constants/Constants"
import queryString from "query-string"
import { isSide, calculateMaxTextureSize, calculateMinTextureSize } from "../HelperFunctions"

const Container = styled.div`
  flex: 1;
  position: relative;
  // background-image: url("background2.png");
  background: #f6d688;
`
const EditorDoneButton = styled(Button)`
  border-radius: 20px !important;
`
const EditorContainer = styled.div`
  width: 80px;
  height: 380px;
  position: absolute;
  display: flex;
  padding: 15px 0;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  left: ${props => (props.expanded ? 0 : -70)}px;
  transition: left 1s;
  top: ${props => props.top}px;
  border-radius: 10px;
  z-index: 6;
  background-color: ${CONFIG.SECONDARY_APP_COLOR};
`
const EditorArrow = styled(Button)`
  position: absolute !important;
  transform: ${props => (props.expanded === "true" ? "rotateZ(-180deg)" : "")};
  transition: transform 1s;
  left: 68px;
  top: 25px;
`
const TextureLabel = styled(Typography.Text)`
  color: white !important;
  margin-bottom: 5px;
`
const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  cursor: pointer;
`
export class Grid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      texturesMap: [],
      overLayMap: [],
      edits: [],
      modalMessage: "",
      showModal: false,
      gridWidth: 0,
      editorExpanded: true,
      finishAfterNextAnimation: false,
      gridHeight: 0,
      xOffset: 0,
      yOffset: 0,
      initialPlayerLocation: null,
      currentPlayerLocation: null,
      initialChickenLocation: null,
      currentChickenLocation: null,
      currentPlayerHealth: props.playerMaxHealth,
      currentChickenHealth: props.chickenMaxHealth,
      mouseOverX: null,
      mouseOverY: null,
      mouseDown: false
    }
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseHoverTextureEnter = this.onMouseHoverTextureEnter.bind(this)
    this.onMouseHoverTextureLeave = this.onMouseHoverTextureLeave.bind(this)
    this.onPlaceCharacter = this.onPlaceCharacter.bind(this)
    this.handleHoverWhilePlacingCharacter = this.handleHoverWhilePlacingCharacter.bind(this)
    this.getNextCharacterAction = this.getNextCharacterAction.bind(this)
    this.setCharacterCurrentHealth = this.setCharacterCurrentHealth.bind(this)
    this.onCharacterFinishMove = this.onCharacterFinishMove.bind(this)
    this.updateURL = this.updateURL.bind(this)
  }

  setCharacterCurrentHealth(character, value) {
    let capitalized = character.charAt(0).toUpperCase() + character.slice(1)
    this.setState({ ["current" + capitalized + "Health"]: value })
  }
  onMouseDown(e, x, y) {
    e.persist()
    this.setState({ mouseDown: true }, () => {
      this.onMouseHoverTextureEnter(e, x, y)
    })
  }
  onPlaceCharacter() {
    this.props.setSelectedEditTexture(null)
  }
  onMouseUp() {
    this.setState({ mouseDown: false })
  }
  handleHoverWhilePlacingCharacter(characterType, x, y) {
    if (characterType === TEXTURES.CHICKEN_IDLE) {
      this.resetCharactersLocation(CONSTANTS.CHICKEN)
      this.setState({ initialChickenLocation: [x, y], currentChickenLocation: [x, y] })
    }
    if (characterType === TEXTURES.PLAYER_IDLE) {
      this.resetCharactersLocation(CONSTANTS.PLAYER)
      this.setState({ initialPlayerLocation: [x, y], currentPlayerLocation: [x, y] })
    }
  }
  resetCharactersLocation(character) {
    if (character === CONSTANTS.PLAYER) {
      let player = document.getElementById(CONSTANTS.PLAYER)
      player.style.left = 0
      player.style.top = 0
    } else {
      let chicken = document.getElementById(CONSTANTS.CHICKEN)
      chicken.style.left = 0
      chicken.style.top = 0
    }
  }
  handleFollowCursor(x, y) {
    this.resetCharactersLocation(CONSTANTS.CHICKEN)
    this.setState({ initialChickenLocation: [x, y], currentChickenLocation: [x, y] })
  }

  updateURL() {
    let newURLObject = {
      playerSpeed: this.props.playerSpeed,
      playerMaxHealth: this.props.playerMaxHealth,
      initialTexturesMap: this.state.texturesMap,
      searchPriority: this.props.searchPriority,
      allowDiagonalActions: this.props.allowDiagonalActions,
      initialOverLayMap: this.state.overLayMap,
      minHeight: window.screen.height,
      minWidth: window.screen.width,
      chickenSpeed: this.props.chickenSpeed,
      textureSize: this.props.textureSize,
      firstRenderPlayerLocation: this.state.initialPlayerLocation,
      firstRenderChickenLocation: this.state.initialChickenLocation
    }

    window.history.replaceState(
      {},
      null,
      "?" +
        queryString.stringify(newURLObject, {
          arrayFormat: "comma"
        })
    )
  }

  onMouseHoverTextureEnter(e, x, y) {
    const { selectedEditTexture, editing, followCursor, textureSize } = this.props
    const {
      texturesMap,
      mouseDown,
      edits,
      overLayMap,
      xOffset,
      yOffset,
      gridWidth,
      gridHeight
    } = this.state
    let index = y * gridWidth + x

    let side = isSide(x, y, gridWidth, gridHeight)
    if (e.type === "touchmove") {
      let touchX = Math.floor((e.touches[0].pageX - xOffset) / textureSize)
      let touchY = Math.floor((e.touches[0].pageY - yOffset) / textureSize)
      if (touchX >= gridWidth || touchY >= gridHeight) return
      index = touchY * gridWidth + touchX
    }
    if (!side) {
      if (
        selectedEditTexture === TEXTURES.PLAYER_IDLE ||
        selectedEditTexture === TEXTURES.CHICKEN_IDLE
      ) {
        this.handleHoverWhilePlacingCharacter(selectedEditTexture, x, y)
      } else if (editing) {
        if (e.target !== null && !("ontouchstart" in window)) {
          e.target.parentElement.style.border = CONFIG.EDITING_BORDER
        }
        if (selectedEditTexture === TEXTURES.HEALTH_PACK) {
          if (mouseDown) {
            let newOverLayMap = overLayMap.slice()
            newOverLayMap[index] =
              overLayMap[index] === TEXTURES.HEALTH_PACK
                ? TEXTURES.TRANSPARENT
                : selectedEditTexture
            this.setState({
              overLayMap: newOverLayMap,
              mouseOverX: x,
              mouseOverY: y,
              mouseDown: false,
              edits: [...edits, { type: CONSTANTS.OVERLAY, texture: overLayMap[index], x, y }]
            })
          } else {
            this.setState({ mouseOverX: x, mouseOverY: y })
          }
        } else if (texturesMap[index] !== selectedEditTexture) {
          if (mouseDown) {
            let newTexturesMap = texturesMap.slice()
            newTexturesMap[index] = selectedEditTexture
            this.setState({
              texturesMap: newTexturesMap,
              mouseOverX: x,
              mouseOverY: y,
              edits: [...edits, { type: CONSTANTS.TEXTURE, texture: texturesMap[index], x, y }]
            })
          } else {
            this.setState({ mouseOverX: x, mouseOverY: y })
          }
        }
      } else if (followCursor) {
        this.handleFollowCursor(x, y)
      }
    }
  }
  onMouseHoverTextureLeave(e) {
    if (this.props.editing) {
      this.setState({ mouseOverX: null, mouseOverY: null })
      e.target.parentElement.style.border = "0"
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.textureSize !== this.props.textureSize) {
      this.initializeGridWithTextureSize(this.props.textureSize)
    }
    if (prevProps.playerMaxHealth !== this.props.playerMaxHealth) {
      this.setState({ currentPlayerHealth: this.props.playerMaxHealth })
    }
  }

  initializeGridWithTextureSize(textureSize, tMap, oMap, useURL) {
    let gridWidth = Math.floor(this.container.offsetWidth / textureSize)
    let gridHeight = Math.floor(this.container.offsetHeight / textureSize)
    let xOffset = (this.container.offsetWidth % textureSize) / 2
    let yOffset = (this.container.offsetHeight % textureSize) / 2
    let playerLocation =
      useURL !== undefined && this.props.firstRenderPlayerLocation !== null
        ? this.props.firstRenderPlayerLocation
        : [1, 1]
    let chickenLocation =
      useURL !== undefined && this.props.firstRenderChickenLocation !== null
        ? this.props.firstRenderChickenLocation
        : [gridWidth - 2, 1]
    let texturesMap =
      tMap === undefined
        ? new Array(gridWidth * gridHeight).fill(TEXTURES.FLOOR)
        : new Array(gridWidth * gridHeight).fill(TEXTURES.FLOOR).map((value, index) => {
            return tMap[index] !== undefined ? tMap[index] : value
          })
    let overLayMap =
      oMap === undefined
        ? new Array(gridWidth * gridHeight).fill(TEXTURES.TRANSPARENT)
        : new Array(gridWidth * gridHeight).fill(TEXTURES.TRANSPARENT).map((value, index) => {
            return oMap[index] !== undefined ? oMap[index] : value
          })

    this.setState({
      texturesMap: texturesMap,
      overLayMap: overLayMap,
      gridWidth,
      gridHeight,
      xOffset,
      yOffset,
      initialPlayerLocation: playerLocation,
      initialChickenLocation: chickenLocation,
      currentPlayerLocation: playerLocation,
      currentChickenLocation: chickenLocation,
      currentPlayerHealth: this.props.playerMaxHealth,
      currentChickenHealth: this.props.chickenMaxHealth,
      edits: []
    })
    this.props.envIsReady()
  }

  getNextCharacterAction(type) {
    let action = getNextAction(this.state, this.props, type)
    if (action[0] !== 0 || action[1] !== 0) {
      if (type === CONSTANTS.PLAYER) {
        let newPosition = [
          this.state.currentPlayerLocation[0] + action[0],
          this.state.currentPlayerLocation[1] + action[1]
        ]
        this.setState({ currentPlayerLocation: newPosition })
      } else {
        let newPosition = [
          this.state.currentChickenLocation[0] + action[0],
          this.state.currentChickenLocation[1] + action[1]
        ]
        this.setState({ currentChickenLocation: newPosition })
      }
    }

    return action
  }
  undoEdit() {
    if (this.state.edits.length > 0) {
      let editsCopy = this.state.edits.slice()
      let editToUndo = editsCopy.pop()
      let index = editToUndo.y * this.state.gridWidth + editToUndo.x
      if (editToUndo.type === CONSTANTS.TEXTURE) {
        let texturesMapCopy = this.state.texturesMap.slice()
        texturesMapCopy[index] = editToUndo.texture
        this.setState({ texturesMap: texturesMapCopy, edits: editsCopy })
      } else if (editToUndo.type === CONSTANTS.OVERLAY) {
        let overLayMapCopy = this.state.overLayMap.slice()
        overLayMapCopy[index] = editToUndo.texture
        this.setState({ overLayMap: overLayMapCopy, edits: editsCopy })
      }
    }
  }
  componentDidMount() {
    let validTextureSize =
      this.props.textureSize >= calculateMinTextureSize(window) &&
      this.props.textureSize <= calculateMaxTextureSize(window)
    let mapCanFit =
      this.props.URLParams.minHeight <= window.screen.height &&
      this.props.URLParams.minWidth <= window.screen.width
    if (validTextureSize && mapCanFit) {
      if (this.props.initialTexturesMap.length > 0 && this.props.initialOverLayMap.length > 0) {
        this.initializeGridWithTextureSize(
          this.props.textureSize,
          this.props.initialTexturesMap,
          this.props.initialOverLayMap,
          true
        )
      } else {
        this.initializeGridWithTextureSize(this.props.textureSize)
      }
    } else {
      if (!mapCanFit && this.props.URLParams.initialTexturesMap !== undefined) {
        this.setState({
          showModal: true,
          modalMessage:
            "We could not load the map from the link, the map was created on a screen bigger than the one you are using currently. Try again using a bigger screen."
        })
      }
      this.initializeGridWithTextureSize(this.props.textureSize)
    }
    this.props.onRef(this)
    window.addEventListener("resize", e =>
      this.initializeGridWithTextureSize(this.props.textureSize)
    )
  }
  onCharacterFinishMove(characterType, action) {
    const { overLayMap, currentPlayerLocation, currentChickenLocation, texturesMap } = this.state
    let capitalized = characterType.charAt(0).toUpperCase() + characterType.slice(1)
    let characterLocation = this.state["current" + capitalized + "Location"]
    let currentCharacterHealth = this.state["current" + capitalized + "Health"]
    let index = characterLocation[1] * this.state.gridWidth + characterLocation[0]
    if (texturesMap[index] === TEXTURES.FIRE) {
      this.setCharacterCurrentHealth(characterType, currentCharacterHealth - 1)
    }
    if (overLayMap[index] === TEXTURES.HEALTH_PACK) {
      let newOverLayMap = overLayMap.slice()
      newOverLayMap[index] = TEXTURES.TRANSPARENT
      this.setState({
        overLayMap: newOverLayMap
      })
      this.setCharacterCurrentHealth(characterType, this.props.playerMaxHealth)
    }
    if (this.state.finishAfterNextAnimation) {
      this.props.onFinishGame()
      this.props.onClickRestart()
    }
    if (
      currentPlayerLocation[0] === currentChickenLocation[0] &&
      currentPlayerLocation[1] === currentChickenLocation[1]
    ) {
      if (this.props.chickenSpeed === 0) {
        this.props.onFinishGame()
        this.props.onClickRestart()
      } else if (characterType === CONSTANTS.PLAYER && !this.props.followCursor) {
        this.setState({ finishAfterNextAnimation: true })
      }
    }
    if (
      currentPlayerLocation[0] === currentChickenLocation[0] &&
      currentPlayerLocation[1] === currentChickenLocation[1] &&
      characterType === CONSTANTS.PLAYER &&
      !this.props.followCursor
    ) {
      this.setState({ finishAfterNextAnimation: true })
    }
  }
  onSelectCustomLevel(levelData) {
    this.initializeGridWithTextureSize(
      levelData.textureSize,
      levelData.initialTexturesMap,
      levelData.initialOverLayMap,
      true
    )
  }
  onClickTexture(texture) {
    this.props.setEditing(true)
    this.props.setSelectedEditTexture(texture)
  }
  onClickRestart() {
    this.player.onClickRestart()
    this.chicken.onClickRestart()
    this.setState({
      currentPlayerLocation: this.state.initialPlayerLocation,
      currentChickenLocation: this.state.initialChickenLocation,
      currentPlayerHealth: this.props.playerMaxHealth,
      currentChickenHealth: this.props.chickenMaxHealth,
      finishAfterNextAnimation: false
    })
  }
  render() {
    const {
      gridWidth,
      gridHeight,
      xOffset,
      yOffset,
      texturesMap,
      overLayMap,
      mouseOverX,
      mouseOverY,
      initialPlayerLocation,
      initialChickenLocation,
      showModal,
      modalMessage,
      currentPlayerHealth,
      editorExpanded
    } = this.state
    const {
      textureSize,
      inProgress,
      paused,
      followCursor,
      editing,
      selectedEditTexture,
      playerSpeed,
      setEditing,
      playerMaxHealth,
      chickenSpeed
    } = this.props
    let isEditingOverLay = selectedEditTexture === TEXTURES.HEALTH_PACK
    return (
      <Container onMouseLeave={this.onMouseUp} ref={el => (this.container = el)}>
        <Modal
          closable={false}
          footer={[
            <Button type="primary" onClick={() => this.setState({ showModal: false })}>
              Ok
            </Button>
          ]}
          title={"Sorry"}
          visible={showModal}
        >
          {modalMessage}
        </Modal>
        <EditorContainer
          top={this.container !== undefined ? this.container.offsetHeight / 2 : 0}
          expanded={editorExpanded}
        >
          <EditorArrow
            expanded={editorExpanded ? "true" : "false"}
            onClick={() => this.setState({ editorExpanded: !editorExpanded })}
            size="small"
            shape="circle"
            icon="arrow-right"
          ></EditorArrow>
          <Image
            onClick={() => this.onClickTexture(22)}
            src={TEXTURE_DATA[TEXTURES.FLOOR].src}
          ></Image>
          <TextureLabel>Floor</TextureLabel>
          <Image
            onClick={() => this.onClickTexture(TEXTURES.FIRE)}
            src={TEXTURE_DATA[TEXTURES.FIRE].icon}
          ></Image>
          <TextureLabel>Fire</TextureLabel>
          <Image
            onClick={() => this.onClickTexture(TEXTURES.WALL)}
            src={TEXTURE_DATA[TEXTURES.WALL].src}
          ></Image>
          <TextureLabel>Rock</TextureLabel>
          <Image
            onClick={() => this.onClickTexture(TEXTURES.HEALTH_PACK)}
            src={TEXTURE_DATA[TEXTURES.WALL].src}
          ></Image>
          <TextureLabel>Health</TextureLabel>
          <EditorDoneButton
            onClick={() => {
              setEditing(false)
              this.setState({ editorExpanded: false })
            }}
            size="small"
          >
            Done
          </EditorDoneButton>
        </EditorContainer>
        {texturesMap.map((texture, index) => {
          const x = index % gridWidth
          const y = Math.floor(index / gridWidth)
          const left = x === 0
          const right = x === gridWidth - 1
          const top = y === 0
          const bottom = y === gridHeight - 1
          let side = isSide(x, y, gridWidth, gridHeight)
          let floorTexture = "FLOOR"
          if (top) floorTexture += "_TOP"
          if (bottom) floorTexture += "_BOTTOM"
          if (left) floorTexture += "_LEFT"
          if (right) floorTexture += "_RIGHT"
          let textureToRenderIfSide = TEXTURES[floorTexture]
          let isBeingEdited = editing && mouseOverX === x && mouseOverY === y
          return (
            <Texture
              x={x}
              y={y}
              key={index}
              textureSize={textureSize}
              xOffset={xOffset}
              zIndex={1}
              yOffset={yOffset}
              texture={
                isBeingEdited && !isEditingOverLay
                  ? selectedEditTexture
                  : side
                  ? textureToRenderIfSide
                  : texture
              }
            ></Texture>
          )
        })}
        {overLayMap.map((overLayTexture, index) => {
          const x = index % gridWidth
          const y = Math.floor(index / gridWidth)
          let isBeingEdited = editing && mouseOverX === x && mouseOverY === y
          return (
            <Texture
              x={x}
              y={y}
              key={index}
              onMouseHoverTextureEnter={e => this.onMouseHoverTextureEnter(e, x, y)}
              onMouseHoverTextureLeave={e => this.onMouseHoverTextureLeave(e)}
              textureSize={textureSize}
              onMouseDown={e => this.onMouseDown(e, x, y)}
              zIndex={2}
              onMouseUp={this.onMouseUp}
              xOffset={xOffset}
              yOffset={yOffset}
              texture={isBeingEdited && isEditingOverLay ? selectedEditTexture : overLayTexture}
            ></Texture>
          )
        })}
        <Character
          xOffset={xOffset}
          yOffset={yOffset}
          onRef={ref => (this.player = ref)}
          onPlaceCharacter={this.onPlaceCharacter}
          initialCharacterLocation={initialPlayerLocation}
          textureSize={textureSize}
          movementSpeed={playerSpeed}
          inProgress={inProgress}
          paused={paused}
          getNextAction={this.getNextCharacterAction}
          onCharacterFinishMove={this.onCharacterFinishMove}
          currentHealth={currentPlayerHealth}
          maxHealth={playerMaxHealth}
          renderOnScreen={true}
          healthBar={true}
          type={CONSTANTS.PLAYER}
          zIndex={5}
        ></Character>
        <Character
          xOffset={xOffset}
          yOffset={yOffset}
          onRef={ref => (this.chicken = ref)}
          onPlaceCharacter={this.onPlaceCharacter}
          initialCharacterLocation={initialChickenLocation}
          textureSize={textureSize}
          movementSpeed={chickenSpeed}
          onCharacterFinishMove={this.onCharacterFinishMove}
          inProgress={inProgress}
          paused={paused}
          getNextAction={this.getNextCharacterAction}
          renderOnScreen={!followCursor}
          type={CONSTANTS.CHICKEN}
          zIndex={4}
        ></Character>
      </Container>
    )
  }
}

export default Grid
