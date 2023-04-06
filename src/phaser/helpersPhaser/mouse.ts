import GameScene from '../GameScene';

export const updateMouseClicks = (game: GameScene): void => {
  game.mouse.pointerDownPrev = game.mouse.pointerDownCurr;
  game.mouse.pointerDownCurr = game.input.activePointer.isDown;
};
