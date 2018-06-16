import _ from "lodash";
import Pixel from "./pixel";
import RGBA from "./rgba";

let id = 0;

function PixelImage(w, h) {
  if (!w || !h || typeof w !== "number" || typeof h !== "number" || w < 0 || h < 0) {
    throw new Error("Image must have a width and a height greater than 0");
  }
  Object.defineProperties(this, {
    width: { value: w },
    height: { value: h },
    id: { value: id }
  });
  id++;

  this.x = 0;
  this.y = 0;
  this.pixelCount = 0;
  this.pixels = [];

  return this;
}

PixelImage.prototype.createPixel = function (color) {
  this.pixels[this.pixelCount] = new Pixel(this.pixelCount, color, this.x, this.y);
  this.incrementPixelLocation();
  this.pixelCount += 1;
};

PixelImage.prototype.incrementPixelLocation = function () {
  if (this.x === (this.width - 1)) {
    this.x = 0;
    this.y++;
  } else {
    this.x++;
  }
};

PixelImage.prototype.addPixel = function (color, times) {
  if (times) {
    _.times(times, this.createPixel.bind(this, color));
  } else {
    this.createPixel(color);
  }
  this.length = this.pixels.length;
};

PixelImage.prototype.toArray = function () {
  if (this.pixelCount) {
    const l = this.pixelCount * 4;
    const pixels = new Uint8ClampedArray(l);
    for (let i = 0; i < l; i += 4) {
      const color = this.pixels[i / 4].color;
      pixels[i] = color.r;
      pixels[i + 1] = color.g;
      pixels[i + 2] = color.b;
      pixels[i + 3] = color.a;
    }
    return pixels;
  } else {
    return Uint8ClampedArray.from(this.pixels);
  }
};

PixelImage.prototype.fromArray = function (array, ratio) {
  const w = this.width * ratio * 4;
  const h = this.height * ratio;
  console.log("width:", this.width, "actualWidth", w);
  console.log("height:", this.height, "actualHeight", h);
  for (let i = 0; i < h; i += ratio) {
    for (let j = 0; j < w; j += (4 * ratio)) {
      const rgba = new RGBA(
        array[i * w + j],
        array[i * w + j + 1],
        array[i * w + j + 2],
        array[i * w + j + 3]
      );

      this.createPixel(rgba);
    }
  }
};

PixelImage.prototype.getPixelByPosition = function (x, y) {
  return _.find(this.pixels, (pixel) => pixel.imageY === y && pixel.imageX === x);
};

PixelImage.prototype.getPixelById = function (id) {
  return this.pixels[id];
};

PixelImage.prototype.setScale = function (scale) {
  this.pixels.forEach(pixel => {
    pixel.canvasX = pixel.imageX * scale;
    pixel.canvasY = pixel.imageY * scale;
  });
};


export default PixelImage;