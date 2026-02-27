import { GAME } from '../utils/constants';

export class CameraSystem {
  private camera: Phaser.Cameras.Scene2D.Camera;

  constructor(scene: Phaser.Scene) {
    this.camera = scene.cameras.main;
  }

  public setup(
    target: Phaser.GameObjects.GameObject,
    worldWidth: number,
    worldHeight: number,
  ): void {
    this.camera.startFollow(target, true, 0.1, 0.1);
    this.camera.setBounds(0, 0, worldWidth, worldHeight);
    this.camera.setDeadzone(GAME.WIDTH * 0.15, GAME.HEIGHT * 0.15);
  }

  public fadeIn(duration: number = 500): void {
    this.camera.fadeIn(duration);
  }

  public fadeOut(duration: number = 500, callback?: () => void): void {
    this.camera.fadeOut(duration);
    if (callback) {
      this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, callback);
    }
  }
}
