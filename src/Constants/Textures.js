export const TEXTURES = {
  OBSIDIAN: 1,
  LAVA: 2,
  PLAYER_RUNNING: 3,
  PLAYER_IDLE: 4,
  PLAYER_UP: 5,
  PLAYER_DOWN: 6,
  THIEF_IDLE: 7,
  THIEF_UP: 8,
  THIEF_DOWN: 9,
  THIEF_RUNNING: 10,
  WALL: 11,
  HEALTH_PACK: 12,
  TRANSPARENT: 13
}
export const TEXTURE_DATA = {
  1: {
    animationSpeed: null,
    animated: false,
    spriteWidth: "100px",
    spriteHeight: "100px",
    numberOfSprites: 1,
    src: "obsidian.png"
  },
  2: {
    animationSpeed: null,
    animated: false,
    spriteWidth: "100px",
    spriteHeight: "100px",
    numberOfSprites: 1,
    src: "lava.jpg"
  },
  3: {
    animationSpeed: "0.3s",
    animated: true,
    spriteWidth: "32px",
    spriteHeight: "32px",
    numberOfSprites: 4,
    src: "Character_Right.png"
  },
  4: {
    animationSpeed: null,
    animated: false,
    spriteWidth: "32px",
    spriteHeight: "32px",
    numberOfSprites: 1,
    src: "Character_Idle.png"
  },
  5: {
    animationSpeed: "0.5s",
    animated: true,
    spriteWidth: "32px",
    spriteHeight: "32px",
    numberOfSprites: 4,
    src: "Character_Up.png"
  },
  6: {
    animationSpeed: "0.5s",
    animated: true,
    spriteWidth: "32px",
    spriteHeight: "32px",
    numberOfSprites: 4,
    src: "Character_Down.png"
  },
  7: {
    animationSpeed: null,
    animated: false,
    spriteWidth: "32px",
    spriteHeight: "32px",
    numberOfSprites: 1,
    src: "Character_Idle.png"
  },
  8: {
    animationSpeed: "0.5s",
    animated: true,
    spriteWidth: "32px",
    spriteHeight: "32px",
    numberOfSprites: 4,
    src: "Character_Up.png"
  },
  9: {
    animationSpeed: "0.5s",
    animated: true,
    spriteWidth: "32px",
    spriteHeight: "32px",
    numberOfSprites: 4,
    src: "Character_Down.png"
  },
  10: {
    animationSpeed: "0.3s",
    animated: true,
    spriteWidth: "32px",
    spriteHeight: "32px",
    numberOfSprites: 4,
    src: "Character_Right.png"
  },
  11: {
    animationSpeed: null,
    animated: false,
    spriteWidth: "10px",
    spriteHeight: "10px",
    numberOfSprites: 1,
    src: "wall.png"
  },
  12: {
    animationSpeed: "0.3s",
    animated: true,
    spriteWidth: "10px",
    spriteHeight: "10px",
    numberOfSprites: 4,
    src: "Character_Right.png"
  },
  13: {
    animationSpeed: null,
    animated: false,
    spriteWidth: "10px",
    spriteHeight: "10px",
    numberOfSprites: 1,
    src: "Transparent.png"
  }
}
