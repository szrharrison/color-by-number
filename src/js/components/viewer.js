import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import colorPixel from "../services/actions/color_pixel";
import colorStore from "../services/color_store";
import getSelectedColorNumber from "../services/selectors/get_selected_color_number";
import imageStore from "../services/image_store";
import initCanvas from "../services/init_canvas";
import setColors from "../services/events/set_colors";
import keyMap from "../services/keycode_map";

function renderPixelImage(pixelImage, scale, ctx) {
  ctx.clearCanvas();

  const pixels = pixelImage.pixels;
  const l = pixels.length;

  for (let i = 0; i < l; i++) {
    const pixel = pixels[i];
    const color = pixel.color;
    if (pixel.filled) {
      ctx.fillStyle = color.string;
    } else {
      ctx.fillStyle = color.grayscale.string;
    }
    ctx.fillRect(pixel.canvasX, pixel.canvasY, scale + 1, scale + 1);
    if (!pixel.filled) {
      if (pixel.shade) {
        ctx.fillStyle = pixel.shade.string;
        ctx.fillRect(pixel.canvasX, pixel.canvasY, scale, scale);
      }
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(pixel.canvasX, pixel.canvasY, scale, scale);
      ctx.fillStyle = "#000000";
      ctx.fillText(
        color.number,
        pixel.canvasX + (scale / 2),
        pixel.canvasY + (scale / 2),
        scale
      );
    }
  }
}

class Viewer extends Component {
  static propTypes = {
    pixelImage: PropTypes.object,
    selectedColorNumber: PropTypes.number.isRequired
  };

  static defaultProps = {
    selectedColorNumber: 1
  };

  state = {
    filledPixels: 0,
    shadedPixels: 0,
    xDiff: null,
    yDiff: null,
    scale: null,
  };

  handleMousedown = (e) => {
    if (this.props.pixelImage) {
      this.colorPixel(e);
      this.refs.canvas.addEventListener("mousemove", this.handleMousemove);
    }
  };

  handleMouseup = () => {
    if (this.props.pixelImage) {
      this.refs.canvas.removeEventListener("mousemove", this.handleMousemove);
    }
  };

  handleMousemove = (e) => {
    if (this.props.pixelImage) {
      this.colorPixel(e);
    }
  };

  handleWheel = (e) => {
    if (this.props.pixelImage) {
      const scale = e.deltaY;
      const scaleChange = 1 - scale / 100;
      const ctx = this.ctx;
      const pixelImage = this.props.pixelImage;

      this.setState((prevState) => {
        const newScale = Math.max(Math.min(prevState.scale * scaleChange, 50), 1);
        ctx.font = newScale / 2 + "px sans-serif";
        requestAnimationFrame(() => {
          pixelImage.setScale(newScale);
          renderPixelImage(pixelImage, newScale, ctx);
        });
        return {
          scale: newScale
        };
      });
    }
  };

  handleButtons = (e) => {
    if (this.props.pixelImage) {
      // eslint-disable-next-line default-case
      switch (e.keyCode) {
        case keyMap.byKey.left: // left key pressed
          this.ctx.translate(this.state.scale, 0);
          break;
        case keyMap.byKey.up: // up key pressed
          this.ctx.translate(0, this.state.scale);
          break;
        case keyMap.byKey.right: // right key pressed
          this.ctx.translate(-this.state.scale, 0);
          break;
        case keyMap.byKey.down: // down key pressed
          this.ctx.translate(0, -this.state.scale);
          break;
      }
      renderPixelImage(this.props.pixelImage, this.state.scale, this.ctx);
    }
  };

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext("2d");

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    initCanvas(this.ctx);

    window.addEventListener("keydown", this.handleButtons);
    const rect = this.refs.canvas.getBoundingClientRect();

    this.setState({
      xDiff: rect.left,
      yDiff: rect.top,
    });
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleButtons);
  }

  colorPixel(e) {
    const x = e.clientX - this.state.xDiff;
    const y = e.clientY - this.state.yDiff;
    const pt = this.ctx.transformedPoint(x, y);
    const pixelX = Math.floor(pt.x / this.state.scale);
    const pixelY = Math.floor(pt.y / this.state.scale);
    const pixel = this.props.pixelImage.getPixelByPosition(pixelX, pixelY);
    if (pixel) {
      if (this.props.selectedColorNumber === pixel.color.number) {
        if (!pixel.filled) {
          pixel.fill();
          this.props.colorPixel(pixel);
          this.setState((prevState) => ({
            filledPixels: prevState.filledPixels + 1
          }));
        }
      } else {
        pixel.shade = this.props.colorStore.get(this.props.selectedColorNumber);
        this.setState((prevState) => ({
          shadedPixels: prevState.shadedPixels + 1
        }));
      }
    }
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.pixelImage !== prevProps.pixelImage) {
      const pixelImage = this.props.pixelImage;
      this.props.setColors(colorStore.colors);

      this.width = (window.innerWidth - 60) / 2;
      this.height = (window.innerHeight - 40);

      const scale = Math.min(this.width / pixelImage.width, this.height / pixelImage.height);
      this.ctx.font = scale / 2 + "px sans-serif";
      if (this.state.scale !== scale) {
        this.setState({ scale });
      }
      requestAnimationFrame(() => {
        pixelImage.setScale(scale);
        renderPixelImage(pixelImage, scale, this.ctx);
      });
    }
  }

  render() {
    if (this.ctx && this.props.pixelImage) {
      requestAnimationFrame(() => {
        renderPixelImage(this.props.pixelImage, this.state.scale, this.ctx);
      });
    }
    return <div>
      <canvas
        ref="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        // onMouseMove={ this.handleZoom }
        onMouseDown={this.handleMousedown}
        onMouseUp={this.handleMouseup}
        onMouseLeave={this.handleMouseup}
        onWheel={this.handleWheel}
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

export default connect(mapStateToProps, { colorPixel, setColors })(Viewer);