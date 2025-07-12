import React from 'react';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isLowTime = timeLeft <= 5;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Time Remaining</span>
        <span className={`text-lg font-bold ${isLowTime ? 'text-red-600' : 'text-blue-600'}`}>
          {timeLeft}s
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isLowTime ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {isLowTime && (
        <div className="text-center mt-2">
          <span className="text-red-600 text-sm font-medium animate-pulse">
            ⚠️ Time running out!
          </span>
        </div>
      )}
    </div>
  );
};