import keyMap from "./references/keycode_map";
import clickSound from "../../audio/click.wav";

/**
 * Controls what happens when certain buttons are pressed
 * @callback controller
 * @param {number} key
 * @param {{ scale: number, translateX: number, translateY: number }} state
 */

/**
 * Temporary storage for private variables to be used in the private functions
 * @type {{timer: ?number, colorNum: ?string}}
 * @private
 */
const priv = {
  timer: null,
  colorNum: null
};

/**
 * Sound player. To be played when selecting a color
 * @type {HTMLAudioElement}
 * @private
 */
const audioPlayer = new Audio(clickSound);

/**
 * Reset the private variable storage and play a sound after the timeout has completed
 * @param {function} cb
 * @param {number} num
 */
const timeoutCallback = (cb, num) => {
  priv.timer = null;
  priv.colorNum = null;
  audioPlayer.play();
  cb(num);
};

/**
 * Wait until nothing is typed for 1 second before calling the {@link timeoutCallback}
 * @param {function} colorSelected
 * @param {string} num
 */
const debounce = (colorSelected, num) => {
  if (priv.timer) {
    clearTimeout(priv.timer);
    priv.colorNum += num;
    priv.timer = setTimeout(timeoutCallback, 1000, colorSelected, parseInt(priv.colorNum, 10));
  } else {
    priv.timer = setTimeout(timeoutCallback, 1000, colorSelected, parseInt(num, 10));
    priv.colorNum = num;
  }
};

/**
 * Creates a controller
 * @param {Viewer} that
 * @returns {controller}
 */
function controllerBuilder (that) {
    const setState = that.setState.bind(that);
    const ctx = that.ctx;
    const colorSelector = that.props.colorSelected;
    const pixelImage = that.props.pixelImage;

    return function (key, state) {
      const { scale, translateX, translateY } = state;
      const string = keyMap.byCode[key];

      if (/\d/.test(string)) {
        debounce(colorSelector, string);
      } else if (/[a-z]/.test(string)) {
        switch (key) {
          case keyMap.byKey.a: {}
// eslint-disable-next-line no-fallthrough
          case keyMap.byKey.left: {
            if (translateX + scale < 10) {
              ctx.translate(scale, 0);
              setState(prevState => ({
                translateX: prevState.translateX + scale
              }));
            }
            break;
          }
          case keyMap.byKey.w: {}
// eslint-disable-next-line no-fallthrough
          case keyMap.byKey.up: {
            if (translateY + scale < 10) {
              ctx.translate(0, scale);
              setState(prevState => ({
                translateY: prevState.translateY + scale
              }));
            }
            break;
          }
          case keyMap.byKey.d: {}
// eslint-disable-next-line no-fallthrough
          case keyMap.byKey.right: {
            if (translateX - scale > -scale * pixelImage.width - 10) {
              ctx.translate(-scale, 0);
              setState(prevState => ({
                translateX: prevState.translateX - scale
              }));
            }
            break;
          }
          case keyMap.byKey.s: {}
// eslint-disable-next-line no-fallthrough
          case keyMap.byKey.down: {
            if (translateY - scale > -scale * pixelImage.height - 10) {
              ctx.translate(0, -scale);
              setState(prevState => ({
                translateY: prevState.translateY - scale
              }));
            }
            break;
          }
          default: {}
        }
      } else if (/[-=.,]/.test(string)) {
        switch (key) {
          case keyMap.byKey["="]: {}
// eslint-disable-next-line no-fallthrough
          case keyMap.byKey["."]: {
            setState(prevState => {
              const newScale = Math.min(prevState.scale + 1, 50);
              pixelImage.setScale(newScale);
              return { scale: newScale };
            });
            break;
          }
          case keyMap.byKey["-"]: {}
// eslint-disable-next-line no-fallthrough
          case keyMap.byKey[","]: {
            setState(prevState => {
              const newScale = Math.max(prevState.scale - 1, 1);
              pixelImage.setScale(newScale);
              return { scale: newScale };
            });
            break;
          }
          default: {}
        }
      }
    };
  };

export default controllerBuilder;