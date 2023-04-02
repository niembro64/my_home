import Phaser from 'phaser';
import { Platform, Player } from '../typescript';

export default class GameScene extends Phaser.Scene {
  kirby: Player;
  platforms: Platform[];
  mouseX: number;
  mouseY: number;

  constructor() {
    super('GameScene');

    this.kirby = {
      sprite: null,
      x: 400,
      y: 300,
    };

    this.platforms = [
      {
        sprite: null,
        graphic: null,
        x: 100,
        y: 200,
        width: 200,
        height: 100,
      },
      {
        sprite: null,
        graphic: null,
        x: 200,
        y: 500,
        width: 200,
        height: 100,
      },
    ];

    this.mouseX = 0;
    this.mouseY = 0;
  }

  preload(): void {
    this.load.image('k', 'k.png');
  }

  create(): void {
    const p = this.platforms;
    const k = this.kirby;

    const phy = this.physics;

    k.sprite = this.physics.add
      .sprite(k.x, k.y, 'k')
      .setOrigin(0.5, 0.5)
      .setScale(2)
      .setCollideWorldBounds(true);

    p.forEach((platform, pIndex) => {
      // Create a Phaser.Geom.Rectangle
      const rect = new Phaser.Geom.Rectangle(
        platform.x,
        platform.y,
        platform.width,
        platform.height
      );

      // Draw the rectangle using graphics
      platform.graphic = this.add
        .graphics({ fillStyle: { color: 0x0000ff } })
        .fillRectShape(rect);

      // Create a static Arcade Physics body for the rectangle
      platform.sprite = this.physics.add
        .staticGroup()
        .add(
          this.add
            .rectangle(
              platform.x,
              platform.y,
              platform.width,
              platform.height,
              0x0000ff,
              0
            )
            .setOrigin(0)
        );

      // Add collider between Kirby and the platform
      phy.add.collider(k.sprite, platform.sprite);
    });

    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.mouseX = pointer.x;
      this.mouseY = pointer.y;
    });
  }

  update(): void {
    const k = this.kirby;
    const p = this.platforms;

    if (this.input.activePointer.isDown) {
      k.sprite.setVelocityX(0);
      k.sprite.setVelocityY(0);

      if (this.mouseX < k.sprite.body.x) {
        k.sprite.setVelocityX(-100);
      } else if (this.mouseX > k.x) {
        k.sprite.setVelocityX(100);
      }

      if (this.mouseY < k.sprite.body.y) {
        k.sprite.setVelocityY(-100);
      } else if (this.mouseY > k.y) {
        k.sprite.setVelocityY(100);
      }
    }

    console.log('Mouse X:', this.mouseX, 'Mouse Y:', this.mouseY);
  }
}
