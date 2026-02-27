import { EVENTS, SCENES } from '../utils/constants';
import { InputSystem } from '../systems/InputSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { CameraSystem } from '../systems/CameraSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { Maria } from '../entities/Maria';
import { Goomba } from '../entities/enemies/Goomba';
import { Coin } from '../entities/collectibles/Coin';
import { Agustin } from '../entities/Agustin';
import { HUD } from '../ui/HUD';
import { LevelRegistry } from '../config/LevelRegistry';
import type { LevelConfig, SceneTransitionData } from '../types';

export class GameScene extends Phaser.Scene {
  // Sistemas
  private inputSystem!: InputSystem;
  private audioSystem!: AudioSystem;
  private cameraSystem!: CameraSystem;
  private collisionSystem!: CollisionSystem;
  private scoreSystem!: ScoreSystem;

  // Entidades
  private maria!: Maria;
  private goombas!: Phaser.Physics.Arcade.Group;
  private coins!: Phaser.Physics.Arcade.StaticGroup;
  private agustin!: Agustin;

  // Nivel
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private levelMap!: Phaser.Tilemaps.Tilemap;
  private levelConfig!: LevelConfig;

  // UI
  private hud!: HUD;

  // Estado
  private isTransitioning: boolean = false;

  constructor() {
    super({ key: SCENES.GAME });
  }

  init(data: SceneTransitionData): void {
    const levelId = data.levelId ?? 'level1';
    this.levelConfig = LevelRegistry.getLevel(levelId);
    this.isTransitioning = false;
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#5C94FC');

    this.createTilemap();
    this.createSystems();
    this.createEntities();

    this.collisionSystem.setup(
      this.maria,
      this.goombas,
      this.coins,
      this.groundLayer,
      this.agustin,
    );

    this.cameraSystem.setup(
      this.maria,
      this.levelMap.widthInPixels,
      this.levelMap.heightInPixels,
    );

    this.hud = new HUD(this, this.scoreSystem);
    this.audioSystem.playMusic(this.levelConfig.music);
    this.setupEventListeners();

    this.cameras.main.fadeIn(400);
  }

  private createTilemap(): void {
    this.levelMap = this.make.tilemap({ key: this.levelConfig.tilemapKey });

    const tileset = this.levelMap.addTilesetImage(
      'tileset-world1',
      this.levelConfig.tilesetKey,
    );

    if (!tileset) {
      throw new Error('No se pudo cargar el tileset. Verificar que el nombre coincide.');
    }

    this.levelMap.createLayer('background', tileset, 0, 0);
    this.groundLayer = this.levelMap.createLayer('ground', tileset, 0, 0)!;
    this.levelMap.createLayer('foreground', tileset, 0, 0)?.setDepth(10);

    // Todos los tiles no vacíos del layer ground tienen colisión
    this.groundLayer.setCollisionByExclusion([-1]);

    this.physics.world.setBounds(
      0,
      0,
      this.levelMap.widthInPixels,
      this.levelMap.heightInPixels,
    );
  }

  private createSystems(): void {
    this.inputSystem = new InputSystem(this);
    this.scoreSystem = new ScoreSystem(this, this.levelConfig.timeLimit);
    this.audioSystem = new AudioSystem(this);
    this.cameraSystem = new CameraSystem(this);
    this.collisionSystem = new CollisionSystem(this);
  }

  private createEntities(): void {
    const cfg = this.levelConfig;

    // María
    this.maria = new Maria(this, cfg.playerSpawn.x, cfg.playerSpawn.y);

    // Goombas
    this.goombas = this.physics.add.group();
    for (const enemyDef of cfg.enemies) {
      if (enemyDef.type === 'goomba') {
        const goomba = new Goomba(this, enemyDef.x, enemyDef.y);
        this.goombas.add(goomba);
      }
    }

    // Monedas
    this.coins = this.physics.add.staticGroup();
    for (const collectibleDef of cfg.collectibles) {
      if (collectibleDef.type === 'coin') {
        const coin = new Coin(this, collectibleDef.x, collectibleDef.y);
        this.coins.add(coin);
      }
    }

    // Agustín: centro del winTrigger
    const wt = cfg.winTrigger;
    this.agustin = new Agustin(
      this,
      wt.x + wt.width / 2,
      wt.y + wt.height / 2,
    );
  }

  private setupEventListeners(): void {
    this.events.on(EVENTS.PLAYER_RESPAWN, this.onPlayerRespawn, this);
    this.events.on(EVENTS.GAME_OVER, this.onGameOver, this);
    this.events.on(EVENTS.LEVEL_WIN, this.onLevelWin, this);
  }

  private onPlayerRespawn(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.cameras.main.shake(300, 0.01);
    this.time.delayedCall(2000, () => {
      this.audioSystem.stopMusic();
      this.scene.restart({ levelId: this.levelConfig.id });
    });
  }

  private onGameOver(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.cameras.main.shake(500, 0.02);
    this.time.delayedCall(2500, () => {
      this.audioSystem.stopMusic();
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start(SCENES.GAME_OVER);
      });
    });
  }

  private onLevelWin(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.time.delayedCall(800, () => {
      this.audioSystem.stopMusic();
      this.cameras.main.fadeOut(400, 255, 255, 255);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start(SCENES.WIN, {
          score: this.scoreSystem.getScore(),
          levelId: this.levelConfig.id,
        });
      });
    });
  }

  update(_time: number, delta: number): void {
    if (this.isTransitioning) return;

    this.inputSystem.update();
    this.maria.update(delta, this.inputSystem);

    for (const enemy of this.goombas.getChildren()) {
      (enemy as Goomba).update(delta);
    }

    this.scoreSystem.update(delta);
    this.hud.update();
  }

  shutdown(): void {
    this.events.off(EVENTS.PLAYER_RESPAWN, this.onPlayerRespawn, this);
    this.events.off(EVENTS.GAME_OVER, this.onGameOver, this);
    this.events.off(EVENTS.LEVEL_WIN, this.onLevelWin, this);
    this.scoreSystem.destroy();
    this.audioSystem.destroy();
    this.hud.destroy();
  }
}
