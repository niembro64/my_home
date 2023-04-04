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
  project: ProjectName;
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
  nearestProject: ProjectName;
}

export interface Mouse {
  x: number;
  y: number;
}

export interface Project {
  title: ProjectName;
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
  | null;
