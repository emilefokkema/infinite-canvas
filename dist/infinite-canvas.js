var fi = Object.defineProperty;
var gi = (s, t, e) => t in s ? fi(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var a = (s, t, e) => gi(s, typeof t != "symbol" ? t + "" : t, e);
let mi = class {
  constructor(t) {
    this.viewBox = t;
  }
  restore() {
    this.viewBox.restoreState();
  }
  save() {
    this.viewBox.saveState();
  }
  reset() {
    this.viewBox.resetState();
  }
};
const Y = class Y {
  constructor(t, e) {
    this.x = t, this.y = e;
  }
  mod() {
    return Math.sqrt(this.modSq());
  }
  modSq() {
    return this.x * this.x + this.y * this.y;
  }
  minus(t) {
    return new Y(this.x - t.x, this.y - t.y);
  }
  plus(t) {
    return new Y(this.x + t.x, this.y + t.y);
  }
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  cross(t) {
    return this.x * t.y - this.y * t.x;
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  getPerpendicular() {
    return new Y(-this.y, this.x);
  }
  scale(t) {
    return new Y(t * this.x, t * this.y);
  }
  projectOn(t) {
    return t.scale(this.dot(t) / t.modSq());
  }
  matrix(t, e, n, i) {
    return new Y(t * this.x + e * this.y, n * this.x + i * this.y);
  }
  inSameDirectionAs(t) {
    return this.cross(t) === 0 && this.dot(t) >= 0;
  }
  isInOppositeDirectionAs(t) {
    return this.cross(t) === 0 && this.dot(t) < 0;
  }
  isOnSameSideOfOriginAs(t, e) {
    return this.isInSmallerAngleBetweenPoints(t, e) || t.isInSmallerAngleBetweenPoints(this, e) || e.isInSmallerAngleBetweenPoints(this, t);
  }
  isInSmallerAngleBetweenPoints(t, e) {
    const n = t.cross(e);
    return n > 0 ? t.cross(this) >= 0 && this.cross(e) >= 0 : n < 0 ? t.cross(this) <= 0 && this.cross(e) <= 0 : t.dot(e) > 0 ? this.cross(t) === 0 && this.dot(t) > 0 : !0;
  }
};
a(Y, "origin", new Y(0, 0));
let h = Y;
function ct(s) {
  return s.toFixed(10).replace(/\.?0+$/, "");
}
const b = class b {
  constructor(t, e, n, i, r, o) {
    a(this, "scale");
    this.a = t, this.b = e, this.c = n, this.d = i, this.e = r, this.f = o, this.scale = Math.sqrt(t * i - e * n);
  }
  getMaximumLineWidthScale() {
    const t = this.a + this.c, e = this.b + this.d, n = this.a - this.c, i = this.b - this.d;
    return Math.sqrt(Math.max(t * t + e * e, n * n + i * i));
  }
  getRotationAngle() {
    const t = this.a / this.scale, e = this.b / this.scale;
    if (t === 0)
      return e > 0 ? Math.PI / 2 : 3 * Math.PI / 2;
    const n = Math.atan(e / t);
    return t > 0 ? e > 0 ? n : e === 0 ? 0 : 2 * Math.PI + n : e > 0 ? Math.PI + n : e === 0 ? Math.PI : Math.PI + n;
  }
  applyToPointAtInfinity(t) {
    return { direction: this.untranslated().apply(t.direction) };
  }
  apply(t) {
    return new h(this.a * t.x + this.c * t.y + this.e, this.b * t.x + this.d * t.y + this.f);
  }
  untranslated() {
    const { x: t, y: e } = this.apply(h.origin);
    return this.before(b.translation(-t, -e));
  }
  before(t) {
    const e = t.a * this.a + t.c * this.b, n = t.b * this.a + t.d * this.b, i = t.a * this.c + t.c * this.d, r = t.b * this.c + t.d * this.d, o = t.a * this.e + t.c * this.f + t.e, c = t.b * this.e + t.d * this.f + t.f;
    return new b(e, n, i, r, o, c);
  }
  equals(t) {
    return this.a === t.a && this.b === t.b && this.c === t.c && this.d === t.d && this.e === t.e && this.f === t.f;
  }
  inverse() {
    var t = this.a * this.d - this.b * this.c;
    if (t == 0)
      throw new Error("error calculating inverse: zero determinant");
    const e = this.d / t, n = -this.b / t, i = -this.c / t, r = this.a / t, o = (this.c * this.f - this.d * this.e) / t, c = (this.b * this.e - this.a * this.f) / t;
    return new b(e, n, i, r, o, c);
  }
  static translation(t, e) {
    return new b(1, 0, 0, 1, t, e);
  }
  static scale(t) {
    return new b(t, 0, 0, t, 0, 0);
  }
  static zoom(t, e, n, i, r) {
    const o = 1 - n;
    return i !== void 0 ? new b(n, 0, 0, n, t * o + i, e * o + r) : new b(n, 0, 0, n, t * o, e * o);
  }
  static translateZoom(t, e, n, i, r, o, c, u) {
    const l = n - t, f = i - e, d = l * l + f * f;
    if (d === 0)
      throw new Error("divide by 0");
    const m = c - r, w = u - o, C = m * m + w * w, S = Math.sqrt(C / d);
    return b.zoom(t, e, S, r - t, o - e);
  }
  static rotation(t, e, n) {
    const i = Math.cos(n), r = Math.sin(n), o = 1 - i;
    return new b(
      i,
      r,
      -r,
      i,
      t * o + e * r,
      -t * r + e * o
    );
  }
  static translateRotateZoom(t, e, n, i, r, o, c, u) {
    const l = n - t, f = i - e, d = l * l + f * f;
    if (d === 0)
      throw new Error("divide by 0");
    const m = c - r, w = u - o, C = t * i - e * n, S = n * l + i * f, L = t * l + e * f, V = (l * m + f * w) / d, j = (l * w - f * m) / d, Q = -j, Pt = V, Ct = (r * S - c * L - C * w) / d, It = (o * S - u * L + C * m) / d;
    return new b(V, j, Q, Pt, Ct, It);
  }
  static create(t) {
    if (t instanceof b)
      return t;
    const { a: e, b: n, c: i, d: r, e: o, f: c } = t;
    return new b(e, n, i, r, o, c);
  }
  toString() {
    return `x: (${ct(this.a)}, ${ct(this.b)}), y: (${ct(this.c)}, ${ct(this.d)}), d: (${ct(this.e)}, ${ct(this.f)})`;
  }
};
a(b, "identity", new b(1, 0, 0, 1, 0, 0));
let v = b;
class y {
  constructor(t, e) {
    this.propertyName = t, this.noopInstruction = e;
  }
  changeInstanceValue(t, e) {
    return this.valuesAreEqual(t[this.propertyName], e) ? t : t.changeProperty(this.propertyName, e);
  }
  isEqualForInstances(t, e) {
    return this.valuesAreEqual(t[this.propertyName], e[this.propertyName]);
  }
  getInstructionToChange(t, e) {
    return this.valuesAreEqual(t[this.propertyName], e[this.propertyName]) ? this.noopInstruction : this.changeToNewValue(e[this.propertyName]);
  }
  valueIsTransformableForInstance(t) {
    return !0;
  }
}
const x = () => {
};
class pi extends y {
  valuesAreEqual(t, e) {
    return t.equals(e);
  }
  changeToNewValue(t) {
    return (e, n) => {
      const { a: i, b: r, c: o, d: c, e: u, f: l } = n.getTransformationForInstruction(t);
      e.setTransform(i, r, o, c, u, l);
    };
  }
}
const Gt = new pi("transformation", x);
class vi {
  constructor(t) {
    this.viewBox = t;
  }
  getTransform() {
    if (DOMMatrix) {
      const t = this.viewBox.state.current.transformation;
      return new DOMMatrix([
        t.a,
        t.b,
        t.c,
        t.d,
        t.e,
        t.f
      ]);
    }
  }
  resetTransform() {
    this.viewBox.changeState((t) => Gt.changeInstanceValue(t, v.identity));
  }
  rotate(t) {
    this.addTransformation(v.rotation(0, 0, t));
  }
  scale(t, e) {
    this.addTransformation(new v(t, 0, 0, e, 0, 0));
  }
  setTransform(t, e, n, i, r, o) {
    let c, u, l, f, d, m;
    typeof t == "number" ? (c = t, u = e, l = n, f = i, d = r, m = o) : t.a !== void 0 ? (c = t.a, u = t.b, l = t.c, f = t.d, d = t.e, m = t.f) : (c = t.m11, u = t.m12, l = t.m21, f = t.m22, d = t.m41, m = t.m42), this.viewBox.changeState((w) => Gt.changeInstanceValue(w, new v(c, u, l, f, d, m)));
  }
  transform(t, e, n, i, r, o) {
    this.addTransformation(new v(t, e, n, i, r, o));
  }
  translate(t, e) {
    this.addTransformation(v.translation(t, e));
  }
  addTransformation(t) {
    const e = this.viewBox.state.current.transformation, n = t.before(e);
    this.viewBox.changeState((i) => Gt.changeInstanceValue(i, n));
  }
}
class wi extends y {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.globalAlpha = t;
  }
}
const wn = new wi("globalAlpha", x);
class Pi extends y {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.globalCompositeOperation = t;
  }
}
const Pn = new Pi("globalCompositeOperation", x);
class Ci {
  constructor(t) {
    this.viewBox = t;
  }
  get globalAlpha() {
    return this.viewBox.state.current.globalAlpha;
  }
  set globalAlpha(t) {
    this.viewBox.changeState((e) => wn.changeInstanceValue(e, t));
  }
  get globalCompositeOperation() {
    return this.viewBox.state.current.globalCompositeOperation;
  }
  set globalCompositeOperation(t) {
    this.viewBox.changeState((e) => Pn.changeInstanceValue(e, t));
  }
}
class Ii extends y {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.imageSmoothingEnabled = t;
    };
  }
}
const Cn = new Ii("imageSmoothingEnabled", x);
class Ti extends y {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.imageSmoothingQuality = t;
    };
  }
}
const In = new Ti("imageSmoothingQuality", x);
class Si {
  constructor(t) {
    this.viewBox = t;
  }
  get imageSmoothingEnabled() {
    return this.viewBox.state.current.imageSmoothingEnabled;
  }
  set imageSmoothingEnabled(t) {
    this.viewBox.changeState((e) => Cn.changeInstanceValue(e, t));
  }
  get imageSmoothingQuality() {
    return this.viewBox.state.current.imageSmoothingQuality;
  }
  set imageSmoothingQuality(t) {
    this.viewBox.changeState((e) => In.changeInstanceValue(e, t));
  }
}
class Xt {
}
class Tn extends Xt {
  constructor(t) {
    super(), this.fillStrokeStyle = t;
  }
  setTransform(t) {
    this.fillStrokeStyle.setTransform(t);
  }
  getInstructionToSetUntransformed(t) {
    return (e) => {
      e[t] = this.fillStrokeStyle;
    };
  }
  getInstructionToSetTransformed(t) {
    return (e) => {
      e[t] = this.fillStrokeStyle;
    };
  }
}
class Sn {
  constructor(t) {
    this.propName = t;
  }
  changeInstanceValue(t, e) {
    return t.changeProperty(this.propName, e);
  }
  isEqualForInstances(t, e) {
    return t[this.propName] === e[this.propName];
  }
  getInstructionToChange(t, e) {
    const n = e[this.propName];
    return this.isEqualForInstances(t, e) ? !(n instanceof Xt) || t.fillAndStrokeStylesTransformed === e.fillAndStrokeStylesTransformed ? () => {
    } : e.fillAndStrokeStylesTransformed ? n.getInstructionToSetTransformed(this.propName) : n.getInstructionToSetUntransformed(this.propName) : n instanceof Xt ? e.fillAndStrokeStylesTransformed ? n.getInstructionToSetTransformed(this.propName) : n.getInstructionToSetUntransformed(this.propName) : (i) => {
      i[this.propName] = e[this.propName];
    };
  }
  valueIsTransformableForInstance(t) {
    return !(t[this.propName] instanceof Tn);
  }
}
const yn = new Sn("fillStyle"), xn = new Sn("strokeStyle");
class yi {
  constructor(t) {
    this.viewBox = t;
  }
  set fillStyle(t) {
    this.viewBox.changeState((e) => yn.changeInstanceValue(e, t));
  }
  set strokeStyle(t) {
    this.viewBox.changeState((e) => xn.changeInstanceValue(e, t));
  }
  createLinearGradient(t, e, n, i) {
    return this.viewBox.createLinearGradient(t, e, n, i);
  }
  createPattern(t, e) {
    return this.viewBox.createPattern(t, e);
  }
  createRadialGradient(t, e, n, i, r, o) {
    return this.viewBox.createRadialGradient(t, e, n, i, r, o);
  }
  createConicGradient(t, e, n) {
    return this.viewBox.createConicGradient(t, e, n);
  }
}
class xi extends y {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.shadowColor = t;
    };
  }
}
const bn = new xi("shadowColor", x);
class bi extends y {
  changeToNewValue(t) {
    return (e, n) => {
      const i = v.translation(t.x, t.y), r = n.translateInfiniteCanvasContextTransformationToBitmapTransformation(i), { x: o, y: c } = r.apply(h.origin);
      e.shadowOffsetX = o, e.shadowOffsetY = c;
    };
  }
  valuesAreEqual(t, e) {
    return t.x === e.x && t.y == e.y;
  }
}
const Ce = new bi("shadowOffset", x);
class Oi extends y {
  changeToNewValue(t) {
    return (e, n) => {
      const i = v.translation(t, 0), o = n.translateInfiniteCanvasContextTransformationToBitmapTransformation(i).apply(h.origin).mod();
      e.shadowBlur = o;
    };
  }
  valuesAreEqual(t, e) {
    return t === e;
  }
}
const On = new Oi("shadowBlur", x);
class Li {
  constructor(t) {
    this.viewBox = t;
  }
  get shadowBlur() {
    return this.viewBox.state.current.shadowBlur;
  }
  set shadowBlur(t) {
    this.viewBox.changeState((e) => On.changeInstanceValue(e, t));
  }
  get shadowOffsetX() {
    return this.viewBox.state.current.shadowOffset.x;
  }
  set shadowOffsetX(t) {
    const e = new h(t, this.viewBox.state.current.shadowOffset.y);
    this.viewBox.changeState((n) => Ce.changeInstanceValue(n, e));
  }
  get shadowOffsetY() {
    return this.viewBox.state.current.shadowOffset.y;
  }
  set shadowOffsetY(t) {
    const e = new h(this.viewBox.state.current.shadowOffset.x, t);
    this.viewBox.changeState((n) => Ce.changeInstanceValue(n, e));
  }
  get shadowColor() {
    return this.viewBox.state.current.shadowColor;
  }
  set shadowColor(t) {
    this.viewBox.changeState((e) => bn.changeInstanceValue(e, t));
  }
}
const Ln = "[+-]?(?:\\d*\\.)?\\d+(?:e[+-]?\\d+)?", Bn = "[+-]?(?:0*\\.)?0+(?:e[+-]?\\d+)?", An = "(?:ch|em|ex|ic|rem|vh|vw|vmax|vmin|vb|vi|cqw|cqh|cqi|cqb|cqmin|cqmax|px|cm|mm|Q|in|pc|pt)", Yt = `(?:${Bn}|${Ln}${An})`, Dn = `blur\\((${Yt})\\)`, _e = "[^())\\s]+(?:\\([^)]*?\\))?", En = `drop-shadow\\((${Yt})\\s+(${Yt})\\s*?(?:(?:(${Yt})\\s*?(${_e})?)|(${_e}))?\\)`, tn = `${Dn}|${En}`;
function W(s, t) {
  const e = s.match(new RegExp(`(?:(${Bn})|(${Ln})(${An}))`));
  return e[1] ? 0 : t.getNumberOfPixels(Number.parseFloat(e[2]), e[3]);
}
class en {
  constructor(t) {
    this.stringRepresentation = t;
  }
  toTransformedString() {
    return this.stringRepresentation;
  }
  getShadowOffset() {
    return null;
  }
}
class Oe {
  constructor(t, e) {
    this.stringRepresentation = t, this.size = e;
  }
  toTransformedString(t) {
    return `blur(${t.translateInfiniteCanvasContextTransformationToBitmapTransformation(v.translation(this.size, 0)).apply(h.origin).mod()}px)`;
  }
  getShadowOffset() {
    return null;
  }
  static tryCreate(t, e) {
    const n = t.match(new RegExp(Dn));
    return n === null ? null : new Oe(t, W(n[1], e));
  }
}
class lt {
  constructor(t, e, n, i, r) {
    this.stringRepresentation = t, this.offsetX = e, this.offsetY = n, this.blurRadius = i, this.color = r;
  }
  toTransformedString(t) {
    const e = t.translateInfiniteCanvasContextTransformationToBitmapTransformation(v.translation(this.offsetX, this.offsetY)), { x: n, y: i } = e.apply(h.origin);
    if (this.blurRadius !== null) {
      const o = t.translateInfiniteCanvasContextTransformationToBitmapTransformation(v.translation(this.blurRadius, 0)).apply(h.origin).mod();
      return this.color ? `drop-shadow(${n}px ${i}px ${o}px ${this.color})` : `drop-shadow(${n}px ${i}px ${o}px)`;
    }
    return this.color ? `drop-shadow(${n}px ${i}px ${this.color})` : `drop-shadow(${n}px ${i}px)`;
  }
  getShadowOffset() {
    return new h(this.offsetX, this.offsetY);
  }
  static tryCreate(t, e) {
    const n = t.match(new RegExp(En));
    return n === null ? null : n[5] ? new lt(
      t,
      W(n[1], e),
      W(n[2], e),
      null,
      n[5]
    ) : n[4] ? new lt(
      t,
      W(n[1], e),
      W(n[2], e),
      W(n[3], e),
      n[4]
    ) : n[3] ? new lt(
      t,
      W(n[1], e),
      W(n[2], e),
      W(n[3], e),
      null
    ) : new lt(
      t,
      W(n[1], e),
      W(n[2], e),
      null,
      null
    );
  }
}
const yt = class yt {
  constructor(t, e) {
    this.stringRepresentation = t, this.parts = e;
  }
  toString() {
    return this.parts.map((t) => t.stringRepresentation).join(" ");
  }
  toTransformedString(t) {
    return this.parts.map((e) => e.toTransformedString(t)).join(" ");
  }
  getShadowOffset() {
    for (const t of this.parts) {
      const e = t.getShadowOffset();
      if (e !== null)
        return e;
    }
    return null;
  }
  static create(t, e) {
    const i = t.match(new RegExp(`${tn}|((?!\\s|${tn}).)+`, "g")).map((r) => this.createPart(r, e));
    return new yt(t, i);
  }
  static createPart(t, e) {
    let n = Oe.tryCreate(t, e);
    return n !== null || (n = lt.tryCreate(t, e), n != null) ? n : new en(t);
  }
};
a(yt, "none", new yt("none", [new en("none")]));
let Ut = yt;
class Bi extends y {
  valuesAreEqual(t, e) {
    return t.stringRepresentation === e.stringRepresentation;
  }
  changeToNewValue(t) {
    return (e, n) => e.filter = t.toTransformedString(n);
  }
}
const Rn = new Bi("filter", x);
class Ai {
  constructor(t, e) {
    this.viewBox = t, this.cssLengthConverterFactory = e;
  }
  get filter() {
    return this.viewBox.state.current.filter.stringRepresentation;
  }
  set filter(t) {
    const e = Ut.create(t, this.cssLengthConverterFactory.create());
    this.viewBox.changeState((n) => Rn.changeInstanceValue(n, e));
  }
}
class Di {
  constructor(t) {
    this.viewBox = t;
  }
  clearRect(t, e, n, i) {
    this.viewBox.clearArea(t, e, n, i);
  }
  fillRect(t, e, n, i) {
    let r = (o) => o.fill();
    this.viewBox.fillRect(t, e, n, i, r);
  }
  strokeRect(t, e, n, i) {
    this.viewBox.strokeRect(t, e, n, i);
  }
}
class Ei {
  constructor(t) {
    this.viewBox = t;
  }
  isFillRule(t) {
    return t === "evenodd" || t === "nonzero";
  }
  beginPath() {
    this.viewBox.beginPath();
  }
  clip(t, e) {
    let n = this.isFillRule(t) ? (i) => {
      i.clip(t);
    } : (i) => {
      i.clip();
    };
    this.viewBox.clipPath(n);
  }
  fill(t, e) {
    if ((!t || this.isFillRule(t)) && !this.viewBox.currentPathCanBeFilled())
      return;
    let n = this.isFillRule(t) ? (i) => {
      i.fill(t);
    } : (i) => {
      i.fill();
    };
    this.viewBox.fillPath(n);
  }
  isPointInPath(t, e, n, i) {
    return !0;
  }
  isPointInStroke(t, e, n) {
    return !0;
  }
  stroke(t) {
    this.viewBox.strokePath();
  }
}
class Ri {
  drawFocusIfNeeded(t, e) {
  }
  scrollPathIntoView(t) {
  }
}
var z = /* @__PURE__ */ ((s) => (s[s.None = 0] = "None", s[s.Relative = 1] = "Relative", s[s.Absolute = 2] = "Absolute", s))(z || {}), T = /* @__PURE__ */ ((s) => (s[s.Positive = 0] = "Positive", s[s.Negative = 1] = "Negative", s))(T || {});
const $t = { direction: new h(0, 1) }, Kt = { direction: new h(0, -1) }, jt = { direction: new h(-1, 0) }, Qt = { direction: new h(1, 0) };
function Fi(s, t, e, n) {
  const i = e.minus(s), r = n.cross(t), o = n.getPerpendicular().dot(i) / r;
  return s.plus(t.scale(o));
}
class st {
  constructor(t, e, n) {
    a(this, "leftNormal");
    a(this, "rightNormal");
    this.point = t, this.leftHalfPlane = e, this.rightHalfPlane = n, this.leftNormal = e.normalTowardInterior, this.rightNormal = n.normalTowardInterior;
  }
  replaceLeftHalfPlane(t) {
    return new st(this.point, t, this.rightHalfPlane);
  }
  replaceRightHalfPlane(t) {
    return new st(this.point, this.leftHalfPlane, t);
  }
  isContainedByHalfPlaneWithNormal(t) {
    return t.isInSmallerAngleBetweenPoints(this.leftNormal, this.rightNormal);
  }
  containsPoint(t) {
    return this.leftHalfPlane.containsPoint(t) && this.rightHalfPlane.containsPoint(t);
  }
  containsLineSegmentWithDirection(t) {
    return this.containsPoint(this.point.plus(t)) || this.containsPoint(this.point.minus(t));
  }
  isContainedByVertex(t) {
    return this.isContainedByHalfPlaneWithNormal(t.leftNormal) && this.isContainedByHalfPlaneWithNormal(t.rightNormal);
  }
  getContainingHalfPlaneThroughPoint(t) {
    let e = t.minus(this.point).getPerpendicular();
    if (e.cross(this.leftHalfPlane.normalTowardInterior) === 0)
      return this.leftHalfPlane;
    if (e.cross(this.rightHalfPlane.normalTowardInterior) === 0)
      return this.rightHalfPlane;
    const n = this.leftNormal.plus(this.rightNormal);
    return e.dot(n) <= 0 && (e = e.scale(-1)), new P(t, e);
  }
  static create(t, e, n) {
    return e.normalTowardInterior.cross(n.normalTowardInterior) >= 0 ? new st(t, e, n) : new st(t, n, e);
  }
}
class P {
  constructor(t, e) {
    a(this, "lengthOfNormal");
    this.base = t, this.normalTowardInterior = e, this.lengthOfNormal = e.mod();
  }
  getDistanceFromEdge(t) {
    return t.minus(this.base).dot(this.normalTowardInterior) / this.lengthOfNormal;
  }
  transform(t) {
    const e = t.apply(this.base), n = t.apply(this.base.plus(this.normalTowardInterior.getPerpendicular())), i = t.apply(this.base.plus(this.normalTowardInterior));
    return P.throughPointsAndContainingPoint(e, n, i);
  }
  complement() {
    return new P(this.base, this.normalTowardInterior.scale(-1));
  }
  expandByDistance(t) {
    const e = this.base.plus(this.normalTowardInterior.scale(-t / this.normalTowardInterior.mod()));
    return new P(e, this.normalTowardInterior);
  }
  expandToIncludePoint(t) {
    return this.containsPoint(t) ? this : new P(t, this.normalTowardInterior);
  }
  containsPoint(t) {
    return this.getDistanceFromEdge(t) >= 0;
  }
  interiorContainsPoint(t) {
    return this.getDistanceFromEdge(t) > 0;
  }
  containsInfinityInDirection(t) {
    return t.dot(this.normalTowardInterior) >= 0;
  }
  isContainedByHalfPlane(t) {
    return this.normalTowardInterior.inSameDirectionAs(t.normalTowardInterior) && t.getDistanceFromEdge(this.base) >= 0;
  }
  intersectWithLine(t, e) {
    return {
      point: Fi(this.base, this.normalTowardInterior.getPerpendicular(), t, e),
      halfPlane: this
    };
  }
  isParallelToLine(t, e) {
    return this.normalTowardInterior.getPerpendicular().cross(e) === 0;
  }
  getIntersectionWith(t) {
    const e = this.intersectWithLine(t.base, t.normalTowardInterior.getPerpendicular());
    return st.create(e.point, this, t);
  }
  static throughPointsAndContainingPoint(t, e, n) {
    const i = P.withBorderPoints(t, e);
    for (let r of i)
      if (r.containsPoint(n))
        return r;
  }
  static withBorderPointAndInfinityInDirection(t, e) {
    return P.withBorderPoints(t, t.plus(e));
  }
  static withBorderPoints(t, e) {
    const n = e.minus(t).getPerpendicular();
    return [
      new P(t, n),
      new P(t, n.scale(-1))
    ];
  }
}
class Wi {
  getVertices() {
    return [];
  }
  expandToIncludePoint(t) {
    return this;
  }
  expandToIncludePolygon(t) {
    return this;
  }
  expandToIncludeInfinityInDirection(t) {
    return this;
  }
  expandByDistance(t) {
    return this;
  }
  intersects(t) {
    return !0;
  }
  expandToInclude(t) {
    return this;
  }
  transform(t) {
    return this;
  }
  intersectWithLineSegment(t) {
    return t;
  }
  contains(t) {
    return !0;
  }
  intersectWith(t) {
    return t;
  }
  join(t) {
    return this;
  }
  intersectWithRay(t) {
    return t;
  }
  intersectWithLine(t) {
    return t;
  }
  intersectWithConvexPolygon(t) {
    return t;
  }
  isContainedByRay(t) {
    return !1;
  }
  isContainedByLineSegment(t) {
    return !1;
  }
  isContainedByLine(t) {
    return !1;
  }
  isContainedByConvexPolygon(t) {
    return !1;
  }
  intersectsRay(t) {
    return !0;
  }
  intersectsLineSegment(t) {
    return !0;
  }
  intersectsLine(t) {
    return !0;
  }
  intersectsConvexPolygon(t) {
    return !0;
  }
}
const pt = new Wi();
class ki {
  getVertices() {
    return [];
  }
  intersectWith(t) {
    return this;
  }
  join(t) {
    return t;
  }
  intersectWithConvexPolygon(t) {
    return this;
  }
  intersects(t) {
    return !1;
  }
  intersectWithLineSegment(t) {
    return this;
  }
  intersectWithRay(t) {
    return this;
  }
  intersectWithLine(t) {
    return this;
  }
  expandToInclude(t) {
    return t;
  }
  transform(t) {
    return this;
  }
  contains(t) {
    return !1;
  }
  isContainedByConvexPolygon(t) {
    return !0;
  }
  isContainedByRay(t) {
    return !0;
  }
  isContainedByLineSegment(t) {
    return !0;
  }
  isContainedByLine(t) {
    return !0;
  }
  intersectsRay(t) {
    return !1;
  }
  intersectsConvexPolygon(t) {
    return !1;
  }
  intersectsLineSegment(t) {
    return !1;
  }
  intersectsLine(t) {
    return !1;
  }
  expandByDistance(t) {
    return this;
  }
  expandToIncludePoint(t) {
    return this;
  }
  expandToIncludeInfinityInDirection(t) {
    return this;
  }
  expandToIncludePolygon(t) {
    return t;
  }
}
const A = new ki();
class p {
  constructor(t, e) {
    a(this, "halfPlanes");
    this.vertices = e, this.halfPlanes = t, this.vertices = this.vertices || p.getVertices(this.halfPlanes);
  }
  findVertex(t) {
    for (let e of this.vertices)
      if (e.point.equals(t))
        return e;
  }
  intersects(t) {
    return t.intersectsConvexPolygon(this);
  }
  intersectWith(t) {
    return t.intersectWithConvexPolygon(this);
  }
  join(t) {
    if (this.contains(t))
      return this;
    if (t.contains(this))
      return t;
    let e = t;
    for (let n of this.vertices)
      e = e.expandToIncludePoint(n.point);
    for (let n of this.getPointsAtInfinityFromHalfPlanes())
      this.containsInfinityInDirection(n) && (e = e.expandToIncludeInfinityInDirection(n));
    return e;
  }
  intersectWithRay(t) {
    return t.intersectWithConvexPolygon(this);
  }
  intersectWithLine(t) {
    return t.intersectWithConvexPolygon(this);
  }
  intersectWithLineSegment(t) {
    return t.intersectWithConvexPolygon(this);
  }
  contains(t) {
    return t.isContainedByConvexPolygon(this);
  }
  containsHalfPlane(t) {
    for (let e of this.halfPlanes)
      if (!t.isContainedByHalfPlane(e))
        return !1;
    return !0;
  }
  isContainedByHalfPlane(t) {
    for (let n of this.vertices)
      if (!t.containsPoint(n.point))
        return !1;
    const e = t.complement();
    for (let n of this.halfPlanes)
      if (n.isContainedByHalfPlane(t))
        return !0;
    for (let n of this.halfPlanes) {
      const i = this.getVerticesOnHalfPlane(n);
      if (i.length <= 1 && (n.isContainedByHalfPlane(e) || e.isContainedByHalfPlane(n)))
        return !1;
      const r = n.getIntersectionWith(t), o = i.find((c) => c.point.equals(r.point));
      if (o) {
        if (!o.isContainedByHalfPlaneWithNormal(t.normalTowardInterior))
          return !1;
      } else {
        if (i.length === 0)
          return !1;
        if (this.containsPoint(r.point))
          return !1;
      }
    }
    return !this.containsHalfPlane(t);
  }
  getVertices() {
    return this.vertices.map((t) => t.point);
  }
  expandToIncludePoint(t) {
    if (this.vertices.length === 0) {
      const f = this.halfPlanes.map((d) => d.expandToIncludePoint(t));
      return new p(f);
    }
    const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
    let i = null, r = null;
    const o = [], c = /* @__PURE__ */ new Set();
    for (const f of this.vertices) {
      const d = f.leftHalfPlane;
      n.has(d) ? n.delete(d) : e.add(d);
      const m = f.rightHalfPlane;
      if (e.has(m) ? e.delete(m) : n.add(m), d.containsPoint(t)) {
        if (c.add(d), m.containsPoint(t)) {
          c.add(m), o.push(f);
          continue;
        }
        i = f;
        continue;
      }
      m.containsPoint(t) && (c.add(m), r = f);
    }
    if (o.length === this.vertices.length)
      return this;
    let u, l;
    if (i === null) {
      const f = [...e][0];
      if (!f)
        return this;
      u = f.expandToIncludePoint(t);
    } else
      u = i.getContainingHalfPlaneThroughPoint(t), u !== i.leftHalfPlane && o.push(i.replaceRightHalfPlane(u));
    if (r === null) {
      const f = [...n][0];
      if (!f)
        return this;
      l = f.expandToIncludePoint(t);
    } else
      l = r.getContainingHalfPlaneThroughPoint(t), l !== r.rightHalfPlane && o.push(r.replaceLeftHalfPlane(l));
    return c.add(u), c.add(l), o.push(new st(t, u, l)), new p([...c], o);
  }
  expandToIncludeInfinityInDirection(t) {
    if (this.containsInfinityInDirection(t))
      return this;
    let e = this.halfPlanes.filter((n) => n.containsInfinityInDirection(t)).concat(this.getTangentPlanesThroughInfinityInDirection(t));
    return e = p.getHalfPlanesNotContainingAnyOther(e), e.length === 0 ? pt : new p(e);
  }
  getIntersectionsWithLine(t, e) {
    const n = [];
    for (let i of this.halfPlanes) {
      if (i.isParallelToLine(t, e))
        continue;
      const r = i.intersectWithLine(t, e), o = this.findVertex(r.point);
      o && !o.containsLineSegmentWithDirection(e) || this.containsPoint(r.point) && n.push(r);
    }
    return n;
  }
  expandByDistance(t) {
    return new p(this.halfPlanes.map((e) => e.expandByDistance(t)));
  }
  transform(t) {
    return new p(this.halfPlanes.map((e) => e.transform(t)));
  }
  intersectWithConvexPolygon(t) {
    if (t.isContainedByConvexPolygon(this))
      return t;
    if (this.isContainedByConvexPolygon(t))
      return this;
    if (this.isOutsideConvexPolygon(t))
      return A;
    const e = p.getHalfPlanesNotContainingAnyOther(this.halfPlanes.concat(t.halfPlanes)), r = p.groupVerticesByPoint(p.getVertices(e)).map((c) => p.getVerticesNotContainingAnyOther(c)).reduce((c, u) => c.concat(u), []);
    if (r.length === 0)
      return new p(e);
    const o = p.getHalfPlanes(r);
    return new p(o);
  }
  containsInfinityInDirection(t) {
    for (let e of this.halfPlanes)
      if (!e.containsInfinityInDirection(t))
        return !1;
    return !0;
  }
  containsPoint(t) {
    for (let e of this.halfPlanes)
      if (!e.containsPoint(t))
        return !1;
    return !0;
  }
  intersectsRay(t) {
    return t.intersectsConvexPolygon(this);
  }
  intersectsLineSegment(t) {
    return t.intersectsConvexPolygon(this);
  }
  intersectsLine(t) {
    return t.intersectsConvexPolygon(this);
  }
  intersectsConvexPolygon(t) {
    return this.isContainedByConvexPolygon(t) || t.isContainedByConvexPolygon(this) ? !0 : !this.isOutsideConvexPolygon(t);
  }
  isOutsideConvexPolygon(t) {
    for (let e of t.halfPlanes)
      if (this.isContainedByHalfPlane(e.complement()))
        return !0;
    for (let e of this.halfPlanes)
      if (t.isContainedByHalfPlane(e.complement()))
        return !0;
    return !1;
  }
  getVerticesOnHalfPlane(t) {
    const e = [];
    for (let n of this.vertices)
      (n.leftHalfPlane === t || n.rightHalfPlane === t) && e.push(n);
    return e;
  }
  hasAtMostOneVertex(t) {
    let e = 0;
    for (let n of this.vertices)
      if ((n.leftHalfPlane === t || n.rightHalfPlane === t) && (e++, e > 1))
        return !1;
    return !0;
  }
  getTangentPlanesThroughInfinityInDirection(t) {
    const e = [];
    for (let n of this.vertices) {
      const i = P.withBorderPointAndInfinityInDirection(n.point, t);
      for (let r of i)
        this.isContainedByHalfPlane(r) && e.push(r);
    }
    return e;
  }
  getPointsAtInfinityFromHalfPlanes() {
    const t = [];
    for (let e of this.halfPlanes) {
      const n = e.normalTowardInterior, i = n.getPerpendicular();
      t.push(n), t.push(i), t.push(i.scale(-1));
    }
    return t;
  }
  isContainedByRay(t) {
    return !1;
  }
  isContainedByLineSegment(t) {
    return !1;
  }
  isContainedByLine(t) {
    return !1;
  }
  isContainedByConvexPolygon(t) {
    for (let e of t.halfPlanes)
      if (!this.isContainedByHalfPlane(e))
        return !1;
    return !0;
  }
  static getHalfPlanes(t) {
    const e = [];
    for (let n of t)
      e.indexOf(n.leftHalfPlane) === -1 && e.push(n.leftHalfPlane), e.indexOf(n.rightHalfPlane) === -1 && e.push(n.rightHalfPlane);
    return e;
  }
  static getVerticesNotContainingAnyOther(t) {
    const e = [];
    for (let n = 0; n < t.length; n++) {
      let i = !0;
      for (let r = 0; r < t.length; r++)
        if (n !== r && t[r].isContainedByVertex(t[n])) {
          i = !1;
          break;
        }
      i && e.push(t[n]);
    }
    return e;
  }
  static getHalfPlanesNotContainingAnyOther(t) {
    const e = [];
    for (let n of t) {
      let i = !0;
      for (let r of e)
        if (r.isContainedByHalfPlane(n)) {
          i = !1;
          break;
        }
      i && e.push(n);
    }
    return e;
  }
  static groupVerticesByPoint(t) {
    const e = [];
    for (let n of t) {
      let i;
      for (let r of e)
        if (r[0].point.equals(n.point)) {
          i = r;
          break;
        }
      i ? i.push(n) : e.push([n]);
    }
    return e;
  }
  static getVertices(t) {
    const e = [];
    for (let n = 0; n < t.length; n++)
      for (let i = n + 1; i < t.length; i++) {
        const r = t[n], o = t[i];
        if (r.complement().isContainedByHalfPlane(o))
          continue;
        const c = r.getIntersectionWith(o);
        let u = !0;
        for (let l = 0; l < t.length; l++) {
          if (l === n || l === i)
            continue;
          if (!t[l].containsPoint(c.point)) {
            u = !1;
            break;
          }
        }
        u && e.push(c);
      }
    return e;
  }
  static createTriangleWithInfinityInTwoDirections(t, e, n) {
    const i = e.getPerpendicular(), r = n.getPerpendicular();
    return e.cross(n) < 0 ? new p([
      new P(t, i.scale(-1)),
      new P(t, r)
    ]) : new p([
      new P(t, i),
      new P(t, r.scale(-1))
    ]);
  }
  static createFromHalfPlane(t) {
    return new p([t]);
  }
  static createTriangleWithInfinityInDirection(t, e, n) {
    const i = e.minus(t).projectOn(n.getPerpendicular());
    return new p([
      new P(t, i),
      new P(e, i.scale(-1)),
      P.throughPointsAndContainingPoint(t, e, t.plus(n))
    ]);
  }
  static createTriangle(t, e, n) {
    return new p([
      P.throughPointsAndContainingPoint(t, e, n),
      P.throughPointsAndContainingPoint(t, n, e),
      P.throughPointsAndContainingPoint(e, n, t)
    ]);
  }
}
function $(...s) {
  return (...t) => {
    for (const e of s)
      e && e(...t);
  };
}
function Hi(s, t) {
  return t ? (e, n) => {
    e.save(), t(e, n), s(e, n), e.restore();
  } : s;
}
function Vi(s) {
  return s === z.Relative ? (t, e) => {
    const { a: n, b: i, c: r, d: o, e: c, f: u } = e.getBitmapTransformationToTransformedInfiniteCanvasContext();
    t.transform(n, i, r, o, c, u);
  } : s === z.Absolute ? (t, e) => {
    const { a: n, b: i, c: r, d: o, e: c, f: u } = e.getBitmapTransformationToInfiniteCanvasContext();
    t.setTransform(n, i, r, o, c, u);
  } : null;
}
function Mi(s, t) {
  let e = s.area;
  return e && t.lineWidth > 0 && (e = e.expandByDistance(t.lineWidth / 2)), e;
}
function Ni(s) {
  return {
    lineWidth: s.current.getMaximumLineWidth(),
    lineDashPeriod: s.current.getLineDashPeriod(),
    shadowOffsets: s.current.getShadowOffsets()
  };
}
function zi(s) {
  return {
    lineWidth: 0,
    lineDashPeriod: 0,
    shadowOffsets: s.current.getShadowOffsets()
  };
}
class M {
  constructor(t, e, n, i, r, o, c) {
    this.instruction = t, this.area = e, this.build = n, this.takeClippingRegionIntoAccount = i, this.transformationKind = r, this.state = o, this.tempState = c;
  }
  static forStrokingPath(t, e, n) {
    return M.forPath(t, e, Ni, n);
  }
  static forFillingPath(t, e, n) {
    return M.forPath(t, e, zi, n);
  }
  static forPath(t, e, n, i) {
    const r = e.current.isTransformable(), o = r ? z.None : z.Relative, c = e.currentlyTransformed(r), u = n(c), l = i(c), f = Mi(l, u);
    return new M(
      t,
      f,
      (d) => l.drawPath(d, c, u),
      !0,
      o,
      c
    );
  }
  getDrawnArea() {
    let t = this.area;
    const e = this.state;
    if (e.current.shadowBlur !== 0 || !e.current.shadowOffset.equals(h.origin)) {
      const n = t.expandByDistance(e.current.shadowBlur).transform(v.translation(e.current.shadowOffset.x, e.current.shadowOffset.y));
      t = t.join(n);
    }
    return e.current.clippingRegion && this.takeClippingRegionIntoAccount && (t = t.intersectWith(e.current.clippingRegion)), t;
  }
  getModifiedInstruction() {
    let t = Vi(this.transformationKind);
    if (this.tempState) {
      const n = this.takeClippingRegionIntoAccount ? this.state.getInstructionToConvertToStateWithClippedPath(this.tempState) : this.state.getInstructionToConvertToState(this.tempState);
      t = $(t, n);
    }
    return Hi(this.instruction, t);
  }
}
class Le {
  constructor(t) {
    a(this, "added", []);
    a(this, "addedLast");
    this.initiallyWithState = t;
  }
  get length() {
    return this.added.length;
  }
  get currentlyWithState() {
    return this.addedLast ? this.addedLast : this.initiallyWithState;
  }
  reconstructState(t, e) {
    e.setInitialState(t);
  }
  get stateOfFirstInstruction() {
    return this.initiallyWithState.stateOfFirstInstruction;
  }
  get state() {
    return this.currentlyWithState.state;
  }
  get initialState() {
    return this.initiallyWithState.initialState;
  }
  addClippedPath(t) {
    this.currentlyWithState.addClippedPath(t);
  }
  add(t) {
    this.added.push(t), this.addedLast = t;
  }
  removeAll(t) {
    let e;
    for (; (e = this.added.findIndex(t)) > -1; )
      this.removeAtIndex(e);
  }
  contains(t) {
    return !!this.added.find(t);
  }
  setInitialState(t) {
    this.initiallyWithState.setInitialState(t);
  }
  setInitialStateWithClippedPaths(t) {
    this.initiallyWithState.setInitialStateWithClippedPaths(t);
  }
  beforeIndex(t) {
    return t === 0 ? this.initiallyWithState.state : this.added[t - 1].state;
  }
  removeAtIndex(t) {
    t === this.added.length - 1 ? this.added.length === 1 ? this.addedLast = void 0 : this.addedLast = this.added[t - 1] : this.reconstructState(this.beforeIndex(t), this.added[t + 1]), this.added.splice(t, 1);
  }
}
class Be {
  constructor(t, e) {
    a(this, "stateConversion");
    this.initialState = t, this.state = e, this.stateConversion = () => {
    };
  }
  setInitialState(t) {
    this.initialState = t;
    const e = this.initialState.getInstructionToConvertToState(this.state);
    this.stateConversion = e;
  }
  get stateOfFirstInstruction() {
    return this.state;
  }
  addClippedPath(t) {
    this.state = this.state.withClippedPath(t);
  }
  setInitialStateWithClippedPaths(t) {
    this.initialState = t;
    const e = this.initialState.getInstructionToConvertToStateWithClippedPath(this.state);
    this.stateConversion = e;
  }
}
class K extends Be {
  constructor(t, e, n, i) {
    super(t, e), this.instruction = n, this.stateConversion = i;
  }
  execute(t, e) {
    this.stateConversion && this.stateConversion(t, e), this.instruction(t, e);
  }
  static create(t, e) {
    return new K(t, t, e, () => {
    });
  }
}
class mt extends Be {
  constructor(t, e, n, i) {
    super(t, e), this.instruction = n, this.stateConversion = i;
  }
  makeExecutable() {
    return new K(this.initialState, this.state, this.instruction, this.stateConversion);
  }
  static create(t, e) {
    return new mt(t, t, e, () => {
    });
  }
}
function I(s) {
  return s.direction !== void 0;
}
function _(s, t) {
  return I(s) ? t.applyToPointAtInfinity(s) : t.apply(s);
}
class qi {
  constructor(t, e) {
    this.areaBuilder = t, this.transformation = e;
  }
  addPosition(t) {
    this.areaBuilder.addPosition(_(t, this.transformation));
  }
}
class Ae {
  constructor(t, e) {
    this.base = t, this.direction = e;
  }
  pointIsOnSameLine(t) {
    return t.minus(this.base).cross(this.direction) === 0;
  }
  comesBefore(t, e) {
    return e.minus(t).dot(this.direction) >= 0;
  }
  lineSegmentIsOnSameLine(t) {
    return this.direction.cross(t.direction) === 0 && this.pointIsOnSameLine(t.point1);
  }
  expandLineByDistance(t) {
    const e = this.direction.getPerpendicular(), n = new P(this.base, e).expandByDistance(t), i = new P(this.base, e.scale(-1)).expandByDistance(t);
    return new p([n, i]);
  }
  getPointsInSameDirection(t, e) {
    return this.comesBefore(e, t) ? { point1: e, point2: t } : { point1: t, point2: e };
  }
  pointIsBetweenPoints(t, e, n) {
    return t.minus(e).dot(this.direction) * t.minus(n).dot(this.direction) <= 0;
  }
  intersectsConvexPolygon(t) {
    if (this.isContainedByConvexPolygon(t))
      return !0;
    const e = t.getIntersectionsWithLine(this.base, this.direction);
    for (let n of e)
      if (this.interiorContainsPoint(n.point))
        return !0;
    return !1;
  }
}
class ae extends Ae {
  getVertices() {
    return [];
  }
  intersectWith(t) {
    return t.intersectWithLine(this);
  }
  join(t) {
    return t.expandToIncludeInfinityInDirection(this.direction).expandToIncludeInfinityInDirection(this.direction.scale(-1));
  }
  intersectWithConvexPolygon(t) {
    if (!this.intersectsConvexPolygon(t))
      return A;
    if (this.isContainedByConvexPolygon(t))
      return this;
    const e = t.getIntersectionsWithLine(this.base, this.direction);
    let n, i;
    for (let r of e)
      (!n && !i || !n && this.comesBefore(r.point, i) || !i && this.comesBefore(n, r.point) || n && i && this.pointIsBetweenPoints(r.point, n, i)) && (r.halfPlane.normalTowardInterior.dot(this.direction) > 0 ? n = r.point : i = r.point);
    return n && i ? new E(n, i) : n ? new N(n, this.direction) : new N(i, this.direction.scale(-1));
  }
  intersectWithLine(t) {
    return this.intersectsLine(t) ? this : A;
  }
  intersectWithLineSegment(t) {
    return this.lineSegmentIsOnSameLine(t) ? t : A;
  }
  intersectWithRay(t) {
    return this.intersectsRay(t) ? t : A;
  }
  isContainedByConvexPolygon(t) {
    return t.containsPoint(this.base) && t.containsInfinityInDirection(this.direction) && t.containsInfinityInDirection(this.direction.scale(-1));
  }
  isContainedByLine(t) {
    return this.intersectsSubsetOfLine(t);
  }
  isContainedByLineSegment(t) {
    return !1;
  }
  isContainedByRay(t) {
    return !1;
  }
  contains(t) {
    return t.isContainedByLine(this);
  }
  intersectsLine(t) {
    return this.intersectsSubsetOfLine(t);
  }
  intersectsSubsetOfLine(t) {
    return this.pointIsOnSameLine(t.base) && this.direction.cross(t.direction) === 0;
  }
  intersectsLineSegment(t) {
    return this.lineSegmentIsOnSameLine(t);
  }
  intersectsRay(t) {
    return this.intersectsSubsetOfLine(t);
  }
  intersects(t) {
    return t.intersectsLine(this);
  }
  expandToIncludePoint(t) {
    return this.pointIsOnSameLine(t) ? this : p.createTriangleWithInfinityInDirection(this.base, t, this.direction).expandToIncludeInfinityInDirection(this.direction.scale(-1));
  }
  expandByDistance(t) {
    return this.expandLineByDistance(t);
  }
  expandToIncludeInfinityInDirection(t) {
    const e = t.cross(this.direction), n = this.direction.getPerpendicular();
    return e === 0 ? this : e > 0 ? p.createFromHalfPlane(new P(this.base, n.scale(-1))) : p.createFromHalfPlane(new P(this.base, n));
  }
  transform(t) {
    const e = t.apply(this.base);
    return new ae(e, t.apply(this.base.plus(this.direction)).minus(e));
  }
  interiorContainsPoint(t) {
    return this.pointIsOnSameLine(t);
  }
}
class N extends Ae {
  getVertices() {
    return [this.base];
  }
  intersectWith(t) {
    return t.intersectWithRay(this);
  }
  join(t) {
    return t.expandToIncludePoint(this.base).expandToIncludeInfinityInDirection(this.direction);
  }
  intersectWithConvexPolygon(t) {
    if (!this.intersectsConvexPolygon(t))
      return A;
    if (this.isContainedByConvexPolygon(t))
      return this;
    const e = t.getIntersectionsWithLine(this.base, this.direction);
    let n = this.base, i;
    for (let r of e)
      (!i && this.comesBefore(n, r.point) || i && this.pointIsBetweenPoints(r.point, n, i)) && (r.halfPlane.normalTowardInterior.dot(this.direction) > 0 ? n = r.point : i = r.point);
    return i ? new E(n, i) : new N(n, this.direction);
  }
  intersectWithRay(t) {
    return this.isContainedByRay(t) ? this : t.isContainedByRay(this) ? t : this.interiorContainsPoint(t.base) ? new E(this.base, t.base) : A;
  }
  intersectWithLine(t) {
    return t.intersectWithRay(this);
  }
  intersectWithLineSegment(t) {
    if (t.isContainedByRay(this))
      return t;
    if (!this.lineSegmentIsOnSameLine(t))
      return A;
    let { point2: e } = this.getPointsInSameDirection(t.point1, t.point2);
    return this.comesBefore(e, this.base) ? A : new E(this.base, e);
  }
  isContainedByConvexPolygon(t) {
    return t.containsPoint(this.base) && t.containsInfinityInDirection(this.direction);
  }
  isContainedByRay(t) {
    return t.containsPoint(this.base) && t.containsInfinityInDirection(this.direction);
  }
  isContainedByLine(t) {
    return t.intersectsSubsetOfLine(this);
  }
  isContainedByLineSegment(t) {
    return !1;
  }
  contains(t) {
    return t.isContainedByRay(this);
  }
  intersectsRay(t) {
    return this.isContainedByRay(t) || t.isContainedByRay(this) || this.interiorContainsPoint(t.base);
  }
  intersectsLine(t) {
    return t.intersectsSubsetOfLine(this);
  }
  intersectsLineSegment(t) {
    if (t.isContainedByRay(this))
      return !0;
    if (!this.lineSegmentIsOnSameLine(t))
      return !1;
    let { point2: e } = this.getPointsInSameDirection(t.point1, t.point2);
    return !this.comesBefore(e, this.base);
  }
  intersects(t) {
    return t.intersectsRay(this);
  }
  expandToIncludePoint(t) {
    return this.containsPoint(t) ? this : this.pointIsOnSameLine(t) ? new N(t, this.direction) : p.createTriangleWithInfinityInDirection(this.base, t, this.direction);
  }
  expandByDistance(t) {
    const e = this.expandLineByDistance(t), n = new P(this.base, this.direction).expandByDistance(t);
    return e.intersectWithConvexPolygon(new p([n]));
  }
  expandToIncludeInfinityInDirection(t) {
    return t.inSameDirectionAs(this.direction) ? this : this.direction.cross(t) === 0 ? new ae(this.base, this.direction) : p.createTriangleWithInfinityInTwoDirections(this.base, this.direction, t);
  }
  transform(t) {
    const e = t.apply(this.base);
    return new N(e, t.apply(this.base.plus(this.direction)).minus(e));
  }
  interiorContainsPoint(t) {
    return this.pointIsOnSameLine(t) && !this.comesBefore(t, this.base);
  }
  containsInfinityInDirection(t) {
    return this.direction.inSameDirectionAs(t);
  }
  containsPoint(t) {
    return this.pointIsOnSameLine(t) && this.comesBefore(this.base, t);
  }
}
class E extends Ae {
  constructor(t, e) {
    super(t, e.minus(t)), this.point1 = t, this.point2 = e;
  }
  getVertices() {
    return [this.point1, this.point2];
  }
  join(t) {
    return t.expandToIncludePoint(this.point1).expandToIncludePoint(this.point2);
  }
  intersectWith(t) {
    return t.intersectWithLineSegment(this);
  }
  intersectWithLineSegment(t) {
    if (this.isContainedByLineSegment(t))
      return this;
    if (t.isContainedByLineSegment(this))
      return t;
    if (!this.lineSegmentIsOnSameLine(t))
      return A;
    let { point1: e, point2: n } = this.getPointsInSameDirection(t.point1, t.point2);
    return this.comesBefore(n, this.point1) || this.comesBefore(this.point2, e) ? A : this.comesBefore(this.point1, e) ? new E(e, this.point2) : new E(this.point1, n);
  }
  intersectWithRay(t) {
    return t.intersectWithLineSegment(this);
  }
  intersectWithLine(t) {
    return t.intersectWithLineSegment(this);
  }
  isContainedByRay(t) {
    return t.containsPoint(this.point1) && t.containsPoint(this.point2);
  }
  isContainedByLine(t) {
    return t.intersectsSubsetOfLine(this);
  }
  isContainedByLineSegment(t) {
    return t.containsPoint(this.point1) && t.containsPoint(this.point2);
  }
  intersectWithConvexPolygon(t) {
    if (!this.intersectsConvexPolygon(t))
      return A;
    if (this.isContainedByConvexPolygon(t))
      return this;
    const e = t.getIntersectionsWithLine(this.point1, this.direction);
    let n = this.point1, i = this.point2;
    for (let r of e)
      this.pointIsBetweenPoints(r.point, n, i) && (r.halfPlane.normalTowardInterior.dot(this.direction) > 0 ? n = r.point : i = r.point);
    return new E(n, i);
  }
  isContainedByConvexPolygon(t) {
    return t.containsPoint(this.point1) && t.containsPoint(this.point2);
  }
  contains(t) {
    return t.isContainedByLineSegment(this);
  }
  pointIsStrictlyBetweenPoints(t, e, n) {
    return t.minus(e).dot(this.direction) * t.minus(n).dot(this.direction) < 0;
  }
  containsPoint(t) {
    return this.pointIsOnSameLine(t) && this.pointIsBetweenPoints(t, this.point1, this.point2);
  }
  interiorContainsPoint(t) {
    return this.pointIsOnSameLine(t) && this.pointIsStrictlyBetweenPoints(t, this.point1, this.point2);
  }
  intersectsRay(t) {
    return t.intersectsLineSegment(this);
  }
  intersectsLineSegment(t) {
    if (this.isContainedByLineSegment(t) || t.isContainedByLineSegment(this))
      return !0;
    if (!this.lineSegmentIsOnSameLine(t))
      return !1;
    const { point1: e, point2: n } = this.getPointsInSameDirection(t.point1, t.point2);
    return !this.comesBefore(n, this.point1) && !this.comesBefore(this.point2, e);
  }
  intersectsLine(t) {
    return t.intersectsSubsetOfLine(this);
  }
  intersects(t) {
    return t.intersectsLineSegment(this);
  }
  expandByDistance(t) {
    const e = this.expandLineByDistance(t), n = new P(this.base, this.direction).expandByDistance(t), i = new P(this.point2, this.direction.scale(-1)).expandByDistance(t);
    return e.intersectWithConvexPolygon(new p([n, i]));
  }
  expandToIncludePoint(t) {
    return this.containsPoint(t) ? this : this.pointIsOnSameLine(t) ? this.comesBefore(t, this.point1) ? new E(t, this.point2) : new E(this.point1, t) : p.createTriangle(this.point1, t, this.point2);
  }
  expandToIncludeInfinityInDirection(t) {
    return t.inSameDirectionAs(this.direction) ? new N(this.point1, t) : t.cross(this.direction) === 0 ? new N(this.point2, t) : p.createTriangleWithInfinityInDirection(this.point1, this.point2, t);
  }
  transform(t) {
    return new E(t.apply(this.point1), t.apply(this.point2));
  }
}
class Gi {
  addPoint(t) {
    return pt;
  }
  addPointAtInfinity(t) {
    return this;
  }
  addArea(t) {
    return pt;
  }
}
const De = new Gi();
class Ie {
  constructor(t) {
    this.towardsMiddle = t;
  }
  addPoint(t) {
    return p.createFromHalfPlane(new P(t, this.towardsMiddle));
  }
  addPointAtInfinity(t) {
    return t.dot(this.towardsMiddle) >= 0 ? this : De;
  }
  addArea(t) {
    const e = this.towardsMiddle.getPerpendicular();
    return t.expandToIncludeInfinityInDirection(this.towardsMiddle).expandToIncludeInfinityInDirection(e).expandToIncludeInfinityInDirection(e.scale(-1));
  }
}
class Jt {
  constructor(t, e) {
    this.direction1 = t, this.direction2 = e;
  }
  addPoint(t) {
    return p.createTriangleWithInfinityInTwoDirections(t, this.direction1, this.direction2);
  }
  addPointAtInfinity(t) {
    return t.isInSmallerAngleBetweenPoints(this.direction1, this.direction2) ? this : t.cross(this.direction1) === 0 ? new Ie(this.direction2.projectOn(this.direction1.getPerpendicular())) : t.cross(this.direction2) === 0 ? new Ie(this.direction1.projectOn(this.direction2.getPerpendicular())) : this.direction1.isInSmallerAngleBetweenPoints(t, this.direction2) ? new Jt(t, this.direction2) : this.direction2.isInSmallerAngleBetweenPoints(t, this.direction1) ? new Jt(t, this.direction1) : De;
  }
  addArea(t) {
    return t.expandToIncludeInfinityInDirection(this.direction1).expandToIncludeInfinityInDirection(this.direction2);
  }
}
class Yi {
  constructor(t) {
    this.direction = t;
  }
  addPoint(t) {
    return new ae(t, this.direction);
  }
  addPointAtInfinity(t) {
    return t.cross(this.direction) === 0 ? this : new Ie(t.projectOn(this.direction.getPerpendicular()));
  }
  addArea(t) {
    return t.expandToIncludeInfinityInDirection(this.direction).expandToIncludeInfinityInDirection(this.direction.scale(-1));
  }
}
class Xi {
  constructor(t) {
    this.direction = t;
  }
  addPointAtInfinity(t) {
    return t.inSameDirectionAs(this.direction) ? this : t.cross(this.direction) === 0 ? new Yi(this.direction) : new Jt(this.direction, t);
  }
  addPoint(t) {
    return new N(t, this.direction);
  }
  addArea(t) {
    return t.expandToIncludeInfinityInDirection(this.direction);
  }
}
class Ui {
  constructor(t, e, n) {
    this._area = t, this.firstPoint = e, this.subsetOfLineAtInfinity = n;
  }
  get area() {
    return this._area || A;
  }
  addPoint(t) {
    this._area ? this._area = this._area.expandToIncludePoint(t) : this.firstPoint ? t.equals(this.firstPoint) || (this._area = new E(this.firstPoint, t)) : this.subsetOfLineAtInfinity ? this._area = this.subsetOfLineAtInfinity.addPoint(t) : this.firstPoint = t;
  }
  addPosition(t) {
    I(t) ? this.addInfinityInDirection(t.direction) : this.addPoint(t);
  }
  addInfinityInDirection(t) {
    this._area ? this._area = this._area.expandToIncludeInfinityInDirection(t) : this.firstPoint ? this._area = new N(this.firstPoint, t) : this.subsetOfLineAtInfinity ? (this.subsetOfLineAtInfinity = this.subsetOfLineAtInfinity.addPointAtInfinity(t), this.subsetOfLineAtInfinity === De && (this._area = pt)) : this.subsetOfLineAtInfinity = new Xi(t);
  }
  transformedWith(t) {
    return new qi(this, t);
  }
}
class Zt extends Be {
  constructor(t, e, n, i) {
    super(t, e), this.instruction = n, this.stateConversion = i;
  }
  replaceInstruction(t) {
    this.instruction = t;
  }
  makeExecutable(t) {
    const e = t.getInfinity(this.state), n = this.instruction, i = (r, o) => n(r, o, e);
    return new K(this.initialState, this.state, i, this.stateConversion);
  }
  static create(t, e) {
    return new Zt(t, t, e, () => {
    });
  }
}
function $i(s, t) {
  return s ? t ? I(s) ? I(t) && s.direction.equals(t.direction) : !I(t) && s.equals(t) : !s : !t;
}
class Bt {
  constructor(t) {
    this.shape = t;
  }
  getInstructionToDrawLineTo(t, e) {
    return this.getInstructionToExtendShapeWithLineTo(this.shape.transform(e.current.transformation.inverse()), t);
  }
  getInstructionToMoveToBeginning(t) {
    return this.getInstructionToMoveToBeginningOfShape(this.shape.transform(t.current.transformation.inverse()));
  }
  get currentPosition() {
    return this.shape.currentPosition;
  }
  moveToInfinityFromPointInDirection(t, e) {
    return (n, i, r) => {
      r.moveToInfinityFromPointInDirection(n, i, t, e);
    };
  }
  lineFromInfinityFromPointToInfinityFromPoint(t, e, n) {
    return (i, r, o) => {
      o.drawLineFromInfinityFromPointToInfinityFromPoint(i, r, t, e, n);
    };
  }
  lineFromInfinityFromPointToPoint(t, e) {
    return (n, i, r) => {
      r.drawLineFromInfinityFromPointToPoint(n, i, t, e);
    };
  }
  lineToInfinityFromPointInDirection(t, e) {
    return (n, i, r) => {
      r.drawLineToInfinityFromPointInDirection(n, i, t, e);
    };
  }
  lineToInfinityFromInfinityFromPoint(t, e, n) {
    return (i, r, o) => {
      o.drawLineToInfinityFromInfinityFromPoint(i, r, t, e, n);
    };
  }
  lineTo(t) {
    return (e, n) => {
      const { x: i, y: r } = n.userTransformation.apply(t);
      e.lineTo(i, r);
    };
  }
  moveTo(t) {
    return (e, n) => {
      const { x: i, y: r } = n.userTransformation.apply(t);
      e.moveTo(i, r);
    };
  }
}
class ce {
  constructor(t, e, n, i) {
    this.initialPosition = t, this.firstFinitePoint = e, this.lastFinitePoint = n, this.currentPosition = i;
  }
  transform(t) {
    return new ce(
      t.applyToPointAtInfinity(this.initialPosition),
      t.apply(this.firstFinitePoint),
      t.apply(this.lastFinitePoint),
      t.applyToPointAtInfinity(this.currentPosition)
    );
  }
}
class At {
  constructor(t, e, n) {
    this.initialPosition = t, this.firstFinitePoint = e, this.currentPosition = n;
  }
  transform(t) {
    return new At(
      t.applyToPointAtInfinity(this.initialPosition),
      t.apply(this.firstFinitePoint),
      t.apply(this.currentPosition)
    );
  }
}
class Ki extends Bt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    return t.initialPosition.direction.cross(t.currentPosition.direction) === 0 ? this.moveToInfinityFromPointInDirection(t.firstFinitePoint, t.initialPosition.direction) : $(
      this.moveToInfinityFromPointInDirection(t.lastFinitePoint, t.currentPosition.direction),
      this.lineToInfinityFromInfinityFromPoint(t.lastFinitePoint, t.currentPosition.direction, t.initialPosition.direction),
      this.lineFromInfinityFromPointToInfinityFromPoint(t.lastFinitePoint, t.firstFinitePoint, t.initialPosition.direction)
    );
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    return I(e) ? this.lineToInfinityFromInfinityFromPoint(t.lastFinitePoint, t.currentPosition.direction, e.direction) : $(
      this.lineFromInfinityFromPointToInfinityFromPoint(t.lastFinitePoint, e, t.currentPosition.direction),
      this.lineFromInfinityFromPointToPoint(e, t.currentPosition.direction)
    );
  }
  containsFinitePoint() {
    return !0;
  }
  surroundsFinitePoint() {
    return !0;
  }
  isClosable() {
    return !this.shape.initialPosition.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
  }
  canAddLineTo(t) {
    return !I(t) || !t.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
  }
  addPosition(t) {
    return I(t) ? this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(new ce(this.shape.initialPosition, this.shape.firstFinitePoint, this.shape.lastFinitePoint, t)) : this.pathBuilderProvider.fromPointAtInfinityToPoint(new At(this.shape.initialPosition, this.shape.firstFinitePoint, t));
  }
}
class ji extends Bt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    const e = this.moveToInfinityFromPointInDirection(t.currentPosition, t.initialPosition.direction);
    if (t.currentPosition.equals(t.firstFinitePoint))
      return e;
    const n = this.lineFromInfinityFromPointToInfinityFromPoint(t.currentPosition, t.firstFinitePoint, t.initialPosition.direction);
    return $(e, n);
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    return I(e) ? this.lineToInfinityFromPointInDirection(t.currentPosition, e.direction) : this.lineTo(e);
  }
  canAddLineTo(t) {
    return !0;
  }
  containsFinitePoint() {
    return !0;
  }
  surroundsFinitePoint() {
    return !0;
  }
  isClosable() {
    return !0;
  }
  addPosition(t) {
    return I(t) ? this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(new ce(this.shape.initialPosition, this.shape.firstFinitePoint, this.shape.currentPosition, t)) : this.pathBuilderProvider.fromPointAtInfinityToPoint(new At(this.shape.initialPosition, this.shape.firstFinitePoint, t));
  }
}
class he {
  constructor(t, e) {
    this.initialPoint = t, this.currentPosition = e;
  }
  transform(t) {
    return new he(
      t.apply(this.initialPoint),
      t.applyToPointAtInfinity(this.currentPosition)
    );
  }
}
class Dt {
  constructor(t, e) {
    this.initialPoint = t, this.currentPosition = e;
  }
  transform(t) {
    return new Dt(
      t.apply(this.initialPoint),
      t.apply(this.currentPosition)
    );
  }
}
class Qi extends Bt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    return this.moveTo(t.initialPoint);
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    return I(e) ? e.direction.inSameDirectionAs(t.currentPosition.direction) ? () => {
    } : this.lineToInfinityFromInfinityFromPoint(t.initialPoint, t.currentPosition.direction, e.direction) : $(this.lineFromInfinityFromPointToInfinityFromPoint(t.initialPoint, e, t.currentPosition.direction), this.lineFromInfinityFromPointToPoint(e, t.currentPosition.direction));
  }
  canAddLineTo(t) {
    return !I(t) || !t.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
  }
  containsFinitePoint() {
    return !0;
  }
  surroundsFinitePoint() {
    return !0;
  }
  isClosable() {
    return !0;
  }
  addPosition(t) {
    return I(t) ? this.pathBuilderProvider.fromPointToPointAtInfinity(new he(this.shape.initialPoint, t)) : this.pathBuilderProvider.fromPointToPoint(new Dt(this.shape.initialPoint, t));
  }
}
class nn extends Bt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    return this.moveTo(t.initialPoint);
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    if (I(e)) {
      const n = this.lineToInfinityFromPointInDirection(t.currentPosition, e.direction);
      if (t.currentPosition.minus(t.initialPoint).cross(e.direction) === 0)
        return n;
      const i = this.lineFromInfinityFromPointToInfinityFromPoint(t.currentPosition, t.initialPoint, e.direction);
      return $(n, i);
    }
    return this.lineTo(e);
  }
  canAddLineTo(t) {
    return !0;
  }
  containsFinitePoint() {
    return !0;
  }
  surroundsFinitePoint() {
    return !0;
  }
  isClosable() {
    return !0;
  }
  addPosition(t) {
    return I(t) ? this.pathBuilderProvider.fromPointToPointAtInfinity(new he(this.shape.initialPoint, t)) : this.pathBuilderProvider.fromPointToPoint(new Dt(this.shape.initialPoint, t));
  }
}
class rn extends Bt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    return t.surroundsFinitePoint ? (e, n, i) => i.addPathAroundViewbox(e, n, t.direction === "counterclockwise") : () => {
    };
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    if (I(e))
      return;
    if (t.positionsSoFar.length === 1)
      return this.lineFromInfinityFromPointToPoint(e, t.positionsSoFar[0].direction);
    const n = t.positionsSoFar.slice(1);
    let i = t.initialPosition;
    const r = [];
    for (let o of n)
      r.push(this.lineToInfinityFromInfinityFromPoint(e, i.direction, o.direction)), i = o;
    return $($(...r), this.lineFromInfinityFromPointToPoint(e, i.direction));
  }
  canAddLineTo(t) {
    return !I(t) || !t.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
  }
  containsFinitePoint() {
    return !1;
  }
  surroundsFinitePoint() {
    return this.shape.surroundsFinitePoint;
  }
  isClosable() {
    return !0;
  }
  addPosition(t) {
    return I(t) ? this.pathBuilderProvider.atInfinity(this.shape.addPosition(t)) : this.pathBuilderProvider.fromPointAtInfinityToPoint(new At(this.shape.initialPosition, t, t));
  }
}
class St {
  constructor(t, e, n, i) {
    a(this, "direction");
    this.initialPosition = t, this.surroundsFinitePoint = e, this.positionsSoFar = n, this.currentPosition = i;
    const r = t.direction.cross(i.direction);
    this.direction = e ? r >= 0 ? "counterclockwise" : "clockwise" : r >= 0 ? "clockwise" : "counterclockwise";
  }
  transform(t) {
    return new St(
      t.applyToPointAtInfinity(this.initialPosition),
      this.surroundsFinitePoint,
      this.positionsSoFar.map((e) => t.applyToPointAtInfinity(e)),
      t.applyToPointAtInfinity(this.currentPosition)
    );
  }
  addPosition(t) {
    const n = t.direction.isOnSameSideOfOriginAs(this.initialPosition.direction, this.currentPosition.direction) ? this.surroundsFinitePoint : !this.surroundsFinitePoint;
    return new St(this.initialPosition, n, this.positionsSoFar.concat([t]), t);
  }
  static create(t) {
    return new St(t, !1, [t], t);
  }
}
class Ji {
  fromPointAtInfinityToPointAtInfinity(t) {
    return new Ki(this, t);
  }
  fromPointAtInfinityToPoint(t) {
    return new ji(this, t);
  }
  fromPointToPointAtInfinity(t) {
    return new Qi(this, t);
  }
  fromPointToPoint(t) {
    return new nn(this, t);
  }
  atInfinity(t) {
    return new rn(this, t);
  }
  getBuilderFromPosition(t) {
    return I(t) ? new rn(this, St.create(t)) : new nn(this, new Dt(t, t));
  }
}
class Ee extends Le {
  constructor(t) {
    super(t), this._initiallyWithState = t;
  }
  execute(t, e) {
    this._initiallyWithState.execute(t, e);
    for (const n of this.added)
      n.execute(t, e);
  }
}
class Re extends Le {
  constructor(t, e) {
    super(t), this._initiallyWithState = t, this.pathInstructionBuilder = e;
  }
  get currentPosition() {
    return this.pathInstructionBuilder.currentPosition;
  }
  addInstruction(t) {
    t.setInitialState(this.state), this.add(t);
  }
  closePath() {
    const t = mt.create(this.state, (e) => {
      e.closePath();
    });
    this.add(t);
  }
  makeExecutable(t) {
    const e = new Ee(this._initiallyWithState.makeExecutable(t));
    for (const n of this.added)
      e.add(n.makeExecutable(t));
    return e;
  }
  surroundsFinitePoint() {
    return this.pathInstructionBuilder.surroundsFinitePoint();
  }
  isClosable() {
    return this.pathInstructionBuilder.isClosable();
  }
  canAddLineTo(t) {
    return this.pathInstructionBuilder.canAddLineTo(t);
  }
  lineTo(t, e) {
    const n = _(t, e.current.transformation);
    (!I(t) || this.pathInstructionBuilder.containsFinitePoint()) && this.addInstructionToDrawLineTo(t, e), this.pathInstructionBuilder = this.pathInstructionBuilder.addPosition(n);
    const i = this.pathInstructionBuilder.getInstructionToMoveToBeginning(this._initiallyWithState.state);
    this._initiallyWithState.replaceInstruction((r, o, c) => {
      i(r, o, c);
    });
  }
  addInstructionToDrawLineTo(t, e) {
    const n = this.pathInstructionBuilder.getInstructionToDrawLineTo(t, e), i = Zt.create(e, n);
    i.setInitialState(this.state), this.add(i);
  }
  addPathInstruction(t, e, n) {
    t.initialPoint && !$i(this.pathInstructionBuilder.currentPosition, t.initialPoint) && this.lineTo(t.initialPoint, n), t.positionChange && (this.pathInstructionBuilder = this.pathInstructionBuilder.addPosition(_(t.positionChange, n.current.transformation))), e.setInitialState(this.state), this.add(e);
  }
  static create(t, e) {
    const n = _(e, t.current.transformation), i = new Ji().getBuilderFromPosition(n), r = i.getInstructionToMoveToBeginning(t), o = Zt.create(t, r);
    return new Re(o, i);
  }
}
function Zi(s, t, e) {
  let n = 0, i;
  for (let r of s) {
    const o = r.minus(t).dot(e);
    o > n && (i = r, n = o);
  }
  return i ? t.plus(i.minus(t).projectOn(e)) : t;
}
function F(s, t, e) {
  return Zi(s.getVertices(), t, e);
}
class _i {
  constructor(t, e) {
    this.state = t, this.drawnPathProperties = e;
  }
  addPathAroundViewbox(t, e, n) {
    e.addPathAroundViewbox(t, this.drawnPathProperties.lineWidth, n);
  }
  getTransformedViewbox(t) {
    const e = this.state.current.transformation.before(t.getBitmapTransformationToInfiniteCanvasContext());
    let n = t.polygon;
    n = n.transform(e.inverse()).expandByDistance(this.drawnPathProperties.lineWidth);
    for (const i of this.drawnPathProperties.shadowOffsets) {
      const r = n.transform(v.translation(-i.x, -i.y));
      n = n.join(r);
    }
    return n;
  }
  clearRect(t, e, n, i, r, o) {
    const c = this.getTransformedViewbox(e), { a: u, b: l, c: f, d, e: m, f: w } = e.userTransformation;
    t.save(), t.transform(u, l, f, d, m, w);
    const C = Number.isFinite(n) ? n : F(c, new h(0, 0), n > 0 ? Qt.direction : jt.direction).x, S = Number.isFinite(r) ? n + r : F(c, new h(0, 0), r > 0 ? Qt.direction : jt.direction).x, L = Number.isFinite(i) ? i : F(c, new h(0, 0), i > 0 ? $t.direction : Kt.direction).y, V = Number.isFinite(o) ? i + o : F(c, new h(0, 0), o > 0 ? $t.direction : Kt.direction).y;
    t.clearRect(C, L, S - C, V - L), t.restore();
  }
  moveToInfinityFromPointInDirection(t, e, n, i) {
    const r = F(this.getTransformedViewbox(e), n, i);
    this.moveToTransformed(t, r, e.userTransformation);
  }
  drawLineToInfinityFromInfinityFromPoint(t, e, n, i, r) {
    const o = this.getTransformedViewbox(e), c = F(o, n, i), u = F(o, n, r), l = e.userTransformation, d = o.expandToIncludePoint(n).expandToIncludePoint(c).expandToIncludePoint(u).getVertices().filter((C) => !C.equals(c) && !C.equals(u) && !C.equals(n) && C.minus(n).isInSmallerAngleBetweenPoints(i, r));
    d.sort((C, S) => C.minus(n).isInSmallerAngleBetweenPoints(S.minus(n), i) ? -1 : 1);
    let m = c, w = 0;
    for (let C of d)
      w += C.minus(m).mod(), this.lineToTransformed(t, C, l), m = C;
    w += u.minus(m).mod(), this.lineToTransformed(t, u, l), this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, l, w, u, r);
  }
  drawLineFromInfinityFromPointToInfinityFromPoint(t, e, n, i, r) {
    const o = this.getTransformedViewbox(e), c = F(o, n, r), u = e.userTransformation, l = F(o, i, r);
    this.lineToTransformed(t, l, u);
    const f = l.minus(c).mod();
    this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, u, f, l, r);
  }
  drawLineFromInfinityFromPointToPoint(t, e, n, i) {
    const r = F(this.getTransformedViewbox(e), n, i), o = n.minus(r).mod(), c = e.userTransformation;
    this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, c, o, r, i), this.lineToTransformed(t, n, c);
  }
  drawLineToInfinityFromPointInDirection(t, e, n, i) {
    const r = F(this.getTransformedViewbox(e), n, i), o = e.userTransformation;
    this.lineToTransformed(t, r, o);
    const c = r.minus(n).mod();
    this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, o, c, r, i);
  }
  ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, e, n, i, r) {
    const o = this.drawnPathProperties.lineDashPeriod;
    if (o === 0)
      return;
    const c = this.getDistanceLeft(n, o);
    if (c === 0)
      return;
    const u = i.plus(r.scale(c / (2 * r.mod())));
    this.lineToTransformed(t, u, e), this.lineToTransformed(t, i, e);
  }
  lineToTransformed(t, e, n) {
    const { x: i, y: r } = n.apply(e);
    t.lineTo(i, r);
  }
  moveToTransformed(t, e, n) {
    const { x: i, y: r } = n.apply(e);
    t.moveTo(i, r);
  }
  getDistanceLeft(t, e) {
    if (e === 0)
      return 0;
    const n = t / e | 0;
    return t - e * n === 0 ? 0 : (n + 1) * e - t;
  }
}
class Fe {
  constructor(t) {
    this.drawnPathProperties = t;
  }
  getInfinity(t) {
    return new _i(t, this.drawnPathProperties);
  }
}
class tr {
  constructor(t, e) {
    this.instructions = t, this.area = e;
  }
  get state() {
    return this.instructions.state;
  }
  get initialState() {
    return this.instructions.initialState;
  }
  execute(t, e) {
    this.instructions.execute(t, e);
  }
}
class xt extends Le {
  constructor(e) {
    super(e);
    a(this, "areaBuilder", new Ui());
    this._initiallyWithState = e;
  }
  get area() {
    return this.areaBuilder.area;
  }
  surroundsFinitePoint() {
    for (const e of this.added)
      if (e.surroundsFinitePoint())
        return !0;
    return !1;
  }
  currentSubpathIsClosable() {
    return this.added.length === 0 ? !0 : this.added[this.added.length - 1].isClosable();
  }
  allSubpathsAreClosable() {
    if (this.added.length === 0)
      return !0;
    for (const e of this.added)
      if (!e.isClosable())
        return !1;
    return !0;
  }
  drawPath(e, n, i) {
    if (this.added.length === 0)
      return;
    const r = K.create(n, e), o = this.makeExecutable(i);
    return r.setInitialState(o.state), o.add(r), o;
  }
  makeExecutable(e) {
    const n = new Ee(this._initiallyWithState.makeExecutable()), i = new Fe(e);
    for (const r of this.added)
      n.add(r.makeExecutable(i));
    return n;
  }
  getInstructionsToClip() {
    const e = this.makeExecutable({ lineWidth: 0, lineDashPeriod: 0, shadowOffsets: [] });
    return e.setInitialState(e.stateOfFirstInstruction), new tr(e, this.area);
  }
  clipPath(e, n) {
    if (this.added.length === 0)
      return;
    const i = this.added[this.added.length - 1], r = mt.create(n, e);
    i.addInstruction(r);
    const o = this.getInstructionsToClip();
    this.addClippedPath(o);
  }
  closePath() {
    if (this.added.length === 0)
      return;
    this.added[this.added.length - 1].closePath();
  }
  moveTo(e, n) {
    const i = _(e, n.current.transformation);
    this.areaBuilder.addPosition(i);
    const r = Re.create(n, e);
    r.setInitialState(this.state), this.add(r);
  }
  canAddLineTo(e, n) {
    if (this.added.length === 0)
      return !0;
    const i = _(e, n.current.transformation);
    return this.added[this.added.length - 1].canAddLineTo(i);
  }
  lineTo(e, n) {
    if (this.added.length === 0) {
      this.moveTo(e, n);
      return;
    }
    const i = this.added[this.added.length - 1], r = _(e, n.current.transformation);
    this.areaBuilder.addPosition(r), i.lineTo(e, n);
  }
  addPathInstruction(e, n) {
    if (this.added.length === 0)
      if (e.initialPoint)
        this.moveTo(e.initialPoint, n);
      else
        return;
    const i = this.added[this.added.length - 1], r = i.currentPosition, o = _(r, n.current.transformation.inverse());
    e.changeArea(this.areaBuilder.transformedWith(n.current.transformation), o);
    const c = mt.create(n, e.instruction);
    i.addPathInstruction(e, c, n);
  }
  static create(e) {
    return new xt(mt.create(e, (n) => {
      n.beginPath();
    }));
  }
}
class R {
  constructor(t, ...e) {
    a(this, "corners");
    this.topLeftCorner = t, this.corners = e;
  }
  addSubpaths(t, e) {
    this.topLeftCorner.moveToEndingPoint(t, e);
    for (const n of this.corners)
      n.draw(t, e);
    this.topLeftCorner.finishRect(t, e);
  }
  stroke(t, e) {
    return M.forStrokingPath(e, t, (n) => {
      const i = xt.create(n);
      return this.addSubpaths(i, n), i;
    });
  }
  fill(t, e) {
    return M.forFillingPath(e, t, (n) => {
      const i = xt.create(n);
      return this.addSubpaths(i, n), i;
    });
  }
}
class er extends R {
  constructor(t, e, ...n) {
    super(e, ...n), this.horizontal = t;
  }
  getRoundRect() {
    return this;
  }
  getArea() {
    return new p(this.horizontal.getHalfPlanesWithHorizontalCrossSection());
  }
}
class nr extends R {
  constructor(t, e, ...n) {
    super(e, ...n), this.vertical = t;
  }
  getRoundRect() {
    return this;
  }
  getArea() {
    return new p(this.vertical.getHalfPlanesWithVerticalCrossSection());
  }
}
class ir extends R {
  constructor(t, e, n, i, r) {
    super(n, i, r), this.horizontal = t, this.vertical = e, this.topLeft = n, this.right = i, this.bottom = r;
  }
  getRoundRect(t) {
    const e = this.topLeft.round(t.upperLeft);
    return new R(
      e,
      this.right,
      this.bottom
    );
  }
  getArea() {
    return new p([
      ...this.vertical.getHalfPlanesWithVerticalCrossSection(),
      ...this.horizontal.getHalfPlanesWithHorizontalCrossSection()
    ]);
  }
}
class rr extends R {
  constructor(t, e, ...n) {
    super(e, ...n), this.horizontal = t;
  }
  getRoundRect() {
    return this;
  }
  getArea() {
    return new p(this.horizontal.getHalfPlanesWithHorizontalCrossSection());
  }
}
function sr(s) {
  return s.x !== void 0;
}
function sn(s) {
  if (typeof s == "number") {
    if (Number.isNaN(s))
      return;
    if (s < 0)
      throw new RangeError(`Radius value ${s} is negative.`);
    return { x: s, y: s, circular: !0 };
  }
  const { x: t, y: e } = s;
  if (!(Number.isNaN(t) || Number.isNaN(e))) {
    if (t < 0)
      throw new RangeError(`X-radius value ${s} is negative.`);
    if (e < 0)
      throw new RangeError(`Y-radius value ${s} is negative.`);
    return { x: t, y: e, circular: !1 };
  }
}
function Ft(s, t) {
  const { x: e, y: n, circular: i } = s;
  return { x: e * t, y: n * t, circular: i };
}
function We(s, t) {
  const { upperLeft: e, upperRight: n, lowerLeft: i, lowerRight: r } = s;
  return {
    upperLeft: Ft(e, t),
    upperRight: Ft(n, t),
    lowerLeft: Ft(i, t),
    lowerRight: Ft(r, t)
  };
}
function or(s) {
  if (typeof s == "number" || sr(s)) {
    const n = sn(s);
    return n ? { upperLeft: n, upperRight: n, lowerLeft: n, lowerRight: n } : void 0;
  }
  const t = [...s], e = t.slice(0, 4).map(sn);
  if (!e.includes(void 0)) {
    if (e.length === 4) {
      const [n, i, r, o] = e;
      return {
        upperLeft: n,
        upperRight: i,
        lowerRight: r,
        lowerLeft: o
      };
    }
    if (e.length === 3) {
      const [n, i, r] = e;
      return {
        upperLeft: n,
        upperRight: i,
        lowerRight: r,
        lowerLeft: i
      };
    }
    if (e.length === 2) {
      const [n, i] = e;
      return {
        upperLeft: n,
        upperRight: i,
        lowerRight: n,
        lowerLeft: i
      };
    }
    if (e.length === 1) {
      const [n] = e;
      return {
        upperLeft: n,
        upperRight: n,
        lowerRight: n,
        lowerLeft: n
      };
    }
    throw new RangeError(`${t.length} radii provided. Between one and four radii are necessary.`);
  }
}
class ar extends R {
  constructor(t, e, n, i, r) {
    super(n, i, r), this.horizontal = t, this.vertical = e, this.topLeft = n, this.topRightCorner = i, this.bottom = r;
  }
  getRoundRect(t) {
    const e = this.horizontal.getLength(), n = t.upperLeft.x + t.upperRight.x, i = e / n;
    i < 1 && (t = We(t, i));
    const r = this.topRightCorner.round(t.upperRight), o = this.topLeft.round(t.upperLeft);
    return new R(
      o,
      r,
      this.bottom
    );
  }
  getArea() {
    return new p([
      ...this.vertical.getHalfPlanesWithVerticalCrossSection(),
      ...this.horizontal.getHalfPlanesWithHorizontalCrossSection()
    ]);
  }
}
class cr extends R {
  constructor(t, e, ...n) {
    super(e, ...n), this.vertical = t;
  }
  getRoundRect() {
    return this;
  }
  getArea() {
    return new p(this.vertical.getHalfPlanesWithVerticalCrossSection());
  }
}
class hr extends R {
  constructor(t, e, n, i, r) {
    super(n, i, r), this.vertical = t, this.horizontal = e, this.topLeft = n, this.right = i, this.bottomLeftCorner = r;
  }
  getRoundRect(t) {
    const e = this.vertical.getLength(), n = t.upperLeft.y + t.lowerLeft.y, i = e / n;
    i < 1 && (t = We(t, i));
    const r = this.topLeft.round(t.upperLeft), o = this.bottomLeftCorner.round(t.lowerLeft);
    return new R(
      r,
      this.right,
      o
    );
  }
  getArea() {
    return new p([
      ...this.vertical.getHalfPlanesWithVerticalCrossSection(),
      ...this.horizontal.getHalfPlanesWithHorizontalCrossSection()
    ]);
  }
}
class lr extends R {
  constructor(t, e, n, i, r, o) {
    super(n, i, r, o), this.vertical = t, this.horizontal = e, this.topLeft = n, this.topRight = i, this.bottomRight = r, this.bottomLeft = o;
  }
  getRoundRect(t) {
    const e = this.vertical.getLength(), n = this.horizontal.getLength(), i = Math.min(
      e / (t.upperLeft.y + t.lowerLeft.y),
      e / (t.upperRight.y + t.lowerRight.y),
      n / (t.upperLeft.x + t.upperRight.x),
      n / (t.lowerLeft.x + t.lowerRight.x)
    );
    i < 1 && (t = We(t, i));
    const r = this.bottomRight.round(t.lowerRight), o = this.topLeft.round(t.upperLeft), c = this.topRight.round(t.upperRight), u = this.bottomLeft.round(t.lowerLeft);
    return new R(
      o,
      c,
      r,
      u
    );
  }
  getArea() {
    return new p([
      ...this.horizontal.getHalfPlanesWithHorizontalCrossSection(),
      ...this.vertical.getHalfPlanesWithVerticalCrossSection()
    ]);
  }
}
class _t {
  constructor(t) {
    this.topLeftPosition = t;
  }
  addSubpaths(t, e) {
    t.moveTo(this.topLeftPosition, e);
  }
  getRoundRect() {
    return this;
  }
  getArea() {
  }
  stroke() {
  }
  fill() {
  }
}
class ur {
  constructor() {
    a(this, "area", pt);
  }
  drawPath(t, e, n) {
    const r = new Fe(n).getInfinity(e);
    return K.create(e, (o, c) => {
      o.beginPath(), r.addPathAroundViewbox(o, c, !1), t(o, c);
    });
  }
}
const dr = new ur();
function Fn(s, t) {
  throw new Error(`The starting coordinates provided (${s.start} and ${t.start}) do not determine a direction.`);
}
class fr {
  constructor(t, e) {
    this.horizontal = t, this.vertical = e;
  }
  addSubpaths() {
    Fn(this.horizontal, this.vertical);
  }
  getRoundRect() {
    return this;
  }
  getArea() {
    return pt;
  }
  stroke() {
  }
  fill(t, e) {
    return M.forFillingPath(e, t, () => dr);
  }
}
class Te {
  constructor(t, e) {
    this.horizontal = t, this.vertical = e;
  }
  addSubpaths() {
    Fn(this.horizontal, this.vertical);
  }
  getRoundRect() {
    return this;
  }
  getArea() {
  }
  stroke() {
  }
  fill() {
  }
}
class rt {
  static arc(t, e, n, i, r, o) {
    return {
      instruction: (l, f) => {
        const d = f.userTransformation, { x: m, y: w } = d.apply(new h(t, e)), { a: C, b: S, c: L, d: V, e: j, f: Q } = d.untranslated().before(v.translation(m, w));
        l.save(), l.transform(C, S, L, V, j, Q), l.arc(0, 0, n, i, r, o), l.restore();
      },
      changeArea: (l) => {
        l.addPosition(new h(t - n, e - n)), l.addPosition(new h(t - n, e + n)), l.addPosition(new h(t + n, e - n)), l.addPosition(new h(t + n, e + n));
      },
      positionChange: new h(t, e).plus(v.rotation(0, 0, r).apply(new h(n, 0))),
      initialPoint: new h(t, e).plus(v.rotation(0, 0, i).apply(new h(n, 0)))
    };
  }
  static arcTo(t, e, n, i, r) {
    const o = new h(t, e), c = new h(n, i);
    return {
      instruction: (f, d) => {
        const m = d.userTransformation, w = m.apply(o), C = m.apply(c);
        f.arcTo(w.x, w.y, C.x, C.y, r * m.scale);
      },
      changeArea: (f) => {
        f.addPosition(o), f.addPosition(c);
      },
      positionChange: new h(n, i)
    };
  }
  static ellipse(t, e, n, i, r, o, c, u) {
    return {
      instruction: (l, f) => {
        const d = f.userTransformation, m = d.apply(new h(t, e)), w = d.getRotationAngle();
        l.ellipse(m.x, m.y, n * d.scale, i * d.scale, r + w, o, c, u);
      },
      changeArea: (l) => {
        l.addPosition(new h(t - n, e - i)), l.addPosition(new h(t - n, e + i)), l.addPosition(new h(t + n, e - i)), l.addPosition(new h(t + n, e + i));
      },
      positionChange: new h(t, e).plus(
        v.rotation(0, 0, c).before(
          new v(n, 0, 0, i, 0, 0)
        ).before(
          v.rotation(0, 0, r)
        ).apply(new h(1, 0))
      ),
      initialPoint: new h(t, e).plus(
        v.rotation(0, 0, o).before(
          new v(n, 0, 0, i, 0, 0)
        ).before(
          v.rotation(0, 0, r)
        ).apply(new h(1, 0))
      )
    };
  }
  static bezierCurveTo(t, e, n, i, r, o) {
    return {
      instruction: (c, u) => {
        const l = u.userTransformation, f = l.apply(new h(t, e)), d = l.apply(new h(n, i)), m = l.apply(new h(r, o));
        c.bezierCurveTo(f.x, f.y, d.x, d.y, m.x, m.y);
      },
      changeArea: (c, u) => {
        I(u) || (c.addPosition(new h((u.x + t) / 2, (u.y + e) / 2)), c.addPosition(new h((t + n) / 2, (e + i) / 2)), c.addPosition(new h((n + r) / 2, (i + o) / 2)), c.addPosition(new h(r, o)));
      },
      positionChange: new h(r, o)
    };
  }
  static quadraticCurveTo(t, e, n, i) {
    return {
      instruction: (r, o) => {
        const c = o.userTransformation, u = c.apply(new h(t, e)), l = c.apply(new h(n, i));
        r.quadraticCurveTo(u.x, u.y, l.x, l.y);
      },
      changeArea: (r, o) => {
        I(o) || (r.addPosition(new h((o.x + t) / 2, (o.y + e) / 2)), r.addPosition(new h((t + n) / 2, (e + i) / 2)), r.addPosition(new h(n, i)));
      },
      positionChange: new h(n, i)
    };
  }
}
var U = /* @__PURE__ */ ((s) => (s[s.TOPLEFT = 0] = "TOPLEFT", s[s.TOPRIGHT = 1] = "TOPRIGHT", s[s.BOTTOMLEFT = 2] = "BOTTOMLEFT", s[s.BOTTOMRIGHT = 3] = "BOTTOMRIGHT", s))(U || {});
function gr(s) {
  switch (s) {
    case 0:
      return 2;
    case 1:
      return 3;
    case 3:
      return 1;
    case 2:
      return 0;
  }
}
function mr(s) {
  switch (s) {
    case 0:
      return 1;
    case 1:
      return 0;
    case 3:
      return 2;
    case 2:
      return 3;
  }
}
class Wn {
  constructor(t, e, n, i, r) {
    a(this, "center");
    a(this, "start");
    a(this, "end");
    a(this, "radii");
    a(this, "clockwise");
    this.corner = e, n = vr(n, i, r);
    const o = r === i;
    let { center: c, start: u, end: l } = wr(n, e, t);
    o || ({ start: u, end: l } = { start: l, end: u }), this.radii = t, this.clockwise = o, this.center = c, this.start = u, this.end = l;
  }
  draw(t, e) {
    t.lineTo(this.start.point, e), this.radii.circular ? t.addPathInstruction(rt.arc(
      this.center.x,
      this.center.y,
      this.radii.x,
      this.start.angle,
      this.end.angle,
      !this.clockwise
    ), e) : t.addPathInstruction(rt.ellipse(
      this.center.x,
      this.center.y,
      this.radii.x,
      this.radii.y,
      0,
      this.start.angle,
      this.end.angle,
      !this.clockwise
    ), e);
  }
}
class pr extends Wn {
  moveToEndingPoint(t, e) {
    t.moveTo(this.end.point, e);
  }
  finishRect(t, e) {
    this.draw(t, e), t.moveTo(this.corner, e);
  }
}
function vr(s, t, e) {
  return t === T.Negative && (s = mr(s)), e === T.Negative && (s = gr(s)), s;
}
function wr(s, t, e) {
  switch (s) {
    case U.TOPLEFT:
      return {
        center: new h(t.x + e.x, t.y + e.y),
        start: {
          angle: Math.PI,
          point: new h(t.x, t.y + e.y)
        },
        end: {
          angle: 3 * Math.PI / 2,
          point: new h(t.x + e.x, t.y)
        }
      };
    case U.TOPRIGHT:
      return {
        center: new h(t.x - e.x, t.y + e.y),
        start: {
          angle: 3 * Math.PI / 2,
          point: new h(t.x - e.x, t.y)
        },
        end: {
          angle: 0,
          point: new h(t.x, t.y + e.y)
        }
      };
    case U.BOTTOMRIGHT:
      return {
        center: new h(t.x - e.x, t.y - e.y),
        start: {
          angle: 0,
          point: new h(t.x, t.y - e.y)
        },
        end: {
          angle: Math.PI / 2,
          point: new h(t.x - e.x, t.y)
        }
      };
    case U.BOTTOMLEFT:
      return {
        center: new h(t.x + e.x, t.y - e.y),
        start: {
          angle: Math.PI / 2,
          point: new h(t.x + e.x, t.y)
        },
        end: {
          angle: Math.PI,
          point: new h(t.x, t.y - e.y)
        }
      };
  }
}
class Se {
  constructor(t, e, n, i) {
    this.corner = t, this.cornerOrientation = e, this.horizontalOrientation = n, this.verticalOrientation = i;
  }
  draw(t, e) {
    t.lineTo(this.corner, e);
  }
  round(t) {
    return t.x === 0 || t.y === 0 ? this : new Wn(
      t,
      this.corner,
      this.cornerOrientation,
      this.horizontalOrientation,
      this.verticalOrientation
    );
  }
}
class Pr {
  constructor(t, e, n, i) {
    this.corner = t, this.cornerOrientation = e, this.horizontalOrientation = n, this.verticalOrientation = i;
  }
  moveToEndingPoint(t, e) {
    t.moveTo(this.corner, e);
  }
  finishRect(t, e) {
    t.closePath(), t.moveTo(this.corner, e);
  }
  round(t) {
    return t.x === 0 || t.y === 0 ? this : new pr(
      t,
      this.corner,
      this.cornerOrientation,
      this.horizontalOrientation,
      this.verticalOrientation
    );
  }
}
class ke {
  constructor(t, e) {
    this.point = t, this.direction = e;
  }
  draw(t, e) {
    t.lineTo(this.point, e), t.lineTo(this.direction, e);
  }
}
class Cr {
  constructor(t, e) {
    this.point = t, this.direction = e;
  }
  moveToEndingPoint(t, e) {
    t.moveTo(this.direction, e);
  }
  finishRect(t, e) {
    t.lineTo(this.point, e), t.lineTo(this.direction, e), t.closePath(), t.moveTo(this.direction, e);
  }
}
class ye {
  constructor(t) {
    this.direction = t;
  }
  draw(t, e) {
    t.lineTo(this.direction, e);
  }
}
class Ir {
  constructor(t) {
    this.direction = t;
  }
  moveToEndingPoint(t, e) {
    t.moveTo(this.direction, e);
  }
  finishRect(t, e) {
    t.closePath(), t.moveTo(this.direction, e);
  }
}
class He {
  constructor(t, e) {
    a(this, "horizontalLineEnd");
    a(this, "horizontalLineStart");
    a(this, "verticalLineEnd");
    a(this, "verticalLineStart");
    this.start = t, this.orientation = e, this.horizontalLineStart = e === T.Positive ? jt : Qt, this.horizontalLineEnd = e === T.Positive ? Qt : jt, this.verticalLineStart = e === T.Positive ? Kt : $t, this.verticalLineEnd = e === T.Positive ? $t : Kt;
  }
  createTopLeftAtVerticalInfinity(t) {
    return new Cr(new h(t.finiteStart, 0), this.verticalLineStart);
  }
  createBottomRightAtInfinity(t) {
    return new ke(new h(t.end, 0), this.verticalLineEnd);
  }
  createRightAtInfinity(t) {
    return new ye(t.horizontalLineEnd);
  }
  createBottomAtInfinity() {
    return new ye(this.verticalLineEnd);
  }
  addVerticalDimension(t) {
    return t.addEntireHorizontalDimension(this);
  }
  addEntireHorizontalDimension(t) {
    return new fr(t, this);
  }
  addHorizontalDimensionAtInfinity(t) {
    return new Te(t, this);
  }
  addHorizontalDimensionWithStart(t) {
    const e = this.createTopLeftAtVerticalInfinity(t), n = this.createRightAtInfinity(t), i = this.createBottomAtInfinity();
    return new er(t, e, n, i);
  }
  addHorizontalDimensionWithStartAndEnd(t) {
    const e = this.createTopLeftAtVerticalInfinity(t), n = this.createBottomRightAtInfinity(t);
    return new rr(t, e, n);
  }
}
class Wt extends He {
  addVerticalDimension(t) {
    return t.addHorizontalDimensionAtInfinity(this);
  }
  addEntireHorizontalDimension(t) {
    return new Te(t, this);
  }
  addHorizontalDimensionAtInfinity(t) {
    return new Te(t, this);
  }
  addHorizontalDimensionWithStart() {
    return new _t(this.verticalLineEnd);
  }
  addHorizontalDimensionWithStartAndEnd() {
    return new _t(this.verticalLineEnd);
  }
}
class kn extends He {
  constructor(t, e) {
    super(e, t), this.finiteStart = e;
  }
  createBottomLeftAtInfinity(t) {
    return new ye(t.horizontalLineStart);
  }
  createLeftAtInfinity(t) {
    return new Ir(t.horizontalLineStart);
  }
  createTopRightAtHorizontalInfinity(t) {
    return new ke(new h(0, this.finiteStart), t.horizontalLineEnd);
  }
  createTopLeft(t) {
    return new Pr(
      new h(t.finiteStart, this.finiteStart),
      U.TOPLEFT,
      t.orientation,
      this.orientation
    );
  }
  createTopRight(t) {
    return new Se(
      new h(t.end, this.finiteStart),
      U.TOPRIGHT,
      t.orientation,
      this.orientation
    );
  }
  getStartingHalfPlaneWithHorizontalCrossSection() {
    const t = this.orientation === T.Positive ? new h(1, 0) : new h(-1, 0), e = new h(this.finiteStart, 0);
    return new P(e, t);
  }
  getStartingHalfPlaneWithVerticalCrossSection() {
    const t = this.orientation === T.Positive ? new h(0, 1) : new h(0, -1), e = new h(0, this.finiteStart);
    return new P(e, t);
  }
  addVerticalDimension(t) {
    return t.addHorizontalDimensionWithStart(this);
  }
  addEntireHorizontalDimension(t) {
    const e = this.createLeftAtInfinity(t), n = this.createTopRightAtHorizontalInfinity(t), i = this.createBottomAtInfinity(), r = this.createBottomLeftAtInfinity(t);
    return new nr(this, e, n, i, r);
  }
  addHorizontalDimensionAtInfinity(t) {
    return new _t(t.horizontalLineEnd);
  }
  addHorizontalDimensionWithStart(t) {
    const e = this.createRightAtInfinity(t), n = this.createBottomAtInfinity(), i = this.createTopLeft(t);
    return new ir(t, this, i, e, n);
  }
  addHorizontalDimensionWithStartAndEnd(t) {
    const e = this.createBottomAtInfinity(), n = this.createTopLeft(t), i = this.createTopRight(t);
    return new ar(t, this, n, i, e);
  }
  getHalfPlanesWithHorizontalCrossSection() {
    return [this.getStartingHalfPlaneWithHorizontalCrossSection()];
  }
  getHalfPlanesWithVerticalCrossSection() {
    return [this.getStartingHalfPlaneWithVerticalCrossSection()];
  }
}
class Hn extends kn {
  constructor(t, e, n) {
    super(t, e), this.end = n;
  }
  createBottomLeftAtHorizontalInfinity(t) {
    return new ke(new h(0, this.end), t.horizontalLineStart);
  }
  getEndingHalfPlaneWithHorizontalCrossSection() {
    const t = this.orientation === T.Positive ? new h(-1, 0) : new h(1, 0), e = new h(this.end, 0);
    return new P(e, t);
  }
  getEndingHalfPlaneWithVerticalCrossSection() {
    const t = this.orientation === T.Positive ? new h(0, -1) : new h(0, 1), e = new h(0, this.end);
    return new P(e, t);
  }
  createBottomLeft(t) {
    return new Se(
      new h(t.finiteStart, this.end),
      U.BOTTOMLEFT,
      t.orientation,
      this.orientation
    );
  }
  createBottomRight(t) {
    return new Se(
      new h(t.end, this.end),
      U.BOTTOMRIGHT,
      t.orientation,
      this.orientation
    );
  }
  getLength() {
    return Math.abs(this.end - this.finiteStart);
  }
  addEntireHorizontalDimension(t) {
    const e = this.createLeftAtInfinity(t), n = this.createTopRightAtHorizontalInfinity(t), i = this.createBottomLeftAtHorizontalInfinity(t);
    return new cr(this, e, n, i);
  }
  addHorizontalDimensionAtInfinity(t) {
    return new _t(t.horizontalLineEnd);
  }
  addVerticalDimension(t) {
    return t.addHorizontalDimensionWithStartAndEnd(this);
  }
  addHorizontalDimensionWithStart(t) {
    const e = this.createRightAtInfinity(t), n = this.createTopLeft(t), i = this.createBottomLeft(t);
    return new hr(this, t, n, e, i);
  }
  addHorizontalDimensionWithStartAndEnd(t) {
    const e = this.createTopLeft(t), n = this.createTopRight(t), i = this.createBottomLeft(t), r = this.createBottomRight(t);
    return new lr(
      this,
      t,
      e,
      n,
      r,
      i
    );
  }
  getHalfPlanesWithHorizontalCrossSection() {
    return [
      this.getStartingHalfPlaneWithHorizontalCrossSection(),
      this.getEndingHalfPlaneWithHorizontalCrossSection()
    ];
  }
  getHalfPlanesWithVerticalCrossSection() {
    return [
      this.getStartingHalfPlaneWithVerticalCrossSection(),
      this.getEndingHalfPlaneWithVerticalCrossSection()
    ];
  }
}
function on(s, t) {
  const e = t > 0 ? T.Positive : T.Negative;
  return new Hn(e, s, s + t);
}
function an(s, t) {
  const e = t > 0 ? T.Positive : T.Negative, n = new He(s, e);
  return Number.isFinite(s) ? Number.isFinite(t) ? new Hn(e, s, s + t) : new kn(e, s) : Number.isFinite(t) ? s < 0 ? new Wt(s, T.Negative) : new Wt(s, T.Positive) : s > 0 ? e === T.Positive ? new Wt(s, T.Positive) : n : e === T.Positive ? n : new Wt(s, T.Negative);
}
function tt(s, t, e, n) {
  const i = an(s, e), r = an(t, n);
  return i.addVerticalDimension(r);
}
function cn(s, t, e, n) {
  const i = on(s, e);
  return on(t, n).addHorizontalDimensionWithStartAndEnd(i);
}
class Tr {
  constructor(t) {
    this.viewBox = t;
  }
  fillText(t, e, n, i) {
    let r = i === void 0 ? (o) => {
      o.fillText(t, e, n);
    } : (o) => {
      o.fillText(t, e, n, i);
    };
    this.viewBox.addDrawing(r, this.getDrawnRectangle(e, n, t), z.Relative, !0);
  }
  measureText(t) {
    return this.viewBox.measureText(t);
  }
  strokeText(t, e, n, i) {
    let r = i === void 0 ? (o) => {
      o.strokeText(t, e, n);
    } : (o) => {
      o.strokeText(t, e, n, i);
    };
    this.viewBox.addDrawing(r, this.getDrawnRectangle(e, n, t), z.Relative, !0);
  }
  getDrawnRectangle(t, e, n) {
    const i = this.viewBox.measureText(n);
    let r;
    i.actualBoundingBoxRight !== void 0 ? r = Math.abs(i.actualBoundingBoxRight - i.actualBoundingBoxLeft) : r = i.width;
    const o = i.actualBoundingBoxAscent !== void 0 ? i.actualBoundingBoxAscent + i.actualBoundingBoxDescent : 1, c = i.actualBoundingBoxAscent !== void 0 ? i.actualBoundingBoxAscent : 0;
    return tt(t, e - c, r, o).getArea();
  }
}
function Sr(s) {
  return typeof s.duration < "u";
}
function yr(s) {
  return Sr(s) ? {
    width: s.displayWidth,
    height: s.displayHeight
  } : {
    width: s.width,
    height: s.height
  };
}
class xr {
  constructor(t) {
    this.viewBox = t;
  }
  drawImage() {
    const t = Array.prototype.slice.apply(arguments);
    let e, n, i, r, o, c, u, l, f;
    arguments.length <= 5 ? [e, c, u, l, f] = t : [e, n, i, r, o, c, u, l, f] = t;
    const { width: d, height: m } = yr(e), w = this.getDrawnLength(d, n, r, l), C = this.getDrawnLength(m, i, o, f), S = tt(c, u, w, C).getArea(), L = this.getDrawImageInstruction(arguments.length, e, n, i, r, o, c, u, l, f);
    this.viewBox.addDrawing(L, S, z.Relative, !0);
  }
  getDrawImageInstruction(t, e, n, i, r, o, c, u, l, f) {
    switch (t) {
      case 3:
        return (d) => {
          d.drawImage(e, c, u);
        };
      case 5:
        return (d) => {
          d.drawImage(e, c, u, l, f);
        };
      case 9:
        return (d) => {
          d.drawImage(e, n, i, r, o, c, u, l, f);
        };
      default:
        throw new TypeError(`Failed to execute 'drawImage' on 'CanvasRenderingContext2D': Valid arities are: [3, 5, 9], but ${t} arguments provided.`);
    }
  }
  getDrawnLength(t, e, n, i) {
    const r = this.getLength(t);
    return i !== void 0 ? i : e !== void 0 ? n !== void 0 ? n : r - e : r;
  }
  getLength(t) {
    return typeof t == "number" ? t : t.baseVal.value;
  }
}
function br(s, t, e, n, i) {
  t = t === void 0 ? 0 : t, e = e === void 0 ? 0 : e, n = n === void 0 ? s.width : n, i = i === void 0 ? s.height : i;
  const r = s.data, o = new Uint8ClampedArray(4 * n * i);
  for (let c = 0; c < i; c++)
    for (let u = 0; u < n; u++) {
      const l = 4 * ((e + c) * s.width + t + u), f = 4 * (c * n + u);
      o[f] = r[l], o[f + 1] = r[l + 1], o[f + 2] = r[l + 2], o[f + 3] = r[l + 3];
    }
  return new ImageData(o, n, i);
}
class te {
  constructor(t, e, n) {
    this.area = t, this.latestClippedPath = e, this.previouslyClippedPaths = n;
  }
  withClippedPath(t) {
    const e = t.area.intersectWith(this.area);
    return new te(e, t, this);
  }
  get initialState() {
    return this.previouslyClippedPaths ? this.previouslyClippedPaths.initialState : this.latestClippedPath.initialState;
  }
  except(t) {
    if (t !== this)
      return this.previouslyClippedPaths ? new te(this.area, this.latestClippedPath, this.previouslyClippedPaths.except(t)) : this;
  }
  contains(t) {
    return t ? this === t ? !0 : this.previouslyClippedPaths ? this.previouslyClippedPaths.contains(t) : !1 : !1;
  }
  getInstructionToRecreate() {
    const t = (e, n) => {
      this.latestClippedPath.execute(e, n);
    };
    if (this.previouslyClippedPaths) {
      const e = this.previouslyClippedPaths.getInstructionToRecreate(), n = this.previouslyClippedPaths.latestClippedPath.state.getInstructionToConvertToState(this.latestClippedPath.initialState);
      return (i, r) => {
        e(i, r), n(i, r), t(i, r);
      };
    }
    return t;
  }
}
class Or extends y {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.direction = t;
    };
  }
}
const Ve = new Or("direction", x);
class Lr extends y {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.font = t;
    };
  }
}
const Me = new Lr("font", x);
class Vn {
  constructor(t) {
    this.propertyName = t;
  }
  changeInstanceValue(t, e) {
    return this.valuesAreEqual(t[this.propertyName], e) ? t : t.changeProperty(this.propertyName, e);
  }
  isEqualForInstances(t, e) {
    return this.valuesAreEqual(t[this.propertyName], e[this.propertyName]);
  }
  valueIsTransformableForInstance(t) {
    return !0;
  }
  changeToNewValue(t, e) {
    return e ? this.changeToNewValueTransformed(t) : this.changeToNewValueUntransformed(t);
  }
  getInstructionToChange(t, e) {
    const n = t[this.propertyName], i = e[this.propertyName];
    return this.valuesAreEqual(n, i) && (t.fillAndStrokeStylesTransformed === e.fillAndStrokeStylesTransformed || this.valuesAreEqualWhenTransformed(n, i)) ? () => {
    } : this.changeToNewValue(i, e.fillAndStrokeStylesTransformed);
  }
}
class Mn extends Vn {
  constructor(t) {
    super(t);
  }
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValueTransformed(t) {
    return (e, n) => {
      const i = n.userTransformation;
      e[this.propertyName] = t * i.scale;
    };
  }
  changeToNewValueUntransformed(t) {
    return (e) => {
      e[this.propertyName] = t;
    };
  }
  valuesAreEqualWhenTransformed(t, e) {
    return t === 0 && e === 0;
  }
}
const Nn = new Mn("lineWidth"), zn = new Mn("lineDashOffset");
class Br extends Vn {
  valuesAreEqual(t, e) {
    if (t.length !== e.length)
      return !1;
    for (let n = 0; n < t.length; n++)
      if (t[n] !== e[n])
        return !1;
    return !0;
  }
  changeToNewValueTransformed(t) {
    return (e, n) => {
      const i = n.userTransformation;
      e.setLineDash(t.map((r) => r * i.scale));
    };
  }
  changeToNewValueUntransformed(t) {
    return (e) => {
      e.setLineDash(t);
    };
  }
  valuesAreEqualWhenTransformed(t, e) {
    return t.length === 0 && e.length === 0;
  }
}
const qn = new Br("lineDash");
class Ar extends y {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.textAlign = t;
    };
  }
}
const Ne = new Ar("textAlign", x);
class Dr extends y {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.textBaseline = t;
    };
  }
}
const ze = new Dr("textBaseline", x);
class Er extends y {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.lineCap = t;
  }
}
const Gn = new Er("lineCap", x);
class Rr extends y {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.lineJoin = t;
  }
}
const Yn = new Rr("lineJoin", x);
class Fr extends y {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.miterLimit = t;
  }
}
const Xn = new Fr("miterLimit", x);
class Wr extends y {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.fontKerning = t;
  }
}
const Un = new Wr("fontKerning", x), pe = [
  Ve,
  Cn,
  In,
  yn,
  zn,
  qn,
  Gn,
  Yn,
  Xn,
  wn,
  Pn,
  Rn,
  Nn,
  xn,
  Ne,
  ze,
  Gt,
  Me,
  Un,
  Ce,
  On,
  bn
], kr = [
  Me,
  Ne,
  ze,
  Ve
], gt = class gt {
  constructor(t) {
    a(this, "fillStyle");
    a(this, "fontKerning");
    a(this, "lineWidth");
    a(this, "lineDash");
    a(this, "lineCap");
    a(this, "lineJoin");
    a(this, "miterLimit");
    a(this, "globalAlpha");
    a(this, "globalCompositeOperation");
    a(this, "filter");
    a(this, "strokeStyle");
    a(this, "lineDashOffset");
    a(this, "transformation");
    a(this, "direction");
    a(this, "imageSmoothingEnabled");
    a(this, "imageSmoothingQuality");
    a(this, "font");
    a(this, "textAlign");
    a(this, "textBaseline");
    a(this, "clippedPaths");
    a(this, "fillAndStrokeStylesTransformed");
    a(this, "shadowOffset");
    a(this, "shadowColor");
    a(this, "shadowBlur");
    this.fillStyle = t.fillStyle, this.fontKerning = t.fontKerning, this.lineWidth = t.lineWidth, this.lineCap = t.lineCap, this.lineJoin = t.lineJoin, this.lineDash = t.lineDash, this.miterLimit = t.miterLimit, this.globalAlpha = t.globalAlpha, this.globalCompositeOperation = t.globalCompositeOperation, this.filter = t.filter, this.strokeStyle = t.strokeStyle, this.lineDashOffset = t.lineDashOffset, this.transformation = t.transformation, this.direction = t.direction, this.imageSmoothingEnabled = t.imageSmoothingEnabled, this.imageSmoothingQuality = t.imageSmoothingQuality, this.font = t.font, this.textAlign = t.textAlign, this.textBaseline = t.textBaseline, this.clippedPaths = t.clippedPaths, this.fillAndStrokeStylesTransformed = t.fillAndStrokeStylesTransformed, this.shadowOffset = t.shadowOffset, this.shadowColor = t.shadowColor, this.shadowBlur = t.shadowBlur;
  }
  changeProperty(t, e) {
    const {
      fillStyle: n,
      fontKerning: i,
      lineWidth: r,
      lineDash: o,
      lineCap: c,
      lineJoin: u,
      miterLimit: l,
      globalAlpha: f,
      globalCompositeOperation: d,
      filter: m,
      strokeStyle: w,
      lineDashOffset: C,
      transformation: S,
      direction: L,
      imageSmoothingEnabled: V,
      imageSmoothingQuality: j,
      font: Q,
      textAlign: Pt,
      textBaseline: Ct,
      clippedPaths: It,
      fillAndStrokeStylesTransformed: ue,
      shadowOffset: de,
      shadowColor: fe,
      shadowBlur: ge
    } = this, Rt = {
      fillStyle: n,
      fontKerning: i,
      lineWidth: r,
      lineDash: o,
      lineCap: c,
      lineJoin: u,
      miterLimit: l,
      globalAlpha: f,
      globalCompositeOperation: d,
      filter: m,
      strokeStyle: w,
      lineDashOffset: C,
      transformation: S,
      direction: L,
      imageSmoothingEnabled: V,
      imageSmoothingQuality: j,
      font: Q,
      textAlign: Pt,
      textBaseline: Ct,
      clippedPaths: It,
      fillAndStrokeStylesTransformed: ue,
      shadowOffset: de,
      shadowColor: fe,
      shadowBlur: ge
    };
    return Rt[t] = e, new gt(Rt);
  }
  get clippingRegion() {
    return this.clippedPaths ? this.clippedPaths.area : void 0;
  }
  equals(t) {
    for (let e of pe)
      if (!e.isEqualForInstances(this, t))
        return !1;
    return (!this.clippedPaths && !t.clippedPaths || this.clippedPaths && this.clippedPaths === t.clippedPaths) && this.fillAndStrokeStylesTransformed === t.fillAndStrokeStylesTransformed;
  }
  getMaximumLineWidth() {
    return this.lineWidth * this.transformation.getMaximumLineWidthScale();
  }
  getLineDashPeriod() {
    return this.lineDash.reduce((t, e) => t + e, 0);
  }
  isTransformable() {
    for (let t of pe)
      if (!t.valueIsTransformableForInstance(this))
        return !1;
    return !0;
  }
  getShadowOffsets() {
    const t = [], e = this.filter.getShadowOffset();
    return e !== null && t.push(e), this.shadowOffset.equals(h.origin) || t.push(this.shadowOffset), t;
  }
  getInstructionToConvertToState(t) {
    return this.getInstructionToConvertToStateOnDimensions(t, pe);
  }
  withClippedPath(t) {
    const e = this.clippedPaths ? this.clippedPaths.withClippedPath(t) : new te(t.area, t);
    return this.changeProperty("clippedPaths", e);
  }
  getInstructionToConvertToStateOnDimensions(t, e) {
    const n = e.map((i) => i.getInstructionToChange(this, t));
    return $(...n);
  }
};
a(gt, "default", new gt({
  fillStyle: "#000",
  fontKerning: "auto",
  lineWidth: 1,
  lineDash: [],
  lineCap: "butt",
  lineJoin: "miter",
  miterLimit: 10,
  globalAlpha: 1,
  globalCompositeOperation: "source-over",
  filter: Ut.none,
  strokeStyle: "#000",
  lineDashOffset: 0,
  transformation: v.identity,
  direction: "inherit",
  imageSmoothingEnabled: !0,
  imageSmoothingQuality: "low",
  font: "10px sans-serif",
  textAlign: "start",
  textBaseline: "alphabetic",
  clippedPaths: void 0,
  fillAndStrokeStylesTransformed: !1,
  shadowOffset: h.origin,
  shadowColor: "rgba(0, 0, 0, 0)",
  shadowBlur: 0
})), a(gt, "setDefault", () => {
});
let H = gt;
class Hr {
  constructor(t) {
    this.viewBox = t;
  }
  createImageData(t, e) {
  }
  getImageData(t, e, n, i) {
  }
  putImageData(t, e, n, i, r, o, c) {
    t = br(t, i, r, o, c);
    let u, l = this.viewBox.getDrawingLock();
    this.viewBox.createPatternFromImageData(t).then((d) => {
      u = d, l.release();
    }), this.viewBox.addDrawing((d) => {
      d.translate(e, n), d.fillStyle = u, d.fillRect(0, 0, t.width, t.height);
    }, tt(e, n, t.width, t.height).getArea(), z.Absolute, !1, (d) => d.changeProperty("shadowColor", H.default.shadowColor).changeProperty("shadowOffset", H.default.shadowOffset).changeProperty("shadowBlur", H.default.shadowBlur).changeProperty("globalAlpha", H.default.globalAlpha).changeProperty("globalCompositeOperation", H.default.globalCompositeOperation).changeProperty("imageSmoothingEnabled", !1).changeProperty("filter", H.default.filter));
  }
}
class Vr {
  constructor(t) {
    this.viewBox = t;
  }
  get lineCap() {
    return this.viewBox.state.current.lineCap;
  }
  set lineCap(t) {
    this.viewBox.changeState((e) => Gn.changeInstanceValue(e, t));
  }
  get lineDashOffset() {
    return this.viewBox.state.current.lineDashOffset;
  }
  set lineDashOffset(t) {
    this.viewBox.changeState((e) => zn.changeInstanceValue(e, t));
  }
  get lineJoin() {
    return this.viewBox.state.current.lineJoin;
  }
  set lineJoin(t) {
    this.viewBox.changeState((e) => Yn.changeInstanceValue(e, t));
  }
  get lineWidth() {
    return this.viewBox.state.current.lineWidth;
  }
  set lineWidth(t) {
    this.viewBox.changeState((e) => Nn.changeInstanceValue(e, t));
  }
  get miterLimit() {
    return this.viewBox.state.current.miterLimit;
  }
  set miterLimit(t) {
    this.viewBox.changeState((e) => Xn.changeInstanceValue(e, t));
  }
  getLineDash() {
    return this.viewBox.state.current.lineDash;
  }
  setLineDash(t) {
    t.length % 2 === 1 && (t = t.concat(t)), this.viewBox.changeState((e) => qn.changeInstanceValue(e, t));
  }
}
class Mr {
  constructor(t) {
    this.viewBox = t;
  }
  set direction(t) {
    this.viewBox.changeState((e) => Ve.changeInstanceValue(e, t));
  }
  set font(t) {
    this.viewBox.changeState((e) => Me.changeInstanceValue(e, t));
  }
  set textAlign(t) {
    this.viewBox.changeState((e) => Ne.changeInstanceValue(e, t));
  }
  set textBaseline(t) {
    this.viewBox.changeState((e) => ze.changeInstanceValue(e, t));
  }
  set fontKerning(t) {
    this.viewBox.changeState((e) => Un.changeInstanceValue(e, t));
  }
}
class Nr {
  constructor(t) {
    this.viewBox = t;
  }
  arc(t, e, n, i, r, o) {
    this.viewBox.addPathInstruction(rt.arc(t, e, n, i, r, o));
  }
  arcTo(t, e, n, i, r) {
    this.viewBox.addPathInstruction(rt.arcTo(t, e, n, i, r));
  }
  closePath() {
    this.viewBox.closePath();
  }
  ellipse(t, e, n, i, r, o, c, u) {
    this.viewBox.addPathInstruction(rt.ellipse(t, e, n, i, r, o, c, u));
  }
  lineTo(t, e) {
    this.viewBox.lineTo(new h(t, e));
  }
  lineToInfinityInDirection(t, e) {
    this.viewBox.lineTo({ direction: new h(t, e) });
  }
  moveTo(t, e) {
    this.viewBox.moveTo(new h(t, e));
  }
  moveToInfinityInDirection(t, e) {
    this.viewBox.moveTo({ direction: new h(t, e) });
  }
  quadraticCurveTo(t, e, n, i) {
    this.viewBox.addPathInstruction(rt.quadraticCurveTo(t, e, n, i));
  }
  bezierCurveTo(t, e, n, i, r, o) {
    this.viewBox.addPathInstruction(rt.bezierCurveTo(t, e, n, i, r, o));
  }
  rect(t, e, n, i) {
    this.viewBox.rect(t, e, n, i);
  }
  roundRect(t, e, n, i, r) {
    this.viewBox.roundRect(t, e, n, i, r);
  }
}
class zr {
  constructor(t, e, n) {
    a(this, "canvasState");
    a(this, "canvasTransform");
    a(this, "canvasCompositing");
    a(this, "canvasImageSmoothing");
    a(this, "canvasStrokeStyles");
    a(this, "canvasShadowStyles");
    a(this, "canvasFilters");
    a(this, "canvasRect");
    a(this, "canvasDrawPath");
    a(this, "canvasUserInterface");
    a(this, "canvasText");
    a(this, "canvasDrawImage");
    a(this, "canvasImageData");
    a(this, "canvasPathDrawingStyles");
    a(this, "canvasTextDrawingStyles");
    a(this, "canvasPath");
    this.canvas = t, this.canvasState = new mi(e), this.canvasTransform = new vi(e), this.canvasCompositing = new Ci(e), this.canvasImageSmoothing = new Si(e), this.canvasStrokeStyles = new yi(e), this.canvasShadowStyles = new Li(e), this.canvasFilters = new Ai(e, n), this.canvasRect = new Di(e), this.canvasDrawPath = new Ei(e), this.canvasUserInterface = new Ri(), this.canvasText = new Tr(e), this.canvasDrawImage = new xr(e), this.canvasImageData = new Hr(e), this.canvasPathDrawingStyles = new Vr(e), this.canvasTextDrawingStyles = new Mr(e), this.canvasPath = new Nr(e);
  }
  getContextAttributes() {
    return this.canvas.getContext("2d").getContextAttributes();
  }
  save() {
    this.canvasState.save();
  }
  restore() {
    this.canvasState.restore();
  }
  reset() {
    this.canvasState.reset();
  }
  getTransform() {
    return this.canvasTransform.getTransform();
  }
  resetTransform() {
    this.canvasTransform.resetTransform();
  }
  rotate(t) {
    this.canvasTransform.rotate(t);
  }
  scale(t, e) {
    this.canvasTransform.scale(t, e);
  }
  setTransform(t, e, n, i, r, o) {
    this.canvasTransform.setTransform(t, e, n, i, r, o);
  }
  transform(t, e, n, i, r, o) {
    this.canvasTransform.transform(t, e, n, i, r, o);
  }
  translate(t, e) {
    this.canvasTransform.translate(t, e);
  }
  set globalAlpha(t) {
    this.canvasCompositing.globalAlpha = t;
  }
  set globalCompositeOperation(t) {
    this.canvasCompositing.globalCompositeOperation = t;
  }
  set imageSmoothingEnabled(t) {
    this.canvasImageSmoothing.imageSmoothingEnabled = t;
  }
  set imageSmoothingQuality(t) {
    this.canvasImageSmoothing.imageSmoothingQuality = t;
  }
  set fillStyle(t) {
    this.canvasStrokeStyles.fillStyle = t;
  }
  set strokeStyle(t) {
    this.canvasStrokeStyles.strokeStyle = t;
  }
  createLinearGradient(t, e, n, i) {
    return this.canvasStrokeStyles.createLinearGradient(t, e, n, i);
  }
  createPattern(t, e) {
    return this.canvasStrokeStyles.createPattern(t, e);
  }
  createRadialGradient(t, e, n, i, r, o) {
    return this.canvasStrokeStyles.createRadialGradient(t, e, n, i, r, o);
  }
  createConicGradient(t, e, n) {
    return this.canvasStrokeStyles.createConicGradient(t, e, n);
  }
  set shadowBlur(t) {
    this.canvasShadowStyles.shadowBlur = t;
  }
  set shadowColor(t) {
    this.canvasShadowStyles.shadowColor = t;
  }
  set shadowOffsetX(t) {
    this.canvasShadowStyles.shadowOffsetX = t;
  }
  set shadowOffsetY(t) {
    this.canvasShadowStyles.shadowOffsetY = t;
  }
  set filter(t) {
    this.canvasFilters.filter = t;
  }
  clearRect(t, e, n, i) {
    this.canvasRect.clearRect(t, e, n, i);
  }
  fillRect(t, e, n, i) {
    this.canvasRect.fillRect(t, e, n, i);
  }
  strokeRect(t, e, n, i) {
    this.canvasRect.strokeRect(t, e, n, i);
  }
  beginPath() {
    this.canvasDrawPath.beginPath();
  }
  clip(t, e) {
    this.canvasDrawPath.clip(t, e);
  }
  fill(t, e) {
    this.canvasDrawPath.fill(t, e);
  }
  isPointInPath(t, e, n, i) {
    return this.canvasDrawPath.isPointInPath(t, e, n, i);
  }
  isPointInStroke(t, e, n) {
    return this.canvasDrawPath.isPointInStroke(t, e, n);
  }
  stroke(t) {
    this.canvasDrawPath.stroke(t);
  }
  drawFocusIfNeeded(t, e) {
    this.canvasUserInterface.drawFocusIfNeeded(t, e);
  }
  scrollPathIntoView(t) {
    this.canvasUserInterface.scrollPathIntoView(t);
  }
  fillText(t, e, n, i) {
    this.canvasText.fillText(t, e, n, i);
  }
  measureText(t) {
    return this.canvasText.measureText(t);
  }
  strokeText(t, e, n, i) {
    this.canvasText.strokeText(t, e, n, i);
  }
  drawImage() {
    this.canvasDrawImage.drawImage.apply(this.canvasDrawImage, arguments);
  }
  createImageData(t, e) {
    return this.canvasImageData.createImageData(t, e);
  }
  getImageData(t, e, n, i) {
    return this.canvasImageData.getImageData(t, e, n, i);
  }
  putImageData(t, e, n, i, r, o, c) {
    this.canvasImageData.putImageData(t, e, n, i, r, o, c);
  }
  set lineCap(t) {
    this.canvasPathDrawingStyles.lineCap = t;
  }
  set lineDashOffset(t) {
    this.canvasPathDrawingStyles.lineDashOffset = t;
  }
  set lineJoin(t) {
    this.canvasPathDrawingStyles.lineJoin = t;
  }
  set lineWidth(t) {
    this.canvasPathDrawingStyles.lineWidth = t;
  }
  set miterLimit(t) {
    this.canvasPathDrawingStyles.miterLimit = t;
  }
  getLineDash() {
    return this.canvasPathDrawingStyles.getLineDash();
  }
  setLineDash(t) {
    this.canvasPathDrawingStyles.setLineDash(t);
  }
  set direction(t) {
    this.canvasTextDrawingStyles.direction = t;
  }
  set font(t) {
    this.canvasTextDrawingStyles.font = t;
  }
  set textAlign(t) {
    this.canvasTextDrawingStyles.textAlign = t;
  }
  set textBaseline(t) {
    this.canvasTextDrawingStyles.textBaseline = t;
  }
  set fontKerning(t) {
    this.canvasTextDrawingStyles.fontKerning = t;
  }
  arc(t, e, n, i, r, o) {
    this.canvasPath.arc(t, e, n, i, r, o);
  }
  arcTo(t, e, n, i, r) {
    this.canvasPath.arcTo(t, e, n, i, r);
  }
  bezierCurveTo(t, e, n, i, r, o) {
    this.canvasPath.bezierCurveTo(t, e, n, i, r, o);
  }
  closePath() {
    this.canvasPath.closePath();
  }
  ellipse(t, e, n, i, r, o, c, u) {
    this.canvasPath.ellipse(t, e, n, i, r, o, c);
  }
  lineTo(t, e) {
    this.canvasPath.lineTo(t, e);
  }
  lineToInfinityInDirection(t, e) {
    this.canvasPath.lineToInfinityInDirection(t, e);
  }
  moveTo(t, e) {
    this.canvasPath.moveTo(t, e);
  }
  moveToInfinityInDirection(t, e) {
    this.canvasPath.moveToInfinityInDirection(t, e);
  }
  quadraticCurveTo(t, e, n, i) {
    this.canvasPath.quadraticCurveTo(t, e, n, i);
  }
  rect(t, e, n, i) {
    this.canvasPath.rect(t, e, n, i);
  }
  roundRect(t, e, n, i, r) {
    this.canvasPath.roundRect(t, e, n, i, r);
  }
}
class qe extends Xt {
  constructor() {
    super(...arguments);
    a(this, "colorStops", []);
  }
  addColorStopsToGradient(e) {
    for (const n of this.colorStops)
      e.addColorStop(n.offset, n.color);
  }
  addColorStop(e, n) {
    this.colorStops.push({ offset: e, color: n });
  }
  getInstructionToSetTransformed(e) {
    return (n, i) => {
      const r = i.userTransformation;
      n[e] = this.createTransformedGradient(r);
    };
  }
  getInstructionToSetUntransformed(e) {
    return (n) => {
      n[e] = this.createGradient();
    };
  }
}
class qr extends qe {
  constructor(t, e, n, i, r) {
    super(), this.context = t, this.x0 = e, this.y0 = n, this.x1 = i, this.y1 = r;
  }
  createTransformedGradient(t) {
    const { x: e, y: n } = t.apply(new h(this.x0, this.y0)), { x: i, y: r } = t.apply(new h(this.x1, this.y1)), o = this.context.createLinearGradient(e, n, i, r);
    return this.addColorStopsToGradient(o), o;
  }
  createGradient() {
    const t = this.context.createLinearGradient(this.x0, this.y0, this.x1, this.y1);
    return this.addColorStopsToGradient(t), t;
  }
}
class Gr extends qe {
  constructor(t, e, n, i, r, o, c) {
    super(), this.context = t, this.x0 = e, this.y0 = n, this.r0 = i, this.x1 = r, this.y1 = o, this.r1 = c;
  }
  createTransformedGradient(t) {
    const { x: e, y: n } = t.apply(new h(this.x0, this.y0)), { x: i, y: r } = t.apply(new h(this.x1, this.y1)), o = this.r0 * t.scale, c = this.r1 * t.scale, u = this.context.createRadialGradient(e, n, o, i, r, c);
    return this.addColorStopsToGradient(u), u;
  }
  createGradient() {
    const t = this.context.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1);
    return this.addColorStopsToGradient(t), t;
  }
}
class $n {
  constructor(t) {
    a(this, "instructions", []);
    this.currentState = t;
  }
  restore() {
    this.addChangeToState(this.currentState.restored(), (t) => {
      t.restore();
    });
  }
  save() {
    this.addChangeToState(this.currentState.saved(), (t) => {
      t.save();
    });
  }
  changeCurrentInstanceTo(t) {
    if (this.currentState.current.equals(t))
      return;
    const e = this.currentState.current.getInstructionToConvertToState(t), n = this.currentState.withCurrentState(t);
    this.addChangeToState(n, e);
  }
  addChangeToState(t, e) {
    this.currentState = t, e && this.instructions.push(e);
  }
  get instruction() {
    if (this.instructions.length !== 0)
      return (t, e) => {
        for (const n of this.instructions)
          n(t, e);
      };
  }
}
class Ge extends $n {
  changeCurrentInstanceTo(t) {
    if (!this.currentState.current.equals(t)) {
      if (!Ge.canConvert(this.currentState.current, t))
        if (this.currentState.stack.length > 0)
          this.restore(), this.save();
        else {
          super.changeCurrentInstanceTo(t);
          return;
        }
      if (t.clippedPaths) {
        const e = this.currentState, i = e.current.clippedPaths;
        if (t.clippedPaths === i)
          super.changeCurrentInstanceTo(t);
        else {
          const o = t.clippedPaths.except(i);
          this.convertToState(o.initialState), this.addChangeToState(o.latestClippedPath.state, o.getInstructionToRecreate()), this.convertToState(e.replaceCurrent(t));
        }
      } else
        super.changeCurrentInstanceTo(t);
    }
  }
  convertToState(t) {
    const e = this.currentState.getInstructionToConvertToState(t);
    this.addChangeToState(t, e);
  }
  static canConvert(t, e) {
    return t.clippedPaths ? e.clippedPaths ? e.clippedPaths.contains(t.clippedPaths) : !1 : !0;
  }
}
class Z {
  constructor(t, e = []) {
    this.current = t, this.stack = e;
  }
  replaceCurrent(t) {
    return new Z(t, this.stack);
  }
  withCurrentState(t) {
    return new Z(t, this.stack);
  }
  currentlyTransformed(t) {
    return this.withCurrentState(this.current.changeProperty("fillAndStrokeStylesTransformed", t));
  }
  withClippedPath(t) {
    return new Z(this.current.withClippedPath(t), this.stack);
  }
  saved() {
    return new Z(this.current, (this.stack || []).concat([this.current]));
  }
  restored() {
    if (!this.stack || this.stack.length === 0)
      return this;
    const t = this.stack[this.stack.length - 1];
    return new Z(t, this.stack.slice(0, this.stack.length - 1));
  }
  convertToLastSavedInstance(t, e) {
    for (let n = this.stack.length - 1; n > e; n--)
      t.restore();
  }
  convertFromLastSavedInstance(t, e) {
    for (let n = e + 1; n < this.stack.length; n++)
      t.changeCurrentInstanceTo(this.stack[n]), t.save();
    t.changeCurrentInstanceTo(this.current);
  }
  getInstructionToConvertToStateUsingConversion(t, e) {
    const n = Z.findIndexOfHighestCommon(this.stack, e.stack);
    return this.convertToLastSavedInstance(t, n), e.convertFromLastSavedInstance(t, n), t.instruction;
  }
  getInstructionToConvertToState(t) {
    return this.getInstructionToConvertToStateUsingConversion(new $n(this), t);
  }
  getInstructionToConvertToStateWithClippedPath(t) {
    return this.getInstructionToConvertToStateUsingConversion(new Ge(this), t);
  }
  static findIndexOfHighestCommon(t, e) {
    let n = 0, i = Math.min(t.length - 1, e.length - 1);
    for (; n <= i; ) {
      if (!t[n].equals(e[n]))
        return n - 1;
      n++;
    }
    return n - 1;
  }
}
const hn = new Z(H.default, []);
class Yr {
  constructor(t) {
    this.area = t;
  }
  hasDrawingAcrossBorderOf(t) {
    return !1;
  }
  intersects(t) {
    return this.area.intersects(t);
  }
  isContainedBy(t) {
    return t.contains(this.area);
  }
}
class Ye extends K {
  constructor(e, n, i, r, o) {
    super(e, n, i, r);
    a(this, "drawingArea");
    this.drawingArea = new Yr(o);
  }
  static createClearRect(e, n, i, r, o, c, u) {
    return new Ye(e, e, (l, f) => {
      i.clearRect(l, f, r, o, c, u);
    }, () => {
    }, n);
  }
}
class ee extends Ee {
  reconstructState(t, e) {
    e.setInitialStateWithClippedPaths(t);
  }
  hasDrawingAcrossBorderOf(t) {
    return this.contains((e) => e.drawingArea.hasDrawingAcrossBorderOf(t));
  }
  intersects(t) {
    return this.contains((e) => e.drawingArea.intersects(t));
  }
  addClearRect(t, e, n, i, r, o) {
    const u = new Fe({ lineWidth: 0, lineDashPeriod: 0, shadowOffsets: [] }).getInfinity(e), l = Ye.createClearRect(e, t, u, n, i, r, o);
    l.setInitialState(this.state), this.add(l);
  }
  clearContentsInsideArea(t) {
    this.removeAll((e) => e.drawingArea.isContainedBy(t));
  }
  static create() {
    return new ee(new K(hn, hn, H.setDefault, () => {
    }));
  }
}
class Xr {
  constructor(t) {
    this.area = t;
  }
  hasDrawingAcrossBorderOf(t) {
    return this.isContainedBy(t) ? !1 : this.intersects(t);
  }
  isContainedBy(t) {
    return t.contains(this.area);
  }
  intersects(t) {
    return this.area.intersects(t);
  }
}
class Ur {
  constructor(t, e) {
    a(this, "drawingArea");
    this.instructions = t, this.drawingArea = new Xr(e);
  }
  get state() {
    return this.instructions.state;
  }
  get initialState() {
    return this.instructions.initialState;
  }
  get stateOfFirstInstruction() {
    return this.instructions.stateOfFirstInstruction;
  }
  setInitialState(t) {
    this.instructions.setInitialState(t);
  }
  setInitialStateWithClippedPaths(t) {
    this.instructions.setInitialStateWithClippedPaths(t);
  }
  addClippedPath(t) {
    this.instructions.addClippedPath(t);
  }
  execute(t, e) {
    this.instructions.execute(t, e);
  }
}
function $r(s, t, e, n) {
  if (e === void 0) {
    t.addSubpaths(s, n);
    return;
  }
  let i = or(e);
  if (!i)
    return;
  t.getRoundRect(i).addSubpaths(s, n);
}
class Kr {
  constructor(t) {
    a(this, "currentInstructionsWithPath");
    a(this, "previousInstructionsWithPath");
    a(this, "state");
    this.onChange = t, this.previousInstructionsWithPath = ee.create(), this.state = this.previousInstructionsWithPath.state;
  }
  beginPath() {
    const t = xt.create(this.state);
    t.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state), this.currentInstructionsWithPath = t;
  }
  changeState(t) {
    this.state = this.state.withCurrentState(t(this.state.current));
  }
  saveState() {
    this.state = this.state.saved();
  }
  restoreState() {
    this.state = this.state.restored();
  }
  resetState() {
    this.previousInstructionsWithPath = ee.create(), this.state = this.previousInstructionsWithPath.state, this.currentInstructionsWithPath = void 0, this.onChange();
  }
  allSubpathsAreClosable() {
    return !this.currentInstructionsWithPath || this.currentInstructionsWithPath.allSubpathsAreClosable();
  }
  currentPathSurroundsFinitePoint() {
    return this.currentInstructionsWithPath && this.currentInstructionsWithPath.surroundsFinitePoint();
  }
  currentSubpathIsClosable() {
    return !this.currentInstructionsWithPath || this.currentInstructionsWithPath.currentSubpathIsClosable();
  }
  fillPath(t) {
    if (!this.currentInstructionsWithPath)
      return;
    const e = M.forFillingPath(t, this.state, () => this.currentInstructionsWithPath);
    this.state = e.state, this.incorporateDrawingInstruction(e);
  }
  strokePath() {
    if (!this.currentInstructionsWithPath)
      return;
    const t = M.forStrokingPath((e) => {
      e.stroke();
    }, this.state, () => this.currentInstructionsWithPath);
    this.state = t.state, this.incorporateDrawingInstruction(t);
  }
  fillRect(t, e) {
    const n = t.fill(this.state, e);
    n && this.incorporateDrawingInstruction(n);
  }
  strokeRect(t) {
    const e = t.stroke(this.state, (n) => {
      n.stroke();
    });
    e && this.incorporateDrawingInstruction(e);
  }
  addDrawing(t, e, n, i, r) {
    const o = this.state.currentlyTransformed(!1);
    n === z.Relative && (e = e.transform(this.state.current.transformation));
    let c;
    r && (c = o.withCurrentState(r(o.current))), this.incorporateDrawingInstruction(new M(
      t,
      e,
      (u) => K.create(o, u),
      i,
      n,
      o,
      c
    ));
  }
  clipPath(t) {
    this.clipCurrentPath(t);
  }
  incorporateDrawingInstruction(t) {
    const e = t.getDrawnArea();
    if (e === A)
      return;
    const n = t.getModifiedInstruction();
    this.addToPreviousInstructions(n, e, t.build), this.currentInstructionsWithPath || (this.state = this.previousInstructionsWithPath.state), this.onChange();
  }
  addToPreviousInstructions(t, e, n) {
    const i = new Ur(n(t), e);
    i.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state), this.previousInstructionsWithPath.add(i);
  }
  clipCurrentPath(t) {
    this.currentInstructionsWithPath && (this.currentInstructionsWithPath.clipPath(t, this.state), this.state = this.currentInstructionsWithPath.state);
  }
  addPathInstruction(t) {
    this.currentInstructionsWithPath && this.currentInstructionsWithPath.addPathInstruction(t, this.state);
  }
  closePath() {
    this.currentInstructionsWithPath && this.currentInstructionsWithPath.closePath();
  }
  moveTo(t) {
    this.currentInstructionsWithPath && this.currentInstructionsWithPath.moveTo(t, this.state);
  }
  canAddLineTo(t) {
    return !this.currentInstructionsWithPath || this.currentInstructionsWithPath.canAddLineTo(t, this.state);
  }
  lineTo(t) {
    this.currentInstructionsWithPath && this.currentInstructionsWithPath.lineTo(t, this.state);
  }
  rect(t) {
    this.currentInstructionsWithPath && t.addSubpaths(this.currentInstructionsWithPath, this.state);
  }
  roundRect(t, e) {
    this.currentInstructionsWithPath && $r(this.currentInstructionsWithPath, t, e, this.state);
  }
  intersects(t) {
    return this.previousInstructionsWithPath.intersects(t);
  }
  clearContentsInsideArea(t) {
    this.previousInstructionsWithPath.clearContentsInsideArea(t), this.currentInstructionsWithPath && this.currentInstructionsWithPath.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
  }
  clearArea(t, e, n, i) {
    const o = tt(t, e, n, i).getArea();
    if (!o)
      return;
    const c = o.transform(this.state.current.transformation);
    this.intersects(c) && (this.clearContentsInsideArea(c), this.previousInstructionsWithPath.hasDrawingAcrossBorderOf(c) && (this.previousInstructionsWithPath.addClearRect(o, this.state, t, e, n, i), this.currentInstructionsWithPath && this.currentInstructionsWithPath.setInitialStateWithClippedPaths(this.state)), this.onChange());
  }
  execute(t, e) {
    this.previousInstructionsWithPath.length && this.previousInstructionsWithPath.execute(t, e);
    const i = this.previousInstructionsWithPath.state.stack.length;
    for (let r = 0; r < i; r++)
      t.restore();
  }
}
class jr extends qe {
  constructor(t, e, n, i) {
    super(), this.context = t, this.startAngle = e, this.x = n, this.y = i;
  }
  createTransformedGradient(t) {
    const { x: e, y: n } = t.apply(new h(this.x, this.y)), i = t.getRotationAngle(), r = this.context.createConicGradient(this.startAngle + i, e, n);
    return this.addColorStopsToGradient(r), r;
  }
  createGradient() {
    const t = this.context.createConicGradient(this.startAngle, this.x, this.y);
    return this.addColorStopsToGradient(t), t;
  }
}
class Qr {
  constructor(t, e, n, i, r) {
    a(this, "instructionSet");
    this.rectangleManager = t, this.context = e, this.drawingIterationProvider = n, this.drawLockProvider = i, this.isTransforming = r, this.instructionSet = new Kr(() => this.draw());
  }
  get width() {
    return this.rectangleManager.rectangle.viewboxWidth;
  }
  get height() {
    return this.rectangleManager.rectangle.viewboxHeight;
  }
  get state() {
    return this.instructionSet.state;
  }
  get transformation() {
    return this.rectangleManager.rectangle.userTransformation;
  }
  set transformation(t) {
    this.rectangleManager.setTransformation(t), this.draw();
  }
  getDrawingLock() {
    return this.drawLockProvider();
  }
  changeState(t) {
    this.instructionSet.changeState(t);
  }
  measureText(t) {
    this.context.save(), H.default.getInstructionToConvertToStateOnDimensions(this.state.currentlyTransformed(!1).current, kr)(this.context);
    const n = this.context.measureText(t);
    return this.context.restore(), n;
  }
  saveState() {
    this.instructionSet.saveState();
  }
  restoreState() {
    this.instructionSet.restoreState();
  }
  resetState() {
    this.instructionSet.resetState();
  }
  beginPath() {
    this.instructionSet.beginPath();
  }
  async createPatternFromImageData(t) {
    const e = await createImageBitmap(t);
    return this.context.createPattern(e, "no-repeat");
  }
  addDrawing(t, e, n, i, r) {
    this.instructionSet.addDrawing(t, e, n, i, r);
  }
  addPathInstruction(t) {
    this.instructionSet.addPathInstruction(t);
  }
  closePath() {
    this.instructionSet.currentSubpathIsClosable() && this.instructionSet.closePath();
  }
  moveTo(t) {
    this.instructionSet.moveTo(t);
  }
  lineTo(t) {
    this.instructionSet.canAddLineTo(t) && this.instructionSet.lineTo(t);
  }
  rect(t, e, n, i) {
    const r = tt(t, e, n, i);
    this.instructionSet.rect(r);
  }
  roundRect(t, e, n, i, r) {
    const o = tt(t, e, n, i);
    this.instructionSet.roundRect(o, r);
  }
  currentPathCanBeFilled() {
    return this.instructionSet.allSubpathsAreClosable() && this.instructionSet.currentPathSurroundsFinitePoint();
  }
  fillPath(t) {
    this.instructionSet.fillPath(t);
  }
  strokePath() {
    this.instructionSet.strokePath();
  }
  fillRect(t, e, n, i, r) {
    const o = tt(t, e, n, i);
    this.instructionSet.fillRect(o, r);
  }
  strokeRect(t, e, n, i) {
    const r = tt(t, e, n, i);
    this.instructionSet.strokeRect(r);
  }
  clipPath(t) {
    this.instructionSet.clipPath(t);
  }
  clearArea(t, e, n, i) {
    this.instructionSet.clearArea(t, e, n, i);
  }
  createLinearGradient(t, e, n, i) {
    return new qr(this.context, t, e, n, i);
  }
  createRadialGradient(t, e, n, i, r, o) {
    return new Gr(this.context, t, e, n, i, r, o);
  }
  createConicGradient(t, e, n) {
    return new jr(this.context, t, e, n);
  }
  createPattern(t, e) {
    let n;
    return n = new Tn(this.context.createPattern(t, e)), n;
  }
  draw() {
    this.drawingIterationProvider.provideDrawingIteration(() => (this.isTransforming() || this.rectangleManager.measure(), this.rectangleManager.rectangle ? (this.context.restore(), this.context.save(), this.context.clearRect(0, 0, this.width, this.height), this.setInitialTransformation(), this.instructionSet.execute(this.context, this.rectangleManager.rectangle), !0) : !1));
  }
  setInitialTransformation() {
    const t = this.rectangleManager.rectangle.initialBitmapTransformation;
    if (t.equals(v.identity))
      return;
    const { a: e, b: n, c: i, d: r, e: o, f: c } = t;
    this.context.setTransform(e, n, i, r, o, c);
  }
}
class Jr {
  constructor(t, e) {
    a(this, "point");
    a(this, "angularVelocity");
    a(this, "initialTransformation");
    this.context = e, this.initialTransformation = e.transformation, this.angularVelocity = Math.PI / 100, this.point = t.onMoved(() => {
      this.setTransformation();
    }, !1);
  }
  setTransformation() {
    this.context.transformation = this.initialTransformation.before(v.rotation(
      this.point.initial.x,
      this.point.initial.y,
      (this.point.initial.x - this.point.current.x) * this.angularVelocity
    ));
  }
  withAnchor(t) {
    return this;
  }
  withoutAnchor(t) {
    this.point.cancel();
  }
  end() {
    this.point.cancel();
  }
}
class Zr {
  constructor(t, e, n, i, r) {
    a(this, "maxScaleLogStep");
    a(this, "currentScaleLog");
    a(this, "targetScaleLog");
    a(this, "stepTimeout");
    a(this, "initialTransformation");
    this.transformable = t, this.centerX = e, this.centerY = n, this.onFinish = r, this.initialTransformation = t.transformation, this.maxScaleLogStep = 0.1, this.currentScaleLog = 0, this.targetScaleLog = Math.log(i), this.makeStep();
  }
  makeStep() {
    const t = this.targetScaleLog - this.currentScaleLog;
    Math.abs(t) <= this.maxScaleLogStep ? (this.currentScaleLog += t, this.setTransformToCurrentScaleLog(), this.onFinish()) : (this.currentScaleLog += t < 0 ? -this.maxScaleLogStep : this.maxScaleLogStep, this.setTransformToCurrentScaleLog(), this.stepTimeout = setTimeout(() => this.makeStep(), 20));
  }
  setTransformToCurrentScaleLog() {
    this.transformable.transformation = this.initialTransformation.before(
      v.zoom(
        this.centerX,
        this.centerY,
        Math.exp(this.currentScaleLog)
      )
    );
  }
  cancel() {
    this.stepTimeout !== void 0 && clearTimeout(this.stepTimeout);
  }
}
class _r {
  constructor(t, e) {
    a(this, "point");
    a(this, "initialTransformation");
    this.anchor = t, this.context = e, this.initialTransformation = e.transformation, this.point = t.onMoved(() => {
      this.setTransformation();
    }, !0);
  }
  setTransformation() {
    this.context.transformation = this.initialTransformation.before(this.getTranslation());
  }
  getTranslation() {
    return v.translation(this.point.current.x - this.point.initial.x, this.point.current.y - this.point.initial.y);
  }
  withAnchor(t) {
    return t === this.anchor ? this : this.context.getGestureForTwoAnchors(this.point.cancel(), t);
  }
  withoutAnchor(t) {
    this.point.cancel();
  }
}
class Kn {
  constructor(t, e, n) {
    a(this, "point1");
    a(this, "point2");
    a(this, "initialTransformation");
    this.context = n, this.initialTransformation = n.transformation, this.point1 = t.onMoved(() => this.setTransformation(), this.fixesFirstAnchorOnInfiniteCanvas()), this.point2 = e.onMoved(() => this.setTransformation(), this.fixesSecondAnchorOnInfiniteCanvas());
  }
  withAnchor(t) {
    return this;
  }
  withoutAnchor(t) {
    const e = this.point1.cancel(), n = this.point2.cancel();
    if (t === e)
      return this.context.getGestureForOneAnchor(n);
    if (t === n)
      return this.context.getGestureForOneAnchor(e);
  }
}
class ts extends Kn {
  constructor(t, e, n) {
    super(t, e, n);
  }
  fixesFirstAnchorOnInfiniteCanvas() {
    return !0;
  }
  fixesSecondAnchorOnInfiniteCanvas() {
    return !1;
  }
  setTransformation() {
    this.context.transformation = this.initialTransformation.before(v.translateZoom(
      this.point1.initial.x,
      this.point1.initial.y,
      this.point2.initial.x,
      this.point2.initial.y,
      this.point1.current.x,
      this.point1.current.y,
      this.point2.current.x,
      this.point2.current.y
    ));
  }
}
class es extends Kn {
  constructor(t, e, n) {
    super(t, e, n);
  }
  fixesFirstAnchorOnInfiniteCanvas() {
    return !0;
  }
  fixesSecondAnchorOnInfiniteCanvas() {
    return !0;
  }
  setTransformation() {
    this.context.transformation = this.initialTransformation.before(v.translateRotateZoom(
      this.point1.initial.x,
      this.point1.initial.y,
      this.point2.initial.x,
      this.point2.initial.y,
      this.point1.current.x,
      this.point1.current.y,
      this.point2.current.x,
      this.point2.current.y
    ));
  }
}
class Et {
  constructor() {
    a(this, "mapped", []);
  }
  onRemoved(t) {
  }
  add(t) {
    this.mapped.some((e) => this.mapsTo(e, t)) || this.mapped.push(this.map(t));
  }
  remove(t) {
    const e = this.mapped.findIndex((i) => this.mapsTo(i, t));
    if (e === -1)
      return;
    const [n] = this.mapped.splice(e, 1);
    this.onRemoved(n);
  }
}
class et extends Et {
  map(t) {
    return t;
  }
  mapsTo(t, e) {
    return t.listener === e.listener;
  }
  onRemoved(t) {
    t.removedCallback && t.removedCallback();
  }
  addListener(t, e) {
    this.add({ listener: t, removedCallback: e });
  }
  removeListener(t) {
    this.remove({ listener: t });
  }
  dispatch(t) {
    const e = this.mapped.map((n) => n.listener);
    for (let n of e)
      n(t);
  }
}
class ns {
  constructor(t, e) {
    a(this, "currentTimeout");
    a(this, "_changing");
    a(this, "_firstChange");
    a(this, "_subsequentChange");
    a(this, "_changeEnd");
    this.setNewValue = t, this.timeoutInMs = e, this._changing = !1, this._firstChange = new et(), this._subsequentChange = new et(), this._changeEnd = new et();
  }
  get firstChange() {
    return this._firstChange;
  }
  get subsequentChange() {
    return this._subsequentChange;
  }
  get changeEnd() {
    return this._changeEnd;
  }
  get changing() {
    return this._changing;
  }
  refreshTimeout() {
    this.currentTimeout !== void 0 && clearTimeout(this.currentTimeout), this.currentTimeout = setTimeout(() => {
      this._changing = !1, this.currentTimeout = void 0, this._changeEnd.dispatch();
    }, this.timeoutInMs);
  }
  setValue(t) {
    this.setNewValue(t), this._changing || (this._changing = !0, this._firstChange.dispatch()), this._subsequentChange.dispatch(), this.refreshTimeout();
  }
}
class is {
  constructor(t, e) {
    a(this, "gesture");
    a(this, "_zoom");
    a(this, "_transformationChangeMonitor");
    this.viewBox = t, this.config = e, this._transformationChangeMonitor = new ns((n) => this.viewBox.transformation = n, 100);
  }
  get isTransforming() {
    return this._transformationChangeMonitor.changing;
  }
  get transformationStart() {
    return this._transformationChangeMonitor.firstChange;
  }
  get transformationChange() {
    return this._transformationChangeMonitor.subsequentChange;
  }
  get transformationEnd() {
    return this._transformationChangeMonitor.changeEnd;
  }
  get transformation() {
    return this.viewBox.transformation;
  }
  set transformation(t) {
    this._transformationChangeMonitor.setValue(t);
  }
  getGestureForOneAnchor(t) {
    return new _r(t, this);
  }
  getGestureForTwoAnchors(t, e) {
    return this.config.rotationEnabled ? new es(t, e, this) : new ts(t, e, this);
  }
  releaseAnchor(t) {
    this.gesture && (this.gesture = this.gesture.withoutAnchor(t));
  }
  zoom(t, e, n) {
    this._zoom && this._zoom.cancel(), this._zoom = new Zr(this, t, e, n, () => {
      this._zoom = void 0;
    });
  }
  addRotationAnchor(t) {
    this.gesture = new Jr(t, this);
  }
  addAnchor(t) {
    if (!this.gesture) {
      this.gesture = this.getGestureForOneAnchor(t);
      return;
    }
    const e = this.gesture.withAnchor(t);
    e && (this.gesture = e);
  }
}
class rs {
  constructor() {
    a(this, "animationFrameRequested", !1);
  }
  provideDrawingIteration(t) {
    this.animationFrameRequested || (this.animationFrameRequested = !0, requestAnimationFrame(() => {
      t(), this.animationFrameRequested = !1;
    }));
  }
}
class ss {
  constructor(t) {
    a(this, "_drawHappened", new et());
    this.drawingIterationProvider = t;
  }
  get drawHappened() {
    return this._drawHappened;
  }
  provideDrawingIteration(t) {
    this.drawingIterationProvider.provideDrawingIteration(() => {
      const e = t();
      return e && this._drawHappened.dispatch(), e;
    });
  }
}
class os {
  constructor(t) {
    a(this, "_draw");
    a(this, "_locks", []);
    this.drawingIterationProvider = t;
  }
  removeLock(t) {
    const e = this._locks.indexOf(t);
    this._locks.splice(e, 1), this._locks.length === 0 && this._draw && this.drawingIterationProvider.provideDrawingIteration(this._draw);
  }
  provideDrawingIteration(t) {
    this._locks.length ? this._draw = t : this.drawingIterationProvider.provideDrawingIteration(t);
  }
  getLock() {
    let t;
    return t = { release: () => {
      this.removeLock(t);
    } }, this._locks.push(t), t;
  }
}
var O = /* @__PURE__ */ ((s) => (s[s.CSS = 0] = "CSS", s[s.CANVAS = 1] = "CANVAS", s))(O || {});
class D {
  constructor(t) {
    a(this, "inverseBase");
    this.base = t, this.inverseBase = t.inverse();
  }
  getSimilarTransformation(t) {
    return this.inverseBase.before(t).before(this.base);
  }
  representSimilarTransformation(t) {
    return this.base.before(t).before(this.inverseBase);
  }
  representBase(t) {
    return t.before(this.inverseBase);
  }
}
class bt {
  constructor(t, e, n) {
    a(this, "userCoordinatesInsideCanvasBitmap");
    a(this, "icContextFromCanvasBitmap");
    a(this, "infiniteCanvasContext");
    a(this, "initialBitmapTransformation");
    this.userCoordinates = t, this.canvasBitmap = e, this.virtualBitmapBase = n, this.setDerivedProperties();
  }
  withCanvasBitmapDistortion(t) {
    const e = this.canvasBitmap.representBase(t), n = this.userCoordinates.representSimilarTransformation(e), i = this.virtualBitmapBase.before(n), r = new D(t);
    return new bt(this.userCoordinates, r, i);
  }
  withUserTransformation(t) {
    return new bt(new D(t), this.canvasBitmap, this.virtualBitmapBase);
  }
  setDerivedProperties() {
    this.infiniteCanvasContext = new D(this.virtualBitmapBase.before(this.userCoordinates.base)), this.userCoordinatesInsideCanvasBitmap = new D(this.userCoordinates.base.before(this.canvasBitmap.base)), this.initialBitmapTransformation = this.canvasBitmap.representBase(this.userCoordinates.getSimilarTransformation(this.virtualBitmapBase)), this.icContextFromCanvasBitmap = new D(this.infiniteCanvasContext.base.before(this.canvasBitmap.inverseBase));
  }
}
class Ot {
  constructor(t, e) {
    a(this, "userCoordinatesInsideCanvasBitmap");
    a(this, "icContextFromCanvasBitmap");
    a(this, "initialBitmapTransformation");
    this.userCoordinates = t, this.canvasBitmap = e, this.setDerivedProperties();
  }
  get infiniteCanvasContext() {
    return this.userCoordinates;
  }
  withUserTransformation(t) {
    return new Ot(new D(t), this.canvasBitmap);
  }
  withCanvasBitmapDistortion(t) {
    return new Ot(this.userCoordinates, new D(t));
  }
  setDerivedProperties() {
    this.userCoordinatesInsideCanvasBitmap = new D(this.userCoordinates.base.before(this.canvasBitmap.base)), this.initialBitmapTransformation = this.canvasBitmap.inverseBase, this.icContextFromCanvasBitmap = new D(this.userCoordinates.base.before(this.canvasBitmap.inverseBase));
  }
}
function ln(s) {
  const { screenWidth: t, screenHeight: e, viewboxWidth: n, viewboxHeight: i } = s;
  return new v(t / n, 0, 0, e / i, 0, 0);
}
class ut {
  constructor(t, e) {
    this.units = t, this.coordinates = e;
  }
  get userTransformation() {
    return this.coordinates.userCoordinates.base;
  }
  get infiniteCanvasContext() {
    return this.coordinates.infiniteCanvasContext;
  }
  get initialBitmapTransformation() {
    return this.coordinates.initialBitmapTransformation;
  }
  getBitmapTransformationToTransformedInfiniteCanvasContext() {
    return this.coordinates.userCoordinates.base;
  }
  getBitmapTransformationToInfiniteCanvasContext() {
    return this.coordinates.icContextFromCanvasBitmap.base;
  }
  translateInfiniteCanvasContextTransformationToBitmapTransformation(t) {
    return this.coordinates.icContextFromCanvasBitmap.getSimilarTransformation(v.create(t));
  }
  getTransformationForInstruction(t) {
    const e = v.create(t).before(this.coordinates.infiniteCanvasContext.base), n = this.coordinates.userCoordinatesInsideCanvasBitmap.representBase(e);
    return this.coordinates.userCoordinates.getSimilarTransformation(n);
  }
  withUserTransformation(t) {
    const e = this.coordinates.withUserTransformation(t);
    return new ut(this.units, e);
  }
  withCanvasMeasurement(t) {
    const e = ln(t), n = this.coordinates.withCanvasBitmapDistortion(e);
    return new ut(this.units, n);
  }
  withUnits(t) {
    if (t === this.units)
      return this;
    let e;
    return t === O.CANVAS ? e = new bt(this.coordinates.userCoordinates, this.coordinates.canvasBitmap, this.coordinates.canvasBitmap.base) : e = new Ot(this.coordinates.userCoordinates, this.coordinates.canvasBitmap), new ut(t, e);
  }
  static create(t, e) {
    const n = ln(e), i = t === O.CANVAS ? new bt(new D(v.identity), new D(n), n) : new Ot(new D(v.identity), new D(n));
    return new ut(t, i);
  }
}
function as(s, t) {
  return s ? t ? s.viewboxWidth === t.viewboxWidth && s.viewboxHeight === t.viewboxHeight && s.screenWidth === t.screenWidth && s.screenHeight === t.screenHeight : !1 : !t;
}
class dt {
  constructor(t, e, n) {
    this.coordinates = t, this.measurement = e, this.polygon = n;
  }
  get viewboxWidth() {
    return this.measurement.viewboxWidth;
  }
  get viewboxHeight() {
    return this.measurement.viewboxHeight;
  }
  get userTransformation() {
    return this.coordinates.userTransformation;
  }
  get infiniteCanvasContext() {
    return this.coordinates.infiniteCanvasContext;
  }
  get initialBitmapTransformation() {
    return this.coordinates.initialBitmapTransformation;
  }
  withUnits(t) {
    const e = this.coordinates.withUnits(t);
    return new dt(e, this.measurement, this.polygon);
  }
  withTransformation(t) {
    const e = this.coordinates.withUserTransformation(v.create(t));
    return new dt(e, this.measurement, this.polygon);
  }
  withMeasurement(t) {
    if (as(this.measurement, t))
      return this;
    const { viewboxWidth: n, viewboxHeight: i } = t, r = cn(0, 0, n, i).getArea(), o = this.coordinates.withCanvasMeasurement(t);
    return new dt(o, t, r);
  }
  getCSSPosition(t, e) {
    const { left: n, top: i } = this.measurement;
    return new h(t - n, e - i);
  }
  getTransformationForInstruction(t) {
    return this.coordinates.getTransformationForInstruction(t);
  }
  translateInfiniteCanvasContextTransformationToBitmapTransformation(t) {
    return this.coordinates.translateInfiniteCanvasContextTransformationToBitmapTransformation(t);
  }
  getBitmapTransformationToTransformedInfiniteCanvasContext() {
    return this.coordinates.getBitmapTransformationToTransformedInfiniteCanvasContext();
  }
  getBitmapTransformationToInfiniteCanvasContext() {
    return this.coordinates.getBitmapTransformationToInfiniteCanvasContext();
  }
  addPathAroundViewbox(t, e, n) {
    const i = this.viewboxWidth + 2 * e, r = this.viewboxHeight + 2 * e;
    t.save(), t.setTransform(1, 0, 0, 1, 0, 0), n ? t.rect(i - e, -e, -i, r) : t.rect(-e, -e, i, r), t.restore();
  }
  static create(t, e) {
    const { viewboxWidth: n, viewboxHeight: i } = t, r = cn(0, 0, n, i).getArea(), o = ut.create(e, t);
    return new dt(o, t, r);
  }
}
class cs {
  constructor(t, e) {
    a(this, "rectangle");
    a(this, "transformation");
    this.measurementProvider = t, this.config = e, this.transformation = v.identity;
  }
  setTransformation(t) {
    this.rectangle ? this.rectangle = this.rectangle.withTransformation(t) : this.transformation = t;
  }
  measure() {
    const t = this.config.units === O.CSS ? O.CSS : O.CANVAS, e = this.measurementProvider.measure();
    e.screenWidth === 0 || e.screenHeight === 0 ? this.rectangle = void 0 : this.rectangle ? this.rectangle = this.rectangle.withUnits(t).withMeasurement(e) : this.rectangle = dt.create(e, t).withTransformation(this.transformation);
  }
}
class hs {
  constructor(t) {
    this.canvas = t;
  }
  measure() {
    const t = this.canvas.getBoundingClientRect();
    return {
      left: t.left,
      top: t.top,
      screenWidth: t.width,
      screenHeight: t.height,
      viewboxWidth: this.canvas.width,
      viewboxHeight: this.canvas.height
    };
  }
}
function vt(s) {
  const { a: t, b: e, c: n, d: i, e: r, f: o } = s;
  return { a: t, b: e, c: n, d: i, e: r, f: o };
}
const ls = {
  transformationstart: null,
  transformationchange: null,
  transformationend: null
}, jn = {
  auxclick: null,
  click: null,
  contextmenu: null,
  dblclick: null,
  mouseenter: null,
  mouseleave: null,
  mouseout: null,
  mouseover: null,
  mouseup: null
}, Qn = {
  gotpointercapture: null,
  lostpointercapture: null,
  pointerenter: null,
  pointerout: null,
  pointerover: null
}, Jn = {
  drag: null,
  dragend: null,
  dragenter: null,
  dragleave: null,
  dragover: null,
  dragstart: null,
  drop: null
}, Zn = {
  touchcancel: null,
  touchend: null
}, us = {
  ...jn,
  ...Qn,
  ...Jn,
  ...Zn
}, _n = {
  mousedown: null,
  mousemove: null,
  pointerdown: null,
  pointermove: null,
  pointerleave: null,
  pointercancel: null,
  pointerup: null,
  wheel: null,
  touchstart: null,
  touchmove: null,
  wheelignored: null,
  touchignored: null
};
function kt(s) {
  return ls.hasOwnProperty(s);
}
function Ht(s) {
  return us.hasOwnProperty(s) || _n.hasOwnProperty(s);
}
function Vt(s) {
  return _n.hasOwnProperty(s);
}
function Mt(s) {
  return jn.hasOwnProperty(s);
}
function Nt(s) {
  return Qn.hasOwnProperty(s);
}
function zt(s) {
  return Jn.hasOwnProperty(s);
}
function qt(s) {
  return Zn.hasOwnProperty(s);
}
class ds extends Et {
  constructor(t) {
    super(), this.source = t;
  }
  map(t) {
    const e = () => {
      this.remove(t), t.removedCallback && t.removedCallback();
    };
    return this.source.addListener(t.listener, e), { listener: t.listener, removedCallback: e };
  }
  mapsTo(t, e) {
    return t.listener === e.listener;
  }
  onRemoved(t) {
    t.removedCallback(), this.source.removeListener(t.listener);
  }
  addListener(t, e) {
    this.add({ listener: t, removedCallback: e });
  }
  removeListener(t) {
    this.remove({ listener: t });
  }
}
class fs extends Et {
  constructor(e, n) {
    super();
    a(this, "old");
    this.transform = n, this.old = new ds(e);
  }
  map(e) {
    const n = {
      oldListener: void 0,
      newListener: e.listener,
      removedCallback: () => {
        e.removedCallback && e.removedCallback();
      }
    };
    return n.oldListener = this.transform(e.listener, (i) => n.removedCallback = () => {
      e.removedCallback && e.removedCallback(), i();
    }), this.old.addListener(n.oldListener, () => this.removeListener(e.listener)), n;
  }
  mapsTo(e, n) {
    return e.newListener === n.listener;
  }
  onRemoved(e) {
    this.old.removeListener(e.oldListener), e.removedCallback();
  }
  addListener(e, n) {
    this.add({ listener: e, removedCallback: n });
  }
  removeListener(e) {
    this.remove({ listener: e });
  }
}
function ot(s, t) {
  return new fs(s, t);
}
function X(s, t) {
  return ot(s, (e) => (n) => {
    e(t(n));
  });
}
function ne(s) {
  return !!s && typeof s.handleEvent == "function";
}
class gs extends Et {
  constructor(t) {
    super(), this.source = t;
  }
  mapsTo(t, e) {
    return t.listenerObject === e.listenerObject;
  }
  map(t) {
    const { listenerObject: e, removedCallback: n } = t, i = (o) => {
      e.handleEvent(o);
    }, r = () => {
      this.remove(t), n && n();
    };
    return this.source.addListener(i, r), { listener: i, listenerObject: e, removedCallback: r };
  }
  onRemoved(t) {
    this.source.removeListener(t.listener), t.removedCallback();
  }
}
class ms {
  constructor(t) {
    a(this, "listenerObjectCollection");
    this.source = t, this.listenerObjectCollection = new gs(t);
  }
  addListener(t, e) {
    ne(t) ? this.listenerObjectCollection.add({ listenerObject: t, removedCallback: e }) : this.source.addListener(t, e);
  }
  removeListener(t) {
    ne(t) ? this.listenerObjectCollection.remove({ listenerObject: t }) : this.source.removeListener(t);
  }
}
function un(s) {
  return new ms(s);
}
function ps(s, t, e) {
  ne(t), s.addListener(t, e);
}
function vs(s, t, e) {
  ne(t), s.removeListener(t, e);
}
function ws(s) {
  const t = ot(s, (e) => (n) => {
    e(n), t.removeListener(e);
  });
  return t;
}
function Ps(s, t) {
  return ot(s, (e) => (n) => {
    e.apply(t, [n]);
  });
}
class Cs {
  constructor(t) {
    a(this, "firstDispatcher", new et());
    a(this, "secondDispatcher", new et());
    a(this, "sourceListener");
    a(this, "numberOfListeners", 0);
    this.source = t, this.sourceListener = (e) => this.dispatchEvent(e);
  }
  add() {
    this.numberOfListeners === 0 && this.source.addListener(this.sourceListener), this.numberOfListeners++;
  }
  remove() {
    this.numberOfListeners--, this.numberOfListeners === 0 && this.source.removeListener(this.sourceListener);
  }
  dispatchEvent(t) {
    this.firstDispatcher.dispatch(t), this.secondDispatcher.dispatch(t);
  }
  build() {
    return {
      first: ot(this.firstDispatcher, (t, e) => (this.add(), e(() => this.remove()), t)),
      second: ot(this.secondDispatcher, (t, e) => (this.add(), e(() => this.remove()), t))
    };
  }
}
function dn(s) {
  return new Cs(s).build();
}
function G(s, t) {
  return ot(s, (e) => (n) => {
    t(n) && e(n);
  });
}
class fn {
  constructor(t, e) {
    a(this, "_onceSource");
    a(this, "source");
    t = Ps(t, e), this._onceSource = un(ws(t)), this.source = un(t);
  }
  addListener(t, e) {
    e && e.once ? this._onceSource.addListener(t) : this.source.addListener(t);
  }
  removeListener(t) {
    this.source.removeListener(t), this._onceSource.removeListener(t);
  }
}
class Is {
  constructor(t, e) {
    a(this, "wrappedOnEventHandler");
    a(this, "onEventHandler");
    this.captureSource = t, this.bubbleSource = e;
  }
  get on() {
    return this.onEventHandler;
  }
  set on(t) {
    t ? (this.wrappedOnEventHandler = function(e) {
      return t.apply(this, [e]);
    }, this.onEventHandler = t, this.bubbleSource.addListener(this.wrappedOnEventHandler)) : (this.bubbleSource.removeListener(this.wrappedOnEventHandler), this.wrappedOnEventHandler = null, this.onEventHandler = null);
  }
  addListener(t, e) {
    const n = e && (typeof e == "boolean" ? void 0 : e);
    (typeof e == "boolean" ? e : e && e.capture) ? this.captureSource.addListener(t, n) : this.bubbleSource.addListener(t, n);
  }
  removeListener(t, e) {
    (typeof e == "boolean" ? e : e && e.capture) ? this.captureSource.removeListener(t) : this.bubbleSource.removeListener(t);
  }
}
function Ts(s, t, e) {
  return new Is(
    new fn(s, e),
    new fn(t, e)
  );
}
function nt(s, t, e, n) {
  const i = X(G(s, (o) => !o.immediatePropagationStopped), (o) => o.getResultEvent(e.rectangle)), r = X(G(t, (o) => !o.propagationStopped && !o.immediatePropagationStopped), (o) => o.getResultEvent(e.rectangle));
  return Ts(i, r, n);
}
function it(s) {
  const { first: t, second: e } = dn(s), { first: n, second: i } = dn(e);
  return {
    captureSource: t,
    bubbleSource: n,
    afterBubble: i
  };
}
function Ss(s, t, e) {
  const { captureSource: n, bubbleSource: i } = it(s);
  return nt(
    n,
    i,
    t,
    e
  );
}
class Xe {
  constructor(t, e) {
    a(this, "cache");
    this.rectangleManager = t, this.infiniteCanvas = e, this.cache = {};
  }
  map(t, e) {
    return Ss(X(t, e), this.rectangleManager, this.infiniteCanvas);
  }
  setOn(t, e) {
    if (e)
      this.cache[t] || (this.cache[t] = this.getEventSource(t)), this.cache[t].on = e;
    else {
      if (!this.cache[t])
        return;
      this.cache[t].on = null;
    }
  }
  getOn(t) {
    return this.cache[t] ? this.cache[t].on : null;
  }
  addEventListener(t, e, n) {
    this.cache[t] || (this.cache[t] = this.getEventSource(t)), ps(this.cache[t], e, n);
  }
  removeEventListener(t, e, n) {
    this.cache[t] && vs(this.cache[t], e, n);
  }
}
class ti extends Xe {
  getEventSource(t) {
    return (!this.cache || !this.cache[t]) && (this.cache = this.createEvents()), this.cache[t];
  }
}
class ei {
  constructor(t, e) {
    a(this, "AT_TARGET", 2);
    a(this, "BUBBLING_PHASE", 3);
    a(this, "CAPTURING_PHASE", 1);
    a(this, "NONE", 0);
    this.canvasEvent = t, this.preventableDefault = e;
  }
  get bubbles() {
    return !1;
  }
  get isTrusted() {
    return !1;
  }
  get eventPhase() {
    return Event.AT_TARGET;
  }
  get cancelable() {
    return this.preventableDefault.cancelable;
  }
  get defaultPrevented() {
    return this.preventableDefault.defaultPrevented;
  }
  initEvent(t, e, n) {
  }
  preventDefault() {
    this.preventableDefault.preventDefault();
  }
  stopImmediatePropagation() {
    this.canvasEvent.stopImmediatePropagation();
  }
  stopPropagation() {
    this.canvasEvent.stopPropagation();
  }
}
class Ue extends ei {
  constructor(t, e, n) {
    super(t, e), this.type = n;
  }
  get cancelBubble() {
    return !1;
  }
  get composed() {
    return !1;
  }
  get currentTarget() {
    return null;
  }
  get returnValue() {
    return !0;
  }
  get srcElement() {
    return null;
  }
  get target() {
    return null;
  }
  get timeStamp() {
    return 0;
  }
  composedPath() {
    return [];
  }
}
class ni {
  constructor(t) {
    a(this, "resultEvent");
    a(this, "propagationStopped", !1);
    a(this, "immediatePropagationStopped", !1);
    this.preventableDefault = t;
  }
  get infiniteCanvasDefaultPrevented() {
    return this.preventableDefault.infiniteCanvasDefaultPrevented;
  }
  stopPropagation() {
    this.propagationStopped = !0;
  }
  stopImmediatePropagation() {
    this.immediatePropagationStopped = !0;
  }
  getResultEvent(t) {
    return this.resultEvent || (this.resultEvent = this.createResultEvent(t)), this.resultEvent;
  }
}
class ys {
  constructor() {
    a(this, "_defaultPrevented");
  }
  get defaultPrevented() {
    return this._defaultPrevented;
  }
  get infiniteCanvasDefaultPrevented() {
    return this._defaultPrevented;
  }
  get cancelable() {
    return !0;
  }
  preventDefault() {
    this._defaultPrevented = !0;
  }
}
class xs {
  get infiniteCanvasDefaultPrevented() {
    return !1;
  }
  get defaultPrevented() {
    return !1;
  }
  get cancelable() {
    return !1;
  }
  preventDefault() {
  }
}
class $e extends ni {
  constructor(t) {
    super(t ? new ys() : new xs());
  }
}
class bs extends Ue {
  constructor(e, n) {
    super(e, n, "draw");
    a(this, "transformation");
    a(this, "inverseTransformation");
    this.transformation = e.transformation, this.inverseTransformation = e.inverseTransformation;
  }
}
class Os extends $e {
  constructor() {
    super(!1);
    a(this, "transformation");
    a(this, "inverseTransformation");
  }
  createResultEvent(e) {
    return this.transformation = vt(e.infiniteCanvasContext.inverseBase), this.inverseTransformation = vt(e.infiniteCanvasContext.base), new bs(this, this.preventableDefault);
  }
}
class Ls extends ti {
  constructor(t, e, n) {
    super(e, n), this.drawingIterationProvider = t;
  }
  createEvents() {
    return {
      draw: this.map(this.drawingIterationProvider.drawHappened, () => new Os())
    };
  }
}
class Bs extends Ue {
  constructor(e, n, i) {
    super(e, n, i);
    a(this, "transformation");
    a(this, "inverseTransformation");
    this.transformation = e.transformation, this.inverseTransformation = e.inverseTransformation;
  }
}
class ve extends $e {
  constructor(e) {
    super(!1);
    a(this, "transformation");
    a(this, "inverseTransformation");
    this.type = e;
  }
  createResultEvent(e) {
    return this.transformation = vt(e.infiniteCanvasContext.inverseBase), this.inverseTransformation = vt(e.infiniteCanvasContext.base), new Bs(this, this.preventableDefault, this.type);
  }
}
class As extends ti {
  constructor(t, e, n) {
    super(e, n), this.transformer = t;
  }
  createEvents() {
    return {
      transformationstart: this.map(this.transformer.transformationStart, () => new ve("transformationstart")),
      transformationchange: this.map(this.transformer.transformationChange, () => new ve("transformationchange")),
      transformationend: this.map(this.transformer.transformationEnd, () => new ve("transformationend"))
    };
  }
}
function k(s, t) {
  return {
    addListener(e) {
      s.addEventListener(t, e);
    },
    removeListener(e) {
      s.removeEventListener(t, e);
    }
  };
}
class Ds {
  constructor(t) {
    this.event = t;
  }
  get infiniteCanvasDefaultPrevented() {
    return !1;
  }
  get nativeDefaultPrevented() {
    return this.event.defaultPrevented;
  }
  get nativeCancelable() {
    return this.event.cancelable;
  }
  get defaultPrevented() {
    return this.event.defaultPrevented;
  }
  get cancelable() {
    return this.event.cancelable;
  }
  preventDefault() {
    this.event.preventDefault();
  }
}
class Es {
  constructor(t) {
    a(this, "_defaultPrevented");
    this.event = t;
  }
  get infiniteCanvasDefaultPrevented() {
    return this._defaultPrevented;
  }
  get nativeDefaultPrevented() {
    return this.event.defaultPrevented;
  }
  get nativeCancelable() {
    return this.event.cancelable;
  }
  get defaultPrevented() {
    return this._defaultPrevented;
  }
  get cancelable() {
    return !0;
  }
  preventDefault(t) {
    this._defaultPrevented = !0, t && this.event.preventDefault();
  }
}
class wt extends ni {
  constructor(t, e) {
    super(e ? new Es(t) : new Ds(t)), this.event = t;
  }
  stopPropagation() {
    super.stopPropagation(), this.event && this.event.stopPropagation();
  }
  stopImmediatePropagation() {
    super.stopImmediatePropagation(), this.event && this.event.stopImmediatePropagation();
  }
}
class at {
  constructor(t, e, n, i) {
    this.offsetX = t, this.offsetY = e, this.movementX = n, this.movementY = i;
  }
  toInfiniteCanvasCoordinates(t) {
    const { x: e, y: n } = t.infiniteCanvasContext.inverseBase.apply(new h(this.offsetX, this.offsetY)), { x: i, y: r } = t.infiniteCanvasContext.inverseBase.untranslated().apply(new h(this.movementX, this.movementY));
    return new at(e, n, i, r);
  }
  static create(t) {
    return new at(t.offsetX, t.offsetY, t.movementX, t.movementY);
  }
}
class Rs extends ei {
  constructor(t, e, n) {
    super(t, e), this.event = n;
  }
  get nativeDefaultPrevented() {
    return this.preventableDefault.nativeDefaultPrevented;
  }
  get nativeCancelable() {
    return this.preventableDefault.nativeCancelable;
  }
  get cancelBubble() {
    return this.event.cancelBubble;
  }
  get composed() {
    return this.event.composed;
  }
  get currentTarget() {
    return this.event.currentTarget;
  }
  get returnValue() {
    return this.event.returnValue;
  }
  get srcElement() {
    return this.event.srcElement;
  }
  get target() {
    return this.event.target;
  }
  get timeStamp() {
    return this.event.timeStamp;
  }
  get type() {
    return this.event.type;
  }
  preventDefault(t) {
    this.preventableDefault.preventDefault(t);
  }
  composedPath() {
    return this.event.composedPath();
  }
}
class ii extends Rs {
  get detail() {
    return this.event.detail;
  }
  get view() {
    return this.event.view;
  }
  get which() {
    return this.event.which;
  }
  initUIEvent(t, e, n, i, r) {
  }
}
class le extends ii {
  constructor(e, n, i, r) {
    super(e, n, i);
    a(this, "offsetX");
    a(this, "offsetY");
    a(this, "movementX");
    a(this, "movementY");
    this.offsetX = r.offsetX, this.offsetY = r.offsetY, this.movementX = r.movementX, this.movementY = r.movementY;
  }
  get altKey() {
    return this.event.altKey;
  }
  get button() {
    return this.event.button;
  }
  get buttons() {
    return this.event.buttons;
  }
  get clientX() {
    return this.event.clientX;
  }
  get clientY() {
    return this.event.clientY;
  }
  get ctrlKey() {
    return this.event.ctrlKey;
  }
  get metaKey() {
    return this.event.metaKey;
  }
  get pageX() {
    return this.event.pageX;
  }
  get pageY() {
    return this.event.pageY;
  }
  get relatedTarget() {
    return this.event.relatedTarget;
  }
  get screenX() {
    return this.event.screenX;
  }
  get screenY() {
    return this.event.screenY;
  }
  get shiftKey() {
    return this.event.shiftKey;
  }
  get x() {
    return this.event.x;
  }
  get y() {
    return this.event.y;
  }
  getModifierState(e) {
    return this.event.getModifierState(e);
  }
  initMouseEvent(e, n, i, r, o, c, u, l, f, d, m, w, C, S, L) {
  }
}
class xe extends wt {
  constructor(e, n) {
    super(e, n);
    a(this, "props");
    this.props = at.create(e);
  }
  createResultEvent(e) {
    return new le(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(e));
  }
}
class ie extends at {
  constructor(t, e, n, i, r, o) {
    super(t, e, n, i), this.width = r, this.height = o;
  }
  toInfiniteCanvasCoordinates(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: r } = super.toInfiniteCanvasCoordinates(t), { x: o, y: c } = t.infiniteCanvasContext.inverseBase.untranslated().apply(new h(this.width, this.height));
    return new ie(
      e,
      n,
      i,
      r,
      o,
      c
    );
  }
  static create(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: r } = super.create(t);
    return new ie(
      e,
      n,
      i,
      r,
      t.width,
      t.height
    );
  }
}
class Fs extends le {
  constructor(e, n, i, r) {
    super(e, n, i, r);
    a(this, "width");
    a(this, "height");
  }
  get isPrimary() {
    return this.event.isPrimary;
  }
  get pointerId() {
    return this.event.pointerId;
  }
  get pointerType() {
    return this.event.pointerType;
  }
  get pressure() {
    return this.event.pressure;
  }
  get tangentialPressure() {
    return this.event.tangentialPressure;
  }
  get tiltX() {
    return this.event.tiltX;
  }
  get tiltY() {
    return this.event.tiltY;
  }
  get twist() {
    return this.event.twist;
  }
  getCoalescedEvents() {
    return console.warn("`PointerEvent.getCoalescedEvents()` is currently not supported by InfiniteCanvas"), [];
  }
  getPredictedEvents() {
    return console.warn("`PointerEvent.getPredictedEvents()` is currently not supported by InfiniteCanvas"), [];
  }
}
class ht extends wt {
  constructor(e, n) {
    super(e, n);
    a(this, "props");
    this.props = ie.create(e);
  }
  createResultEvent(e) {
    return new Fs(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(e));
  }
}
class Ws {
  constructor(t, e) {
    a(this, "current");
    this.initial = t, this.cancel = e, this.current = t;
  }
}
class ks {
  constructor(t) {
    a(this, "moveEventDispatcher", new et());
    a(this, "_fixedOnInfiniteCanvas", !1);
    this.point = t;
  }
  get fixedOnInfiniteCanvas() {
    return this._fixedOnInfiniteCanvas;
  }
  removeHandler(t) {
    this.moveEventDispatcher.removeListener(t);
  }
  moveTo(t, e) {
    const n = new h(t, e);
    this.point = n, this.moveEventDispatcher.dispatch(n);
  }
  onMoved(t, e) {
    let n;
    this._fixedOnInfiniteCanvas = e;
    const i = (r) => {
      n.current = r, t();
    };
    return this.moveEventDispatcher.addListener(i), n = new Ws(this.point, () => (this.removeHandler(i), this._fixedOnInfiniteCanvas = !1, this)), n;
  }
}
class Hs {
  constructor(t) {
    a(this, "_touchId");
    a(this, "_defaultPrevented", !1);
    a(this, "anchor");
    this.pointerEvent = t, this.anchor = new ks(new h(t.offsetX, t.offsetY));
  }
  get defaultPrevented() {
    return this._defaultPrevented;
  }
  get touchId() {
    return this._touchId;
  }
  get pointerId() {
    return this.pointerEvent.pointerId;
  }
  preventDefault() {
    this._defaultPrevented = !0;
  }
  setTouchId(t) {
    this._touchId = t;
  }
  updatePointerEvent(t) {
    this.pointerEvent = t, this.anchor.moveTo(t.offsetX, t.offsetY);
  }
}
class Vs {
  constructor() {
    a(this, "anchors", []);
  }
  find(t) {
    return this.anchors.find(t);
  }
  getAll(t) {
    return this.anchors.filter(t);
  }
  getAnchorForTouch(t) {
    return this.anchors.find((e) => e.touchId === t);
  }
  addAnchorForPointerEvent(t) {
    const e = new Hs(t);
    this.anchors.push(e);
  }
  updateAnchorForPointerEvent(t) {
    const e = this.getAnchorForPointerEvent(t);
    if (!e) {
      this.addAnchorForPointerEvent(t);
      return;
    }
    e.updatePointerEvent(t);
  }
  getAnchorForPointerEvent(t) {
    return this.anchors.find((e) => e.pointerId === t.pointerId);
  }
  removeAnchor(t) {
    const e = this.anchors.findIndex((n) => n === t);
    e > -1 && this.anchors.splice(e, 1);
  }
}
class re extends at {
  constructor(t, e, n, i, r, o) {
    super(t, e, n, i), this.deltaX = r, this.deltaY = o;
  }
  toInfiniteCanvasCoordinates(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: r } = super.toInfiniteCanvasCoordinates(t), { x: o, y: c } = t.infiniteCanvasContext.inverseBase.untranslated().apply(new h(this.deltaX, this.deltaY));
    return new re(
      e,
      n,
      i,
      r,
      o,
      c
    );
  }
  static create(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: r } = super.create(t);
    return new re(
      e,
      n,
      i,
      r,
      t.deltaX,
      t.deltaY
    );
  }
}
class Ms extends le {
  constructor(e, n, i, r) {
    super(e, n, i, r);
    a(this, "deltaX");
    a(this, "deltaY");
    a(this, "DOM_DELTA_LINE", 1);
    a(this, "DOM_DELTA_PAGE", 2);
    a(this, "DOM_DELTA_PIXEL", 0);
    this.deltaX = r.deltaX, this.deltaY = r.deltaY;
  }
  get deltaMode() {
    return this.event.deltaMode;
  }
  get deltaZ() {
    return this.event.deltaZ;
  }
}
class Ns extends wt {
  constructor(e, n) {
    super(e, n);
    a(this, "props");
    this.props = re.create(e);
  }
  createResultEvent(e) {
    return new Ms(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(e));
  }
}
function ft(s, t) {
  const e = [];
  for (let n = 0; n < s.length; n++) {
    const i = s[n];
    (!t || t(i)) && e.push(i);
  }
  return e;
}
class se {
  constructor(t, e, n, i, r, o) {
    this.x = t, this.y = e, this.radiusX = n, this.radiusY = i, this.rotationAngle = r, this.identifier = o;
  }
  toInfiniteCanvasCoordinates(t) {
    const e = t.infiniteCanvasContext.inverseBase, { x: n, y: i } = e.apply(new h(this.x, this.y)), r = this.radiusX * e.scale, o = this.radiusY * e.scale, c = this.rotationAngle + e.getRotationAngle();
    return new se(
      n,
      i,
      r,
      o,
      c,
      this.identifier
    );
  }
  static create(t, e) {
    const { x: n, y: i } = e.getCSSPosition(t.clientX, t.clientY);
    return new se(
      n,
      i,
      t.radiusX,
      t.radiusY,
      t.rotationAngle,
      t.identifier
    );
  }
}
class gn {
  constructor() {
    a(this, "translatedProps", []);
    a(this, "createdProps", []);
  }
  toInfiniteCanvasCoordinates(t, e) {
    let n = this.translatedProps.find((i) => i.identifier === t.identifier);
    return n || (n = t.toInfiniteCanvasCoordinates(e), this.translatedProps.push(n), n);
  }
  createProps(t, e) {
    let n = this.createdProps.find((i) => i.identifier === t.identifier);
    return n || (n = se.create(t, e), this.createdProps.push(n), n);
  }
  dispose() {
    this.translatedProps.splice(0, this.translatedProps.length), this.createdProps.splice(0, this.createdProps.length);
  }
}
class oe {
  constructor(t, e, n) {
    this.targetTouches = t, this.changedTouches = e, this.touches = n;
  }
  toInfiniteCanvasCoordinates(t) {
    const e = new gn(), n = new oe(
      this.targetTouches.map((i) => e.toInfiniteCanvasCoordinates(i, t)),
      this.changedTouches.map((i) => e.toInfiniteCanvasCoordinates(i, t)),
      this.touches.map((i) => e.toInfiniteCanvasCoordinates(i, t))
    );
    return e.dispose(), n;
  }
  static create(t, e, n) {
    const i = new gn(), r = e.map((c) => i.createProps(c, t)), o = n.map((c) => i.createProps(c, t));
    return i.dispose(), new oe(
      r,
      o,
      r
    );
  }
}
class zs {
  constructor(t, e) {
    a(this, "infiniteCanvasX");
    a(this, "infiniteCanvasY");
    a(this, "radiusX");
    a(this, "radiusY");
    a(this, "rotationAngle");
    this.touch = t, this.infiniteCanvasX = e.x, this.infiniteCanvasY = e.y, this.radiusX = e.radiusX, this.radiusY = e.radiusY, this.rotationAngle = e.rotationAngle;
  }
  get clientX() {
    return this.touch.clientX;
  }
  get clientY() {
    return this.touch.clientY;
  }
  get force() {
    return this.touch.force;
  }
  get identifier() {
    return this.touch.identifier;
  }
  get pageX() {
    return this.touch.pageX;
  }
  get pageY() {
    return this.touch.pageY;
  }
  get screenX() {
    return this.touch.screenX;
  }
  get screenY() {
    return this.touch.screenY;
  }
  get target() {
    return this.touch.target;
  }
}
class qs extends Array {
  item(t) {
    return this[t];
  }
}
function Gs(s, t) {
  const e = s.length;
  for (let n = 0; n < e; n++) {
    const i = s[n];
    if (i.identifier === t)
      return i;
  }
}
function Ys(s, t) {
  for (let e of s) {
    const n = Gs(e, t);
    if (n)
      return n;
  }
}
function we(s, t) {
  const e = [];
  for (const n of t) {
    const i = Ys(s, n.identifier);
    i && e.push(new zs(i, n));
  }
  return new qs(...e);
}
class Xs extends ii {
  constructor(e, n, i, r) {
    super(e, n, i);
    a(this, "touches");
    a(this, "targetTouches");
    a(this, "changedTouches");
    this.touches = we([i.touches], r.touches), this.targetTouches = we([i.touches], r.targetTouches), this.changedTouches = we([i.touches, i.changedTouches], r.changedTouches);
  }
  get altKey() {
    return this.event.altKey;
  }
  get ctrlKey() {
    return this.event.ctrlKey;
  }
  get metaKey() {
    return this.event.metaKey;
  }
  get shiftKey() {
    return this.event.shiftKey;
  }
}
class Lt extends wt {
  constructor(t, e, n) {
    super(t, n), this.props = e;
  }
  createResultEvent(t) {
    return new Xs(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
  static create(t, e, n, i, r) {
    const o = oe.create(t, n, i);
    return new Lt(e, o, r);
  }
}
class mn {
  constructor(t, e) {
    this.source = t, this.listener = e, t.addListener(e);
  }
  remove() {
    this.source.removeListener(this.listener);
  }
}
class Us {
  constructor(t, e, n, i) {
    a(this, "subscription");
    a(this, "otherSubscription");
    this.listener = n, this.onRemoved = i;
    let r;
    this.otherSubscription = new mn(e, (o) => {
      r = o;
    }), this.subscription = new mn(t, (o) => {
      n([o, r]);
    });
  }
  remove() {
    this.subscription.remove(), this.otherSubscription.remove(), this.onRemoved && this.onRemoved();
  }
}
class $s extends Et {
  constructor(t, e) {
    super(), this.source = t, this.otherSource = e;
  }
  map(t) {
    return new Us(this.source, this.otherSource, t.listener, t.onRemoved);
  }
  mapsTo(t, e) {
    return t.listener === e.listener;
  }
  onRemoved(t) {
    t.remove();
  }
  addListener(t, e) {
    this.add({ listener: t, onRemoved: e });
  }
  removeListener(t) {
    this.remove({ listener: t });
  }
}
function Pe(s, t) {
  return new $s(s, t);
}
function Ks(s, t) {
  for (let e = 0; e < s.length; e++) {
    const n = s[e];
    if (t(n))
      return !0;
  }
  return !1;
}
function js(s, t) {
  return ot(s, (e) => {
    let n = !1;
    const i = [];
    function r() {
      n || i.length === 0 || (n = !0, t(i.shift()).addListener(e, () => {
        n = !1, r();
      }));
    }
    return (o) => {
      i.push(o), r();
    };
  });
}
class Qs {
  constructor(t) {
    this.sequence = t;
  }
  addListener(t, e) {
    for (const n of this.sequence)
      t(n);
    e && e();
  }
  removeListener(t) {
  }
}
function Js(s) {
  return new Qs(s);
}
class pn extends $e {
  constructor(t) {
    super(!0), this.type = t;
  }
  createResultEvent() {
    return new Ue(this, this.preventableDefault, this.type);
  }
}
class Zs extends Xe {
  constructor(e, n, i, r, o) {
    super(i, r);
    a(this, "anchorSet");
    this.transformer = n, this.config = o, this.anchorSet = new Vs();
    const c = k(e, "pointerdown"), u = k(e, "pointerleave"), l = k(e, "pointermove"), f = k(e, "pointerup"), d = k(e, "pointercancel"), m = G(
      k(e, "touchmove"),
      (g) => Ks(g.targetTouches, (B) => !this.hasFixedAnchorForTouch(B.identifier))
    );
    c.addListener((g) => this.anchorSet.updateAnchorForPointerEvent(g)), l.addListener((g) => this.anchorSet.updateAnchorForPointerEvent(g)), f.addListener((g) => this.removePointer(g)), u.addListener((g) => this.removePointer(g));
    const w = X(k(e, "mousedown"), (g) => new xe(g, !0)), C = X(k(e, "wheel"), (g) => new Ns(g, !0)), S = X(k(e, "touchstart"), (g) => {
      const B = ft(g.targetTouches), q = ft(g.changedTouches);
      return Lt.create(
        this.rectangleManager.rectangle,
        g,
        B,
        q,
        !0
      );
    }), L = X(c, (g) => new ht(g, !0)), { captureSource: V, bubbleSource: j, afterBubble: Q } = it(L), { captureSource: Pt, bubbleSource: Ct, afterBubble: It } = it(w), { captureSource: ue, bubbleSource: de, afterBubble: fe } = it(S), { captureSource: ge, bubbleSource: Rt, afterBubble: je } = it(C), ri = X(
      G(je, (g) => !this.config.greedyGestureHandling && !g.event.ctrlKey && !g.infiniteCanvasDefaultPrevented),
      () => new pn("wheelignored")
    ), { captureSource: si, bubbleSource: oi, afterBubble: ai } = it(ri);
    je.addListener((g) => {
      g.infiniteCanvasDefaultPrevented || this.zoom(g.event);
    }), ai.addListener((g) => {
      g.infiniteCanvasDefaultPrevented || console.warn("use ctrl + scroll to zoom");
    }), Pe(It, Q).addListener(([g, B]) => {
      !g.infiniteCanvasDefaultPrevented && !B.infiniteCanvasDefaultPrevented && this.transformUsingPointer(g.event, B.event);
    });
    const ci = G(fe, (g) => g.event.changedTouches.length === 1), Qe = Pe(ci, Q);
    Qe.addListener(([g, B]) => {
      const q = g.event.changedTouches[0], J = this.anchorSet.getAnchorForPointerEvent(B.event);
      if (J)
        if (J.setTouchId(q.identifier), !g.infiniteCanvasDefaultPrevented && !B.infiniteCanvasDefaultPrevented)
          if (this.config.greedyGestureHandling)
            this.rectangleManager.measure(), this.transformer.addAnchor(J.anchor), g.event.preventDefault();
          else {
            const Ze = this.anchorSet.find((me) => me.touchId !== void 0 && me !== J && !me.defaultPrevented);
            if (!Ze)
              return;
            this.rectangleManager.measure(), this.transformer.addAnchor(Ze.anchor), this.transformer.addAnchor(J.anchor), g.event.preventDefault();
          }
        else
          J.preventDefault();
    });
    const Je = G(
      Pe(d, Qe),
      ([g, [B, q]]) => g.pointerId === q.event.pointerId
    );
    Je.addListener(([g]) => {
      this.removePointer(g);
    });
    const hi = X(
      G(Je, ([g, [B, q]]) => !this.config.greedyGestureHandling && !B.infiniteCanvasDefaultPrevented && !q.infiniteCanvasDefaultPrevented),
      () => new pn("touchignored")
    ), { captureSource: li, bubbleSource: ui, afterBubble: di } = it(hi);
    di.addListener((g) => {
      g.infiniteCanvasDefaultPrevented || console.warn("use two fingers to move");
    }), this.cache = {
      mousemove: this.map(G(k(e, "mousemove"), () => !this.mouseAnchorIsFixed()), (g) => new xe(g)),
      mousedown: nt(Pt, Ct, i, r),
      pointerdown: nt(V, j, i, r),
      pointermove: this.map(
        js(
          G(l, () => this.hasNonFixedAnchorForSomePointer()),
          () => Js(this.anchorSet.getAll((g) => !g.anchor.fixedOnInfiniteCanvas).map((g) => g.pointerEvent))
        ),
        (g) => new ht(g)
      ),
      pointerleave: this.map(u, (g) => new ht(g)),
      pointerup: this.map(f, (g) => new ht(g)),
      pointercancel: this.map(d, (g) => new ht(g)),
      wheel: nt(ge, Rt, i, r),
      wheelignored: nt(si, oi, i, r),
      touchstart: nt(ue, de, i, r),
      touchignored: nt(li, ui, i, r),
      touchmove: this.map(m, (g) => {
        const B = ft(g.targetTouches), q = ft(g.targetTouches, (J) => !this.hasFixedAnchorForTouch(J.identifier));
        return Lt.create(
          this.rectangleManager.rectangle,
          g,
          B,
          q
        );
      })
    };
  }
  getEventSource(e) {
    return this.cache[e];
  }
  mouseAnchorIsFixed() {
    const e = this.anchorSet.find((n) => n.pointerEvent.pointerType === "mouse");
    return e ? e.anchor.fixedOnInfiniteCanvas : !1;
  }
  hasFixedAnchorForTouch(e) {
    const n = this.anchorSet.getAnchorForTouch(e);
    return !!n && n.anchor.fixedOnInfiniteCanvas;
  }
  hasNonFixedAnchorForSomePointer() {
    return !!this.anchorSet.find((e) => !e.anchor.fixedOnInfiniteCanvas);
  }
  transformUsingPointer(e, n) {
    this.rectangleManager.measure();
    const i = this.anchorSet.getAnchorForPointerEvent(n);
    i && (n.button === 1 && this.config.rotationEnabled ? (e.preventDefault(), this.transformer.addRotationAnchor(i.anchor)) : n.button === 0 && this.transformer.addAnchor(i.anchor));
  }
  removePointer(e) {
    const n = this.anchorSet.getAnchorForPointerEvent(e);
    n && (this.transformer.releaseAnchor(n.anchor), this.anchorSet.removeAnchor(n));
  }
  zoom(e) {
    if (!this.config.greedyGestureHandling && !e.ctrlKey)
      return;
    const { offsetX: n, offsetY: i } = e;
    let r = e.deltaY;
    const o = Math.pow(2, -r / 300);
    this.rectangleManager.measure(), this.transformer.zoom(n, i, o), e.preventDefault();
  }
}
class _s {
  constructor(t, e) {
    this.handledOrFilteredEventCollection = t, this.mappingCollection = e;
  }
  setOn(t, e) {
    Vt(t) ? this.handledOrFilteredEventCollection.setOn(t, e) : this.mappingCollection.setOn(t, e);
  }
  getOn(t) {
    return Vt(t) ? this.handledOrFilteredEventCollection.getOn(t) : this.mappingCollection.getOn(t);
  }
  addEventListener(t, e, n) {
    Vt(t) ? this.handledOrFilteredEventCollection.addEventListener(t, e, n) : this.mappingCollection.addEventListener(t, e, n);
  }
  removeEventListener(t, e, n) {
    Vt(t) ? this.handledOrFilteredEventCollection.removeEventListener(t, e, n) : this.mappingCollection.removeEventListener(t, e, n);
  }
}
class to {
  constructor(t, e, n, i) {
    this.mappedMouseEventCollection = t, this.mappedTouchEventCollection = e, this.mappedOnlyPointerEventCollection = n, this.mappedDragEventCollection = i;
  }
  setOn(t, e) {
    Mt(t) ? this.mappedMouseEventCollection.setOn(t, e) : qt(t) ? this.mappedTouchEventCollection.setOn(t, e) : Nt(t) ? this.mappedOnlyPointerEventCollection.setOn(t, e) : zt(t) && this.mappedDragEventCollection.setOn(t, e);
  }
  getOn(t) {
    if (Mt(t))
      return this.mappedMouseEventCollection.getOn(t);
    if (qt(t))
      return this.mappedTouchEventCollection.getOn(t);
    if (Nt(t))
      return this.mappedOnlyPointerEventCollection.getOn(t);
    if (zt(t))
      return this.mappedDragEventCollection.getOn(t);
  }
  addEventListener(t, e, n) {
    Mt(t) ? this.mappedMouseEventCollection.addEventListener(t, e, n) : qt(t) ? this.mappedTouchEventCollection.addEventListener(t, e, n) : Nt(t) ? this.mappedOnlyPointerEventCollection.addEventListener(t, e, n) : zt(t) && this.mappedDragEventCollection.addEventListener(t, e, n);
  }
  removeEventListener(t, e, n) {
    Mt(t) ? this.mappedMouseEventCollection.removeEventListener(t, e, n) : qt(t) ? this.mappedTouchEventCollection.removeEventListener(t, e, n) : Nt(t) ? this.mappedOnlyPointerEventCollection.removeEventListener(t, e, n) : zt(t) && this.mappedDragEventCollection.removeEventListener(t, e, n);
  }
}
class Tt extends Xe {
  constructor(t, e, n, i) {
    super(n, i), this.canvasEl = t, this.createInternalEvent = e, this.cache = {};
  }
  getEventSource(t) {
    return this.cache[t] || (this.cache[t] = this.createEventSource(t)), this.cache[t];
  }
  createEventSource(t) {
    return this.map(k(this.canvasEl, t), (e) => this.createInternalEvent(e));
  }
}
class eo extends le {
  get dataTransfer() {
    return this.event.dataTransfer;
  }
}
class no extends wt {
  constructor(e, n) {
    super(e, n);
    a(this, "props");
    this.props = at.create(e);
  }
  createResultEvent(e) {
    return new eo(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(e));
  }
}
class io extends wt {
  createResultEvent() {
    return this.event;
  }
}
class Ke {
  constructor(t, e, n, i) {
    this.drawEventCollection = t, this.transformationEventCollection = e, this.pointerEventCollection = n, this.unmappedEventCollection = i;
  }
  setOn(t, e) {
    t === "draw" ? this.drawEventCollection.setOn("draw", e) : kt(t) ? this.transformationEventCollection.setOn(t, e) : Ht(t) ? this.pointerEventCollection.setOn(t, e) : this.unmappedEventCollection.setOn(t, e);
  }
  getOn(t) {
    return t === "draw" ? this.drawEventCollection.getOn("draw") : kt(t) ? this.transformationEventCollection.getOn(t) : Ht(t) ? this.pointerEventCollection.getOn(t) : this.unmappedEventCollection.getOn(t);
  }
  addEventListener(t, e, n) {
    t === "draw" ? this.drawEventCollection.addEventListener("draw", e, n) : kt(t) ? this.transformationEventCollection.addEventListener(t, e, n) : Ht(t) ? this.pointerEventCollection.addEventListener(t, e, n) : this.unmappedEventCollection.addEventListener(t, e, n);
  }
  removeEventListener(t, e, n) {
    t === "draw" ? this.drawEventCollection.removeEventListener("draw", e, n) : kt(t) ? this.transformationEventCollection.removeEventListener(t, e, n) : Ht(t) ? this.pointerEventCollection.removeEventListener(t, e, n) : this.unmappedEventCollection.removeEventListener(t, e, n);
  }
  static create(t, e, n, i, r, o) {
    const c = new Ls(o, n, i), u = new As(e, n, i), l = new Zs(
      t,
      e,
      n,
      i,
      r
    ), f = new _s(
      l,
      new to(
        new Tt(t, (d) => new xe(d), n, i),
        new Tt(t, (d) => {
          const m = ft(d.targetTouches), w = ft(d.changedTouches);
          return Lt.create(
            n.rectangle,
            d,
            m,
            w
          );
        }, n, i),
        new Tt(t, (d) => new ht(d), n, i),
        new Tt(t, (d) => new no(d), n, i)
      )
    );
    return new Ke(
      c,
      u,
      f,
      new Tt(t, (d) => new io(d), n, i)
    );
  }
}
function ro(s, t) {
  let e = -1;
  const n = s.canvas.width;
  s.save(), s.fillStyle = "#fff", s.fillRect(0, 0, n, 5), s.filter = `drop-shadow(${t} 0)`, s.fillRect(0, 0, 1, 5);
  const r = s.getImageData(0, 0, n, 3).data;
  for (let o = 0; o < n; o++) {
    const c = 4 * (2 * n + o);
    if (r[c] !== 255) {
      e = o;
      break;
    }
  }
  return s.restore(), e;
}
function so(s, t) {
  const e = s.canvas.width;
  let n = 1, i = 1, r = -1;
  return f(), u(), o(), { numerator: n, denominator: i, pixels: r };
  function o() {
    let d = 0;
    do {
      const m = r;
      if (c(), r === m)
        break;
      d++;
    } while (d < 10);
  }
  function c() {
    const d = e / (r + 1);
    let m = r === 0 ? d : Math.min((e - 1) / r, d), w;
    for (; (w = Math.floor(m)) < 2; )
      m *= 10, i *= 10;
    n *= w, f(), l();
  }
  function u() {
    let d = 0;
    for (; r === -1 && d < 10; )
      i *= 10, f(), d++;
    l();
  }
  function l() {
    if (r === -1)
      throw new Error(`something went wrong while getting measurement for unit '${t}' on canvas with width ${e}`);
  }
  function f() {
    r = ro(s, `${n / i}${t}`);
  }
}
class oo {
  constructor(t) {
    a(this, "cache", {});
    this.ctx = t;
  }
  getNumberOfPixels(t, e) {
    if (t === 0)
      return 0;
    if (e === "px")
      return t;
    let n = this.cache[e];
    return n || (n = so(this.ctx, e), this.cache[e] = n), t * n.pixels * n.denominator / n.numerator;
  }
}
class ao {
  constructor(t) {
    a(this, "dispatcher", new et());
    a(this, "observer");
    a(this, "numberOfListeners", 0);
    this.canvas = t;
  }
  addListener(t, e) {
    this.dispatcher.addListener(t, () => {
      e == null || e(), this.numberOfListeners = Math.max(this.numberOfListeners - 1, 0), this.numberOfListeners === 0 && this.disconnect();
    }), this.numberOfListeners++, this.connectIfNeeded();
  }
  removeListener(t) {
    this.dispatcher.removeListener(t);
  }
  connectIfNeeded() {
    this.observer || (this.observer = new ResizeObserver((t) => this.dispatcher.dispatch(this.createCanvasMeasurement(t))), this.observer.observe(this.canvas));
  }
  createCanvasMeasurement([{ contentRect: t }]) {
    return {
      left: t.left,
      top: t.top,
      screenWidth: t.width,
      screenHeight: t.height,
      viewboxWidth: this.canvas.width,
      viewboxHeight: this.canvas.height
    };
  }
  disconnect() {
    this.observer && (this.observer.disconnect(), this.observer = void 0);
  }
}
function vn(s) {
  const { screenWidth: t, screenHeight: e } = s;
  return t > 0 && e > 0;
}
class co {
  constructor(t, e, n) {
    a(this, "currentlyVisible", !1);
    a(this, "listener");
    this.measurementProvider = t, this.resizes = e, this.viewBox = n;
  }
  observe() {
    const t = this.measurementProvider.measure();
    this.currentlyVisible = vn(t);
    const e = (n) => {
      const i = vn(n);
      i && !this.currentlyVisible && this.viewBox.draw(), this.currentlyVisible = i;
    };
    this.resizes.addListener(e), this.listener = e;
  }
  disconnect() {
    this.listener && (this.resizes.removeListener(this.listener), this.listener = void 0);
  }
}
class be {
  constructor(t, e) {
    a(this, "context");
    a(this, "viewBox");
    a(this, "config");
    a(this, "rectangleManager");
    a(this, "canvasResizes");
    a(this, "cssUnitsCanvasResizeListener");
    a(this, "canvasUnitsCanvasResizeObserver");
    a(this, "eventCollection");
    a(this, "cssLengthConverterFactory");
    this.canvas = t, this.config = { rotationEnabled: !0, greedyGestureHandling: !1, units: O.CANVAS }, e && Object.assign(this.config, e);
    const n = new ao(t);
    this.canvasResizes = n, this.cssUnitsCanvasResizeListener = () => {
      this.canvas.parentElement !== null && this.viewBox.draw();
    };
    const i = new ss(new rs()), r = new os(i), o = new hs(t);
    this.rectangleManager = new cs(o, this.config);
    let c;
    const u = t.getContext("2d");
    this.cssLengthConverterFactory = {
      create: () => new oo(u)
    };
    const l = new Qr(
      this.rectangleManager,
      u,
      r,
      () => r.getLock(),
      () => c.isTransforming
    );
    this.viewBox = l, this.canvasUnitsCanvasResizeObserver = new co(o, n, l), c = new is(this.viewBox, this.config), this.eventCollection = Ke.create(t, c, this.rectangleManager, this, this.config, i), this.config.units === O.CSS ? this.canvasResizes.addListener(this.cssUnitsCanvasResizeListener) : this.config.units === O.CANVAS && this.canvasUnitsCanvasResizeObserver.observe();
  }
  setUnits(t) {
    t === O.CSS && this.config.units !== O.CSS && (this.canvasUnitsCanvasResizeObserver.disconnect(), this.canvasResizes.addListener(this.cssUnitsCanvasResizeListener)), t === O.CANVAS && this.config.units !== O.CANVAS && (this.canvasResizes.removeListener(this.cssUnitsCanvasResizeListener), this.canvasUnitsCanvasResizeObserver.observe()), this.config.units = t, this.rectangleManager.measure(), this.viewBox.draw();
  }
  getContext() {
    return this.context || (this.context = new zr(this.canvas, this.viewBox, this.cssLengthConverterFactory)), this.context;
  }
  get transformation() {
    return vt(this.rectangleManager.rectangle.infiniteCanvasContext.inverseBase);
  }
  get inverseTransformation() {
    return vt(this.rectangleManager.rectangle.infiniteCanvasContext.base);
  }
  get rotationEnabled() {
    return this.config.rotationEnabled;
  }
  set rotationEnabled(t) {
    this.config.rotationEnabled = t;
  }
  get units() {
    return this.config.units;
  }
  set units(t) {
    this.setUnits(t);
  }
  get greedyGestureHandling() {
    return this.config.greedyGestureHandling;
  }
  set greedyGestureHandling(t) {
    this.config.greedyGestureHandling = t;
  }
  set ontransformationstart(t) {
    this.eventCollection.setOn("transformationstart", t);
  }
  get ontransformationstart() {
    return this.eventCollection.getOn("transformationstart");
  }
  set ontransformationchange(t) {
    this.eventCollection.setOn("transformationchange", t);
  }
  get ontransformationchange() {
    return this.eventCollection.getOn("transformationchange");
  }
  set ontransformationend(t) {
    this.eventCollection.setOn("transformationend", t);
  }
  get ontransformationend() {
    return this.eventCollection.getOn("transformationend");
  }
  set ondraw(t) {
    this.eventCollection.setOn("draw", t);
  }
  get ondraw() {
    return this.eventCollection.getOn("draw");
  }
  set onwheelignored(t) {
    this.eventCollection.setOn("wheelignored", t);
  }
  get onwheelignored() {
    return this.eventCollection.getOn("wheelignored");
  }
  set ontouchignored(t) {
    this.eventCollection.setOn("touchignored", t);
  }
  get ontouchignored() {
    return this.eventCollection.getOn("touchignored");
  }
  set onbeforeinput(t) {
    this.eventCollection.setOn("beforeinput", t);
  }
  get onbeforeinput() {
    return this.eventCollection.getOn("beforeinput");
  }
  set oncancel(t) {
    this.eventCollection.setOn("cancel", t);
  }
  get oncancel() {
    return this.eventCollection.getOn("cancel");
  }
  set oncopy(t) {
    this.eventCollection.setOn("copy", t);
  }
  get oncopy() {
    return this.eventCollection.getOn("copy");
  }
  set oncut(t) {
    this.eventCollection.setOn("cut", t);
  }
  get oncut() {
    return this.eventCollection.getOn("cut");
  }
  set onpaste(t) {
    this.eventCollection.setOn("paste", t);
  }
  get onpaste() {
    return this.eventCollection.getOn("paste");
  }
  set onabort(t) {
    this.eventCollection.setOn("abort", t);
  }
  get onabort() {
    return this.eventCollection.getOn("abort");
  }
  set onanimationcancel(t) {
    this.eventCollection.setOn("animationcancel", t);
  }
  get onanimationcancel() {
    return this.eventCollection.getOn("animationcancel");
  }
  set onanimationend(t) {
    this.eventCollection.setOn("animationend", t);
  }
  get onanimationend() {
    return this.eventCollection.getOn("animationend");
  }
  set onanimationiteration(t) {
    this.eventCollection.setOn("animationiteration", t);
  }
  get onanimationiteration() {
    return this.eventCollection.getOn("animationiteration");
  }
  set onanimationstart(t) {
    this.eventCollection.setOn("animationstart", t);
  }
  get onanimationstart() {
    return this.eventCollection.getOn("animationstart");
  }
  set onauxclick(t) {
    this.eventCollection.setOn("auxclick", t);
  }
  get onauxclick() {
    return this.eventCollection.getOn("auxclick");
  }
  set onblur(t) {
    this.eventCollection.setOn("blur", t);
  }
  get onblur() {
    return this.eventCollection.getOn("blur");
  }
  get oncanplay() {
    return this.eventCollection.getOn("canplay");
  }
  set oncanplay(t) {
    this.eventCollection.setOn("canplay", t);
  }
  get oncanplaythrough() {
    return this.eventCollection.getOn("canplaythrough");
  }
  set oncanplaythrough(t) {
    this.eventCollection.setOn("canplaythrough", t);
  }
  get onchange() {
    return this.eventCollection.getOn("change");
  }
  set onchange(t) {
    this.eventCollection.setOn("change", t);
  }
  get onclick() {
    return this.eventCollection.getOn("click");
  }
  set onclick(t) {
    this.eventCollection.setOn("click", t);
  }
  get onclose() {
    return this.eventCollection.getOn("close");
  }
  set onclose(t) {
    this.eventCollection.setOn("close", t);
  }
  get oncontextmenu() {
    return this.eventCollection.getOn("contextmenu");
  }
  set oncontextmenu(t) {
    this.eventCollection.setOn("contextmenu", t);
  }
  get oncuechange() {
    return this.eventCollection.getOn("cuechange");
  }
  set oncuechange(t) {
    this.eventCollection.setOn("cuechange", t);
  }
  get ondblclick() {
    return this.eventCollection.getOn("dblclick");
  }
  set ondblclick(t) {
    this.eventCollection.setOn("dblclick", t);
  }
  get onscrollend() {
    return this.eventCollection.getOn("scrollend");
  }
  set onscrollend(t) {
    this.eventCollection.setOn("scrollend", t);
  }
  get ondrag() {
    return this.eventCollection.getOn("drag");
  }
  set ondrag(t) {
    this.eventCollection.setOn("drag", t);
  }
  get ondragend() {
    return this.eventCollection.getOn("dragend");
  }
  set ondragend(t) {
    this.eventCollection.setOn("dragend", t);
  }
  get ondragenter() {
    return this.eventCollection.getOn("dragenter");
  }
  set ondragenter(t) {
    this.eventCollection.setOn("dragenter", t);
  }
  get onformdata() {
    return this.eventCollection.getOn("formdata");
  }
  set onformdata(t) {
    this.eventCollection.setOn("formdata", t);
  }
  get onwebkitanimationend() {
    return this.eventCollection.getOn("webkitanimationend");
  }
  set onwebkitanimationend(t) {
    this.eventCollection.setOn("webkitanimationend", t);
  }
  get onwebkitanimationstart() {
    return this.eventCollection.getOn("webkitanimationstart");
  }
  set onwebkitanimationstart(t) {
    this.eventCollection.setOn("webkitanimationstart", t);
  }
  get onwebkitanimationiteration() {
    return this.eventCollection.getOn("webkitanimationiteration");
  }
  set onwebkitanimationiteration(t) {
    this.eventCollection.setOn("webkitanimationiteration", t);
  }
  get onwebkittransitionend() {
    return this.eventCollection.getOn("webkittransitionend");
  }
  set onwebkittransitionend(t) {
    this.eventCollection.setOn("webkittransitionend", t);
  }
  get onslotchange() {
    return this.eventCollection.getOn("slotchange");
  }
  set onslotchange(t) {
    this.eventCollection.setOn("slotchange", t);
  }
  get ondragleave() {
    return this.eventCollection.getOn("dragleave");
  }
  set ondragleave(t) {
    this.eventCollection.setOn("dragleave", t);
  }
  get ondragover() {
    return this.eventCollection.getOn("dragover");
  }
  set ondragover(t) {
    this.eventCollection.setOn("dragover", t);
  }
  get ondragstart() {
    return this.eventCollection.getOn("dragstart");
  }
  set ondragstart(t) {
    this.eventCollection.setOn("dragstart", t);
  }
  get ondrop() {
    return this.eventCollection.getOn("drop");
  }
  set ondrop(t) {
    this.eventCollection.setOn("drop", t);
  }
  get ondurationchange() {
    return this.eventCollection.getOn("durationchange");
  }
  set ondurationchange(t) {
    this.eventCollection.setOn("durationchange", t);
  }
  get onemptied() {
    return this.eventCollection.getOn("emptied");
  }
  set onemptied(t) {
    this.eventCollection.setOn("emptied", t);
  }
  get onended() {
    return this.eventCollection.getOn("ended");
  }
  set onended(t) {
    this.eventCollection.setOn("ended", t);
  }
  get onerror() {
    return this.eventCollection.getOn("error");
  }
  set onerror(t) {
    this.eventCollection.setOn("error", t);
  }
  get onfocus() {
    return this.eventCollection.getOn("focus");
  }
  set onfocus(t) {
    this.eventCollection.setOn("focus", t);
  }
  get ongotpointercapture() {
    return this.eventCollection.getOn("gotpointercapture");
  }
  set ongotpointercapture(t) {
    this.eventCollection.setOn("gotpointercapture", t);
  }
  get oninput() {
    return this.eventCollection.getOn("input");
  }
  set oninput(t) {
    this.eventCollection.setOn("input", t);
  }
  get oninvalid() {
    return this.eventCollection.getOn("invalid");
  }
  set oninvalid(t) {
    this.eventCollection.setOn("invalid", t);
  }
  get onkeydown() {
    return this.eventCollection.getOn("keydown");
  }
  set onkeydown(t) {
    this.eventCollection.setOn("keydown", t);
  }
  get onkeypress() {
    return this.eventCollection.getOn("keypress");
  }
  set onkeypress(t) {
    this.eventCollection.setOn("keypress", t);
  }
  get onkeyup() {
    return this.eventCollection.getOn("keyup");
  }
  set onkeyup(t) {
    this.eventCollection.setOn("keyup", t);
  }
  get onload() {
    return this.eventCollection.getOn("load");
  }
  set onload(t) {
    this.eventCollection.setOn("load", t);
  }
  get onloadeddata() {
    return this.eventCollection.getOn("loadeddata");
  }
  set onloadeddata(t) {
    this.eventCollection.setOn("loadeddata", t);
  }
  get onloadedmetadata() {
    return this.eventCollection.getOn("loadedmetadata");
  }
  set onloadedmetadata(t) {
    this.eventCollection.setOn("loadedmetadata", t);
  }
  get onloadstart() {
    return this.eventCollection.getOn("loadstart");
  }
  set onloadstart(t) {
    this.eventCollection.setOn("loadstart", t);
  }
  get onlostpointercapture() {
    return this.eventCollection.getOn("lostpointercapture");
  }
  set onlostpointercapture(t) {
    this.eventCollection.setOn("lostpointercapture", t);
  }
  get onmousedown() {
    return this.eventCollection.getOn("mousedown");
  }
  set onmousedown(t) {
    this.eventCollection.setOn("mousedown", t);
  }
  get onmouseenter() {
    return this.eventCollection.getOn("mouseenter");
  }
  set onmouseenter(t) {
    this.eventCollection.setOn("mouseenter", t);
  }
  get onmouseleave() {
    return this.eventCollection.getOn("mouseleave");
  }
  set onmouseleave(t) {
    this.eventCollection.setOn("mouseleave", t);
  }
  get onmousemove() {
    return this.eventCollection.getOn("mousemove");
  }
  set onmousemove(t) {
    this.eventCollection.setOn("mousemove", t);
  }
  get onmouseout() {
    return this.eventCollection.getOn("mouseout");
  }
  set onmouseout(t) {
    this.eventCollection.setOn("mouseout", t);
  }
  get onmouseover() {
    return this.eventCollection.getOn("mouseover");
  }
  set onmouseover(t) {
    this.eventCollection.setOn("mouseover", t);
  }
  get onmouseup() {
    return this.eventCollection.getOn("mouseup");
  }
  set onmouseup(t) {
    this.eventCollection.setOn("mouseup", t);
  }
  get onpause() {
    return this.eventCollection.getOn("pause");
  }
  set onpause(t) {
    this.eventCollection.setOn("pause", t);
  }
  get onplay() {
    return this.eventCollection.getOn("play");
  }
  set onplay(t) {
    this.eventCollection.setOn("play", t);
  }
  get onplaying() {
    return this.eventCollection.getOn("playing");
  }
  set onplaying(t) {
    this.eventCollection.setOn("playing", t);
  }
  get onpointercancel() {
    return this.eventCollection.getOn("pointercancel");
  }
  set onpointercancel(t) {
    this.eventCollection.setOn("pointercancel", t);
  }
  get onpointerdown() {
    return this.eventCollection.getOn("pointerdown");
  }
  set onpointerdown(t) {
    this.eventCollection.setOn("pointerdown", t);
  }
  get onpointerenter() {
    return this.eventCollection.getOn("pointerenter");
  }
  set onpointerenter(t) {
    this.eventCollection.setOn("pointerenter", t);
  }
  get onpointerleave() {
    return this.eventCollection.getOn("pointerleave");
  }
  set onpointerleave(t) {
    this.eventCollection.setOn("pointerleave", t);
  }
  get onpointermove() {
    return this.eventCollection.getOn("pointermove");
  }
  set onpointermove(t) {
    this.eventCollection.setOn("pointermove", t);
  }
  get onpointerout() {
    return this.eventCollection.getOn("pointerout");
  }
  set onpointerout(t) {
    this.eventCollection.setOn("pointerout", t);
  }
  get onpointerover() {
    return this.eventCollection.getOn("pointerover");
  }
  set onpointerover(t) {
    this.eventCollection.setOn("pointerover", t);
  }
  get onpointerup() {
    return this.eventCollection.getOn("pointerup");
  }
  set onpointerup(t) {
    this.eventCollection.setOn("pointerup", t);
  }
  get onprogress() {
    return this.eventCollection.getOn("progress");
  }
  set onprogress(t) {
    this.eventCollection.setOn("progress", t);
  }
  get onratechange() {
    return this.eventCollection.getOn("ratechange");
  }
  set onratechange(t) {
    this.eventCollection.setOn("ratechange", t);
  }
  get onreset() {
    return this.eventCollection.getOn("reset");
  }
  set onreset(t) {
    this.eventCollection.setOn("reset", t);
  }
  get onresize() {
    return this.eventCollection.getOn("resize");
  }
  set onresize(t) {
    this.eventCollection.setOn("resize", t);
  }
  get onscroll() {
    return this.eventCollection.getOn("scroll");
  }
  set onscroll(t) {
    this.eventCollection.setOn("scroll", t);
  }
  get onsecuritypolicyviolation() {
    return this.eventCollection.getOn("securitypolicyviolation");
  }
  set onsecuritypolicyviolation(t) {
    this.eventCollection.setOn("securitypolicyviolation", t);
  }
  get onseeked() {
    return this.eventCollection.getOn("seeked");
  }
  set onseeked(t) {
    this.eventCollection.setOn("seeked", t);
  }
  get onseeking() {
    return this.eventCollection.getOn("seeking");
  }
  set onseeking(t) {
    this.eventCollection.setOn("seeking", t);
  }
  get onselect() {
    return this.eventCollection.getOn("select");
  }
  set onselect(t) {
    this.eventCollection.setOn("select", t);
  }
  get onselectionchange() {
    return this.eventCollection.getOn("selectionchange");
  }
  set onselectionchange(t) {
    this.eventCollection.setOn("selectionchange", t);
  }
  get onselectstart() {
    return this.eventCollection.getOn("selectstart");
  }
  set onselectstart(t) {
    this.eventCollection.setOn("selectstart", t);
  }
  get onstalled() {
    return this.eventCollection.getOn("stalled");
  }
  set onstalled(t) {
    this.eventCollection.setOn("stalled", t);
  }
  get onsubmit() {
    return this.eventCollection.getOn("submit");
  }
  set onsubmit(t) {
    this.eventCollection.setOn("submit", t);
  }
  get onsuspend() {
    return this.eventCollection.getOn("suspend");
  }
  set onsuspend(t) {
    this.eventCollection.setOn("suspend", t);
  }
  get ontimeupdate() {
    return this.eventCollection.getOn("timeupdate");
  }
  set ontimeupdate(t) {
    this.eventCollection.setOn("timeupdate", t);
  }
  get ontoggle() {
    return this.eventCollection.getOn("toggle");
  }
  set ontoggle(t) {
    this.eventCollection.setOn("toggle", t);
  }
  get ontouchcancel() {
    return this.eventCollection.getOn("touchcancel");
  }
  set ontouchcancel(t) {
    this.eventCollection.setOn("touchcancel", t);
  }
  get ontouchend() {
    return this.eventCollection.getOn("touchend");
  }
  set ontouchend(t) {
    this.eventCollection.setOn("touchend", t);
  }
  get ontouchmove() {
    return this.eventCollection.getOn("touchmove");
  }
  set ontouchmove(t) {
    this.eventCollection.setOn("touchmove", t);
  }
  get ontouchstart() {
    return this.eventCollection.getOn("touchstart");
  }
  set ontouchstart(t) {
    this.eventCollection.setOn("touchstart", t);
  }
  get ontransitioncancel() {
    return this.eventCollection.getOn("transitioncancel");
  }
  set ontransitioncancel(t) {
    this.eventCollection.setOn("transitioncancel", t);
  }
  get ontransitionend() {
    return this.eventCollection.getOn("transitionend");
  }
  set ontransitionend(t) {
    this.eventCollection.setOn("transitionend", t);
  }
  get ontransitionrun() {
    return this.eventCollection.getOn("transitionrun");
  }
  set ontransitionrun(t) {
    this.eventCollection.setOn("transitionrun", t);
  }
  get ontransitionstart() {
    return this.eventCollection.getOn("transitionstart");
  }
  set ontransitionstart(t) {
    this.eventCollection.setOn("transitionstart", t);
  }
  get onvolumechange() {
    return this.eventCollection.getOn("volumechange");
  }
  set onvolumechange(t) {
    this.eventCollection.setOn("volumechange", t);
  }
  get onwaiting() {
    return this.eventCollection.getOn("waiting");
  }
  set onwaiting(t) {
    this.eventCollection.setOn("waiting", t);
  }
  get onwheel() {
    return this.eventCollection.getOn("wheel");
  }
  set onwheel(t) {
    this.eventCollection.setOn("wheel", t);
  }
  addEventListener(t, e, n) {
    this.eventCollection.addEventListener(t, e, n);
  }
  removeEventListener(t, e, n) {
    this.eventCollection.removeEventListener(t, e, n);
  }
}
a(be, "CANVAS_UNITS", O.CANVAS), a(be, "CSS_UNITS", O.CSS);
const uo = be;
export {
  O as Units,
  uo as default
};
