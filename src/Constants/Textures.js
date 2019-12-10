export const TEXTURES = {
  FIRE: 2,
  CHICKEN_RUNNING: 3,
  CHICKEN_IDLE: 4,
  CHICKEN_UP: 5,
  CHICKEN_DOWN: 6,
  PLAYER_IDLE: 7,
  PLAYER_UP: 8,
  PLAYER_DOWN: 9,
  PLAYER_RUNNING: 10,
  WALL: 11,
  HEALTH_PACK: 12,
  TRANSPARENT: 13,
  FLOOR_BOTTOM: 14,
  FLOOR_TOP: 15,
  FLOOR_RIGHT: 16,
  FLOOR_LEFT: 17,
  FLOOR_TOP_LEFT: 18,
  FLOOR_TOP_RIGHT: 19,
  FLOOR_BOTTOM_RIGHT: 20,
  FLOOR_BOTTOM_LEFT: 21,
  FLOOR: 22
}
export const TEXTURE_DATA = {
  2: {
    animationSpeed: "0.3s",
    animated: true,
    numberOfSprites: 4,
    src: "campFire.png",
    icon: "campFireIcon.png"
  },
  3: {
    animationSpeed: "0.3s",
    animated: true,
    numberOfSprites: 3,
    src: "ChickenRight.png"
  },
  4: {
    animationSpeed: null,
    animated: false,
    numberOfSprites: 1,
    src: "ChickenIdle.png"
  },
  5: {
    animationSpeed: "0.3s",
    animated: true,
    numberOfSprites: 3,
    src: "ChickenUp.png"
  },
  6: {
    animationSpeed: "0.3s",
    animated: true,
    numberOfSprites: 3,
    src: "ChickenDown.png"
  },
  7: {
    animationSpeed: null,
    animated: false,
    numberOfSprites: 1,
    src: "PlayerIdle.png"
  },
  8: {
    animationSpeed: "0.3s",
    animated: true,
    numberOfSprites: 4,
    src: "PlayerUp.png"
  },
  9: {
    animationSpeed: "0.3s",
    animated: true,
    numberOfSprites: 4,
    src: "PlayerDown.png"
  },
  10: {
    animationSpeed: "0.3s",
    animated: true,
    numberOfSprites: 4,
    src: "PlayerRight.png"
  },
  11: {
    animationSpeed: null,
    animated: false,
    numberOfSprites: 1,
    src: "Rock.png",
    icon: "Rock_Icon.png"
  },
  12: {
    animationSpeed: "1s",
    animated: true,
    numberOfSprites: 3,
    src: "Health_Pack.png",
    icon: "Health_Icon.png"
  },
  13: {
    animationSpeed: null,
    animated: false,
    numberOfSprites: 1,
    src: "Transparent.png"
  },
  14: {
    animationSpeed: null,
    animated: false,
    numberOfSprites: 1,
    src: "Floor_Bottom.png"
  },
  15: {
    animationSpeed: null,
    animated: false,
    numberOfSprites: 1,
    src: "Floor_Top.png"
  },
  16: {
    animationSpeed: null,
    animated: false,
    numberOfSprites: 1,
    src: "Floor_Right.png"
  },
  17: {
    animationSpeed: null,
    animated: false,
    numberOfSprites: 1,
    src: "Floor_Left.png"
  },
  18: {
    animationSpeed: null,
    animated: false,
    numberOfSprites: 1,
    src: "Floor_Top_Left.png"
  },
  19: {
    animationSpeed: null,
    animated: false,
    numberOfSprites: 1,
    src: "Floor_Top_Right.png"
  },
  20: {
    animationSpeed: null,
    animated: false,
    numberOfSprites: 1,
    src: "Floor_Bottom_Right.png"
  },
  21: {
    animationSpeed: null,
    animated: false,
    numberOfSprites: 1,
    src: "Floor_Bottom_Left.png"
  },
  22: {
    animationSpeed: null,
    animated: false,
    numberOfSprites: 1,
    src: ["Floor_1.png", "Floor_2.png", "Floor_3.png", "Floor_1.png"],
    icon: "Floor_1.png"
  }
}
