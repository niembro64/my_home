import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import GameScene from './phaser/GameScene';
import { projects } from './helpersReact/projectArray';
import { Box, ProjectName, Screen } from './typescript';
import moment, { Moment } from 'moment';
import { printMe } from './helpersReact/printing';
import { reactNavigate } from './helpersReact/helpers';
import { ProgressBar } from 'react-progressbar-fancy';
import { debugOptions } from './debugOptions';

function App() {
  const gameParentRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const grassRef = useRef<HTMLDivElement>(null);
  const [customEventData, setCustomEventData] = useState<any>(null);
  const [navigateTo, setNavigateTo] = useState<ProjectName | null>(null);
  const [countUp, setCountUp] = useState<number>(0);
  let myInterval = useRef<any>(null);

  const handleGameState = (event: any) => {
    const site = event.detail;
    // const site = event.detail.data;
    // printMe('site', site);
    // console.log('event', event);
    // console.log('site', site);
    setNavigateTo(site);

    // console.log('event', event);
    // setCustomEventData(event.detail.data);
  };

  useEffect(() => {
    console.log('useEffect', navigateTo);

    if (navigateTo === null) {
      setCountUp(0);
      clearInterval(myInterval.current);
      return;
    }

    myInterval.current = setInterval(() => {
      setCountUp((prev) => {
        return Math.min(prev + 20, 100);
      });
    }, 1000);

    if (!debugOptions.navigateActive) {
      return;
    }
    reactNavigate(navigateTo);
    return () => {
      clearInterval(myInterval.current);
      setCountUp(0);
    };
  }, [navigateTo]);

  useEffect(() => {
    console.log('countUp', countUp);
  }, [countUp]);

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
      const project: ProjectName = child.children[0].innerHTML as ProjectName;

      console.log('project', project);
      const top = rect.y;
      const left = rect.x;
      const width = rect.width;
      const height = rect.height;
      const x = left + width * 0.5;
      const y = top + height * 0.5;

      const newBox: Box = {
        project: project,
        top: top,
        left: left,
        width: width,
        height: height,
        // x: left,
        // y: top,
        x: x,
        y: y,
      };
      printMe('newBox', newBox);
      myNewBoxes.push(newBox);
    }

    ///////////////////////////////
    // ADD GRASS
    ///////////////////////////////
    const rect = grassRef.current.getBoundingClientRect();
    const percentKeep = (15 - 3) / 15;
    const top = rect.y + rect.height * (1 - percentKeep);
    const left = rect.x;
    const width = rect.width;
    const height = rect.height * percentKeep;
    const x = rect.x + width * 0.5;
    const y = top + height * 0.5;

    const newBox: Box = {
      project: null,
      left: left,
      top: top,
      width: width,
      height: height,
      x: x,
      y: y,
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
    window.addEventListener('gameState', handleGameState);

    return () => {
      // gameRef.current.events.off('phaserUpdate', handleCustomEvent);
      window.removeEventListener('gameState', handleGameState);
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
      <div className="progress-bar">
        {/* <div className="project-bar-text">Loading Project</div> */}
        <ProgressBar label="Loading Project" score={countUp} />
        {/* <ProgressBar darkTheme={true} label="Loading Project" score={60} /> */}
      </div>
    </div>
  );
}

export default App;
