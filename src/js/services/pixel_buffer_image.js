import _ from "lodash";
import Pixel from "./pixel";
import colorStore from "./color_store";

const createPixel = function (colorNum) {
  const pixelId = this.pixelCount * 6;
  this.pixels[pixelId] = colorNum;
  this.pixels[pixelId + 1] = this.x;
  this.pixels[pixelId + 2] = this.y;
  this.pixels[pixelId + 3] = 0;
  this.pixels[pixelId + 4] = 0;
  this.pixels[pixelId + 5] = 0;
  this.incrementPixelLocation();
  colorStore.get("count")[colorNum] += 1;
  if (colorNum === 0) {
    this.pixels[pixelId + 5] = 1;
  }
  this.pixelCount += 1;
};

const incrementPixelLocation = function () {
  if (this.x === (this.width - 1)) {
    this.x = 0;
    this.y++;
  } else {
    this.x++;
  }
};

const addPixel = function (color, times) {
  let colorNum = this.colors.indexOf(color) + 1;
  if (colorNum === 0 && color.a !== 0) {
    this.colors[this.colors.length] = color;
    colorNum = color.number = this.colors.length;
    colorStore.get("count")[colorNum] = 0;
  }
  if (times) {
    _.times(times, this.createPixel.bind(this, colorNum));
  } else {
    this.createPixel(color, colorNum);
  }
};

const toArray = function () {
  const l = this.pixelCount;
  if (l) {
    const pixels = new Uint8ClampedArray(l * 4);
    for (let i = 0; i < l; i++) {
      const color = colorStore.get()
      pixels[i] = this.pixels[i * 6].color.r;
      pixels[i + 1] = this.pixels[i].color.g;
      pixels[i + 2] = this.pixels[i].color.b;
      pixels[i + 3] = this.pixels[i].color.a;
    }
    return pixels;
  } else {
    return this.pixels;
  }
};

const getPixelByPosition = function (x, y) {
  return _.find(this.pixels, (pixel) => pixel.imageX === x && pixel.imageY === y);
};

const setScale = function (scale) {
  const l = this.pixels.length;
  for (let i = 0; i < l; i += 6) {
    const x = this.pixels[i + 1];
    const y = this.pixels[i + 2];
    this.pixels[i + 3] = x * scale;
    this.pixels[i + 4] = y * scale;
  }
};

function PixelBufferImage(w, h) {
  Object.defineProperties(this, {
    width: {
      value: w || null
    },
    height: {
      value: h || null
    }
  });
  this.x = 0;
  this.y = 0;
  this.pixelCount = 0;
  this.pixels = new Uint32Array(w * h * 6);
  this.colors = [];

  this.createPixel = createPixel.bind(this);
  this.incrementPixelLocation = incrementPixelLocation.bind(this);
  this.addPixel = addPixel.bind(this);
  this.toArray = toArray.bind(this);
  this.getPixelByPosition = getPixelByPosition.bind(this);
  this.setScale = setScale.bind(this);
  return this;
}

export default PixelBufferImage;