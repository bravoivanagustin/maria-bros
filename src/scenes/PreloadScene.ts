import { ASSETS, SCENES } from '../utils/constants';
import { AnimationHelper } from '../utils/AnimationHelper';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.PRELOAD });
  }

  preload(): void {
    this.load.tilemapTiledJSON(ASSETS.LEVEL1_MAP, 'assets/tilemaps/levels/level1.json');

    // Tilesets del nivel 1
    this.load.image(ASSETS.TS_BLOQUES,   'assets/tilemaps/tilesets/bloques16x16.png');
    this.load.image(ASSETS.TS_NUBES,     'assets/tilemaps/tilesets/nubes.png');
    this.load.image(ASSETS.TS_TILESET,   'assets/tilemaps/tilesets/tileset.png');
    this.load.image(ASSETS.TS_POSTE,     'assets/tilemaps/tilesets/poste.png');
    this.load.image(ASSETS.TS_TUBO_LAT,  'assets/tilemaps/tilesets/tubo_lat.png');
    this.load.image(ASSETS.TS_MONTANAS,  'assets/tilemaps/tilesets/montañas.png');

    // Frames reales de María — se componen en buildMariaTexture()
    this.load.image('maria-quieta',      'assets/sprites/player/maria-quieta.png');
    this.load.image('maria-corriendo-1', 'assets/sprites/player/maria-corriendo-1.png');
    this.load.image('maria-corriendo-2', 'assets/sprites/player/maria-corriendo-2.png');
    this.load.image('maria-corriendo-3', 'assets/sprites/player/maria-corriendo-3.png');
    this.load.image('maria-saltando',    'assets/sprites/player/maria-saltando.png');
    this.load.image('maria-perdio',      'assets/sprites/player/maria-perdio.png');

    // Frames del coin block — activo y usado (16×16 cada uno)
    this.load.image('coinblock-activo', 'assets/sprites/ui/coinblock-activo.png');
    this.load.image('coinblock-usado',  'assets/sprites/ui/coinblock-usado.png');

    // Frames reales del gato enemigo — se componen en buildGoombaTexture()
    this.load.image('gato-malo-1',  'assets/sprites/enemies/gato-malo-1.png');
    this.load.image('gato-malo-2',  'assets/sprites/enemies/gato-malo-2.png');
    this.load.image('gato-malo-3',  'assets/sprites/enemies/gato-malo-3.png');
    this.load.image('gato-bueno-1', 'assets/sprites/enemies/gato-bueno-1.png');
    this.load.image('gato-bueno-2', 'assets/sprites/enemies/gato-bueno-2.png');
    this.load.image('gato-bueno-3', 'assets/sprites/enemies/gato-bueno-3.png');
  }

  create(): void {
    this.generatePlaceholderTextures();
    AnimationHelper.createAll(this.anims);
    // Esperar que la fuente pixel art cargue antes de mostrar texto
    document.fonts.load('10px "Press Start 2P"').then(() => {
      this.scene.start(SCENES.MENU);
    }).catch(() => {
      this.scene.start(SCENES.MENU);
    });
  }

  private generatePlaceholderTextures(): void {
    this.buildMariaTexture();
    this.buildGoombaTexture();
    this.generateCoinTexture();
    this.generateAgustinTexture();
    this.generateTilesetTexture();
    this.generateFlagZoneTexture();
    this.generateCoinBlockTexture();
  }

  // María: 6 frames × 16×16 = 96×16 px
  // idle(0) walk(1-3) jump(4) perdio(5)
  private buildMariaTexture(): void {
    const F = 16; // frame size

    const realFrames: string[] = [
      'maria-quieta',       // 0 - idle
      'maria-corriendo-1',  // 1 - walk
      'maria-corriendo-2',  // 2 - walk
      'maria-corriendo-3',  // 3 - walk
      'maria-saltando',     // 4 - jump
      'maria-perdio',       // 5 - death
    ];

    const tex = this.textures.createCanvas(ASSETS.PLAYER, F * 6, F)!;
    const ctx = tex.getContext() as CanvasRenderingContext2D;

    // Dibujar los 6 frames reales, escalando cada uno a 16×16
    for (let i = 0; i < realFrames.length; i++) {
      const src = this.textures.get(realFrames[i]).getSourceImage() as HTMLImageElement;
      ctx.drawImage(src, 0, 0, src.width, src.height, i * F, 0, F, F);
    }

    // Registrar los 6 frames en la textura
    for (let i = 0; i < 6; i++) {
      tex.add(i, 0, i * F, 0, F, F);
    }
    tex.refresh();
  }

  // Gato enemigo: 6 frames × 16×16 = 96×16 px
  // walk(0-2) = gato-malo-1/2/3.png  |  dead(3-5) = gato-bueno-1/2/3.png
  private buildGoombaTexture(): void {
    const F = 16;
    const frames: string[] = [
      'gato-malo-1',   // 0 - caminando A
      'gato-malo-2',   // 1 - caminando B
      'gato-malo-3',   // 2 - caminando C
      'gato-bueno-1',  // 3 - aplastado A
      'gato-bueno-2',  // 4 - aplastado B
      'gato-bueno-3',  // 5 - aplastado C
    ];

    const tex = this.textures.createCanvas(ASSETS.ENEMY_GOOMBA, F * 6, F)!;
    const ctx = tex.getContext() as CanvasRenderingContext2D;

    for (let i = 0; i < frames.length; i++) {
      const src = this.textures.get(frames[i]).getSourceImage() as HTMLImageElement;
      ctx.drawImage(src, 0, 0, src.width, src.height, i * F, 0, F, F);
    }

    for (let i = 0; i < 6; i++) {
      tex.add(i, 0, i * F, 0, F, F);
    }
    tex.refresh();
  }

  // Coin: 4 frames × 16×16 = 64×16 px
  private generateCoinTexture(): void {
    const gfx = this.make.graphics();

    const widths = [10, 6, 2, 6]; // simulación de giro

    for (let i = 0; i < 4; i++) {
      const fx = i * 16;
      const w = widths[i];
      const offX = (10 - w) / 2;

      // Brillo exterior
      gfx.fillStyle(0xffa500);
      gfx.fillRect(fx + 3 + offX, 3, w, 10);

      // Centro dorado
      gfx.fillStyle(0xffdd00);
      if (w > 2) {
        gfx.fillRect(fx + 4 + offX, 4, w - 2, 8);
      }

      // Reflejo
      if (w >= 6) {
        gfx.fillStyle(0xffffff);
        gfx.fillRect(fx + 4 + offX, 4, 2, 3);
      }
    }

    gfx.generateTexture(ASSETS.COIN, 64, 16);
    gfx.destroy();
    const coinTex = this.textures.get(ASSETS.COIN);
    for (let i = 0; i < 4; i++) {
      coinTex.add(i, 0, i * 16, 0, 16, 16);
    }
  }

  // Agustín: 2 frames × 16×16 = 32×16 px
  private generateAgustinTexture(): void {
    const gfx = this.make.graphics();

    for (let i = 0; i < 2; i++) {
      const fx = i * 16;

      // Cuerpo azul (camisa)
      gfx.fillStyle(0x1a4fd6);
      gfx.fillRect(fx + 3, 5, 10, 9);

      // Pelo oscuro
      gfx.fillStyle(0x1a1a1a);
      gfx.fillRect(fx + 2, 1, 12, 5);

      // Cara
      gfx.fillStyle(0xffe0bd);
      gfx.fillRect(fx + 4, 3, 8, 5);

      // Ojos
      gfx.fillStyle(0x000000);
      gfx.fillRect(fx + 5, 5, 2, 2);
      gfx.fillRect(fx + 9, 5, 2, 2);

      // Sonrisa
      gfx.fillRect(fx + 6, 7, 4, 1);

      // Corazón (pequeño, rosa) — detalle especial
      gfx.fillStyle(0xff69b4);
      gfx.fillRect(fx + 6, 6, 1, 1);
      gfx.fillRect(fx + 9, 6, 1, 1);

      // Pantalón
      gfx.fillStyle(0x333333);
      gfx.fillRect(fx + 4, 13, 3, 3);
      gfx.fillRect(fx + 9, 13, 3, 3);

      // Pequeña diferencia entre frames (brazo)
      gfx.fillStyle(0x1a4fd6);
      if (i === 0) {
        gfx.fillRect(fx + 1, 6, 2, 3);
      } else {
        gfx.fillRect(fx + 13, 6, 2, 3);
      }
    }

    gfx.generateTexture(ASSETS.PRINCESS, 32, 16);
    gfx.destroy();
    const agustinTex = this.textures.get(ASSETS.PRINCESS);
    for (let i = 0; i < 2; i++) {
      agustinTex.add(i, 0, i * 16, 0, 16, 16);
    }
  }

  // Coin block: 32×16 px — frame 0 activo, frame 1 usado
  // Si existen los sprites reales los usa; sino genera un placeholder.
  private generateCoinBlockTexture(): void {
    const F = 16;
    const hasReal =
      this.textures.exists('coinblock-activo') &&
      this.textures.exists('coinblock-usado');

    if (hasReal) {
      const tex = this.textures.createCanvas(ASSETS.COIN_BLOCK, F * 2, F)!;
      const ctx = tex.getContext() as CanvasRenderingContext2D;

      for (const [i, key] of (['coinblock-activo', 'coinblock-usado'] as const).entries()) {
        const src = this.textures.get(key).getSourceImage() as HTMLImageElement;
        ctx.drawImage(src, 0, 0, src.width, src.height, i * F, 0, F, F);
      }

      tex.add(0, 0,  0, 0, F, F);
      tex.add(1, 0, F, 0, F, F);
      tex.refresh();
      return;
    }

    // Placeholder: bloque naranja con "?" y estado usado marrón
    const gfx = this.make.graphics();

    gfx.fillStyle(0xd07000);
    gfx.fillRect(0, 0, 16, 16);
    gfx.fillStyle(0xf0a000);
    gfx.fillRect(1, 1, 14, 14);
    gfx.fillStyle(0xffe060);
    gfx.fillRect(1, 1, 14, 2);
    gfx.fillRect(1, 1, 2, 14);
    gfx.fillStyle(0xffffff);
    gfx.fillRect(6, 3, 4, 2);
    gfx.fillRect(8, 5, 2, 2);
    gfx.fillRect(6, 7, 4, 2);
    gfx.fillRect(7, 11, 2, 2);

    gfx.fillStyle(0x5c3a10);
    gfx.fillRect(16, 0, 16, 16);
    gfx.fillStyle(0x7a5020);
    gfx.fillRect(17, 1, 14, 14);
    gfx.fillStyle(0x3a2008);
    gfx.fillRect(17, 1, 14, 1);
    gfx.fillRect(17, 14, 14, 1);
    gfx.fillRect(17, 1, 1, 14);
    gfx.fillRect(30, 1, 1, 14);

    gfx.generateTexture(ASSETS.COIN_BLOCK, 32, 16);
    gfx.destroy();

    const tex = this.textures.get(ASSETS.COIN_BLOCK);
    tex.add(0, 0,  0, 0, 16, 16);
    tex.add(1, 0, 16, 0, 16, 16);
  }

  // Flag zone: 1×1 px blanco — usado como hitzone invisible del mástil
  private generateFlagZoneTexture(): void {
    const gfx = this.make.graphics();
    gfx.fillStyle(0xffffff);
    gfx.fillRect(0, 0, 1, 1);
    gfx.generateTexture(ASSETS.FLAG_ZONE, 1, 1);
    gfx.destroy();
  }

  // Tileset: 16×16 px — un solo tile de suelo
  private generateTilesetTexture(): void {
    const gfx = this.make.graphics();

    // Base ladrillo
    gfx.fillStyle(0x8b6914);
    gfx.fillRect(0, 0, 16, 16);

    // Líneas de ladrillo
    gfx.fillStyle(0x5c4000);
    gfx.fillRect(0, 0, 16, 1);
    gfx.fillRect(0, 8, 16, 1);
    gfx.fillRect(0, 0, 1, 16);
    gfx.fillRect(8, 8, 1, 8);
    gfx.fillRect(4, 0, 1, 8);
    gfx.fillRect(12, 0, 1, 8);

    // Brillo superior
    gfx.fillStyle(0xc49a00, 0.4);
    gfx.fillRect(0, 0, 16, 2);

    gfx.generateTexture(ASSETS.TILESET_WORLD1, 16, 16);
    gfx.destroy();
  }
}
