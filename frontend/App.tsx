import React from 'react';
import { NeonPanel } from './components/NeonPanel';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { Gamepad2 } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-neon-dark flex flex-col items-center justify-center p-4 md:p-8">
      
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-pink drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] uppercase tracking-tighter flex items-center justify-center gap-4">
          <Gamepad2 className="w-10 h-10 md:w-14 md:h-14 text-neon-cyan drop-shadow-neon-cyan" />
          Neon Synth Snake
        </h1>
        <p className="text-neon-purple mt-2 tracking-widest uppercase text-sm drop-shadow-[0_0_2px_#b026ff]">
          Cybernetic Entertainment System
        </p>
      </header>

      {/* Main Content Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Left Column: Music Player */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <NeonPanel title="Audio Deck" color="purple" className="h-full min-h-[300px]">
            <MusicPlayer />
          </NeonPanel>
          
          {/* Decorative Panel */}
          <NeonPanel color="pink" className="hidden lg:flex flex-grow opacity-70">
             <div className="h-full flex flex-col justify-center items-center text-neon-pink/50 space-y-2 font-mono text-xs">
                <p>SYS.STATUS: ONLINE</p>
                <p>NEURAL.LINK: STABLE</p>
                <p>AUDIO.SYNC: 100%</p>
                <div className="w-full h-1 bg-neon-pink/20 mt-4 rounded overflow-hidden">
                  <div className="h-full bg-neon-pink w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
             </div>
          </NeonPanel>
        </div>

        {/* Right Column: Game Area */}
        <div className="lg:col-span-8 flex justify-center">
          <NeonPanel title="Main Terminal" color="cyan" className="w-full max-w-[500px] lg:max-w-none flex items-center justify-center py-8">
            <SnakeGame />
          </NeonPanel>
        </div>

      </div>
      
      {/* Footer */}
      <footer className="mt-12 text-gray-600 text-xs font-mono uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Vertex AI Studio // System v1.0.0
      </footer>
    </div>
  );
};

export default App;
