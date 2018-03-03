import _ from "lodash";

function PixelImage() {
  this.pixels = [];
}

PixelImage.prototype.addPixel = function (pixel, times) {
  if (times) {
    _.times(times, () => this.pixels[this.pixels.length] = pixel);
  } else {
    this.pixels[this.pixels.length] = pixel;
  }
  this.length = this.pixels.length;
};

PixelImage.prototype.toArray = function () {
  const l = this.pixels.length;
  if (l) {
    const pixels = new Array(l * 4);
    for (let i = 0; i < l; i++) {
      pixels[i]     = this.pixels[i].r;
      pixels[i + 1] = this.pixels[i].g;
      pixels[i + 2] = this.pixels[i].b;
      pixels[i + 3] = this.pixels[i].a;
    }
    return pixels;
  } else {
    return this.pixels;
  }
};

export default PixelImage;