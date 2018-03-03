import createReducer from "../create_reducer";

const addImageDataUrl = (image, action) => ({
  ...image,
  dataUrl: action.dataUrl
});

const addImageName = (image, action) => ({
  ...image,
  name: action.name
});

const addPixel = (image, action) => ({
  ...image,
  pixels: [...image.pixels, action.pixel]
});

const imageReducer = createReducer({}, {
  ADD_IMAGE_DATA_URL: addImageDataUrl,
  ADD_IMAGE_NAME:     addImageName,
  ADD_PIXEL:          addPixel
});

export default imageReducer;