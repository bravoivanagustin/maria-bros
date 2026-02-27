import { ASSETS } from '../utils/constants';
import type { LevelConfig } from '../types';

export const level1: LevelConfig = {
  id: 'level1',
  name: 'Mundo 1-1',
  tilemapKey: ASSETS.LEVEL1_MAP,
  tilesetKey: ASSETS.TILESET_WORLD1,
  backgroundKey: '',
  music: ASSETS.BGM_LEVEL1,
  enemies: [
    { type: 'goomba', x: 250, y: 176 },
    { type: 'goomba', x: 530, y: 176 },
  ],
  collectibles: [
    { type: 'coin', x: 80,  y: 155 },
    { type: 'coin', x: 128, y: 107 },
    { type: 'coin', x: 192, y: 75  },
    { type: 'coin', x: 288, y: 155 },
    { type: 'coin', x: 448, y: 123 },
    { type: 'coin', x: 528, y: 155 },
  ],
  // Spawn: col 2, standing on ground row 12 (top = 192px), María center = 184px
  playerSpawn: { x: 32, y: 184 },
  // Agustín al final del nivel, cerca del borde derecho
  winTrigger: { x: 590, y: 160, width: 32, height: 64 },
  timeLimit: 200,
};
