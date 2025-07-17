import React, { useRef, useEffect, useState } from 'react';
// Update image paths based on your provided file names
import backgroundImage from '../assets/canva.png'; // Your kitchen counter background image
import chefImageSrc from '../assets/chef-canvas.png'; // Your chef image

interface GameCanvasProps {
  playerPosition: number; // 0: Stovetop, 1: Blender, 2: Knife/Cutting Board
  isJumping: boolean; // Keep for potential jump animation
  gameState: 'playing' | 'gameOver';
  isMovingForward: boolean; // This prop might become redundant, depending on how you control movement
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ 
  playerPosition, 
  isJumping, 
  gameState,
  isMovingForward // Keeping it for now, but its specific use might change
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chefImage, setChefImage] = useState<HTMLImageElement | null>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  // Load the chef image once
  useEffect(() => {
    const img = new Image();
    img.src = chefImageSrc;
    img.onload = () => {
      setChefImage(img);
    };
    img.onerror = () => {
      console.error("Failed to load chef image:", chefImageSrc);
      // Fallback: log error, or set a placeholder
    };

    // Load the background image once
    const bg = new Image();
    bg.src = backgroundImage;
    bg.onload = () => {
      setBgImage(bg);
    };
    bg.onerror = () => {
      console.error("Failed to load background image:", backgroundImage);
    };

  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to be responsive to its container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas for each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background Image FIRST (so it appears as background)
    if (bgImage) {
      // Draw background to cover the entire canvas
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
      // Fallback if background image not loaded
      ctx.fillStyle = '#e0f2f7'; // Light blue fallback color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // --- Define Utensil Positions (relative to canvas width) ---
    // These are approximate X-coordinates for the center of each utensil area.
    // You might need to fine-tune these values based on your specific 'bg.png'
    // and how large your chef image is.
    const utensilXPositions = [
      canvas.width * 0.25, // Position 0: Stovetop (left)
      canvas.width * 0.5,  // Position 1: Blender (center)
      canvas.width * 0.75  // Position 2: Knife/Cutting Board (right)
    ];

    // --- Draw Chef (Player) AFTER background - This makes it appear on top ---
    // Adjust chefWidth and chefHeight to make the chef bigger
    const chefWidth = 250; // Increased size for a larger chef
    const chefHeight = 250; // Increased size for a larger chef

    // Calculate chef's X position based on playerPosition prop
    // Ensure playerPosition is within valid bounds (0, 1, 2)
    const targetX = utensilXPositions[playerPosition] || utensilXPositions[0]; // Default to first position if invalid

    // Center the chef image at the targetX
    let chefX = targetX - (chefWidth - 2)/ 2;

    // Adjust chef's Y position to sit correctly behind the counter.
    // This value positions the chef's feet visually behind the counter's top edge.
    // The '0.7' factor places the chef's feet at 70% of the canvas height.
    const baseChefY = (canvas.height * 0.8) - chefHeight; 
    const chefY = isJumping ? baseChefY - 30 : baseChefY; // Simple jump animation

    // Draw chef image if loaded - AFTER the background so it's visible
    if (chefImage) {
      ctx.drawImage(chefImage, chefX, chefY, chefWidth, chefHeight);
    } else {
      // Fallback: Draw a simple rectangle if chef image isn't loaded
      ctx.fillStyle = gameState === 'gameOver' ? '#dc2626' : '#10b981';
      ctx.fillRect(chefX, chefY, chefWidth, chefHeight);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(chefX, chefY, chefWidth, 6);
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(chefX + 12, chefY + 16, 8, 8); // Eyes (adjusted for chef size)
      ctx.fillRect(chefX + chefWidth - 20, chefY + 16, 8, 8);
    }

    // Background particles (optional, keep if they fit the theme)
    if (gameState === 'playing') {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      for (let i = 0; i < 20; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 23) % (canvas.height - 100);
        ctx.fillRect(x, y, 2, 2);
      }
    }

  }, [playerPosition, isJumping, gameState, isMovingForward, chefImage, bgImage]); // Added bgImage to dependencies

  return (
    <canvas
      ref={canvasRef}
      // Removed fixed width/height to make it responsive
      // Set a default width/height for initial render, but useEffect will override
      width={800} // Default width for initial render
      height={300} // Default height for initial render
      // Removed CSS background image as it's now drawn on canvas
      className="border-2 border-gray-300 rounded-lg w-full h-full" 
      // The background image is now drawn directly onto the canvas in useEffect
    />
  );
};
