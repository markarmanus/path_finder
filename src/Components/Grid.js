import React, { useState } from "react"
import styled from "styled-components"
import Texture from "./Texture"
import { TEXTURES } from "../Constants/Textures"
import { CONFIG } from "../Constants/Config"

export default function Grid() {
  let [selectedTexture, setSelectedTexture] = useState(TEXTURES.LAVA)

  let [texturesMap, setTexturesMap] = useState(
    new Array(CONFIG.GRID_WIDTH * CONFIG.GRID_HEIGHT).fill(TEXTURES.OBSIDIAN)
  )

  const onGridClick = (x, y) => {
    let temp = texturesMap.slice()
    temp[y * CONFIG.GRID_WIDTH + x] = selectedTexture
    setTexturesMap(temp)
  }
  const getTextureImage = texture => {
    switch (texture) {
      case TEXTURES.OBSIDIAN:
        return "obsidian.png"
      case TEXTURES.LAVA:
        return "lava.jpg"
    }
  }
  let renderGrid = () => {
    let temp = []
    for (let y = 0; y < CONFIG.GRID_HEIGHT; y++) {
      for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
        temp.push(
          <Texture
            x={x}
            y={y}
            key={y * CONFIG.GRID_WIDTH + x}
            onClick={() => onGridClick(x, y)}
            src={getTextureImage(texturesMap[y * CONFIG.GRID_WIDTH + x])}
          ></Texture>
        )
      }
    }
    return temp
  }
  return <div>{renderGrid()}</div>
}
