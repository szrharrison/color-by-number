const colorStore = (function () {
  const colorsMap = new Map();
  const count = [];
  const fillCount = [];
  return Object.defineProperties({}, {
    filled: {
      value: []
    },
    colors: {
      value: []
    },
    add: {
      value(color, optionalString) {
        if (color.number !== 0) {
          count[color.number] = 0;
          fillCount[color.number] = 0;
          this.filled[color.number - 1] = 0;
          this.colors[color.number - 1] = color;
        }
        if (optionalString) {
          colorsMap.set(optionalString, color);
        } else {
          colorsMap.set(color.string, color);
        }
        colorsMap.set(color.number, color);
      }
    },
    addPixel: {
      value(color) {
        if (color.number !== 0) {
          count[color.number] += 1;
        }
      }
    },
    has: {
      value(string) {
        return colorsMap.has(string);
      }
    },
    get: {
      value(identifier) {
        return colorsMap.get(identifier);
      }
    },
    fill: {
      value(color) {
        fillCount[color.number] += 1;
        if (fillCount[color.number] === count[color.number]) {
          this.filled[color.number - 1] = 1;
        }
      }
    }
  });
})();

export default colorStore;