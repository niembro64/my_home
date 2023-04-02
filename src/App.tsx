import React, { useEffect, useRef } from 'react';
import './App.css';
import GameScene from './phaser/GameScene';
import { Box, debugOptions, Screen } from './typescript';

function App() {
  const gameParentRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const reactParentRef = useRef<HTMLDivElement>(null);
  const [myBoxes, setMyBoxes] = React.useState<Box[]>([]);
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
    console.log('gameRef.current: ', gameParentRef.current);
    console.log('screen: ', screen);
    if (!gameParentRef.current) {
      return;
    }

    if (screen.width === 0 || screen.height === 0) {
      return;
    }

    if (myBoxes.length === 0) {
      return;
    }

    // const config: Phaser.Types.Core.GameConfig = {
    //   type: Phaser.AUTO,
    //   width: screen.width,
    //   height: screen.height,
    //   parent: gameRef.current,
    //   scene: [GameScene],
    // };

    let config: Phaser.Types.Core.GameConfig = {
      plugins: {
        global: [
          // {
          //   key: 'rexShakePosition',
          //   plugin: ShakePositionPlugin,
          //   start: true,
          // },
        ],
      },
      transparent: true,
      title: 'niembro64',
      antialias: true,
      pixelArt: false,
      // width: 1920,
      // height: 1080,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // width: 1920,
        // height: 1080,
        width: screen.width,
        height: screen.height,
      },
      type: Phaser.AUTO,
      parent: gameParentRef.current,
      // backgroundColor: '#0000ff55',
      // backgroundColor: 'red',
      input: {
        gamepad: true,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 2000 },
          debug: debugOptions.devMode,
        },
      },
      scene: [GameScene],
    };

    gameRef.current = new Phaser.Game(config);
    gameRef.current.registry.set('myBoxes', myBoxes);
    return () => {
      gameRef.current.destroy(true);
    };
  }, [screen, myBoxes]);

  useEffect(() => {
    if (!reactParentRef.current) {
      return;
    }

    let myNewBoxes: Box[] = [];
    for (let i = 0; i < 4; i++) {
      const child = reactParentRef.current.children[i];
      const rect = child.getBoundingClientRect();

      let newBox: Box = {
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      };
      myNewBoxes.push(newBox);
    }
    setMyBoxes(myNewBoxes);
  }, [reactParentRef]);

  return (
    <div className="top">
      <div id={'react-parent'} ref={reactParentRef}>
        <div className="react-box"></div>
        <div className="react-box"></div>
        <div className="react-box"></div>
        <div className="react-box"></div>
      </div>
      <div id={'game-parent'} ref={gameParentRef} />
    </div>
  );
}

export default App;
