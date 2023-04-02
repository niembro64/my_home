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
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player  {
  sprite: any | null;
  x: number;
  y: number;
}