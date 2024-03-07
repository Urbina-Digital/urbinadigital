import React, { useRef, useEffect, useState } from 'react';

const Saturn = () => {
  
  const keysRef = useRef({});
  const [isImageLoaded, setImageLoaded] = useState(false);
  const directionMap = {
    down: 0,
    up: 3,
    right: 6,
    left: 6,
  };
  const totalFrames = 3;
  const frameWidth = 16;
  const frameHeight = 24;
  const directionRef = useRef('down');
  const frameRef = useRef(0);
  const positionRef = useRef({ x: 0, y: 0 });
  const movingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    ctx.fillStyle = 'offwhite'; // or 'gray' or any color you prefer
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const handleKeyDown = (event) => {
      keysRef.current[event.key] = true;
      movingRef.current = true;
      console.log('Key down:', event.key);
    };

    const handleKeyUp = (event) => {
      keysRef.current[event.key] = false;
      movingRef.current = Object.values(keysRef.current).some(key => key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  
    const img = new Image();
    img.src = './earthbound-mr.saturn.png'; // Updated image source path

    const drawSaturn = (ctx, direction, frame, img) => {
      const startingFrame = directionMap[direction];
      const currentFrame = startingFrame + (movingRef.current ? frame : 0); // Draw the first frame when not moving
      const sourceX = (currentFrame % 8) * frameWidth;
      const sourceY = Math.floor(currentFrame / 8) * frameHeight;
      const flip = direction === 'right' ? -1 : 1;

      ctx.save();
      ctx.translate((positionRef.current.x + (flip === -1 ? frameWidth : 0)) * 3, positionRef.current.y * 3);
      ctx.scale(flip * 1, 1);
      ctx.drawImage(img, sourceX, sourceY, frameWidth, frameHeight, 0, 0, frameWidth * 3, frameHeight * 3); // Draw the image at the origin
      ctx.restore();
    };

    img.onload = () => {
      console.log('Image loaded');
      setImageLoaded(true);
      drawSaturn(ctx, directionRef.current, frameRef.current, img);

      setInterval(() => {
        if (isImageLoaded) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawSaturn(ctx, directionRef.current, frameRef.current, img);
        }
      }, 1000 / 60);

      let intervalId = setInterval(() => {
        let newDirection;
        if (keysRef.current['ArrowUp'] || keysRef.current['w']) {
          newDirection = 'up';
          positionRef.current.y -= 0.6;
        }
        if (keysRef.current['ArrowDown'] || keysRef.current['s']) {
          newDirection = 'down';
          positionRef.current.y += 0.6;
        }
        if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
          newDirection = 'left';
          positionRef.current.x -= 0.6;
        }
        if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
          newDirection = 'right';
          positionRef.current.x += 0.6;
        }
        
        if (newDirection !== directionRef.current) {
          directionRef.current = newDirection;
          frameRef.current = 0;
        }
        
        if (movingRef.current) {
          frameRef.current = (frameRef.current + 1) % totalFrames;
        } else {
          frameRef.current = 0; // Reset the frame to the first frame when the character is not moving
        }
        
        if (isImageLoaded) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawSaturn(ctx, directionRef.current, frameRef.current, img);
        }
      }, 1000 / 20);
    };
  
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default Saturn;