import React from "react";
import { connect } from "react-redux";
import { Icon, Label } from "semantic-ui-react";
import addImageDataUrl from "../services/events/add_image_data_url";
import addImageName from "../services/events/add_image_name";
import getClearColor from "../services/selectors/get_clear_color";
import getImageName from "../services/selectors/get_image_name";
import getPixelsPerImagePixel from "../services/selectors/get_pixels_per_image_pixel";
import imageStore from "../services/image_store";

function ImageUploader(props) {
  function handleImageUpload(event) {
    const name = event.target.files[0].name;
    const reader = new FileReader();
    reader.onloadend = () => {
      props.addImageDataUrl(reader.result);
      imageStore.createImage(reader.result, props.pixelsPerImagePixel, props.clearColor).then(() => {
        props.addImageName(name);

      });
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  return <Label as="label">
    <Icon name="file"/>
    {props.name ? props.name : "Select image"}
    <input type="file" id="file" style={{ display: "none" }} onChange={handleImageUpload}/>
  </Label>;
}

ImageUploader.defaultProps = {
  pixelsPerImagePixel: 1,
  clearColor: [255, 255, 255, 255]
};

const mapStateToProps = (state, props) => ({
  name: getImageName(state, props),
  pixelsPerImagePixel: getPixelsPerImagePixel(state, props),
  clearColor: getClearColor(state, props)
});

export default connect(mapStateToProps, { addImageDataUrl, addImageName })(ImageUploader);