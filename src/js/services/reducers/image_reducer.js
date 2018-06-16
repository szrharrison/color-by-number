import createReducer from "../create_reducer";

const addImageDataUrl = (image, action) => {
  return {
    ...image,
    dataUrl: action.dataUrl
  };
};

const addPixelsPerImagePixel = (image, action) => {
  return {
    ...image,
    pixelsPerImagePixel: action.pixelsPerImagePixel
  };
};

const setClearColor = (image, action) => {
  return {
    ...image,
    clearColor: action.clearColor
  };
};

const addImageName = (image, action) => ({
  ...image,
  name: action.name
});

const colorPixel = (image, action) => ({
  ...image,
  colorOrder: [...image.colorOrder, action.id],
});

const imageReducer = createReducer({ colorOrder: [] }, {
  ADD_IMAGE_DATA_URL: addImageDataUrl,
  ADD_IMAGE_NAME: addImageName,
  COLOR_PIXEL: colorPixel,
  SET_PIXELS_PER_IMAGE_PIXEL: addPixelsPerImagePixel,
  SET_CLEAR_COLOR: setClearColor
});

export default imageReducer;