import { createSelector } from "reselect";
import getStateColor from "./get_state_color";

const getSelectedColorNumber = createSelector([
  getStateColor
], (stateColor) => {
  return stateColor.selectedColorNumber;
});

export default getSelectedColorNumber;