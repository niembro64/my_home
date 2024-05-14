import Phaser from 'phaser';
import { __DEV__ } from '../App';
import { Box, Mouse, Platform, Player } from '../typescript';
import {
  setJump,
  updateGoLocationAir,
  updateGoLocationCeiling,
  updateGoLocationGround,
  updateGoLocationWall,
  updateJustTouchedGround,
  updateNearestPlatformUnderPlayer,
  updatePlayerFrictionAir,
  updatePlayerFrictionCeiling,
  updatePlayerFrictionGround,
  updatePlayerFrictionWall,
  updateSprite,
} from './helpersPhaser/movement';
import { updateSpriteFlip } from './helpersPhaser/sprite';

export default class GameScene extends Phaser.Scene {
  kirby: Player;
  speedSlow: number = 20;
  speedFast: number = 30;
  platforms: Platform[];
  mouse: Mouse;
  objects: Phaser.Physics.Arcade.Sprite[] = [];
  config: any;
  isMobile: boolean = false;

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
      spriteStateName: 'idle',
    };

    this.platforms = [];

    this.mouse = {
      x: 0,
      y: 0,
      pointerDownCurr: false,
      pointerDownPrev: false,
    };
  }

  setPointerPosition = (x: number, y: number) => {
    if (this.input && this.input.activePointer) {
      this.input.activePointer.position.setTo(x, y);
    }
  };

  preload(): void {
    this.config = this.game.config;
    this.isMobile = this.config.width < this.config.height;
    __DEV__ && console.log('this.config', this.config);
    __DEV__ && console.log('this.isMobile', this.isMobile);

    const k: { x: number; y: number } = this.game.registry.get('kirbyXY');
    const kirbyXY: { x: number; y: number } = {
      x: k.x - (13 * 4 + 2) * 0.5,
      y: k.y,
    };

    let myBoxes: Box[] = this.game.registry.get('myBoxes');
    if (myBoxes) {
      __DEV__ && console.log('phaser myBoxes', myBoxes);
      myBoxes.forEach((box: Box) => {
        __DEV__ && console.log('phaser box', box);
        this.platforms.push({
          sprite: null,
          graphic: null,
          box: {
            project: box.project,
            left: box.left,
            top: box.top,
            width: box.width,
            height: box.height,
            centerX: box.centerX,
            centerY: box.centerY,
          },
        });
      });
    }

    __DEV__ && console.log('phaser myBoxes', myBoxes);

    this.kirby.posInitX = kirbyXY.x;
    this.kirby.posInitY = kirbyXY.y;
    __DEV__ && console.log('kirbyXY', this.kirby);
    // this.load.image('k', 'bigk.png');

    // this.load.image('k', 'k.png');

    this.load.spritesheet({
      key: 'spritesheet',
      url: 'sprite_sheet_10.2_kirby_4x.png',
      // url: 'sprite_sheet_10.2_kirby_4x.png',
      // url: 'sprite_sheet_10.1_kirby_4x.png',
      // url: 'sprite_sheet_8.1_kirby_4x.png',
      frameConfig: {
        frameWidth: 13 * 4 + 2,
        frameHeight: 13 * 4 + 2,
        startFrame: 0,
        endFrame: 9,
        margin: 0,
        spacing: 0,
      },
    });
  }

  create(): void {
    createSpriteSheet(this);

    const p = this.platforms;
    // const k = this.kirby;

    const phy = this.physics;

    // k.sprite = this.physics.add
    //   .sprite(k.posInitX, k.posInitY, 'k')
    //   .setOrigin(0.5, 0.5)
    //   .setCollideWorldBounds(true)
    //   .setScale(0.3)
    //   .setBounceX(1)
    //   .setBounceY(0.5);

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
        .graphics({ fillStyle: { color: 0x693b29 } })
        // .graphics({ fillStyle: { color: 0x335544 } })
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
      phy.add.collider(this.kirby.sprite, platform.sprite);
    });

    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    // this.setPointerPosition = this.setPointerPosition.bind(this);

    // this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    //   console.log('pointer', pointer);
    //   this.mouse.x = pointer.x;
    //   this.mouse.y = pointer.y;
    //   // this.mouse.x = pointer.x - this.kirby.sprite.body.width / 2;
    //   // this.mouse.y = pointer.y - this.kirby.sprite.body.height / 2;
    // });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // if (this.kirby.velX !== this.speedFast) {
      //   this.kirby.velX = this.speedFast;
      // }
      setJump(this.kirby, this);
      // if (this.kirby.sprite.body.velocity.y > -10) {
      // }
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      // if (this.kirby.velX !== this.speedSlow) {
      //   this.kirby.velX = this.speedSlow;
      // }
    });
  }

  update(): void {
    const k = this.kirby;
    updateMouse(this.mouse, this);
    updateSpriteFlip(k, this);

    if (k.sprite.body.touching.down) {
      updatePlayerFrictionGround(k);
      updateGoLocationGround(k, this.mouse.x, this.mouse.y, this);
    } else if (k.sprite.body.touching.up) {
      updatePlayerFrictionCeiling(k);
      updateGoLocationCeiling(k, this.mouse.x, this.mouse.y, this);
    } else if (k.sprite.body.touching.left || k.sprite.body.touching.right) {
      updatePlayerFrictionWall(k);
      updateGoLocationWall(k, this.mouse.x, this.mouse.y, this);
    } else {
      updatePlayerFrictionAir(k, this);
      updateGoLocationAir(k, this.mouse.x, this.mouse.y, this);
    }
    // updateNearestPlatformUnderPlayerNew(k, this);
    updateNearestPlatformUnderPlayer(k, this);
    // updateNearestPlatform(k, this);
    updateJustTouchedGround(k, this);
    updateSprite(k, this);
  }
}

const updateMouse = (mouse: Mouse, game: GameScene) => {
  const p = game.input.activePointer;

  mouse.x = p.x;
  mouse.y = p.y;
};

function createSpriteSheet(game: GameScene): void {
  var config_idle = {
    key: 'idle',
    frames: game.anims.generateFrameNumbers('spritesheet', {
      start: 0,
      end: 0,
      first: 0,
    }),
    frameRate: 1,
    repeat: -1,
  };

  var config_walk = {
    key: 'walk',
    frames: game.anims.generateFrameNumbers('spritesheet', {
      start: 1,
      end: 3,
      first: 1,
    }),
    frameRate: 15,
    repeat: -1,
  };

  var config_jumpUp = {
    key: 'jumpUp',
    frames: game.anims.generateFrameNumbers('spritesheet', {
      start: 4,
      end: 4,
      first: 4,
    }),
    frameRate: 1,
    repeat: -1,
  };

  var config_jumpDown = {
    key: 'jumpDown',
    frames: game.anims.generateFrameNumbers('spritesheet', {
      start: 7,
      end: 7,
      first: 7,
    }),
    frameRate: 1,
    repeat: -1,
  };

  var config_climb_fast = {
    key: 'climbFast',
    frames: game.anims.generateFrameNumbers('spritesheet', {
      start: 5,
      end: 6,
      first: 5,
    }),
    frameRate: 10,
    repeat: -1,
  };

  var config_climb_slow = {
    key: 'climbSlow',
    frames: game.anims.generateFrameNumbers('spritesheet', {
      start: 5,
      end: 6,
      first: 5,
    }),
    frameRate: 5,
    repeat: -1,
  };

  var config_hang_move = {
    key: 'hangMove',
    frames: game.anims.generateFrameNumbers('spritesheet', {
      start: 8,
      end: 9,
      first: 8,
    }),
    frameRate: 8,
    repeat: -1,
  };

  var config_hang_idle = {
    key: 'hangIdle',
    frames: game.anims.generateFrameNumbers('spritesheet', {
      start: 8,
      end: 8,
      first: 8,
    }),
    frameRate: 1,
    repeat: -1,
  };

  game.anims.create(config_idle);
  game.anims.create(config_walk);
  game.anims.create(config_jumpUp);
  game.anims.create(config_jumpDown);
  game.anims.create(config_climb_fast);
  game.anims.create(config_climb_slow);
  game.anims.create(config_hang_move);
  game.anims.create(config_hang_idle);

  const k = game.kirby;
  k.sprite = game.physics.add
    .sprite(k.posInitX, k.posInitY, 'spritesheet')
    // .sprite(k.posInitX, k.posInitY, 'k')
    // .setOrigin(0, 1)
    .setOrigin(0, 0)
    // .setOrigin(0.5, 0.5)
    .setCollideWorldBounds(true)
    // .setScale(0.3)
    // .setBounceX(1)
    .setBounceY(0.5);

  // game.kirby.sprite.setScale(1);
}
