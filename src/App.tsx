import React, { useEffect, useRef } from 'react';
import './App.css';
import GameScene from './phaser/GameScene';
import { projects } from './rHelpers/projectArray';
import { Box, debugOptions, Screen } from './typescript';
import { LoadBar } from 'react-loadbar';
import moment, { Moment } from 'moment';

function App() {
  const gameParentRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const reactParentRef = useRef<HTMLDivElement>(null);
  const [myBoxes, setMyBoxes] = React.useState<Box[]>([]);
  const [screen, setScreen] = React.useState<Screen>({
    width: 0,
    height: 0,
  });
  const [countState, setCountState] = React.useState<number>(0);
  let countUp = 0;

  useEffect(() => {
    setInterval(() => {
      countUp++;
      setCountState((prev) => {
        return ((prev + 0.1) % 10) / 10;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    console.log('countUp', countState);
  }, [countState]);

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
    if (!reactParentRef.current) {
      return;
    }

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
    return () => {
      gameRef.current.destroy(true);
    };
  }, [screen, myBoxes]);

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
      <LoadBar
        percent={0.5}
        onVisibilityChange={(isVisible: any) => {
          console.log(isVisible);
        }}
        barStyle={{ background: 'slateblue' }}
        spinnerStyle={{ borderColor: 'slateblue' }}
      />
    </div>
  );
}

export default App;
