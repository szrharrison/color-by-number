import finished from "../../audio/finish_color.wav";

/**
 * Include a color and all its information in the color store
 * @callback colorStore.add
 * @param {RGBA} color
 */

/**
 * Increase the count of pixels for the given color
 * @callback colorStore.addPixel
 * @param {RGBA} color
 */

/**
 * Check to see if a color already exists in the color store
 * @callback colorStore.has
 * @param {string|number} identifier
 * @returns {boolean}
 */

/**
 * Return a color from the color store
 * @callback colorStore.get
 * @param {string|number} identifier
 * @returns {RGBA}
 */

/**
 * Increase the count of filled pixels for the given color. Play a sound if the fill count equals the pixel count.
 * @callback colorStore.fill
 * @param {RGBA} color
 */

/**
 * Erases all information from the color store
 * @callback colorStore.clear
 * @returns {void}
 */

/**
 * Single source of truth for all color information
 * @const {Object} colorStore
 */
const colorStore = (function () {
  const colorsMap = new Map();
  const count = [];
  const fillCount = [];
  const audioPlayer = new Audio(finished);

  return Object.defineProperties({}, {
    /**
     * Which colors have been completed, stored by color number - 1
     * @type {boolean[]}
     */
    filled: {
      value: []
    },
    /**
     * Domain models of the colors, stored by color number - 1
     * @type {RGBA[]}
     */
    colors: {
      value: []
    },
    add: {
      value(color) {
        if (color.number !== 0) {
          count[color.number] = 0;
          fillCount[color.number] = 0;
          this.filled[color.number - 1] = false;
          this.colors[color.number - 1] = color;
        }
        colorsMap.set(color.string, color);
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
      value(identifier) {
        return colorsMap.has(identifier) || !!this.colors[identifier - 1];
      }
    },
    get: {
      value(identifier) {
        if (colorsMap.has(identifier)) {
          return colorsMap.get(identifier);
        } else if (this.colors[identifier - 1]) {
          return this.colors[identifier - 1];
        } else {
          throw new Error("That color does not exist in the color store");
        }
      }
    },
    fill: {
      value(color) {
        fillCount[color.number] += 1;
        if (fillCount[color.number] === count[color.number]) {
          this.filled[color.number - 1] = true;
          audioPlayer.play();
        }
      }
    },
    // setFromLocalStorage: {
    //   value() {
    //     try {
    //       const colorStoreString = window.localStorage.getItem("colorStore");
    //       if (colorStoreString) {
    //         const localColorStore = JSON.parse(colorStoreString);
    //         this.clear();
    //         const localFilled = localColorStore.filled;
    //         localFilled.forEach((val, i) => {
    //           this.filled[i] = val;
    //         });
    //         const localColors = localColorStore.colors;
    //         localColors.forEach((val, i) => {
    //           const color = RGBA.createFromStorage(i + 1, val);
    //           this.add(color);
    //         });
    //         const localCount = JSON.parse(window.localStorage.getItem("colorStore_count"));
    //         localCount.forEach((val, i) => {
    //           count[i] = val;
    //         });
    //         const localFillCount = JSON.parse(window.localStorage.getItem("colorStore_fillCount"));
    //         localFillCount.forEach((val, i) => {
    //           fillCount[i] = val;
    //         });
    //         const localColorsMap = new Map(JSON.parse(window.localStorage.getItem("colorStore_colorsMap")));
    //         localColorsMap.forEach((val, key) => {
    //           if (!colorsMap.has(key)) {
    //             RGBA.createFromStorage(0, val);
    //           }
    //         });
    //       }
    //       return this;
    //     } catch (e) {
    //       console.error(e);
    //       return this;
    //     }
    //   }
    // },
    // saveToLocalStorage: {
    //   value() {
    //     try {
    //       const tempColorsMap = new Map();
    //       colorsMap.forEach((value, key) => {
    //         if (value instanceof RGBA) {
    //           tempColorsMap.set(key, value.serialize());
    //         } else {
    //           tempColorsMap.set(key, value);
    //         }
    //       });
    //       const colorsMapString = JSON.stringify([...tempColorsMap]);
    //       window.localStorage.setItem("colorStore_colorsMap", colorsMapString);
    //       window.localStorage.setItem("colorStore_count", JSON.stringify(count));
    //       window.localStorage.setItem("colorStore_fillCount", JSON.stringify(fillCount));
    //       const localColorStore = {
    //         filled: this.filled,
    //         colors: this.colors
    //       };
    //       window.localStorage.setItem("colorStore", JSON.stringify(localColorStore));
    //     } catch (e) {
    //       console.error(e);
    //     }
    //   }
    // },
    clear: {
      value() {
        colorsMap.clear();
        count.length = 0;
        fillCount.length = 0;
        this.filled.length = 0;
        this.colors.length = 0;
      }
    }
  });
})();

export default colorStore;