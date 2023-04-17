import { Platform, Player } from '../../typescript';
import GameScene from '../GameScene';
import { getDistance, getNormalizedVector } from './math';

export const updateGoLocationAir = (
  player: Player,
  gotoX: number,
  gotoY: number,
  game: GameScene
): void => {
  if (!game.input.activePointer.isDown) {
    return;
  }

  if (player.sprite.body.touching.down) {
    return;
  }

  const k = player;
  const deadzoneWidth = 0;
  const mouseVert = 75;

  if (k.sprite.body.x + deadzoneWidth < gotoX) {
    k.sprite.setVelocityX(k.sprite.body.velocity.x + k.velX);
  } else if (k.sprite.body.x - deadzoneWidth > gotoX) {
    k.sprite.setVelocityX(k.sprite.body.velocity.x - k.velX);
  }

  if (game.mouse.y - mouseVert < k.sprite.body.y) {
    setJump(player, game);
  }
};

export const updateGoLocationGround = (
  player: Player,
  gotoX: number,
  gotoY: number,
  game: GameScene
): void => {
  if (!game.input.activePointer.isDown) {
    return;
  }
  if (!player.sprite.body.touching.down) {
    return;
  }
  const speedMult = 10;

  const k = player;
  const deadzoneWidth = 20;
  const pVelKeep = 0.2;

  if (k.sprite.body.x + deadzoneWidth < gotoX) {
    k.sprite.setVelocityX(
      k.velX * speedMult + k.sprite.body.velocity.x * pVelKeep
    );
  } else if (k.sprite.body.x - deadzoneWidth > gotoX) {
    k.sprite.setVelocityX(
      1 - k.velX * speedMult + k.sprite.body.velocity.x * pVelKeep
    );
  }

  if (game.mouse.y < k.sprite.body.y) {
    setJump(player, game);
  }
};

export const setJump = (player: Player, game: GameScene): void => {
  const mouse = game.input.activePointer;
  let { x, y } = getNormalizedVector(
    player.sprite.body.x,
    player.sprite.body.y,
    mouse.x,
    mouse.y
  );

  const xVel = x * player.jumpPower;
  const yVel = Math.max(Math.abs(y) * player.jumpPower, player.jumpPower * 0.5);

  player.sprite.setVelocityX(xVel);
  player.sprite.setVelocityY(-yVel);
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
    window.dispatchEvent(
      new CustomEvent('gameState', { detail: k.nearestProject })
    );
  } else if (!k.sprite.body.touching.down && k.isTouchingPrev) {
    window.dispatchEvent(new CustomEvent('gameState', { detail: null }));
  } else {
  }

  k.isTouchingPrev = k.sprite.body.touching.down;
};

export const updateNearestPlatform = (
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
    return platformNearest;
  }
  return null;
};

export const updateNearestPlatformUnderPlayer = (
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

export function createSpriteSheet(game: GameScene): void {
  var config_idle = {
    key: 'animation_idle',
    frames: game.anims.generateFrameNumbers('spritesheet', {
      start: 0,
      end: 0,
      first: 0,
    }),
    frameRate: 1,
    repeat: -1,
  };

  var config_walk = {
    key: 'animation_walk',
    frames: game.anims.generateFrameNumbers('spritesheet', {
      start: 1,
      end: 3,
      first: 1,
    }),
    frameRate: 20,
    repeat: -1,
  };

  var config_jumpUp = {
    key: 'animation_jumpUp',
    frames: game.anims.generateFrameNumbers('spritesheet', {
      start: 4,
      end: 4,
      first: 4,
    }),
    frameRate: 1,
    repeat: -1,
  };

  var config_jumpDown = {
    key: 'animation_jumpDown',
    frames: game.anims.generateFrameNumbers('spritesheet', {
      start: 7,
      end: 7,
      first: 7,
    }),
    frameRate: 1,
    repeat: -1,
  };

  var config_climb = {
    key: 'animation_climb',
    frames: game.anims.generateFrameNumbers('spritesheet', {
      start: 5,
      end: 6,
      first: 5,
    }),
    frameRate: 10,
    repeat: -1,
  };

  game.anims.create(config_idle);
  game.anims.create(config_walk);
  game.anims.create(config_jumpUp);
  game.anims.create(config_jumpDown);
  game.anims.create(config_climb);
}
