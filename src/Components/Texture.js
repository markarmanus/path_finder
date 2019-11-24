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
  background-repeat: ${props => (props.textureData.animated ? "no-repeat" : "unset")};
  animation: ${props => getAnimation(props.textureData.numberOfSprites)}
    ${props => props.textureData.animationSpeed}
    steps(${props => props.textureData.numberOfSprites - 1})
    ${props => (props.textureData.animated ? "infinite" : 0)};
  position: absolute;
  user-select: none;

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
      nextProps.textureSize !== this.props.textureSize ||
      nextProps.x !== this.props.x ||
      nextProps.y !== this.props.y ||
      nextProps.xOffset !== this.props.xOffset ||
      nextProps.yOffset !== this.props.yOffset
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
      onMouseHoverTextureEnter,
      onMouseHoverTextureLeave,
      texture,
      zIndex,
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
          zIndex: zIndex,
          overflow: "hidden",
          userSelect: "none"
        }}
      >
        {texture === null ? null : (
          <Sprite
            textureData={textureData}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseEnter={onMouseHoverTextureEnter}
            onMouseLeave={onMouseHoverTextureLeave}
            onTouchEnd={onMouseUp}
            onTouchStart={onMouseDown}
          ></Sprite>
        )}
      </div>
    )
  }
}

export default Texture
