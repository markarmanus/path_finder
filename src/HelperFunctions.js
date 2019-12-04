const calculateBestTextureSize = window => {
  const height = window.screen.height - 300
  const width = window.screen.width
  const lowerValue = height > width ? width : height

  return lowerValue / 10
}
const calculateMaxTextureSize = window => {
  const height = window.screen.height - 300
  const width = window.screen.width
  return Math.floor(Math.min(...[height / 4, width / 4]))
}
const calculateMinTextureSize = window => {
  const height = window.screen.height - 300
  const width = window.screen.width

  return Math.floor(Math.max(...[height / 50, width / 50]))
}
const isSide = (x, y, width, height) => {
  const left = x === 0
  const right = x === width - 1
  const top = y === 0
  const bottom = y === height - 1
  return bottom || top || right || left
}

export { calculateMinTextureSize, calculateBestTextureSize, calculateMaxTextureSize, isSide }
