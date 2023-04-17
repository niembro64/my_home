import { __DEV__ } from '../../App';
import { Platform, Player, SpriteStateName } from '../../typescript';
import GameScene from '../GameScene';
import { getDistance, getNormalizedVector } from './math';
export const mouseVert = 75;

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

export const updateGoLocationWall = (
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

  if (game.mouse.y - mouseVert < k.sprite.body.y) {
    // setJump(player, game);
    k.sprite.setVelocityY(k.sprite.body.velocity.y - 100);
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

  if (game.mouse.y - mouseVert < k.sprite.body.y) {
    setJump(player, game);
  }
};
export const updateGoLocationCeiling = (
  player: Player,
  gotoX: number,
  gotoY: number,
  game: GameScene
): void => {
  if (!game.input.activePointer.isDown) {
    return;
  }

  // 13 * 4 + 2 = 54

  const speedMult = 3;

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

  if (game.mouse.y - mouseVert < k.sprite.body.y) {
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

  // player.sprite.setVelocityX(xVel);
  player.sprite.setVelocityY(-yVel);
};

export const updatePlayerFrictionGround = (player: Player): void => {
  const k = player;
  k.sprite.setVelocityX(k.sprite.body.velocity.x * k.frictionGround);
};

export const updatePlayerFrictionCeiling = (player: Player): void => {
  const k = player;
  k.sprite.setVelocityX(k.sprite.body.velocity.x * k.frictionGround * 0.1);
};

export const updatePlayerFrictionWall = (player: Player): void => {
  const k = player;
  k.sprite.setVelocityY(k.sprite.body.velocity.y * k.frictionGround * 0.1);
};

export const updatePlayerFrictionAir = (
  player: Player,
  game: GameScene
): void => {
  const k = player;
  k.sprite.setVelocityX(k.sprite.body.velocity.x * k.frictionAir);
  k.sprite.setVelocityY(k.sprite.body.velocity.y * k.frictionAir);
};

export const updateJustTouchedGround = (
  player: Player,
  game: GameScene
): void => {
  const k = player;

  let touchingAny: boolean =
    k.sprite.body.touching.down ||
    k.sprite.body.touching.up ||
    k.sprite.body.touching.left ||
    k.sprite.body.touching.right;

  if (touchingAny && !k.isTouchingPrev) {
    window.dispatchEvent(
      new CustomEvent('gameState', { detail: k.nearestProject })
    );
  } else if (!touchingAny && k.isTouchingPrev) {
    window.dispatchEvent(new CustomEvent('gameState', { detail: null }));
  } else {
  }

  k.isTouchingPrev = touchingAny;
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
export const updateNearestPlatformUnderPlayerNew = (
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

    if (distanceNew < distanceNearest) {
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
    case 'climbFast':
      s.anims.play('climbFast', true);
      break;
    case 'climbSlow':
      s.anims.play('climbSlow', true);
      break;
    case 'hangMove':
      s.anims.play('hangMove', true);
      break;
    case 'hangIdle':
      s.anims.play('hangIdle', true);
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
    }
    updateSpriteState('idle', k, game);
    return;
  }

  if (s.body.touching.up) {
    if (mHoriz) {
      updateSpriteState('hangMove', k, game);
      return;
    }

    updateSpriteState('hangIdle', k, game);
    return;
  }

  if (s.body.touching.left || s.body.touching.right) {
    if (s.body.velocity.y < 0) {
      updateSpriteState('climbFast', k, game);
      return;
    }

    updateSpriteState('climbSlow', k, game);
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
