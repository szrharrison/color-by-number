import RGBA from "../rgba";
import PixelImage from "../pixel_image";

const grimReaper = new PixelImage(256, 256);

const colors = {
  clear: new RGBA(0, 0, 0, 0),
  black: new RGBA(16, 16, 16),
  gray: new RGBA(49, 49, 49),
  darkBone: new RGBA(142, 114, 96),
  lightBone: new RGBA(241, 214, 169),
  darkBlood: new RGBA(89, 0, 0),
  lightBlood: new RGBA(248, 0, 0),
  blood: new RGBA(160, 0, 59),
  lightGray: new RGBA(83, 73, 74),
  purple: new RGBA(60, 40, 65),
  maroon: new RGBA(87, 45, 47)
};

grimReaper.addPixel(colors.clear, 249);
grimReaper.addPixel(colors.darkBlood, 6);
grimReaper.addPixel(colors.clear);

grimReaper.addPixel(colors.clear, 246);
grimReaper.addPixel(colors.darkBlood, 3);
grimReaper.addPixel(colors.lightBlood, 3);
grimReaper.addPixel(colors.blood, 2);
grimReaper.addPixel(colors.darkBlood);
grimReaper.addPixel(colors.clear);

grimReaper.addPixel(colors.clear, 226);
grimReaper.addPixel(colors.black, 6);
grimReaper.addPixel(colors.clear, 12);
grimReaper.addPixel(colors.darkBlood, 2);
grimReaper.addPixel(colors.lightBlood, 3);
grimReaper.addPixel(colors.blood, 5);
grimReaper.addPixel(colors.clear, 2);

export default grimReaper;