import { ANIMS, ASSETS } from './constants';

export class AnimationHelper {
  static createAll(anims: Phaser.Animations.AnimationManager): void {
    AnimationHelper.createMariaAnims(anims);
    AnimationHelper.createGoombaAnims(anims);
    AnimationHelper.createCoinAnims(anims);
    AnimationHelper.createAgustinAnims(anims);
  }

  private static createMariaAnims(anims: Phaser.Animations.AnimationManager): void {
    // Spritesheet: idle(0) walk(1-3) jump(4) death(5)  — 6 frames × 16×16 = 96×16 px
    anims.create({
      key: ANIMS.MARIA_IDLE,
      frames: anims.generateFrameNumbers(ASSETS.PLAYER, { start: 0, end: 0 }),
      frameRate: 4,
      repeat: -1,
    });
    anims.create({
      key: ANIMS.MARIA_WALK,
      frames: anims.generateFrameNumbers(ASSETS.PLAYER, { start: 1, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: ANIMS.MARIA_JUMP,
      frames: anims.generateFrameNumbers(ASSETS.PLAYER, { start: 4, end: 4 }),
      frameRate: 1,
      repeat: 0,
    });
    anims.create({
      key: ANIMS.MARIA_DEATH,
      frames: anims.generateFrameNumbers(ASSETS.PLAYER, { start: 5, end: 5 }),
      frameRate: 1,
      repeat: 0,
    });
  }

  private static createGoombaAnims(anims: Phaser.Animations.AnimationManager): void {
    // Spritesheet: walk(0-2) dead(3-5)
    anims.create({
      key: ANIMS.GOOMBA_WALK,
      frames: anims.generateFrameNumbers(ASSETS.ENEMY_GOOMBA, { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1,
    });
    anims.create({
      key: ANIMS.GOOMBA_DEAD,
      frames: anims.generateFrameNumbers(ASSETS.ENEMY_GOOMBA, { start: 3, end: 5 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  private static createCoinAnims(anims: Phaser.Animations.AnimationManager): void {
    // Spritesheet: spin(0-3)
    anims.create({
      key: ANIMS.COIN_SPIN,
      frames: anims.generateFrameNumbers(ASSETS.COIN, { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  private static createAgustinAnims(anims: Phaser.Animations.AnimationManager): void {
    // Spritesheet: idle(0-1)
    anims.create({
      key: ANIMS.AGUSTIN_IDLE,
      frames: anims.generateFrameNumbers(ASSETS.PRINCESS, { start: 0, end: 1 }),
      frameRate: 3,
      repeat: -1,
    });
  }
}
