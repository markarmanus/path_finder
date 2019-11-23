import { TEXTURES } from "./Constants/Textures"
import { CONFIG } from "./Constants/Config"
const costToGoal = (from, to) => {
  let dx = to[0] - from[0]
  let dy = to[1] - from[1]
  let distance = Math.sqrt(dx * dx + dy * dy)
  return distance * 100
}
const getActionType = action => {
  return action[0] + action[1] === 0 || Math.abs(action[0] + action[1]) === 2
    ? "diagonal"
    : "cardinal"
}
const isLegalAction = (x, y, action, state) => {
  const destinationPos = { x: x + action[0], y: y + action[1] }
  const actionType = getActionType(action)
  if (isOutOfBoundaries(destinationPos, state.gridWidth, state.gridHeight)) return false
  const isDestinationWall =
    state.texturesMap[destinationPos.y * state.gridWidth + destinationPos.x] === TEXTURES.WALL
  if (actionType === "diagonal") {
    const isHorizontalWall =
      state.texturesMap[y * state.gridWidth + destinationPos.x] === TEXTURES.WALL
    const isVerticalWall =
      state.texturesMap[destinationPos.y * state.gridWidth + x] === TEXTURES.WALL

    return !(isHorizontalWall || isVerticalWall || isDestinationWall)
  } else {
    return !isDestinationWall
  }
}
const addToOpen = (nodeToAdd, open) => {
  let added = false
  // check if its already in the open list.
  first: for (let index = 0; index < open.length; index++) {
    let node = open[index]
    if (nodeToAdd.x === node.x && nodeToAdd.y === node.y && nodeToAdd.g >= node.g) {
      added = true
      break first
    }
  }
  // if its not already in the open list add where it belongs based on the f value.
  if (!added) {
    const nodeToAddF = nodeToAdd.g + nodeToAdd.h
    // keep going until the f value is more than or qrual to the one in the open list and that where you add the node.
    main: for (let index = 0; index < open.length; index++) {
      const node = open[index]
      const nodeF = node.g + node.h
      if (nodeToAddF >= nodeF) {
        added = true
        open.splice(index, 0, nodeToAdd)
        break main
      }
    }
  }
  // if was not added because it the smallest f then add it to the end..
  if (!added) {
    open.push(nodeToAdd)
  }
}

const getPath = node => {
  let action = node.action
  let parent = node.parent
  while (parent !== null && parent.action !== null) {
    action = parent.action
    parent = parent.parent
  }

  return action
}
const isOutOfBoundaries = (position, gridWidth, gridHeight) => {
  return position.x < 0 || position.y < 0 || position.x >= gridWidth || position.y >= gridHeight
}
const getNextAction = (state, characterType) => {
  let start =
    characterType === CONFIG.PLAYER ? state.currentPlayerLocation : state.currentThiefLocation
  let goal = characterType === CONFIG.PLAYER ? state.currentThiefLocation : [5, 5]
  let path = []
  let actions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1]
  ]
  let actionsCost = [100, 100, 100, 100, 144, 141, 141, 141]
  let closed = new Array(state.gridWidth * state.gridHeight).fill(false)
  let open = []
  open.push(new Node(start[0], start[1], null, null, 0, costToGoal(start, goal)))
  let searchInProgress = true
  while (searchInProgress) {
    if (open.length === 0) {
      searchInProgress = false
      return [0, 0]
    }
    //edge case when start is the goal.
    if (start[0] === goal[0] && start[1] === goal[1]) {
      searchInProgress = false
      return [0, 0]
    }
    let node = open.pop()
    if (node.x === goal[0] && node.y === goal[1]) {
      return getPath(node)
    }

    // checks if node in closed, where closed is an array with true false values for any state at x,y by accessing index at y * the with + x
    if (closed[node.y * state.gridWidth + node.x]) {
      continue
    }

    closed[node.y * state.gridWidth + node.x] = true
    actions.forEach((action, index) => {
      if (isLegalAction(node.x, node.y, action, state)) {
        const newLocation = { x: node.x + action[0], y: node.y + action[1] }
        const g = node.g + actionsCost[index]
        const h = costToGoal([newLocation.x, newLocation.y], goal)
        const newNode = new Node(newLocation.x, newLocation.y, node, action, g, h)
        addToOpen(newNode, open)
      }
    })
  }
}

class Node {
  constructor(x, y, parent, action, g, h) {
    this.x = x
    this.y = y
    this.action = action
    this.parent = parent
    this.g = g
    this.h = h
  }
}
export default getNextAction
