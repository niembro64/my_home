import { __DEV__ } from '../../App';
import { Platform, Player, SpriteStateName } from '../../typescript';
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

  const k = player;
  const s = k.sprite;
  const xCenter = s.x + s.width * 0.5;


  const deadzoneWidth = 0;
  const mouseVert = 75;

  if (xCenter + deadzoneWidth < gotoX) {
    // if (k.sprite.body.x + deadzoneWidth < gotoX) {
    k.sprite.setVelocityX(k.sprite.body.velocity.x + k.velX);
  } else if (xCenter - deadzoneWidth > gotoX) {
    // } else if (k.sprite.body.x - deadzoneWidth > gotoX) {
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

// 13 * 4 + 2 = 54

  const speedMult = 10;

  const k = player;
  const s = k.sprite;
  const xCenter = s.x + s.width * 0.5;
  // __DEV__ && console.log('width', s.width);
  const deadzoneWidth = 20;
  const pVelKeep = 0.2;

  if (xCenter + deadzoneWidth < gotoX) {
    k.sprite.setVelocityX(
      k.sprite.body.velocity.x * pVelKeep + k.velX * speedMult
    );
  } else if (xCenter - deadzoneWidth > gotoX) {
    k.sprite.setVelocityX(
      +k.sprite.body.velocity.x * pVelKeep - k.velX * speedMult
    );
  }

  if (game.mouse.y < k.sprite.body.y) {
    setJump(player, game);
  }
};

export const setJump = (player: Player, game: GameScene): void => {
  const mouse = game.input.activePointer;
  __DEV__ && console.log('JUMP');
  let { x, y } = getNormalizedVector(
    player.sprite.body.x,
    player.sprite.body.y,
    mouse.x,
    mouse.y
  );

  __DEV__ && console.log('x', x);

  const xVel = x * player.jumpPower;
  const yVel = Math.max(Math.abs(y) * player.jumpPower, player.jumpPower * 0.5);

  // player.sprite.setVelocityX(xVel);
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

export function updateSpriteState(
  newState: SpriteStateName,
  player: Player,
  game: GameScene
): void {
  if (newState === player.spriteStateName) {
    return;
  }

  player.spriteStateName = newState;
  const s = player.sprite;

  switch (newState) {
    case 'idle':
      s.anims.play('idle', true);
      break;
    case 'walk':
      s.anims.play('walk', true);
      break;
    case 'jumpUp':
      s.anims.play('jumpUp', true);
      break;
    case 'jumpDown':
      s.anims.play('jumpDown', true);
      break;
    case 'climb':
      s.anims.play('climb', true);
      break;
  }
}

export const updateSprite = (player: Player, game: GameScene): void => {
  const k = player;
  const s = k.sprite;

  const movingXThreshold = 10;

  let mHoriz =
    s.body.velocity.x > movingXThreshold ||
    s.body.velocity.x < -movingXThreshold;

  if (s.body.touching.down) {
    if (mHoriz) {
      updateSpriteState('walk', k, game);
      return;
    } else {
      updateSpriteState('idle', k, game);
      return;
    }
  }

  if (s.body.touching.left || s.body.touching.right) {
    updateSpriteState('climb', k, game);
    return;
  }

  if (k.sprite.body.velocity.y < 0) {
    updateSpriteState('jumpDown', k, game);
    return;
  } else {
    updateSpriteState('jumpUp', k, game);
    return;
  }
};
