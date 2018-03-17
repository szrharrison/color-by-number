import React, { Component } from "react";
import { connect } from "react-redux";
import RGBA from "../services/rgba";
import addPixelInfo from "../services/events/add_pixel_info";
import addColors from "../services/events/add_colors";

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
        // let scaleDown = this.width < this.image.width || this.height < this.image.height;
        const landscape = this.image.height <= this.image.width;

        let widthScale, heightScale;

        if (landscape) {
          widthScale  = 1;
          heightScale = this.width / this.image.width;
          // } else if(!landscape && !scaleDown) {
        } else {
          widthScale  = this.height / this.image.height;
          heightScale = 1;
          // } else if(landscape) {
          //   widthScale
        }

        const imageWidth  = this.width * widthScale;
        const imageHeight = this.height * heightScale;

        this.imageData = draw(this.ctx, this.image, 40 + this.width, 0);


        this.scale = this.imageData.height / this.image.height;
        console.log("scale:", this.scale, "adjustedHeight:", this.imageData.height, "actualHeight:", this.image.height);
        console.log("scale:", this.scale, "adjustedWidth:", this.imageData.width, "actualWidth:", this.image.width);

        const data          = this.imageData.data;
        const l             = data.length;
        const pixelWidth    = landscape ?
          Math.floor(this.width / this.imageData.width) :
          Math.floor(this.height / this.imageData.height);
        const pixelRowWidth = this.imageData.width * 4;

        const pixelXs = new Uint16Array(l / 4);
        const pixelYs = new Uint16Array(l / 4);
        const pixelRs = new Uint8ClampedArray(l / 4);
        const pixelGs = new Uint8ClampedArray(l / 4);
        const pixelBs = new Uint8ClampedArray(l / 4);
        const pixelAs = new Uint8ClampedArray(l / 4);

        const colors = [data[0], data[1], data[2], data[3]];

        for (let i = 0; i < l; i += 4) {
          const color        = new RGBA(data[i], data[i + 1], data[i + 2], data[i + 3]);
          this.ctx.fillStyle = color.toString();
          const len = colors.length;
          let exists = false;
          for ()
          if (colors.findIndex((datum, index) => datum === color.r && index % 4 === 0 && colors[index + 1] === data[i + 1] && colors[index + 2] === data[i + 2] && colors[index + 3] === data[i + 3]) === -1) {
            colors[colors.length] = color.r;
            colors[colors.length] = color.g;
            colors[colors.length] = color.b;
            colors[colors.length] = color.a;
          }
          pixelRs[i / 4] = color.r;
          pixelGs[i / 4] = color.g;
          pixelBs[i / 4] = color.b;
          pixelAs[i / 4] = color.a;

          const pixelX = pixelWidth * ((i % pixelRowWidth) / 4);
          const pixelY = pixelWidth * Math.floor(i / pixelRowWidth);

          pixelXs[i / 4] = pixelX;
          pixelYs[i / 4] = pixelY;

          this.ctx.fillRect(pixelX, pixelY, pixelWidth, pixelWidth);
        }
        this.props.addPixelInfo(pixelXs, pixelYs, pixelRs, pixelGs, pixelBs, pixelAs);
        const colorsBuffer = new Uint16Array(colors);
        this.props.addColors(colorsBuffer);
        console.log(colorsBuffer);
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

const Viewer = connect(mapStateToProps, { addPixelInfo, addColors })(UnconnectedViewer);
export default Viewer;


function draw(ctx, img, x, y) {
  ctx.drawImage(img, x, y);
  return getImageData(ctx, x, y, img);
}

function getImageData(ctx, x, y, img) {
  return ctx.getImageData(x, y, img.width, img.height);
}