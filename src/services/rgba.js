const cache = new Map();

function RGBA(r, g, b, a) {
  Object.defineProperties(this, {
    r: {
      configurable: true,
      value: r || 0
    },
    g: {
      configurable: true,
      value: g || 0
    },
    b: {
      configurable: true,
      value: b || 0
    },
    a: {
      configurable: true,
      value: a || 0
    },
  });
}

Object.defineProperties(RGBA.prototype, {
  toString: {
    value: function () {
      if (cache.has(this)) {
        return cache.get(this);
      } else {
        const rgba = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a / 255 + ")";
        cache.set(this, rgba);
        return rgba;
      }
    }
  },
  toArray: {
    value: function () {
      return [this.r, this.g, this.b, this.a];
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
  clone: {
    value: function () {
      return new RGBA(this.r, this.g, this.b, this.a);
    }
  },
  snapToPallete: {
    value: function (pallete) {
      const l = pallete.length;
      let diffR, diffG, diffB, diffA, minDiffs = 511, minDiffsIndex;
      const background = `background: rgb(${this.r},${this.g},${this.b})`;
      const defaultColor = `${background}; color: rgb(${255 - this.r}, ${255 - this.g}, ${255 - this.b})`;
      const redColor = `${background}; color: rgb(${this.r}, 0, 0)`;
      const greenColor = `${background}; color: rgb(0, ${this.g}, 0)`;
      const blueColor = `${background}; color: rgb(0, 0, ${this.b})`;
      for (let i = 0; i < l; i += 4) {
        const r = pallete[i];
        const g = pallete[i + 1];
        const b = pallete[i + 2];
        diffR = r - this.r;
        diffG = g - this.g;
        diffB = b - this.b;
        const diffs = Math.sqrt(diffR ** 2 + diffG ** 2 + diffB ** 2);
        if (diffs < minDiffs) {
          minDiffsIndex = i;
          minDiffs = diffs;
          console.log(i);
          if (i > 800) {
            const newBackground = `background: rgb(${r},${g},${b})`;
            const newDefaultColor = `${newBackground}; color: rgb(${255 - r}, ${255 - g}, ${255 - b})`;
            const newRedColor = `${newBackground}; color: rgb(${r}, 0, 0)`;
            const newGreenColor = `${newBackground}; color: rgb(0, ${g}, 0)`;
            const newBlueColor = `${newBackground}; color: rgb(0, 0, ${b})`;
            // console.log("%c rgb(" + `%c${r},` + `%c${g},` + `%c${b})`, newDefaultColor, newRedColor, newGreenColor, newBlueColor);
            // console.log("%c rgb(" + `%c${this.r},` + `%c${this.g},` + `%c${this.b})`, defaultColor, redColor, greenColor, blueColor);
            // console.log(diffs);
          }
        }
      }
      const r = pallete[minDiffsIndex];
      const g = pallete[minDiffsIndex + 1];
      const b = pallete[minDiffsIndex + 2];
      const a = pallete[minDiffsIndex + 3];
      // console.log({minDiffsIndex, minDiffs});

      Object.defineProperty(this, "r", {value: r, configurable: true});
      Object.defineProperty(this, "g", {value: g, configurable: true});
      Object.defineProperty(this, "b", {value: b, configurable: true});
      Object.defineProperty(this, "a", {value: a, configurable: true});
    }
  }
});

export default RGBA;