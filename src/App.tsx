import React, { useEffect, useRef } from 'react';
import './App.css';
import GameScene from './phaser/GameScene';
import { projects } from './rHelpers/projectArray';
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

  return (
    <div className="top">
      <div id={'react-parent'} ref={reactParentRef}>
        <div id="roby">
          <div id="three">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
          <div id="four">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
      </div>
      {/* <div id={'react-parent'} ref={reactParentRef}>
        {projects.map((project, index) => {
          return (
            <div className={'project'} key={index}>
              <div className="project-title">{project.title}</div>
              <div className="project-type">{project.type}</div>
            </div>
          );
        })}
      </div> */}
      <div id={'game-parent'} ref={gameParentRef} />
    </div>
  );
}

export default App;
