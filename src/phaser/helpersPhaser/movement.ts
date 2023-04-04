import { printMe } from '../../helpersReact/printing';
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
    // console.log("I'm touching the ground");
    // game.events.emit('phaserUpdate', { data: 'TOUCHING' });

    window.dispatchEvent(
      new CustomEvent('gameState', { detail: 'TOUCHING 2' })
    );
  } else if (!k.sprite.body.touching.down && k.isTouchingPrev) {
    // console.log("I'm off the ground");
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

  let platformNearest: Platform | null = null;
  let distanceNearest: number = Infinity;

  p.forEach((p: Platform) => {
    const distanceNew = getDistance(
      k.sprite.body.x,
      k.sprite.body.y,
      p.box.x,
      p.box.y
    );

    if (distanceNew < distanceNearest) {
      platformNearest = p;
      distanceNearest = distanceNew;
    }
  });

  if (platformNearest !== null && platformNearest['box'] !== null) {
    console.log('nearestPlatform.project', platformNearest['box']['project']);
    return platformNearest;
  }
  return null;
};

export const getNearestPlatformUnderPlayer = (
  player: Player,
  game: GameScene
): Platform | null => {
  const k = player;
  const p = game.platforms;

  let platformNearest: Platform | null = null;
  let distanceNearest: number = Infinity;

  p.forEach((p: Platform) => {
    const distanceNew = getDistance(
      k.sprite.body.x + k.sprite.body.width * 0.5,
      k.sprite.body.y + k.sprite.body.height * 0.5,
      p.box.x,
      p.box.y
    );

    if (distanceNew < distanceNearest && k.sprite.body.y < p.box.y) {
      platformNearest = p;
      distanceNearest = distanceNew;
    }
  });

  if (platformNearest !== null && platformNearest['box'] !== null) {
    printMe(
      'pNearest',
      platformNearest['box']['project'] +
        JSON.parse(platformNearest['box']['x']).toFixed(0) +
        'k' +
        k.sprite.x.toFixed(0)
    );
    // console.log(platformNearest['box']['project']);
    return platformNearest;
  }
  return null;
};
