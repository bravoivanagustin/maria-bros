import { EVENTS } from '../utils/constants';
import type { Maria } from '../entities/Maria';
import type { Goomba } from '../entities/enemies/Goomba';
import type { Coin } from '../entities/collectibles/Coin';
import type { Agustin } from '../entities/Agustin';

export class CollisionSystem {
  private hasWon: boolean = false;

  constructor(private scene: Phaser.Scene) {}

  public setup(
    maria: Maria,
    enemies: Phaser.Physics.Arcade.Group,
    coins: Phaser.Physics.Arcade.StaticGroup,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
    agustin: Agustin,
  ): void {
    // scene.physics es ArcadePhysics en nuestro config
    const physics = this.scene.physics as unknown as Phaser.Physics.Arcade.ArcadePhysics;

    // María vs suelo
    physics.add.collider(maria, groundLayer);

    // Enemigos vs suelo (para que no caigan)
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

        // Stomp: María cae y su bottom está cerca del top del enemigo
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

    // María vs monedas
    physics.add.overlap(
      maria,
      coins,
      (_playerObj, coinObj) => {
        const coin = coinObj as Coin;
        coin.collect();
      },
      undefined,
      this,
    );

    // María vs Agustín (condición de victoria)
    physics.add.overlap(
      maria,
      agustin,
      () => {
        if (!this.hasWon) {
          this.hasWon = true;
          this.scene.events.emit(EVENTS.LEVEL_WIN);
        }
      },
      undefined,
      this,
    );
  }

  public reset(): void {
    this.hasWon = false;
  }
}
