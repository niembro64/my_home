export interface DebugOptions {
  devMode: boolean;
}

export const debugOptions: DebugOptions = {
  devMode: true,
};

export interface Screen {
  width: number;
  height: number;
}

export interface Platform {
  sprite: any | null;
  graphic: any | null;
  box: Box;
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Player {
  sprite: any | null;
  frictionGround: number;
  frictionAir: number;
  jumpPower: number;
  posInitX: number;
  posInitY: number;
  velX: number;
  velY: number;
}

export interface Mouse {
  x: number;
  y: number;
}
