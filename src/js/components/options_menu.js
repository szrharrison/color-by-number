import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Input, Menu } from "semantic-ui-react";
import colorConverter from "../services/color_converter";
import ColorPicker from "./color_picker";
import getClearColor from "../services/selectors/get_clear_color";
import getPixelsPerImagePixel from "../services/selectors/get_pixels_per_image_pixel";
import ImageUploader from "./image_uploader";
import setClearColor from "../services/events/set_clear_color";
import setPixelsPerImagePixel from "../services/events/set_pixels_per_image_pixel";

function OptionsMenu(props) {
  function handlePixelPerImagePixelChange(e) {
    const ppip = parseInt(e.target.value, 10);
    props.setPixelsPerImagePixel(ppip);
  }

  function handleClearColorChange(e) {
    const clearColor = e.target.value;
    const colorAsArray = colorConverter.fromString(clearColor);
    props.setClearColor(colorAsArray);
  }

  return <Menu
    className="OptionsMenu"
    fixed="right"
    inverted
    secondary
    vertical
  >
    <Menu.Item>
      <Input
        inverted
        label="Pixels per Pixel"
        onChange={handlePixelPerImagePixelChange}
        value={props.pixelsPerImagePixel}
        transparent
        type="number"
      />
    </Menu.Item>
    <Menu.Item>
      <Input
        inverted
        placeholder="Clear Color"
        error={props.clearColor === "error"}
        onChange={handleClearColorChange}
        value={colorConverter.fromArray(props.clearColor)}
        transparent
        type="text"
      />
    </Menu.Item>
    <Menu.Item>
      <ImageUploader/>
    </Menu.Item>
    <ColorPicker/>
  </Menu>;
}

OptionsMenu.propTypes = {
  clearColor: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  pixelsPerImagePixel: PropTypes.number.isRequired
};

const mapStateToProps = (state, props) => ({
  clearColor: getClearColor(state, props),
  pixelsPerImagePixel: getPixelsPerImagePixel(state, props)
});

export default connect(mapStateToProps, { setClearColor, setPixelsPerImagePixel })(OptionsMenu);