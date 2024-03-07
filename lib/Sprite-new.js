const gravity = 0.7;

function mod(n, m) {
  return ((n % m) + m) % m;
}

class Sprite {
  constructor(img, options) {
    this.img = img;
    this.sx = options.sx;
    this.sy = options.sy;
    this.sWidth = options.sWidth;
    this.sHeight = options.sHeight;
    this.dx = options.dx;
    this.dy = options.dy;
    this.dWidth = options.dWidth;
    this.dHeight = options.dHeight;
  }

  draw(ctx) {
    ctx.drawImage(
      this.img,
      this.sx,
      this.sy,
      this.sWidth,
      this.sHeight,
      this.dx,
      this.dy,
      this.dWidth,
      this.dHeight
    );
  }
}

class Avatar {
  constructor(img, options) {
    this.sprite = new Sprite(img, options);
    this.dx = options.dx;
    this.dy = options.dy;
    this.dWidth = options.dWidth;
    this.dHeight = options.dHeight;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = options.ticksPerFrame || 0;
    this.numberOfFrames = options.numberOfFrames || 1;
  }

  update() {
    this.tickCount += 1;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      if (this.frameIndex < this.numberOfFrames - 1) {
        this.frameIndex += 1;
      } else {
        this.frameIndex = 0;
      }
    }
  }

  render(ctx) {
    this.sprite.draw(ctx);
    this.sprite.sx = this.frameIndex * this.sprite.sWidth / this.numberOfFrames;
  }
}

export { Sprite, Avatar };