import { createSelector } from "reselect";
import getStateColor from "./get_state_color";

const getColorInfo = createSelector([
  getStateColor
], stateColor => {
  return stateColor.colors;
});

export default getColorInfo;
