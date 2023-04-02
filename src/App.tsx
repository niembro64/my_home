import React, { useEffect, useRef } from 'react';
import './App.css';
import GameScene from './phaser/GameScene';
import { Box, debugOptions, Screen } from './typescript';

function App() {
  const gameParent = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const boxRefs = useRef<HTMLDivElement[]>([]);
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

    let config: Phaser.Types.Core.GameConfig = {
      plugins: {
        global: [

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
    if (boxRefs.current.length === 0) {
      return;
    }
    let myNewBoxes: Box[] = [];
    Array(5).forEach((box) => {
      const rect = box.getBoundingClientRect();
      console.log('firstBoxPositionX: ', rect.x);
      console.log('firstBoxPositionY: ', rect.y);
      console.log('firstBoxWidth: ', rect.width);
      console.log('firstBoxHeight: ', rect.height);

      let myNewBox: Box = {
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      };
      myNewBoxes.push(myNewBox);
    });
    setMyBoxes(myNewBoxes);
  }, [boxRefs]);

  return (
    <div className="top">
      <div id={'react-parent'}>
        {/* {boxRefs.current
          // .filter((x) => {
          //   return x !== null;
          // })
          .map((box, index) => {
            return (
              <div
                className="react-box"
                ref={(el) => (boxRefs.current[index] = el)}
              ></div>
            );
          })} */}
        {/* // <div className="react-box" ref={boxRefs.current[0]}></div>
        // <div className="react-box"></div>
        // <div className="react-box"></div>
        // <div className="react-box"></div> */}
      </div>
      <div id={'game-parent'} ref={gameParent} />
    </div>
  );
}

export default App;
