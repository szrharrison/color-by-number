import React, { Component } from "react";
import { connect } from "react-redux";
import * as PIXI from "pixi.js";

class ImageViewer extends Component {
  componentDidMount() {
    //Setup PIXI Canvas in componentDidMount
    this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
    this.refs.canvas.appendChild(this.renderer.view);

    // create the root of the scene graph
    this.stage        = new PIXI.Container();
    this.stage.width  = window.innerWidth;
    this.stage.height = window.innerHeight;

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(0);

    for (let i = 0; i < 210; i++) {
    graphics.beginFill(0x285896);
      graphics.drawRect(10 * (i % 30), 10 * Math.floor(i / 30), 10, 10);
    graphics.endFill();
    }

    this.stage.addChild(graphics);
    console.log(this.stage);
    this.animate();
  }

  animate = () => {
    this.renderer.render(this.stage);
    requestAnimationFrame(this.animate);
  };

  render() {
    return <div>
      <div ref="canvas">
      </div>
    </div>;
  }
}

const mapStateToProps = (state) => ({
  source: state.image.dataUrl
});

export default connect(mapStateToProps)(ImageViewer);
