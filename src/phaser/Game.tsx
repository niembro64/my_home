import React, { useRef, useEffect } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';

const Game: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      scene: [GameScene],
      // Add any other Phaser config options here
    };

    const game = new Phaser.Game(config);
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} />;
};

export default Game;
