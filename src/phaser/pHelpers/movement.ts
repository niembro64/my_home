import { Platform, Player } from '../../typescript';
import GameScene from '../GameScene';
import { getDistance, getNormalizedVector } from './math';

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

export const updateJustTouchedGround = (
  player: Player,
  game: GameScene
): void => {
  const k = player;

  if (k.sprite.body.touching.down && !k.isTouchingPrev) {
    console.log("I'm touching the ground");
    // game.events.emit('phaserUpdate', { data: 'TOUCHING' });

    window.dispatchEvent(
      new CustomEvent('gameState', { detail: 'TOUCHING 2' })
    );
  } else if (!k.sprite.body.touching.down && k.isTouchingPrev) {
    console.log("I'm off the ground");
    // game.events.emit('phaserUpdate', { data: 'OFF' });
    window.dispatchEvent(new CustomEvent('gameState', { detail: 'OFF 2' }));
  } else {
  }

  k.isTouchingPrev = k.sprite.body.touching.down;
};

export const getNearestPlatform = (
  player: Player,
  game: GameScene
): Platform | null => {
  const k = player;
  const p = game.platforms;

  let nearestPlatform: Platform | null = null;
  let nearestDistance: number = Infinity;

  p.forEach((platform: Platform) => {
    const distance = getDistance(
      k.sprite.body.x,
      k.sprite.body.y,
      platform.box.x,
      platform.box.y
    );
    // const distance = Math.abs(k.sprite.body.x - platform.sprite.body.x);
    if (nearestPlatform === null || distance < nearestDistance) {
      nearestPlatform = platform;
      nearestDistance = distance;
    }
  });

  return nearestPlatform;
};
