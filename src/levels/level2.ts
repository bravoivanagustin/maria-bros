import { ASSETS } from '../utils/constants';
import type { LevelConfig } from '../types';

export const level2: LevelConfig = {
  id: 'level2',
  name: 'Mundo 2',
  tilemapKey: ASSETS.LEVEL2_MAP,
  tilesets: [
    { name: 'nubes', key: ASSETS.TS_NUBES },
    { name: 'bloques', key: ASSETS.TS_BLOQUES },
    { name: 'verde', key: ASSETS.TS_VERDE },
    { name: 'poste', key: ASSETS.TS_POSTE },
    { name: 'palos', key: ASSETS.TS_PALOS },
    { name: 'tubo', key: ASSETS.TS_TUBO },
    { name: 'arboles', key: ASSETS.TS_ARBOLES },
    { name: 'verde_2', key: ASSETS.TS_VERDE_2 },
  ],
  backgroundKey: '',
  music: ASSETS.BGM_LEVEL1,
  enemies: [
    { type: 'goomba', x: 160, y: 551 },  // inicio, suelo row 35 (y_top=560)
    { type: 'goomba', x: 448, y: 249 },  // plataforma central, row 16 (y_top=256)
  ],
  collectibles: [
    { type: 'coin', x: 112, y: 544 },    // inicio, ras del suelo
    { type: 'coin', x: 192, y: 544 },    // inicio
    { type: 'coin', x: 432, y: 240 },    // plataforma central
    { type: 'coin', x: 560, y: 240 },    // plataforma central
  ],
  coinBlocks: [
    { x: 144, y: 488 },   // inicio — 72px sobre suelo (row 35)
    { x: 496, y: 178 },   // plataforma central — 64px sobre row 16
  ],
  brickBlocks: [],
  // Spawn: suelo inicio col 4 (x=72), row 35 y_top=560. body_bottom=y+8=559 (1px de margen)
  playerSpawn: { x: 72, y: 551 },
  winTrigger: { x: 1800, y: 500, width: 32, height: 64 }, // legacy — no usado
  // Poste: col 115 (x=1848), background rows 24-33 (pixelY 384-528)
  // Base block (ground layer): row 34, pixelY=544 → groundY=544
  // groundY=544 < body_top María parada en suelo (551-6=545) → sin win accidental
  // poleHeight = 544 - 384 = 160 (cubre exactamente rows 24-33 del background)
  // flagBottomY=560: borde inferior del base block (row 34 y_bottom)
  flagPole: { x: 1847, groundY: 544, poleHeight: 144, flagBottomY: 544 },
  timeLimit: 300,
};
