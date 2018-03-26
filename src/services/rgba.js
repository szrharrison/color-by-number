const colorCache = new Map();
const colorStrings = new Set();

function RGBA(r, g, b, a) {
  a = a === 0 || a ? a : 255;
  r = r || 0;
  g = g || 0;
  b = b || 0;
  const colorString = `rgba(${r},${g},${b},${a / 255})`;
  if (colorStrings.has(colorString)) {
    return colorCache.get(colorString);
  } else {
    Object.defineProperties(this, {
      r: {
        value: r,
        enumerable: true,
      },
      g: {
        value: g,
        enumerable: true,
      },
      b: {
        value: b,
        enumerable: true,
      },
      a: {
        value: a,
        enumerable: true,
      },
      colorString: { value: colorString }
    });
    colorStrings.add(colorString);
    colorCache.set(colorString, this);
  }
}

Object.defineProperties(RGBA.prototype, {
  toString: {
    value: function () {
      return this.colorString;
    }
  },
  toArray: {
    value: function () {
      return new Uint8ClampedArray([this.r, this.g, this.b, this.a]);
    }
  },
  addToArray: {
    value: function (array) {
      array[array.length] = this.r;
      array[array.length] = this.g;
      array[array.length] = this.b;
      array[array.length] = this.a;
    }
  },
  toHex: {
    value: function () {
      const r = ("0" + this.r.toString(16)).slice(-2);
      const g = ("0" + this.g.toString(16)).slice(-2);
      const b = ("0" + this.b.toString(16)).slice(-2);
      const hex = `${r}${g}${b}`;
      return parseInt(hex, 16);
    }
  },
  getShading: {
    value: function () {
      const r = this.r / 255;
      const g = this.g / 255;
      const b = this.b / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);

      const lightness = (max + min) / 2 * 255;
      const l = Math.round(lightness/2 + 125);
      return new RGBA(l, l, l);
    }
  }
});

export default RGBA;