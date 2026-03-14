export const ASSETS = {
  PLAYER: 'maria',
  PRINCESS: 'agustin',
  ENEMY_GOOMBA: 'goomba',
  ENEMY_FISH: 'fish-enemy',
  COIN: 'coin',
  TILESET_WORLD1: 'tileset-world1',
  LEVEL1_MAP: 'level1-map',
  BGM_LEVEL1: 'bgm-level1',
  BGM_MENU: 'bgm-menu',
  SFX_JUMP: 'sfx-jump',
  SFX_COIN: 'sfx-coin',
  SFX_STOMP: 'sfx-stomp',
  SFX_HURT: 'sfx-hurt',
  SFX_WIN: 'sfx-win',
  FLAG_ZONE: 'flag-zone',
  FLAG_IMAGE: 'flag-image',
  COIN_BLOCK: 'coin-block',
  BRICK_BLOCK: 'brick-block',
  BG_LEVEL1: 'bg-level1',
  LEVEL2_MAP: 'level2-map',
  LEVEL3_MAP: 'level3-map',
  // Tilesets
  TS_BLOQUES: 'ts-bloques',
  TS_NUBES: 'ts-nubes',
  TS_POSTE: 'ts-poste',
  TS_TUBO: 'ts-tubo',
  TS_MONTANAS: 'ts-montanas',
  TS_VERDE: 'ts-verde',
  TS_PALOS: 'ts-palos',
  TS_ARBOLES: 'ts-arboles',
  TS_VERDE_2: 'ts-verde-2',
  TS_AGUS: 'ts-agus',
  TS_AGUS_2: 'ts-agus-2',
  // Ending scene
  MARIA_QUIETA: 'maria-quieta',
  MARIA_BESO: 'maria-beso',
  AGUS_BESO: 'agus-beso',
} as const;

export const EVENTS = {
  PLAYER_DIED: 'player-died',
  PLAYER_JUMPED: 'player-jumped',
  PLAYER_RESPAWN: 'player-respawn',
  COIN_COLLECTED: 'coin-collected',
  ENEMY_DIED: 'enemy-died',
  LEVEL_WIN: 'level-win',
  GAME_OVER: 'game-over',
  SCORE_CHANGED: 'score-changed',
  LIVES_CHANGED: 'lives-changed',
  TIME_CHANGED: 'time-changed',
  FLAG_BONUS: 'flag-bonus',
} as const;

export const ANIMS = {
  MARIA_IDLE: 'maria-idle',
  MARIA_WALK: 'maria-walk',
  MARIA_JUMP: 'maria-jump',
  MARIA_DEATH: 'maria-death',
  GOOMBA_WALK: 'goomba-walk',
  GOOMBA_DEAD: 'goomba-dead',
  COIN_SPIN: 'coin-spin',
  AGUSTIN_IDLE: 'agustin-idle',
  COIN_BLOCK_SPIN: 'coinblock-spin',
} as const;

export const SCENES = {
  BOOT: 'BootScene',
  PRELOAD: 'PreloadScene',
  MENU: 'MenuScene',
  GAME: 'GameScene',
  WIN: 'WinScene',
  GAME_OVER: 'GameOverScene',
  TRANSITION: 'TransitionScene',
  ENDING: 'EndingScene',
} as const;

export const PHYSICS = {
  GRAVITY: 1400,
  PLAYER_SPEED: 160,
  JUMP_VELOCITY: -500,
  ENEMY_SPEED: 60,
} as const;

export const GAME = {
  WIDTH: 384,
  HEIGHT: 216,
  TILE_SIZE: 16,
  MAX_LIVES: 3,
} as const;

export const FONTS = {
  PIXEL: '"Press Start 2P", monospace',
} as const;

export const FLAG = {
  POLE_WIDTH: 4,
  POLE_HEIGHT: 160,
  FLAG_WIDTH: 12,
  FLAG_HEIGHT: 10,
  // Puntos según altura — cuanto más arriba, más puntos (como Mario original)
  BONUS_TOP: 5000,
  BONUS_HIGH: 2000,
  BONUS_MID: 800,
  BONUS_LOW: 400,
  BONUS_BOTTOM: 100,
} as const;
