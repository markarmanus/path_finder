import { CONFIG } from "./Constants/Config"

const calculateBestTextureSize = window => {
  const height = window.screen.height - 300
  const width = window.screen.width
  const lowerValue = height > width ? width : height

  return Math.floor(lowerValue / 10)
}
const calculateMaxTextureSize = window => {
  const height = window.screen.height - 300
  const width = window.screen.width
  return Math.floor(Math.min(...[height / 4, width / 4]))
}
const calculateMinTextureSize = window => {
  const height = window.screen.height - 300
  const width = window.screen.width

  return Math.floor(Math.max(...[height / 35, width / 35]))
}
const isSide = (x, y, width, height) => {
  const left = x === 0
  const right = x === width - 1
  const top = y === 0
  const bottom = y === height - 1
  return bottom || top || right || left
}
const isTouchDevice = window => {
  return "ontouchstart" in window
}
const deviceIsTooSmall = window => {
  return (
    window.screen.height <= CONFIG.MIN_APPLICATION_HEIGHT ||
    window.screen.width <= CONFIG.MIN_APPLICATION_WIDTH
  )
}
// Calculates the texture size that will fit a certain grid width and height into the passed in container.
const getTextureSizeForMap = (gridWidth, gridHeight, container) => {
  let textureSizeBasedOnHeigh = Math.floor(container.offsetHeight / gridHeight)
  let textureSizeBasedOnWidth = Math.floor(container.offsetWidth / gridWidth)
  return Math.min(textureSizeBasedOnHeigh, textureSizeBasedOnWidth)
}

export {
  calculateMinTextureSize,
  calculateBestTextureSize,
  calculateMaxTextureSize,
  isSide,
  deviceIsTooSmall,
  getTextureSizeForMap,
  isTouchDevice
}
