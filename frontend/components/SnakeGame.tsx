import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, CELL_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { Trophy, RotateCcw, Play } from 'lucide-react';

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);

  // Refs to handle rapid key presses and avoid stale closures in the game loop
  const directionRef = useRef<Direction>(Direction.RIGHT);
  const nextDirectionRef = useRef<Direction>(Direction.RIGHT);
  const snakeRef = useRef<Point[]>(snake);

  // Sync refs with state
  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection(Direction.RIGHT);
    directionRef.current = Direction.RIGHT;
    nextDirectionRef.current = Direction.RIGHT;
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && gameOver) {
      resetGame();
      return;
    }

    if (e.key === ' ' && !gameOver) {
      setIsPaused(prev => !prev);
      return;
    }

    if (isPaused || gameOver) return;

    const currentDir = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== Direction.DOWN) nextDirectionRef.current = Direction.UP;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== Direction.UP) nextDirectionRef.current = Direction.DOWN;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== Direction.RIGHT) nextDirectionRef.current = Direction.LEFT;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== Direction.LEFT) nextDirectionRef.current = Direction.RIGHT;
        break;
    }
  }, [gameOver, isPaused, resetGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const currentDir = nextDirectionRef.current;
      directionRef.current = currentDir; // Update the actual direction being processed
      setDirection(currentDir); // Sync state for UI if needed

      const newHead = { ...head };

      switch (currentDir) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Check wall collision
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
        // Don't pop the tail, so it grows
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, highScore]);

  useEffect(() => {
    const intervalId = setInterval(gameLoop, speed);
    return () => clearInterval(intervalId);
  }, [gameLoop, speed]);

  const boardSize = GRID_SIZE * CELL_SIZE;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Score Header */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
        <div className="flex flex-col">
          <span className="text-neon-cyan text-sm uppercase tracking-widest">Score</span>
          <span className="text-3xl font-bold text-white drop-shadow-[0_0_8px_#0ff]">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-neon-pink text-sm uppercase tracking-widest flex items-center gap-1">
            <Trophy className="w-3 h-3" /> High
          </span>
          <span className="text-xl font-bold text-white drop-shadow-[0_0_5px_#f0f]">{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-neon-dark border-2 border-neon-cyan shadow-neon-cyan-inner rounded-sm overflow-hidden"
        style={{ width: boardSize, height: boardSize }}
      >
        {/* Grid Background (Optional, for aesthetic) */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#0ff 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)`,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
          }}
        />

        {/* Food */}
        <div
          className="absolute bg-neon-pink rounded-full shadow-neon-pink animate-pulse"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: food.x * CELL_SIZE + 1,
            top: food.y * CELL_SIZE + 1,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute rounded-sm ${isHead ? 'bg-white shadow-[0_0_10px_#fff]' : 'bg-neon-cyan shadow-[0_0_8px_#0ff]'}`}
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: segment.x * CELL_SIZE + 1,
                top: segment.y * CELL_SIZE + 1,
                opacity: isHead ? 1 : Math.max(0.3, 1 - (index / snake.length) * 0.6) // Fade tail slightly
              }}
            />
          );
        })}

        {/* Overlays */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <button 
              onClick={() => setIsPaused(false)}
              className="flex flex-col items-center text-neon-cyan hover:text-white transition-colors group"
            >
              <Play className="w-16 h-16 mb-2 drop-shadow-neon-cyan group-hover:drop-shadow-[0_0_15px_#fff]" />
              <span className="uppercase tracking-widest font-bold">Press Space to Start</span>
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-md">
            <h2 className="text-4xl font-bold text-neon-pink mb-2 drop-shadow-neon-pink uppercase tracking-widest">Game Over</h2>
            <p className="text-white mb-6 text-lg">Final Score: <span className="text-neon-cyan font-bold">{score}</span></p>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-neon-cyan text-neon-cyan rounded hover:bg-neon-cyan hover:text-black transition-all shadow-neon-cyan font-bold uppercase tracking-wider"
            >
              <RotateCcw className="w-5 h-5" /> Play Again
            </button>
          </div>
        )}
      </div>
      
      {/* Controls Hint */}
      <div className="mt-4 text-gray-500 text-xs uppercase tracking-widest flex gap-4">
        <span>WASD / Arrows to move</span>
        <span>Space to pause</span>
      </div>
    </div>
  );
};
