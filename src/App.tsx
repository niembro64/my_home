import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import GameScene from './phaser/GameScene';
import { Screen } from './typescript';

function App() {
  const gameRef = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = React.useState<Screen>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const newScreen: Screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    setScreen(newScreen);
  }, []);

  useEffect(() => {
    console.log('gameRef.current: ', gameRef.current);
    console.log('screen: ', screen);
    if (!gameRef.current) {
      return;
    }

    if (screen.width === 0 || screen.height === 0) {
      return;
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: screen.width,
      height: screen.height,
      parent: gameRef.current,
      scene: [GameScene],
    };

    const game = new Phaser.Game(config);
    return () => {
      game.destroy(true);
    };
  }, [screen]);

  return <div id={'game'} ref={gameRef} />;
}

export default App;
