import createReducer from "../create_reducer";

const setColors = (colors, action) => {
  const colorInfo = action.colors.map((color) => {
    return {
      number: color.number,
      completed: false
    };
  });
  return {
    ...colors,
    colors: colorInfo
  };
};

const colorSelected = (colors, action) => ({
  ...colors,
  selectedColorNumber: action.colorNumber
});

const colorCompleted = (colors, action) => ({
  ...colors,
  colors: colors.colors.map((color) => {
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

const colorReducer = createReducer({ colors: [] }, {
  COLOR_COMPLETED: colorCompleted,
  COLOR_SELECTED: colorSelected,
  SET_COLORS: setColors
});

export default colorReducer;