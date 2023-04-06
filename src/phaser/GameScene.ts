import Phaser from 'phaser';
import { Box, Mouse, Platform, Player } from '../typescript';
import {
  updateNearestPlatformUnderPlayer,
  updateGoLocationGround,
  updateGoLocationAir,
  setJump,
  updateJustTouchedGround,
  updatePlayerFrictionAir,
  updatePlayerFrictionGround,
} from './helpersPhaser/movement';
import { updateSpriteFlip } from './helpersPhaser/sprite';

export default class GameScene extends Phaser.Scene {
  kirby: Player;
  speedSlow: number = 20;
  speedFast: number = 30;
  platforms: Platform[];
  mouse: Mouse;
  objects: Phaser.Physics.Arcade.Sprite[] = [];

  constructor() {
    super('GameScene');

    this.kirby = {
      sprite: null,
      frictionGround: 0.85,
      frictionAir: 0.95,
      jumpPower: 600,
      posInitX: 400,
      posInitY: 300,
      velX: this.speedSlow,
      velY: 60,
      isTouchingPrev: false,
      nearestProject: null,
    };

    this.platforms = [];

    this.mouse = {
      x: 0,
      y: 0,
      pointerDownCurr: false,
      pointerDownPrev: false,
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
            project: box.project,
            left: box.left,
            top: box.top,
            width: box.width,
            height: box.height,
            x: box.x,
            y: box.y,
          },
        });
      });
    }

    console.log('phaser myBoxes', myBoxes);

    this.load.image('k', 'bigk.png');
    // this.load.image('k', 'k.png');
  }

  create(): void {
    const p = this.platforms;
    const k = this.kirby;

    const phy = this.physics;

    k.sprite = this.physics.add
      .sprite(k.posInitX, k.posInitY, 'k')
      .setOrigin(0.5, 0.5)
      .setCollideWorldBounds(true)
      .setScale(0.3)
      .setBounceX(1)
      .setBounceY(0.5);

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

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.kirby.velX !== this.speedFast) {
        this.kirby.velX = this.speedFast;
      }
      setJump(this.kirby);
      // if (this.kirby.sprite.body.velocity.y > -10) {
      // }
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.kirby.velX !== this.speedSlow) {
        this.kirby.velX = this.speedSlow;
      }
    });
  }

  update(): void {
    const k = this.kirby;

    updateGoLocationGround(k, this.mouse.x, this.mouse.y, this);
    updateGoLocationAir(k, this.mouse.x, this.mouse.y, this);
    updateSpriteFlip(k, this);
    updatePlayerFrictionGround(k);
    updatePlayerFrictionAir(k, this);
    updateNearestPlatformUnderPlayer(k, this);
    updateJustTouchedGround(k, this);
  }
}
