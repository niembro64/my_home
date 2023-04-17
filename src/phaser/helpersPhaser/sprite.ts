import { Player } from '../../typescript';
import GameScene from '../GameScene';

export const updateSpriteFlip = (player: Player, game: GameScene): void => {
  const k = player;
  const width = 150;

  if (k.sprite.body.touching.left) {
    k.sprite.flipX = true;
    return;
  } else if (k.sprite.body.touching.right) {
    k.sprite.flipX = false;
    return;
  }

  if (k.sprite.body.touching.up) {
    if (k.sprite.body.velocity.x < 0) {
      k.sprite.flipX = true;
      return;
    }
    k.sprite.flipX = false;
  }

  if (k.sprite.body.velocity.x < -width) {
    k.sprite.flipX = true;
  } else if (k.sprite.body.velocity.x > width) {
    k.sprite.flipX = false;
  }
};
