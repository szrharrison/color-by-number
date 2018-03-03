import React, { Component } from "react";
import { connect } from "react-redux";
import RGBA from "../services/rgba";
import Pixel from "../services/pixel";
import addPixel from "../services/events/add_other_pixel";

class UnconnectedViewer extends Component {
  componentDidMount() {
    this.ctx = this.refs.canvas.getContext("2d");

    this.ctx.imageSmoothingEnabled       = false;
    this.ctx.mozImageSmoothingEnabled    = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled     = false;
  }

  componentDidUpdate() {
    if (this.props.source) {
      this.image     = new Image();
      this.image.src = this.props.source;

      this.width  = (window.innerWidth - 60) / 2;
      this.height = (window.innerHeight - 40);

      this.image.onload = () => {
        let scaleWidth = this.image.height <= this.image.width;
        let widthScale, heightScale;

        if (scaleWidth) {
          widthScale  = 1;
          heightScale = this.width / this.image.width;
        } else {
          widthScale  = this.height / this.image.height;
          heightScale = 1;
        }

        const imageWidth  = this.width * widthScale;
        const imageHeight = this.height * heightScale;

        this.ctx.drawImage(this.image, 40 + this.width, 0, imageWidth, imageHeight);
        this.imageData = this.ctx.getImageData(40 + this.width, 0, imageWidth, imageHeight);

        this.scale = this.imageData.height / this.image.height;
        console.log("scale:", this.scale, "adjustedHeight:", this.imageData.height, "actualHeight:", this.image.height);
        console.log("scale:", this.scale, "adjustedWidth:", this.imageData.width, "actualWidth:", this.image.width);

        const data          = this.imageData.data;
        const l             = data.length;
        const pixelWidth    = scaleWidth ?
          Math.floor(this.width / this.imageData.width) :
          Math.floor(this.height / this.imageData.height);
        const pixelRowWidth = this.imageData.width * 4;

        for (let i = 0; i < l; i += 4) {
          const color        = new RGBA(data[i], data[i + 1], data[i + 2], data[i + 3]);
          this.ctx.fillStyle = color.toString();

          const pixelX = pixelWidth * ((i % pixelRowWidth) / 4);
          const pixelY = pixelWidth * Math.floor(i / pixelRowWidth);

          const pixel = new Pixel(color, pixelX, pixelY);
          console.log(this.props);
          this.props.addPixel(pixel);
          this.ctx.fillRect(pixelX, pixelY, pixelWidth, pixelWidth);
        }
      };
    }
  }

  handleZoom = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    if (this.imageData && x > 40 + this.width && y > 20 && x < (40 + 2 * this.width) && y < 20 + this.height) {
      const imageX = x - 40 - this.width;
      const imageY = y;

      const zoomPortLeft = Math.min(Math.max(0, imageX), this.imageData.width - 10);
      const zoomPortTop  = Math.min(Math.max(0, imageY), this.imageData.height - 10);

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

  render() {
    return <div>
      <canvas
        ref="canvas"
        width={ window.innerWidth }
        height={ window.innerHeight }
        // onMouseMove={ this.handleZoom }
        style={ { cursor: "crosshair" } }
      />
    </div>;
  }
}

const mapStateToProps = (state) => ({
  source: state.image.dataUrl
});

const Viewer = connect(mapStateToProps, { addPixel })(UnconnectedViewer);
export default Viewer;