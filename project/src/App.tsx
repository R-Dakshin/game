import React, { useState, useCallback, useEffect } from "react";
import { GameCanvas } from "./components/GameCanvas";
import { CodeTile } from "./components/CodeTile";
import { ScoreDisplay } from "./components/ScoreDisplay";
import { Timer } from "./components/Timer";
import { GameOverScreen } from "./components/GameOverScreen";
import { useKeyboardInput } from "./hooks/useKeyboardInput";
import { gameLevels, CodeOption } from "./data/gameData";

type GameState = "playerInput" | "playing" | "gameOver";

interface ScoreEntry {
  playerName: string;
  score: number;
  level: number;
  timestamp: string;
}

// Player Name Input Component
const PlayerNameInput: React.FC<{
  onStartGame: (name: string) => void;
  onShowLeaderboard: () => void;
  onExportScores: (clearAfterExport?: boolean) => void;
  hasScores: boolean;
  autoExport: boolean;
  setAutoExport: (value: boolean) => void;
  exportAfterGames: number;
  setExportAfterGames: (value: number) => void;
  gamesPlayed: number;
  saveSettings: (settings: any) => void;
}> = ({ 
  onStartGame, 
  onShowLeaderboard, 
  onExportScores, 
  hasScores, 
  autoExport, 
  setAutoExport, 
  exportAfterGames, 
  setExportAfterGames, 
  gamesPlayed,
  saveSettings 
}) => {
  const [name, setName] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const handleAutoExportChange = (enabled: boolean) => {
    setAutoExport(enabled);
    saveSettings({
      autoExport: enabled,
      exportAfterGames,
      gamesPlayed
    });
  };

  const handleExportAfterChange = (value: number) => {
    setExportAfterGames(value);
    saveSettings({
      autoExport,
      exportAfterGames: value,
      gamesPlayed
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Code Logic Jump Game
          </h1>
          <p className="text-gray-600">
            Test your programming logic skills!
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  onStartGame(name.trim());
                }
              }}
              placeholder="Your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={20}
            />
          </div>

          <button
            onClick={() => {
              if (name.trim()) {
                onStartGame(name.trim());
              }
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Start Game
          </button>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onShowLeaderboard}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Leaderboard
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Settings
          </button>
        </div>

        {showSettings && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Export Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoExport"
                  checked={autoExport}
                  onChange={(e) => handleAutoExportChange(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="autoExport" className="text-sm">
                  Auto-export after games
                </label>
              </div>

              {autoExport && (
                <div className="ml-6">
                  <label className="block text-sm text-gray-600 mb-1">
                    Export every:
                  </label>
                  <select
                    value={exportAfterGames}
                    onChange={(e) => handleExportAfterChange(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value={1}>1 game</option>
                    <option value={5}>5 games</option>
                    <option value={10}>10 games</option>
                    <option value={20}>20 games</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Games played: {gamesPlayed} | Next export: {exportAfterGames - (gamesPlayed % exportAfterGames)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {hasScores && (
          <div className="mt-4 space-y-2">
            <button
              onClick={() => onExportScores(false)}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Export All Scores
            </button>
            <button
              onClick={() => {
                if (confirm('This will export all scores and then clear the data. Continue?')) {
                  onExportScores(true);
                }
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Export & Clear Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Leaderboard Modal Component
const LeaderboardModal: React.FC<{
  scores: ScoreEntry[];
  onClose: () => void;
}> = ({ scores, onClose }) => {
  const topScores = scores.slice(0, 10);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {topScores.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No scores yet. Be the first to play!
          </p>
        ) : (
          <div className="space-y-2">
            {topScores.map((entry, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  index === 0
                    ? "bg-yellow-100 border-2 border-yellow-300"
                    : index === 1
                    ? "bg-gray-100 border-2 border-gray-300"
                    : index === 2
                    ? "bg-orange-100 border-2 border-orange-300"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <span className="font-bold text-lg mr-3">
                    {index + 1}.
                  </span>
                  <div>
                    <div className="font-semibold">{entry.playerName}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{entry.score}</div>
                  <div className="text-sm text-gray-600">
                    Level {entry.level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>("playerInput");
  const [playerPosition, setPlayerPosition] = useState(1);
  const [isJumping, setIsJumping] = useState(false);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isMovingForward, setIsMovingForward] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [autoExport, setAutoExport] = useState(false);
  const [exportAfterGames, setExportAfterGames] = useState(5);
  const [gamesPlayed, setGamesPlayed] = useState(0);

  const currentLevelData = gameLevels[currentLevel - 1];
  const totalLevels = gameLevels.length;

  // Load scores and settings from localStorage on component mount
  useEffect(() => {
    const savedScores = localStorage.getItem('gameScores');
    if (savedScores) {
      try {
        setScores(JSON.parse(savedScores));
      } catch (error) {
        console.error('Error loading scores:', error);
      }
    }

    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setAutoExport(settings.autoExport || false);
        setExportAfterGames(settings.exportAfterGames || 5);
        setGamesPlayed(settings.gamesPlayed || 0);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback((settings: any) => {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }, []);

  // Save score to localStorage
  const saveScore = useCallback((playerName: string, score: number, level: number) => {
    const newEntry: ScoreEntry = {
      playerName,
      score,
      level,
      timestamp: new Date().toISOString()
    };

    const updatedScores = [...scores, newEntry].sort((a, b) => b.score - a.score);
    setScores(updatedScores);
    
    // Save to localStorage
    localStorage.setItem('gameScores', JSON.stringify(updatedScores));
    
    // Update games played counter
    const newGamesPlayed = gamesPlayed + 1;
    setGamesPlayed(newGamesPlayed);
    
    // Save updated settings
    const updatedSettings = {
      autoExport,
      exportAfterGames,
      gamesPlayed: newGamesPlayed
    };
    saveSettings(updatedSettings);
    
    // Auto-export if enabled and threshold reached
    if (autoExport && newGamesPlayed % exportAfterGames === 0) {
      generateCSV(updatedScores);
    }
    
    console.log('Score saved:', newEntry);
  }, [scores, gamesPlayed, autoExport, exportAfterGames, saveSettings]);

  // Generate CSV file
  const generateCSV = useCallback((scoreData: ScoreEntry[]) => {
    const csvHeader = "Player Name,Score,Level,Date\n";
    const csvRows = scoreData.map(entry => 
      `"${entry.playerName}",${entry.score},${entry.level},"${new Date(entry.timestamp).toLocaleString()}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game_scores_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, []);

  // Export all scores as CSV
  const exportScores = useCallback((clearAfterExport = false) => {
    if (scores.length === 0) {
      alert('No scores to export!');
      return;
    }
    
    generateCSV(scores);
    
    if (clearAfterExport) {
      setScores([]);
      localStorage.removeItem('gameScores');
      
      // Reset games played counter
      setGamesPlayed(0);
      const updatedSettings = {
        autoExport,
        exportAfterGames,
        gamesPlayed: 0
      };
      saveSettings(updatedSettings);
    }
  }, [scores, generateCSV, autoExport, exportAfterGames, saveSettings]);

  // Timer effect
  useEffect(() => {
    if (gameState !== "playing" || isJumping) return;

    if (timeLeft <= 0) {
      setGameState("gameOver");
      setTimeout(() => {
        saveScore(playerName, score, currentLevel);
        setShowGameOver(true);
      }, 500);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameState, isJumping, playerName, score, currentLevel, saveScore]);

  // Reset timer when level changes
  useEffect(() => {
    setTimeLeft(15);
  }, [currentLevel]);

  const handleTileSelection = useCallback(
    (tileIndex: number) => {
      if (gameState !== "playing" || isJumping) return;

      setSelectedTile(tileIndex);
      setIsJumping(true);
      setPlayerPosition(tileIndex);

      setTimeout(() => {
        setIsJumping(false);

        const selectedOption = currentLevelData.options[tileIndex];

        if (selectedOption.isCorrect) {
          setScore((prev) => prev + 1);
          setIsMovingForward(true);

          if (currentLevel >= totalLevels) {
            setGameState("gameOver");
            setTimeout(() => {
              setIsMovingForward(false);
              saveScore(playerName, score + 1, currentLevel);
              setShowGameOver(true);
            }, 1000);
          } else {
            setTimeout(() => {
              setCurrentLevel((prev) => prev + 1);
              setSelectedTile(null);
              setPlayerPosition(1);
              setIsMovingForward(false);
            }, 1500);
          }
        } else {
          setGameState("gameOver");
          setTimeout(() => {
            saveScore(playerName, score, currentLevel);
            setShowGameOver(true);
          }, 500);
        }
      }, 800);
    },
    [gameState, isJumping, currentLevelData, currentLevel, totalLevels, playerName, score, saveScore]
  );

  const handleKeyPress = useCallback(
    (key: string) => {
      if (key === "restart") {
        restartGame();
      } else if (["1", "2", "3"].includes(key) && gameState === "playing") {
        const tileIndex = parseInt(key) - 1;
        handleTileSelection(tileIndex);
      }
    },
    [handleTileSelection, gameState]
  );

  const restartGame = useCallback(() => {
    setScore(0);
    setCurrentLevel(1);
    setGameState("playerInput");
    setPlayerPosition(1);
    setIsJumping(false);
    setSelectedTile(null);
    setShowGameOver(false);
    setTimeLeft(15);
    setIsMovingForward(false);
    setPlayerName("");
  }, []);

  const startGame = useCallback((name: string) => {
    setPlayerName(name);
    setGameState("playing");
  }, []);

  useKeyboardInput({ onKeyPress: handleKeyPress, gameState });

  if (gameState === "playerInput") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <PlayerNameInput 
            onStartGame={startGame} 
            onShowLeaderboard={() => setShowLeaderboard(true)}
            onExportScores={exportScores}
            hasScores={scores.length > 0}
            autoExport={autoExport}
            setAutoExport={setAutoExport}
            exportAfterGames={exportAfterGames}
            setExportAfterGames={setExportAfterGames}
            gamesPlayed={gamesPlayed}
            saveSettings={saveSettings}
          />
        </div>
        {showLeaderboard && (
          <LeaderboardModal
            scores={scores}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </div>
    );
  }

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
            {currentLevelData.options.map(
              (option: CodeOption, index: number) => (
                <CodeTile
                  key={index}
                  code={option.label}
                  position={index}
                  isSelected={selectedTile === index}
                  isCorrect={
                    gameState === "gameOver" ? option.isCorrect : undefined
                  }
                  gameState={gameState}
                  onClick={() => handleTileSelection(index)}
                />
              )
            )}
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Press <kbd className="px-2 py-1 bg-gray-200 rounded">1</kbd>,
            <kbd className="px-2 py-1 bg-gray-200 rounded mx-1">2</kbd>, or
            <kbd className="px-2 py-1 bg-gray-200 rounded ml-1">3</kbd> to jump
            to a tile
          </div>
        </div>

        <div className="text-center text-gray-600">
          <p className="mb-2">
            🎯 Choose the correct code snippet to continue the sequence!
          </p>
          <p className="text-sm">
            Master programming logic one jump at a time.
          </p>
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
