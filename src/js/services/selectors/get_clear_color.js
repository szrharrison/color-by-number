import { createSelector } from "reselect";
import getStateImage from "./get_state_image";

const getClearColor = createSelector([
  getStateImage
], (image) => {
  return image.clearColor;
});

export default getClearColor;