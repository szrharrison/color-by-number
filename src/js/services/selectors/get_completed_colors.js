import { createSelector } from "reselect";
import _ from "lodash"
import getColorInfo from "./get_color_info";

const getCompletedColors = createSelector([
  getColorInfo
],(colorInfo) => {
  return _.map(colorInfo, "completed");
});

export default getCompletedColors;
