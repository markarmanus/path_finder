import React, { Component } from "react"
import styled from "styled-components"
import Texture from "./Texture"
import { TEXTURES } from "../Constants/Textures"
import { CONFIG } from "../Constants/Config"
import Character from "./Character"

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
      playerLocation: null,
      thiefLocation: null,
      mouseOverX: null,
      test: true,
      mouseOverY: null,
      mouseDown: false,
      playerMoves: [[0, 1]]
    }
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseHoverTextureEnter = this.onMouseHoverTextureEnter.bind(this)
    this.onMouseHoverTextureLeave = this.onMouseHoverTextureLeave.bind(this)
    this.onPlaceCharacter = this.onPlaceCharacter.bind(this)
    this.handleHoverWhilePlacingCharacter = this.handleHoverWhilePlacingCharacter.bind(this)
    this.getNextPlayerMove = this.getNextPlayerMove.bind(this)
  }
  onMouseDown(e, x, y) {
    this.setState({ mouseDown: true }, () => {
      this.onMouseHoverTextureEnter(e, x, y)
    })
  }
  onPlaceCharacter() {
    this.setState({ inProgress: true })
    this.props.setSelectedEditTexture(null)
  }
  onMouseUp() {
    this.setState({ mouseDown: false })
  }
  handleHoverWhilePlacingCharacter(characterType, x, y) {
    if (characterType === TEXTURES.THIEF_IDLE) this.setState({ thiefLocation: [x, y] })
    if (characterType === TEXTURES.PLAYER_IDLE) this.setState({ playerLocation: [x, y] })
  }
  onMouseHoverTextureEnter(e, x, y) {
    const { selectedEditTexture, editing } = this.props
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
      this.createGridWithTextureSize(nextProps.textureSize)
    }
  }
  createGridWithTextureSize(textureSize) {
    let gridWidth = Math.floor(this.container.offsetWidth / textureSize)
    let gridHeight = Math.floor(this.container.offsetHeight / textureSize)
    let xOffset = (this.container.offsetWidth % textureSize) / 2
    let yOffset = (this.container.offsetHeight % textureSize) / 2
    this.setState({
      texturesMap: new Array(gridWidth * gridHeight).fill(TEXTURES.OBSIDIAN),
      gridWidth,
      gridHeight,
      xOffset,
      yOffset
    })
  }
  generateNewMove() {
    let total = 0
    for (let i = 0; i < 1000; i++) {
      for (let x = 0; x < 1000; x++) {
        total++
      }
    }
  }
  getNextPlayerMove() {
    if (this.props.inProgress) {
      if (this.state.playerMoves.length === 0) {
        this.generateNewMove()
      }
    }
    this.setState({ test: !this.state.test })
    return this.state.test ? [0, 1] : [0, -1]
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
    this.createGridWithTextureSize(this.props.textureSize)
    this.props.onRef(this)
    window.addEventListener("resize", e => this.createGridWithTextureSize(this.props.textureSize))
  }
  render() {
    console.log("Grid rendering")
    const {
      gridWidth,
      gridHeight,
      xOffset,
      yOffset,
      texturesMap,
      mouseOverX,
      mouseOverY,
      playerLocation
    } = this.state
    const { textureSize, editing, selectedEditTexture } = this.props
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
          onPlaceCharacter={this.onPlaceCharacter}
          characterLocation={[4, 1]}
          textureSize={textureSize}
          movementSpeed={100}
          inProgress={this.props.inProgress}
          getNextMove={this.getNextPlayerMove}
          type={"player"}
        ></Character>
      </Container>
    )
  }
}

export default Grid
