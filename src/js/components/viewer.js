import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import angleBetween from "../services/angle_between";
import colorPixel from "../services/actions/color_pixel";
import colorSelected from "../services/events/color_selected";
import colorStore from "../services/color_store";
import controller from "../services/controller";
import distanceBetween from "../services/distance_between";
import getEmPixels from "../services/getEmPixels";
import getSelectedColorNumber from "../services/selectors/get_selected_color_number";
import imageStore from "../services/image_store";
import initCanvas from "../services/init_canvas";
import PixelImage from "../services/models/pixel_image";
import renderPixelImage from "../services/render_pixel_image";
import setColors from "../services/events/set_colors";

/**
 * The last point the mouse event was fired from
 * @type {mousePoint|SvgPointSub}
 */
let lastPoint = { x: 0, y: 0 };

/**
 * @property {CanvasRenderingContext2D} ctx
 * @property {number} width
 * @property {number} height
 * @property {controller} controller
 */
class Viewer extends Component {
  static defaultProps = {
    pixelImage: PixelImage.emptyImage,
    selectedColorNumber: 1
  };

  static propTypes = {
    pixelImage: PropTypes.object.isRequired,
    selectedColorNumber: PropTypes.number.isRequired
  };

  /**
   * @type {{filledPixels: number, xDiff: ?number, yDiff: ?number, scale: ?number, translateX: number, translateY: number}}
   */
  state = {
    filledPixels: 0,
    xDiff: null,
    yDiff: null,
    scale: null,
    translateX: 0,
    translateY: 0,
  };

  handleMousedown = e => {
    this.setState({ coloring: true });
    lastPoint = this.ctx.transformedPoint(this.getPoint(e));
    this.colorPixel(e);
    this.refs.canvas.addEventListener("mousemove", this.handleMousemove);
  };

  handleMouseup = () => {
    this.refs.canvas.removeEventListener("mousemove", this.handleMousemove);
    this.setState({ coloring: false });
  };

  handleMouseLeave = () => {
    this.setState({ coloring: false });
  };

  handleMouseEnter = e => {
    if (e.buttons === 1 || e.which === 1) {
      this.setState({ coloring: true });
    } else {
      this.refs.canvas.removeEventListener("mousemove", this.handleMousemove);
    }
  };

  handleMousemove = e => {
    if (this.state.coloring) {
      this.colorPixel(e);
    }
  };

  handleWheel = e => {
    e.preventDefault();
    e.stopPropagation();
    let moveX = Math.round(e.deltaX);
    // noinspection JSSuspiciousNameCombination
    let moveY = Math.round(e.deltaY);

    this.setState(prevState => {
      const { translateX, translateY } = prevState;
      this.ctx.translate(moveX, moveY);
      return {
        translateX: translateX + moveX,
        translateY: translateY + moveY
      };
    });
  };

  handleButtons = e => {
    this.controller(e.keyCode, this.state);
  };

  handleResize = () => {
    initCanvas(this.ctx);
    const rect = this.refs.canvas.getBoundingClientRect();
    this.width = window.innerWidth - 30 - 15 * getEmPixels();
    this.height = window.innerHeight - 30;

    this.setState({
      xDiff: rect.left,
      yDiff: rect.top,
    });

    this.resizing = false;
  };

  optimizedResize = () => {
    if (!this.resizing) {
      this.resizing = true;
      requestAnimationFrame(this.handleResize);
    }
  };

  /**
   * Returns the point on the canvas that the event fired from
   * @param {MouseEvent} e
   * @return {mousePoint}
   */
  getPoint = e => ({
    x: e.clientX - this.state.xDiff,
    y: e.clientY - this.state.yDiff
  });

  /**
   * Colors all pixels between the {@link lastPoint} and given event's {@link mousePoint point}. Then, sets the last
   * point to the event's point.
   * @param {MouseEvent} e
   */
  colorPixel = e => {
    const currentPoint = this.ctx.transformedPoint(this.getPoint(e));
    const dist = distanceBetween(lastPoint, currentPoint);
    const angle = angleBetween(lastPoint, currentPoint);
    const scale = this.state.scale;
    const { pixelImage, selectedColorNumber, colorStore } = this.props;
    for (let i = 0; i <= dist; i += scale - 1) {
      const x = lastPoint.x + Math.sin(angle) * i;
      const y = lastPoint.y + Math.cos(angle) * i;
      const pixelX = Math.floor(x / scale);
      const pixelY = Math.floor(y / scale);
      const pixel = pixelImage.getPixelByImagePosition(pixelX, pixelY);
      if (pixel) {
        if (selectedColorNumber === pixel.color.number) {
          if (!pixel.filled) {
            pixel.fill();
            this.props.colorPixel(pixel);
          }
        } else {
          pixel.shade = colorStore.get(selectedColorNumber);
        }
      }
    }
    lastPoint = currentPoint;
  };

  setupCanvas = () => {
    this.ctx = this.refs.canvas.getContext("2d");

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;

    initCanvas(this.ctx);

    window.addEventListener("keydown", this.handleButtons);
    this.refs.canvas.addEventListener("mousewheel", this.handleWheel);
    window.addEventListener("resize", this.optimizedResize);
    const rect = this.refs.canvas.getBoundingClientRect();

    this.setState({
      xDiff: rect.left,
      yDiff: rect.top,
    });

    requestAnimationFrame(this.animate);
  };

  animate = () => {
    renderPixelImage(this.props.pixelImage, this.state.scale, this.ctx);
    requestAnimationFrame(this.animate);
  };

  componentDidMount() {
    this.setupCanvas();
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.pixelImage !== prevProps.pixelImage) {
      const pixelImage = this.props.pixelImage;
      this.props.setColors(colorStore.colors);

      this.width = window.innerWidth - 30 - 15 * getEmPixels();
      this.height = window.innerHeight - 30;

      const scale = Math.round(Math.min(this.width / pixelImage.width, this.height / pixelImage.height));
      if (this.state.scale !== scale) {
        this.setState({ scale });
      }
      this.controller = controller(this);
      pixelImage.setScale(scale);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleButtons);
    this.refs.canvas.removeEventListener("mousewheel", this.handleWheel);
    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    return <div>
      <canvas
        ref="canvas"
        width={window.innerWidth - 30 - 15 * getEmPixels()}
        height={window.innerHeight - 30}
        onMouseDown={this.handleMousedown}
        onMouseUp={this.handleMouseup}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
        style={{ cursor: "crosshair" }}
      />
    </div>;
  }
}

const mapStateToProps = (state, props) => ({
  pixelImage: imageStore.pixelImage,
  selectedColorNumber: getSelectedColorNumber(state, props),
  colorStore
});

export default connect(mapStateToProps, { colorPixel, setColors, colorSelected })(Viewer);