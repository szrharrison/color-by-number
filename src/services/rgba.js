const cache = new Map();

function RGBA(r, g, b, a) {
  Object.defineProperties(this, {
    r: { value: r || 0 },
    g: { value: g || 0 },
    b: { value: b || 0 },
    a: { value: a || 0 },
  });
}

Object.defineProperties(RGBA.prototype, {

  toString:   {
    value: function () {
      if (cache.has(this)) {
        return cache.get(this);
      } else {
        const rgba = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a / 255 + ")";
        cache.set(this, rgba);
        return rgba;
      }
    }
  },
  toArray:    {
    value: function () {
      return [this.r, this.g, this.b, this.a];
    }
  }
  ,
  addToArray: {
    value: function (array) {
      array[array.length] = this.r;
      array[array.length] = this.g;
      array[array.length] = this.b;
      array[array.length] = this.a;
    }
  }
  ,
  toHex:      {
    value: function () {
      const r   = ("0" + this.r.toString(16)).slice(-2);
      const g   = ("0" + this.g.toString(16)).slice(-2);
      const b   = ("0" + this.b.toString(16)).slice(-2);
      const hex = `${r}${g}${b}`;
      return parseInt(hex, 16);
    }
  }
})
;
export default RGBA;