import _ from "lodash";
import Pixel from "./pixel";
import RGBA from "./rgba";

/**
 * Keeps track of the next id for {@link PixelImage PixelImages}
 * @type {number}
 * @private
 */
let id = 0;

/**
 * The domain representation of an image and its pixels
 * @param {number} w
 * @param {number} h
 * @class PixelImage
 */
function PixelImage(w, h) {
  if (!w || !h || typeof w !== "number" || typeof h !== "number" || w < 0 || h < 0) {
    throw new Error("Image must have a width and a height greater than 0");
  }
  Object.defineProperties(this, {
    /**
     * The width of the image
     * @type {number}
     * @memberOf PixelImage#
     */
    width: { value: w },
    /**
     * The height of the image
     * @type {number}
     * @memberOf PixelImage#
     */
    height: { value: h },
    /**
     * The unique identifier of the image
     * @type {number}
     * @memberOf PixelImage#
     */
    id: { value: id }
  });
  id++;

  /**
   * The x value of the next {@link Pixel} to be added to the image
   * @private
   * @type {number}
   */
  this.x = 0;
  /**
   * The y value of the next {@link Pixel} to be added to the image
   * @private
   * @type {number}
   */
  this.y = 0;
  /**
   * The total number of pixels in the image
   * @private
   * @type {number}
   */
  this.pixelCount = 0;
  /**
   * Array of all of the pixels in the image
   * @type {Pixel[]}
   */
  this.pixels = [];
  /**
   * A map of colors to their corresponding pixels
   * @type {Map<RGBA, Pixel[]>}
   */
  this.pixelsByColor = new Map();
  /**
   * A list of all of the colors used in the image
   * @type {Array}
   */
  this.colors = [];

  return this;
}

/**
 * Create a new {@link Pixel} and add it to the pixel image
 * @param {RGBA} color
 * @private
 * @memberOf PixelImage#
 */
PixelImage.prototype.createPixel = function (color) {
  const pixel = new Pixel(this.pixelCount, color, this.x, this.y);
  this.pixels[this.pixelCount] = pixel;

  if (this.pixelsByColor.has(color)) {
    this.pixelsByColor.get(color).push(pixel);
  } else {
    this.pixelsByColor.set(color, [pixel]);
  }

  this.incrementPixelLocation();
  this.pixelCount++;
};

/**
 * Set the {@link PixelImage#x x} and {@link PixelImage#y y} values of the {@link PixelImage pixel image} to the location of the next pixel.
 *
 * This location starts at the top left corner and goes left to right, then top to bottom.
 * @private
 */
PixelImage.prototype.incrementPixelLocation = function () {
  if (this.x === this.width - 1) {
    this.x = 0;
    this.y++;
  } else {
    this.x++;
  }
};

/**
 * Add a pixel of the given color to the image once, or a given number of times if provided
 * @param {RGBA} color
 * @param {number} [times]
 */
PixelImage.prototype.addPixel = function (color, times) {
  if (times) {
    _.times(times, this.createPixel.bind(this, color));
  } else {
    this.createPixel(color);
  }
};

/**
 * Sets its properties from an array of consecutive r, g, b, and a values
 * @param {Uint8ClampedArray} array
 * @param {number} ratio
 */
PixelImage.prototype.fromArray = function (array, ratio) {
  const w = this.width * ratio * 4;
  const h = this.height * ratio;
  for (let i = 0; i < h; i += ratio) {
    for (let j = 0; j < w; j += 4 * ratio) {
      this.createPixel(new RGBA(
        array[i * w + j],
        array[i * w + j + 1],
        array[i * w + j + 2],
        array[i * w + j + 3]
      ));
    }
  }
};

/**
 * Returns the {@link Pixel} that is at the given x and y coordinates of the original image
 * @param {number} x
 * @param {number} y
 * @returns {Pixel}
 * @memberOf PixelImage#
 */
PixelImage.prototype.getPixelByImagePosition = function (x, y) {
  return _.find(this.pixels, pixel => pixel.imageY === y && pixel.imageX === x);
};

// PixelImage.prototype.getPixelById = function (id) {
//   return this.pixels[id];
// };

// PixelImage.prototype.getPixelsByColor = function (color) {
//   return this.pixelsByColor.get(color);
// };

/**
 * Alters each pixel's {@link Pixel#canvasX canvasX} and {@link Pixel#canvasY canvasY} to mach the change in size of the pixels
 * @param {number} scale - the new size of each pixel in the image
 * @memberOf PixelImage#
 */
PixelImage.prototype.setScale = function (scale) {
  this.pixels.forEach(pixel => {
    pixel.canvasX = pixel.imageX * scale;
    pixel.canvasY = pixel.imageY * scale;
  });
};

const emptyImage = new PixelImage(1, 1);

emptyImage.addPixel(new RGBA(0, 0, 0, 0));

/**
 * Image with 1 blank pixel
 * @memberOf PixelImage
 */
PixelImage.emptyImage = emptyImage;

export default PixelImage;