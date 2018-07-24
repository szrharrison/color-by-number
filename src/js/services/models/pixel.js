import _ from "lodash";
import colorStore from "../color_store";
import RGBA from "./rgba";

/**
 * Flags whether or not the pixel has been colored in
 * @name Pixel#filled
 * @type {boolean}
 */

/**
 * Keeps track of what the color the pixel has been colored in as. Null if it has not been colored in or if it's the pixel's color
 * @name Pixel#shade
 * @type {?RGBA}
 */

/**
 * Keeps track of whether or not the pixel is being created from storage
 * @type {boolean}
 * @private
 */
let creatingFromStorage = false;

/**
 * Marks a pixel as filled.
 * @returns {void}
 * @memberOf Pixel#
 */
const fill = function () {
  this.filled = true;
  this.shade = null;
  if (!creatingFromStorage) {
    colorStore.fill(this.color);
  }
};

/**
 * Domain representation of a single pixel in an image
 * @param id
 * @param color
 * @param imageX
 * @param imageY
 * @constructor
 */
function Pixel(id, color, imageX, imageY) {
  if (color.number === 0) { // is clear color
    this.filled = true;
    this.fill = _.noop();
    this.shade = null;
  } else {
    let shadedColor;
    this.filled = false;
    this.fill = fill.bind(this);
    Object.defineProperty(this, "shade", {
      get() {return shadedColor;},
      set(color) {
        shadedColor = new RGBA(color.r, color.g, color.b, color.a * 0.5);
      }
    });
  }

  Object.defineProperties(this, {
    /**
     * An identifier for the pixel that is unique to the image
     * @name Pixel#id
     * @type {number}
     */
    id: { value: id },
    /**
     * The RGBA representation of the pixel's color
     * @name Pixel#color
     * @type {RGBA}
     */
    color: { value: color },
    /**
     * The pixel's x coordinate on the original image
     * @name Pixel#imageX
     * @type {number}
     */
    imageX: { value: imageX },
    /**
     * The pixel's y coordinate on the original image
     * @name Pixel#imageY
     * @type {number}
     */
    imageY: { value: imageY }
  });

  if (!creatingFromStorage) {
    colorStore.addPixel(color);
  }
  /**
   * The pixel's x coordinate on the canvas
   * @type {?number}
   */
  this.canvasX = null;
  /**
   * The pixel's y coordinate on the canvas
   * @type {?number}
   */
  this.canvasY = null;
  return this;
}

// /**
//  * Creates a pixel from its string representation in local storage
//  * @param {string} pixelString
//  * @returns {Pixel}
//  */
// Pixel.createFromStorage = function (pixelString) {
//   const pixelObject = JSON.parse(pixelString);
//   const color = colorStore.get(pixelObject.color);
//   creatingFromStorage = true;
//   const pixel = new Pixel(pixelObject.id, color, pixelObject.imageX, pixelObject.imageY);
//   if (pixelObject.filled) {
//     pixel.fill();
//   }
//   creatingFromStorage = false;
//   return pixel;
// };

// /**
//  * Serializes a pixel into its string representation for storing in local storage
//  * @returns {string}
//  */
// Pixel.prototype.serialize = function () {
//   return JSON.stringify({
//     filled: this.filled,
//     id: this.id,
//     color: this.color.number,
//     imageX: this.imageX,
//     imageY: this.imageY
//   });
// };

export default Pixel;
