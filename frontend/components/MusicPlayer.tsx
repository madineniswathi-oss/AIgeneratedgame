import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <audio
        ref={audioRef}
        src={track.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      {/* Track Info */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="w-16 h-16 bg-neon-dark border border-neon-purple shadow-neon-purple rounded flex items-center justify-center animate-pulse">
          <Music className="text-neon-purple w-8 h-8" />
        </div>
        <div className="overflow-hidden">
          <h3 className="text-neon-purple font-bold text-lg truncate drop-shadow-[0_0_2px_#b026ff]">
            {track.title}
          </h3>
          <p className="text-gray-400 text-sm truncate">{track.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col space-y-4">
        {/* Progress Bar */}
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="flex-grow h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-purple"
            style={{
              background: `linear-gradient(to right, #b026ff ${progress}%, #374151 ${progress}%)`
            }}
          />
          <span>{formatTime(audioRef.current?.duration || track.duration)}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center space-x-6">
          <button 
            onClick={handlePrev}
            className="text-gray-300 hover:text-neon-purple transition-colors drop-shadow-[0_0_5px_rgba(176,38,255,0)] hover:drop-shadow-[0_0_8px_#b026ff]"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="w-12 h-12 rounded-full bg-neon-dark border-2 border-neon-purple flex items-center justify-center text-neon-purple shadow-neon-purple hover:bg-neon-purple hover:text-white transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-gray-300 hover:text-neon-purple transition-colors drop-shadow-[0_0_5px_rgba(176,38,255,0)] hover:drop-shadow-[0_0_8px_#b026ff]"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-800">
          <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-neon-purple">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-purple"
            style={{
              background: `linear-gradient(to right, #b026ff ${(isMuted ? 0 : volume) * 100}%, #374151 ${(isMuted ? 0 : volume) * 100}%)`
            }}
          />
        </div>
      </div>
    </div>
  );
};
