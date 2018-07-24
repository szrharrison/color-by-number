import cssNamedColors from "./references/css_named_colors";
import validateColorString from "./validate_color_string";

let type = "literal";
let len = 3;

const colorConverter = {
  fromString(colorString) {
    if (validateColorString(colorString)) {
      if (colorString.startsWith("#")) {
        type = "hex";
        return convertHexToRgba(colorString);
      } else if (colorString.startsWith("rgb")) {
        type = "rgb";
        if (colorString.startsWith("rgba")) {
          type = "rgba";
        }
        return convertRgbaStringToRgba(colorString);
      } else {
        type = "name";
        return cssNamedColors.get(colorString.toLowerCase());
      }
    } else {
      type = "literal";
      return "error";
    }
  },
  fromArray(colorArray, string) {
    switch (type) {
      case "hex": {
        return convertColorArrayToHex(colorArray);
      }
      case "rgb": {
        return convertColorArrayToRgba(colorArray, false);
      }
      case "rgba": {
        return convertColorArrayToRgba(colorArray, true);
      }
      case "name": {
        return string;
      }
      default: {
        return string;
      }
    }
  }
};

function convertColorArrayToRgba(array, hasAlpha) {
  if (hasAlpha) {
    return `rgba(${array[0]}, ${array[1]}, ${array[2]}, ${array[3]})`;
  } else {
    return `rgb(${array[0]}, ${array[1]}, ${array[2]})`;
  }
}

function convertColorArrayToHex(array) {
  return `#${componentToHex(array[0])}${componentToHex(array[1])}${componentToHex(array[2])}`;
}

function componentToHex(c) {
  const hex = c.toString(16);
  if (len === 6) {
    return hex.length === 1 ? "0" + hex : hex;
  } else {
    return hex.length === 2 && hex[0] === hex[1] ? hex[0] : 0;
  }
}

function convertHexToRgba(hex) {
  if (hex.length === 7) {
    len = 6;
    const result = /^#?([A-F\d]{2})([A-F\d]{2})([A-F\d]{2})$/i.exec(hex);
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      255
    ];
  } else if (hex.length === 4) {
    len = 3;
    const result = /^#?([A-F\d])([A-F\d])([A-F\d])$/i.exec(hex);
    return [
      parseInt(result[1] + result[1], 16),
      parseInt(result[2] + result[2], 16),
      parseInt(result[3] + result[3], 16),
      255
    ];
  } else {
    type = "literal";
    return "error";
  }
}

function convertRgbaStringToRgba(string) {
  const result = /\(\s*([\d]{1,3})\s*,\s*([\d]{1,3})\s*,\s*([\d]{1,3})\s*,?\s*([\d]{0,3})\s*/i.exec(string);
  return [
    Math.min(parseInt(result[1], 10), 255),
    Math.min(parseInt(result[2], 10), 255),
    Math.min(parseInt(result[3], 10), 255),
    result[4].length ? Math.min(parseInt(result[4], 10), 255) : 255
  ];
}

export default colorConverter;