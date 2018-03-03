import React from "react";
import { connect } from "react-redux";
import addImageDataUrl from "../services/events/add_image_data_url";
import addImageName from "../services/events/add_image_name";
import { Button, Input } from "semantic-ui-react";

function UnconnectedImageUploader(props) {
  const reader     = new FileReader();
  reader.onloadend = function () {
    props.addImageDataUrl(reader.result);
  };

  function handleImageUpload(event) {
    reader.readAsDataURL(event.target.files[0]);
    props.addImageName(event.target.files[0].name);
  }

  return <div>
    <Input action={ <Button icon="upload"/> } type="file" size="mini" onChange={ handleImageUpload }/>
  </div>;
}

const mapStateToProps = state => ({ name: state.image.name });

const ImageUploader = connect(mapStateToProps, { addImageDataUrl, addImageName })(UnconnectedImageUploader);
export default ImageUploader;