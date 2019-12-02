const calculateBestTextureSize = window => {
  const height = window.screen.height - 300
  const width = window.screen.width
  const higherValue = height > width ? height : width

  return higherValue / 20
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
export { calculateMinTextureSize, calculateBestTextureSize, calculateMaxTextureSize }
