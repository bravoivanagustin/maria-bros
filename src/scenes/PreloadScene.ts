import { ASSETS, SCENES } from '../utils/constants';
import { AnimationHelper } from '../utils/AnimationHelper';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.PRELOAD });
  }

  preload(): void {
    // Solo cargamos el JSON del tilemap — las texturas se generan en create()
    this.load.tilemapTiledJSON(ASSETS.LEVEL1_MAP, 'assets/tilemaps/levels/level1.json');
  }

  create(): void {
    this.generatePlaceholderTextures();
    AnimationHelper.createAll(this.anims);
    this.scene.start(SCENES.MENU);
  }

  private generatePlaceholderTextures(): void {
    this.generateMariaTexture();
    this.generateGoombaTexture();
    this.generateCoinTexture();
    this.generateAgustinTexture();
    this.generateTilesetTexture();
  }

  // María: 10 frames × 16×16 = 160×16 px
  // idle(0-1) walk(2-5) jump(6) death(7-9)
  private generateMariaTexture(): void {
    const gfx = this.make.graphics({ add: false });

    for (let i = 0; i < 10; i++) {
      const fx = i * 16;

      // Cuerpo base (rosa)
      gfx.fillStyle(0xff69b4);
      gfx.fillRect(fx + 3, 5, 10, 9);

      // Pelo (marrón oscuro)
      gfx.fillStyle(0x5c2a00);
      gfx.fillRect(fx + 2, 1, 12, 5);

      // Cara (piel)
      gfx.fillStyle(0xffe0bd);
      gfx.fillRect(fx + 4, 3, 8, 5);

      // Ojos
      if (i >= 7) {
        // Death: X eyes
        gfx.fillStyle(0x000000);
        gfx.fillRect(fx + 5, 4, 2, 1);
        gfx.fillRect(fx + 5, 6, 2, 1);
        gfx.fillRect(fx + 9, 4, 2, 1);
        gfx.fillRect(fx + 9, 6, 2, 1);
        // Gris tono muerte
        gfx.fillStyle(0x888888);
        gfx.fillRect(fx + 3, 5, 10, 9);
        gfx.fillStyle(0xffd0a0);
        gfx.fillRect(fx + 4, 3, 8, 5);
        gfx.fillStyle(0x000000);
        gfx.fillRect(fx + 5, 4, 2, 2);
        gfx.fillRect(fx + 9, 4, 2, 2);
      } else {
        gfx.fillStyle(0x000000);
        gfx.fillRect(fx + 5, 5, 2, 2);
        gfx.fillRect(fx + 9, 5, 2, 2);
      }

      // Piernas (azul para walk frames)
      if (i >= 2 && i <= 5) {
        const legOffset = (i % 2 === 0) ? 1 : -1;
        gfx.fillStyle(0x3a5bbf);
        gfx.fillRect(fx + 4, 13 + legOffset, 3, 3);
        gfx.fillRect(fx + 9, 13 - legOffset, 3, 3);
      } else {
        gfx.fillStyle(0x3a5bbf);
        gfx.fillRect(fx + 4, 13, 3, 3);
        gfx.fillRect(fx + 9, 13, 3, 3);
      }

      // Jump: brazos arriba
      if (i === 6) {
        gfx.fillStyle(0xff69b4);
        gfx.fillRect(fx + 1, 5, 2, 4);
        gfx.fillRect(fx + 13, 5, 2, 4);
      }
    }

    gfx.generateTexture(ASSETS.PLAYER, 160, 16);
    gfx.destroy();
    // Registrar los 10 frames de 16×16 para que generateFrameNumbers() los encuentre
    const mariaTex = this.textures.get(ASSETS.PLAYER);
    for (let i = 0; i < 10; i++) {
      mariaTex.add(i, 0, i * 16, 0, 16, 16);
    }
  }

  // Goomba: 4 frames × 16×16 = 64×16 px
  // walk(0-1) dead(2-3)
  private generateGoombaTexture(): void {
    const gfx = this.make.graphics({ add: false });

    for (let i = 0; i < 4; i++) {
      const fx = i * 16;

      if (i < 2) {
        // Cuerpo marrón
        gfx.fillStyle(0x7a3b00);
        gfx.fillRect(fx + 2, 3, 12, 10);

        // Ojos blancos con pupila
        gfx.fillStyle(0xffffff);
        gfx.fillRect(fx + 3, 4, 4, 4);
        gfx.fillRect(fx + 9, 4, 4, 4);
        gfx.fillStyle(0x000000);
        // Cejas amenazantes
        if (i === 0) {
          gfx.fillRect(fx + 4, 5, 2, 2);
          gfx.fillRect(fx + 10, 5, 2, 2);
        } else {
          gfx.fillRect(fx + 5, 5, 2, 2);
          gfx.fillRect(fx + 9, 5, 2, 2);
        }

        // Pies
        const footOff = (i === 0) ? 1 : -1;
        gfx.fillStyle(0x4a2000);
        gfx.fillRect(fx + 2, 13 + footOff, 4, 3);
        gfx.fillRect(fx + 10, 13 - footOff, 4, 3);
      } else {
        // Dead: aplastado
        gfx.fillStyle(0x7a3b00);
        gfx.fillRect(fx + 1, 11, 14, 5);
        gfx.fillStyle(0xffffff);
        gfx.fillRect(fx + 2, 12, 3, 2);
        gfx.fillRect(fx + 11, 12, 3, 2);
        gfx.fillStyle(0x000000);
        gfx.fillRect(fx + 3, 12, 2, 1);
        gfx.fillRect(fx + 11, 12, 2, 1);
      }
    }

    gfx.generateTexture(ASSETS.ENEMY_GOOMBA, 64, 16);
    gfx.destroy();
    const goombaTex = this.textures.get(ASSETS.ENEMY_GOOMBA);
    for (let i = 0; i < 4; i++) {
      goombaTex.add(i, 0, i * 16, 0, 16, 16);
    }
  }

  // Coin: 4 frames × 16×16 = 64×16 px
  private generateCoinTexture(): void {
    const gfx = this.make.graphics({ add: false });

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
    const gfx = this.make.graphics({ add: false });

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

  // Tileset: 16×16 px — un solo tile de suelo
  private generateTilesetTexture(): void {
    const gfx = this.make.graphics({ add: false });

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
