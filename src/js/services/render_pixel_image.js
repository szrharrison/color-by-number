const numbers = new Map();

/**
 * Creates a new canvas representation of the given number at the given scale or returns its cached representation.
 * @param {number} num
 * @param {number} scale
 * @return {HTMLCanvasElement}
 */
function getNumber(num, scale) {
  let key;
  if (scale < 7) {
    key = "_" + scale;
  } else {
    key = num + "_" + scale;
  }
  if (numbers.has(key)) {
    return numbers.get(key);
  } else {
    const canvas = document.createElement("canvas");
    canvas.width = scale;
    canvas.height = scale;
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.strokeRect(0, 0, scale, scale);

    if (scale >= 7) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = scale / 2 + "px sans-serif";
      ctx.fillText(`${num}`, scale / 2, scale / 2, scale);
    }
    numbers.set(key, canvas);
    return canvas;
  }
}

/**
 *
 * @param {PixelImage} pixelImage
 * @param {number} scale
 * @param {CanvasRenderingContext2D} ctx
 */
function renderPixelImage(pixelImage, scale, ctx) {
  ctx.clearCanvas();
  pixelImage.pixelsByColor.forEach((pixels, color) => {
    if (color.a !== 0) {
      const l = pixels.length;
      const n = color.number;
      let pixel;

      ctx.fillStyle = color.string;
      for (let i = 0; i < l; i++) {
        pixel = pixels[i];
        if (pixel.filled) {
          ctx.fillRect(pixel.canvasX, pixel.canvasY, scale, scale);
        }
      }

      ctx.fillStyle = color.grayscale.string;
      for (let i = 0; i < l; i++) {
        pixel = pixels[i];
        if (!pixel.filled) {
          ctx.fillRect(pixel.canvasX, pixel.canvasY, scale, scale);
          ctx.drawImage(getNumber(n, scale), pixel.canvasX, pixel.canvasY);
        }
      }

      for (let i = 0; i < l; i++) {
        pixel = pixels[i];
        if (pixel.shade) {
          ctx.fillStyle = pixel.shade.string;
          ctx.fillRect(pixel.canvasX, pixel.canvasY, scale, scale);
        }
      }
    }
  });
}

export default renderPixelImage;