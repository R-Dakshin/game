import React from 'react';

interface GameOverScreenProps {
  score: number;
  level: number;
  totalLevels: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  level,
  totalLevels,
  onRestart
}) => {
  const isWin = level > totalLevels;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center animate-bounce-in">
        <div className={`text-6xl mb-4 ${isWin ? 'text-green-500' : 'text-red-500'}`}>
          {isWin ? '🎉' : '💥'}
        </div>
        
        <h2 className={`text-3xl font-bold mb-4 ${isWin ? 'text-green-600' : 'text-red-600'}`}>
          {isWin ? 'Congratulations!' : 'Game Over!'}
        </h2>
        
        <div className="mb-6 space-y-2">
          {isWin ? (
            <p className="text-gray-700">
              You've mastered all the code logic challenges!
            </p>
          ) : (
            <p className="text-gray-700">
              Wrong choice! Keep practicing your coding logic.
            </p>
          )}
          
          <div className="bg-gray-100 rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Final Score:</span>
              <span className="text-2xl font-bold text-blue-600">{score}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold">Level Reached:</span>
              <span className="text-lg font-bold text-purple-600">{level - 1}/{totalLevels}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onRestart}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
        >
          {isWin ? 'Play Again' : 'Try Again'}
        </button>
        
        <div className="mt-4 text-sm text-gray-500">
          Press Space or Enter to restart
        </div>
      </div>
    </div>
  );
};