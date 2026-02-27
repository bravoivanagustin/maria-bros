export const ASSETS = {
  PLAYER: 'maria',
  PRINCESS: 'agustin',
  ENEMY_GOOMBA: 'goomba',
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
} as const;

export const SCENES = {
  BOOT: 'BootScene',
  PRELOAD: 'PreloadScene',
  MENU: 'MenuScene',
  GAME: 'GameScene',
  WIN: 'WinScene',
  GAME_OVER: 'GameOverScene',
  TRANSITION: 'TransitionScene',
} as const;

export const PHYSICS = {
  GRAVITY: 800,
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
