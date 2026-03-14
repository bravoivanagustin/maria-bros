import { ASSETS } from '../utils/constants';
import type { LevelConfig } from '../types';

export const level3: LevelConfig = {
  id: 'level3',
  name: 'Mundo 3',
  tilemapKey: ASSETS.LEVEL3_MAP,
  tilesets: [
    { name: 'nubes', key: ASSETS.TS_NUBES },
    { name: 'bloques', key: ASSETS.TS_BLOQUES },
    { name: 'poste', key: ASSETS.TS_POSTE },
    { name: 'agus-quieto-sin-fondo', key: ASSETS.TS_AGUS_2 },
  ],
  backgroundKey: '',
  music: ASSETS.BGM_LEVEL1,
  enemies: [
    { type: 'goomba', x: 8 + 16 * 16, y: 8 + 16 * 16 },
    { type: 'goomba', x: 8 + 16 * 30, y: 8 + 16 * 16 },
    { type: 'fish', x: 8 + 16 * (56 - 1), minY: 8 + 16 * (10 - 1), maxY: 8 + 16 * (20 - 1) },
    { type: 'fish', x: 8 + 16 * (60 - 1), minY: 8 + 16 * (10 - 1), maxY: 8 + 16 * (20 - 1) },
    { type: 'fish', x: 8 + 16 * (64 - 1), minY: 8 + 16 * (10 - 1), maxY: 8 + 16 * (20 - 1) },
    { type: 'fish', x: 8 + 16 * (68 - 1), minY: 8 + 16 * (10 - 1), maxY: 8 + 16 * (20 - 1) },
    { type: 'fish', x: 8 + 16 * (72 - 1), minY: 8 + 16 * (10 - 1), maxY: 8 + 16 * (20 - 1) },
    { type: 'fish', x: 8 + 16 * (76 - 1), minY: 8 + 16 * (10 - 1), maxY: 8 + 16 * (20 - 1) },
    { type: 'fish', x: 8 + 16 * (80 - 1), minY: 8 + 16 * (10 - 1), maxY: 8 + 16 * (20 - 1) },
    { type: 'fish', x: 8 + 16 * (103.5 - 1), minY: 8 + 16 * (10 - 1), maxY: 8 + 16 * (20 - 1) },
    { type: 'fish', x: 8 + 16 * (124 - 1), minY: 8 + 16 * (8 - 1), maxY: 8 + 16 * (20 - 1) },
  ],
  collectibles: [
    { type: 'coin', x: 8 + 16 * (56 - 1), y: 8 + 16 * (12 - 1) },
    { type: 'coin', x: 8 + 16 * (60 - 1), y: 8 + 16 * (12 - 1) },
    { type: 'coin', x: 8 + 16 * (64 - 1), y: 8 + 16 * (12 - 1) },
    { type: 'coin', x: 8 + 16 * (68 - 1), y: 8 + 16 * (12 - 1) },
    { type: 'coin', x: 8 + 16 * (72 - 1), y: 8 + 16 * (12 - 1) },
    { type: 'coin', x: 8 + 16 * (76 - 1), y: 8 + 16 * (12 - 1) },
    { type: 'coin', x: 8 + 16 * (80 - 1), y: 8 + 16 * (12 - 1) },
  ],
  coinBlocks: [
    { x: 8 + 16 * 16, y: 8 + 16 * 12 },
    { x: 8 + 16 * 29, y: 8 + 16 * 12 },
    { x: 8 + 16 * 33, y: 8 + 16 * 12 },
    { x: 8 + 16 * 110, y: 8 + 16 * 12 },
  ],
  brickBlocks: [
    { x: 8 + 16 * 15, y: 8 + 16 * 12 },
    { x: 8 + 16 * 17, y: 8 + 16 * 12 },
    { x: 8 + 16 * 30, y: 8 + 16 * 12 },
    { x: 8 + 16 * 31, y: 8 + 16 * 12 },
    { x: 8 + 16 * 32, y: 8 + 16 * 12 },
  ],
  // Spawn: col 4 centro (x=72), suelo row 18 y_top=288 → body_bottom=287, 1px margen
  playerSpawn: { x: 72, y: 279 },
  winTrigger: { x: 2400, y: 200, width: 32, height: 64 }, // legacy — no usado
  // Poste: col 145 centro (x=2328), background rows 4-14 (y_top=64..224)
  // Plataforma de llegada: row 15 y_top=240 → groundY=240
  // poleHeight = 240 - 64 = 176
  flagPole: { x: 2328, groundY: 240, poleHeight: 176, flagBottomY: 240 },
  timeLimit: 300,
};
