import colorStore from "../color_store";

/**
 * @typedef {Object} ColorLike
 * @property {number} r The red value for the color
 * @property {number} g The green value for the color
 * @property {number} b The blue value for the color
 * @property {number} a The alpha value for the color
 */

/**
 * Keeps track of the next ID for {@link RGBA colors}
 * @type {number}
 * @private
 */
let id = 1;

/**
 * RGBA representation of color
 * @name RGBA
 * @param r
 * @param g
 * @param b
 * @param a
 * @constructor
 */
function RGBA(r = 0, g = 0, b = 0, a = 255) {
  const colorString = `rgba(${r},${g},${b},${a / 255})`;
  if (colorStore.has(colorString)) {
    return colorStore.get(colorString);
  } else {
    let num, optionalString;
    if (a === 0 || RGBA.isClearColor({ r, g, b, a })) {
      num = 0;
      a = 0;
      optionalString = `rgba(${r},${g},${b},0)`;
    } else {
      num = id;
      id += 1;
      optionalString = colorString;
    }

    Object.defineProperties(this, {
      /**
       * The unique identifier for the color
       * @name RGBA#number
       * @type {number}
       */
      number: {
        value: num
      },
      /**
       * The red value of the color
       * @name RGBA#r
       * @type {number}
       */
      r: {
        value: r,
        enumerable: true,
      },
      /**
       * The green value of the color
       * @name RGBA#g
       * @type {number}
       */
      g: {
        value: g,
        enumerable: true,
      },
      /**
       * The blue value of the color
       * @name RGBA#b
       * @type {number}
       */
      b: {
        value: b,
        enumerable: true,
      },
      /**
       * The alpha value of the color
       * @name RGBA#a
       * @type {number}
       */
      a: {
        value: a,
        enumerable: true,
      },
      /**
       * @name RGBA#string
       * @type {string}
       */
      string: {
        value: optionalString,
      },
    });
    colorStore.add(this);
    return this;
  }
}

/**
 * @name RGBA.clearColor
 * @type {ColorLike}
 * @private
 */
Object.defineProperty(RGBA, "clearColor", {
  value: {
    r: 0,
    g: 0,
    b: 0,
    a: 255
  }
});

/**
 * Sets the color that should be treated as the background color
 * @param {number} r the red value for the background color
 * @param {number} g the green value for the background color
 * @param {number} b the blue value for the background color
 * @param {number} a the alpha for the background color
 */
RGBA.setClearColor = function (r = 0, g = 0, b = 0, a = 255) {
  this.clearColor.r = r;
  this.clearColor.g = g;
  this.clearColor.b = b;
  this.clearColor.a = a;
};

/**
 * Returns whether the given color is the clear color or not
 * @param {ColorLike} color
 * @returns {boolean}
 */
RGBA.isClearColor = function (color) {
  return color.r === RGBA.clearColor.r && color.g === RGBA.clearColor.g && color.b === RGBA.clearColor.b && color.a === RGBA.clearColor.a;
};

/**
 * Creates an RGBA object from an array
 * @param {number[]} array
 * @returns {RGBA}
 */
RGBA.fromArray = function (array) {
  return new RGBA(array[0], array[1], array[2], array[3]);
};

// /**
//  * Creates an RGBA object from a string saved in local storage
//  * @param {number} num The unique identifier for the color
//  * @param {string} colorString The JSON string of a color array
//  * @returns {RGBA}
//  */
// RGBA.createFromStorage = function (num, colorString) {
//   const color = RGBA.fromArray(JSON.parse(colorString));
//   RGBA.setNumber(color, num);
//   return color;
// };
//
// /**
//  * Sets the number of the given color
//  * @param {RGBA} color
//  * @param {number} number The unique identifier for the color
//  * @private
//  */
// RGBA.setNumber = function (color, number) {
//   Object.defineProperty(color, "number", {
//     value: number
//   });
// };
//
// /**
//  * Serializes the color for storing in local storage
//  * @returns {string}
//  */
// RGBA.prototype.serialize = function () {
//   return JSON.stringify([
//     this.r,
//     this.g,
//     this.b,
//     this.a
//   ]);
// };

Object.defineProperties(RGBA.prototype, {
  /**
   * The hexadecimal number associated with the color's r, g, and b values. Caches this number for subsequent references
   * @name RGBA#hex
   * @type {number}
   */
  hex: {
    get() {
      const r = ("0" + this.r.toString(16)).slice(-2);
      const g = ("0" + this.g.toString(16)).slice(-2);
      const b = ("0" + this.b.toString(16)).slice(-2);
      const hexCode = parseInt(`${r}${g}${b}`, 16);
      Object.defineProperty(this, "hex", {
        get() {return hexCode;}
      });
      return hexCode;
    }
  },
  /**
   * The color's representation in grayscale. Cached for subsequent references
   * @name RGBA#grayscale
   * @type {RGBA}
   */
  grayscale: {
    get() {
      const lightness = (Math.max(this.r, this.g, this.b) + Math.min(this.r, this.g, this.b)) / 2 * this.a / 255;
      const l = Math.round(3 * lightness / 4 + 62.5);
      const grayscale = new RGBA(l, l, l);
      Object.defineProperty(this, "grayscale", {
        get() {return grayscale;},
      });
      return grayscale;
    }
  }
});

export default RGBA;