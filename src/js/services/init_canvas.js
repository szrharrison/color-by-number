function Matrix(values) {
  if (!Array.isArray(values)) {
    throw new Error("Array must be passed");
  }
  if (values.length !== Matrix.rowLen) {
    console.log(values.length, Matrix.rowLen);
    throw new Error("Matrix must have 3 rows");
  }
  this._values = [];
  for (let rowIndex = 0; rowIndex < Matrix.rowLen; rowIndex++) {
    if (values.length !== Matrix.colLen) {
      throw new Error("Matrix must have 3 cols on row: " + rowIndex);
    }
    this._values[rowIndex] = [];
    for (let colIndex = 0; colIndex < Matrix.colLen; colIndex++) {
      this._values[rowIndex][colIndex] = values[rowIndex][colIndex];
    }
  }
}

Object.defineProperties(Matrix, {
  rowLen: { value: 3 },
  colLen: { value: 3 }
});

Object.defineProperty(Matrix, "identity", {
  value: new Matrix([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ])
});

Matrix.prototype.multiply = function (matrix) {
  if (Array.isArray(matrix)) {
    matrix = new Matrix(matrix);
  }

  if (!matrix instanceof Matrix) {
    throw new Error("Argument passed is not a valid Matrix object");
  }

  const product = Matrix.identity.clone();

  const leftM = this._values;
  const rightM = matrix._values;
  for (let rowIndex = 0; rowIndex < Matrix.rowLen; rowIndex++) {
    for (let colIndex = 0; colIndex < Matrix.colLen; colIndex++) {
      let square = 0;
      for (let i = 0; i < Matrix.colLen; i++) {
        square += leftM[rowIndex][i] * rightM[i][colIndex];
      }
      product._values[rowIndex][colIndex] = square;
    }
  }
  return product;
};

Matrix.prototype.clone = function () {
  return new Matrix(this._values);
};

Matrix.prototype.invert = function () {
  // Declare variables
  let ratio;
  let a;
  const rowLen = Matrix.rowLen;
  const values = this._values;

  // Put an identity matrix to the right of matrix
  for (let i = 0; i < rowLen; i++) {
    for (let j = rowLen; j < 2 * Matrix.colLen; j++) {
      if (i === (j - rowLen)) {
        values[i][j] = 1;
      }
      else {
        values[i][j] = 0;
      }
    }
  }

  for (let i = 0; i < rowLen; i++) {
    for (let j = 0; j < rowLen; j++) {
      if (i !== j) {
        ratio = values[j][i] / values[i][i];
        for (let k = 0; k < 2 * rowLen; k++) {
          values[j][k] -= ratio * values[i][k];
        }
      }
    }
  }

  for (let i = 0; i < rowLen; i++) {
    a = values[i][i];
    for (let j = 0; j < 2 * rowLen; j++) {
      values[i][j] /= a;
    }
  }

  // Remove the left-hand identity matrix
  for (let i = 0; i < rowLen; i++) {
    values[i].splice(0, rowLen);
  }

  return this;
};

/**
 * Offers restricted functionality of svg for the part of transformations.
 * By svg means "document.createElementNS("http://www.w3.org/2000/svg", 'svg')"
 */
const SvgTransformSub = function () {
  //TODO if svg exists use it else substitute it
};

SvgTransformSub.prototype.createSVGMatrix = function () {
  return new SvgMatrixSub();
};

SvgTransformSub.prototype.createSVGPoint = function () {
  return new SvgPointSub();
};

/**
 * Offers restricted functionality of <a href="http://www.w3.org/TR/SVG11/coords.html#InterfaceSVGMatrix">SVGMatrix</a>
 * @param matrix Matrix @see <a href="https://github.com/angusgibbs/matrix">https://github.com/angusgibbs/matrix</a>
 */
const SvgMatrixSub = function (matrix) {
  if (matrix) {
    this.matrix = matrix;
  } else {
    this.matrix = Matrix.identity.clone();
  }
};

SvgMatrixSub.prototype.setTransformFromArray = function (a, b, c, d, e, f) {
  const values = this.matrix._values;
  values[0][0] = a;
  values[1][0] = b;
  values[0][1] = c;
  values[1][1] = d;
  values[0][2] = e;
  values[1][2] = f;
};

SvgMatrixSub.prototype.getTransformAsArray = function () {
  const values = this.matrix._values;
  return [
    values[0][0],
    values[1][0],
    values[0][1],
    values[1][1],
    values[0][2],
    values[1][2]
  ];
};

SvgMatrixSub.prototype.translate = function (tx, ty) {
  return this._multiply([[1, 0, tx], [0, 1, ty], [0, 0, 1]]);
};

SvgMatrixSub.prototype.scaleNonUniform = function (sx, sy) {
  return this._multiply([[sx, 0, 0], [0, sy, 0], [0, 0, 1]]);
};

SvgMatrixSub.prototype.rotate = function (a) {
  return this._multiply([[Math.cos(a), -Math.sin(a), 0], [Math.sin(a), Math.cos(a), 0], [0, 0, 1]]);
};

SvgMatrixSub.prototype._multiply = function (matrix) {
  const resultMatrix = this.matrix.multiply(matrix);
  return new SvgMatrixSub(resultMatrix);
};

SvgMatrixSub.prototype.inverse = function () {
  const result = new SvgMatrixSub(this.matrix.clone());
  result.matrix.invert();
  return result;
};


/**
 * Offers restricted functionality of SVGMatrix {@url http://www.w3.org/TR/SVG11/coords.html#InterfaceSVGMatrix}
 */
const SvgPointSub = function () {
  this.x = null;
  this.y = null;
};

SvgPointSub.prototype.matrixTransform = function (matrix) {
  const resultMatrix = matrix.matrix.clone().multiply(new Matrix([
    [this.x],
    [this.y],
    [1]
  ]));
  const result = new SvgPointSub();
  result.x = resultMatrix._values[0][0];
  result.y = resultMatrix._values[1][0];
  return result;
};

/**
 * Mixin which enables canvas context to save applied transformations.
 * @param canvasContext canvas.getContext('2d')
 */
function initCanvas(canvasContext) {
  const svg = new SvgTransformSub();
  let transformMatrix = svg.createSVGMatrix();

  canvasContext.getTransformMatrix = function () {
    return transformMatrix;
  };

  const savedTransforms = [];
  const save = canvasContext.save;
  canvasContext.save = function () {
    savedTransforms.push(transformMatrix.translate(0, 0));
    return save.call(canvasContext);
  };
  const restore = canvasContext.restore;
  canvasContext.restore = function () {
    transformMatrix = savedTransforms.pop();
    return restore.call(canvasContext);
  };

  const scale = canvasContext.scale;
  canvasContext.scale = function (sx, sy) {
    transformMatrix = transformMatrix.scaleNonUniform(sx, sy);
    return scale.call(canvasContext, sx, sy);
  };

  const rotate = canvasContext.rotate;
  canvasContext.rotate = function (radians) {
    transformMatrix = transformMatrix.rotate(radians);
    return rotate.call(canvasContext, radians);
  };

  const translate = canvasContext.translate;
  canvasContext.translate = function (dx, dy) {
    transformMatrix = transformMatrix.translate(dx, dy);
    return translate.call(canvasContext, dx, dy);
  };

  const transform = canvasContext.transform;
  canvasContext.transform = function (a, b, c, d, e, f) {
    const matrix = svg.createSVGMatrix();
    matrix.setTransformFromArray(a, b, c, d, e, f);
    transformMatrix = transformMatrix.multiply(matrix);
    return transform.call(canvasContext, a, b, c, d, e, f);
  };

  const setTransform = canvasContext.setTransform;
  canvasContext.setTransform = function (a, b, c, d, e, f) {
    transformMatrix.setTransformFromArray(a, b, c, d, e, f);
    return setTransform.call(canvasContext, a, b, c, d, e, f);
  };

  const pt = svg.createSVGPoint();
  canvasContext.transformedPoint = function (x, y) {
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(transformMatrix.inverse());
  };


  canvasContext.clearTransformedRect = function (x, y, w, h) {
    const p1 = canvasContext.transformedPoint(x, y);
    const p2 = canvasContext.transformedPoint(x + w, y + h);
    canvasContext.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
  };

  canvasContext.clearCanvas = function () {
    canvasContext.save();
    // Use the identity matrix while clearing the canvas
    canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    canvasContext.restore();
  };
}

export default initCanvas;