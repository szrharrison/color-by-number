function Pixel(color, x, y) {
  // if (Object.getPrototypeOf(color) !== "RGBA") {
  // }
  Object.defineProperties(this, {
    color: {
      value:      color,
      enumerable: true
    },
    x:     {
      value:      x,
      enumerable: true
    },
    y:     {
      value:      y,
      enumerable: true
    }
  });
}

// Object.defineProperties(Pixel.prototype, {
//   position: {
//     get: function () {
//       return [this.x, this.y];
//     }
//   }
// });

export default Pixel;
