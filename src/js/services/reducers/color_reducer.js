import createReducer from "../create_reducer";

/**
 * The global state representation of the app's colors and their information
 * @typedef {Object} colorsState
 * @property {number} [selectedColorNumber]
 * @property {{number: number, completed: boolean}[]} [colors]
 */

/**
 * Reducer function for the {@link actions.SET_COLORS SET_COLORS} action type
 * @param {colorsState} colors
 * @param {actions.SET_COLORS} action
 * @returns {colorsState}
 * @memberOf {colorReducer}
 */
const setColors = (colors, action) => {
  const colorInfo = action.colors.map(color => ({
    number: color.number,
    completed: false
  }));
  return {
    ...colors,
    colors: colorInfo
  };
};

/**
 * Reducer function for the {@link actions.COLOR_SELECTED COLOR_SELECTED} action type
 * @param {colorsState} colors
 * @param {actions.COLOR_SELECTED} action
 * @returns {colorsState}
 * @memberOf {colorReducer}
 */
const colorSelected = (colors, action) => ({
  ...colors,
  selectedColorNumber: action.colorNumber
});

/**
 * Reducer function for the {@link actions.COLOR_COMPLETED COLOR_COMPLETED} action type
 * @param {colorsState} colors
 * @param {actions.COLOR_COMPLETED} action
 * @returns {colorsState}
 * @memberOf {colorReducer}
 */
const colorCompleted = (colors, action) => ({
  ...colors,
  colors: colors.colors.map(color => {
    if (color.number === action.colorNumber) {
      return {
        number: color.number,
        completed: true
      };
    } else {
      return color;
    }
  })
});

/**
 * Reduces the state based on the dispatched action
 * @function colorReducer
 */
const colorReducer = createReducer({ colors: [] }, {
  COLOR_COMPLETED: colorCompleted,
  COLOR_SELECTED: colorSelected,
  SET_COLORS: setColors
});

export default colorReducer;