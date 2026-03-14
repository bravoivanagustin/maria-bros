import { ASSETS, FONTS, GAME, SCENES } from '../utils/constants';

interface CoinParticle {
  img: Phaser.GameObjects.Image;
  vx: number;
  vy: number;
}

export class EndingScene extends Phaser.Scene {
  private mariaImg!: Phaser.GameObjects.Image;
  private agusImg!: Phaser.GameObjects.Image;
  private coins: CoinParticle[] = [];
  private alternateTimer: number = 0;
  private showBeso: boolean = false;
  private skipHandled: boolean = false;

  private readonly GRAVITY = 280;
  private readonly BOUNCE = 0.65;

  constructor() {
    super({ key: SCENES.ENDING });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#FFFFFF');
    this.cameras.main.fadeIn(800);

    const cx = GAME.WIDTH / 2;
    const cy = GAME.HEIGHT / 2 - 8;

    // Monedas rebotando (detrás de los personajes)
    this.spawnCoins();

    // Personajes centrados sin overlap (16px × escala 3 = 48px, offset 28 = 4px gap)
    this.mariaImg = this.add
      .image(cx - 24, cy, ASSETS.MARIA_QUIETA)
      .setScale(3)
      .setOrigin(0.5);
    this.agusImg = this.add
      .image(cx + 24, cy, ASSETS.TS_AGUS_2)
      .setScale(3)
      .setOrigin(0.5);

    // Texto superior
    this.add
      .text(cx, 18, '¡Lo lograste, te amo!', {
        fontFamily: FONTS.PIXEL,
        fontSize: '10px',
        color: '#ff69b4',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Hint skip
    this.add
      .text(cx, GAME.HEIGHT - 10, 'ENTER para continuar', {
        fontFamily: FONTS.PIXEL,
        fontSize: '6px',
        color: '#666666',
      })
      .setOrigin(0.5);

    // Barra de progreso de 30 segundos
    const barBg = this.add.rectangle(cx, GAME.HEIGHT - 22, 120, 4, 0x333333).setOrigin(0.5);
    void barBg;
    const barFill = this.add.rectangle(cx - 60, GAME.HEIGHT - 22, 120, 4, 0xff69b4).setOrigin(0, 0.5);

    this.tweens.add({
      targets: barFill,
      scaleX: 0,
      duration: 30000,
      ease: 'Linear',
    });

    // Saltar con ENTER
    this.input.keyboard!.on('keydown-ENTER', () => this.skip());

    // Auto-fin después de 30 segundos
    this.time.delayedCall(30000, () => this.skip());
  }

  private spawnCoins(): void {
    const COUNT = 18;
    for (let i = 0; i < COUNT; i++) {
      const x = Phaser.Math.Between(8, GAME.WIDTH - 8);
      const y = Phaser.Math.Between(GAME.HEIGHT * 0.4, GAME.HEIGHT - 10);
      const vx = Phaser.Math.Between(-60, 60);
      const vy = Phaser.Math.Between(-220, -80);
      this.coins.push({
        img: this.add.image(x, y, 'moneda-1').setScale(2),
        vx,
        vy,
      });
    }
  }

  update(_time: number, delta: number): void {
    const dt = delta / 1000;

    // Alternar imágenes cada 1.5 s
    this.alternateTimer += delta;
    if (this.alternateTimer >= 1500) {
      this.alternateTimer = 0;
      this.showBeso = !this.showBeso;
      this.mariaImg.setTexture(this.showBeso ? ASSETS.MARIA_BESO : ASSETS.MARIA_QUIETA);
      this.agusImg.setTexture(this.showBeso ? ASSETS.AGUS_BESO : ASSETS.TS_AGUS_2);
    }

    // Física simple de monedas
    for (const c of this.coins) {
      c.vy += this.GRAVITY * dt;
      c.img.x += c.vx * dt;
      c.img.y += c.vy * dt;

      // Rebote en el suelo
      if (c.img.y >= GAME.HEIGHT - 8) {
        c.img.y = GAME.HEIGHT - 8;
        c.vy = -Math.abs(c.vy) * this.BOUNCE;
        // Si casi no tiene velocidad, darle un pequeño impulso para que siga
        if (Math.abs(c.vy) < 30) c.vy = -Phaser.Math.Between(80, 150);
      }

      // Rebote en paredes laterales
      if (c.img.x < 8) {
        c.img.x = 8;
        c.vx = Math.abs(c.vx);
      } else if (c.img.x > GAME.WIDTH - 8) {
        c.img.x = GAME.WIDTH - 8;
        c.vx = -Math.abs(c.vx);
      }
    }
  }

  private skip(): void {
    if (this.skipHandled) return;
    this.skipHandled = true;
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENES.MENU);
    });
  }
}
