import PixelImage from "./pixel_image";
import RGBA from "./rgba";

const image = new Image();
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const imageStore = (function () {
  const pixelImages = new Map();
  return Object.defineProperties({}, {
    createImage: {
      value(imageDataUrl, ratio, clearColor) {
        RGBA.setClearColor(...clearColor);
        const imageLoading = new Promise((resolve, reject) => {
          image.onload = () => {
            ctx.canvas.width = image.width;
            ctx.canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            console.log(ratio)
            const imageData = ctx.getImageData(0, 0, image.width, image.height);
            const pixelImage = new PixelImage(imageData.width / ratio, imageData.height / ratio);
            pixelImage.fromArray(imageData.data, ratio, clearColor);
            pixelImages.set(pixelImage.id, pixelImage);
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
        return pixelImages.get(id);
      }
    }
  });
})();

export default imageStore;