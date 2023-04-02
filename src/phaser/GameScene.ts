import Phaser from 'phaser';
import { Box, Mouse, Platform, Player } from '../typescript';
import {
  goToXY,
  updatePlayerFrictionAir,
  updatePlayerFrictionGround,
} from './helpers/movement';
import { updateSpriteFlip } from './helpers/sprite';

export default class GameScene extends Phaser.Scene {
  kirby: Player;
  platforms: Platform[];
  mouse: Mouse;

  constructor() {
    super('GameScene');

    this.kirby = {
      sprite: null,
      frictionGround: 0.8,
      frictionAir: 0.95,
      jumpPower: 800,
      posInitX: 400,
      posInitY: 300,
      velX: 20,
      velY: 60,
    };

    this.platforms = [
      // {
      //   sprite: null,
      //   graphic: null,
      //   box: {
      //     left: 100,
      //     top: 200,
      //     width: 200,
      //     height: 100,
      //   },
      // },
      // {
      //   sprite: null,
      //   graphic: null,
      //   box: {
      //     left: 400,
      //     top: 400,
      //     width: 200,
      //     height: 100,
      //   },
      // },
    ];

    this.mouse = {
      x: 0,
      y: 0,
    };
  }

  preload(): void {
    let myBoxes: Box[] = this.game.registry.get('myBoxes');
    if (myBoxes) {
      myBoxes.forEach((box: Box) => {
        this.platforms.push({
          sprite: null,
          graphic: null,
          box: {
            left: box.left,
            top: box.top,
            width: box.width,
            height: box.height,
          },
        });
      });
    }

    console.log('phaser myBoxes', myBoxes);

    this.load.image('k', 'k.png');
  }

  create(): void {
    const p = this.platforms;
    const k = this.kirby;

    const phy = this.physics;

    k.sprite = this.physics.add
      .sprite(k.posInitX, k.posInitY, 'k')
      .setOrigin(0.5, 0.5)
      .setCollideWorldBounds(true);

    p.forEach((platform, pIndex) => {
      // Create a Phaser.Geom.Rectangle
      const rect = new Phaser.Geom.Rectangle(
        platform.box.left,
        platform.box.top,
        platform.box.width,
        platform.box.height
      );

      // Draw the rectangle using graphics
      platform.graphic = this.add
        // .graphics()
        .graphics({ fillStyle: { color: 0x335544 } })
        .fillRectShape(rect);

      // Create a static Arcade Physics body for the rectangle
      platform.sprite = this.physics.add
        .staticGroup()
        .add(
          this.add
            .rectangle(
              platform.box.left,
              platform.box.top,
              platform.box.width,
              platform.box.height,
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
      this.mouse.x = pointer.x - this.kirby.sprite.body.width / 2;
      this.mouse.y = pointer.y - this.kirby.sprite.body.height / 2;
    });
  }

  update(): void {
    const k = this.kirby;

    goToXY(k, this.mouse.x, this.mouse.y, this);
    updateSpriteFlip(k, this);
    updatePlayerFrictionGround(k);
    updatePlayerFrictionAir(k, this);
  }
}
