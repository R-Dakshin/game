import React from 'react';

interface CodeTileProps {
  code: string;
  position: number;
  isSelected: boolean;
  isCorrect?: boolean;
  gameState: 'playing' | 'gameOver';
  onClick: () => void;
}

export const CodeTile: React.FC<CodeTileProps> = ({
  code,
  position,
  isSelected,
  isCorrect,
  gameState,
  onClick
}) => {
  const getKeyNumber = () => position + 1;
  
  const getTileStyle = () => {
    if (gameState === 'gameOver') {
      if (isCorrect === true) {
        return 'bg-green-500 border-green-600 text-white';
      } else if (isCorrect === false && isSelected) {
        return 'bg-red-500 border-red-600 text-white';
      }
      return 'bg-gray-400 border-gray-500 text-gray-200';
    }
    
    if (isSelected) {
      return 'bg-blue-500 border-blue-600 text-white transform scale-105';
    }
    
    return 'bg-white border-gray-300 text-gray-800 hover:bg-blue-50 hover:border-blue-300';
  };

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        min-h-[80px] flex flex-col justify-center items-center text-center
        ${getTileStyle()}
        ${gameState === 'playing' ? 'hover:shadow-lg' : ''}
      `}
      onClick={gameState === 'playing' ? onClick : undefined}
    >
      <div className="absolute top-2 left-2 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
        {getKeyNumber()}
      </div>
      
      <code className="font-mono text-sm font-medium break-all">
        {code}
      </code>
      
      {gameState === 'gameOver' && isCorrect === true && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center">
          ✓
        </div>
      )}
      
      {gameState === 'gameOver' && isCorrect === false && isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center">
          ✗
        </div>
      )}
    </div>
  );
};