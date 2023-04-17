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
  project: ProjectName | null;
  left: number;
  top: number;
  width: number;
  height: number;
  x: number;
  y: number;
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
  isTouchingPrev: boolean;
  nearestProject: ProjectName | null;
  spriteStateName: SpriteStateName;
}

export interface Mouse {
  x: number;
  y: number;
  pointerDownCurr: boolean;
  pointerDownPrev: boolean;
}

export type ColorScheme = 'light' | 'dark';
export interface Project {
  title: ProjectName;
  colorScheme: ColorScheme;
  url: string;
  type: string;
  stack: string[];
}

export type ProjectName =
  | 'Design'
  | 'Smashed'
  | 'Pirates'
  | 'Events'
  | 'Shows'
  | 'Media'
  | 'Resume';

export interface Location2D {
  x: number;
  y: number;
}

export type SpriteStateName =
  | 'idle'
  | 'walk'
  | 'jumpUp'
  | 'jumpDown'
  | 'climbFast'
  | 'climbSlow';
