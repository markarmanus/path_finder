import React, { Component } from "react"
import Texture from "./Texture"
import { TEXTURES } from "../Constants/Textures"
import styled, { keyframes } from "styled-components"
import { CONFIG } from "../Constants/Config"

const PlayerSprite = styled.div`
  position: absolute;
`
let moves = [
  [-1, 0],
  [1, 0],
  [-1, 0],
  [1, 0]
]

export class Player extends Component {
  constructor(props) {
    super(props)
    this.state = {
      walking: false,
      currentTexture: TEXTURES.PLAYER_IDLE
    }
    this.move = this.move.bind(this)
    this.setCorrectTexture = this.setCorrectTexture.bind(this)
    this.setCorrectDirection = this.setCorrectDirection.bind(this)
  }
  componentDidMount() {
    if (moves.length > 0) {
      let move = moves.pop()
      this.setState({ walking: true })
      this.move(move)
    }
  }
  componentDidUpdate() {
    if (!this.state.walking) {
      if (moves.length > 0) {
        let move = moves.pop()
        this.setState({ walking: true })
        this.move(move)
      } else if (this.state.currentTexture !== TEXTURES.PLAYER_IDLE) {
        this.setState({ currentTexture: TEXTURES.PLAYER_IDLE })
      }
    }
  }
  setCorrectTexture(direction) {
    let texture =
      direction[1] === -1 && direction[0] === 0
        ? TEXTURES.PLAYER_UP
        : direction[1] === 1 && direction[0] === 0
        ? TEXTURES.PLAYER_DOWN
        : TEXTURES.PLAYER_RUNNING
    this.setState({ currentTexture: texture })
  }
  setCorrectDirection(entity, direction) {
    if (direction[0] === -1) {
      entity.firstChild.style.transform = "scaleX(-1)"
    } else {
      entity.firstChild.style.transform = "scaleX(1)"
    }
  }
  move(direction) {
    this.setCorrectTexture(direction)
    let player = document.getElementById("player")
    this.setCorrectDirection(player, direction)
    let top = player.offsetTop
    let left = player.offsetLeft
    var id = setInterval(frame.bind(this), 100 - CONFIG.PLAYER_SPEED)
    function frame() {
      if (
        Math.abs(left - player.offsetLeft) > 100 ||
        Math.abs(top - player.offsetTop) > 100
      ) {
        clearInterval(id)
        this.setState({ walking: false })
      } else {
        player.style.left = player.offsetLeft + direction[0] + "px"
        player.style.top = player.offsetTop + direction[1] + "px"
      }
    }
  }
  render() {
    return (
      <PlayerSprite id={"player"} onClick={this.onClick}>
        <Texture x={3} y={3} texture={this.state.currentTexture}></Texture>
      </PlayerSprite>
    )
  }
}

export default Player
