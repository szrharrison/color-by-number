const groupRgba = (data) => {
  const l = data.length / 4;
  const tempArray = new Array(l);
  for (let i = 0; i < l; i++) {
    const rgba = new Uint8ClampedArray(3);
    const dataI = i * 4;
    rgba[0] = data[dataI];
    rgba[1] = data[dataI + 1];
    rgba[2] = data[dataI + 2];
    tempArray[i] = rgba;
  }
  return tempArray;
};

export default groupRgba;