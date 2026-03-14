import { EVENTS, GAME } from '../utils/constants';
import type { Maria } from '../entities/Maria';
import { MariaState } from '../entities/Maria';
import type { Goomba } from '../entities/enemies/Goomba';
import type { Coin } from '../entities/collectibles/Coin';
import type { CoinBlock } from '../entities/CoinBlock';
import type { BrickBlock } from '../entities/BrickBlock';
import type { FlagPole } from '../entities/FlagPole';
import type { Fish } from '../entities/enemies/Fish';

export class CollisionSystem {
  private hasWon: boolean = false;

  constructor(private scene: Phaser.Scene) {}

  public setup(
    maria: Maria,
    enemies: Phaser.Physics.Arcade.Group,
    fish: Phaser.GameObjects.Group,
    coins: Phaser.Physics.Arcade.StaticGroup,
    coinBlocks: Phaser.GameObjects.Group,
    brickBlocks: Phaser.GameObjects.Group,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
    flagPole: FlagPole,
  ): void {
    const physics = this.scene.physics as unknown as Phaser.Physics.Arcade.ArcadePhysics;

    // María vs suelo — durante WINNING ignora el bloque base del poste y cualquier
    // tile decorativo del mástil en esa columna, para que caiga al suelo real.
    const poleColX = Math.floor(flagPole.poleX / GAME.TILE_SIZE) * GAME.TILE_SIZE;
    physics.add.collider(
      maria,
      groundLayer,
      undefined,
      (playerObj, tileObj) => {
        if ((playerObj as Maria).getState() !== MariaState.WINNING) return true;
        const tile = tileObj as Phaser.Tilemaps.Tile;
        // Ignorar toda la fila base del poste (permite caer al suelo real)
        if (tile.pixelY === flagPole.poleBottomY) return false;
        // Ignorar tiles en la columna del poste por encima de la base (ej. tile decorativo row-1)
        if (tile.pixelX === poleColX && tile.pixelY < flagPole.poleBottomY) return false;
        return true;
      },
      this,
    );

    // Enemigos vs suelo
    physics.add.collider(enemies, groundLayer);

    // María vs enemigos
    physics.add.overlap(
      maria,
      enemies,
      (playerObj, enemyObj) => {
        const player = playerObj as Maria;
        const enemy = enemyObj as Goomba;

        if (!enemy.alive) return;

        const playerBody = player.body as Phaser.Physics.Arcade.Body;
        const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;

        const isStomp =
          playerBody.velocity.y > 50 &&
          playerBody.bottom <= enemyBody.center.y + 6;

        if (isStomp) {
          enemy.onStomped();
          player.bounceOnStomp();
        } else {
          enemy.onPlayerContact(player);
        }
      },
      undefined,
      this,
    );

    // María vs peces — siempre daña (no se pueden pisotear)
    physics.add.overlap(
      maria,
      fish,
      (playerObj, fishObj) => {
        (fishObj as Fish).onPlayerContact(playerObj as Maria);
      },
      undefined,
      this,
    );

    // María vs monedas flotantes
    physics.add.overlap(
      maria,
      coins,
      (_playerObj, coinObj) => {
        (coinObj as Coin).collect();
      },
      undefined,
      this,
    );

    // María vs bloques de moneda — colisión sólida + detección desde abajo.
    // Se usa processCallback (dispara ANTES de la resolución física) para leer velocity.y,
    // que ya es 0 en el callback principal después de la separación.
    physics.add.collider(
      maria,
      coinBlocks,
      undefined,
      (playerObj, blockObj) => {
        const block = blockObj as CoinBlock;
        if (!block.isActive) return true; // sólido pero sin activar
        const mariaBod = (playerObj as Maria).body as Phaser.Physics.Arcade.Body;
        if (mariaBod.velocity.y < -50) {
          block.hit();
        }
        return true; // siempre sólido
      },
      this,
    );

    // María vs bloques rompibles — mismo patrón
    physics.add.collider(
      maria,
      brickBlocks,
      undefined,
      (playerObj, blockObj) => {
        const block = blockObj as BrickBlock;
        if (!block.isBreakable) return true;
        const mariaBod = (playerObj as Maria).body as Phaser.Physics.Arcade.Body;
        if (mariaBod.velocity.y < -50) {
          block.hit();
        }
        return true;
      },
      this,
    );

    // María vs mástil de la bandera (condición de victoria)
    physics.add.overlap(
      maria,
      flagPole.getHitZone(),
      (playerObj) => {
        if (!this.hasWon) {
          this.hasWon = true;
          const player = playerObj as Maria;
          player.startWinSequence();
          flagPole.touch(player.y);
        }
      },
      undefined,
      this,
    );

    // Suprimir warning — EVENTS importado para otros archivos que extienden este sistema
    void EVENTS;
  }

  public reset(): void {
    this.hasWon = false;
  }
}
