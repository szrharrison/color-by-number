import createReducer from "../create_reducer";
import imageStore from "../image_store";

const addImageDataUrl = (image, action) => {
  imageStore.imageDataUrl = action.dataUrl;

  return {
    ...image,
    dataUrl: action.dataUrl
  };
};

const addImageName = (image, action) => ({
  ...image,
  name: action.name
});

const colorPixel = (image, action) => ({
  ...image,
  colorOrder: [...image.colorOrder, action.id]
});

const imageReducer = createReducer({ colorOrder: [] }, {
  ADD_IMAGE_DATA_URL: addImageDataUrl,
  ADD_IMAGE_NAME: addImageName,
  COLOR_PIXEL: colorPixel
});

export default imageReducer;