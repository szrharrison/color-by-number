import _ from "lodash";
import Pixel from "./pixel";

function PixelImage(w, h) {
  Object.defineProperties(this, {
    x: {
      value: 0,
      writable: true
    },
    y: {
      value: 0,
      writable: true
    }
  });

  this.pixels = [];
  this.colors = [];
  this.width = w || null;
  this.height = h || null;
}

PixelImage.prototype.incrementPixelLocation = function () {
  if (this.x === (this.width - 1)) {
    this.x = 0;
    this.y++;
  } else {
    this.x++;
  }
};

PixelImage.prototype.addPixel = function (color, times) {
  const colorNum = this.colors.indexOf(color) + 1;
  if (colorNum === 0) {
    this.colors[this.colors.length] = color;
  }
  if (times) {
    _.times(times, () => {
      this.pixels[this.pixels.length] = new Pixel(color, this.x, this.y);
      this.incrementPixelLocation();
      if (colorNum > 0) {
        this.pixels[this.pixels.length - 1].colorNum = colorNum;
      } else {
        this.pixels[this.pixels.length - 1].colorNum = this.colors.length;
      }
    });
  } else {
    this.pixels[this.pixels.length] = new Pixel(color, this.x, this.y);
    this.incrementPixelLocation();
    if (colorNum > 0) {
      this.pixels[this.pixels.length - 1].colorNum = colorNum;
    } else {
      this.pixels[this.pixels.length - 1].colorNum = this.colors.length;
    }
  }
  this.length = this.pixels.length;
};

PixelImage.prototype.toArray = function () {
  const l = this.pixels.length;
  if (l) {
    const pixels = new Uint8ClampedArray(l * 4);
    for (let i = 0; i < l; i++) {
      pixels[i] = this.pixels[i].r;
      pixels[i + 1] = this.pixels[i].g;
      pixels[i + 2] = this.pixels[i].b;
      pixels[i + 3] = this.pixels[i].a;
    }
    return pixels;
  } else {
    return this.pixels;
  }
};

PixelImage.prototype.getPixelByPosition = function (x, y) {
  return _.find(this.pixels, (pixel) => pixel.x === x && pixel.y === y);
};

export default PixelImage;