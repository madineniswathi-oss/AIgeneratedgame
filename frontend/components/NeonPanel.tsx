import React from 'react';

interface NeonPanelProps {
  children: React.ReactNode;
  className?: string;
  color?: 'cyan' | 'pink' | 'purple';
  title?: string;
}

export const NeonPanel: React.FC<NeonPanelProps> = ({ 
  children, 
  className = '', 
  color = 'cyan',
  title 
}) => {
  const colorClasses = {
    cyan: 'border-neon-cyan shadow-neon-cyan',
    pink: 'border-neon-pink shadow-neon-pink',
    purple: 'border-neon-purple shadow-neon-purple',
  };

  const titleColors = {
    cyan: 'text-neon-cyan',
    pink: 'text-neon-pink',
    purple: 'text-neon-purple',
  };

  return (
    <div className={`bg-neon-panel border-2 rounded-lg p-4 flex flex-col ${colorClasses[color]} ${className}`}>
      {title && (
        <h2 className={`text-xl font-bold mb-4 uppercase tracking-widest ${titleColors[color]} drop-shadow-[0_0_5px_currentColor]`}>
          {title}
        </h2>
      )}
      <div className="flex-grow flex flex-col">
        {children}
      </div>
    </div>
  );
};
