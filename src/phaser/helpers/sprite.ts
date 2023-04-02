import { Player } from '../../typescript';
import GameScene from '../GameScene';

export const updateSpriteFlip = (player: Player, game: GameScene): void => {
  const k = player;
  if (k.sprite.body.velocity.x === 0) {
  } else if (k.sprite.body.velocity.x < 0) {
    k.sprite.flipX = true;
  } else {
    k.sprite.flipX = false;
  }
};
