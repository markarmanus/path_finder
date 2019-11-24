import React, { Component } from "react"
import styled from "styled-components"
import Texture from "./Texture"
import { TEXTURES } from "../Constants/Textures"
import { CONFIG } from "../Constants/Config"
import Character from "./Character"
import getNextAction from "../AStar.js"
import { CONSTANTS } from "../Constants/Constants"

const Container = styled.div`
  flex: 1;
  position: relative;
  background-image: url("Background.PNG");
`
export class Grid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      texturesMap: [],
      overLayMap: [],
      edits: [],
      gridWidth: 0,
      gridHeight: 0,
      xOffset: 0,
      yOffset: 0,
      initialPlayerLocation: null,
      currentPlayerLocation: null,
      initialThiefLocation: null,
      currentThiefLocation: null,
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
  }
  onMouseDown(e, x, y) {
    this.setState({ mouseDown: true }, () => {
      this.onMouseHoverTextureEnter(e, x, y)
    })
  }
  onPlaceCharacter(type) {
    this.props.setSelectedEditTexture(null)
  }
  onMouseUp() {
    this.setState({ mouseDown: false })
  }
  handleHoverWhilePlacingCharacter(characterType, x, y) {
    if (characterType === TEXTURES.THIEF_IDLE) {
      this.resetCharactersLocation(CONSTANTS.THIEF)
      this.setState({ initialThiefLocation: [x, y], currentThiefLocation: [x, y] })
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
      let thief = document.getElementById(CONSTANTS.THIEF)
      thief.style.left = 0
      thief.style.top = 0
    }
  }
  handleFollowCursor(x, y) {
    this.resetCharactersLocation(CONSTANTS.THIEF)
    this.setState({ initialThiefLocation: [x, y], currentThiefLocation: [x, y] })
  }
  onMouseHoverTextureEnter(e, x, y) {
    const { selectedEditTexture, editing, followCursor } = this.props
    const { texturesMap, mouseDown, edits, overLayMap } = this.state
    const index = y * this.state.gridWidth + x
    if (
      selectedEditTexture === TEXTURES.PLAYER_IDLE ||
      selectedEditTexture === TEXTURES.THIEF_IDLE
    ) {
      this.handleHoverWhilePlacingCharacter(selectedEditTexture, x, y)
    } else if (editing) {
      if (e.target !== null) {
        e.target.parentElement.style.border = CONFIG.EDITING_BORDER
      }
      if (selectedEditTexture === TEXTURES.HEALTH_PACK) {
        if (mouseDown) {
          let newOverLayMap = overLayMap.slice()
          newOverLayMap[index] =
            overLayMap[index] === TEXTURES.HEALTH_PACK ? TEXTURES.TRANSPARENT : selectedEditTexture
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
  onMouseHoverTextureLeave(e) {
    if (this.props.editing) {
      this.setState({ mouseOverX: null, mouseOverY: null })
      e.target.parentElement.style.border = "0"
    }
  }
  componentWillUpdate(nextProps) {
    if (nextProps.textureSize !== this.props.textureSize) {
      this.initializeGridWithTextureSize(nextProps.textureSize)
    }
  }

  initializeGridWithTextureSize(textureSize) {
    let gridWidth = Math.floor(this.container.offsetWidth / textureSize)
    let gridHeight = Math.floor(this.container.offsetHeight / textureSize)
    let xOffset = (this.container.offsetWidth % textureSize) / 2
    let yOffset = (this.container.offsetHeight % textureSize) / 2
    this.setState({
      texturesMap: new Array(gridWidth * gridHeight).fill(TEXTURES.OBSIDIAN),
      overLayMap: new Array(gridWidth * gridHeight).fill(TEXTURES.TRANSPARENT),
      gridWidth,
      gridHeight,
      xOffset,
      yOffset,
      initialPlayerLocation: [0, 0],
      initialThiefLocation: [gridWidth - 1, 0],
      currentPlayerLocation: [0, 0],
      currentThiefLocation: [gridWidth - 1, 0],
      edits: []
    })
    this.props.envIsReady()
  }

  getNextCharacterAction(type) {
    let action = getNextAction(this.state, type)
    if (action[0] !== 0 || action[1] !== 0) {
      if (type === CONSTANTS.PLAYER) {
        let newPosition = [
          this.state.currentPlayerLocation[0] + action[0],
          this.state.currentPlayerLocation[1] + action[1]
        ]
        this.setState({ currentPlayerLocation: newPosition })
      } else {
        let newPosition = [
          this.state.currentThiefLocation[0] + action[0],
          this.state.currentThiefLocation[1] + action[1]
        ]
        this.setState({ currentThiefLocation: newPosition })
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
    this.initializeGridWithTextureSize(this.props.textureSize)
    this.props.onRef(this)
    window.addEventListener("resize", e =>
      this.initializeGridWithTextureSize(this.props.textureSize)
    )
  }
  onClickRestart() {
    this.player.onClickRestart()
    this.thief.onClickRestart()
    this.setState({
      currentPlayerLocation: this.state.initialPlayerLocation,
      currentThiefLocation: this.state.initialThiefLocation
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
      initialThiefLocation
    } = this.state
    const { textureSize, editing, selectedEditTexture, playerSpeed, thiefSpeed } = this.props
    return (
      <Container ref={el => (this.container = el)}>
        {texturesMap.map((texture, index) => {
          const x = index % gridWidth
          const y = Math.floor(index / gridWidth)
          let isBeingEdited = editing && mouseOverX === x && mouseOverY === y
          let isEditingOverLay = selectedEditTexture === TEXTURES.HEALTH_PACK

          return (
            <span key={index}>
              <Texture
                x={x}
                y={y}
                key={index + "texture"}
                textureSize={textureSize}
                xOffset={xOffset}
                zIndex={1}
                yOffset={yOffset}
                texture={isBeingEdited && !isEditingOverLay ? selectedEditTexture : texture}
              ></Texture>
              <Texture
                x={x}
                y={y}
                key={index + "overLay"}
                onMouseHoverTextureEnter={e => this.onMouseHoverTextureEnter(e, x, y)}
                onMouseHoverTextureLeave={e => this.onMouseHoverTextureLeave(e)}
                textureSize={textureSize}
                onMouseDown={e => this.onMouseDown(e, x, y)}
                zIndex={2}
                onMouseUp={this.onMouseUp}
                xOffset={xOffset}
                yOffset={yOffset}
                texture={
                  isBeingEdited && isEditingOverLay ? selectedEditTexture : overLayMap[index]
                }
              ></Texture>
            </span>
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
          inProgress={this.props.inProgress}
          paused={this.props.paused}
          getNextAction={this.getNextCharacterAction}
          renderOnScreen={true}
          type={CONSTANTS.PLAYER}
        ></Character>
        <Character
          xOffset={xOffset}
          yOffset={yOffset}
          onRef={ref => (this.thief = ref)}
          onPlaceCharacter={this.onPlaceCharacter}
          initialCharacterLocation={initialThiefLocation}
          textureSize={textureSize}
          movementSpeed={thiefSpeed}
          inProgress={this.props.inProgress}
          paused={this.props.paused}
          getNextAction={this.getNextCharacterAction}
          renderOnScreen={!this.props.followCursor}
          type={CONSTANTS.THIEF}
        ></Character>
      </Container>
    )
  }
}

export default Grid
