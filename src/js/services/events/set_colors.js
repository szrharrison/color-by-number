/**
 * @typedef {Object} actions.SET_COLORS
 * @property {string} type The type of action. Always "SET_COLORS"
 * @property {RGBA[]} colors The colors to add to the app's global state
 */

/**
 * Action creator for the SET_COLORS action type
 * @name setColorsActionCreator
 * @param {RGBA[]} colors
 * @returns {actions.SET_COLORS}
 */
const setColors = colors => ({
  type: "SET_COLORS",
  colors
});

export default setColors;