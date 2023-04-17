import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import GameScene from './phaser/GameScene';
import { projects } from './helpersReact/projectArray';
import { Box, Location2D, ProjectName, Screen } from './typescript';
import moment, { Moment } from 'moment';
import { printMe } from './helpersReact/printing';
import { reactNavigate } from './helpersReact/helpers';
import { ProgressBar } from 'react-progressbar-fancy';
import { debugOptions } from './debugOptions';

export const __DEV__ = process.env.NODE_ENV === 'development';

function App() {
  const gameParentRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const grassRef = useRef<HTMLDivElement>(null);
  let myInterval = useRef<any>(null);
  let playerXY = useRef<Location2D | null>(null);

  const [gameReady, setGameReady] = useState<boolean>(false);
  const [hoverClass, setHoverClass] = useState<string>('disable-hover');
  const [navTouch, setNavTouch] = useState<ProjectName | null>(null);
  const [navWaiting, setNavWaiting] = useState<ProjectName | null>(null);
  const [navGo, setNavGo] = useState<ProjectName | null>(null);
  const [navCount, setNavCount] = useState<number>(0);
  const navCountAdd = 50;
  const navCountTop = 150;
  const [clickMoment, setClickMoment] = useState<Moment | null>(null);
  const [numClicks, setNumClicks] = useState<number>(0);

  const handleGameState = (event: any) => {
    const site = event.detail;
    setNavTouch(site);
    if (site !== null) {
      setNumClicks(100);
    }
  };

  useEffect(() => {
    __DEV__ && console.log('numClicks', numClicks);
  }, [numClicks]);

  useEffect(() => {
    __DEV__ && console.log('clickMoment', clickMoment);
    if (clickMoment === null) {
      return;
    }

    setNumClicks((prev) => prev + 1);
  }, [clickMoment]);

  const handleClickDown = () => {
    __DEV__ && console.log('clickDown');
    setClickMoment(moment());
  };

  const handleClickUp = () => {
    __DEV__ && console.log('clickUp');
  };

  const handleMouseMove = (event: any) => {
    if (gameRef.current === null) {
      return;
    }

    // Update active pointer's position in Phaser
    const bounds = gameRef.current.canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    gameRef.current.input.activePointer.position.setTo(x, y);

    // Trigger the appropriate Phaser events
    gameRef.current.input.activePointer.dirty = true;
    gameRef.current.input.updateInputPlugins(
      'pointermove',
      gameRef.current.input.activePointer,
      false
    );
  };

  //////////////////////////////////////////////////
  // NAV_TOUCH => COUNTING
  //////////////////////////////////////////////////
  useEffect(() => {
    if (navTouch === null) {
      clearInterval(myInterval.current);
      setNavCount(0);
      setNavGo(null);
      setNavWaiting(null);
      return;
    }
    setNavCount(0);
    myInterval.current = setInterval(() => {
      setNavCount((prev) => {
        const newBoy = prev + navCountAdd;
        const newLessThan100 = newBoy < navCountTop ? newBoy : navCountTop;
        return newLessThan100;
      });
    }, 1000);

    return () => {
      clearInterval(myInterval.current);
    };
  }, [navTouch]);

  //////////////////////////////////////////////////
  // COUNTING => NAV_WAITING
  //////////////////////////////////////////////////
  useEffect(() => {
    if (navTouch !== null && navCount === navCountTop) {
      clearInterval(myInterval.current);
      setNavWaiting(navTouch);
    }
  }, [navCount, navTouch]);

  //////////////////////////////////////////////////
  // NAV_WAITING => NAV_GO
  //////////////////////////////////////////////////
  useEffect(() => {
    if (navWaiting === null) {
      return;
    }
    setTimeout(() => {
      setNavGo(navWaiting);
    }, 2000);
  }, [navWaiting]);

  //////////////////////////////////////////////////
  // NAV_GO
  //////////////////////////////////////////////////
  useEffect(() => {
    if (navGo === null || navTouch === null) {
      return;
    }
    reactNavigate(navGo);
  }, [navGo]);

  const handleGameReady = () => {
    setGameReady(true);
  };

  const reactParentRef = useRef<HTMLDivElement>(null);
  const [myBoxes, setMyBoxes] = useState<Box[]>([]);
  const [screen, setScreen] = useState<Screen>({
    width: 0,
    height: 0,
  });

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
      __DEV__ && console.log('All videos have loaded, do something here.');
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
    let lastBoxX = 0;
    let lastBoxY = 0;
    let penUltimateBoxX = 0;
    let penUltimateBoxY = 0;
    for (let i = 0; i < numChildren; i++) {
      const child = reactParentRef.current.children[i];
      const rect = child.getBoundingClientRect();
      const project: ProjectName = child.children[0].children[0]
        .innerHTML as ProjectName;

      __DEV__ && console.log('project', project);
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
        x: x,
        y: y,
      };
      printMe('newBox', newBox);
      myNewBoxes.push(newBox);

      if (i === numChildren - 1) {
        lastBoxX = x;
        lastBoxY = y;
      }
      if (i === numChildren - 2) {
        penUltimateBoxX = x;
        penUltimateBoxY = y;
      }
    }

    playerXY.current = {
      x: Math.abs(penUltimateBoxX - lastBoxX),
      y: Math.abs(penUltimateBoxY - lastBoxY),
    };

    ///////////////////////////////
    // ADD GRASS
    ///////////////////////////////
    const rect = grassRef.current.getBoundingClientRect();
    const grassPxHeight = 32;
    const grassPixTop = 6;
    const percentKeep = (grassPxHeight - grassPixTop) / grassPxHeight;
    // const percentKeep = (15 - 3) / 15;
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

    const boxPenultimate = myBoxes[4];
    const boxUltimate = myBoxes[5];

    let sumY = 0;
    for (let i = 0; i < myBoxes.length; i++) {
      sumY += myBoxes[i].y;
    }

    const kirbyY = sumY / myBoxes.length;

    const kirbyXY = {
      x: (boxPenultimate.x + boxUltimate.x) * 0.5,
      y: kirbyY,
    };

    let config: Phaser.Types.Core.GameConfig = {
      plugins: {
        global: [],
      },
      backgroundColor: '#3399ff',
      // backgroundColor: '#aaccff',
      // transparent: true,
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
          gravity: { y: 1000 },
          debug: debugOptions.devMode,
        },
      },
      scene: [GameScene],
    };

    gameRef.current = new Phaser.Game(config);
    gameRef.current.registry.set('config', config);
    gameRef.current.registry.set('myBoxes', myBoxes);
    gameRef.current.registry.set('kirbyXY', kirbyXY);
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

    setHoverClass('');

    __DEV__ && console.log('Game Ready');
    window.addEventListener('gameState', handleGameState);
    window.addEventListener('mousedown', handleClickDown);
    window.addEventListener('mouseup', handleClickUp);
    window.addEventListener('touchstart', handleClickDown);
    window.addEventListener('touchend', handleClickUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('gameState', handleGameState);
      window.removeEventListener('mousedown', handleClickDown);
      window.removeEventListener('mouseup', handleClickUp);
      window.removeEventListener('touchstart', handleClickDown);
      window.removeEventListener('touchend', handleClickUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameReady]);

  return (
    <div className={'top' && hoverClass ? ' disable-hover' : ''}>
      <div className="transparent-layer"></div>
      <div
        id={'react-parent'}
        // onMouseEnter={() => {
        //   setIsHovering(true);
        // }}
        // onMouseLeave={() => {
        //   setIsHovering(false);
        // }}
        // onClick={handleClick}
        // className={isClickDown ? 'cursorCrosshair' : 'cursorNormal'}
        // onMouseDown={() => {
        //   setIsClickDown(true);
        // }}
        // onMouseUp={() => {
        //   setIsClickDown(false);
        // }}
        ref={reactParentRef}
      >
        {projects
          .slice()
          .reverse()
          .map((project, index) => {
            return (
              <div
                className={
                  project.title !== navTouch
                    ? 'project'
                    : project.colorScheme === 'light'
                    ? 'project project-touch border-dark'
                    : 'project project-touch border-light'
                }
                key={index}
                // onMouseEnter={() => {
                //   setIsHovering(true);
                // }}
                // onMouseLeave={() => {
                //   setIsHovering(false);
                // }}
              >
                <div
                  className={
                    project.title === navTouch
                      ? 'project-overlay project-overlay-touch'
                      : 'project-overlay'
                  }
                >
                  {project.colorScheme === 'dark' && (
                    <>
                      <div
                        className={
                          project.title === navTouch
                            ? 'color-trans'
                            : 'project-title color-light'
                        }
                      >
                        {project.title}
                      </div>
                      <div
                        className={
                          project.title === navTouch
                            ? 'color-trans'
                            : 'project-type color-light'
                        }
                      >
                        {project.stack[0]}
                      </div>
                    </>
                  )}
                  {project.colorScheme === 'light' && (
                    <>
                      <div
                        className={
                          project.title === navTouch
                            ? 'color-trans'
                            : 'project-title color-dark'
                        }
                      >
                        {project.title}
                      </div>
                      <div
                        className={
                          project.title === navTouch
                            ? 'color-trans'
                            : 'project-type color-dark'
                        }
                      >
                        {project.stack[0]}
                      </div>
                    </>
                  )}
                </div>
                <video
                  className="project-video"
                  src={
                    process.env.PUBLIC_URL +
                    '/videos2/' +
                    project.title +
                    '.mp4'
                  }
                  autoPlay
                  muted
                  loop
                ></video>
                {project.title === navTouch && (
                  <div className="progress-bar">
                    <ProgressBar
                      label={'LOADING'}
                      darkTheme={true}
                      score={navCount}
                    />
                    <div className="progress-bar-text">
                      {navTouch?.toUpperCase() + ''}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div
        className="project-resume"
        onClick={() => {
          __DEV__ && console.log('Resume Clicked');
          reactNavigate('Resume');
        }}
      >
        <div className="project-resume-text">Eric's Resume</div>
      </div>
      <div
        className={'game-parent'}
        // id={isClickDown ? 'cursorCrosshair' : 'cursorNormal'}
        // onMouseDown={() => {
        //   setIsClickDown(true);
        // }}
        // onMouseUp={() => {
        //   setIsClickDown(false);
        // }}
        ref={gameParentRef}
      />
      <div
        className={
          screen.height > screen.width ? 'grass phone' : 'grass computer'
        }
        ref={grassRef}
      ></div>
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
            src={process.env.PUBLIC_URL + '/bigksquare.png'}
            alt="kirby"
          />
          <div className="nav-notif-text-small">Navigating To</div>
          <div className="nav-notif-text-big">{navTouch}</div>
        </div>
      )}

      {/* ////////////////////////////////// */}
      {/* PHONE */}
      {/* ////////////////////////////////// */}
      {screen.height > screen.width && (
        <>
          {numClicks === 0 && (
            <div className="clicks">
              <div className="clicks-text clicks-text-last">Click!</div>
            </div>
          )}
          {numClicks === 1 && (
            <div className="clicks">
              <div className="clicks-text">He</div>
              <div className="clicks-text">Follows</div>
              <div className="clicks-text clicks-text-last">You!</div>
            </div>
          )}
          {numClicks === 2 && (
            <div className="clicks">
              <div className="clicks-text">Put Him</div>
              <div className="clicks-text">On A</div>
              <div className="clicks-text clicks-text-last">Project!</div>
            </div>
          )}
        </>
      )}
      {/* ////////////////////////////////// */}
      {/* COMPUTER */}
      {/* ////////////////////////////////// */}
      {screen.height < screen.width && (
        <>
          {numClicks === 0 && (
            <div className="clicks">
              <div className="clicks-text-mid">Click!</div>
            </div>
          )}
          {numClicks === 1 && (
            <div className="clicks">
              <div className="clicks-text-mid">He Follows You!</div>
            </div>
          )}
          {numClicks === 2 && (
            <div className="clicks">
              <div className="clicks-text-mid">Put Him On A Project!</div>
            </div>
          )}
        </>
      )}

      {/* ////////////////////////////////// */}
      {/* LOADER */}
      {/* ////////////////////////////////// */}
      {!gameReady && (
        <div className="loader">
          <div className="clicks-text-mid">Loading...</div>
        </div>
      )}
    </div>
  );
}

export default App;
