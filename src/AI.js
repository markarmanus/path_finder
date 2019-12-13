import { TEXTURES } from "./Constants/Textures"
import { CONSTANTS } from "./Constants/Constants"
import { CONFIG } from "./Constants/Config"
// calculates the cost between two locations.
const costToLocation = (from, to) => {
  let dx = to[0] - from[0]
  let dy = to[1] - from[1]
  let distance = Math.sqrt(dx * dx + dy * dy)
  return distance * 100
}

const isLegalAction = (x, y, action, state) => {
  const destinationPos = { x: x + action[0], y: y + action[1] }
  const destinationIndex = destinationPos.y * state.gridWidth + destinationPos.x
  if (isOutOfBoundaries(destinationPos, state.gridWidth, state.gridHeight)) return false
  const isDestinationWall = state.texturesMap[destinationIndex] === TEXTURES.WALL
  return !isDestinationWall
}
// Adds a node to the open list (priority Queue implementation)
const addToOpen = (nodeToAdd, open) => {
  let added = false
  // check if its already in the open list.
  for (let index = 0; index < open.length; index++) {
    let node = open[index]
    if (
      nodeToAdd.x === node.x &&
      nodeToAdd.y === node.y &&
      nodeToAdd.g >= node.g &&
      nodeToAdd.health <= node.health
    ) {
      added = true
      break
    }
  }
  // if its not already in the open list add where it belongs based on the f value.
  if (!added) {
    const nodeToAddF = nodeToAdd.g + nodeToAdd.h
    // keep going until the f value is more than or equal to the one in the open list and that where you add the node.
    for (let index = 0; index < open.length; index++) {
      const node = open[index]
      const nodeF = node.g + node.h
      if (nodeToAddF >= nodeF) {
        added = true
        open.splice(index, 0, nodeToAdd)
        break
      }
    }
  }
  // if was not added because it the smallest f then add it to the end..
  if (!added) {
    open.push(nodeToAdd)
  }
}

// return the path from the node passed.
const getPath = node => {
  let action = node.action
  let parent = node.parent
  // keep going backwards until you reach the start
  while (parent !== null && parent.action !== null) {
    action = parent.action
    parent = parent.parent
  }

  return action
}
// Detects wether 2 locations are one move apart from each other.
const isOneMoveApart = (firstLocation, secondLocation) => {
  const isCloseOnX =
    Math.abs(firstLocation[0] - secondLocation[0]) === 1 && firstLocation[1] === secondLocation[1]
  const isCloseOnY =
    Math.abs(firstLocation[1] - secondLocation[1]) === 1 && firstLocation[0] === secondLocation[0]
  const isSameLocation =
    firstLocation[0] === secondLocation[0] && firstLocation[1] === secondLocation[1]
  return isCloseOnX || isCloseOnY || isSameLocation
}
// Uses BFS to generate all paths that the chicken can reach
const calculateChickenConnectedPaths = (state, props, actions) => {
  let connected = new Array(state.gridHeight * state.gridWidth).fill(false)
  let closed = new Array(state.gridHeight * state.gridWidth).fill(false)
  let open = []
  let chickenLocation = state.currentChickenLocation
  open.push(chickenLocation)
  while (true) {
    if (open.length === 0) {
      return connected
    }
    let location = open.shift()
    const index = location[1] * state.gridWidth + location[0]
    if (closed[index]) {
      continue
    }
    closed[index] = true
    connected[index] = true
    actions.forEach(action => {
      if (isLegalAction(location[0], location[1], action, state)) {
        const newLocation = [location[0] + action[0], location[1] + action[1]]
        if (!isOneMoveApart(newLocation, state.currentPlayerLocation)) {
          open.push(newLocation)
        }
      }
    })
  }
}
// function to use for debugging an array values on the screen
const debug = (array, state, props, printValue) => {
  array.forEach((value, index) => {
    const y = Math.floor(index / state.gridWidth)
    const x = Math.floor(index % state.gridWidth)
    if (value) {
      let div = document.createElement("div")
      div.style.position = "absolute"
      div.style.top = state.yOffset
        ? y * props.textureSize + state.yOffset + "px"
        : y * props.textureSize + "px"
      div.style.left = state.xOffset
        ? x * props.textureSize + state.xOffset + "px"
        : x * props.textureSize + "px"
      div.style.zIndex = "4"
      div.style.height = props.textureSize + "px"
      div.style.width = props.textureSize + "px"
      div.style.border = CONFIG.EDITING_BORDER

      if (printValue) {
        let h3 = document.createElement("h3")
        h3.innerText = value
        div.appendChild(h3)
      }
      document.body.appendChild(div)
    }
  })
}
// Calculates the furthest point from the player that is withing the chicken reach by using UCS
const FurthestPointFromPlayer = (state, props, actions) => {
  let connected = calculateChickenConnectedPaths(state, props, actions)
  let open = []
  let playerLocation = state.currentPlayerLocation
  open.push(
    new Node(playerLocation[0], playerLocation[1], state.currentPlayerHealth, null, null, 0, 0)
  )
  let closed = new Array(state.gridHeight * state.gridWidth).fill(false)
  let values = new Array(state.gridWidth * state.gridHeight).fill(0)
  while (true) {
    if (open.length === 0) {
      // return the location with the highest value.
      let index = values.indexOf(Math.max(...values))
      let y = Math.floor(index / state.gridWidth)
      let x = Math.floor(index % state.gridWidth)
      return [x, y]
    }
    let node = open.pop()
    const index = node.y * state.gridWidth + node.x

    if (closed[index]) {
      continue
    }

    closed[index] = true
    values[index] = node.g

    actions.forEach(action => {
      if (isLegalAction(node.x, node.y, action, state)) {
        const newLocation = [node.x + action[0], node.y + action[1]]
        const index = newLocation[1] * state.gridWidth + newLocation[0]
        // if its within reach of the chicken or this is the starting node. (player node is where we started the search)
        if (
          connected[index] ||
          (node.x === state.currentPlayerLocation[0] && node.y === state.currentPlayerLocation[1])
        ) {
          const isFire = state.texturesMap[index] === TEXTURES.FIRE
          // remove cost if this is fire to amount for the +100 of damage to the player.
          let newCost = isFire ? node.g : node.g + 100
          const newHealth = isFire ? node.health - 1 : node.health
          // if there is a place where the player has to die add as extremely high value.
          if (newHealth <= 0) newCost += 100000000
          let newNode = new Node(
            newLocation[0],
            newLocation[1],
            newHealth,
            node,
            action,
            newCost,
            0
          )
          addToOpen(newNode, open)
        }
      }
    })
  }
}
const isOutOfBoundaries = (position, gridWidth, gridHeight) => {
  return (
    position.x < 1 || position.y < 1 || position.x >= gridWidth - 1 || position.y >= gridHeight - 1
  )
}
// Calculates the optimal path using A* to the furthest point from the player
const getNextChickenAction = (actions, state, props) => {
  if (props.chickenSpeed === 0) return [0, 0]
  const start = state.currentChickenLocation
  // if we are on fire and the player is at 1 health just stay still.
  if (
    state.texturesMap[start[1] * state.gridWidth + start[0]] === TEXTURES.FIRE &&
    state.currentPlayerHealth === 1
  )
    return [0, 0]
  const goal = FurthestPointFromPlayer(state, props, actions)
  if (start[0] === goal[0] && start[1] === goal[1]) {
    return [0, 0]
  }

  let closed = new Array(state.gridHeight * state.gridWidth).fill(false)
  let open = []
  open.push(new Node(start[0], start[1], 0, null, null, 0, costToLocation(start, goal)))
  while (true) {
    if (open.length === 0) {
      return [0, 0]
    }
    let node = open.pop()
    const index = node.y * state.gridWidth + node.x
    if (node.x === goal[0] && node.y === goal[1]) {
      return getPath(node)
    }
    if (closed[index]) {
      continue
    }
    closed[index] = true
    actions.forEach(action => {
      if (isLegalAction(node.x, node.y, action, state)) {
        const newLocation = [node.x + action[0], node.y + action[1]]
        if (!isOneMoveApart(newLocation, state.currentPlayerLocation)) {
          const index = newLocation[1] * state.gridWidth + newLocation[0]
          // if we can take a path with fire, prioritize it, also prioritize even more picking up health packs.
          const g =
            state.texturesMap[index] === TEXTURES.FIRE
              ? node.g - 500
              : state.overLayMap[index] === TEXTURES.HEALTH_PACK
              ? node.g - 1000
              : node.g + 100

          const h = costToLocation(newLocation, goal)
          const newNode = new Node(newLocation[0], newLocation[1], 0, node, action, g, h)
          addToOpen(newNode, open)
        }
      }
    })
  }
}

const getNextAction = (state, props, characterType) => {
  let actions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ]

  if (characterType === CONSTANTS.CHICKEN) return getNextChickenAction(actions, state, props)
  let start = state.currentPlayerLocation
  let goal = state.currentChickenLocation
  let foundPath = false
  let bestPathNode = null
  let bestPathFoundHealth = 0
  //edge case when start is the goal.
  if (start[0] === goal[0] && start[1] === goal[1]) {
    return [0, 0]
  }

  let actionsCost = [100, 100, 100, 100]
  // closed for each location with each possible health value.
  let closed = [...new Array(state.gridWidth * state.gridHeight)].map(() =>
    new Array(props.playerMaxHealth).fill(false)
  )

  let open = []
  open.push(
    new Node(
      start[0],
      start[1],
      state.currentPlayerHealth,
      null,
      null,
      0,
      costToLocation(start, goal)
    )
  )
  while (true) {
    if (open.length === 0) {
      if (foundPath) {
        return getPath(bestPathNode)
      }
      return [0, 0]
    }

    let node = open.pop()
    let index = node.y * state.gridWidth + node.x
    if (node.x === goal[0] && node.y === goal[1] && node.health > 0) {
      // if we prioritize speed or this is a path where we wont lose health return immediately.
      if (node.health === props.playerMaxHealth || props.searchPriority === CONSTANTS.SPEED) {
        return getPath(node)
      } else if (node.health > bestPathFoundHealth) {
        // keep a record of the best path that has highest health.
        foundPath = true
        bestPathFoundHealth = node.health
        bestPathNode = node
      }
    }

    if (closed[index][node.health - 1]) {
      continue
    }

    closed[index][node.health - 1] = true
    if (node.health <= 0) continue
    actions.forEach((action, index) => {
      if (isLegalAction(node.x, node.y, action, state)) {
        const newLocation = { x: node.x + action[0], y: node.y + action[1] }
        const newLocationIndex = newLocation.y * state.gridWidth + newLocation.x
        let g = node.g + actionsCost[index]
        const h = costToLocation([newLocation.x, newLocation.y], goal)
        const healthPackOnLocation = state.overLayMap[newLocationIndex] === TEXTURES.HEALTH_PACK
        const isLava = state.texturesMap[newLocationIndex] === TEXTURES.FIRE
        const health = healthPackOnLocation
          ? props.playerMaxHealth
          : isLava
          ? node.health - 1
          : node.health
        // small addition to the g cost when fire to avoid fire when small adjustment to path is possible.
        if (isLava && !healthPackOnLocation) g += 20

        const newNode = new Node(newLocation.x, newLocation.y, health, node, action, g, h)
        addToOpen(newNode, open)
      }
    })
  }
}

class Node {
  constructor(x, y, health, parent, action, g, h) {
    this.x = x
    this.y = y
    this.health = health
    this.action = action
    this.parent = parent
    this.g = g
    this.h = h
  }
}
export { getNextAction }
