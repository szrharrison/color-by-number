import PixelImage from "./models/pixel_image";
import RGBA from "./models/rgba";

/**
 * Create a new {@link PixelImage} and store it and its information in the image store
 * @callback imageStore.createImage
 * @param {string} imageDataUrl
 * @param {number} ratio
 * @param {Uint8ClampedArray} clearColor
 * @returns {Promise}
 */

/**
 * Get the {@link PixelImage} with the given id from the store
 * @callback imageStore.get
 * @param {number} id
 * @return {PixelImage}
 */

const image = new Image();
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

/**
 * @const {Object} imageStore
 */
const imageStore = (function () {
  const pixelImages = new Map();
  return Object.defineProperties({}, {
    createImage: {
      value(imageDataUrl, ratio, clearColor) {
        const imageLoading = new Promise((resolve, reject) => {
          image.onload = () => {
            RGBA.setClearColor(...clearColor);
            ctx.canvas.width = image.width;
            ctx.canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const imageData = ctx.getImageData(0, 0, image.width, image.height);
            const pixelImage = new PixelImage(imageData.width / ratio, imageData.height / ratio);
            pixelImage.fromArray(imageData.data, ratio);
            pixelImages.set(pixelImage.id, { pixelImage, ratio, clearColor });
            this.pixelImage = pixelImage;
            resolve();
          };
          image.onerror = reject;
        });
        image.src = imageDataUrl;
        return imageLoading;
      }
    },
    get: {
      value(id) {
        return pixelImages.get(id).pixelImage;
      }
    },
  });
})();

export default imageStore;