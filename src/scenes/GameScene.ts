import { EVENTS, FONTS, GAME, SCENES } from '../utils/constants';
import { InputSystem } from '../systems/InputSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { CameraSystem } from '../systems/CameraSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { Maria } from '../entities/Maria';
import { Goomba } from '../entities/enemies/Goomba';
import { Fish } from '../entities/enemies/Fish';
import { Coin } from '../entities/collectibles/Coin';
import { CoinBlock } from '../entities/CoinBlock';
import { BrickBlock } from '../entities/BrickBlock';
import { FlagPole } from '../entities/FlagPole';
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
  private fish!: Phaser.GameObjects.Group;
  private coins!: Phaser.Physics.Arcade.StaticGroup;
  private coinBlocks!: Phaser.GameObjects.Group;
  private brickBlocks!: Phaser.GameObjects.Group;
  private flagPole!: FlagPole;

  // Nivel
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private levelMap!: Phaser.Tilemaps.Tilemap;
  private levelConfig!: LevelConfig;

  // UI
  private hud!: HUD;

  // Estado
  private isTransitioning: boolean = false;
  private initialLives: number = GAME.MAX_LIVES;

  // Pausa
  private isPaused: boolean = false;
  private pauseSelectedIndex: number = 0;
  private pauseBg!: Phaser.GameObjects.Rectangle;
  private pauseTitleText!: Phaser.GameObjects.Text;
  private pauseResumeBtn!: Phaser.GameObjects.Text;
  private pauseMenuBtn!: Phaser.GameObjects.Text;
  private readonly onPauseDown = (): void => { this.pauseSelectedIndex = 1; this.refreshPauseCursor(); };
  private readonly onPauseUp   = (): void => { this.pauseSelectedIndex = 0; this.refreshPauseCursor(); };
  private readonly onPauseConfirm = (): void => { if (this.pauseSelectedIndex === 0) this.resumeGame(); else this.exitToMenu(); };

  constructor() {
    super({ key: SCENES.GAME });
  }

  init(data: SceneTransitionData): void {
    const levelId = data.levelId ?? 'level1';
    this.levelConfig = LevelRegistry.getLevel(levelId);
    this.isTransitioning = false;
    this.isPaused = false;
    this.initialLives = data.lives ?? GAME.MAX_LIVES;
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#5C94FC');

    this.createTilemap();
    this.createSystems();
    this.createEntities();

    this.collisionSystem.setup(
      this.maria,
      this.goombas,
      this.fish,
      this.coins,
      this.coinBlocks,
      this.brickBlocks,
      this.groundLayer,
      this.flagPole,
    );

    this.cameraSystem.setup(
      this.maria,
      this.levelMap.widthInPixels,
      this.levelMap.heightInPixels,
    );

    this.hud = new HUD(this, this.scoreSystem);
    this.audioSystem.playMusic(this.levelConfig.music);
    this.setupEventListeners();
    this.createPauseMenu();

    this.input.keyboard!.on('keydown-ESC', () => {
      if (this.isTransitioning) return;
      if (this.isPaused) this.resumeGame(); else this.pauseGame();
    });

    this.cameras.main.fadeIn(400);
  }

  private createTilemap(): void {
    this.levelMap = this.make.tilemap({ key: this.levelConfig.tilemapKey });

    const tilesets = this.levelConfig.tilesets.map(ts => {
      const t = this.levelMap.addTilesetImage(
        ts.name,
        ts.key,
        16, 16,
        0,
        ts.spacing ?? 0,
      );
      if (!t) throw new Error(`No se pudo cargar el tileset "${ts.name}". Verificar key y nombre.`);
      return t;
    });

    // Capa de fondo del tilemap (decoración sin colisión, detrás de todo)
    this.levelMap.createLayer('background', tilesets, 0, 0)?.setDepth(-2);

    this.groundLayer = this.levelMap.createLayer('ground', tilesets, 0, 0)!.setDepth(1);
    this.levelMap.createLayer('foreground', tilesets, 0, 0)?.setDepth(10);

    this.groundLayer.setCollisionByExclusion([-1]);

    this.physics.world.setBounds(
      0,
      0,
      this.levelMap.widthInPixels,
      this.levelMap.heightInPixels,
    );

    // Sin límite inferior: permite que María caiga por los fosos
    (this.physics as unknown as Phaser.Physics.Arcade.ArcadePhysics)
      .world.setBoundsCollision(true, true, true, false);
  }

  private createSystems(): void {
    this.inputSystem = new InputSystem(this);
    this.scoreSystem = new ScoreSystem(this, this.levelConfig.timeLimit, this.initialLives);
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
    // Peces — grupo regular para no resetear allowGravity = false
    this.fish = this.add.group();

    for (const enemyDef of cfg.enemies) {
      if (enemyDef.type === 'goomba') {
        const goomba = new Goomba(this, enemyDef.x, enemyDef.y);
        goomba.setGroundLayer(this.groundLayer);
        this.goombas.add(goomba);
      } else if (enemyDef.type === 'fish') {
        const fishEnemy = new Fish(this, enemyDef.x, enemyDef.minY, enemyDef.maxY);
        this.fish.add(fishEnemy);
      }
    }

    // Monedas flotantes
    this.coins = this.physics.add.staticGroup();
    for (const collectibleDef of cfg.collectibles) {
      if (collectibleDef.type === 'coin') {
        const coin = new Coin(this, collectibleDef.x, collectibleDef.y);
        this.coins.add(coin);
      }
    }

    // Bloques de moneda — grupo regular para no resetear el cuerpo físico del bloque
    this.coinBlocks = this.add.group();
    for (const blockDef of cfg.coinBlocks) {
      const block = new CoinBlock(this, blockDef.x, blockDef.y);
      this.coinBlocks.add(block);
    }

    // Bloques rompibles (brick blocks)
    this.brickBlocks = this.add.group();
    for (const blockDef of cfg.brickBlocks) {
      const block = new BrickBlock(this, blockDef.x, blockDef.y);
      this.brickBlocks.add(block);
    }

    // Mástil de la bandera (condición de victoria)
    const fp = cfg.flagPole;
    this.flagPole = new FlagPole(this, fp.x, fp.groundY, fp.poleHeight, fp.flagBottomY, fp.winDelay);
  }

  private setupEventListeners(): void {
    this.events.on(EVENTS.PLAYER_RESPAWN, this.onPlayerRespawn, this);
    this.events.on(EVENTS.GAME_OVER, this.onGameOver, this);
    this.events.on(EVENTS.LEVEL_WIN, this.onLevelWin, this);
  }

  private onPlayerRespawn(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.cameras.main.stopFollow();
    this.time.delayedCall(2000, () => {
      const lives = this.scoreSystem.getLives();
      this.audioSystem.stopMusic();
      this.scoreSystem.destroy();
      this.scene.restart({ levelId: this.levelConfig.id, lives });
    });
  }

  private onGameOver(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.cameras.main.stopFollow();
    this.cameras.main.shake(500, 0.02);
    this.time.delayedCall(2500, () => {
      this.audioSystem.stopMusic();
      this.scoreSystem.destroy();
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
      const score = this.scoreSystem.getScore();
      this.scoreSystem.destroy();
      this.cameras.main.fadeOut(400, 255, 255, 255);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start(SCENES.WIN, {
          score,
          levelId: this.levelConfig.id,
        });
      });
    });
  }

  update(_time: number, delta: number): void {
    if (this.isPaused) return;

    // Los goombas se siguen moviendo durante la animación de muerte de María
    for (const enemy of this.goombas.getChildren()) {
      (enemy as Goomba).update(delta);
    }
    for (const fishEnemy of this.fish.getChildren()) {
      (fishEnemy as Fish).update(delta);
    }

    if (this.isTransitioning) return;

    this.inputSystem.update();
    this.maria.update(delta, this.inputSystem);

    this.scoreSystem.update(delta);
    this.hud.update();

    // Muerte por foso: María cae por debajo del mapa
    if (this.maria.y > this.levelMap.heightInPixels + 32) {
      this.maria.fallIntoPit();
    }
  }

  private createPauseMenu(): void {
    const cx = GAME.WIDTH / 2;
    const cy = GAME.HEIGHT / 2;
    const depth = 50;

    this.pauseBg = this.add
      .rectangle(cx, cy, GAME.WIDTH, GAME.HEIGHT, 0x000000, 0.7)
      .setScrollFactor(0).setDepth(depth).setVisible(false);

    this.pauseTitleText = this.add
      .text(cx, cy - 28, 'PAUSADO', { fontFamily: FONTS.PIXEL, fontSize: '12px', color: '#ffffff', stroke: '#000000', strokeThickness: 3 })
      .setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1).setVisible(false);

    this.pauseResumeBtn = this.add
      .text(cx, cy + 2, 'Reanudar', { fontFamily: FONTS.PIXEL, fontSize: '8px', color: '#ffdd00', stroke: '#000000', strokeThickness: 2 })
      .setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1).setVisible(false)
      .setInteractive({ useHandCursor: true });
    this.pauseResumeBtn.on('pointerover', () => { this.pauseSelectedIndex = 0; this.refreshPauseCursor(); });
    this.pauseResumeBtn.on('pointerdown', () => this.resumeGame());

    this.pauseMenuBtn = this.add
      .text(cx, cy + 20, 'Salir al menú', { fontFamily: FONTS.PIXEL, fontSize: '8px', color: '#ffffff', stroke: '#000000', strokeThickness: 2 })
      .setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1).setVisible(false)
      .setInteractive({ useHandCursor: true });
    this.pauseMenuBtn.on('pointerover', () => { this.pauseSelectedIndex = 1; this.refreshPauseCursor(); });
    this.pauseMenuBtn.on('pointerdown', () => this.exitToMenu());
  }

  private pauseGame(): void {
    this.isPaused = true;
    this.pauseSelectedIndex = 0;
    this.physics.pause();
    [this.pauseBg, this.pauseTitleText, this.pauseResumeBtn, this.pauseMenuBtn].forEach(o => o.setVisible(true));
    this.refreshPauseCursor();
    this.input.keyboard!.on('keydown-DOWN',  this.onPauseDown);
    this.input.keyboard!.on('keydown-UP',    this.onPauseUp);
    this.input.keyboard!.on('keydown-ENTER', this.onPauseConfirm);
    this.input.keyboard!.on('keydown-SPACE', this.onPauseConfirm);
  }

  private resumeGame(): void {
    this.isPaused = false;
    this.physics.resume();
    [this.pauseBg, this.pauseTitleText, this.pauseResumeBtn, this.pauseMenuBtn].forEach(o => o.setVisible(false));
    this.input.keyboard!.off('keydown-DOWN',  this.onPauseDown);
    this.input.keyboard!.off('keydown-UP',    this.onPauseUp);
    this.input.keyboard!.off('keydown-ENTER', this.onPauseConfirm);
    this.input.keyboard!.off('keydown-SPACE', this.onPauseConfirm);
  }

  private exitToMenu(): void {
    this.audioSystem.stopMusic();
    this.scoreSystem.destroy();
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENES.MENU);
    });
  }

  private refreshPauseCursor(): void {
    this.pauseResumeBtn.setText(this.pauseSelectedIndex === 0 ? '> Reanudar' : 'Reanudar').setColor(this.pauseSelectedIndex === 0 ? '#ffdd00' : '#ffffff');
    this.pauseMenuBtn.setText(this.pauseSelectedIndex === 1 ? '> Salir al menú' : 'Salir al menú').setColor(this.pauseSelectedIndex === 1 ? '#ffdd00' : '#ffffff');
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
