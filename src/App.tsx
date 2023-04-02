import React, { useEffect, useRef } from 'react';
import './App.css';
import GameScene from './phaser/GameScene';
import { debugOptions, Screen } from './typescript';

function App() {
  const gameParent = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const firstBoxRef = useRef<HTMLDivElement>(null);
  const [myBoxes, setMyBoxes] = React.useState<any[]>([]);
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
    console.log('gameRef.current: ', gameParent.current);
    console.log('screen: ', screen);
    if (!gameParent.current) {
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
      parent: gameParent.current,
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
    if (!firstBoxRef.current) {
      return;
    }

    const rect = firstBoxRef.current.getBoundingClientRect();
    console.log('firstBoxPositionX: ', rect.x);
    console.log('firstBoxPositionY: ', rect.y);
    console.log('firstBoxWidth: ', rect.width);
    console.log('firstBoxHeight: ', rect.height);

    let myNewBoxes: any[] = [
      {
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      },
    ];
    setMyBoxes(myNewBoxes);
  }, [firstBoxRef]);

  return (
    <div className="top">
      <div id={'react-parent'}>
        <div className="react-box" ref={firstBoxRef}></div>
        <div className="react-box"></div>
        <div className="react-box"></div>
        <div className="react-box"></div>
      </div>
      <div id={'game-parent'} ref={gameParent} />
    </div>
  );
}

export default App;
