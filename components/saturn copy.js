import React, { useRef, useEffect, useState } from 'react';
import { Sprite, Avatar } from '../lib/Sprite';
import styles from '../styles/saturn.module.scss';

const Saturn = () => {
  const canvasRef = useRef(null);
  const keysRef = useRef({});
  const [dialogBox, setDialogBox] = useState({ heading: 'Dosc', text: 'It was a zipadeedoodah kind of day... ' });
  const [showDialogBox, setShowDialogBox] = useState(false);
  const [dialogBoxTextIndex, setDialogBoxTextIndex] = useState(0);
  const [dialogBoxSpeed, setDialogBoxSpeed] = useState(44); // speed in milliseconds
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState({});

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  useEffect(() => {
    const imageSources = {
      backgroundSkyline: '/warped city files/warped city files/ENVIRONMENT/background/skyline-a.png',
      backgroundBuildingsFar: '/warped city files/warped city files/ENVIRONMENT/background/buildings-bg.png',
      backgroundBuildingsNear: '/warped city files/warped city files/ENVIRONMENT/background/near-buildings-bg.png',
      foregroundTexture: '/CITYBG/bg3.png',
      avatarIdle: './merchant/idle.png',
      avatarWalk: './merchant/walk.png',
    };
  
    const imagePromises = Object.entries(imageSources).map(([key, src]) =>
      loadImage(src).then((img) => [key, img])
    );
  
    Promise.all(imagePromises)
      .then((entries) => {
        const images = Object.fromEntries(entries);
        setImages(images);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading images:', error);
      });
  }, []);

  // loading
  useEffect(() => {
    // Simulate a loading delay
    const loadingDelay = 2000; // adjust as needed
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, loadingDelay);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    // initialize canvas/world
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const walkSound = new Audio('./Sprite__walking2.wav');
    const jumpSound = new Audio('./Sprite__jump2.wav');
    const bgMusic = new Audio('./Particle Mass--test.wav');

    walkSound.volume = 0.7; // 70% volume
    jumpSound.volume = .65; // Full volume
    bgMusic.volume = 0.25; // 50% volume

    bgMusic.loop = true;
    bgMusic.play();

    walkSound.loop = true;
    // jumpSound.loop = true;
    canvas.width = 800;
    canvas.height = 600;    
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Divide the canvas into 5 columns
    const columnWidth = canvas.width / 5;

    const backgroundSkyline = new Sprite({
      context: ctx,
      position: {
        x: 0,
        y: -450
      },
      imgSrc: `/warped city files/warped city files/ENVIRONMENT/background/skyline-a.png`,
      scale: 4,
      noRepeat: false,
    });

    const backgroundBuildingsFar = new Sprite({
      context: ctx,
      position: {
        x: 0,
        y: -70
      },
      imgSrc: `/warped city files/warped city files/ENVIRONMENT/background/buildings-bg.png`,
      scale: 5,
      noRepeat: false,
    });

    const backgroundBuildingsNear = new Sprite({
      context: ctx,
      position: {
        x: 0,
        y: -275
      },
      imgSrc: `/warped city files/warped city files/ENVIRONMENT/background/near-buildings-bg.png`,
      scale: 4,
      noRepeat: false,
    });

    const foregroundTexture = new Sprite({
      context: ctx,
      position: {
        x: 0,
        y: -300,
      },
      imgSrc: '/CITYBG/bg3.png',
      scale: 5,
      noRepeat: false,
    });

    // backgroundSkyline.draw();
    // backgroundBuildingsFar.draw();
    // backgroundBuildingsNear.draw();
    // foregroundTexture.draw();

  // initialize sprite/user-avatar
    const avatar = new Avatar({
      context: ctx,
      position: {
        x: 0,
        y: 0, 
      },
      velocity: {
        x: 0,
        y: 0,
      },
      imgSrc: './merchant/idle.png',
      framesMax: 4,
      scale: 3,
      offset: {
        x: 28,
        y: 80,
      },
      sprites: {
        idle: {
          imgSrc: './merchant/idle.png',
          framesMax: 4,
        },
        walk: {
          imgSrc: './merchant/walk.png',
          framesMax: 5,
        },
      },
    });
  
    avatar.draw();

    // animation loop
    const animate = () => {
      const column = Math.floor(avatar.position.x / columnWidth);
      const speedMultiplier = 1; // Increase speed in the last column
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
      const speedMultipliers = [0.1, 0.25, 0.5, .75]; // adjust these values as needed

      backgrounds.forEach((background, i) => {
        // If the avatar is 32px from either side of the canvas, adjust the background's x position based on the avatar's velocity
        if (avatar.position.x <= 32 || avatar.position.x >= canvas.width - 160) {
          background.position.x -= avatar.velocity.x * speedMultipliers[i];
        } else {
          // Apply a smaller parallax effect when the avatar is in the middle columns
          background.position.x -= avatar.velocity.x * speedMultipliers[i] * 0.5; // adjust the multiplier as needed
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

      // Draw green squares at the start of each section
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = 'green';
        ctx.fillRect(i * columnWidth, 0, 100, 100);
      }

      backgroundSkyline.update();
      backgroundBuildingsFar.update();
      backgroundBuildingsNear.update();
      foregroundTexture.update();

      ctx.fillStyle = 'rgba(255, 255, 255, .10)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw avatar
      avatar.update();

      avatar.velocity.x = 0;

      avatar.switchSprite('idle');
      
      if ((keysRef.current[' '])) {
        // reset jump sound
        // jumpSound.pause();
        // jumpSound.currentTime = 0;

        // no jumping while avatar is in air
        if ((avatar.position.y + avatar.height + 16 < canvas.height)) return;
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
        avatar.velocity.x -= 3;
        walkSound.play();
      } else if ((keysRef.current['ArrowRight'] && avatar.lastKey === 'ArrowRight') || (keysRef.current['d'] && avatar.lastKey === 'd')) {
        avatar.direction = 'right';
        avatar.switchSprite('walk');
        avatar.velocity.x += 3;
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
      bgMusic.pause();
    };
  }, []);

  useEffect(() => {
    if (showDialogBox && dialogBoxTextIndex === dialogBox.text.length) {
      const timer = setTimeout(() => {
        setShowDialogBox(false);
      }, 2000); // hide after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [showDialogBox, dialogBoxTextIndex, dialogBox.text.length]);


  return (
    <div className={styles.saturn}>
      {isLoading ? (
        <div className={styles.loading}>
          <h1>Loading...</h1>
          {/* Add your loading animation here */}
        </div>
      ) : (
        <>
          <canvas className={styles.saturn__canvas} ref={canvasRef} width={800} height={600} />
          {showDialogBox && (
            <div className={styles.saturn__dialog}>
              {dialogBox.heading && <h3>{dialogBox.heading}</h3>}
              <span>{dialogBox.text.substring(0, dialogBoxTextIndex)}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Saturn;