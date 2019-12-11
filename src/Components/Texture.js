import React, { Component } from "react"
import { TEXTURE_DATA } from "../Constants/Textures"
import styled, { keyframes } from "styled-components"
import { isTouchDevice } from "../HelperFunctions"
const getTextureSrc = src => {
  if (Array.isArray(src)) {
    let random = Math.floor(Math.random() * src.length)

    return src[random]
  } else {
    return src
  }
}
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
  background-image: url(${props => getTextureSrc(props.textureData.src)});
  background-size: 100%, 100%;
  background-repeat: ${props => (props.textureData.animated ? "no-repeat" : "unset")};
  animation: ${props => getAnimation(props.textureData.numberOfSprites)}
    ${props => props.textureData.animationSpeed}
    steps(${props => props.textureData.numberOfSprites - 1})
    ${props => (props.textureData.animated ? "infinite" : 0)};
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;

  left: 0;
  top: 0;
`
const ProgressBarUnder = styled.div`
  width: 80%;
  position: relative;
  background-color: #661918;
  margin: auto;
  border-radius: 10px;
  height: ${props => props.textureSize * 0.1}px;
  overflow: hidden;
`
const ProgressBarOver = styled.div`
  width: 100%;
  position: relative;
  background-color: #e03836;
  margin: auto;
  border-radius: 10px;
  transition: right 0.5s;
  right: ${props => 100 - props.healthBarPercentage}%;
  height: ${props => props.textureSize * 0.1}px;
`
export class Texture extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mouseOver: false
    }
  }
  setMouseOver(value) {
    if (this.state.mouseOver !== value) this.setState({ mouseOver: value })
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.texture !== this.props.texture ||
      nextProps.textureSize !== this.props.textureSize ||
      nextProps.x !== this.props.x ||
      nextProps.y !== this.props.y ||
      nextProps.xOffset !== this.props.xOffset ||
      nextProps.yOffset !== this.props.yOffset ||
      nextProps.healthBarPercentage !== this.props.healthBarPercentage ||
      nextState !== this.state
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
      selectedEditTexture,
      zIndex,
      textureSize,
      editing,
      healthBarPercentage
    } = this.props
    const textureData = TEXTURE_DATA[texture]
    const selectedEditTextureData = TEXTURE_DATA[selectedEditTexture]
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
        {healthBarPercentage !== undefined ? (
          <ProgressBarUnder textureSize={textureSize}>
            <ProgressBarOver
              healthBarPercentage={healthBarPercentage}
              textureSize={textureSize}
            ></ProgressBarOver>
          </ProgressBarUnder>
        ) : null}
        <Sprite
          onMouseOut={e => {
            if (onMouseHoverTextureLeave) onMouseHoverTextureLeave(this, e)
          }}
          onMouseUp={onMouseUp}
          onTouchEnd={onMouseUp}
          onTouchStart={onMouseDown}
          textureData={this.state.mouseOver && editing ? selectedEditTextureData : textureData}
          onTouchMove={e => {
            if (onMouseHoverTextureEnter) onMouseHoverTextureEnter(this, e)
          }}
        >
          <div
            style={{ width: "85%", height: "85%" }}
            onMouseDown={e => {
              if (!isTouchDevice(window)) onMouseDown(e)
            }}
            onMouseOver={e => {
              if (onMouseHoverTextureEnter && !isTouchDevice(window))
                onMouseHoverTextureEnter(this, e)
            }}
          ></div>
        </Sprite>
      </div>
    )
  }
}

export default Texture
