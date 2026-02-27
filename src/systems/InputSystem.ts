export class InputSystem {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpPressed: boolean = false;

  constructor(scene: Phaser.Scene) {
    // Non-null assertion justified: keyboard plugin always present in our game config
    this.cursors = scene.input.keyboard!.createCursorKeys();
  }

  public update(): void {
    // Track jump as a single press (not held)
    if (this.cursors.up.isDown || this.cursors.space.isDown) {
      if (!this.jumpPressed) {
        this.jumpPressed = true;
      }
    } else {
      this.jumpPressed = false;
    }
  }

  public isLeft(): boolean {
    return this.cursors.left.isDown;
  }

  public isRight(): boolean {
    return this.cursors.right.isDown;
  }

  public isJump(): boolean {
    return this.cursors.up.isDown || this.cursors.space.isDown;
  }

  public isJustJumped(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.space);
  }
}
