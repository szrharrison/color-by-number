import RGBA from "./rgba";
import groupRgba from "./group_rgba";
import unpackRgba from "./unpack_rgba";

function QuantizeColor(data, landscape) {
  const l = data.length;
  const pixelWidth = landscape ?
    Math.floor(this.width / this.imageData.width) :
    Math.floor(this.height / this.imageData.height);
  const pixelRowWidth = this.imageData.width * 4;

  const pixelXs = new Uint16Array(l / 4);
  const pixelYs = new Uint16Array(l / 4);
  const pixelRs = new Uint8ClampedArray(l / 4);
  const pixelGs = new Uint8ClampedArray(l / 4);
  const pixelBs = new Uint8ClampedArray(l / 4);
  const pixelAs = new Uint8ClampedArray(l / 4);

  const colors = new Uint8ClampedArray(1024);
  const dividedColors = medianCut(data);
  const colorBuckets = flattenBuckets(dividedColors);
  const len = colorBuckets.length;

  for (let i = 0; i < len; i++) {
    const bucket = colorBuckets[i];
    const bl = bucket.length;
    const sums = {r: 0, g: 0, b: 0};
    for (let i = 0; i < bl; i += 4) {
      sums.r += bucket[i];
      sums.g += bucket[i + 1];
      sums.b += bucket[i + 2];
    }
    const blen = bl / 4;
    const r = Math.round(sums.r / blen);
    const g = Math.round(sums.g / blen);
    const b = Math.round(sums.b / blen);
    colors[i * 4] = r;
    colors[i * 4 + 1] = g;
    colors[i * 4 + 2] = b;
    colors[i * 4 + 3] = 255;
  }

  for (let i = 0; i < l; i += 4) {
    const color = new RGBA(data[i], data[i + 1], data[i + 2], data[i + 3]);
    const quantizedColor = color.clone();
    quantizedColor.snapToPallete(colors);
    this.ctx.fillStyle = quantizedColor.toString();
    pixelRs[i / 4] = color.r;
    pixelGs[i / 4] = color.g;
    pixelBs[i / 4] = color.b;
    pixelAs[i / 4] = color.a;

    const x = ((i % pixelRowWidth) / 4);
    const y = Math.floor(i / pixelRowWidth);

    const pixelX = pixelWidth * x;
    const pixelY = pixelWidth * y;

    pixelXs[i / 4] = pixelX;
    pixelYs[i / 4] = pixelY;

    this.ctx.fillRect(pixelX, pixelY, pixelWidth, pixelWidth);
  }
  this.props.addPixelInfo(pixelXs, pixelYs, pixelRs, pixelGs, pixelBs, pixelAs);

}

export default QuantizeColor;

function medianCut(data, buckets = 1) {
  const sorted = sortByRange(data);
  const firstHalf = sorted.slice(0, sorted.length / 2);
  const secondHalf = sorted.slice(sorted.length / 2);
  if (buckets < 256) {
    return [
      medianCut(firstHalf, buckets * 2),
      medianCut(secondHalf, buckets * 2)
    ];
  } else {
    return [firstHalf, secondHalf];
  }
}

const sortByRange = (data) => {
  const ranges = getRanges(getMinMax(data));
  let sorted;
  if (ranges[0] > ranges[1] && ranges[0] > ranges[2]) {
    // console.log("red:", ranges);
    sorted = sortByRed(data);
  } else if (ranges[1] > ranges[0] && ranges[1] > ranges[2]) {
    // console.log("green:", ranges);
    sorted = sortByGreen(data);
  } else {
    // console.log("blue:", ranges);
    sorted = sortByBlue(data);
  }

  return sorted;
};

const sortByRed = (data) => {
  const sorted = groupRgba(data).sort((a, b) => a[0] > b[0] ? 1 : -1)

  return unpackRgba(sorted);
};

const sortByGreen = (data) => {
  const sorted = groupRgba(data).sort((a, b) => a[1] > b[1] ? 1 : -1)

  return unpackRgba(sorted);
};

const sortByBlue = (data) => {
  const sorted = groupRgba(data).sort((a, b) => a[2] > b[2] ? 1 : -1)

  return unpackRgba(sorted);
};

const flattenBuckets = (array, buckets = []) => {
  if (array[0].length === 2) {
    flattenBuckets(array[0], buckets);
    flattenBuckets(array[1], buckets);
  } else {
    buckets[buckets.length] = array[0];
    buckets[buckets.length] = array[1];
  }
  return buckets;
};

const getRanges = (minMax) => {
  const ranges = new Uint8ClampedArray(3);
  ranges[0] = minMax[1] - minMax[0];
  ranges[1] = minMax[3] - minMax[2];
  ranges[2] = minMax[5] - minMax[4];
  return ranges;
};

const getMinMax = (data) => {
  let minR = 256, maxR = -1, minG = 256, maxG = -1, minB = 256, maxB = -1;
  const l = data.length;
  const updateMinMax = (i) => {
    minR = Math.min(data[i], minR);
    maxR = Math.max(data[i], maxR);
    minG = Math.min(data[i + 1], minG);
    maxG = Math.max(data[i + 1], maxG);
    minB = Math.min(data[i + 2], minB);
    maxB = Math.max(data[i + 2], maxB);
  };

  for (let i = 0; i < l; i += 4) {
    updateMinMax(i);
  }

  const resp = new Uint8ClampedArray(6);
  resp[0] = minR;
  resp[1] = maxR;
  resp[2] = minG;
  resp[3] = maxG;
  resp[4] = minB;
  resp[5] = maxB;
  return resp;
};

const quickSort = (arr, left, right, i) => {
  let pivot,
      partitionIndex;


  if (left < right) {
    pivot = right;
    partitionIndex = partition(arr, pivot, left, right, i);

    //sort left and right
    quickSort(arr, left, partitionIndex - 1, i);
    quickSort(arr, partitionIndex + 1, right, i);
  }
  return arr;
};

const partition = (arr, pivot, left, right, i) => {
  const pivotValue = arr[pivot][i];
  let partitionIndex = left;

  for (let idx = left; idx < right; idx++) {
    if (arr[idx][i] < pivotValue) {
      swap(arr, idx, partitionIndex);
      partitionIndex++;
    }
  }
  swap(arr, right, partitionIndex);
  return partitionIndex;
};

const swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};
