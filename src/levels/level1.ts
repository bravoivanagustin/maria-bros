import { ASSETS } from '../utils/constants';
import type { LevelConfig } from '../types';

export const level1: LevelConfig = {
  id: 'level1',
  name: 'Mundo 1-1',
  tilemapKey: ASSETS.LEVEL1_MAP,
  tilesets: [
    { name: 'bloques',   key: ASSETS.TS_BLOQUES   },
    { name: 'nubes',     key: ASSETS.TS_NUBES     },
    { name: 'tileset',   key: ASSETS.TS_TILESET,  spacing: 1 },
    { name: 'poste',     key: ASSETS.TS_POSTE     },
    { name: 'tubo_lat',  key: ASSETS.TS_TUBO_LAT  },
    { name: 'montañas',  key: ASSETS.TS_MONTANAS  },
    { name: 'montañas2', key: ASSETS.TS_MONTANAS  },
  ],
  backgroundKey: '',
  music: ASSETS.BGM_LEVEL1,
  enemies: [
    { type: 'goomba', x: 250, y: 176 },
    { type: 'goomba', x: 530, y: 176 },
  ],
  collectibles: [
    { type: 'coin', x: 80, y: 155 },
    { type: 'coin', x: 128, y: 107 },
    { type: 'coin', x: 192, y: 75 },
    { type: 'coin', x: 288, y: 155 },
    { type: 'coin', x: 448, y: 123 },
    { type: 'coin', x: 528, y: 155 },
  ],
  // Bloques de moneda — ajustar posiciones según el diseño final del tilemap
  coinBlocks: [
    { x: 160, y: 160 },
    { x: 336, y: 160 },
    { x: 368, y: 160 },
    { x: 464, y: 144 },
  ],
  // Spawn: col 2, standing on ground row 12 (top = 192px), María center = 184px
  playerSpawn: { x: 32, y: 184 },
  // Agustín al final del nivel (personaje visual, ya no dispara la victoria)
  winTrigger: { x: 590, y: 160, width: 32, height: 64 },
  // Mástil: col 53 tilemap (x=848, centro=856), filas 4-9 (top y=64, base y=164)
  flagPole: { x: 856, groundY: 164 },
  timeLimit: 200,
};
