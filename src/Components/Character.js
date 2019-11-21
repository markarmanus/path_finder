import React, { Component } from "react"
import Texture from "./Texture"
import { TEXTURES } from "../Constants/Textures"
import styled from "styled-components"
import { CONFIG } from "../Constants/Config"

const CharacterSprite = styled.div`
  position: absolute;
`
export class Character extends Component {
  constructor(props) {
    super(props)
    this.state = {
      walking: false,
      currentTexture: TEXTURES[props.type.toUpperCase() + "_IDLE"]
    }
    this.move = this.move.bind(this)
    this.setCorrectTexture = this.setCorrectTexture.bind(this)
    this.setCorrectDirection = this.setCorrectDirection.bind(this)
    this.takeNextMove = this.takeNextMove.bind(this)
  }

  takeNextMove() {
    let move = this.props.getNextMove()
    console.log(move)
    if (move !== undefined) {
      this.setState({ walking: true })
      this.move(move)
    }
  }

  componentDidUpdate() {
    console.log(this.state.walking)
    if (!this.state.walking && this.props.inProgress) {
      let typeUpperCase = this.props.type.toUpperCase()
      this.takeNextMove()
      if (
        this.state.currentTexture !== TEXTURES[typeUpperCase + "_IDLE"] &&
        !this.props.inProgress
      ) {
        this.setState({ currentTexture: TEXTURES[typeUpperCase + "_IDLE"] })
      }
    }
  }
  setCorrectTexture(direction) {
    let typeUpperCase = this.props.type.toUpperCase()
    let texture =
      direction[1] === -1 && direction[0] === 0
        ? TEXTURES[typeUpperCase + "_UP"]
        : direction[1] === 1 && direction[0] === 0
        ? TEXTURES[typeUpperCase + "_DOWN"]
        : TEXTURES[typeUpperCase + "_RUNNING"]
    this.setState({ currentTexture: texture })
  }
  setCorrectDirection(entity, direction) {
    if (entity !== null) {
      if (direction[0] === -1) {
        entity.style.transform = "scaleX(-1)"
      } else {
        entity.style.transform = "scaleX(1)"
      }
    }
  }
  move(direction) {
    this.setCorrectTexture(direction)
    let character = document.getElementById(this.props.type)
    this.setCorrectDirection(character.firstChild, direction)
    let top = character.offsetTop
    let left = character.offsetLeft
    var id = setInterval(frame.bind(this), 100 - this.props.movementSpeed)
    function frame() {
      if (
        Math.abs(left - character.offsetLeft) > this.props.textureSize ||
        Math.abs(top - character.offsetTop) > this.props.textureSize
      ) {
        clearInterval(id)
        this.setState({ walking: false })
      } else {
        character.style.left = character.offsetLeft + direction[0] + "px"
        character.style.top = character.offsetTop + direction[1] + "px"
      }
    }
  }
  render() {
    const { characterLocation, type, textureSize, xOffset, yOffset, onPlaceCharacter } = this.props
    return (
      <CharacterSprite id={type}>
        {characterLocation !== null ? (
          <Texture
            x={characterLocation[0]}
            y={characterLocation[1]}
            textureSize={textureSize}
            xOffset={xOffset}
            yOffset={yOffset}
            onMouseDown={() => {
              this.takeNextMove()
              onPlaceCharacter()
            }}
            texture={this.state.currentTexture}
          ></Texture>
        ) : null}
      </CharacterSprite>
    )
  }
}

export default Character
