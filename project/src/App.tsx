import React, { useState, useCallback, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { CodeTile } from './components/CodeTile';
import { ScoreDisplay } from './components/ScoreDisplay';
import { Timer } from './components/Timer';
import { GameOverScreen } from './components/GameOverScreen';
import { useKeyboardInput } from './hooks/useKeyboardInput';
import { gameLevels, CodeOption } from './data/gameData';

type GameState = 'playing' | 'gameOver';

function App() {
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [playerPosition, setPlayerPosition] = useState(1); // 0, 1, or 2
  const [isJumping, setIsJumping] = useState(false);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isMovingForward, setIsMovingForward] = useState(false);

  const currentLevelData = gameLevels[currentLevel - 1];
  const totalLevels = gameLevels.length;

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing' || isJumping) return;

    if (timeLeft <= 0) {
      // Time's up - game over
      setGameState('gameOver');
      setTimeout(() => setShowGameOver(true), 500);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameState, isJumping]);

  // Reset timer when level changes
  useEffect(() => {
    setTimeLeft(15);
  }, [currentLevel]);

  const handleTileSelection = useCallback((tileIndex: number) => {
    if (gameState !== 'playing' || isJumping) return;

    setSelectedTile(tileIndex);
    setIsJumping(true);
    setPlayerPosition(tileIndex);

    // Animate jump
    setTimeout(() => {
      setIsJumping(false);
      
      const selectedOption = currentLevelData.options[tileIndex];
      
      if (selectedOption.isCorrect) {
        // Correct choice
        setScore(prev => prev + 1);
        setIsMovingForward(true);
        
        if (currentLevel >= totalLevels) {
          // Game completed
          setGameState('gameOver');
          setTimeout(() => {
            setIsMovingForward(false);
            setShowGameOver(true);
          }, 1000);
        } else {
          // Next level
          setTimeout(() => {
            setCurrentLevel(prev => prev + 1);
            setSelectedTile(null);
            setPlayerPosition(1);
            setIsMovingForward(false);
          }, 1500);
        }
      } else {
        // Wrong choice
        setGameState('gameOver');
        setTimeout(() => setShowGameOver(true), 500);
      }
    }, 800);
  }, [gameState, isJumping, currentLevelData, currentLevel, totalLevels]);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'restart') {
      restartGame();
    } else if (['1', '2', '3'].includes(key)) {
      const tileIndex = parseInt(key) - 1;
      handleTileSelection(tileIndex);
    }
  }, [handleTileSelection]);

  const restartGame = useCallback(() => {
    setScore(0);
    setCurrentLevel(1);
    setGameState('playing');
    setPlayerPosition(1);
    setIsJumping(false);
    setSelectedTile(null);
    setShowGameOver(false);
    setTimeLeft(15);
    setIsMovingForward(false);
  }, []);

  useKeyboardInput({ onKeyPress: handleKeyPress, gameState });

  if (!currentLevelData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <ScoreDisplay 
          score={score} 
          level={currentLevel} 
          totalLevels={totalLevels}
        />

        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            {currentLevelData.question}
          </h2>
          
          <Timer timeLeft={timeLeft} totalTime={15} />
          
          <div className="flex justify-center mb-6">
            <GameCanvas 
              playerPosition={playerPosition}
              isJumping={isJumping}
              gameState={gameState}
              isMovingForward={isMovingForward}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentLevelData.options.map((option: CodeOption, index: number) => (
              <CodeTile
                key={index}
                code={option.label}
                position={index}
                isSelected={selectedTile === index}
                isCorrect={gameState === 'gameOver' ? option.isCorrect : undefined}
                gameState={gameState}
                onClick={() => handleTileSelection(index)}
              />
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Press <kbd className="px-2 py-1 bg-gray-200 rounded">1</kbd>, 
            <kbd className="px-2 py-1 bg-gray-200 rounded mx-1">2</kbd>, or 
            <kbd className="px-2 py-1 bg-gray-200 rounded ml-1">3</kbd> to jump to a tile
          </div>
        </div>

        <div className="text-center text-gray-600">
          <p className="mb-2">🎯 Choose the correct code snippet to continue the sequence!</p>
          <p className="text-sm">Master programming logic one jump at a time.</p>
        </div>

        {showGameOver && (
          <GameOverScreen
            score={score}
            level={currentLevel}
            totalLevels={totalLevels}
            onRestart={restartGame}
          />
        )}
      </div>
    </div>
  );
}

export default App;