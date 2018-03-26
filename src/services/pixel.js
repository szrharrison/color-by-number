let id = 0;

function Pixel(color, x, y) {
  Object.defineProperties(this, {
    color: {
      value: color,
      enumerable: true
    },
    x: {
      value: x,
      enumerable: true
    },
    y: {
      value: y,
      enumerable: true
    },
    id: {
      value: id,
      enumerable: true
    }
  });
  id++;
  this.filled = false;
  this.colorNum = 0;
}

// Object.defineProperties(Pixel.prototype, {
//   position: {
//     get: function () {
//       return [this.x, this.y];
//     }
//   }
// });

Pixel.prototype.fill = function () {
  this.filled = true;
  return this;
};
export default Pixel;
