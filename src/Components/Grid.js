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
      mouseDown: false,
      texturesMap: new Array(CONFIG.GRID_WIDTH * CONFIG.GRID_HEIGHT).fill(
        TEXTURES.OBSIDIAN
      )
    }
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseHoverTexture = this.onMouseHoverTexture.bind(this)
  }
  onMouseDown(x, y) {
    console.log("down")
    this.setState({ mouseDown: true }, () => this.onMouseHoverTexture(x, y))
  }
  onMouseUp() {
    console.log("up")
    this.setState({ mouseDown: false })
  }
  onMouseHoverTexture(x, y) {
    console.log("hover")
    if (this.state.mouseDown) {
      let temp = this.state.texturesMap.slice()
      temp[y * CONFIG.GRID_WIDTH + x] = this.state.selectedTexture
      this.setState({ texturesMap: temp })
    }
  }

  render() {
    return (
      <div>
        {this.state.texturesMap.map((texture, index) => {
          const x = index % CONFIG.GRID_WIDTH
          const y = Math.floor(index / CONFIG.GRID_WIDTH)
          return (
            <Texture
              x={x}
              y={y}
              key={index}
              onMouseHoverTexture={() => this.onMouseHoverTexture(x, y)}
              onMouseDown={() => this.onMouseDown(x, y)}
              onMouseUp={this.onMouseUp}
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
