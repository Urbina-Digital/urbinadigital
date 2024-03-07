const gravity = 0.7;

function mod(n, m) {
  return ((n % m) + m) % m;
}

class Sprite {
  constructor({ context, image, position, scale = 1, framesMax = 1, offset = {x: 0, y: 0}, direction = 'right', noRepeat = true}) {
    this.context = context;
    this.image = image;
    this.position = position;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 12;
    this.offset = offset;
    this.direction = direction;
    this.noRepeat = noRepeat;
    this.loaded = false;

    this.width = this.image.width;
    this.height = this.image.height;
    this.loaded = true;

    if (!this.noRepeat) {
      this.createPatternCanvas();
    }
  }

  createPatternCanvas() {
    this.patternCanvas = document.createElement('canvas');
    const drawWidth = (this.width / this.framesMax) * this.scale;
    const repeatX = Math.ceil(this.context.canvas.width / drawWidth) * 2; // Multiply by 2
    this.patternCanvas.width = this.image.width * repeatX;
    this.patternCanvas.height = this.image.height;
    const patternContext = this.patternCanvas.getContext('2d');
  
    for (let i = 0; i < repeatX; i++) {
      patternContext.drawImage(
        this.image,
        0,
        0,
        this.image.width,
        this.image.height,
        i * this.image.width,
        0,
        this.image.width,
        this.image.height
      );
    }
  }

  draw() {
    if (!this.loaded) {
      return;
    }

    const frameWidth = this.image.width / this.framesMax;
    const frameHeight = this.image.height;
    const drawWidth = (this.width / this.framesMax) * this.scale;
    const drawHeight = this.height * this.scale;

    if (this.direction === 'left') {
      this.drawFlipped(frameWidth, frameHeight, drawWidth, drawHeight);
    } else {
      if (!this.noRepeat) {
        this.drawPatternCanvas();
      } else {
        this.drawNormal(frameWidth, frameHeight, drawWidth, drawHeight);
      }
    }
  }

  drawFlipped(frameWidth, frameHeight, drawWidth, drawHeight) {
    this.context.save();
    // Translate context by pivot point
    this.context.translate((this.position.x - 32) + drawWidth / 2, 0);
    this.context.scale(-1, 1); // flip the image
    // Translate context back by pivot point
    this.context.translate(-(this.position.x - 32) - drawWidth / 2, 0);
    this.context.drawImage(
      this.image,
      this.framesCurrent * frameWidth,
      0,
      frameWidth,
      frameHeight,
      this.position.x - this.offset.x, 
      this.position.y - this.offset.y, 
      drawWidth, 
      drawHeight);
    this.context.restore();
  }

  drawPatternCanvas() {
    const drawX = mod(-this.position.x, this.image.width); // Use the custom modulus function
  
    this.context.drawImage(
      this.patternCanvas,
      drawX,
      0,
      this.patternCanvas.width,
      this.patternCanvas.height,
      0, // Draw at the left edge of the canvas
      this.position.y,
      this.patternCanvas.width * this.scale,
      this.patternCanvas.height * this.scale
    );
  }

  drawNormal(frameWidth, frameHeight, drawWidth, drawHeight) {
    this.context.drawImage(
      this.image,
      this.framesCurrent * frameWidth,
      0,
      frameWidth,
      frameHeight,
      this.position.x - this.offset.x, 
      this.position.y - this.offset.y, 
      drawWidth, 
      drawHeight);
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Avatar extends Sprite {
  constructor({ 
    context, 
    image,
    position,
    velocity, 
    lastKey,
    scale = 1, 
    framesMax = 1,
    offset = {x: 0, y: 0},
    sprites,
    direction = 'right',
  }) {
    super({ 
      image, 
      position,
      scale, 
      framesMax, 
      offset,
      direction,
    });
    
    this.context = context;
    this.image = image;
    this.position = position;
    this.velocity = velocity;
    this.lastKey = lastKey;
    this.width = this.image.width;
    this.height = this.image.height;
    this.idle = false;
    this.hitBox = {
      position: this.position,
      width: 8,
      height: 8,
    };
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.sprites = sprites;
    this.distanceTraveled = 0;

    console.log('sprites ->', this.sprites);
  }

  update() {
    this.draw();
    this.animateFrames();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.distanceTraveled += this.velocity.x;

    //gravity function
    if ((this.position.y + this.height + this.velocity.y) >= this.context.canvas.height - 17) {
      this.velocity.y = 0;
      this.position.y = 520;

      // console.log('this.position.y ->', this.position.y);
      
    } else {
      this.velocity.y += gravity;
    }
  }
  
  switchSprite(sprite) {
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.img) {
          this.image = this.sprites.idle.img;
          this.width = 256;
          this.framesMax = this.sprites.idle.framesMax;
        }
        break;
      case 'walk':
        if (this.image !== this.sprites.walk.img) {
          this.image = this.sprites.walk.img;
          this.width = 320;
          this.framesMax = this.sprites.walk.framesMax;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.idle.img) {
          this.width = 256;
          this.image = this.sprites.idle.img;
          this.framesMax = this.sprites.idle.framesMax;
        }
        break;
      default:
        if (this.image !== this.sprites.idle.img) {
          this.width = 256;
          this.image = this.sprites.idle.img;
          this.framesMax = this.sprites.idle.framesMax;
        }
        break;
    }
  }
}

export { Sprite, Avatar };