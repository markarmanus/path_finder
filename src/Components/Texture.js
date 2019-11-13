import React, { Component } from "react"
import { TEXTURES } from "../Constants/Textures"
import { CONFIG } from "../Constants/Config"
import styled from "styled-components"

// const Texture = props => {
//   return <div></div>
// }

// export default React.memo(Texture)
// console.log(props.src)
let textureWidth = window.innerWidth / CONFIG.GRID_WIDTH
let textureHeight = window.innerHeight / CONFIG.GRID_HEIGHT
let TextureImage = styled.img`
  width: ${textureWidth}px;
  height: ${textureHeight}px;
  position: absolute;
  top: ${props => props.y * textureHeight}px;
  left: ${props => props.x * textureWidth}px;
`

export class Texture extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.src !== this.props.src) return true
  }
  render() {
    return (
      <div>
        <TextureImage
          onClick={this.props.onClick}
          src={this.props.src}
          x={this.props.x}
          y={this.props.y}
        ></TextureImage>
      </div>
    )
  }
}

export default Texture
