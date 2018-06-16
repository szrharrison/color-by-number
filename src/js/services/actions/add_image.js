import addImageDataUrl from "../events/add_image_data_url";
import addImageName from "../events/add_image_name";

const addImage = (dataUrl, name) => {
  return (dispatch) => {
    dispatch(addImageDataUrl(dataUrl));
    dispatch(addImageName(name));
  };
};

export default addImage;