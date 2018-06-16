import { createSelector } from "reselect";
import getStateImage from "./get_state_image";

const getPixelsPerImagePixel = createSelector([
  getStateImage
], (image) => {
  return image.pixelsPerImagePixel || 1;
});

export default getPixelsPerImagePixel;