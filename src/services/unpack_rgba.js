const unpackRgba = (data) => {
  const l = data.length * 4;
  const len = data.length;
  const response = new Uint8ClampedArray(l);
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < 3; j++) {
      response[i * 4 + j] = data[i][j];
    }
    response[i * 4 + 3] = 255;
  }
  return response;
};

export default unpackRgba;