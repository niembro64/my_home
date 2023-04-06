import { Platform, Player } from '../../typescript';
import GameScene from '../GameScene';
import { getDistance, getNormalizedVector } from './math';

export const goToLocationAir = (
  player: Player,
  gotoX: number,
  gotoY: number,
  game: GameScene
): void => {
  if (player.sprite.body.touching.down) {
    return;
  }

  const k = player;
  const width = 0;
  // const width = k.sprite.width * 0.3;

  if (k.sprite.body.x + width < gotoX) {
    k.sprite.setVelocityX(k.sprite.body.velocity.x + k.velX);
  } else if (k.sprite.body.x - width > gotoX) {
    k.sprite.setVelocityX(k.sprite.body.velocity.x - k.velX);
  }

  if (game.mouse.y < k.sprite.body.y) {
    setJump(player);
  }
};

export const goToLocationGround = (
  player: Player,
  gotoX: number,
  gotoY: number,
  game: GameScene
): void => {
  if (!player.sprite.body.touching.down) {
    return;
  }
  const speed = 10;

  const k = player;
  const width = 50;
  const percentVel = 0.1;
  // const width = k.sprite.width * 0.3;

  if (k.sprite.body.x + width < gotoX) {
    k.sprite.setVelocityX(
      k.velX * speed + k.sprite.body.velocity.x * percentVel
    );
  } else if (k.sprite.body.x - width > gotoX) {
    k.sprite.setVelocityX(
      1 - k.velX * speed + k.sprite.body.velocity.x * percentVel
    );
  }

  if (game.mouse.y < k.sprite.body.y) {
    setJump(player);
  }
};

export const setJump = (player: Player): void => {
  const k = player;
  k.sprite.setVelocityY(-k.jumpPower);
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

export const updateJustTouchedGround = (
  player: Player,
  game: GameScene
): void => {
  const k = player;

  if (k.sprite.body.touching.down && !k.isTouchingPrev) {
    console.log('PHASER | k.nearestProject', k.nearestProject);
    window.dispatchEvent(
      new CustomEvent('gameState', { detail: k.nearestProject })
    );
  } else if (!k.sprite.body.touching.down && k.isTouchingPrev) {
    window.dispatchEvent(new CustomEvent('gameState', { detail: null }));
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
): void => {
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
    k.nearestProject = platformNearest['box']['project'];
    return;
  }
  k.nearestProject = null;
};
