import React, { Component } from "react"
import styled from "styled-components"
import Texture from "./Texture"
import { TEXTURES } from "../Constants/Textures"
import { CONFIG } from "../Constants/Config"
import Character from "./Character"
import getNextAction from "../AStar.js"

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
      this.resetCharactersLocation(CONFIG.THIEF)
      this.setState({ initialThiefLocation: [x, y], currentThiefLocation: [x, y] })
    }
    if (characterType === TEXTURES.PLAYER_IDLE) {
      this.resetCharactersLocation(CONFIG.PLAYER)
      this.setState({ initialPlayerLocation: [x, y], currentPlayerLocation: [x, y] })
    }
  }
  resetCharactersLocation(character) {
    if (character === CONFIG.PLAYER) {
      let player = document.getElementById(CONFIG.PLAYER)
      player.style.left = 0
      player.style.top = 0
    } else {
      let thief = document.getElementById(CONFIG.THIEF)
      thief.style.left = 0
      thief.style.top = 0
    }
  }
  handleFollowCursor(x, y) {
    this.resetCharactersLocation(CONFIG.THIEF)
    this.setState({ initialThiefLocation: [x, y], currentThiefLocation: [x, y] })
  }
  onMouseHoverTextureEnter(e, x, y) {
    const { selectedEditTexture, editing, followCursor } = this.props
    const { texturesMap, mouseDown, edits } = this.state
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

      if (texturesMap[index] !== selectedEditTexture) {
        if (mouseDown) {
          let newTexturesMap = texturesMap.slice()
          newTexturesMap[index] = selectedEditTexture
          this.setState({
            texturesMap: newTexturesMap,
            mouseOverX: x,
            mouseOverY: y,
            edits: [...edits, { texture: texturesMap[index], x, y }]
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
      if (type === CONFIG.PLAYER) {
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
      let texturesMapCopy = this.state.texturesMap.slice()
      texturesMapCopy[editToUndo.y * this.state.gridWidth + editToUndo.x] = editToUndo.texture
      this.setState({ texturesMap: texturesMapCopy, edits: editsCopy })
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
          return (
            <Texture
              x={x}
              y={y}
              key={index}
              onMouseHoverTextureEnter={e => this.onMouseHoverTextureEnter(e, x, y)}
              onMouseHoverTextureLeave={e => this.onMouseHoverTextureLeave(e)}
              textureSize={textureSize}
              onMouseDown={e => this.onMouseDown(e, x, y)}
              onMouseUp={this.onMouseUp}
              xOffset={xOffset}
              yOffset={yOffset}
              texture={
                editing && mouseOverX === x && mouseOverY === y ? selectedEditTexture : texture
              }
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
          inProgress={this.props.inProgress}
          paused={this.props.paused}
          getNextAction={this.getNextCharacterAction}
          renderOnScreen={true}
          type={CONFIG.PLAYER}
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
          type={CONFIG.THIEF}
        ></Character>
      </Container>
    )
  }
}

export default Grid
