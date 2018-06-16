import _ from "lodash";
import RGBA from "./rgba";
import colorStore from "./color_store";

const fill = function () {
  this.filled = true;
  colorStore.fill(this.color);
  return this;
};

function Pixel(id, color, imageX, imageY) {
  if (color.number === 0) {
    this.filled = true;
    this.fill = _.noop();
    this.shade = color;
  } else {
    let shadedColor;
    this.filled = false;
    this.fill = fill.bind(this);
    Object.defineProperty(this, "shade", {
      get() {return shadedColor;},
      set(color) {
        shadedColor = new RGBA(color.r, color.g, color.b, 127.5);
      }
    });
    colorStore.addPixel(color);
  }
  Object.defineProperties(this, {
    id: { value: id },
    color: { value: color },
  });
  this.canvasX = null;
  this.canvasY = null;
  this.imageX = imageX;
  this.imageY = imageY;
  return this;
}

export default Pixel;
