import cssNamedColors from "./css_named_colors";

const validateColorString = (colorString) => {
  if (typeof colorString !== "string") {
    return false;
  } else if (colorString === "") {
    return false;
  } else if (colorString === "inherit") {
    return false;
  } else if (colorString.startsWith("#")) {
    return /(^#[a-f0-9]{6})|(^#[a-f0-9]{3})/i.test(colorString);
  } else if (colorString.toLowerCase().startsWith("rgb")) {
    return /(rgb\((\s*[\d]{1,3}\s*,){2}\s*[\d]{1,3}\s*\))|(rgba\((\s*[\d]{1,3}\s*,){3}\s*[\d]{1,3}\s*\))/i.test(colorString);
  } else {
    return cssNamedColors.has(colorString.toLowerCase());
  }
};

export default validateColorString;