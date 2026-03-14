import { ASSETS } from '../utils/constants';
import type { LevelConfig } from '../types';

export const level1: LevelConfig = {
  id: 'level1',
  name: 'Mundo 1',
  tilemapKey: ASSETS.LEVEL1_MAP,
  tilesets: [
    { name: 'montañas', key: ASSETS.TS_MONTANAS },
    { name: 'nubes', key: ASSETS.TS_NUBES },
    { name: 'bloques', key: ASSETS.TS_BLOQUES },
    { name: 'tubo', key: ASSETS.TS_TUBO },
    { name: 'poste', key: ASSETS.TS_POSTE },
    { name: 'verde_2', key: ASSETS.TS_VERDE_2 },
  ],
  backgroundKey: '',
  music: ASSETS.BGM_LEVEL1,
  enemies: [
    { type: 'goomba', x: 250, y: 263 },
    { type: 'goomba', x: 530, y: 263 },
    { type: 'goomba', x: 800, y: 263 },
  ],
  collectibles: [
    { type: 'coin', x: 96, y: 260 },   // camino inicial, nivel suelo
    { type: 'coin', x: 224, y: 196 },   // sobre plataforma A (row 13, col 14)
    { type: 'coin', x: 256, y: 196 },   // sobre plataforma A (col 16)
    { type: 'coin', x: 400, y: 260 },   // zona central, nivel suelo
    { type: 'coin', x: 512, y: 196 },   // sobre plataforma B (col 31)
    { type: 'coin', x: 640, y: 260 },   // antes del foso, nivel suelo
  ],
  coinBlocks: [
    { x: 8 + 16 * 13.5, y: 8 + 16 * 9 },
    { x: 8 + 16 * 27, y: 8 + 16 * 1 },
    { x: 8 + 16 * 58, y: 8 + 16 * 12 },
  ],
  brickBlocks: [
    { x: 8 + 16 * 19, y: 8 + 16 * 10 },
    { x: 8 + 16 * 20, y: 8 + 16 * 10 },
    { x: 8 + 16 * 21, y: 8 + 16 * 10 },
    { x: 8 + 16 * 57, y: 8 + 16 * 12 },
    { x: 8 + 16 * 59, y: 8 + 16 * 12 },
    { x: 8 + 16 * 60, y: 8 + 16 * 12 },
  ],
  // Spawn: col 2, suelo row 17 y_top=272. Con setOffset(2,2) body bottom=y+8, spawn en 263 da 1px de margen
  playerSpawn: { x: 32, y: 263 },
  // winTrigger — campo legacy, no activo
  winTrigger: { x: 1150, y: 260, width: 32, height: 48 },
  // Mástil: col 73 centro (x=1176), background rows 7-16 (y_top=112..256, y_bottom=272)
  // groundY=256 (y_top del base block row 16): hitzone bottom=256 < body_top María(257) → sin win accidental
  // poleHeight=144 (112→256): hitzone top coincide con primer tile del poste
  // flagBottomY=272: la bandera anima hasta el fondo visual del mástil (row 16 y_bottom)
  flagPole: { x: 1175, groundY: 256, poleHeight: 128, flagBottomY: 256 },
  timeLimit: 200,
};
