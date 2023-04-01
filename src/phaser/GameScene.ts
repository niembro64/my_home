import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload(): void {
    // Load assets here, for example:
    // this.load.image('logo', 'assets/logo.png');
  }

  create(): void {
    // Create game objects here, for example:
    // this.add.image(400, 300, 'logo');
  }

  update(): void {
    // Game loop logic here
  }
}
