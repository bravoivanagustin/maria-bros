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

export interface LevelConfig {
  id: string;
  name: string;
  tilemapKey: string;
  tilesetKey: string;
  backgroundKey: string;
  music: string;
  enemies: EnemySpawnConfig[];
  collectibles: CollectibleSpawnConfig[];
  playerSpawn: PlayerSpawn;
  winTrigger: WinTrigger;
  timeLimit: number;
}

export interface SceneTransitionData {
  levelId?: string;
  score?: number;
}
