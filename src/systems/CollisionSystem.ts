import { EVENTS } from '../utils/constants';
import type { Maria } from '../entities/Maria';
import type { Goomba } from '../entities/enemies/Goomba';
import type { Coin } from '../entities/collectibles/Coin';
import type { CoinBlock } from '../entities/CoinBlock';
import type { FlagPole } from '../entities/FlagPole';

export class CollisionSystem {
  private hasWon: boolean = false;

  constructor(private scene: Phaser.Scene) {}

  public setup(
    maria: Maria,
    enemies: Phaser.Physics.Arcade.Group,
    coins: Phaser.Physics.Arcade.StaticGroup,
    coinBlocks: Phaser.GameObjects.Group,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
    flagPole: FlagPole,
  ): void {
    const physics = this.scene.physics as unknown as Phaser.Physics.Arcade.ArcadePhysics;

    // María vs suelo
    physics.add.collider(maria, groundLayer);

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

    // María vs bloques de moneda — colisión sólida + detección desde abajo
    physics.add.collider(
      maria,
      coinBlocks,
      (playerObj, blockObj) => {
        const block = blockObj as CoinBlock;
        if (!block.isActive) return;

        const mariaBod = (playerObj as Maria).body as Phaser.Physics.Arcade.Body;

        // Golpe desde abajo: la cabeza de María quedó bloqueada por el bloque.
        // Se usa blocked.up porque velocity.y ya fue reseteada a 0 por Phaser
        // antes de invocar este callback.
        if (mariaBod.blocked.up) {
          block.hit();
        }
      },
      undefined,
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
