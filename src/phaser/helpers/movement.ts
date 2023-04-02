import { Player } from '../../typescript';
import GameScene from '../GameScene';

export const goToXY = (
  player: Player,
  gotoX: number,
  gotoY: number,
  game: GameScene
): void => {
  const k = player;

  if (game.input.activePointer.isDown) {
    if (gotoX < k.sprite.body.x) {
      k.sprite.setVelocityX(-100);
    } else if (gotoX > k.x) {
      k.sprite.setVelocityX(100);
    }

    if (gotoY < k.sprite.body.y) {
      k.sprite.setVelocityY(-100);
    } else if (gotoY > k.y) {
      k.sprite.setVelocityY(100);
    }
  }
};
