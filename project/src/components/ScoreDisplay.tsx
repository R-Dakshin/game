import React from 'react';

interface ScoreDisplayProps {
  score: number;
  level: number;
  totalLevels: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  level, 
  totalLevels 
}) => {
  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg">
      <div className="flex items-center space-x-6">
        <div className="text-center">
          <div className="text-2xl font-bold">{score}</div>
          <div className="text-sm opacity-90">Score</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold">{level}</div>
          <div className="text-sm opacity-90">Level</div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-lg font-semibold">Code Logic Challenge</div>
        <div className="text-sm opacity-90">
          Progress: {level}/{totalLevels}
        </div>
      </div>
    </div>
  );
};