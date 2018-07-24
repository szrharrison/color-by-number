import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clickSound from "../../audio/click.wav";
import colorSelected from "../services/events/color_selected";
import colorStore from "../services/color_store";
import getColorNumbers from "../services/selectors/get_color_numbers";
import getCompletedColors from "../services/selectors/get_completed_colors";
import getSelectedColorNumber from "../services/selectors/get_selected_color_number";

function ColorPicker(props) {
  const colors = props.colorNumbers.map(colorNumber => {
    const isColorCompleted = props.completedColors[colorNumber - 1];
    if (isColorCompleted) {
      return null;
    } else {
      const color = colorStore.get(colorNumber);
      const isColorSelected = props.selectedColorNumber === colorNumber;
      let className;

      if (isColorSelected) {
        className = "ColorPicker-Color selected";
      } else {
        className = "ColorPicker-Color";
      }

      return <div
        className={className}
        style={{ backgroundColor: color.string }}
        key={`pick-${colorNumber}`}
        onClick={handleColorSelection(props.colorSelected, colorNumber)}
      >
        <span className="ColorPicker-Color-number" style={{ backgroundColor: color.string }}>{colorNumber}</span>
      </div>;
    }
  });

  return <div className="ColorPicker">{colors}</div>;
}

const audioPlayer = new Audio(clickSound);

const handleColorSelection = function (callback, colorNumber) {
  return function handleColorSelection() {
    audioPlayer.play();
    callback(colorNumber);
  };
};

ColorPicker.propTypes = {
  colorNumbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  colorSelected: PropTypes.func.isRequired,
  completedColors: PropTypes.arrayOf(PropTypes.bool).isRequired,
  selectedColorNumber: PropTypes.number.isRequired
};

ColorPicker.defaultProps = {
  colorNumbers: [],
  completedColors: [],
  selectedColorNumber: 1
};

const mapStateToProps = (state, props) => ({
  colorNumbers: getColorNumbers(state, props),
  completedColors: getCompletedColors(state, props),
  selectedColorNumber: getSelectedColorNumber(state, props)
});

export default connect(mapStateToProps, { colorSelected })(ColorPicker);