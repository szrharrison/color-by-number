import colorStore from "../color_store";

const colorPixel = (pixel) => {
  return (dispatch) => {
    if (colorStore.filled[pixel.color.number - 1]) {
      dispatch({
        type: "COLOR_COMPLETED",
        colorNumber: pixel.color.number
      });
    }
    dispatch({
      type: "COLOR_PIXEL",
      id: pixel.id
    });
  };
};

export default colorPixel;