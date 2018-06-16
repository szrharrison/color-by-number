import RGBA from "../rgba";
import PixelImage from "../pixel_image";

const rainbowHeart = new PixelImage(15, 16);

const colors = {
  clear: new RGBA(0, 0, 0, 0),
  black: new RGBA(),
  red: new RGBA(234, 0, 0),
  orange: new RGBA(247, 131, 0),
  yellow: new RGBA(254, 225, 0),
  green: new RGBA(0, 155, 64),
  blue: new RGBA(0, 87, 164),
  purple: new RGBA(141, 0, 119),
};

rainbowHeart.addPixel(colors.clear, 3);
rainbowHeart.addPixel(colors.black, 3);
rainbowHeart.addPixel(colors.clear, 3);
rainbowHeart.addPixel(colors.black, 3);
rainbowHeart.addPixel(colors.clear, 5);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.red, 3);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.clear, 1);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.red, 3);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.clear, 3);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.red, 5);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.red, 5);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.clear, 1);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.orange, 10);
rainbowHeart.addPixel(colors.clear, 1);
rainbowHeart.addPixel(colors.orange, 2);
rainbowHeart.addPixel(colors.black, 2);
rainbowHeart.addPixel(colors.orange, 11);
rainbowHeart.addPixel(colors.clear, 1);
rainbowHeart.addPixel(colors.orange, 1);
rainbowHeart.addPixel(colors.black, 2);
rainbowHeart.addPixel(colors.yellow, 11);
rainbowHeart.addPixel(colors.clear, 1);
rainbowHeart.addPixel(colors.yellow, 1);
rainbowHeart.addPixel(colors.black, 2);
rainbowHeart.addPixel(colors.yellow, 10);
rainbowHeart.addPixel(colors.clear, 1);
rainbowHeart.addPixel(colors.yellow, 2);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.clear, 1);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.green, 11);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.clear, 3);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.green, 9);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.clear, 5);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.blue, 7);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.clear, 7);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.blue, 5);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.clear, 9);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.purple, 3);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.clear, 11);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.purple, 1);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.clear, 13);
rainbowHeart.addPixel(colors.black, 1);
rainbowHeart.addPixel(colors.clear, 7);

export default rainbowHeart;


