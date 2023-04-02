import Phaser from 'phaser';
import { Platform, Player } from '../typescript';

export default class GameScene extends Phaser.Scene {
  kirby: Player;
  platforms: Platform[];

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
        x: 100,
        y: 200,
        width: 200,
        height: 100,
      },
      {
        sprite: null,
        x: 200,
        y: 500,
        width: 200,
        height: 100,
      },
    ];
  }

  preload(): void {
    this.load.image('k', 'k.png');
  }

  create(): void {
    const plats = this.platforms;
    const k = this.kirby;

    const phy = this.physics;

    k.sprite = phy.add.sprite(k.x, k.y, 'k').setOrigin(0.5, 0.5).setScale(2);
    plats.forEach((p, pIndex) => {
      p.sprite = this.add.graphics();
      p.sprite.fillStyle(0x0000ff);
      p.sprite.fillRect(p.x, p.y, p.width, p.height);
      phy.add.existing(p.sprite, true);
      phy.add.collider(k.sprite, p.sprite);
    });

    k.sprite.setCollideWorldBounds(true);
  }

  update(): void {}
}
