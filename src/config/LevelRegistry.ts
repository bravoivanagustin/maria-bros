import { level1 } from '../levels/level1';
import { level2 } from '../levels/level2';
import { level3 } from '../levels/level3';
import type { LevelConfig } from '../types';

const levels: Map<string, LevelConfig> = new Map([
  ['level1', level1],
  ['level2', level2],
  ['level3', level3],
]);

export class LevelRegistry {
  static getLevel(id: string): LevelConfig {
    const config = levels.get(id);
    if (!config) {
      throw new Error(`Nivel "${id}" no registrado en LevelRegistry.`);
    }
    return config;
  }

  static getAllIds(): string[] {
    return Array.from(levels.keys());
  }

  static getNextLevelId(currentId: string): string | null {
    const ids = LevelRegistry.getAllIds();
    const index = ids.indexOf(currentId);
    if (index === -1 || index >= ids.length - 1) return null;
    return ids[index + 1];
  }
}
