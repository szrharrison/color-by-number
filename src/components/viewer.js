import React, { Component } from "react";
import { connect } from "react-redux";
import colorPixel from "../services/events/color_pixel";
import rainbowHeart from "../services/sample_pixel_art/rainbow_heart";
import imageStore from "../services/image_store";

function renderPixelImage(pixelImage, scale, ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const pixels = pixelImage.pixels;
  const l = pixels.length;

  for (let i = 0; i < l; i++) {
    const pixel = pixels[i];
    const color = pixel.color;
    if (pixel.filled) {
      ctx.fillStyle = color.toString();
    } else {
      ctx.fillStyle = color.getShading().toString();
    }
    ctx.strokeStyle = "#000000";
    ctx.fillRect(pixel.x * scale, pixel.y * scale, scale, scale);
    ctx.strokeRect(pixel.x * scale, pixel.y * pixel.width, scale, scale);
    if (!pixel.filled) {
      ctx.fillStyle = "#000000";
      ctx.fillText(
        pixel.colorNum,
        pixel.x * scale + (scale / 2),
        pixel.y * scale + (scale / 2),
        scale
      );
    }
  }
}

class UnconnectedViewer extends Component {
  handleZoom = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    if (this.imageData && x > 40 + this.width && y > 20 && x < (40 + 2 * this.width) && y < 20 + this.height) {
      const imageX = x - 40 - this.width;
      const imageY = y;

      const zoomPortLeft = Math.min(Math.max(0, imageX), this.imageData.width - 10);
      const zoomPortTop = Math.min(Math.max(0, imageY), this.imageData.height - 10);

      const srcX = zoomPortLeft / this.scale;
      const srcY = zoomPortTop / this.scale;
      console.log("clientX:", x, "imageX:", srcX, "scaledX:", imageX);
      console.log("clientY:", y, "imageY:", srcY, "scaledY:", imageY);
      console.log("\n");
      this.ctx.drawImage(this.image,
        srcX,
        srcY,
        10, 10,
        0, 0,
        200, 200);
      this.ctx.beginPath();
      this.ctx.moveTo(100, 50);
      this.ctx.lineTo(100, 150);
      this.ctx.moveTo(50, 100);
      this.ctx.lineTo(150, 100);
      this.ctx.stroke();
    }
  };

  handleMousedown = (e) => {
    this.colorPixel(e);
    this.refs.canvas.addEventListener("mousemove", this.handleMousemove);
  };
  handleMouseup = () => {
    this.refs.canvas.removeEventListener("mousemove", this.handleMousemove);
  };
  handleMousemove = (e) => {
    this.colorPixel(e);
  };

  colorPixel(e) {
    const x = e.clientX - this.state.x;
    const y = e.clientY - this.state.y;
    const pixelX = Math.floor(x / this.state.scale);
    const pixelY = Math.floor(y / this.state.scale);
    const pixel = this.props.pixelImage.getPixelByPosition(pixelX, pixelY);
    if (pixel) {
      pixel.fill();
      this.props.colorPixel(pixel);
    }
  }

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext("2d");

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
    this.ctx.textAlign = "center";

    const rect = this.refs.canvas.getBoundingClientRect();
    const height = window.innerHeight - 40;
    const width = (window.innerWidth - 60) / 2;
    const pixelImage = this.props.pixelImage;

    const scale = Math.min(width / pixelImage.width, height / pixelImage.height);
    this.setState({
      x: rect.x,
      y: rect.y,
      scale
    });
    setTimeout(renderPixelImage, 200, pixelImage, scale, this.ctx);
  }

  componentDidUpdate() {
    if (this.props.source) {
      this.image = new Image();
      this.image.src = this.props.source;

      this.width = (window.innerWidth - 60) / 2;
      this.height = (window.innerHeight - 40);

      this.image.onload = () => {
        let scaleWidth = this.image.height <= this.image.width;
        let widthScale, heightScale;

        if (scaleWidth) {
          widthScale = 1;
          heightScale = this.width / this.image.width;
        } else {
          widthScale = this.height / this.image.height;
          heightScale = 1;
        }

        const imageWidth = this.width * widthScale;
        const imageHeight = this.height * heightScale;

        this.ctx.drawImage(this.image, 40 + this.width, 0, imageWidth, imageHeight);
        this.imageData = this.ctx.getImageData(40 + this.width, 0, imageWidth, imageHeight);

        this.scale = this.imageData.height / this.image.height;
        console.log("scale:", this.scale, "adjustedHeight:", this.imageData.height, "actualHeight:", this.image.height);
        console.log("scale:", this.scale, "adjustedWidth:", this.imageData.width, "actualWidth:", this.image.width);

        const data = this.imageData.data;
        const l = data.length;
        const pixelWidth = scaleWidth ?
          Math.floor(this.width / this.imageData.width) :
          Math.floor(this.height / this.imageData.height);
        const pixelRowWidth = this.imageData.width * 4;

      };
    }
  }

  render() {
    if (this.ctx) {
      renderPixelImage(this.props.pixelImage, this.state.scale, this.ctx);
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
        style={{ cursor: "crosshair" }}
      />
    </div>;
  }
}

const mapStateToProps = (state) => ({
  source: state.image.dataUrl,
  pixelImage: imageStore.pixelImage,
  colored: state.image.colorOrder
});

const Viewer = connect(mapStateToProps, { colorPixel })(UnconnectedViewer);
export default Viewer;