import React, { Component } from "react"
import styled from "styled-components"
import Texture from "./Texture"
import { TEXTURES, TEXTURE_DATA } from "../Constants/Textures"
import { CONFIG } from "../Constants/Config"
import Character from "./Character"
import { getNextAction } from "../AI.js"
import { Modal, Button, Typography, message } from "antd"

import { CONSTANTS } from "../Constants/Constants"
import queryString from "query-string"
import {
  isSide,
  calculateMaxTextureSize,
  calculateMinTextureSize,
  isTouchDevice,
  getTextureSizeForMap,
  calculateBestTextureSize
} from "../HelperFunctions"

const Container = styled.div`
  flex: 1;
  position: relative;
  background: #81ba44;
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
      originalOverLayMap: [],
      edits: [],
      modalMessage: "",
      showModal: false,
      gridWidth: 0,
      editorExpanded: true,
      gridHeight: 0,
      xOffset: 0,
      yOffset: 0,
      initialPlayerLocation: null,
      currentPlayerLocation: null,
      initialChickenLocation: null,
      currentChickenLocation: null,
      currentPlayerHealth: props.playerMaxHealth,
      currentChickenHealth: props.chickenMaxHealth,
      leftMouseDown: false,
      rightMouseDown: false
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
    if (e.button === 0 || e.type === "touchstart") {
      this.setState({ leftMouseDown: true }, () => {
        this.onMouseHoverTextureEnter(e, x, y)
      })
    } else if (e.button === 2) {
      this.setState({ rightMouseDown: true }, () => {
        this.onMouseHoverTextureEnter(e, x, y)
      })
    }
  }
  onPlaceCharacter() {
    this.props.setSelectedEditTexture(null)
  }
  onMouseUp(e) {
    this.setState({ leftMouseDown: false, rightMouseDown: false })
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
      initialOverLayMap: this.state.overLayMap,
      gridWidth: this.state.gridWidth,
      gridHeight: this.state.gridHeight,
      chickenSpeed: this.props.chickenSpeed,
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

  onMouseHoverTextureEnter(e, x, y, texture) {
    const { selectedEditTexture, editing, followCursor, textureSize } = this.props
    const {
      texturesMap,
      leftMouseDown,
      rightMouseDown,
      edits,
      overLayMap,
      xOffset,
      yOffset,
      gridWidth,
      gridHeight
    } = this.state
    let index = 0
    let side = true
    if (e.type === "touchmove") {
      let touchX = Math.floor((e.touches[0].pageX - xOffset) / textureSize)
      let touchY = Math.floor((e.touches[0].pageY - yOffset) / textureSize)
      if (touchX >= gridWidth || touchY >= gridHeight) return
      index = touchY * gridWidth + touchX
      side = isSide(touchX, touchY, gridWidth, gridHeight)
    } else {
      index = y * gridWidth + x
      side = isSide(x, y, gridWidth, gridHeight)
    }
    if (!side) {
      if (
        selectedEditTexture === TEXTURES.PLAYER_IDLE ||
        selectedEditTexture === TEXTURES.CHICKEN_IDLE
      ) {
        this.handleHoverWhilePlacingCharacter(selectedEditTexture, x, y)
      } else if (editing) {
        if (e.target !== null && !isTouchDevice(window)) {
          e.target.parentElement.parentElement.style.border = CONFIG.EDITING_BORDER
        }
        if (leftMouseDown) {
          if (selectedEditTexture === TEXTURES.HEALTH_PACK) {
            if (overLayMap[index] !== TEXTURES.HEALTH_PACK || e.type === "touchstart") {
              let newOverLayMap = overLayMap.slice()
              newOverLayMap[index] =
                overLayMap[index] === TEXTURES.HEALTH_PACK
                  ? TEXTURES.TRANSPARENT
                  : TEXTURES.HEALTH_PACK
              this.setState({
                overLayMap: newOverLayMap,
                leftMouseDown: isTouchDevice(window) ? false : leftMouseDown,
                edits: [...edits, { type: CONSTANTS.OVERLAY, texture: overLayMap[index], x, y }]
              })
            }
          } else if (texturesMap[index] !== selectedEditTexture) {
            let newTexturesMap = texturesMap.slice()
            newTexturesMap[index] = selectedEditTexture
            this.setState({
              texturesMap: newTexturesMap,
              edits: [...edits, { type: CONSTANTS.TEXTURE, texture: texturesMap[index], x, y }]
            })
          }
        } else if (rightMouseDown) {
          let stateUpdate = {}
          let editsUpdate = [...edits]
          let shouldUpdateState = false
          if (overLayMap[index] !== TEXTURES.TRANSPARENT) {
            shouldUpdateState = true
            let newOverLayMap = overLayMap.slice()
            newOverLayMap[index] = TEXTURES.TRANSPARENT
            stateUpdate.overLayMap = newOverLayMap
            editsUpdate.push({ type: CONSTANTS.OVERLAY, texture: overLayMap[index], x, y })
          }
          if (texturesMap[index] !== TEXTURES.FLOOR) {
            shouldUpdateState = true
            let newTexturesMap = texturesMap.slice()
            newTexturesMap[index] = TEXTURES.FLOOR
            stateUpdate.texturesMap = newTexturesMap
            editsUpdate.push({ type: CONSTANTS.TEXTURE, texture: texturesMap[index], x, y })
          }
          if (shouldUpdateState) {
            stateUpdate.edits = editsUpdate

            this.setState({ ...stateUpdate })
          }
        } else {
          texture.setMouseOver(true)
        }
      } else if (followCursor) {
        this.handleFollowCursor(x, y)
      }
    }
  }
  onMouseHoverTextureLeave(e, texture) {
    if (this.props.editing) {
      texture.setMouseOver(false)
      e.target.parentElement.parentElement.style.border = "0"
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.textureSize !== this.props.textureSize && this.props.reRenderGrid) {
      this.initializeGridWithTextureSize(this.props.textureSize)
    }
    if (prevProps.playerMaxHealth !== this.props.playerMaxHealth) {
      this.setState({ currentPlayerHealth: this.props.playerMaxHealth })
    }
    if (this.props.inProgress && prevProps.inProgress !== this.props.inProgress) {
      this.setState({ originalOverLayMap: this.state.overLayMap })
    }
  }

  initializeGridFromData(data) {
    if (this.container === null) return
    let yOffset = (this.container.offsetHeight - data.gridHeight * this.props.textureSize) / 2
    let xOffset = (this.container.offsetWidth - data.gridWidth * this.props.textureSize) / 2
    let playerLocationFromURL = data.firstRenderPlayerLocation
    let chickenLocationFromURL = data.firstRenderChickenLocation
    let playerLocation = playerLocationFromURL !== undefined ? playerLocationFromURL : [1, 1]
    let chickenLocation =
      chickenLocationFromURL !== undefined ? chickenLocationFromURL : [data.gridWidth - 2, 1]
    this.setState({
      texturesMap: data.initialTexturesMap,
      overLayMap: data.initialOverLayMap,
      originalOverLayMap: data.initialOverLayMap,
      gridWidth: data.gridWidth,
      gridHeight: data.gridHeight,
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
  initializeGridWithTextureSize(textureSize) {
    let gridWidth = Math.floor(this.container.offsetWidth / textureSize)
    let gridHeight = Math.floor(this.container.offsetHeight / textureSize)
    let xOffset = (this.container.offsetWidth % textureSize) / 2
    let yOffset = (this.container.offsetHeight % textureSize) / 2
    let playerLocation = [1, 1]
    let chickenLocation = [gridWidth - 2, 1]
    let texturesMap = new Array(gridWidth * gridHeight).fill(TEXTURES.FLOOR)
    let overLayMap = new Array(gridWidth * gridHeight).fill(TEXTURES.TRANSPARENT)
    this.setState({
      texturesMap: texturesMap,
      overLayMap: overLayMap,
      originalOverLayMap: overLayMap,
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
    let rendered = false
    if (
      this.props.URLParams !== null &&
      this.props.URLParams.initialTexturesMap !== undefined &&
      this.props.URLParams.initialOverLayMap !== undefined
    ) {
      if (
        this.props.URLParams.initialTexturesMap.length > 0 &&
        this.props.URLParams.initialOverLayMap.length > 0
      ) {
        const textureSizeForURLMap = getTextureSizeForMap(
          this.props.URLParams.gridWidth,
          this.props.URLParams.gridHeight,
          this.container
        )

        if (
          textureSizeForURLMap <= calculateMaxTextureSize(window) &&
          textureSizeForURLMap >= calculateMinTextureSize(window)
        ) {
          rendered = true
          this.props.setTextureSize(textureSizeForURLMap, false)
          setTimeout(() => {
            this.initializeGridFromData(this.props.URLParams)
          }, 0)
        } else {
          this.setState({
            showModal: true,
            modalMessage:
              "We could not load the map from the link, the map was created on a screen much different than the one you are using currently. Please Try again with a different device."
          })
        }
      } else {
        this.setState({
          showModal: true,
          modalMessage:
            "We Could Not Load The Map, There Seems to Be Something wrong with the link shared with you."
        })
      }
    }
    if (!rendered) {
      this.props.setTextureSize(calculateBestTextureSize(window), false)
      setTimeout(() => {
        this.initializeGridWithTextureSize(this.props.textureSize)
      }, 0)
    }

    this.props.onRef(this)
    window.addEventListener("resize", e => {
      this.props.onClickRestart()
      this.initializeGridWithTextureSize(this.props.textureSize)
    })
    this.container.oncontextmenu = function() {
      return false
    }
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

    if (
      currentPlayerLocation[0] === currentChickenLocation[0] &&
      currentPlayerLocation[1] === currentChickenLocation[1] &&
      !this.props.followCursor
    ) {
      if (this.props.chickenSpeed === 0) {
        this.props.onFinishGame()
        this.props.onClickRestart()
      } else if (characterType === CONSTANTS.PLAYER) {
        this.props.onFinishGame()
        this.props.onClickRestart()
      }
    }
  }
  onSelectCustomLevel(levelData) {
    const textureSizeForLevel = getTextureSizeForMap(
      levelData.gridWidth,
      levelData.gridHeight,
      this.container
    )

    if (
      textureSizeForLevel <= calculateMaxTextureSize(window) &&
      textureSizeForLevel >= calculateMinTextureSize(window)
    ) {
      this.props.setTextureSize(textureSizeForLevel, false)
      setTimeout(() => {
        this.initializeGridFromData(levelData)
      }, 0)
    } else {
      message.error("Your Screen is Not Compatible with this Level!")
    }
  }
  onClickTexture(texture) {
    if (this.props.followCursor) this.props.onClickPause()
    this.props.setEditing(true)
    this.props.setSelectedEditTexture(texture)
  }
  onClickRestart() {
    this.player.onClickRestart()
    this.chicken.onClickRestart()
    this.setState({
      currentPlayerLocation: this.state.initialPlayerLocation,
      currentChickenLocation: this.state.initialChickenLocation,
      overLayMap: this.state.originalOverLayMap,
      currentPlayerHealth: this.props.playerMaxHealth,
      currentChickenHealth: this.props.chickenMaxHealth
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
      initialPlayerLocation,
      initialChickenLocation,
      showModal,
      modalMessage,
      currentPlayerHealth,
      rightMouseDown,
      currentPlayerLocation,
      currentChickenLocation,
      leftMouseDown,
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
    return (
      <Container
        onMouseLeave={() => (leftMouseDown || rightMouseDown ? this.onMouseUp : null)}
        ref={el => (this.container = el)}
      >
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
            src={TEXTURE_DATA[TEXTURES.FLOOR].icon}
          ></Image>
          <TextureLabel>Floor</TextureLabel>
          <Image
            onClick={() => this.onClickTexture(TEXTURES.FIRE)}
            src={TEXTURE_DATA[TEXTURES.FIRE].icon}
          ></Image>
          <TextureLabel>Fire</TextureLabel>
          <Image
            onClick={() => this.onClickTexture(TEXTURES.WALL)}
            src={TEXTURE_DATA[TEXTURES.WALL].icon}
          ></Image>
          <TextureLabel>Rock</TextureLabel>
          <Image
            onClick={() => this.onClickTexture(TEXTURES.HEALTH_PACK)}
            src={TEXTURE_DATA[TEXTURES.HEALTH_PACK].icon}
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
          const overLayTexture = overLayMap[index]
          const left = x === 0
          const right = x === gridWidth - 1
          const top = y === 0
          const bottom = y === gridHeight - 1
          let side = bottom || top || right || left
          let floorTexture = "FLOOR"
          let textureToRenderIfSide = "FLOOR"
          if (side) {
            if (top) floorTexture += "_TOP"
            if (bottom) floorTexture += "_BOTTOM"
            if (left) floorTexture += "_LEFT"
            if (right) floorTexture += "_RIGHT"
            textureToRenderIfSide = TEXTURES[floorTexture]
          }
          return [
            <Texture
              x={x}
              y={y}
              key={index + "texture"}
              textureSize={textureSize}
              xOffset={xOffset}
              zIndex={1}
              yOffset={yOffset}
              texture={side ? textureToRenderIfSide : texture}
            ></Texture>,
            <Texture
              x={x}
              y={y}
              key={index + "overLay"}
              onMouseHoverTextureEnter={(texture, e) =>
                this.onMouseHoverTextureEnter(e, x, y, texture)
              }
              onMouseHoverTextureLeave={(texture, e) => this.onMouseHoverTextureLeave(e, texture)}
              selectedEditTexture={selectedEditTexture}
              editing={editing}
              textureSize={textureSize}
              onMouseDown={e => this.onMouseDown(e, x, y)}
              zIndex={2}
              onMouseUp={this.onMouseUp}
              xOffset={xOffset}
              yOffset={yOffset}
              texture={overLayTexture}
            ></Texture>
          ]
        })}
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
          otherCharacterLocation={currentPlayerLocation}
          renderOnScreen={!followCursor}
          type={CONSTANTS.CHICKEN}
          zIndex={4}
        ></Character>
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
          otherCharacterLocation={currentChickenLocation}
          getNextAction={this.getNextCharacterAction}
          onCharacterFinishMove={this.onCharacterFinishMove}
          currentHealth={currentPlayerHealth}
          maxHealth={playerMaxHealth}
          renderOnScreen={true}
          healthBar={true}
          type={CONSTANTS.PLAYER}
          zIndex={5}
        ></Character>
      </Container>
    )
  }
}

export default Grid
