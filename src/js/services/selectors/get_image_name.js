import { createSelector } from "reselect";
import getStateImage from "./get_state_image";

const getImageName = createSelector([
  getStateImage
], (image) => {
  return image.name;
});

export default getImageName;