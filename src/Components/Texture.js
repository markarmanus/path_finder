import React, { Component, useState } from "react"
import { TEXTURES, TEXTURE_DATA } from "../Constants/Textures"
import { CONFIG } from "../Constants/Config"
import styled, { keyframes } from "styled-components"

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
    return (
      nextProps.texture !== this.props.texture ||
      nextProps.textureSize !== this.props.textureSize
    )
  }

  render() {
    const {
      yOffset,
      xOffset,
      y,
      x,
      onMouseDown,
      onMouseUp,
      onMouseHoverTexture,
      texture,
      textureSize
    } = this.props
    const textureData = TEXTURE_DATA[texture]

    return (
      <div
        style={{
          position: "absolute",
          height: textureSize + "px",
          width: textureSize + "px",
          top: yOffset ? y * textureSize + yOffset : y * textureSize,
          left: xOffset ? x * textureSize + xOffset : x * textureSize,
          overflow: "hidden"
        }}
      >
        <Sprite
          textureData={textureData}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseEnter={onMouseHoverTexture}
          onTouchEnd={onMouseUp}
          onTouchStart={onMouseDown}
        ></Sprite>
      </div>
    )
  }
}

export default Texture
