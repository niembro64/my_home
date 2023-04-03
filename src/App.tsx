import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import GameScene from './phaser/GameScene';
import { projects } from './rHelpers/projectArray';
import { Box, debugOptions, Screen } from './typescript';
import moment, { Moment } from 'moment';

function App() {
  const gameParentRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const grassRef = useRef<HTMLDivElement>(null);
  const [customEventData, setCustomEventData] = useState<any>(null);

  const handleCustomEvent = (event: any) => {
    console.log('event', event);
    setCustomEventData(event.detail.data);
  };

  const [gameReady, setGameReady] = useState<boolean>(false);
  const handleGameReady = () => {
    setGameReady(true);
  };

  const reactParentRef = useRef<HTMLDivElement>(null);
  const [myBoxes, setMyBoxes] = useState<Box[]>([]);
  const [screen, setScreen] = useState<Screen>({
    width: 0,
    height: 0,
  });

  /////////////////
  // COUNT UP
  /////////////////
  // const [countState, setCountState] = useState<number>(0);
  // let countUp = 0;

  // useEffect(() => {
  //   setInterval(() => {
  //     countUp++;
  //     setCountState((prev) => {
  //       return ((prev + 0.1) % 10) / 10;
  //     });
  //   }, 1000);
  // }, []);

  // useEffect(() => {
  //   console.log('countUp', countState);
  // }, [countState]);

  /////////////////////////////////////
  // SET SCREEN INFO WHEN RENDERED
  /////////////////////////////////////
  useEffect(() => {
    const newScreen: Screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    setScreen(newScreen);
  }, []);

  /////////////////////////////////////
  // SET BOXES FOR PHASER
  /////////////////////////////////////
  useEffect(() => {
    if (!reactParentRef.current || !grassRef.current) {
      return;
    }

    ///////////////////////////////
    // ADD PROJECTS
    ///////////////////////////////
    let myNewBoxes: Box[] = [];
    let numChildren = reactParentRef.current.children.length;
    for (let i = 0; i < numChildren; i++) {
      const child = reactParentRef.current.children[i];
      const rect = child.getBoundingClientRect();

      const newBox: Box = {
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      };
      myNewBoxes.push(newBox);
    }

    ///////////////////////////////
    // ADD GRASS
    ///////////////////////////////
    const rect = grassRef.current.getBoundingClientRect();
    const percent = (15 - 3) / 15;
    const newBox: Box = {
      left: rect.x,
      top: rect.y + rect.height * (1 - percent),
      width: rect.width,
      height: rect.height * percent,
    };
    myNewBoxes.push(newBox);

    setMyBoxes(myNewBoxes);
  }, [reactParentRef]);

  /////////////////////////////////////
  // MAKE PHASER GAME
  /////////////////////////////////////
  useEffect(() => {
    if (
      !gameParentRef.current ||
      screen.width === 0 ||
      screen.height === 0 ||
      myBoxes.length === 0
    ) {
      return;
    }

    let config: Phaser.Types.Core.GameConfig = {
      plugins: {
        global: [],
      },
      transparent: true,
      title: 'niembro64',
      antialias: true,
      pixelArt: false,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        width: screen.width,
        height: screen.height,
      },
      type: Phaser.AUTO,
      parent: gameParentRef.current,
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
    gameRef.current.events.on('ready', handleGameReady);
    return () => {
      gameRef.current.destroy(true);
      gameRef.current.events.off('ready', handleGameReady);
    };
  }, [screen, myBoxes]);

  /////////////////////////////////////
  // UPDATE PHASER GAME
  /////////////////////////////////////
  useEffect(() => {
    if (!gameReady) {
      return;
    }

    console.log('Game Ready');
    // gameRef.current.events.on('phaserUpdate', handleCustomEvent);
    window.addEventListener('gameState', handleCustomEvent);

    return () => {
      // gameRef.current.events.off('phaserUpdate', handleCustomEvent);
      window.removeEventListener('gameState', handleCustomEvent);
    };
  }, [gameReady]);

  return (
    <div className="top">
      <div id={'react-parent'} ref={reactParentRef}>
        {projects.map((project, index) => {
          return (
            <div className={'project'} key={index}>
              <div className="project-title">{project.title}</div>
              <div className="project-type">{project.stack[0]}</div>
            </div>
          );
        })}
      </div>
      <div id={'game-parent'} ref={gameParentRef} />
      <div className="grass" ref={grassRef}></div>
    </div>
  );
}

export default App;
