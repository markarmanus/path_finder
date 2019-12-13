import React, { Component } from "react"
import Texture from "./Texture"
import { TEXTURES } from "../Constants/Textures"
import styled from "styled-components"

const CharacterSprite = styled.div`
  position: absolute;
`
export class Character extends Component {
  constructor(props) {
    super(props)
    this.state = {
      walking: false,
      currentTexture: TEXTURES[props.type.toUpperCase() + "_IDLE"],
      currentMovementSpeed: this.props.movementSpeed
    }
    this.takeAction = this.takeAction.bind(this)
    this.setCorrectTexture = this.setCorrectTexture.bind(this)
    this.setCorrectDirection = this.setCorrectDirection.bind(this)
    this.doNextAction = this.doNextAction.bind(this)
  }

  doNextAction() {
    let action = this.props.getNextAction(this.props.type)
    let typeUpperCase = this.props.type.toUpperCase()
    if (action[0] !== 0 || action[1] !== 0) {
      this.setState({ walking: true })
      this.takeAction(action)
    } else if (this.state.currentTexture !== TEXTURES[typeUpperCase + "_IDLE"]) {
      this.setState({ currentTexture: TEXTURES[typeUpperCase + "_IDLE"] })
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const {
      xOffset,
      yOffset,
      textureSize,
      movementSpeed,
      inProgress,
      paused,
      currentHealth,
      initialCharacterLocation,
      otherCharacterLocation,
      maxHealth,
      renderOnScreen
    } = this.props
    return (
      nextProps.xOffset !== xOffset ||
      nextProps.yOffset !== yOffset ||
      nextProps.textureSize !== textureSize ||
      nextProps.movementSpeed !== movementSpeed ||
      nextProps.inProgress !== inProgress ||
      nextProps.paused !== paused ||
      nextProps.currentHealth !== currentHealth ||
      nextProps.maxHealth !== maxHealth ||
      nextProps.renderOnScreen !== renderOnScreen ||
      nextProps.initialCharacterLocation !== initialCharacterLocation ||
      nextProps.otherCharacterLocation !== otherCharacterLocation ||
      nextState !== this.state
    )
  }
  componentDidMount() {
    // create reference for the Grid to use.
    this.props.onRef(this)
  }
  onClickRestart() {
    let character = document.getElementById(this.props.type)
    character.style.left = 0
    character.style.top = 0
    this.setState({ currentTexture: TEXTURES[this.props.type.toUpperCase() + "_IDLE"] })
  }
  componentDidUpdate() {
    if (
      !this.state.walking &&
      this.props.inProgress &&
      !this.props.paused &&
      this.props.renderOnScreen
    ) {
      this.doNextAction()
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
    if (this.state.currentTexture !== texture) this.setState({ currentTexture: texture })
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
  takeAction(direction) {
    this.setCorrectTexture(direction)
    let character = document.getElementById(this.props.type)
    this.setCorrectDirection(character.firstChild, direction)
    let stepsCount = Math.floor(this.props.textureSize / this.props.movementSpeed)
    let remainder = this.props.textureSize % this.props.movementSpeed
    let counter = 0
    if (this.state.currentMovementSpeed !== this.props.movementSpeed)
      this.setState({ currentMovementSpeed: this.props.movementSpeed })
    var id = setInterval(frame.bind(this), 0)
    function frame() {
      if (counter === stepsCount || !this.props.inProgress) {
        clearInterval(id)
        character.style.left = character.offsetLeft + direction[0] * remainder + "px"
        character.style.top = character.offsetTop + direction[1] * remainder + "px"
        this.props.onCharacterFinishMove(this.props.type, direction)
        this.setState({ walking: false })
      } else {
        counter++
        character.style.left =
          character.offsetLeft + direction[0] * this.state.currentMovementSpeed + "px"
        character.style.top =
          character.offsetTop + direction[1] * this.state.currentMovementSpeed + "px"
      }
    }
  }
  render() {
    const {
      initialCharacterLocation,
      type,
      textureSize,
      xOffset,
      yOffset,
      onPlaceCharacter,
      renderOnScreen,
      healthBar,
      currentHealth,
      zIndex,
      maxHealth
    } = this.props
    let healthBarPercentage = healthBar ? (currentHealth / maxHealth) * 100 : undefined
    return (
      <CharacterSprite id={type}>
        {initialCharacterLocation !== null && renderOnScreen ? (
          <Texture
            x={initialCharacterLocation[0]}
            y={initialCharacterLocation[1]}
            healthBarPercentage={healthBarPercentage}
            textureSize={textureSize}
            xOffset={xOffset}
            yOffset={yOffset}
            type={type}
            zIndex={zIndex}
            onMouseDown={() => onPlaceCharacter(type)}
            texture={this.state.currentTexture}
          ></Texture>
        ) : null}
      </CharacterSprite>
    )
  }
}

export default Character
