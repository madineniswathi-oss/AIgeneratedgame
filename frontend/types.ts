export interface Point {
  x: number;
  y: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number; // in seconds, approximate for dummy data
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}
