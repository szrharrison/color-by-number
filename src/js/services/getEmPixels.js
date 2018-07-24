const important = "!important;";
const style = "position:absolute" + important + "visibility:hidden" + important + "width:1em" + important + "font-size:1em" + important + "padding:0" + important;

function getEmPixels(element) {
  const documentElement = document.documentElement;
  let extraBody;

  if (!element) {
    // Emulate the documentElement to get rem value
    element = extraBody = document.createElement("body");
    extraBody.style.cssText = "font-size:1em" + important;
    documentElement.insertBefore(extraBody, document.body);
  }

  // Create and style a test element
  const testElement = document.createElement("i");
  testElement.style.cssText = style;
  element.appendChild(testElement);

  // Get the client width of the test element
  const em = testElement.clientWidth;

  if (extraBody) {
    // Remove the extra body element
    documentElement.removeChild(extraBody);
  }
  else {
    // Remove the test element
    element.removeChild(testElement);
  }

  // Return the em value in pixels
  return em;
}

export default getEmPixels;