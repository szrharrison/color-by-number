import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";
import { MenuItem } from "semantic-ui-react";
import colorSelected from "../services/events/color_selected";
import colorStore from "../services/color_store";
import getColorNumbers from "../services/selectors/get_color_numbers";
import getCompletedColors from "../services/selectors/get_completed_colors";
import getSelectedColorNumber from "../services/selectors/get_selected_color_number";

function ColorPicker(props) {
  const colors = props.colorNumbers.map((colorNumber) => {
    const color = colorStore.get(colorNumber);
    const isColorCompleted = props.completedColors[colorNumber - 1];
    const isColorSelected = props.selectedColorNumber === colorNumber;
    let className;
    if (isColorSelected) {
      className = "ColorPicker-Color selected";
    } else {
      className = "ColorPicker-Color";
    }

    if (isColorCompleted) {
      return <MenuItem
        className={className}
        style={{ backgroundColor: color.string }}
        key={`pick-${colorNumber}`}
        active={isColorSelected}
        onClick={_.noop}
        icon="checkmark"
      />;
    } else {
      return <MenuItem
        className={className}
        style={{ backgroundColor: color.string }}
        key={`pick-${colorNumber}`}
        active={isColorSelected}
        onClick={props.colorSelected.bind(null, colorNumber)}
      >
        <span className="ColorPicker-Color-number" style={{ backgroundColor: color.string }}>{colorNumber}</span>
      </MenuItem>;
    }
  });

  return <div className="ColorPicker">{colors}</div>;
}

ColorPicker.proptypes = {
  colorNumbers: PropTypes.array.isRequired,
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