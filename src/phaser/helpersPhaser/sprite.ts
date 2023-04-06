import { Player } from '../../typescript';
import GameScene from '../GameScene';

export const updateSpriteFlip = (player: Player, game: GameScene): void => {
  const k = player;
  const width = 150;
  if (k.sprite.body.velocity.x < -width) {
    k.sprite.flipX = true;
  } else if (k.sprite.body.velocity.x > width) {
    k.sprite.flipX = false;
  }
};
