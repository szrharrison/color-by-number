import { createSelector } from "reselect";
import _ from "lodash";
import getColorInfo from "./get_color_info";

const getColorNumbers = createSelector([
  getColorInfo
], colorInfo => {
  return _.map(colorInfo, "number");
});

export default getColorNumbers;
