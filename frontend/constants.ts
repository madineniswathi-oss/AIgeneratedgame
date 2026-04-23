import { Track } from './types';

export const GRID_SIZE = 20;
export const CELL_SIZE = 20; // pixels
export const INITIAL_SPEED = 150; // ms per tick
export const SPEED_INCREMENT = 2; // ms to decrease per food eaten
export const MIN_SPEED = 50;

// Using reliable public domain / free-to-use audio URLs for demo purposes
export const DUMMY_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Neon Overdrive (AI Gen)',
    artist: 'CyberMinds',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372
  },
  {
    id: 'track-2',
    title: 'Synthetic Pulse (AI Gen)',
    artist: 'Neural Network',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425
  },
  {
    id: 'track-3',
    title: 'Digital Horizon (AI Gen)',
    artist: 'Algorithm X',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 344
  }
];
