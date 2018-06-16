import colorStore from "./color_store";

let id = 1;

function RGBA(r = 0, g = 0, b = 0, a = 255) {
  const colorString = `rgba(${r},${g},${b},${a / 255})`;
  if (colorStore.has(colorString)) {
    return colorStore.get(colorString);
  } else {
    let num, optionalString;
    if (a === 0 || (r === RGBA.clearColor.r && g === RGBA.clearColor.g && b === RGBA.clearColor.b && a === RGBA.clearColor.a)) {
      num = 0;
      a = 0;
      optionalString= `rgba(${r},${g},${b},0)`;
    } else {
      num = id;
      id += 1;
      optionalString = colorString;
    }

    Object.defineProperties(this, {
      number: {
        value: num
      },
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
      string: {
        value: optionalString,
      },
    });
    colorStore.add(this, optionalString);
    return this;
  }
}

Object.defineProperty(RGBA, "clearColor", {
  value: {
    r: 0,
    g: 0,
    b: 0,
    a: 0
  }
});

RGBA.setClearColor = function (r = 0, g = 0, b = 0, a = 255) {
  this.clearColor.r = r;
  this.clearColor.g = g;
  this.clearColor.b = b;
  this.clearColor.a = a;
};

RGBA.fromArray = function (array) {
  return new RGBA(array[0], array[1], array[2], array[3]);
};


RGBA.prototype.toArray = function () {
  return Uint8ClampedArray.of(this.r, this.g, this.b, this.a);
};

RGBA.prototype.addToArray = function (array) {
  array[array.length] = this.r;
  array[array.length] = this.g;
  array[array.length] = this.b;
  array[array.length] = this.a;
};

Object.defineProperties(RGBA.prototype, {
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
  grayscale: {
    get() {
      const r = this.r / 255;
      const g = this.g / 255;
      const b = this.b / 255;
      const lightness = (Math.max(r, g, b) + Math.min(r, g, b)) / 2 * 255;
      const l = Math.round(lightness / 2 + 125);
      const grayscale = new RGBA(l, l, l);
      Object.defineProperty(this, "grayscale", {
        get() {return grayscale;},
      });
      return grayscale;
    }
  },
  darker: {
    get() {
      const darker = new RGBA(this.r * .9, this.g * .9, this.b * .9);
      Object.defineProperty(this, "darker", {
        get() {return darker;}
      });
      return darker;
    }
  },
  lighter: {
    get() {
      const lighter = new RGBA(Math.max(this.r * 1.1, 255), Math.max(this.g * 1.1, 255), Math.max(this.b * 1.1, 255));
      Object.defineProperty(this, "lighter", {
        get() {return lighter;}
      });
      return lighter;
    }
  }
});

export default RGBA;