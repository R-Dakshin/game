import React, { useRef, useEffect } from 'react';

interface GameCanvasProps {
  playerPosition: number;
  isJumping: boolean;
  gameState: 'playing' | 'gameOver';
  isMovingForward: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ 
  playerPosition, 
  isJumping, 
  gameState,
  isMovingForward
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    const platformWidth = 120;
    const platformHeight = 20;
    const platformY = canvas.height - 60;
    const platformSpacing = (canvas.width - 3 * platformWidth) / 4;

    for (let i = 0; i < 3; i++) {
      const x = platformSpacing + i * (platformWidth + platformSpacing);
      
      // Platform shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 2, platformY + 2, platformWidth, platformHeight);
      
      // Platform
      ctx.fillStyle = gameState === 'gameOver' ? '#ef4444' : '#3b82f6';
      ctx.fillRect(x, platformY, platformWidth, platformHeight);
      
      // Platform highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x, platformY, platformWidth, 4);
    }

    // Draw player
    const playerSize = 24;
    let playerX = platformSpacing + playerPosition * (platformWidth + platformSpacing) + platformWidth / 2 - playerSize / 2;
    
    // Move player forward when correct answer
    if (isMovingForward) {
      playerX += 50; // Move forward by 50 pixels
    }
    
    const basePlayerY = platformY - playerSize;
    const playerY = isJumping ? basePlayerY - 30 : basePlayerY;

    // Player shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(playerX + playerSize / 2, platformY + 5, playerSize / 2, 6, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Player body
    ctx.fillStyle = gameState === 'gameOver' ? '#dc2626' : '#10b981';
    ctx.fillRect(playerX, playerY, playerSize, playerSize);
    
    // Player highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(playerX, playerY, playerSize, 6);
    
    // Player eyes
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(playerX + 6, playerY + 8, 4, 4);
    ctx.fillRect(playerX + 14, playerY + 8, 4, 4);

    // Background particles
    if (gameState === 'playing') {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      for (let i = 0; i < 20; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 23) % (canvas.height - 100);
        ctx.fillRect(x, y, 2, 2);
      }
    }

  }, [playerPosition, isJumping, gameState, isMovingForward]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={200}
      className="border-2 border-gray-300 rounded-lg bg-gradient-to-b from-sky-100 to-sky-200"
    />
  );
};