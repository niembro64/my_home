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
  const xChange = 100;
  const yChange = 100;

  let { x, y } = getNormalizedVector(
    k.sprite.body.x,
    k.sprite.body.y,
    gotoX,
    gotoY
  );

  k.sprite.setVelocityX(xChange * x + k.sprite.body.velocity.x);
  k.sprite.setVelocityY(yChange * y + k.sprite.body.velocity.y);
};

export const updatePlayerFriction = (player: Player): void => {
  if (!player.sprite.body.touching.down) {
    return;
  }

  const k = player;
  k.sprite.setVelocityX(k.sprite.body.velocity.x * k.frictionX);
};
