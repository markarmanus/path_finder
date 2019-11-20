export const TEXTURES = {
  OBSIDIAN: 1,
  LAVA: 2,
  PLAYER_RUNNING: 3,
  PLAYER_IDLE: 4,
  PLAYER_UP: 5,
  PLAYER_DOWN: 6
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
    src: "lava.png"
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
    animated: false,
    spriteWidth: "32px",
    spriteHeight: "32px",
    numberOfSprites: 4,
    src: "Character_Down.png"
  }
}
