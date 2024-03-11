import React, { useRef, useEffect, useState } from 'react';
import { Sprite, Avatar } from '../lib/Sprite';
import Achievement from '../components/achievement';
import styles from '../styles/saturn.module.scss';

const Saturn = () => {
  const canvasRef = useRef(null);
  const keysRef = useRef({});
  const [dialogBox, setDialogBox] = useState({
    heading: 'Dosc',
    text: 'It was a zipadeedoodah kind of day... ' });
  const [loadingText, setLoadingText] = useState('Loading...');
  const [showDialogBox, setShowDialogBox] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievement, setAchievement] = useState({
    heading: 'Achievement Unlocked',
    text: 'You have unlocked the achievement "First Steps"! '
  });
  const [isFTU, setFTUstatus] = useState(true);
  const [dialogBoxTextIndex, setDialogBoxTextIndex] = useState(0);
  const [dialogBoxSpeed, setDialogBoxSpeed] = useState(44); // speed in milliseconds
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState({});
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [loadingBarColor, setLoadingBarColor] = useState('red');
  const [audioData, setAudioData] = useState({});

  const loadAsset = (src) => {
    return new Promise((resolve, reject) => {
      if (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.jpeg')) {
        const img = new Image();
        img.onload = () => resolve({ type: 'image', asset: img });
        img.onerror = reject;
        img.src = src;
      } else if (src.endsWith('.wav')) {
        const audio = new Audio();
        audio.oncanplaythrough = () => resolve({ type: 'audio', asset: audio });
        audio.onerror = reject;
        audio.src = src;
      } else {
        reject(new Error('Unsupported asset type'));
      }
    });
  };

  useEffect(() => {
    const assetSources = {
      backgroundSkyline: '/warped city files/warped city files/ENVIRONMENT/background/skyline-a.png',
      backgroundBuildingsFar: '/warped city files/warped city files/ENVIRONMENT/background/buildings-bg.png',
      backgroundBuildingsNear: '/warped city files/warped city files/ENVIRONMENT/background/near-buildings-bg.png',
      foregroundTexture: '/CITYBG/bg3.png',
      avatarIdle: '/merchant/idle.png',
      avatarWalk: '/merchant/walk.png',
      toasterBotIdle: '/Toaster Bot/idle.png',
      toasterBotRun: '/Toaster Bot/run.png',
      stormHeadIdle: '/stormhead/idle.png',
      stormHeadRun: '/stormhead/run.png',
      walkAudio: '/Sprite__walking2.wav',
      jumpAudio: '/Sprite__jump2.wav',
      dialogAudio: '/dialogBox__typing.wav',
      bgMusic: '/Particle Mass--test.wav',
      achievementAudio: '/achievementJingle.wav',
      iconAchievement: '/icons/achievementIcon.png',
    };
  
    const totalAssets = Object.keys(assetSources).length;
    let loadedAssets = 0;
  
    const assetPromises = Object.entries(assetSources).map(([key, src]) =>
      loadAsset(src).then(({ type, asset }) => {
        loadedAssets++;
        setLoadingPercentage((loadedAssets / totalAssets) * 100);
        return [key, { type, asset }];
      })
    );

    Promise.all(assetPromises)
      .then((entries) => {
        const assetObj = Object.fromEntries(entries);
        setAssets(assetObj);
        // Simulate a loading delay
        console.log('what is assets ->', assetObj);

      }).then(() => { 
        setLoadingText('Click Anywhere to Begin');

      }).catch((error) => {
        console.error('Error loading assets:', error);
      });

    return () => {
      clearTimeout(loadingTimer)
    };
  }, []);

  useEffect(() => {
    const handleClick = () => {
      console.log('clicked');
      console.log('loadingText ->', loadingText);
      if (loadingText !== 'Loading...' && isFTU) {
        setIsLoading(false);
        console.log('just clicked to start');
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [loadingText, isFTU]);

  useEffect(() => {
    // initialize canvas/world
    if (!canvasRef.current || isLoading) return;
    console.log('what is assets:', assets);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const backgroundSkyline = new Sprite({
      context: ctx, // canvas context
      image: assets.backgroundSkyline.asset,
      position: { x: 0, y: -135 },
      scale: 3,
      noRepeat: false,
    });

    const backgroundBuildingsFar = new Sprite({
      context: ctx, // canvas context
      image: assets.backgroundBuildingsFar.asset,
      position: { x: 0, y: 65},
      scale: 4,
      noRepeat: false,
    });

    const backgroundBuildingsNear = new Sprite({
      context: ctx, // canvas context
      image: assets.backgroundBuildingsNear.asset,
      position: { x: 0, y: -250 },
      scale: 4,
      noRepeat: false,
    });

    const foregroundTexture = new Sprite({
      context: ctx, // canvas context
      image: assets.foregroundTexture.asset,
      position: { x: 0, y: -300 },
      scale: 5,
      noRepeat: false,
    });

    const backgroundMusic = assets.bgMusic.asset;
    const walkSound = assets.walkAudio.asset;
    const jumpSound = assets.jumpAudio.asset;
    const dialogSound = assets.dialogAudio.asset;
    const achievementSound = assets.achievementAudio.asset;

    walkSound.volume = 0.7; // 70% volume
    jumpSound.volume = .65; // Full volume
    backgroundMusic.volume = 0.25; // 50% volume
    dialogSound.volume = 0.5; // 50% volume
    achievementSound.volume = 0.15; // 50% volume

    backgroundMusic.loop = true;
    backgroundMusic.play();
    // dialogSound.loop = true; 

    walkSound.loop = true;
    // jumpSound.loop = true;
    canvas.width = 800;
    canvas.height = 600;    
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Divide the canvas into 5 columns
    const columnWidth = canvas.width / 5;

  // initialize sprite/user-avatar
    const avatar = new Avatar({
      context: ctx,
      image: assets.avatarIdle.asset,
      position: {
        x: 0,
        y: 400, 
      },
      velocity: {
        x: 0,
        y: 0,
      },
      framesMax: 4,
      frameOrientation: 'horizontal',
      scale: 3,
      offset: {
        x: 0,
        y: 80,
      },
      sprites: {
        idle: {
          img: assets.avatarIdle.asset,
          framesMax: 4,
        },
        walk: {
          img: assets.avatarWalk.asset,
          framesMax: 5,
        },
      },
    });

    const toastBot = new Avatar({
      context: ctx,
      image: assets.toasterBotIdle.asset,
      position: {
        x: 400,
        y: 250, 
      },
      velocity: {
        x: 0,
        y: 0,
      },
      framesMax: 5,
      frameOrientation: 'horizontal',
      direction: 'left',
      scale: 2,
      offset: {
        x: 4,
        y: 16,
      },
      sprites: {
        idle: {
          img: assets.toasterBotIdle.asset,
          framesMax: 5,
        },
        walk: {
          img: assets.toasterBotRun.asset,
          framesMax: 8,
        },
      },
    });
    
    const stormHead = new Avatar({
      context: ctx,
      image: assets.stormHeadIdle.asset,
      position: {
        x: 200,
        y: -800, 
      },
      velocity: {
        x: 0,
        y: 0,
      },
      framesMax: 9,
      direction: 'left',
      frameOrientation: 'vertical',
      scale: 2,
      offset: {
        x: 0,
        y: -868,
      },
      sprites: {
        idle: {
          img: assets.stormHeadIdle.asset,
          framesMax: 9,
        },
        walk: {
          img: assets.stormHeadRun.asset,
          framesMax: 10,
        },
      },
    });

    // toastBot.draw();
    // stormHead.draw();

    // animation loop
    const animate = () => {
      // const column = Math.floor(avatar.position.x / columnWidth);
      // const speedMultiplier = 1; // Increase speed in the last column
      // avatar.velocity.x *= speedMultiplier;

      // update game state
      // draw game state
      // request new frame
      window.requestAnimationFrame(animate);

      // clear canvas "fill with black color"
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Adjust the x position of the backgrounds
      const backgrounds = [backgroundSkyline, backgroundBuildingsFar, backgroundBuildingsNear, foregroundTexture];
      const speedMultipliers = [0.1, 0.25, 0.5, .7]; // adjust these values as needed

      // parallax effect
      backgrounds.forEach((background, i) => {
        // If the avatar is 32px from either side of the canvas, adjust the background's x position based on the avatar's velocity
        if (avatar.position.x <= 32 || avatar.position.x >= canvas.width - 160) {
          background.position.x -= avatar.velocity.x * speedMultipliers[i];
          toastBot.position.x -= avatar.velocity.x * speedMultipliers[3];
          stormHead.position.x -= avatar.velocity.x * speedMultipliers[3];
        } else {
          // Apply a smaller parallax effect when the avatar is in the middle columns
          background.position.x -= avatar.velocity.x * speedMultipliers[i] * 0.8; // adjust the multiplier as needed
          toastBot.position.x -= avatar.velocity.x * speedMultipliers[3] * 0.8; // adjust the multiplier as needed
          stormHead.position.x -= avatar.velocity.x * speedMultipliers[3] * 0.8; // adjust the multiplier as needed

        }

        // Calculate the width of a single frame of the sprite image
        const frameWidth = (background.width / background.framesMax) * background.scale;

        // Calculate the number of times the sprite image is repeated
        const repeatX = Math.ceil(canvas.width / frameWidth);

        // Calculate the total width of the repeated sprite image
        const totalWidth = frameWidth * repeatX;

        // Reset the x position of the sprite when it moves off the canvas
        if (background.position.x < -totalWidth) {
          background.position.x += totalWidth;
        }
      });

      // Limit the avatar's x position to the canvas width
      avatar.position.x = Math.max(32, Math.min(avatar.position.x, canvas.width - 160));

      backgroundSkyline.update();
      backgroundBuildingsFar.update();
      backgroundBuildingsNear.update();
      foregroundTexture.update();

      ctx.fillStyle = 'rgba(255, 255, 255, .10)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw green squares at the start of each full-width section
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = 'green';
        ctx.fillRect(i * canvas.width - avatar.distanceTraveled, 0, 100, 100);
      }

      toastBot.update();
      toastBot.velocity.x = 0;
      toastBot.switchSprite('idle');
      
      stormHead.update();
      stormHead.velocity.x = 0;
      stormHead.switchSprite('idle');

      // console.log('where is stormhead ->', stormHead.position.y, '\n his velocity: ', stormHead.velocity.y, '\n his height: ', stormHead.height);

      // draw avatar
      avatar.update();
      avatar.velocity.x = 0;
      avatar.switchSprite('idle');

      // console.log('where is avatar ->', avatar.position.y, '\n his velocity: ', avatar.velocity.y, '\n his height: ', avatar.height);

      if ((keysRef.current[' '])) {
        // reset jump sound
        // jumpSound.pause();
        // jumpSound.currentTime = 0;

        // no jumping while avatar is in air
        if ((avatar.position.y + avatar.height + 16 < canvas.height)) {
          console.log('didnt jump'); 
          return;
        }
        avatar.switchSprite('idle');
        avatar.velocity.y = -16;
        if (!jumpSound.paused) {
          jumpSound.pause();
          jumpSound.currentTime = 0;
        }
        jumpSound.play();
        console.log('jumped');
      }
      if ((keysRef.current['ArrowDown']) || keysRef.current['s'] && avatar.lastKey === 's') {
        // if in air, fast fall
        if ((avatar.position.y + avatar.height < canvas.height - (avatar.height))) {
          avatar.velocity.y += 1.4;
        }
      }
      if ((keysRef.current['ArrowLeft'] && avatar.lastKey === 'ArrowLeft') || (keysRef.current['a'] && avatar.lastKey === 'a')) {
        avatar.direction = 'left';
        avatar.switchSprite('walk');
        avatar.velocity.x -= 1;
        toastBot.velocity.x += 1;
        stormHead.velocity.x += 1;
        walkSound.play();
      } else if ((keysRef.current['ArrowRight'] && avatar.lastKey === 'ArrowRight') || (keysRef.current['d'] && avatar.lastKey === 'd')) {
        avatar.direction = 'right';
        avatar.switchSprite('walk');
        avatar.velocity.x += 1;
        toastBot.velocity.x -= 1;
        stormHead.velocity.x -= 1;

        walkSound.play();
      } else {
        avatar.switchSprite('idle');
        walkSound.pause();
        walkSound.currentTime = 0;
      }

      // collision detection
    };

    animate(); 

    const handleKeyDown = (event) => {
      keysRef.current[event.key] = true;
      switch (event.key) {
        case '1':
          avatar.lastKey = '1';
          setShowDialogBox(prevShowDialogBox => {
            // If the dialog box is currently shown, reset the text index when closing it
            if (prevShowDialogBox) {
              setDialogBoxTextIndex(0);
            }
            return !prevShowDialogBox;
          });
          break;
        case '3':
          if (showDialogBox) return;
          avatar.lastKey = '3';
          setShowAchievement(prevShowAchievement => {
            // If the dialog box is currently shown, reset the text index when closing it
            // if (prevShowAchievement) {
            //   setDialogBoxTextIndex(0);
            // }
            return !prevShowAchievement;
          });
          break;
        case 'ArrowUp':
          avatar.lastKey = 'ArrowUp';
          break;
        case 'ArrowDown':
          avatar.lastKey = 'ArrowDown';
          break;
        case 'ArrowLeft':
          avatar.lastKey = 'ArrowLeft';
          break;
        case 'ArrowRight':
          avatar.lastKey = 'ArrowRight';
          break;
        case 'w':
          avatar.lastKey = 'w';
          break;
        case 's':
          avatar.lastKey = 's';
          break;
        case 'a':
          avatar.lastKey = 'a';
          break;
        case 'd':
          avatar.lastKey = 'd';
          break;
        case ' ':
          avatar.lastKey = '';
          break;
        default:
          avatar.lastKey = null;
          break;
      }
    };
    const handleKeyUp = (event) => {
      switch (event.key) {
        case '1':
          avatar.lastKey = 'null';
          break;
        case ' ':
          avatar.lastKey = null;
          break;
        case 'ArrowUp':
          avatar.lastKey = null;
          break;
        case 'ArrowDown':
          avatar.lastKey = null;
          break;
        case 'ArrowLeft':
          avatar.lastKey = null;
          break;
        case 'ArrowRight':
          avatar.lastKey = null;
          break;
        case 'w':
          avatar.lastKey = null;
          break;
        case 's':
          avatar.lastKey = null;
          break;
        case 'a':
          avatar.lastKey = null;
          break;
        case 'd':
          avatar.lastKey = null;
          break;
        default:
          avatar.lastKey = null;
          break;
      }
      keysRef.current[event.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      backgroundMusic.pause();
    };
  }, [isLoading, assets]);

  // Intro after load
  useEffect(() => {
    if (!isLoading && isFTU && !showDialogBox) {
      const timer = setTimeout(() => {
        setShowDialogBox(true);
        setFTUstatus(false);
      }, 800); // show after .8 seconds

      const timer2 = setTimeout(() => {
        if (!showDialogBox) setShowAchievement(true);
      }, 3000); // show first achievement after 3 seconds
      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
      };
    }
  }, [showDialogBox, isLoading, isFTU]);
  
  // auto hide acheivements
  useEffect(() => {
    console.log('triggering achievement');
    if (!isLoading && !isFTU && !showDialogBox && showAchievement) {
      assets.achievementAudio.asset.play();
      const timer = setTimeout(() => {
        setShowAchievement(false);
        assets.achievementAudio.asset.currentTime = 0;
      }, 2000); // hide after 2 seconds

      return () => clearTimeout(timer);

    }
  }, [showAchievement, isLoading, isFTU, showDialogBox]);

  // binding autotype and sound to dialog box
  useEffect(() => {
    // const dialogSound = assets.dialogAudio.asset;

    if (showDialogBox && dialogBoxTextIndex < dialogBox.text.length) {
      const timer = setTimeout(() => {
        assets.dialogAudio.asset.play();
        setDialogBoxTextIndex(prevIndex => prevIndex + 1);
        assets.dialogAudio.asset.currentTime = 0;
      }, dialogBoxSpeed);

      return () => clearTimeout(timer);
    }
  }, [!isLoading, assets, showDialogBox, dialogBoxTextIndex, dialogBox.text.length, dialogBoxSpeed]);

  // auto close dialog box
  useEffect(() => {
    if (showDialogBox && dialogBoxTextIndex === dialogBox.text.length) {
      const timer = setTimeout(() => {
        setShowDialogBox(false);
        setDialogBoxTextIndex(0);
        assets.dialogAudio.asset.pause();
        assets.dialogAudio.asset.currentTime = 0;

      }, 1500); // hide after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [showDialogBox, dialogBoxTextIndex, dialogBox.text.length]);
  


  return (
    <div className={styles.saturn}>
      {showAchievement && (
        <Achievement title={achievement.heading} description={achievement.text} icon={assets.iconAchievement.asset} />
      )}
      {isLoading && (
        <div className={styles.loading}>
          <h1>{ loadingText }</h1>
          <div className={styles.loading__wrap}>
            <div className={styles.loading__bar} style={{ width: `${loadingPercentage}%`, backgroundColor: loadingBarColor }}></div>
          </div>
        </div>
      )}
    <canvas className={styles.saturn__canvas} ref={canvasRef} width={800} height={600} />
    {showDialogBox && (
      <div className={styles.saturn__dialog}>
        {dialogBox.heading && <h3>{dialogBox.heading}</h3>}
        <span>{dialogBox.text.substring(0, dialogBoxTextIndex)}</span>
      </div>
    )}
  </div>
  );
};

export default Saturn;