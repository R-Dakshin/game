import { useEffect } from 'react';

interface UseKeyboardInputProps {
  onKeyPress: (key: string) => void;
  gameState: 'playing' | 'gameOver';
}

export const useKeyboardInput = ({ onKeyPress, gameState }: UseKeyboardInputProps) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      
      // Handle number keys for tile selection
      if (gameState === 'playing' && ['1', '2', '3'].includes(key)) {
        event.preventDefault();
        onKeyPress(key);
      }
      
      // Handle restart keys
      if (gameState === 'gameOver' && (key === ' ' || key === 'Enter')) {
        event.preventDefault();
        onKeyPress('restart');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onKeyPress, gameState]);
};