export interface EnemySpawnConfig {
  type: 'goomba';
  x: number;
  y: number;
}

export interface CollectibleSpawnConfig {
  type: 'coin';
  x: number;
  y: number;
}

export interface WinTrigger {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlayerSpawn {
  x: number;
  y: number;
}

export interface FlagPoleConfig {
  x: number;
  groundY: number;
}

export interface CoinBlockSpawnConfig {
  x: number;
  y: number;
}

export interface LevelConfig {
  id: string;
  name: string;
  tilemapKey: string;
  tilesetKey: string;
  backgroundKey: string;
  music: string;
  enemies: EnemySpawnConfig[];
  collectibles: CollectibleSpawnConfig[];
  coinBlocks: CoinBlockSpawnConfig[];
  playerSpawn: PlayerSpawn;
  winTrigger: WinTrigger;
  flagPole: FlagPoleConfig;
  timeLimit: number;
}

export interface SceneTransitionData {
  levelId?: string;
  score?: number;
}
