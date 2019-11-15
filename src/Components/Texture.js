import React, { Component, useState } from "react"
import { TEXTURES, TEXTURE_DATA } from "../Constants/Textures"
import { CONFIG } from "../Constants/Config"
import styled, { keyframes } from "styled-components"

let textureWidth = window.innerWidth / CONFIG.GRID_WIDTH
let textureHeight = window.innerHeight / CONFIG.GRID_HEIGHT
const getAnimation = numberOfSprites => {
  const translationTo = ((numberOfSprites - 1) / numberOfSprites) * 100
  const transform = keyframes`
  from { 
    transform: translateX(0); 
  }
  to { 
    transform: translateX(-${translationTo}%); 
  }
}
`
  return transform
}
const Sprite = styled.div`
  width: ${props => props.textureData.numberOfSprites * 100}%;
  height: 100%;
  background-image: url(${props => props.textureData.src});
  background-size: 100%, 100%;
  background-repeat: ${props =>
    props.textureData.animated ? "no-repeat" : "unset"};
  animation: ${props => getAnimation(props.textureData.numberOfSprites)}
    ${props => props.textureData.animationSpeed}
    steps(${props => props.textureData.numberOfSprites - 1})
    ${props => (props.textureData.animated ? "infinite" : 0)};
  position: absolute;
  left: 0;
  top: 0;
`

export class Texture extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.texture !== this.props.texture
  }

  render() {
    const textureData = TEXTURE_DATA[this.props.texture]
    return (
      <div
        style={{
          position: "absolute",
          height: textureHeight,
          width: textureWidth,
          top: this.props.y * textureHeight,
          left: this.props.x * textureWidth,
          overflow: "hidden"
        }}
      >
        <Sprite
          textureData={textureData}
          onMouseDown={this.props.onMouseDown}
          onMouseUp={this.props.onMouseUp}
          onMouseEnter={this.props.onMouseHoverTexture}
          onTouchEnd={this.props.onMouseUp}
          onTouchStart={this.props.onMouseDown}
        ></Sprite>
      </div>
    )
  }
}

export default Texture
