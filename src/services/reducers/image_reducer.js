import createReducer from "../create_reducer";

const addImageDataUrl = (image, action) => ({
  ...image,
  dataUrl: action.dataUrl
});

const addImageName = (image, action) => ({
  ...image,
  name: action.name
});

const addPixelInfo = (image, action) => ({
  ...image,
  imageXs: action.x,
  imageYs: action.y,
  imageRs: action.r,
  imageGs: action.g,
  imageBs: action.b,
  imageAs: action.a,

  imageFills: new Uint8Array(action.x.length).fill(0)
});

const addColors = (image, action) => ({
  ...image,
  colors: action.colors
});

const imageReducer = createReducer({}, {
  ADD_IMAGE_DATA_URL: addImageDataUrl,
  ADD_IMAGE_NAME:     addImageName,
  ADD_PIXEL_INFO:     addPixelInfo,
  ADD_COLORS:         addColors
});

export default imageReducer;