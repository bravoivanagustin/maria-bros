import { EVENTS, GAME } from '../utils/constants';

export class ScoreSystem {
  private score: number = 0;
  private lives: number = GAME.MAX_LIVES;
  private timeRemaining: number;

  constructor(private scene: Phaser.Scene, timeLimit: number) {
    this.timeRemaining = timeLimit;
    this.scene.events.on(EVENTS.COIN_COLLECTED, this.onCoinCollected, this);
    this.scene.events.on(EVENTS.PLAYER_DIED, this.onPlayerDied, this);
  }

  private onCoinCollected(): void {
    this.score += 100;
    this.scene.events.emit(EVENTS.SCORE_CHANGED, this.score);
  }

  private onPlayerDied(): void {
    this.lives = Math.max(0, this.lives - 1);
    this.scene.events.emit(EVENTS.LIVES_CHANGED, this.lives);

    if (this.lives <= 0) {
      this.scene.events.emit(EVENTS.GAME_OVER);
    } else {
      this.scene.events.emit(EVENTS.PLAYER_RESPAWN);
    }
  }

  public update(delta: number): void {
    this.timeRemaining -= delta / 1000;

    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      // Time-out counts as dying
      this.scene.events.emit(EVENTS.PLAYER_DIED);
    }

    this.scene.events.emit(EVENTS.TIME_CHANGED, Math.ceil(this.timeRemaining));
  }

  public getScore(): number {
    return this.score;
  }

  public getLives(): number {
    return this.lives;
  }

  public getTime(): number {
    return Math.ceil(this.timeRemaining);
  }

  public destroy(): void {
    this.scene.events.off(EVENTS.COIN_COLLECTED, this.onCoinCollected, this);
    this.scene.events.off(EVENTS.PLAYER_DIED, this.onPlayerDied, this);
  }
}
