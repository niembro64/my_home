import { Player } from '../../typescript';
import GameScene from '../GameScene';
import { getNormalizedVector } from './math';

export const goToXY = (
  player: Player,
  gotoX: number,
  gotoY: number,
  game: GameScene
): void => {
  const k = player;

  if (!game.input.activePointer.isDown) {
    return;
  }
  updatePlayerJump(k);

  let { x, y } = getNormalizedVector(
    k.sprite.body.x,
    k.sprite.body.y,
    gotoX,
    gotoY
  );

  k.sprite.setVelocityX(k.velX * x + k.sprite.body.velocity.x);
  if (game.mouse.y < k.sprite.body.y) {
    k.sprite.setVelocityY(k.velY * y + k.sprite.body.velocity.y);
  }
};

export const updatePlayerFrictionGround = (player: Player): void => {
  if (!player.sprite.body.touching.down) {
    return;
  }
  const k = player;
  k.sprite.setVelocityX(k.sprite.body.velocity.x * k.frictionGround);
};

export const updatePlayerFrictionAir = (
  player: Player,
  game: GameScene
): void => {
  if (player.sprite.body.touching.down) {
    return;
  }
  const k = player;
  k.sprite.setVelocityX(k.sprite.body.velocity.x * k.frictionAir);
  k.sprite.setVelocityY(k.sprite.body.velocity.y * k.frictionAir);
};

export const updatePlayerJump = (player: Player): void => {
  const k = player;
  if (k.sprite.body.touching.down) {
    k.sprite.setVelocityY(-k.jumpPower);
  }
};
