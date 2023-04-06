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
import { debug } from 'console';

function App() {
  const gameParentRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const grassRef = useRef<HTMLDivElement>(null);
  const [customEventData, setCustomEventData] = useState<any>(null);
  const [navTouch, setNavTouch] = useState<ProjectName | null>(null);
  const [navWaiting, setNavWaiting] = useState<ProjectName | null>(null);
  const [navGo, setNavGo] = useState<ProjectName | null>(null);
  const [countUp, setCountUp] = useState<number>(0);
  const countUpAmount = 40;
  let myInterval = useRef<any>(null);

  const handleGameState = (event: any) => {
    const site = event.detail;
    setNavTouch(site);
  };

  useEffect(() => {
    if (navTouch === null) {
      clearInterval(myInterval.current);
      setCountUp(0);
      setNavGo(null);
      setNavWaiting(null);
      return;
    }
    setCountUp(20);
    myInterval.current = setInterval(() => {
      setCountUp((prev) => {
        const newBoy = prev + countUpAmount;
        const newLessThan100 = newBoy < 100 ? newBoy : 100;
        return newLessThan100;
      });
    }, 1000);

    return () => {
      clearInterval(myInterval.current);
    };
  }, [navTouch]);

  useEffect(() => {
    if (navTouch !== null && countUp === 100) {
      clearInterval(myInterval.current);
      setNavWaiting(navTouch);
    }
  }, [countUp, navTouch]);

  useEffect(() => {
    if (navWaiting === null) {
      return;
    }
    // console.log('TIMEOUT BEFORE', navWaiting);
    setTimeout(() => {
      // console.log('TIMEOUT AFTER', navWaiting);
      setNavGo(navWaiting);
    }, 2000);
  }, [navWaiting]);

  useEffect(() => {
    if (navGo === null || navTouch === null) {
      return;
    }
    // console.log('NAVIGATING', navGo);
    reactNavigate(navGo);
  }, [navGo]);

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

  const [numVidsLoaded, setNumVidsLoaded] = useState<number>(0);
  const [allVidsLoaded, setAllVidsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const videos = document.querySelectorAll('video');

    const onVideoLoaded = () => {
      setNumVidsLoaded((prevLoadedVideos) => prevLoadedVideos + 1);
    };

    videos.forEach((video) => {
      video.addEventListener('loadeddata', onVideoLoaded);
    });

    // Clean up the event listeners when the component unmounts
    return () => {
      videos.forEach((video) => {
        video.removeEventListener('loadeddata', onVideoLoaded);
      });
    };
  }, []);

  useEffect(() => {
    if (numVidsLoaded === projects.length) {
      console.log('All videos have loaded, do something here.');
      setAllVidsLoaded(true);
    }
  }, [numVidsLoaded]);

  /////////////////////////////////////
  // SET BOXES FOR PHASER
  /////////////////////////////////////
  useEffect(() => {
    if (!reactParentRef.current || !grassRef.current || !allVidsLoaded) {
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
      const project: ProjectName = child.children[0].children[0]
        .innerHTML as ProjectName;

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
  }, [reactParentRef, grassRef, allVidsLoaded]);

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
    window.addEventListener('gameState', handleGameState);

    return () => {
      window.removeEventListener('gameState', handleGameState);
    };
  }, [gameReady]);

  return (
    <div className="top">
      <div id={'react-parent'} ref={reactParentRef}>
        {projects.map((project, index) => {
          return (
            <div
              className={
                project.title === navTouch ? 'project' : 'project project-touch'
              }
              key={index}
            >
              <div className="project-overlay">
                <div className="project-title">{project.title}</div>
                <div className="project-type">{project.stack[0]}</div>
              </div>
              <video
                className="project-video"
                src={
                  process.env.PUBLIC_URL + '/videos/' + project.title + '.mp4'
                }
                autoPlay
                muted
                loop
              ></video>
              {project.title === navTouch && (
                <div className="progress-bar">
                  <ProgressBar
                    label={navTouch?.toUpperCase() + ''}
                    // label={navigateCandidate + ''}
                    // label={'Loading: ' + navigateCandidate}
                    score={countUp}
                  />
                  <div className="progress-bar-text">LOADING</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div id={'game-parent'} ref={gameParentRef} />
      <div className="grass" ref={grassRef}></div>
      {debugOptions.devMode && (
        <div className="states">
          <div className="nav-touch">NAV-TOUCH {navTouch}</div>
          <div className="nav-waiting">NAV-WAITING {navWaiting}</div>
          <div className="nav-go">NAV-GO {navGo}</div>
        </div>
      )}

      {navWaiting !== null && navTouch !== null && (
        <div className="nav-notif">
          <img
            className="nav-kirby"
            src={process.env.PUBLIC_URL + '/bigk.png'}
            alt="kirby"
          />
          <div className="nav-notif-text-small">Navigating To</div>
          <div className="nav-notif-text-big">{navTouch}</div>
        </div>
      )}
      {/* {navigateActual !== null && (
      )} */}
      {/* <div className="progress-bar">
        <ProgressBar label="Loading Project" score={countUp} />
      </div> */}
    </div>
  );
}

export default App;
