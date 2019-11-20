import React, { Component } from "react"
import styled from "styled-components"
import Texture from "./Texture"
import { TEXTURES } from "../Constants/Textures"
import { CONFIG } from "../Constants/Config"

export class Grid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTexture: TEXTURES.OBSIDIAN,
      mouseDown: false
    }
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseHoverTexture = this.onMouseHoverTexture.bind(this)
  }
  onMouseDown(x, y) {
    this.setState({ mouseDown: true }, () => this.onMouseHoverTexture(x, y))
  }
  onMouseUp() {
    this.setState({ mouseDown: false })
  }
  onMouseHoverTexture(x, y) {
    if (this.state.mouseDown) {
      let temp = this.state.texturesMap.slice()
      temp[y * CONFIG.GRID_WIDTH + x] = this.state.selectedTexture
      this.setState({ texturesMap: temp })
    }
  }
  componentWillUpdate(nextProps) {
    let gridWidth = Math.floor(
      this.container.offsetWidth / nextProps.textureSize
    )
    let gridHeight = Math.floor(
      this.container.offsetHeight / nextProps.textureSize
    )
    let xOffset = (this.container.offsetWidth % nextProps.textureSize) / 2
    let yOffset = (this.container.offsetHeight % nextProps.textureSize) / 2

    return {
      texturesMap: new Array(gridWidth * gridHeight).fill(TEXTURES.OBSIDIAN),
      gridWidth,
      gridHeight,
      xOffset,
      yOffset
    }
  }
  componentDidMount() {
    this.forceUpdate()
  }
  render() {
    let gridWidth = 0
    let gridHeight = 0
    let texturesToRender = []
    let xOffset = 0
    let yOffset = 0
    if (this.container !== undefined) {
      gridWidth = Math.floor(
        this.container.offsetWidth / this.props.textureSize
      )
      gridHeight = Math.floor(
        this.container.offsetHeight / this.props.textureSize
      )
      xOffset = (this.container.offsetWidth % this.props.textureSize) / 2
      yOffset = (this.container.offsetHeight % this.props.textureSize) / 2
      texturesToRender = new Array(gridWidth * gridHeight).fill(
        TEXTURES.PLAYER_RUNNING
      )
    }
    console.log(texturesToRender)
    return (
      <div
        style={{ flex: "1", position: "relative" }}
        ref={el => (this.container = el)}
      >
        {texturesToRender.map((texture, index) => {
          const x = index % gridWidth
          const y = Math.floor(index / gridWidth)
          return (
            <Texture
              x={x}
              y={y}
              key={index}
              onMouseHoverTexture={() => this.onMouseHoverTexture(x, y)}
              textureSize={this.props.textureSize}
              onMouseDown={() => this.onMouseDown(x, y)}
              onMouseUp={this.onMouseUp}
              xOffset={xOffset}
              yOffset={yOffset}
              texture={texture}
            ></Texture>
          )
        })}
      </div>
    )
  }
}

export default Grid

// export default function Grid() {
//   const [selectedTexture, setSelectedTexture] = useState(TEXTURES.LAVA)
//   const [mouseDown, setMouseDown] = useState(false)
//   const [texturesMap, setTexturesMap] = useState(
//     new Array(CONFIG.GRID_WIDTH * CONFIG.GRID_HEIGHT).fill(TEXTURES.OBSIDIAN)
//   )

//   const onMouseDown = () => {
//     console.log("down")
//     setMouseDown(() => true)
//   }
//   const onMouseUp = () => {
//     console.log("up")

//     setMouseDown(() => false)
//   }
//   const onMouseHoverTexture = (x, y) => {
//     console.log(mouseDown)
//     if (mouseDown) {
//       setTexturesMap(prev => {
//         let temp = prev.slice()
//         temp[y * CONFIG.GRID_WIDTH + x] = selectedTexture
//         return temp
//       })
//     }
//   }
//   const getTextureImage = texture => {
//     switch (texture) {
//       case TEXTURES.OBSIDIAN:
//         return "obsidian.png"
//       case TEXTURES.LAVA:
//         return "lava.jpg"
//     }
//   }

//   return (
//     <div>
//       {texturesMap.map((texture, index) => {
//         const x = index % CONFIG.GRID_WIDTH
//         const y = Math.floor(index / CONFIG.GRID_WIDTH)
//         return (
//           <Texture
//             x={x}
//             y={y}
//             key={index}
//             onMouseHoverTexture={() => onMouseHoverTexture(x, y)}
//             onMouseDown={onMouseDown}
//             onMouseUp={onMouseUp}
//             src={getTextureImage(texture)}
//           ></Texture>
//         )
//       })}
//     </div>
//   )
// }
