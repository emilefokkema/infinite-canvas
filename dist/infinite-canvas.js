let ui = class {
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
Y.origin = new Y(0, 0);
let c = Y;
function at(s) {
  return s.toFixed(10).replace(/\.?0+$/, "");
}
const x = class x {
  constructor(t, e, n, i, r, o) {
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
    return new c(this.a * t.x + this.c * t.y + this.e, this.b * t.x + this.d * t.y + this.f);
  }
  untranslated() {
    const { x: t, y: e } = this.apply(c.origin);
    return this.before(x.translation(-t, -e));
  }
  before(t) {
    const e = t.a * this.a + t.c * this.b, n = t.b * this.a + t.d * this.b, i = t.a * this.c + t.c * this.d, r = t.b * this.c + t.d * this.d, o = t.a * this.e + t.c * this.f + t.e, a = t.b * this.e + t.d * this.f + t.f;
    return new x(e, n, i, r, o, a);
  }
  equals(t) {
    return this.a === t.a && this.b === t.b && this.c === t.c && this.d === t.d && this.e === t.e && this.f === t.f;
  }
  inverse() {
    var t = this.a * this.d - this.b * this.c;
    if (t == 0)
      throw new Error("error calculating inverse: zero determinant");
    const e = this.d / t, n = -this.b / t, i = -this.c / t, r = this.a / t, o = (this.c * this.f - this.d * this.e) / t, a = (this.b * this.e - this.a * this.f) / t;
    return new x(e, n, i, r, o, a);
  }
  static translation(t, e) {
    return new x(1, 0, 0, 1, t, e);
  }
  static scale(t) {
    return new x(t, 0, 0, t, 0, 0);
  }
  static zoom(t, e, n, i, r) {
    const o = 1 - n;
    return i !== void 0 ? new x(n, 0, 0, n, t * o + i, e * o + r) : new x(n, 0, 0, n, t * o, e * o);
  }
  static translateZoom(t, e, n, i, r, o, a, l) {
    const h = n - t, d = i - e, u = h * h + d * d;
    if (u === 0)
      throw new Error("divide by 0");
    const g = a - r, v = l - o, P = g * g + v * v, T = Math.sqrt(P / u);
    return x.zoom(t, e, T, r - t, o - e);
  }
  static rotation(t, e, n) {
    const i = Math.cos(n), r = Math.sin(n), o = 1 - i;
    return new x(
      i,
      r,
      -r,
      i,
      t * o + e * r,
      -t * r + e * o
    );
  }
  static translateRotateZoom(t, e, n, i, r, o, a, l) {
    const h = n - t, d = i - e, u = h * h + d * d;
    if (u === 0)
      throw new Error("divide by 0");
    const g = a - r, v = l - o, P = t * i - e * n, T = n * h + i * d, B = t * h + e * d, H = (h * g + d * v) / u, q = (h * v - d * g) / u, tt = -q, wt = H, Pt = (r * T - a * B - P * v) / u, Ct = (o * T - l * B + P * g) / u;
    return new x(H, q, tt, wt, Pt, Ct);
  }
  static create(t) {
    if (t instanceof x)
      return t;
    const { a: e, b: n, c: i, d: r, e: o, f: a } = t;
    return new x(e, n, i, r, o, a);
  }
  toString() {
    return `x: (${at(this.a)}, ${at(this.b)}), y: (${at(this.c)}, ${at(this.d)}), d: (${at(this.e)}, ${at(this.f)})`;
  }
};
x.identity = new x(1, 0, 0, 1, 0, 0);
let p = x;
class S {
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
const y = () => {
};
class di extends S {
  valuesAreEqual(t, e) {
    return t.equals(e);
  }
  changeToNewValue(t) {
    return (e, n) => {
      const { a: i, b: r, c: o, d: a, e: l, f: h } = n.getTransformationForInstruction(t);
      e.setTransform(i, r, o, a, l, h);
    };
  }
}
const qt = new di("transformation", y);
class fi {
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
    this.viewBox.changeState((t) => qt.changeInstanceValue(t, p.identity));
  }
  rotate(t) {
    this.addTransformation(p.rotation(0, 0, t));
  }
  scale(t, e) {
    this.addTransformation(new p(t, 0, 0, e, 0, 0));
  }
  setTransform(t, e, n, i, r, o) {
    let a, l, h, d, u, g;
    typeof t == "number" ? (a = t, l = e, h = n, d = i, u = r, g = o) : t.a !== void 0 ? (a = t.a, l = t.b, h = t.c, d = t.d, u = t.e, g = t.f) : (a = t.m11, l = t.m12, h = t.m21, d = t.m22, u = t.m41, g = t.m42), this.viewBox.changeState((v) => qt.changeInstanceValue(v, new p(a, l, h, d, u, g)));
  }
  transform(t, e, n, i, r, o) {
    this.addTransformation(new p(t, e, n, i, r, o));
  }
  translate(t, e) {
    this.addTransformation(p.translation(t, e));
  }
  addTransformation(t) {
    const e = this.viewBox.state.current.transformation, n = t.before(e);
    this.viewBox.changeState((i) => qt.changeInstanceValue(i, n));
  }
}
class gi extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.globalAlpha = t;
  }
}
const vn = new gi("globalAlpha", y);
class mi extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.globalCompositeOperation = t;
  }
}
const wn = new mi("globalCompositeOperation", y);
class pi {
  constructor(t) {
    this.viewBox = t;
  }
  get globalAlpha() {
    return this.viewBox.state.current.globalAlpha;
  }
  set globalAlpha(t) {
    this.viewBox.changeState((e) => vn.changeInstanceValue(e, t));
  }
  get globalCompositeOperation() {
    return this.viewBox.state.current.globalCompositeOperation;
  }
  set globalCompositeOperation(t) {
    this.viewBox.changeState((e) => wn.changeInstanceValue(e, t));
  }
}
class vi extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.imageSmoothingEnabled = t;
    };
  }
}
const Pn = new vi("imageSmoothingEnabled", y);
class wi extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.imageSmoothingQuality = t;
    };
  }
}
const Cn = new wi("imageSmoothingQuality", y);
class Pi {
  constructor(t) {
    this.viewBox = t;
  }
  get imageSmoothingEnabled() {
    return this.viewBox.state.current.imageSmoothingEnabled;
  }
  set imageSmoothingEnabled(t) {
    this.viewBox.changeState((e) => Pn.changeInstanceValue(e, t));
  }
  get imageSmoothingQuality() {
    return this.viewBox.state.current.imageSmoothingQuality;
  }
  set imageSmoothingQuality(t) {
    this.viewBox.changeState((e) => Cn.changeInstanceValue(e, t));
  }
}
class Gt {
}
class In extends Gt {
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
class Tn {
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
    return this.isEqualForInstances(t, e) ? !(n instanceof Gt) || t.fillAndStrokeStylesTransformed === e.fillAndStrokeStylesTransformed ? () => {
    } : e.fillAndStrokeStylesTransformed ? n.getInstructionToSetTransformed(this.propName) : n.getInstructionToSetUntransformed(this.propName) : n instanceof Gt ? e.fillAndStrokeStylesTransformed ? n.getInstructionToSetTransformed(this.propName) : n.getInstructionToSetUntransformed(this.propName) : (i) => {
      i[this.propName] = e[this.propName];
    };
  }
  valueIsTransformableForInstance(t) {
    return !(t[this.propName] instanceof In);
  }
}
const Sn = new Tn("fillStyle"), yn = new Tn("strokeStyle");
class Ci {
  constructor(t) {
    this.viewBox = t;
  }
  set fillStyle(t) {
    this.viewBox.changeState((e) => Sn.changeInstanceValue(e, t));
  }
  set strokeStyle(t) {
    this.viewBox.changeState((e) => yn.changeInstanceValue(e, t));
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
class Ii extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.shadowColor = t;
    };
  }
}
const xn = new Ii("shadowColor", y);
class Ti extends S {
  changeToNewValue(t) {
    return (e, n) => {
      const i = p.translation(t.x, t.y), r = n.translateInfiniteCanvasContextTransformationToBitmapTransformation(i), { x: o, y: a } = r.apply(c.origin);
      e.shadowOffsetX = o, e.shadowOffsetY = a;
    };
  }
  valuesAreEqual(t, e) {
    return t.x === e.x && t.y == e.y;
  }
}
const Ce = new Ti("shadowOffset", y);
class Si extends S {
  changeToNewValue(t) {
    return (e, n) => {
      const i = p.translation(t, 0), o = n.translateInfiniteCanvasContextTransformationToBitmapTransformation(i).apply(c.origin).mod();
      e.shadowBlur = o;
    };
  }
  valuesAreEqual(t, e) {
    return t === e;
  }
}
const bn = new Si("shadowBlur", y);
class yi {
  constructor(t) {
    this.viewBox = t;
  }
  get shadowBlur() {
    return this.viewBox.state.current.shadowBlur;
  }
  set shadowBlur(t) {
    this.viewBox.changeState((e) => bn.changeInstanceValue(e, t));
  }
  get shadowOffsetX() {
    return this.viewBox.state.current.shadowOffset.x;
  }
  set shadowOffsetX(t) {
    const e = new c(t, this.viewBox.state.current.shadowOffset.y);
    this.viewBox.changeState((n) => Ce.changeInstanceValue(n, e));
  }
  get shadowOffsetY() {
    return this.viewBox.state.current.shadowOffset.y;
  }
  set shadowOffsetY(t) {
    const e = new c(this.viewBox.state.current.shadowOffset.x, t);
    this.viewBox.changeState((n) => Ce.changeInstanceValue(n, e));
  }
  get shadowColor() {
    return this.viewBox.state.current.shadowColor;
  }
  set shadowColor(t) {
    this.viewBox.changeState((e) => xn.changeInstanceValue(e, t));
  }
}
const On = "[+-]?(?:\\d*\\.)?\\d+(?:e[+-]?\\d+)?", Ln = "[+-]?(?:0*\\.)?0+(?:e[+-]?\\d+)?", Bn = "(?:ch|em|ex|ic|rem|vh|vw|vmax|vmin|vb|vi|cqw|cqh|cqi|cqb|cqmin|cqmax|px|cm|mm|Q|in|pc|pt)", zt = `(?:${Ln}|${On}${Bn})`, An = `blur\\((${zt})\\)`, Ze = "[^())\\s]+(?:\\([^)]*?\\))?", Dn = `drop-shadow\\((${zt})\\s+(${zt})\\s*?(?:(?:(${zt})\\s*?(${Ze})?)|(${Ze}))?\\)`, _e = `${An}|${Dn}`;
function F(s, t) {
  const e = s.match(new RegExp(`(?:(${Ln})|(${On})(${Bn}))`));
  return e[1] ? 0 : t.getNumberOfPixels(Number.parseFloat(e[2]), e[3]);
}
class tn {
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
    return `blur(${t.translateInfiniteCanvasContextTransformationToBitmapTransformation(p.translation(this.size, 0)).apply(c.origin).mod()}px)`;
  }
  getShadowOffset() {
    return null;
  }
  static tryCreate(t, e) {
    const n = t.match(new RegExp(An));
    return n === null ? null : new Oe(t, F(n[1], e));
  }
}
class ht {
  constructor(t, e, n, i, r) {
    this.stringRepresentation = t, this.offsetX = e, this.offsetY = n, this.blurRadius = i, this.color = r;
  }
  toTransformedString(t) {
    const e = t.translateInfiniteCanvasContextTransformationToBitmapTransformation(p.translation(this.offsetX, this.offsetY)), { x: n, y: i } = e.apply(c.origin);
    if (this.blurRadius !== null) {
      const o = t.translateInfiniteCanvasContextTransformationToBitmapTransformation(p.translation(this.blurRadius, 0)).apply(c.origin).mod();
      return this.color ? `drop-shadow(${n}px ${i}px ${o}px ${this.color})` : `drop-shadow(${n}px ${i}px ${o}px)`;
    }
    return this.color ? `drop-shadow(${n}px ${i}px ${this.color})` : `drop-shadow(${n}px ${i}px)`;
  }
  getShadowOffset() {
    return new c(this.offsetX, this.offsetY);
  }
  static tryCreate(t, e) {
    const n = t.match(new RegExp(Dn));
    return n === null ? null : n[5] ? new ht(
      t,
      F(n[1], e),
      F(n[2], e),
      null,
      n[5]
    ) : n[4] ? new ht(
      t,
      F(n[1], e),
      F(n[2], e),
      F(n[3], e),
      n[4]
    ) : n[3] ? new ht(
      t,
      F(n[1], e),
      F(n[2], e),
      F(n[3], e),
      null
    ) : new ht(
      t,
      F(n[1], e),
      F(n[2], e),
      null,
      null
    );
  }
}
const St = class St {
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
    const i = t.match(new RegExp(`${_e}|((?!\\s|${_e}).)+`, "g")).map((r) => this.createPart(r, e));
    return new St(t, i);
  }
  static createPart(t, e) {
    let n = Oe.tryCreate(t, e);
    return n !== null || (n = ht.tryCreate(t, e), n != null) ? n : new tn(t);
  }
};
St.none = new St("none", [new tn("none")]);
let Yt = St;
class xi extends S {
  valuesAreEqual(t, e) {
    return t.stringRepresentation === e.stringRepresentation;
  }
  changeToNewValue(t) {
    return (e, n) => e.filter = t.toTransformedString(n);
  }
}
const En = new xi("filter", y);
class bi {
  constructor(t, e) {
    this.viewBox = t, this.cssLengthConverterFactory = e;
  }
  get filter() {
    return this.viewBox.state.current.filter.stringRepresentation;
  }
  set filter(t) {
    const e = Yt.create(t, this.cssLengthConverterFactory.create());
    this.viewBox.changeState((n) => En.changeInstanceValue(n, e));
  }
}
class Oi {
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
class Li {
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
class Bi {
  drawFocusIfNeeded(t, e) {
  }
  scrollPathIntoView(t) {
  }
}
var N = /* @__PURE__ */ ((s) => (s[s.None = 0] = "None", s[s.Relative = 1] = "Relative", s[s.Absolute = 2] = "Absolute", s))(N || {}), I = /* @__PURE__ */ ((s) => (s[s.Positive = 0] = "Positive", s[s.Negative = 1] = "Negative", s))(I || {});
const Xt = { direction: new c(0, 1) }, $t = { direction: new c(0, -1) }, Ut = { direction: new c(-1, 0) }, Kt = { direction: new c(1, 0) };
function Ai(s, t, e, n) {
  const i = e.minus(s), r = n.cross(t), o = n.getPerpendicular().dot(i) / r;
  return s.plus(t.scale(o));
}
class st {
  constructor(t, e, n) {
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
    return e.dot(n) <= 0 && (e = e.scale(-1)), new w(t, e);
  }
  static create(t, e, n) {
    return e.normalTowardInterior.cross(n.normalTowardInterior) >= 0 ? new st(t, e, n) : new st(t, n, e);
  }
}
class w {
  constructor(t, e) {
    this.base = t, this.normalTowardInterior = e, this.lengthOfNormal = e.mod();
  }
  getDistanceFromEdge(t) {
    return t.minus(this.base).dot(this.normalTowardInterior) / this.lengthOfNormal;
  }
  transform(t) {
    const e = t.apply(this.base), n = t.apply(this.base.plus(this.normalTowardInterior.getPerpendicular())), i = t.apply(this.base.plus(this.normalTowardInterior));
    return w.throughPointsAndContainingPoint(e, n, i);
  }
  complement() {
    return new w(this.base, this.normalTowardInterior.scale(-1));
  }
  expandByDistance(t) {
    const e = this.base.plus(this.normalTowardInterior.scale(-t / this.normalTowardInterior.mod()));
    return new w(e, this.normalTowardInterior);
  }
  expandToIncludePoint(t) {
    return this.containsPoint(t) ? this : new w(t, this.normalTowardInterior);
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
      point: Ai(this.base, this.normalTowardInterior.getPerpendicular(), t, e),
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
    const i = w.withBorderPoints(t, e);
    for (let r of i)
      if (r.containsPoint(n))
        return r;
  }
  static withBorderPointAndInfinityInDirection(t, e) {
    return w.withBorderPoints(t, t.plus(e));
  }
  static withBorderPoints(t, e) {
    const n = e.minus(t).getPerpendicular();
    return [
      new w(t, n),
      new w(t, n.scale(-1))
    ];
  }
}
class Di {
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
const mt = new Di();
class Ei {
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
const L = new Ei();
class m {
  constructor(t, e) {
    this.vertices = e, this.halfPlanes = t, this.vertices = this.vertices || m.getVertices(this.halfPlanes);
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
      const r = n.getIntersectionWith(t), o = i.find((a) => a.point.equals(r.point));
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
      const d = this.halfPlanes.map((u) => u.expandToIncludePoint(t));
      return new m(d);
    }
    const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
    let i = null, r = null;
    const o = [], a = /* @__PURE__ */ new Set();
    for (const d of this.vertices) {
      const u = d.leftHalfPlane;
      n.has(u) ? n.delete(u) : e.add(u);
      const g = d.rightHalfPlane;
      if (e.has(g) ? e.delete(g) : n.add(g), u.containsPoint(t)) {
        if (a.add(u), g.containsPoint(t)) {
          a.add(g), o.push(d);
          continue;
        }
        i = d;
        continue;
      }
      g.containsPoint(t) && (a.add(g), r = d);
    }
    if (o.length === this.vertices.length)
      return this;
    let l, h;
    if (i === null) {
      const d = [...e][0];
      if (!d)
        return this;
      l = d.expandToIncludePoint(t);
    } else
      l = i.getContainingHalfPlaneThroughPoint(t), l !== i.leftHalfPlane && o.push(i.replaceRightHalfPlane(l));
    if (r === null) {
      const d = [...n][0];
      if (!d)
        return this;
      h = d.expandToIncludePoint(t);
    } else
      h = r.getContainingHalfPlaneThroughPoint(t), h !== r.rightHalfPlane && o.push(r.replaceLeftHalfPlane(h));
    return a.add(l), a.add(h), o.push(new st(t, l, h)), new m([...a], o);
  }
  expandToIncludeInfinityInDirection(t) {
    if (this.containsInfinityInDirection(t))
      return this;
    let e = this.halfPlanes.filter((n) => n.containsInfinityInDirection(t)).concat(this.getTangentPlanesThroughInfinityInDirection(t));
    return e = m.getHalfPlanesNotContainingAnyOther(e), e.length === 0 ? mt : new m(e);
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
    return new m(this.halfPlanes.map((e) => e.expandByDistance(t)));
  }
  transform(t) {
    return new m(this.halfPlanes.map((e) => e.transform(t)));
  }
  intersectWithConvexPolygon(t) {
    if (t.isContainedByConvexPolygon(this))
      return t;
    if (this.isContainedByConvexPolygon(t))
      return this;
    if (this.isOutsideConvexPolygon(t))
      return L;
    const e = m.getHalfPlanesNotContainingAnyOther(this.halfPlanes.concat(t.halfPlanes)), r = m.groupVerticesByPoint(m.getVertices(e)).map((a) => m.getVerticesNotContainingAnyOther(a)).reduce((a, l) => a.concat(l), []);
    if (r.length === 0)
      return new m(e);
    const o = m.getHalfPlanes(r);
    return new m(o);
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
      const i = w.withBorderPointAndInfinityInDirection(n.point, t);
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
        const a = r.getIntersectionWith(o);
        let l = !0;
        for (let h = 0; h < t.length; h++) {
          if (h === n || h === i)
            continue;
          if (!t[h].containsPoint(a.point)) {
            l = !1;
            break;
          }
        }
        l && e.push(a);
      }
    return e;
  }
  static createTriangleWithInfinityInTwoDirections(t, e, n) {
    const i = e.getPerpendicular(), r = n.getPerpendicular();
    return e.cross(n) < 0 ? new m([
      new w(t, i.scale(-1)),
      new w(t, r)
    ]) : new m([
      new w(t, i),
      new w(t, r.scale(-1))
    ]);
  }
  static createFromHalfPlane(t) {
    return new m([t]);
  }
  static createTriangleWithInfinityInDirection(t, e, n) {
    const i = e.minus(t).projectOn(n.getPerpendicular());
    return new m([
      new w(t, i),
      new w(e, i.scale(-1)),
      w.throughPointsAndContainingPoint(t, e, t.plus(n))
    ]);
  }
  static createTriangle(t, e, n) {
    return new m([
      w.throughPointsAndContainingPoint(t, e, n),
      w.throughPointsAndContainingPoint(t, n, e),
      w.throughPointsAndContainingPoint(e, n, t)
    ]);
  }
}
function U(...s) {
  return (...t) => {
    for (const e of s)
      e && e(...t);
  };
}
function Ri(s, t) {
  return t ? (e, n) => {
    e.save(), t(e, n), s(e, n), e.restore();
  } : s;
}
function Fi(s) {
  return s === N.Relative ? (t, e) => {
    const { a: n, b: i, c: r, d: o, e: a, f: l } = e.getBitmapTransformationToTransformedInfiniteCanvasContext();
    t.transform(n, i, r, o, a, l);
  } : s === N.Absolute ? (t, e) => {
    const { a: n, b: i, c: r, d: o, e: a, f: l } = e.getBitmapTransformationToInfiniteCanvasContext();
    t.setTransform(n, i, r, o, a, l);
  } : null;
}
function Wi(s, t) {
  let e = s.area;
  return e && t.lineWidth > 0 && (e = e.expandByDistance(t.lineWidth / 2)), e;
}
function ki(s) {
  return {
    lineWidth: s.current.getMaximumLineWidth(),
    lineDashPeriod: s.current.getLineDashPeriod(),
    shadowOffsets: s.current.getShadowOffsets()
  };
}
function Hi(s) {
  return {
    lineWidth: 0,
    lineDashPeriod: 0,
    shadowOffsets: s.current.getShadowOffsets()
  };
}
class V {
  constructor(t, e, n, i, r, o, a) {
    this.instruction = t, this.area = e, this.build = n, this.takeClippingRegionIntoAccount = i, this.transformationKind = r, this.state = o, this.tempState = a;
  }
  static forStrokingPath(t, e, n) {
    return V.forPath(t, e, ki, n);
  }
  static forFillingPath(t, e, n) {
    return V.forPath(t, e, Hi, n);
  }
  static forPath(t, e, n, i) {
    const r = e.current.isTransformable(), o = r ? N.None : N.Relative, a = e.currentlyTransformed(r), l = n(a), h = i(a), d = Wi(h, l);
    return new V(
      t,
      d,
      (u) => h.drawPath(u, a, l),
      !0,
      o,
      a
    );
  }
  getDrawnArea() {
    let t = this.area;
    const e = this.state;
    if (e.current.shadowBlur !== 0 || !e.current.shadowOffset.equals(c.origin)) {
      const n = t.expandByDistance(e.current.shadowBlur).transform(p.translation(e.current.shadowOffset.x, e.current.shadowOffset.y));
      t = t.join(n);
    }
    return e.current.clippingRegion && this.takeClippingRegionIntoAccount && (t = t.intersectWith(e.current.clippingRegion)), t;
  }
  getModifiedInstruction() {
    let t = Fi(this.transformationKind);
    if (this.tempState) {
      const n = this.takeClippingRegionIntoAccount ? this.state.getInstructionToConvertToStateWithClippedPath(this.tempState) : this.state.getInstructionToConvertToState(this.tempState);
      t = U(t, n);
    }
    return Ri(this.instruction, t);
  }
}
class Le {
  constructor(t) {
    this.initiallyWithState = t, this.added = [];
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
class gt extends Be {
  constructor(t, e, n, i) {
    super(t, e), this.instruction = n, this.stateConversion = i;
  }
  makeExecutable() {
    return new K(this.initialState, this.state, this.instruction, this.stateConversion);
  }
  static create(t, e) {
    return new gt(t, t, e, () => {
    });
  }
}
function C(s) {
  return s.direction !== void 0;
}
function J(s, t) {
  return C(s) ? t.applyToPointAtInfinity(s) : t.apply(s);
}
class Vi {
  constructor(t, e) {
    this.areaBuilder = t, this.transformation = e;
  }
  addPosition(t) {
    this.areaBuilder.addPosition(J(t, this.transformation));
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
    const e = this.direction.getPerpendicular(), n = new w(this.base, e).expandByDistance(t), i = new w(this.base, e.scale(-1)).expandByDistance(t);
    return new m([n, i]);
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
class oe extends Ae {
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
      return L;
    if (this.isContainedByConvexPolygon(t))
      return this;
    const e = t.getIntersectionsWithLine(this.base, this.direction);
    let n, i;
    for (let r of e)
      (!n && !i || !n && this.comesBefore(r.point, i) || !i && this.comesBefore(n, r.point) || n && i && this.pointIsBetweenPoints(r.point, n, i)) && (r.halfPlane.normalTowardInterior.dot(this.direction) > 0 ? n = r.point : i = r.point);
    return n && i ? new D(n, i) : n ? new M(n, this.direction) : new M(i, this.direction.scale(-1));
  }
  intersectWithLine(t) {
    return this.intersectsLine(t) ? this : L;
  }
  intersectWithLineSegment(t) {
    return this.lineSegmentIsOnSameLine(t) ? t : L;
  }
  intersectWithRay(t) {
    return this.intersectsRay(t) ? t : L;
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
    return this.pointIsOnSameLine(t) ? this : m.createTriangleWithInfinityInDirection(this.base, t, this.direction).expandToIncludeInfinityInDirection(this.direction.scale(-1));
  }
  expandByDistance(t) {
    return this.expandLineByDistance(t);
  }
  expandToIncludeInfinityInDirection(t) {
    const e = t.cross(this.direction), n = this.direction.getPerpendicular();
    return e === 0 ? this : e > 0 ? m.createFromHalfPlane(new w(this.base, n.scale(-1))) : m.createFromHalfPlane(new w(this.base, n));
  }
  transform(t) {
    const e = t.apply(this.base);
    return new oe(e, t.apply(this.base.plus(this.direction)).minus(e));
  }
  interiorContainsPoint(t) {
    return this.pointIsOnSameLine(t);
  }
}
class M extends Ae {
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
      return L;
    if (this.isContainedByConvexPolygon(t))
      return this;
    const e = t.getIntersectionsWithLine(this.base, this.direction);
    let n = this.base, i;
    for (let r of e)
      (!i && this.comesBefore(n, r.point) || i && this.pointIsBetweenPoints(r.point, n, i)) && (r.halfPlane.normalTowardInterior.dot(this.direction) > 0 ? n = r.point : i = r.point);
    return i ? new D(n, i) : new M(n, this.direction);
  }
  intersectWithRay(t) {
    return this.isContainedByRay(t) ? this : t.isContainedByRay(this) ? t : this.interiorContainsPoint(t.base) ? new D(this.base, t.base) : L;
  }
  intersectWithLine(t) {
    return t.intersectWithRay(this);
  }
  intersectWithLineSegment(t) {
    if (t.isContainedByRay(this))
      return t;
    if (!this.lineSegmentIsOnSameLine(t))
      return L;
    let { point2: e } = this.getPointsInSameDirection(t.point1, t.point2);
    return this.comesBefore(e, this.base) ? L : new D(this.base, e);
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
    return this.containsPoint(t) ? this : this.pointIsOnSameLine(t) ? new M(t, this.direction) : m.createTriangleWithInfinityInDirection(this.base, t, this.direction);
  }
  expandByDistance(t) {
    const e = this.expandLineByDistance(t), n = new w(this.base, this.direction).expandByDistance(t);
    return e.intersectWithConvexPolygon(new m([n]));
  }
  expandToIncludeInfinityInDirection(t) {
    return t.inSameDirectionAs(this.direction) ? this : this.direction.cross(t) === 0 ? new oe(this.base, this.direction) : m.createTriangleWithInfinityInTwoDirections(this.base, this.direction, t);
  }
  transform(t) {
    const e = t.apply(this.base);
    return new M(e, t.apply(this.base.plus(this.direction)).minus(e));
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
class D extends Ae {
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
      return L;
    let { point1: e, point2: n } = this.getPointsInSameDirection(t.point1, t.point2);
    return this.comesBefore(n, this.point1) || this.comesBefore(this.point2, e) ? L : this.comesBefore(this.point1, e) ? new D(e, this.point2) : new D(this.point1, n);
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
      return L;
    if (this.isContainedByConvexPolygon(t))
      return this;
    const e = t.getIntersectionsWithLine(this.point1, this.direction);
    let n = this.point1, i = this.point2;
    for (let r of e)
      this.pointIsBetweenPoints(r.point, n, i) && (r.halfPlane.normalTowardInterior.dot(this.direction) > 0 ? n = r.point : i = r.point);
    return new D(n, i);
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
    const e = this.expandLineByDistance(t), n = new w(this.base, this.direction).expandByDistance(t), i = new w(this.point2, this.direction.scale(-1)).expandByDistance(t);
    return e.intersectWithConvexPolygon(new m([n, i]));
  }
  expandToIncludePoint(t) {
    return this.containsPoint(t) ? this : this.pointIsOnSameLine(t) ? this.comesBefore(t, this.point1) ? new D(t, this.point2) : new D(this.point1, t) : m.createTriangle(this.point1, t, this.point2);
  }
  expandToIncludeInfinityInDirection(t) {
    return t.inSameDirectionAs(this.direction) ? new M(this.point1, t) : t.cross(this.direction) === 0 ? new M(this.point2, t) : m.createTriangleWithInfinityInDirection(this.point1, this.point2, t);
  }
  transform(t) {
    return new D(t.apply(this.point1), t.apply(this.point2));
  }
}
class Mi {
  addPoint(t) {
    return mt;
  }
  addPointAtInfinity(t) {
    return this;
  }
  addArea(t) {
    return mt;
  }
}
const De = new Mi();
class Ie {
  constructor(t) {
    this.towardsMiddle = t;
  }
  addPoint(t) {
    return m.createFromHalfPlane(new w(t, this.towardsMiddle));
  }
  addPointAtInfinity(t) {
    return t.dot(this.towardsMiddle) >= 0 ? this : De;
  }
  addArea(t) {
    const e = this.towardsMiddle.getPerpendicular();
    return t.expandToIncludeInfinityInDirection(this.towardsMiddle).expandToIncludeInfinityInDirection(e).expandToIncludeInfinityInDirection(e.scale(-1));
  }
}
class jt {
  constructor(t, e) {
    this.direction1 = t, this.direction2 = e;
  }
  addPoint(t) {
    return m.createTriangleWithInfinityInTwoDirections(t, this.direction1, this.direction2);
  }
  addPointAtInfinity(t) {
    return t.isInSmallerAngleBetweenPoints(this.direction1, this.direction2) ? this : t.cross(this.direction1) === 0 ? new Ie(this.direction2.projectOn(this.direction1.getPerpendicular())) : t.cross(this.direction2) === 0 ? new Ie(this.direction1.projectOn(this.direction2.getPerpendicular())) : this.direction1.isInSmallerAngleBetweenPoints(t, this.direction2) ? new jt(t, this.direction2) : this.direction2.isInSmallerAngleBetweenPoints(t, this.direction1) ? new jt(t, this.direction1) : De;
  }
  addArea(t) {
    return t.expandToIncludeInfinityInDirection(this.direction1).expandToIncludeInfinityInDirection(this.direction2);
  }
}
class Ni {
  constructor(t) {
    this.direction = t;
  }
  addPoint(t) {
    return new oe(t, this.direction);
  }
  addPointAtInfinity(t) {
    return t.cross(this.direction) === 0 ? this : new Ie(t.projectOn(this.direction.getPerpendicular()));
  }
  addArea(t) {
    return t.expandToIncludeInfinityInDirection(this.direction).expandToIncludeInfinityInDirection(this.direction.scale(-1));
  }
}
class qi {
  constructor(t) {
    this.direction = t;
  }
  addPointAtInfinity(t) {
    return t.inSameDirectionAs(this.direction) ? this : t.cross(this.direction) === 0 ? new Ni(this.direction) : new jt(this.direction, t);
  }
  addPoint(t) {
    return new M(t, this.direction);
  }
  addArea(t) {
    return t.expandToIncludeInfinityInDirection(this.direction);
  }
}
class zi {
  constructor(t, e, n) {
    this._area = t, this.firstPoint = e, this.subsetOfLineAtInfinity = n;
  }
  get area() {
    return this._area || L;
  }
  addPoint(t) {
    this._area ? this._area = this._area.expandToIncludePoint(t) : this.firstPoint ? t.equals(this.firstPoint) || (this._area = new D(this.firstPoint, t)) : this.subsetOfLineAtInfinity ? this._area = this.subsetOfLineAtInfinity.addPoint(t) : this.firstPoint = t;
  }
  addPosition(t) {
    C(t) ? this.addInfinityInDirection(t.direction) : this.addPoint(t);
  }
  addInfinityInDirection(t) {
    this._area ? this._area = this._area.expandToIncludeInfinityInDirection(t) : this.firstPoint ? this._area = new M(this.firstPoint, t) : this.subsetOfLineAtInfinity ? (this.subsetOfLineAtInfinity = this.subsetOfLineAtInfinity.addPointAtInfinity(t), this.subsetOfLineAtInfinity === De && (this._area = mt)) : this.subsetOfLineAtInfinity = new qi(t);
  }
  transformedWith(t) {
    return new Vi(this, t);
  }
}
class Qt extends Be {
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
    return new Qt(t, t, e, () => {
    });
  }
}
function Gi(s, t) {
  return s ? t ? C(s) ? C(t) && s.direction.equals(t.direction) : !C(t) && s.equals(t) : !s : !t;
}
class Lt {
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
class ae {
  constructor(t, e, n, i) {
    this.initialPosition = t, this.firstFinitePoint = e, this.lastFinitePoint = n, this.currentPosition = i;
  }
  transform(t) {
    return new ae(
      t.applyToPointAtInfinity(this.initialPosition),
      t.apply(this.firstFinitePoint),
      t.apply(this.lastFinitePoint),
      t.applyToPointAtInfinity(this.currentPosition)
    );
  }
}
class Bt {
  constructor(t, e, n) {
    this.initialPosition = t, this.firstFinitePoint = e, this.currentPosition = n;
  }
  transform(t) {
    return new Bt(
      t.applyToPointAtInfinity(this.initialPosition),
      t.apply(this.firstFinitePoint),
      t.apply(this.currentPosition)
    );
  }
}
class Yi extends Lt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    return t.initialPosition.direction.cross(t.currentPosition.direction) === 0 ? this.moveToInfinityFromPointInDirection(t.firstFinitePoint, t.initialPosition.direction) : U(
      this.moveToInfinityFromPointInDirection(t.lastFinitePoint, t.currentPosition.direction),
      this.lineToInfinityFromInfinityFromPoint(t.lastFinitePoint, t.currentPosition.direction, t.initialPosition.direction),
      this.lineFromInfinityFromPointToInfinityFromPoint(t.lastFinitePoint, t.firstFinitePoint, t.initialPosition.direction)
    );
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    return C(e) ? this.lineToInfinityFromInfinityFromPoint(t.lastFinitePoint, t.currentPosition.direction, e.direction) : U(
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
    return !C(t) || !t.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
  }
  addPosition(t) {
    return C(t) ? this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(new ae(this.shape.initialPosition, this.shape.firstFinitePoint, this.shape.lastFinitePoint, t)) : this.pathBuilderProvider.fromPointAtInfinityToPoint(new Bt(this.shape.initialPosition, this.shape.firstFinitePoint, t));
  }
}
class Xi extends Lt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    const e = this.moveToInfinityFromPointInDirection(t.currentPosition, t.initialPosition.direction);
    if (t.currentPosition.equals(t.firstFinitePoint))
      return e;
    const n = this.lineFromInfinityFromPointToInfinityFromPoint(t.currentPosition, t.firstFinitePoint, t.initialPosition.direction);
    return U(e, n);
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    return C(e) ? this.lineToInfinityFromPointInDirection(t.currentPosition, e.direction) : this.lineTo(e);
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
    return C(t) ? this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(new ae(this.shape.initialPosition, this.shape.firstFinitePoint, this.shape.currentPosition, t)) : this.pathBuilderProvider.fromPointAtInfinityToPoint(new Bt(this.shape.initialPosition, this.shape.firstFinitePoint, t));
  }
}
class ce {
  constructor(t, e) {
    this.initialPoint = t, this.currentPosition = e;
  }
  transform(t) {
    return new ce(
      t.apply(this.initialPoint),
      t.applyToPointAtInfinity(this.currentPosition)
    );
  }
}
class At {
  constructor(t, e) {
    this.initialPoint = t, this.currentPosition = e;
  }
  transform(t) {
    return new At(
      t.apply(this.initialPoint),
      t.apply(this.currentPosition)
    );
  }
}
class $i extends Lt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    return this.moveTo(t.initialPoint);
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    return C(e) ? e.direction.inSameDirectionAs(t.currentPosition.direction) ? () => {
    } : this.lineToInfinityFromInfinityFromPoint(t.initialPoint, t.currentPosition.direction, e.direction) : U(this.lineFromInfinityFromPointToInfinityFromPoint(t.initialPoint, e, t.currentPosition.direction), this.lineFromInfinityFromPointToPoint(e, t.currentPosition.direction));
  }
  canAddLineTo(t) {
    return !C(t) || !t.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
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
    return C(t) ? this.pathBuilderProvider.fromPointToPointAtInfinity(new ce(this.shape.initialPoint, t)) : this.pathBuilderProvider.fromPointToPoint(new At(this.shape.initialPoint, t));
  }
}
class en extends Lt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    return this.moveTo(t.initialPoint);
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    if (C(e)) {
      const n = this.lineToInfinityFromPointInDirection(t.currentPosition, e.direction);
      if (t.currentPosition.minus(t.initialPoint).cross(e.direction) === 0)
        return n;
      const i = this.lineFromInfinityFromPointToInfinityFromPoint(t.currentPosition, t.initialPoint, e.direction);
      return U(n, i);
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
    return C(t) ? this.pathBuilderProvider.fromPointToPointAtInfinity(new ce(this.shape.initialPoint, t)) : this.pathBuilderProvider.fromPointToPoint(new At(this.shape.initialPoint, t));
  }
}
class he {
  constructor(t, e, n, i) {
    this.initialPosition = t, this.surroundsFinitePoint = e, this.positionsSoFar = n, this.currentPosition = i;
  }
  transform(t) {
    return new he(
      t.applyToPointAtInfinity(this.initialPosition),
      this.surroundsFinitePoint,
      this.positionsSoFar.map((e) => t.applyToPointAtInfinity(e)),
      t.applyToPointAtInfinity(this.currentPosition)
    );
  }
}
class nn extends Lt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    return t.surroundsFinitePoint ? (e, n, i) => i.addPathAroundViewbox(e, n) : () => {
    };
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    if (C(e))
      return;
    if (t.positionsSoFar.length === 1)
      return this.lineFromInfinityFromPointToPoint(e, t.positionsSoFar[0].direction);
    const n = t.positionsSoFar.slice(1);
    let i = t.initialPosition;
    const r = [];
    for (let o of n)
      r.push(this.lineToInfinityFromInfinityFromPoint(e, i.direction, o.direction)), i = o;
    return U(U(...r), this.lineFromInfinityFromPointToPoint(e, i.direction));
  }
  canAddLineTo(t) {
    return !C(t) || !t.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
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
    if (C(t)) {
      const n = t.direction.isOnSameSideOfOriginAs(this.shape.initialPosition.direction, this.shape.currentPosition.direction) ? this.shape.surroundsFinitePoint : !this.shape.surroundsFinitePoint;
      return this.pathBuilderProvider.atInfinity(new he(this.shape.initialPosition, n, this.shape.positionsSoFar.concat([t]), t));
    }
    return this.pathBuilderProvider.fromPointAtInfinityToPoint(new Bt(this.shape.initialPosition, t, t));
  }
}
class Ui {
  fromPointAtInfinityToPointAtInfinity(t) {
    return new Yi(this, t);
  }
  fromPointAtInfinityToPoint(t) {
    return new Xi(this, t);
  }
  fromPointToPointAtInfinity(t) {
    return new $i(this, t);
  }
  fromPointToPoint(t) {
    return new en(this, t);
  }
  atInfinity(t) {
    return new nn(this, t);
  }
  getBuilderFromPosition(t) {
    return C(t) ? new nn(this, new he(t, !1, [t], t)) : new en(this, new At(t, t));
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
    const t = gt.create(this.state, (e) => {
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
    const n = J(t, e.current.transformation);
    (!C(t) || this.pathInstructionBuilder.containsFinitePoint()) && this.addInstructionToDrawLineTo(t, e), this.pathInstructionBuilder = this.pathInstructionBuilder.addPosition(n);
    const i = this.pathInstructionBuilder.getInstructionToMoveToBeginning(this._initiallyWithState.state);
    this._initiallyWithState.replaceInstruction((r, o, a) => {
      i(r, o, a);
    });
  }
  addInstructionToDrawLineTo(t, e) {
    const n = this.pathInstructionBuilder.getInstructionToDrawLineTo(t, e), i = Qt.create(e, n);
    i.setInitialState(this.state), this.add(i);
  }
  addPathInstruction(t, e, n) {
    t.initialPoint && !Gi(this.pathInstructionBuilder.currentPosition, t.initialPoint) && this.lineTo(t.initialPoint, n), t.positionChange && (this.pathInstructionBuilder = this.pathInstructionBuilder.addPosition(J(t.positionChange, n.current.transformation))), e.setInitialState(this.state), this.add(e);
  }
  static create(t, e) {
    const n = J(e, t.current.transformation), i = new Ui().getBuilderFromPosition(n), r = i.getInstructionToMoveToBeginning(t), o = Qt.create(t, r);
    return new Re(o, i);
  }
}
function Ki(s, t, e) {
  let n = 0, i;
  for (let r of s) {
    const o = r.minus(t).dot(e);
    o > n && (i = r, n = o);
  }
  return i ? t.plus(i.minus(t).projectOn(e)) : t;
}
function R(s, t, e) {
  return Ki(s.getVertices(), t, e);
}
class ji {
  constructor(t, e) {
    this.state = t, this.drawnPathProperties = e;
  }
  addPathAroundViewbox(t, e) {
    e.addPathAroundViewbox(t, this.drawnPathProperties.lineWidth);
  }
  getTransformedViewbox(t) {
    const e = this.state.current.transformation.before(t.getBitmapTransformationToInfiniteCanvasContext());
    let n = t.polygon;
    n = n.transform(e.inverse()).expandByDistance(this.drawnPathProperties.lineWidth);
    for (const i of this.drawnPathProperties.shadowOffsets) {
      const r = n.transform(p.translation(-i.x, -i.y));
      n = n.join(r);
    }
    return n;
  }
  clearRect(t, e, n, i, r, o) {
    const a = this.getTransformedViewbox(e), { a: l, b: h, c: d, d: u, e: g, f: v } = e.userTransformation;
    t.save(), t.transform(l, h, d, u, g, v);
    const P = Number.isFinite(n) ? n : R(a, new c(0, 0), n > 0 ? Kt.direction : Ut.direction).x, T = Number.isFinite(r) ? n + r : R(a, new c(0, 0), r > 0 ? Kt.direction : Ut.direction).x, B = Number.isFinite(i) ? i : R(a, new c(0, 0), i > 0 ? Xt.direction : $t.direction).y, H = Number.isFinite(o) ? i + o : R(a, new c(0, 0), o > 0 ? Xt.direction : $t.direction).y;
    t.clearRect(P, B, T - P, H - B), t.restore();
  }
  moveToInfinityFromPointInDirection(t, e, n, i) {
    const r = R(this.getTransformedViewbox(e), n, i);
    this.moveToTransformed(t, r, e.userTransformation);
  }
  drawLineToInfinityFromInfinityFromPoint(t, e, n, i, r) {
    const o = this.getTransformedViewbox(e), a = R(o, n, i), l = R(o, n, r), h = e.userTransformation, u = o.expandToIncludePoint(n).expandToIncludePoint(a).expandToIncludePoint(l).getVertices().filter((P) => !P.equals(a) && !P.equals(l) && !P.equals(n) && P.minus(n).isInSmallerAngleBetweenPoints(i, r));
    u.sort((P, T) => P.minus(n).isInSmallerAngleBetweenPoints(T.minus(n), i) ? -1 : 1);
    let g = a, v = 0;
    for (let P of u)
      v += P.minus(g).mod(), this.lineToTransformed(t, P, h), g = P;
    v += l.minus(g).mod(), this.lineToTransformed(t, l, h), this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, h, v, l, r);
  }
  drawLineFromInfinityFromPointToInfinityFromPoint(t, e, n, i, r) {
    const o = this.getTransformedViewbox(e), a = R(o, n, r), l = e.userTransformation, h = R(o, i, r);
    this.lineToTransformed(t, h, l);
    const d = h.minus(a).mod();
    this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, l, d, h, r);
  }
  drawLineFromInfinityFromPointToPoint(t, e, n, i) {
    const r = R(this.getTransformedViewbox(e), n, i), o = n.minus(r).mod(), a = e.userTransformation;
    this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, a, o, r, i), this.lineToTransformed(t, n, a);
  }
  drawLineToInfinityFromPointInDirection(t, e, n, i) {
    const r = R(this.getTransformedViewbox(e), n, i), o = e.userTransformation;
    this.lineToTransformed(t, r, o);
    const a = r.minus(n).mod();
    this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, o, a, r, i);
  }
  ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, e, n, i, r) {
    const o = this.drawnPathProperties.lineDashPeriod;
    if (o === 0)
      return;
    const a = this.getDistanceLeft(n, o);
    if (a === 0)
      return;
    const l = i.plus(r.scale(a / (2 * r.mod())));
    this.lineToTransformed(t, l, e), this.lineToTransformed(t, i, e);
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
    return new ji(t, this.drawnPathProperties);
  }
}
class Qi {
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
class yt extends Le {
  constructor(t) {
    super(t), this._initiallyWithState = t, this.areaBuilder = new zi();
  }
  get area() {
    return this.areaBuilder.area;
  }
  surroundsFinitePoint() {
    for (const t of this.added)
      if (t.surroundsFinitePoint())
        return !0;
    return !1;
  }
  currentSubpathIsClosable() {
    return this.added.length === 0 ? !0 : this.added[this.added.length - 1].isClosable();
  }
  allSubpathsAreClosable() {
    if (this.added.length === 0)
      return !0;
    for (const t of this.added)
      if (!t.isClosable())
        return !1;
    return !0;
  }
  drawPath(t, e, n) {
    if (this.added.length === 0)
      return;
    const i = K.create(e, t), r = this.makeExecutable(n);
    return i.setInitialState(r.state), r.add(i), r;
  }
  makeExecutable(t) {
    const e = new Ee(this._initiallyWithState.makeExecutable()), n = new Fe(t);
    for (const i of this.added)
      e.add(i.makeExecutable(n));
    return e;
  }
  getInstructionsToClip() {
    const t = this.makeExecutable({ lineWidth: 0, lineDashPeriod: 0, shadowOffsets: [] });
    return t.setInitialState(t.stateOfFirstInstruction), new Qi(t, this.area);
  }
  clipPath(t, e) {
    if (this.added.length === 0)
      return;
    const n = this.added[this.added.length - 1], i = gt.create(e, t);
    n.addInstruction(i);
    const r = this.getInstructionsToClip();
    this.addClippedPath(r);
  }
  closePath() {
    if (this.added.length === 0)
      return;
    this.added[this.added.length - 1].closePath();
  }
  moveTo(t, e) {
    const n = J(t, e.current.transformation);
    this.areaBuilder.addPosition(n);
    const i = Re.create(e, t);
    i.setInitialState(this.state), this.add(i);
  }
  canAddLineTo(t, e) {
    if (this.added.length === 0)
      return !0;
    const n = J(t, e.current.transformation);
    return this.added[this.added.length - 1].canAddLineTo(n);
  }
  lineTo(t, e) {
    if (this.added.length === 0) {
      this.moveTo(t, e);
      return;
    }
    const n = this.added[this.added.length - 1], i = J(t, e.current.transformation);
    this.areaBuilder.addPosition(i), n.lineTo(t, e);
  }
  addPathInstruction(t, e) {
    if (this.added.length === 0)
      if (t.initialPoint)
        this.moveTo(t.initialPoint, e);
      else
        return;
    const n = this.added[this.added.length - 1], i = n.currentPosition, r = J(i, e.current.transformation.inverse());
    t.changeArea(this.areaBuilder.transformedWith(e.current.transformation), r);
    const o = gt.create(e, t.instruction);
    n.addPathInstruction(t, o, e);
  }
  static create(t) {
    return new yt(gt.create(t, (e) => {
      e.beginPath();
    }));
  }
}
class E {
  constructor(t, ...e) {
    this.topLeftCorner = t, this.corners = e;
  }
  addSubpaths(t, e) {
    this.topLeftCorner.moveToEndingPoint(t, e);
    for (const n of this.corners)
      n.draw(t, e);
    this.topLeftCorner.finishRect(t, e);
  }
  stroke(t, e) {
    return V.forStrokingPath(e, t, (n) => {
      const i = yt.create(n);
      return this.addSubpaths(i, n), i;
    });
  }
  fill(t, e) {
    return V.forFillingPath(e, t, (n) => {
      const i = yt.create(n);
      return this.addSubpaths(i, n), i;
    });
  }
}
class Ji extends E {
  constructor(t, e, ...n) {
    super(e, ...n), this.horizontal = t;
  }
  getRoundRect() {
    return this;
  }
  getArea() {
    return new m(this.horizontal.getHalfPlanesWithHorizontalCrossSection());
  }
}
class Zi extends E {
  constructor(t, e, ...n) {
    super(e, ...n), this.vertical = t;
  }
  getRoundRect() {
    return this;
  }
  getArea() {
    return new m(this.vertical.getHalfPlanesWithVerticalCrossSection());
  }
}
class _i extends E {
  constructor(t, e, n, i, r) {
    super(n, i, r), this.horizontal = t, this.vertical = e, this.topLeft = n, this.right = i, this.bottom = r;
  }
  getRoundRect(t) {
    const e = this.topLeft.round(t.upperLeft);
    return new E(
      e,
      this.right,
      this.bottom
    );
  }
  getArea() {
    return new m([
      ...this.vertical.getHalfPlanesWithVerticalCrossSection(),
      ...this.horizontal.getHalfPlanesWithHorizontalCrossSection()
    ]);
  }
}
class ts extends E {
  constructor(t, e, ...n) {
    super(e, ...n), this.horizontal = t;
  }
  getRoundRect() {
    return this;
  }
  getArea() {
    return new m(this.horizontal.getHalfPlanesWithHorizontalCrossSection());
  }
}
function es(s) {
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
function Et(s, t) {
  const { x: e, y: n, circular: i } = s;
  return { x: e * t, y: n * t, circular: i };
}
function We(s, t) {
  const { upperLeft: e, upperRight: n, lowerLeft: i, lowerRight: r } = s;
  return {
    upperLeft: Et(e, t),
    upperRight: Et(n, t),
    lowerLeft: Et(i, t),
    lowerRight: Et(r, t)
  };
}
function ns(s) {
  if (typeof s == "number" || es(s)) {
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
class is extends E {
  constructor(t, e, n, i, r) {
    super(n, i, r), this.horizontal = t, this.vertical = e, this.topLeft = n, this.topRightCorner = i, this.bottom = r;
  }
  getRoundRect(t) {
    const e = this.horizontal.getLength(), n = t.upperLeft.x + t.upperRight.x, i = e / n;
    i < 1 && (t = We(t, i));
    const r = this.topRightCorner.round(t.upperRight), o = this.topLeft.round(t.upperLeft);
    return new E(
      o,
      r,
      this.bottom
    );
  }
  getArea() {
    return new m([
      ...this.vertical.getHalfPlanesWithVerticalCrossSection(),
      ...this.horizontal.getHalfPlanesWithHorizontalCrossSection()
    ]);
  }
}
class ss extends E {
  constructor(t, e, ...n) {
    super(e, ...n), this.vertical = t;
  }
  getRoundRect() {
    return this;
  }
  getArea() {
    return new m(this.vertical.getHalfPlanesWithVerticalCrossSection());
  }
}
class rs extends E {
  constructor(t, e, n, i, r) {
    super(n, i, r), this.vertical = t, this.horizontal = e, this.topLeft = n, this.right = i, this.bottomLeftCorner = r;
  }
  getRoundRect(t) {
    const e = this.vertical.getLength(), n = t.upperLeft.y + t.lowerLeft.y, i = e / n;
    i < 1 && (t = We(t, i));
    const r = this.topLeft.round(t.upperLeft), o = this.bottomLeftCorner.round(t.lowerLeft);
    return new E(
      r,
      this.right,
      o
    );
  }
  getArea() {
    return new m([
      ...this.vertical.getHalfPlanesWithVerticalCrossSection(),
      ...this.horizontal.getHalfPlanesWithHorizontalCrossSection()
    ]);
  }
}
class os extends E {
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
    const r = this.bottomRight.round(t.lowerRight), o = this.topLeft.round(t.upperLeft), a = this.topRight.round(t.upperRight), l = this.bottomLeft.round(t.lowerLeft);
    return new E(
      o,
      a,
      r,
      l
    );
  }
  getArea() {
    return new m([
      ...this.horizontal.getHalfPlanesWithHorizontalCrossSection(),
      ...this.vertical.getHalfPlanesWithVerticalCrossSection()
    ]);
  }
}
class Jt {
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
class as {
  constructor() {
    this.area = mt;
  }
  drawPath(t, e, n) {
    const r = new Fe(n).getInfinity(e);
    return K.create(e, (o, a) => {
      o.beginPath(), r.addPathAroundViewbox(o, a), t(o, a);
    });
  }
}
const cs = new as();
function Rn(s, t) {
  throw new Error(`The starting coordinates provided (${s.start} and ${t.start}) do not determine a direction.`);
}
class hs {
  constructor(t, e) {
    this.horizontal = t, this.vertical = e;
  }
  addSubpaths() {
    Rn(this.horizontal, this.vertical);
  }
  getRoundRect() {
    return this;
  }
  getArea() {
    return mt;
  }
  stroke() {
  }
  fill(t, e) {
    return V.forFillingPath(e, t, () => cs);
  }
}
class Te {
  constructor(t, e) {
    this.horizontal = t, this.vertical = e;
  }
  addSubpaths() {
    Rn(this.horizontal, this.vertical);
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
class it {
  static arc(t, e, n, i, r, o) {
    return {
      instruction: (h, d) => {
        const u = d.userTransformation, { x: g, y: v } = u.apply(new c(t, e)), { a: P, b: T, c: B, d: H, e: q, f: tt } = u.untranslated().before(p.translation(g, v));
        h.save(), h.transform(P, T, B, H, q, tt), h.arc(0, 0, n, i, r, o), h.restore();
      },
      changeArea: (h) => {
        h.addPosition(new c(t - n, e - n)), h.addPosition(new c(t - n, e + n)), h.addPosition(new c(t + n, e - n)), h.addPosition(new c(t + n, e + n));
      },
      positionChange: new c(t, e).plus(p.rotation(0, 0, r).apply(new c(n, 0))),
      initialPoint: new c(t, e).plus(p.rotation(0, 0, i).apply(new c(n, 0)))
    };
  }
  static arcTo(t, e, n, i, r) {
    const o = new c(t, e), a = new c(n, i);
    return {
      instruction: (d, u) => {
        const g = u.userTransformation, v = g.apply(o), P = g.apply(a);
        d.arcTo(v.x, v.y, P.x, P.y, r * g.scale);
      },
      changeArea: (d) => {
        d.addPosition(o), d.addPosition(a);
      },
      positionChange: new c(n, i)
    };
  }
  static ellipse(t, e, n, i, r, o, a, l) {
    return {
      instruction: (h, d) => {
        const u = d.userTransformation, g = u.apply(new c(t, e)), v = u.getRotationAngle();
        h.ellipse(g.x, g.y, n * u.scale, i * u.scale, r + v, o, a, l);
      },
      changeArea: (h) => {
        h.addPosition(new c(t - n, e - i)), h.addPosition(new c(t - n, e + i)), h.addPosition(new c(t + n, e - i)), h.addPosition(new c(t + n, e + i));
      },
      positionChange: new c(t, e).plus(
        p.rotation(0, 0, a).before(
          new p(n, 0, 0, i, 0, 0)
        ).before(
          p.rotation(0, 0, r)
        ).apply(new c(1, 0))
      ),
      initialPoint: new c(t, e).plus(
        p.rotation(0, 0, o).before(
          new p(n, 0, 0, i, 0, 0)
        ).before(
          p.rotation(0, 0, r)
        ).apply(new c(1, 0))
      )
    };
  }
  static bezierCurveTo(t, e, n, i, r, o) {
    return {
      instruction: (a, l) => {
        const h = l.userTransformation, d = h.apply(new c(t, e)), u = h.apply(new c(n, i)), g = h.apply(new c(r, o));
        a.bezierCurveTo(d.x, d.y, u.x, u.y, g.x, g.y);
      },
      changeArea: (a, l) => {
        C(l) || (a.addPosition(new c((l.x + t) / 2, (l.y + e) / 2)), a.addPosition(new c((t + n) / 2, (e + i) / 2)), a.addPosition(new c((n + r) / 2, (i + o) / 2)), a.addPosition(new c(r, o)));
      },
      positionChange: new c(r, o)
    };
  }
  static quadraticCurveTo(t, e, n, i) {
    return {
      instruction: (r, o) => {
        const a = o.userTransformation, l = a.apply(new c(t, e)), h = a.apply(new c(n, i));
        r.quadraticCurveTo(l.x, l.y, h.x, h.y);
      },
      changeArea: (r, o) => {
        C(o) || (r.addPosition(new c((o.x + t) / 2, (o.y + e) / 2)), r.addPosition(new c((t + n) / 2, (e + i) / 2)), r.addPosition(new c(n, i)));
      },
      positionChange: new c(n, i)
    };
  }
}
var $ = /* @__PURE__ */ ((s) => (s[s.TOPLEFT = 0] = "TOPLEFT", s[s.TOPRIGHT = 1] = "TOPRIGHT", s[s.BOTTOMLEFT = 2] = "BOTTOMLEFT", s[s.BOTTOMRIGHT = 3] = "BOTTOMRIGHT", s))($ || {});
function ls(s) {
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
function us(s) {
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
class Fn {
  constructor(t, e, n, i, r) {
    this.corner = e, n = fs(n, i, r);
    const o = r === i;
    let { center: a, start: l, end: h } = gs(n, e, t);
    o || ({ start: l, end: h } = { start: h, end: l }), this.radii = t, this.clockwise = o, this.center = a, this.start = l, this.end = h;
  }
  draw(t, e) {
    t.lineTo(this.start.point, e), this.radii.circular ? t.addPathInstruction(it.arc(
      this.center.x,
      this.center.y,
      this.radii.x,
      this.start.angle,
      this.end.angle,
      !this.clockwise
    ), e) : t.addPathInstruction(it.ellipse(
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
class ds extends Fn {
  moveToEndingPoint(t, e) {
    t.moveTo(this.end.point, e);
  }
  finishRect(t, e) {
    this.draw(t, e), t.moveTo(this.corner, e);
  }
}
function fs(s, t, e) {
  return t === I.Negative && (s = us(s)), e === I.Negative && (s = ls(s)), s;
}
function gs(s, t, e) {
  switch (s) {
    case $.TOPLEFT:
      return {
        center: new c(t.x + e.x, t.y + e.y),
        start: {
          angle: Math.PI,
          point: new c(t.x, t.y + e.y)
        },
        end: {
          angle: 3 * Math.PI / 2,
          point: new c(t.x + e.x, t.y)
        }
      };
    case $.TOPRIGHT:
      return {
        center: new c(t.x - e.x, t.y + e.y),
        start: {
          angle: 3 * Math.PI / 2,
          point: new c(t.x - e.x, t.y)
        },
        end: {
          angle: 0,
          point: new c(t.x, t.y + e.y)
        }
      };
    case $.BOTTOMRIGHT:
      return {
        center: new c(t.x - e.x, t.y - e.y),
        start: {
          angle: 0,
          point: new c(t.x, t.y - e.y)
        },
        end: {
          angle: Math.PI / 2,
          point: new c(t.x - e.x, t.y)
        }
      };
    case $.BOTTOMLEFT:
      return {
        center: new c(t.x + e.x, t.y - e.y),
        start: {
          angle: Math.PI / 2,
          point: new c(t.x + e.x, t.y)
        },
        end: {
          angle: Math.PI,
          point: new c(t.x, t.y - e.y)
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
    return t.x === 0 || t.y === 0 ? this : new Fn(
      t,
      this.corner,
      this.cornerOrientation,
      this.horizontalOrientation,
      this.verticalOrientation
    );
  }
}
class ms {
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
    return t.x === 0 || t.y === 0 ? this : new ds(
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
class ps {
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
class vs {
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
    this.start = t, this.orientation = e, this.horizontalLineStart = e === I.Positive ? Ut : Kt, this.horizontalLineEnd = e === I.Positive ? Kt : Ut, this.verticalLineStart = e === I.Positive ? $t : Xt, this.verticalLineEnd = e === I.Positive ? Xt : $t;
  }
  createTopLeftAtVerticalInfinity(t) {
    return new ps(new c(t.finiteStart, 0), this.verticalLineStart);
  }
  createBottomRightAtInfinity(t) {
    return new ke(new c(t.end, 0), this.verticalLineEnd);
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
    return new hs(t, this);
  }
  addHorizontalDimensionAtInfinity(t) {
    return new Te(t, this);
  }
  addHorizontalDimensionWithStart(t) {
    const e = this.createTopLeftAtVerticalInfinity(t), n = this.createRightAtInfinity(t), i = this.createBottomAtInfinity();
    return new Ji(t, e, n, i);
  }
  addHorizontalDimensionWithStartAndEnd(t) {
    const e = this.createTopLeftAtVerticalInfinity(t), n = this.createBottomRightAtInfinity(t);
    return new ts(t, e, n);
  }
}
class Rt extends He {
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
    return new Jt(this.verticalLineEnd);
  }
  addHorizontalDimensionWithStartAndEnd() {
    return new Jt(this.verticalLineEnd);
  }
}
class Wn extends He {
  constructor(t, e) {
    super(e, t), this.finiteStart = e;
  }
  createBottomLeftAtInfinity(t) {
    return new ye(t.horizontalLineStart);
  }
  createLeftAtInfinity(t) {
    return new vs(t.horizontalLineStart);
  }
  createTopRightAtHorizontalInfinity(t) {
    return new ke(new c(0, this.finiteStart), t.horizontalLineEnd);
  }
  createTopLeft(t) {
    return new ms(
      new c(t.finiteStart, this.finiteStart),
      $.TOPLEFT,
      t.orientation,
      this.orientation
    );
  }
  createTopRight(t) {
    return new Se(
      new c(t.end, this.finiteStart),
      $.TOPRIGHT,
      t.orientation,
      this.orientation
    );
  }
  getStartingHalfPlaneWithHorizontalCrossSection() {
    const t = this.orientation === I.Positive ? new c(1, 0) : new c(-1, 0), e = new c(this.finiteStart, 0);
    return new w(e, t);
  }
  getStartingHalfPlaneWithVerticalCrossSection() {
    const t = this.orientation === I.Positive ? new c(0, 1) : new c(0, -1), e = new c(0, this.finiteStart);
    return new w(e, t);
  }
  addVerticalDimension(t) {
    return t.addHorizontalDimensionWithStart(this);
  }
  addEntireHorizontalDimension(t) {
    const e = this.createLeftAtInfinity(t), n = this.createTopRightAtHorizontalInfinity(t), i = this.createBottomAtInfinity(), r = this.createBottomLeftAtInfinity(t);
    return new Zi(this, e, n, i, r);
  }
  addHorizontalDimensionAtInfinity(t) {
    return new Jt(t.horizontalLineEnd);
  }
  addHorizontalDimensionWithStart(t) {
    const e = this.createRightAtInfinity(t), n = this.createBottomAtInfinity(), i = this.createTopLeft(t);
    return new _i(t, this, i, e, n);
  }
  addHorizontalDimensionWithStartAndEnd(t) {
    const e = this.createBottomAtInfinity(), n = this.createTopLeft(t), i = this.createTopRight(t);
    return new is(t, this, n, i, e);
  }
  getHalfPlanesWithHorizontalCrossSection() {
    return [this.getStartingHalfPlaneWithHorizontalCrossSection()];
  }
  getHalfPlanesWithVerticalCrossSection() {
    return [this.getStartingHalfPlaneWithVerticalCrossSection()];
  }
}
class kn extends Wn {
  constructor(t, e, n) {
    super(t, e), this.end = n;
  }
  createBottomLeftAtHorizontalInfinity(t) {
    return new ke(new c(0, this.end), t.horizontalLineStart);
  }
  getEndingHalfPlaneWithHorizontalCrossSection() {
    const t = this.orientation === I.Positive ? new c(-1, 0) : new c(1, 0), e = new c(this.end, 0);
    return new w(e, t);
  }
  getEndingHalfPlaneWithVerticalCrossSection() {
    const t = this.orientation === I.Positive ? new c(0, -1) : new c(0, 1), e = new c(0, this.end);
    return new w(e, t);
  }
  createBottomLeft(t) {
    return new Se(
      new c(t.finiteStart, this.end),
      $.BOTTOMLEFT,
      t.orientation,
      this.orientation
    );
  }
  createBottomRight(t) {
    return new Se(
      new c(t.end, this.end),
      $.BOTTOMRIGHT,
      t.orientation,
      this.orientation
    );
  }
  getLength() {
    return Math.abs(this.end - this.finiteStart);
  }
  addEntireHorizontalDimension(t) {
    const e = this.createLeftAtInfinity(t), n = this.createTopRightAtHorizontalInfinity(t), i = this.createBottomLeftAtHorizontalInfinity(t);
    return new ss(this, e, n, i);
  }
  addHorizontalDimensionAtInfinity(t) {
    return new Jt(t.horizontalLineEnd);
  }
  addVerticalDimension(t) {
    return t.addHorizontalDimensionWithStartAndEnd(this);
  }
  addHorizontalDimensionWithStart(t) {
    const e = this.createRightAtInfinity(t), n = this.createTopLeft(t), i = this.createBottomLeft(t);
    return new rs(this, t, n, e, i);
  }
  addHorizontalDimensionWithStartAndEnd(t) {
    const e = this.createTopLeft(t), n = this.createTopRight(t), i = this.createBottomLeft(t), r = this.createBottomRight(t);
    return new os(
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
function rn(s, t) {
  const e = t > 0 ? I.Positive : I.Negative;
  return new kn(e, s, s + t);
}
function on(s, t) {
  const e = t > 0 ? I.Positive : I.Negative, n = new He(s, e);
  return Number.isFinite(s) ? Number.isFinite(t) ? new kn(e, s, s + t) : new Wn(e, s) : Number.isFinite(t) ? s < 0 ? new Rt(s, I.Negative) : new Rt(s, I.Positive) : s > 0 ? e === I.Positive ? new Rt(s, I.Positive) : n : e === I.Positive ? n : new Rt(s, I.Negative);
}
function Z(s, t, e, n) {
  const i = on(s, e), r = on(t, n);
  return i.addVerticalDimension(r);
}
function an(s, t, e, n) {
  const i = rn(s, e);
  return rn(t, n).addHorizontalDimensionWithStartAndEnd(i);
}
class ws {
  constructor(t) {
    this.viewBox = t;
  }
  fillText(t, e, n, i) {
    let r = i === void 0 ? (o) => {
      o.fillText(t, e, n);
    } : (o) => {
      o.fillText(t, e, n, i);
    };
    this.viewBox.addDrawing(r, this.getDrawnRectangle(e, n, t), N.Relative, !0);
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
    this.viewBox.addDrawing(r, this.getDrawnRectangle(e, n, t), N.Relative, !0);
  }
  getDrawnRectangle(t, e, n) {
    const i = this.viewBox.measureText(n);
    let r;
    i.actualBoundingBoxRight !== void 0 ? r = Math.abs(i.actualBoundingBoxRight - i.actualBoundingBoxLeft) : r = i.width;
    const o = i.actualBoundingBoxAscent !== void 0 ? i.actualBoundingBoxAscent + i.actualBoundingBoxDescent : 1, a = i.actualBoundingBoxAscent !== void 0 ? i.actualBoundingBoxAscent : 0;
    return Z(t, e - a, r, o).getArea();
  }
}
function Ps(s) {
  return typeof s.duration < "u";
}
function Cs(s) {
  return Ps(s) ? {
    width: s.displayWidth,
    height: s.displayHeight
  } : {
    width: s.width,
    height: s.height
  };
}
class Is {
  constructor(t) {
    this.viewBox = t;
  }
  drawImage() {
    const t = Array.prototype.slice.apply(arguments);
    let e, n, i, r, o, a, l, h, d;
    arguments.length <= 5 ? [e, a, l, h, d] = t : [e, n, i, r, o, a, l, h, d] = t;
    const { width: u, height: g } = Cs(e), v = this.getDrawnLength(u, n, r, h), P = this.getDrawnLength(g, i, o, d), T = Z(a, l, v, P).getArea(), B = this.getDrawImageInstruction(arguments.length, e, n, i, r, o, a, l, h, d);
    this.viewBox.addDrawing(B, T, N.Relative, !0);
  }
  getDrawImageInstruction(t, e, n, i, r, o, a, l, h, d) {
    switch (t) {
      case 3:
        return (u) => {
          u.drawImage(e, a, l);
        };
      case 5:
        return (u) => {
          u.drawImage(e, a, l, h, d);
        };
      case 9:
        return (u) => {
          u.drawImage(e, n, i, r, o, a, l, h, d);
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
function Ts(s, t, e, n, i) {
  t = t === void 0 ? 0 : t, e = e === void 0 ? 0 : e, n = n === void 0 ? s.width : n, i = i === void 0 ? s.height : i;
  const r = s.data, o = new Uint8ClampedArray(4 * n * i);
  for (let a = 0; a < i; a++)
    for (let l = 0; l < n; l++) {
      const h = 4 * ((e + a) * s.width + t + l), d = 4 * (a * n + l);
      o[d] = r[h], o[d + 1] = r[h + 1], o[d + 2] = r[h + 2], o[d + 3] = r[h + 3];
    }
  return new ImageData(o, n, i);
}
class Zt {
  constructor(t, e, n) {
    this.area = t, this.latestClippedPath = e, this.previouslyClippedPaths = n;
  }
  withClippedPath(t) {
    const e = t.area.intersectWith(this.area);
    return new Zt(e, t, this);
  }
  get initialState() {
    return this.previouslyClippedPaths ? this.previouslyClippedPaths.initialState : this.latestClippedPath.initialState;
  }
  except(t) {
    if (t !== this)
      return this.previouslyClippedPaths ? new Zt(this.area, this.latestClippedPath, this.previouslyClippedPaths.except(t)) : this;
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
class Ss extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.direction = t;
    };
  }
}
const Ve = new Ss("direction", y);
class ys extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.font = t;
    };
  }
}
const Me = new ys("font", y);
class Hn {
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
class Vn extends Hn {
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
const Mn = new Vn("lineWidth"), Nn = new Vn("lineDashOffset");
class xs extends Hn {
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
const qn = new xs("lineDash");
class bs extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.textAlign = t;
    };
  }
}
const Ne = new bs("textAlign", y);
class Os extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.textBaseline = t;
    };
  }
}
const qe = new Os("textBaseline", y);
class Ls extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.lineCap = t;
  }
}
const zn = new Ls("lineCap", y);
class Bs extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.lineJoin = t;
  }
}
const Gn = new Bs("lineJoin", y);
class As extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.miterLimit = t;
  }
}
const Yn = new As("miterLimit", y), pe = [
  Ve,
  Pn,
  Cn,
  Sn,
  Nn,
  qn,
  zn,
  Gn,
  Yn,
  vn,
  wn,
  En,
  Mn,
  yn,
  Ne,
  qe,
  qt,
  Me,
  Ce,
  bn,
  xn
], Ds = [
  Me,
  Ne,
  qe,
  Ve
], ft = class ft {
  constructor(t) {
    this.fillStyle = t.fillStyle, this.fontKerning = t.fontKerning, this.lineWidth = t.lineWidth, this.lineCap = t.lineCap, this.lineJoin = t.lineJoin, this.lineDash = t.lineDash, this.miterLimit = t.miterLimit, this.globalAlpha = t.globalAlpha, this.globalCompositeOperation = t.globalCompositeOperation, this.filter = t.filter, this.strokeStyle = t.strokeStyle, this.lineDashOffset = t.lineDashOffset, this.transformation = t.transformation, this.direction = t.direction, this.imageSmoothingEnabled = t.imageSmoothingEnabled, this.imageSmoothingQuality = t.imageSmoothingQuality, this.font = t.font, this.textAlign = t.textAlign, this.textBaseline = t.textBaseline, this.clippedPaths = t.clippedPaths, this.fillAndStrokeStylesTransformed = t.fillAndStrokeStylesTransformed, this.shadowOffset = t.shadowOffset, this.shadowColor = t.shadowColor, this.shadowBlur = t.shadowBlur;
  }
  changeProperty(t, e) {
    const {
      fillStyle: n,
      fontKerning: i,
      lineWidth: r,
      lineDash: o,
      lineCap: a,
      lineJoin: l,
      miterLimit: h,
      globalAlpha: d,
      globalCompositeOperation: u,
      filter: g,
      strokeStyle: v,
      lineDashOffset: P,
      transformation: T,
      direction: B,
      imageSmoothingEnabled: H,
      imageSmoothingQuality: q,
      font: tt,
      textAlign: wt,
      textBaseline: Pt,
      clippedPaths: Ct,
      fillAndStrokeStylesTransformed: ue,
      shadowOffset: de,
      shadowColor: fe,
      shadowBlur: ge
    } = this, It = {
      fillStyle: n,
      fontKerning: i,
      lineWidth: r,
      lineDash: o,
      lineCap: a,
      lineJoin: l,
      miterLimit: h,
      globalAlpha: d,
      globalCompositeOperation: u,
      filter: g,
      strokeStyle: v,
      lineDashOffset: P,
      transformation: T,
      direction: B,
      imageSmoothingEnabled: H,
      imageSmoothingQuality: q,
      font: tt,
      textAlign: wt,
      textBaseline: Pt,
      clippedPaths: Ct,
      fillAndStrokeStylesTransformed: ue,
      shadowOffset: de,
      shadowColor: fe,
      shadowBlur: ge
    };
    return It[t] = e, new ft(It);
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
    return e !== null && t.push(e), this.shadowOffset.equals(c.origin) || t.push(this.shadowOffset), t;
  }
  getInstructionToConvertToState(t) {
    return this.getInstructionToConvertToStateOnDimensions(t, pe);
  }
  withClippedPath(t) {
    const e = this.clippedPaths ? this.clippedPaths.withClippedPath(t) : new Zt(t.area, t);
    return this.changeProperty("clippedPaths", e);
  }
  getInstructionToConvertToStateOnDimensions(t, e) {
    const n = e.map((i) => i.getInstructionToChange(this, t));
    return U(...n);
  }
};
ft.default = new ft({
  fillStyle: "#000",
  fontKerning: "auto",
  lineWidth: 1,
  lineDash: [],
  lineCap: "butt",
  lineJoin: "miter",
  miterLimit: 10,
  globalAlpha: 1,
  globalCompositeOperation: "source-over",
  filter: Yt.none,
  strokeStyle: "#000",
  lineDashOffset: 0,
  transformation: p.identity,
  direction: "inherit",
  imageSmoothingEnabled: !0,
  imageSmoothingQuality: "low",
  font: "10px sans-serif",
  textAlign: "start",
  textBaseline: "alphabetic",
  clippedPaths: void 0,
  fillAndStrokeStylesTransformed: !1,
  shadowOffset: c.origin,
  shadowColor: "rgba(0, 0, 0, 0)",
  shadowBlur: 0
}), ft.setDefault = () => {
};
let k = ft;
class Es {
  constructor(t) {
    this.viewBox = t;
  }
  createImageData(t, e) {
  }
  getImageData(t, e, n, i) {
  }
  putImageData(t, e, n, i, r, o, a) {
    t = Ts(t, i, r, o, a);
    let l, h = this.viewBox.getDrawingLock();
    this.viewBox.createPatternFromImageData(t).then((u) => {
      l = u, h.release();
    }), this.viewBox.addDrawing((u) => {
      u.translate(e, n), u.fillStyle = l, u.fillRect(0, 0, t.width, t.height);
    }, Z(e, n, t.width, t.height).getArea(), N.Absolute, !1, (u) => u.changeProperty("shadowColor", k.default.shadowColor).changeProperty("shadowOffset", k.default.shadowOffset).changeProperty("shadowBlur", k.default.shadowBlur).changeProperty("globalAlpha", k.default.globalAlpha).changeProperty("globalCompositeOperation", k.default.globalCompositeOperation).changeProperty("imageSmoothingEnabled", !1).changeProperty("filter", k.default.filter));
  }
}
class Rs {
  constructor(t) {
    this.viewBox = t;
  }
  get lineCap() {
    return this.viewBox.state.current.lineCap;
  }
  set lineCap(t) {
    this.viewBox.changeState((e) => zn.changeInstanceValue(e, t));
  }
  get lineDashOffset() {
    return this.viewBox.state.current.lineDashOffset;
  }
  set lineDashOffset(t) {
    this.viewBox.changeState((e) => Nn.changeInstanceValue(e, t));
  }
  get lineJoin() {
    return this.viewBox.state.current.lineJoin;
  }
  set lineJoin(t) {
    this.viewBox.changeState((e) => Gn.changeInstanceValue(e, t));
  }
  get lineWidth() {
    return this.viewBox.state.current.lineWidth;
  }
  set lineWidth(t) {
    this.viewBox.changeState((e) => Mn.changeInstanceValue(e, t));
  }
  get miterLimit() {
    return this.viewBox.state.current.miterLimit;
  }
  set miterLimit(t) {
    this.viewBox.changeState((e) => Yn.changeInstanceValue(e, t));
  }
  getLineDash() {
    return this.viewBox.state.current.lineDash;
  }
  setLineDash(t) {
    t.length % 2 === 1 && (t = t.concat(t)), this.viewBox.changeState((e) => qn.changeInstanceValue(e, t));
  }
}
class Fs extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.fontKerning = t;
  }
}
const Ws = new Fs("fontKerning", y);
class ks {
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
    this.viewBox.changeState((e) => qe.changeInstanceValue(e, t));
  }
  set fontKerning(t) {
    this.viewBox.changeState((e) => Ws.changeInstanceValue(e, t));
  }
}
class Hs {
  constructor(t) {
    this.viewBox = t;
  }
  arc(t, e, n, i, r, o) {
    this.viewBox.addPathInstruction(it.arc(t, e, n, i, r, o));
  }
  arcTo(t, e, n, i, r) {
    this.viewBox.addPathInstruction(it.arcTo(t, e, n, i, r));
  }
  closePath() {
    this.viewBox.closePath();
  }
  ellipse(t, e, n, i, r, o, a, l) {
    this.viewBox.addPathInstruction(it.ellipse(t, e, n, i, r, o, a, l));
  }
  lineTo(t, e) {
    this.viewBox.lineTo(new c(t, e));
  }
  lineToInfinityInDirection(t, e) {
    this.viewBox.lineTo({ direction: new c(t, e) });
  }
  moveTo(t, e) {
    this.viewBox.moveTo(new c(t, e));
  }
  moveToInfinityInDirection(t, e) {
    this.viewBox.moveTo({ direction: new c(t, e) });
  }
  quadraticCurveTo(t, e, n, i) {
    this.viewBox.addPathInstruction(it.quadraticCurveTo(t, e, n, i));
  }
  bezierCurveTo(t, e, n, i, r, o) {
    this.viewBox.addPathInstruction(it.bezierCurveTo(t, e, n, i, r, o));
  }
  rect(t, e, n, i) {
    this.viewBox.rect(t, e, n, i);
  }
  roundRect(t, e, n, i, r) {
    this.viewBox.roundRect(t, e, n, i, r);
  }
}
class Vs {
  constructor(t, e, n) {
    this.canvas = t, this.canvasState = new ui(e), this.canvasTransform = new fi(e), this.canvasCompositing = new pi(e), this.canvasImageSmoothing = new Pi(e), this.canvasStrokeStyles = new Ci(e), this.canvasShadowStyles = new yi(e), this.canvasFilters = new bi(e, n), this.canvasRect = new Oi(e), this.canvasDrawPath = new Li(e), this.canvasUserInterface = new Bi(), this.canvasText = new ws(e), this.canvasDrawImage = new Is(e), this.canvasImageData = new Es(e), this.canvasPathDrawingStyles = new Rs(e), this.canvasTextDrawingStyles = new ks(e), this.canvasPath = new Hs(e);
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
  putImageData(t, e, n, i, r, o, a) {
    this.canvasImageData.putImageData(t, e, n, i, r, o, a);
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
  ellipse(t, e, n, i, r, o, a, l) {
    this.canvasPath.ellipse(t, e, n, i, r, o, a);
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
class ze extends Gt {
  constructor() {
    super(...arguments), this.colorStops = [];
  }
  addColorStopsToGradient(t) {
    for (const e of this.colorStops)
      t.addColorStop(e.offset, e.color);
  }
  addColorStop(t, e) {
    this.colorStops.push({ offset: t, color: e });
  }
  getInstructionToSetTransformed(t) {
    return (e, n) => {
      const i = n.userTransformation;
      e[t] = this.createTransformedGradient(i);
    };
  }
  getInstructionToSetUntransformed(t) {
    return (e) => {
      e[t] = this.createGradient();
    };
  }
}
class Ms extends ze {
  constructor(t, e, n, i, r) {
    super(), this.context = t, this.x0 = e, this.y0 = n, this.x1 = i, this.y1 = r;
  }
  createTransformedGradient(t) {
    const { x: e, y: n } = t.apply(new c(this.x0, this.y0)), { x: i, y: r } = t.apply(new c(this.x1, this.y1)), o = this.context.createLinearGradient(e, n, i, r);
    return this.addColorStopsToGradient(o), o;
  }
  createGradient() {
    const t = this.context.createLinearGradient(this.x0, this.y0, this.x1, this.y1);
    return this.addColorStopsToGradient(t), t;
  }
}
class Ns extends ze {
  constructor(t, e, n, i, r, o, a) {
    super(), this.context = t, this.x0 = e, this.y0 = n, this.r0 = i, this.x1 = r, this.y1 = o, this.r1 = a;
  }
  createTransformedGradient(t) {
    const { x: e, y: n } = t.apply(new c(this.x0, this.y0)), { x: i, y: r } = t.apply(new c(this.x1, this.y1)), o = this.r0 * t.scale, a = this.r1 * t.scale, l = this.context.createRadialGradient(e, n, o, i, r, a);
    return this.addColorStopsToGradient(l), l;
  }
  createGradient() {
    const t = this.context.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1);
    return this.addColorStopsToGradient(t), t;
  }
}
class Xn {
  constructor(t) {
    this.currentState = t, this.instructions = [];
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
class Ge extends Xn {
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
class Q {
  constructor(t, e = []) {
    this.current = t, this.stack = e;
  }
  replaceCurrent(t) {
    return new Q(t, this.stack);
  }
  withCurrentState(t) {
    return new Q(t, this.stack);
  }
  currentlyTransformed(t) {
    return this.withCurrentState(this.current.changeProperty("fillAndStrokeStylesTransformed", t));
  }
  withClippedPath(t) {
    return new Q(this.current.withClippedPath(t), this.stack);
  }
  saved() {
    return new Q(this.current, (this.stack || []).concat([this.current]));
  }
  restored() {
    if (!this.stack || this.stack.length === 0)
      return this;
    const t = this.stack[this.stack.length - 1];
    return new Q(t, this.stack.slice(0, this.stack.length - 1));
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
    const n = Q.findIndexOfHighestCommon(this.stack, e.stack);
    return this.convertToLastSavedInstance(t, n), e.convertFromLastSavedInstance(t, n), t.instruction;
  }
  getInstructionToConvertToState(t) {
    return this.getInstructionToConvertToStateUsingConversion(new Xn(this), t);
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
const cn = new Q(k.default, []);
class qs {
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
  constructor(t, e, n, i, r) {
    super(t, e, n, i), this.drawingArea = new qs(r);
  }
  static createClearRect(t, e, n, i, r, o, a) {
    return new Ye(t, t, (l, h) => {
      n.clearRect(l, h, i, r, o, a);
    }, () => {
    }, e);
  }
}
class _t extends Ee {
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
    const l = new Fe({ lineWidth: 0, lineDashPeriod: 0, shadowOffsets: [] }).getInfinity(e), h = Ye.createClearRect(e, t, l, n, i, r, o);
    h.setInitialState(this.state), this.add(h);
  }
  clearContentsInsideArea(t) {
    this.removeAll((e) => e.drawingArea.isContainedBy(t));
  }
  static create() {
    return new _t(new K(cn, cn, k.setDefault, () => {
    }));
  }
}
class zs {
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
class Gs {
  constructor(t, e) {
    this.instructions = t, this.drawingArea = new zs(e);
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
function Ys(s, t, e, n) {
  if (e === void 0) {
    t.addSubpaths(s, n);
    return;
  }
  let i = ns(e);
  if (!i)
    return;
  t.getRoundRect(i).addSubpaths(s, n);
}
class Xs {
  constructor(t) {
    this.onChange = t, this.previousInstructionsWithPath = _t.create(), this.state = this.previousInstructionsWithPath.state;
  }
  beginPath() {
    const t = yt.create(this.state);
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
    this.previousInstructionsWithPath = _t.create(), this.state = this.previousInstructionsWithPath.state, this.currentInstructionsWithPath = void 0, this.onChange();
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
    const e = V.forFillingPath(t, this.state, () => this.currentInstructionsWithPath);
    this.state = e.state, this.incorporateDrawingInstruction(e);
  }
  strokePath() {
    if (!this.currentInstructionsWithPath)
      return;
    const t = V.forStrokingPath((e) => {
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
    n === N.Relative && (e = e.transform(this.state.current.transformation));
    let a;
    r && (a = o.withCurrentState(r(o.current))), this.incorporateDrawingInstruction(new V(
      t,
      e,
      (l) => K.create(o, l),
      i,
      n,
      o,
      a
    ));
  }
  clipPath(t) {
    this.clipCurrentPath(t);
  }
  incorporateDrawingInstruction(t) {
    const e = t.getDrawnArea();
    if (e === L)
      return;
    const n = t.getModifiedInstruction();
    this.addToPreviousInstructions(n, e, t.build), this.currentInstructionsWithPath || (this.state = this.previousInstructionsWithPath.state), this.onChange();
  }
  addToPreviousInstructions(t, e, n) {
    const i = new Gs(n(t), e);
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
    this.currentInstructionsWithPath && Ys(this.currentInstructionsWithPath, t, e, this.state);
  }
  intersects(t) {
    return this.previousInstructionsWithPath.intersects(t);
  }
  clearContentsInsideArea(t) {
    this.previousInstructionsWithPath.clearContentsInsideArea(t), this.currentInstructionsWithPath && this.currentInstructionsWithPath.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
  }
  clearArea(t, e, n, i) {
    const o = Z(t, e, n, i).getArea();
    if (!o)
      return;
    const a = o.transform(this.state.current.transformation);
    this.intersects(a) && (this.clearContentsInsideArea(a), this.previousInstructionsWithPath.hasDrawingAcrossBorderOf(a) && (this.previousInstructionsWithPath.addClearRect(o, this.state, t, e, n, i), this.currentInstructionsWithPath && this.currentInstructionsWithPath.setInitialStateWithClippedPaths(this.state)), this.onChange());
  }
  execute(t, e) {
    this.previousInstructionsWithPath.length && this.previousInstructionsWithPath.execute(t, e);
    const i = this.previousInstructionsWithPath.state.stack.length;
    for (let r = 0; r < i; r++)
      t.restore();
  }
}
class $s extends ze {
  constructor(t, e, n, i) {
    super(), this.context = t, this.startAngle = e, this.x = n, this.y = i;
  }
  createTransformedGradient(t) {
    const { x: e, y: n } = t.apply(new c(this.x, this.y)), i = t.getRotationAngle(), r = this.context.createConicGradient(this.startAngle + i, e, n);
    return this.addColorStopsToGradient(r), r;
  }
  createGradient() {
    const t = this.context.createConicGradient(this.startAngle, this.x, this.y);
    return this.addColorStopsToGradient(t), t;
  }
}
class Us {
  constructor(t, e, n, i, r) {
    this.rectangleManager = t, this.context = e, this.drawingIterationProvider = n, this.drawLockProvider = i, this.isTransforming = r, this.instructionSet = new Xs(() => this.draw());
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
    this.context.save(), k.default.getInstructionToConvertToStateOnDimensions(this.state.currentlyTransformed(!1).current, Ds)(this.context);
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
    const r = Z(t, e, n, i);
    this.instructionSet.rect(r);
  }
  roundRect(t, e, n, i, r) {
    const o = Z(t, e, n, i);
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
    const o = Z(t, e, n, i);
    this.instructionSet.fillRect(o, r);
  }
  strokeRect(t, e, n, i) {
    const r = Z(t, e, n, i);
    this.instructionSet.strokeRect(r);
  }
  clipPath(t) {
    this.instructionSet.clipPath(t);
  }
  clearArea(t, e, n, i) {
    this.instructionSet.clearArea(t, e, n, i);
  }
  createLinearGradient(t, e, n, i) {
    return new Ms(this.context, t, e, n, i);
  }
  createRadialGradient(t, e, n, i, r, o) {
    return new Ns(this.context, t, e, n, i, r, o);
  }
  createConicGradient(t, e, n) {
    return new $s(this.context, t, e, n);
  }
  createPattern(t, e) {
    let n;
    return n = new In(this.context.createPattern(t, e)), n;
  }
  draw() {
    this.drawingIterationProvider.provideDrawingIteration(() => (this.isTransforming() || this.rectangleManager.measure(), this.rectangleManager.rectangle ? (this.context.restore(), this.context.save(), this.context.clearRect(0, 0, this.width, this.height), this.setInitialTransformation(), this.instructionSet.execute(this.context, this.rectangleManager.rectangle), !0) : !1));
  }
  setInitialTransformation() {
    const t = this.rectangleManager.rectangle.initialBitmapTransformation;
    if (t.equals(p.identity))
      return;
    const { a: e, b: n, c: i, d: r, e: o, f: a } = t;
    this.context.setTransform(e, n, i, r, o, a);
  }
}
class Ks {
  constructor(t, e) {
    this.context = e, this.initialTransformation = e.transformation, this.angularVelocity = Math.PI / 100, this.point = t.onMoved(() => {
      this.setTransformation();
    }, !1);
  }
  setTransformation() {
    this.context.transformation = this.initialTransformation.before(p.rotation(
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
class js {
  constructor(t, e, n, i, r) {
    this.transformable = t, this.centerX = e, this.centerY = n, this.onFinish = r, this.initialTransformation = t.transformation, this.maxScaleLogStep = 0.1, this.currentScaleLog = 0, this.targetScaleLog = Math.log(i), this.makeStep();
  }
  makeStep() {
    const t = this.targetScaleLog - this.currentScaleLog;
    Math.abs(t) <= this.maxScaleLogStep ? (this.currentScaleLog += t, this.setTransformToCurrentScaleLog(), this.onFinish()) : (this.currentScaleLog += t < 0 ? -this.maxScaleLogStep : this.maxScaleLogStep, this.setTransformToCurrentScaleLog(), this.stepTimeout = setTimeout(() => this.makeStep(), 20));
  }
  setTransformToCurrentScaleLog() {
    this.transformable.transformation = this.initialTransformation.before(
      p.zoom(
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
class Qs {
  constructor(t, e) {
    this.anchor = t, this.context = e, this.initialTransformation = e.transformation, this.point = t.onMoved(() => {
      this.setTransformation();
    }, !0);
  }
  setTransformation() {
    this.context.transformation = this.initialTransformation.before(this.getTranslation());
  }
  getTranslation() {
    return p.translation(this.point.current.x - this.point.initial.x, this.point.current.y - this.point.initial.y);
  }
  withAnchor(t) {
    return t === this.anchor ? this : this.context.getGestureForTwoAnchors(this.point.cancel(), t);
  }
  withoutAnchor(t) {
    this.point.cancel();
  }
}
class $n {
  constructor(t, e, n) {
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
class Js extends $n {
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
    this.context.transformation = this.initialTransformation.before(p.translateZoom(
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
class Zs extends $n {
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
    this.context.transformation = this.initialTransformation.before(p.translateRotateZoom(
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
class Dt {
  constructor() {
    this.mapped = [];
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
class _ extends Dt {
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
class _s {
  constructor(t, e) {
    this.setNewValue = t, this.timeoutInMs = e, this._changing = !1, this._firstChange = new _(), this._subsequentChange = new _(), this._changeEnd = new _();
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
class tr {
  constructor(t, e) {
    this.viewBox = t, this.config = e, this._transformationChangeMonitor = new _s((n) => this.viewBox.transformation = n, 100);
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
    return new Qs(t, this);
  }
  getGestureForTwoAnchors(t, e) {
    return this.config.rotationEnabled ? new Zs(t, e, this) : new Js(t, e, this);
  }
  releaseAnchor(t) {
    this.gesture && (this.gesture = this.gesture.withoutAnchor(t));
  }
  zoom(t, e, n) {
    this._zoom && this._zoom.cancel(), this._zoom = new js(this, t, e, n, () => {
      this._zoom = void 0;
    });
  }
  addRotationAnchor(t) {
    this.gesture = new Ks(t, this);
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
class er {
  constructor() {
    this.animationFrameRequested = !1;
  }
  provideDrawingIteration(t) {
    this.animationFrameRequested || (this.animationFrameRequested = !0, requestAnimationFrame(() => {
      t(), this.animationFrameRequested = !1;
    }));
  }
}
class nr {
  constructor(t) {
    this.drawingIterationProvider = t, this._drawHappened = new _();
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
class ir {
  constructor(t) {
    this.drawingIterationProvider = t, this._locks = [];
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
var b = /* @__PURE__ */ ((s) => (s[s.CSS = 0] = "CSS", s[s.CANVAS = 1] = "CANVAS", s))(b || {});
class A {
  constructor(t) {
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
class xt {
  constructor(t, e, n) {
    this.userCoordinates = t, this.canvasBitmap = e, this.virtualBitmapBase = n, this.setDerivedProperties();
  }
  withCanvasBitmapDistortion(t) {
    const e = this.canvasBitmap.representBase(t), n = this.userCoordinates.representSimilarTransformation(e), i = this.virtualBitmapBase.before(n), r = new A(t);
    return new xt(this.userCoordinates, r, i);
  }
  withUserTransformation(t) {
    return new xt(new A(t), this.canvasBitmap, this.virtualBitmapBase);
  }
  setDerivedProperties() {
    this.infiniteCanvasContext = new A(this.virtualBitmapBase.before(this.userCoordinates.base)), this.userCoordinatesInsideCanvasBitmap = new A(this.userCoordinates.base.before(this.canvasBitmap.base)), this.initialBitmapTransformation = this.canvasBitmap.representBase(this.userCoordinates.getSimilarTransformation(this.virtualBitmapBase)), this.icContextFromCanvasBitmap = new A(this.infiniteCanvasContext.base.before(this.canvasBitmap.inverseBase));
  }
}
class bt {
  constructor(t, e) {
    this.userCoordinates = t, this.canvasBitmap = e, this.setDerivedProperties();
  }
  get infiniteCanvasContext() {
    return this.userCoordinates;
  }
  withUserTransformation(t) {
    return new bt(new A(t), this.canvasBitmap);
  }
  withCanvasBitmapDistortion(t) {
    return new bt(this.userCoordinates, new A(t));
  }
  setDerivedProperties() {
    this.userCoordinatesInsideCanvasBitmap = new A(this.userCoordinates.base.before(this.canvasBitmap.base)), this.initialBitmapTransformation = this.canvasBitmap.inverseBase, this.icContextFromCanvasBitmap = new A(this.userCoordinates.base.before(this.canvasBitmap.inverseBase));
  }
}
function hn(s) {
  const { screenWidth: t, screenHeight: e, viewboxWidth: n, viewboxHeight: i } = s;
  return new p(t / n, 0, 0, e / i, 0, 0);
}
class lt {
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
    return this.coordinates.icContextFromCanvasBitmap.getSimilarTransformation(p.create(t));
  }
  getTransformationForInstruction(t) {
    const e = p.create(t).before(this.coordinates.infiniteCanvasContext.base), n = this.coordinates.userCoordinatesInsideCanvasBitmap.representBase(e);
    return this.coordinates.userCoordinates.getSimilarTransformation(n);
  }
  withUserTransformation(t) {
    const e = this.coordinates.withUserTransformation(t);
    return new lt(this.units, e);
  }
  withCanvasMeasurement(t) {
    const e = hn(t), n = this.coordinates.withCanvasBitmapDistortion(e);
    return new lt(this.units, n);
  }
  withUnits(t) {
    if (t === this.units)
      return this;
    let e;
    return t === b.CANVAS ? e = new xt(this.coordinates.userCoordinates, this.coordinates.canvasBitmap, this.coordinates.canvasBitmap.base) : e = new bt(this.coordinates.userCoordinates, this.coordinates.canvasBitmap), new lt(t, e);
  }
  static create(t, e) {
    const n = hn(e), i = t === b.CANVAS ? new xt(new A(p.identity), new A(n), n) : new bt(new A(p.identity), new A(n));
    return new lt(t, i);
  }
}
function sr(s, t) {
  return s ? t ? s.viewboxWidth === t.viewboxWidth && s.viewboxHeight === t.viewboxHeight && s.screenWidth === t.screenWidth && s.screenHeight === t.screenHeight : !1 : !t;
}
class ut {
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
    return new ut(e, this.measurement, this.polygon);
  }
  withTransformation(t) {
    const e = this.coordinates.withUserTransformation(p.create(t));
    return new ut(e, this.measurement, this.polygon);
  }
  withMeasurement(t) {
    if (sr(this.measurement, t))
      return this;
    const { viewboxWidth: n, viewboxHeight: i } = t, r = an(0, 0, n, i).getArea(), o = this.coordinates.withCanvasMeasurement(t);
    return new ut(o, t, r);
  }
  getCSSPosition(t, e) {
    const { left: n, top: i } = this.measurement;
    return new c(t - n, e - i);
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
  addPathAroundViewbox(t, e) {
    const n = this.viewboxWidth + 2 * e, i = this.viewboxHeight + 2 * e;
    t.save(), t.setTransform(1, 0, 0, 1, 0, 0), t.rect(-e, -e, n, i), t.restore();
  }
  static create(t, e) {
    const { viewboxWidth: n, viewboxHeight: i } = t, r = an(0, 0, n, i).getArea(), o = lt.create(e, t);
    return new ut(o, t, r);
  }
}
class rr {
  constructor(t, e) {
    this.measurementProvider = t, this.config = e, this.transformation = p.identity;
  }
  setTransformation(t) {
    this.rectangle ? this.rectangle = this.rectangle.withTransformation(t) : this.transformation = t;
  }
  measure() {
    const t = this.config.units === b.CSS ? b.CSS : b.CANVAS, e = this.measurementProvider.measure();
    e.screenWidth === 0 || e.screenHeight === 0 ? this.rectangle = void 0 : this.rectangle ? this.rectangle = this.rectangle.withUnits(t).withMeasurement(e) : this.rectangle = ut.create(e, t).withTransformation(this.transformation);
  }
}
class or {
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
function pt(s) {
  const { a: t, b: e, c: n, d: i, e: r, f: o } = s;
  return { a: t, b: e, c: n, d: i, e: r, f: o };
}
const ar = {
  transformationstart: null,
  transformationchange: null,
  transformationend: null
}, Un = {
  auxclick: null,
  click: null,
  contextmenu: null,
  dblclick: null,
  mouseenter: null,
  mouseleave: null,
  mouseout: null,
  mouseover: null,
  mouseup: null
}, Kn = {
  gotpointercapture: null,
  lostpointercapture: null,
  pointerenter: null,
  pointerout: null,
  pointerover: null
}, jn = {
  drag: null,
  dragend: null,
  dragenter: null,
  dragleave: null,
  dragover: null,
  dragstart: null,
  drop: null
}, Qn = {
  touchcancel: null,
  touchend: null
}, cr = {
  ...Un,
  ...Kn,
  ...jn,
  ...Qn
}, Jn = {
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
function Ft(s) {
  return ar.hasOwnProperty(s);
}
function Wt(s) {
  return cr.hasOwnProperty(s) || Jn.hasOwnProperty(s);
}
function kt(s) {
  return Jn.hasOwnProperty(s);
}
function Ht(s) {
  return Un.hasOwnProperty(s);
}
function Vt(s) {
  return Kn.hasOwnProperty(s);
}
function Mt(s) {
  return jn.hasOwnProperty(s);
}
function Nt(s) {
  return Qn.hasOwnProperty(s);
}
class hr extends Dt {
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
class lr extends Dt {
  constructor(t, e) {
    super(), this.transform = e, this.old = new hr(t);
  }
  map(t) {
    const e = {
      oldListener: void 0,
      newListener: t.listener,
      removedCallback: () => {
        t.removedCallback && t.removedCallback();
      }
    };
    return e.oldListener = this.transform(t.listener, (n) => e.removedCallback = () => {
      t.removedCallback && t.removedCallback(), n();
    }), this.old.addListener(e.oldListener, () => this.removeListener(t.listener)), e;
  }
  mapsTo(t, e) {
    return t.newListener === e.listener;
  }
  onRemoved(t) {
    this.old.removeListener(t.oldListener), t.removedCallback();
  }
  addListener(t, e) {
    this.add({ listener: t, removedCallback: e });
  }
  removeListener(t) {
    this.remove({ listener: t });
  }
}
function rt(s, t) {
  return new lr(s, t);
}
function X(s, t) {
  return rt(s, (e) => (n) => {
    e(t(n));
  });
}
function te(s) {
  return !!s && typeof s.handleEvent == "function";
}
class ur extends Dt {
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
class dr {
  constructor(t) {
    this.source = t, this.listenerObjectCollection = new ur(t);
  }
  addListener(t, e) {
    te(t) ? this.listenerObjectCollection.add({ listenerObject: t, removedCallback: e }) : this.source.addListener(t, e);
  }
  removeListener(t) {
    te(t) ? this.listenerObjectCollection.remove({ listenerObject: t }) : this.source.removeListener(t);
  }
}
function ln(s) {
  return new dr(s);
}
function fr(s, t, e) {
  te(t), s.addListener(t, e);
}
function gr(s, t, e) {
  te(t), s.removeListener(t, e);
}
function mr(s) {
  const t = rt(s, (e) => (n) => {
    e(n), t.removeListener(e);
  });
  return t;
}
function pr(s, t) {
  return rt(s, (e) => (n) => {
    e.apply(t, [n]);
  });
}
class vr {
  constructor(t) {
    this.source = t, this.firstDispatcher = new _(), this.secondDispatcher = new _(), this.numberOfListeners = 0, this.sourceListener = (e) => this.dispatchEvent(e);
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
      first: rt(this.firstDispatcher, (t, e) => (this.add(), e(() => this.remove()), t)),
      second: rt(this.secondDispatcher, (t, e) => (this.add(), e(() => this.remove()), t))
    };
  }
}
function un(s) {
  return new vr(s).build();
}
function G(s, t) {
  return rt(s, (e) => (n) => {
    t(n) && e(n);
  });
}
class dn {
  constructor(t, e) {
    t = pr(t, e), this._onceSource = ln(mr(t)), this.source = ln(t);
  }
  addListener(t, e) {
    e && e.once ? this._onceSource.addListener(t) : this.source.addListener(t);
  }
  removeListener(t) {
    this.source.removeListener(t), this._onceSource.removeListener(t);
  }
}
class wr {
  constructor(t, e) {
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
function Pr(s, t, e) {
  return new wr(
    new dn(s, e),
    new dn(t, e)
  );
}
function et(s, t, e, n) {
  const i = X(G(s, (o) => !o.immediatePropagationStopped), (o) => o.getResultEvent(e.rectangle)), r = X(G(t, (o) => !o.propagationStopped && !o.immediatePropagationStopped), (o) => o.getResultEvent(e.rectangle));
  return Pr(i, r, n);
}
function nt(s) {
  const { first: t, second: e } = un(s), { first: n, second: i } = un(e);
  return {
    captureSource: t,
    bubbleSource: n,
    afterBubble: i
  };
}
function Cr(s, t, e) {
  const { captureSource: n, bubbleSource: i } = nt(s);
  return et(
    n,
    i,
    t,
    e
  );
}
class Xe {
  constructor(t, e) {
    this.rectangleManager = t, this.infiniteCanvas = e, this.cache = {};
  }
  map(t, e) {
    return Cr(X(t, e), this.rectangleManager, this.infiniteCanvas);
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
    this.cache[t] || (this.cache[t] = this.getEventSource(t)), fr(this.cache[t], e, n);
  }
  removeEventListener(t, e, n) {
    this.cache[t] && gr(this.cache[t], e, n);
  }
}
class Zn extends Xe {
  getEventSource(t) {
    return (!this.cache || !this.cache[t]) && (this.cache = this.createEvents()), this.cache[t];
  }
}
class _n {
  constructor(t, e) {
    this.canvasEvent = t, this.preventableDefault = e, this.AT_TARGET = 2, this.BUBBLING_PHASE = 3, this.CAPTURING_PHASE = 1, this.NONE = 0;
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
class $e extends _n {
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
class ti {
  constructor(t) {
    this.preventableDefault = t, this.propagationStopped = !1, this.immediatePropagationStopped = !1;
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
class Ir {
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
class Tr {
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
class Ue extends ti {
  constructor(t) {
    super(t ? new Ir() : new Tr());
  }
}
class Sr extends $e {
  constructor(t, e) {
    super(t, e, "draw"), this.transformation = t.transformation, this.inverseTransformation = t.inverseTransformation;
  }
}
class yr extends Ue {
  constructor() {
    super(!1);
  }
  createResultEvent(t) {
    return this.transformation = pt(t.infiniteCanvasContext.inverseBase), this.inverseTransformation = pt(t.infiniteCanvasContext.base), new Sr(this, this.preventableDefault);
  }
}
class xr extends Zn {
  constructor(t, e, n) {
    super(e, n), this.drawingIterationProvider = t;
  }
  createEvents() {
    return {
      draw: this.map(this.drawingIterationProvider.drawHappened, () => new yr())
    };
  }
}
class br extends $e {
  constructor(t, e, n) {
    super(t, e, n), this.transformation = t.transformation, this.inverseTransformation = t.inverseTransformation;
  }
}
class ve extends Ue {
  constructor(t) {
    super(!1), this.type = t;
  }
  createResultEvent(t) {
    return this.transformation = pt(t.infiniteCanvasContext.inverseBase), this.inverseTransformation = pt(t.infiniteCanvasContext.base), new br(this, this.preventableDefault, this.type);
  }
}
class Or extends Zn {
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
function W(s, t) {
  return {
    addListener(e) {
      s.addEventListener(t, e);
    },
    removeListener(e) {
      s.removeEventListener(t, e);
    }
  };
}
class Lr {
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
class Br {
  constructor(t) {
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
class vt extends ti {
  constructor(t, e) {
    super(e ? new Br(t) : new Lr(t)), this.event = t;
  }
  stopPropagation() {
    super.stopPropagation(), this.event && this.event.stopPropagation();
  }
  stopImmediatePropagation() {
    super.stopImmediatePropagation(), this.event && this.event.stopImmediatePropagation();
  }
}
class ot {
  constructor(t, e, n, i) {
    this.offsetX = t, this.offsetY = e, this.movementX = n, this.movementY = i;
  }
  toInfiniteCanvasCoordinates(t) {
    const { x: e, y: n } = t.infiniteCanvasContext.inverseBase.apply(new c(this.offsetX, this.offsetY)), { x: i, y: r } = t.infiniteCanvasContext.inverseBase.untranslated().apply(new c(this.movementX, this.movementY));
    return new ot(e, n, i, r);
  }
  static create(t) {
    return new ot(t.offsetX, t.offsetY, t.movementX, t.movementY);
  }
}
class Ar extends _n {
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
class ei extends Ar {
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
class le extends ei {
  constructor(t, e, n, i) {
    super(t, e, n), this.offsetX = i.offsetX, this.offsetY = i.offsetY, this.movementX = i.movementX, this.movementY = i.movementY;
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
  getModifierState(t) {
    return this.event.getModifierState(t);
  }
  initMouseEvent(t, e, n, i, r, o, a, l, h, d, u, g, v, P, T) {
  }
}
class xe extends vt {
  constructor(t, e) {
    super(t, e), this.props = ot.create(t);
  }
  createResultEvent(t) {
    return new le(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
}
class ee extends ot {
  constructor(t, e, n, i, r, o) {
    super(t, e, n, i), this.width = r, this.height = o;
  }
  toInfiniteCanvasCoordinates(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: r } = super.toInfiniteCanvasCoordinates(t), { x: o, y: a } = t.infiniteCanvasContext.inverseBase.untranslated().apply(new c(this.width, this.height));
    return new ee(
      e,
      n,
      i,
      r,
      o,
      a
    );
  }
  static create(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: r } = super.create(t);
    return new ee(
      e,
      n,
      i,
      r,
      t.width,
      t.height
    );
  }
}
class Dr extends le {
  constructor(t, e, n, i) {
    super(t, e, n, i);
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
class ct extends vt {
  constructor(t, e) {
    super(t, e), this.props = ee.create(t);
  }
  createResultEvent(t) {
    return new Dr(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
}
class Er {
  constructor(t, e) {
    this.initial = t, this.cancel = e, this.current = t;
  }
}
class Rr {
  constructor(t) {
    this.point = t, this.moveEventDispatcher = new _(), this._fixedOnInfiniteCanvas = !1;
  }
  get fixedOnInfiniteCanvas() {
    return this._fixedOnInfiniteCanvas;
  }
  removeHandler(t) {
    this.moveEventDispatcher.removeListener(t);
  }
  moveTo(t, e) {
    const n = new c(t, e);
    this.point = n, this.moveEventDispatcher.dispatch(n);
  }
  onMoved(t, e) {
    let n;
    this._fixedOnInfiniteCanvas = e;
    const i = (r) => {
      n.current = r, t();
    };
    return this.moveEventDispatcher.addListener(i), n = new Er(this.point, () => (this.removeHandler(i), this._fixedOnInfiniteCanvas = !1, this)), n;
  }
}
class Fr {
  constructor(t) {
    this.pointerEvent = t, this._defaultPrevented = !1, this.anchor = new Rr(new c(t.offsetX, t.offsetY));
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
class Wr {
  constructor() {
    this.anchors = [];
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
    const e = new Fr(t);
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
class ne extends ot {
  constructor(t, e, n, i, r, o) {
    super(t, e, n, i), this.deltaX = r, this.deltaY = o;
  }
  toInfiniteCanvasCoordinates(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: r } = super.toInfiniteCanvasCoordinates(t), { x: o, y: a } = t.infiniteCanvasContext.inverseBase.untranslated().apply(new c(this.deltaX, this.deltaY));
    return new ne(
      e,
      n,
      i,
      r,
      o,
      a
    );
  }
  static create(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: r } = super.create(t);
    return new ne(
      e,
      n,
      i,
      r,
      t.deltaX,
      t.deltaY
    );
  }
}
class kr extends le {
  constructor(t, e, n, i) {
    super(t, e, n, i), this.DOM_DELTA_LINE = 1, this.DOM_DELTA_PAGE = 2, this.DOM_DELTA_PIXEL = 0, this.deltaX = i.deltaX, this.deltaY = i.deltaY;
  }
  get deltaMode() {
    return this.event.deltaMode;
  }
  get deltaZ() {
    return this.event.deltaZ;
  }
}
class Hr extends vt {
  constructor(t, e) {
    super(t, e), this.props = ne.create(t);
  }
  createResultEvent(t) {
    return new kr(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
}
function dt(s, t) {
  const e = [];
  for (let n = 0; n < s.length; n++) {
    const i = s[n];
    (!t || t(i)) && e.push(i);
  }
  return e;
}
class ie {
  constructor(t, e, n, i, r, o) {
    this.x = t, this.y = e, this.radiusX = n, this.radiusY = i, this.rotationAngle = r, this.identifier = o;
  }
  toInfiniteCanvasCoordinates(t) {
    const e = t.infiniteCanvasContext.inverseBase, { x: n, y: i } = e.apply(new c(this.x, this.y)), r = this.radiusX * e.scale, o = this.radiusY * e.scale, a = this.rotationAngle + e.getRotationAngle();
    return new ie(
      n,
      i,
      r,
      o,
      a,
      this.identifier
    );
  }
  static create(t, e) {
    const { x: n, y: i } = e.getCSSPosition(t.clientX, t.clientY);
    return new ie(
      n,
      i,
      t.radiusX,
      t.radiusY,
      t.rotationAngle,
      t.identifier
    );
  }
}
class fn {
  constructor() {
    this.translatedProps = [], this.createdProps = [];
  }
  toInfiniteCanvasCoordinates(t, e) {
    let n = this.translatedProps.find((i) => i.identifier === t.identifier);
    return n || (n = t.toInfiniteCanvasCoordinates(e), this.translatedProps.push(n), n);
  }
  createProps(t, e) {
    let n = this.createdProps.find((i) => i.identifier === t.identifier);
    return n || (n = ie.create(t, e), this.createdProps.push(n), n);
  }
  dispose() {
    this.translatedProps.splice(0, this.translatedProps.length), this.createdProps.splice(0, this.createdProps.length);
  }
}
class se {
  constructor(t, e, n) {
    this.targetTouches = t, this.changedTouches = e, this.touches = n;
  }
  toInfiniteCanvasCoordinates(t) {
    const e = new fn(), n = new se(
      this.targetTouches.map((i) => e.toInfiniteCanvasCoordinates(i, t)),
      this.changedTouches.map((i) => e.toInfiniteCanvasCoordinates(i, t)),
      this.touches.map((i) => e.toInfiniteCanvasCoordinates(i, t))
    );
    return e.dispose(), n;
  }
  static create(t, e, n) {
    const i = new fn(), r = e.map((a) => i.createProps(a, t)), o = n.map((a) => i.createProps(a, t));
    return i.dispose(), new se(
      r,
      o,
      r
    );
  }
}
class Vr {
  constructor(t, e) {
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
class Mr extends Array {
  item(t) {
    return this[t];
  }
}
function Nr(s, t) {
  const e = s.length;
  for (let n = 0; n < e; n++) {
    const i = s[n];
    if (i.identifier === t)
      return i;
  }
}
function qr(s, t) {
  for (let e of s) {
    const n = Nr(e, t);
    if (n)
      return n;
  }
}
function we(s, t) {
  const e = [];
  for (const n of t) {
    const i = qr(s, n.identifier);
    i && e.push(new Vr(i, n));
  }
  return new Mr(...e);
}
class zr extends ei {
  constructor(t, e, n, i) {
    super(t, e, n), this.touches = we([n.touches], i.touches), this.targetTouches = we([n.touches], i.targetTouches), this.changedTouches = we([n.touches, n.changedTouches], i.changedTouches);
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
class Ot extends vt {
  constructor(t, e, n) {
    super(t, n), this.props = e;
  }
  createResultEvent(t) {
    return new zr(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
  static create(t, e, n, i, r) {
    const o = se.create(t, n, i);
    return new Ot(e, o, r);
  }
}
class gn {
  constructor(t, e) {
    this.source = t, this.listener = e, t.addListener(e);
  }
  remove() {
    this.source.removeListener(this.listener);
  }
}
class Gr {
  constructor(t, e, n, i) {
    this.listener = n, this.onRemoved = i;
    let r;
    this.otherSubscription = new gn(e, (o) => {
      r = o;
    }), this.subscription = new gn(t, (o) => {
      n([o, r]);
    });
  }
  remove() {
    this.subscription.remove(), this.otherSubscription.remove(), this.onRemoved && this.onRemoved();
  }
}
class Yr extends Dt {
  constructor(t, e) {
    super(), this.source = t, this.otherSource = e;
  }
  map(t) {
    return new Gr(this.source, this.otherSource, t.listener, t.onRemoved);
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
  return new Yr(s, t);
}
function Xr(s, t) {
  for (let e = 0; e < s.length; e++) {
    const n = s[e];
    if (t(n))
      return !0;
  }
  return !1;
}
function $r(s, t) {
  return rt(s, (e) => {
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
class Ur {
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
function Kr(s) {
  return new Ur(s);
}
class mn extends Ue {
  constructor(t) {
    super(!0), this.type = t;
  }
  createResultEvent() {
    return new $e(this, this.preventableDefault, this.type);
  }
}
class jr extends Xe {
  constructor(t, e, n, i, r) {
    super(n, i), this.transformer = e, this.config = r, this.anchorSet = new Wr();
    const o = W(t, "pointerdown"), a = W(t, "pointerleave"), l = W(t, "pointermove"), h = W(t, "pointerup"), d = W(t, "pointercancel"), u = G(
      W(t, "touchmove"),
      (f) => Xr(f.targetTouches, (O) => !this.hasFixedAnchorForTouch(O.identifier))
    );
    o.addListener((f) => this.anchorSet.updateAnchorForPointerEvent(f)), l.addListener((f) => this.anchorSet.updateAnchorForPointerEvent(f)), h.addListener((f) => this.removePointer(f)), a.addListener((f) => this.removePointer(f));
    const g = X(W(t, "mousedown"), (f) => new xe(f, !0)), v = X(W(t, "wheel"), (f) => new Hr(f, !0)), P = X(W(t, "touchstart"), (f) => {
      const O = dt(f.targetTouches), z = dt(f.changedTouches);
      return Ot.create(
        this.rectangleManager.rectangle,
        f,
        O,
        z,
        !0
      );
    }), T = X(o, (f) => new ct(f, !0)), { captureSource: B, bubbleSource: H, afterBubble: q } = nt(T), { captureSource: tt, bubbleSource: wt, afterBubble: Pt } = nt(g), { captureSource: Ct, bubbleSource: ue, afterBubble: de } = nt(P), { captureSource: fe, bubbleSource: ge, afterBubble: It } = nt(v), ni = X(
      G(It, (f) => !this.config.greedyGestureHandling && !f.event.ctrlKey && !f.infiniteCanvasDefaultPrevented),
      () => new mn("wheelignored")
    ), { captureSource: ii, bubbleSource: si, afterBubble: ri } = nt(ni);
    It.addListener((f) => {
      f.infiniteCanvasDefaultPrevented || this.zoom(f.event);
    }), ri.addListener((f) => {
      f.infiniteCanvasDefaultPrevented || console.warn("use ctrl + scroll to zoom");
    }), Pe(Pt, q).addListener(([f, O]) => {
      !f.infiniteCanvasDefaultPrevented && !O.infiniteCanvasDefaultPrevented && this.transformUsingPointer(f.event, O.event);
    });
    const oi = G(de, (f) => f.event.changedTouches.length === 1), je = Pe(oi, q);
    je.addListener(([f, O]) => {
      const z = f.event.changedTouches[0], j = this.anchorSet.getAnchorForPointerEvent(O.event);
      if (j)
        if (j.setTouchId(z.identifier), !f.infiniteCanvasDefaultPrevented && !O.infiniteCanvasDefaultPrevented)
          if (this.config.greedyGestureHandling)
            this.rectangleManager.measure(), this.transformer.addAnchor(j.anchor), f.event.preventDefault();
          else {
            const Je = this.anchorSet.find((me) => me.touchId !== void 0 && me !== j && !me.defaultPrevented);
            if (!Je)
              return;
            this.rectangleManager.measure(), this.transformer.addAnchor(Je.anchor), this.transformer.addAnchor(j.anchor), f.event.preventDefault();
          }
        else
          j.preventDefault();
    });
    const Qe = G(
      Pe(d, je),
      ([f, [O, z]]) => f.pointerId === z.event.pointerId
    );
    Qe.addListener(([f]) => {
      this.removePointer(f);
    });
    const ai = X(
      G(Qe, ([f, [O, z]]) => !this.config.greedyGestureHandling && !O.infiniteCanvasDefaultPrevented && !z.infiniteCanvasDefaultPrevented),
      () => new mn("touchignored")
    ), { captureSource: ci, bubbleSource: hi, afterBubble: li } = nt(ai);
    li.addListener((f) => {
      f.infiniteCanvasDefaultPrevented || console.warn("use two fingers to move");
    }), this.cache = {
      mousemove: this.map(G(W(t, "mousemove"), () => !this.mouseAnchorIsFixed()), (f) => new xe(f)),
      mousedown: et(tt, wt, n, i),
      pointerdown: et(B, H, n, i),
      pointermove: this.map(
        $r(
          G(l, () => this.hasNonFixedAnchorForSomePointer()),
          () => Kr(this.anchorSet.getAll((f) => !f.anchor.fixedOnInfiniteCanvas).map((f) => f.pointerEvent))
        ),
        (f) => new ct(f)
      ),
      pointerleave: this.map(a, (f) => new ct(f)),
      pointerup: this.map(h, (f) => new ct(f)),
      pointercancel: this.map(d, (f) => new ct(f)),
      wheel: et(fe, ge, n, i),
      wheelignored: et(ii, si, n, i),
      touchstart: et(Ct, ue, n, i),
      touchignored: et(ci, hi, n, i),
      touchmove: this.map(u, (f) => {
        const O = dt(f.targetTouches), z = dt(f.targetTouches, (j) => !this.hasFixedAnchorForTouch(j.identifier));
        return Ot.create(
          this.rectangleManager.rectangle,
          f,
          O,
          z
        );
      })
    };
  }
  getEventSource(t) {
    return this.cache[t];
  }
  mouseAnchorIsFixed() {
    const t = this.anchorSet.find((e) => e.pointerEvent.pointerType === "mouse");
    return t ? t.anchor.fixedOnInfiniteCanvas : !1;
  }
  hasFixedAnchorForTouch(t) {
    const e = this.anchorSet.getAnchorForTouch(t);
    return !!e && e.anchor.fixedOnInfiniteCanvas;
  }
  hasNonFixedAnchorForSomePointer() {
    return !!this.anchorSet.find((t) => !t.anchor.fixedOnInfiniteCanvas);
  }
  transformUsingPointer(t, e) {
    this.rectangleManager.measure();
    const n = this.anchorSet.getAnchorForPointerEvent(e);
    n && (e.button === 1 && this.config.rotationEnabled ? (t.preventDefault(), this.transformer.addRotationAnchor(n.anchor)) : e.button === 0 && this.transformer.addAnchor(n.anchor));
  }
  removePointer(t) {
    const e = this.anchorSet.getAnchorForPointerEvent(t);
    e && (this.transformer.releaseAnchor(e.anchor), this.anchorSet.removeAnchor(e));
  }
  zoom(t) {
    if (!this.config.greedyGestureHandling && !t.ctrlKey)
      return;
    const { offsetX: e, offsetY: n } = t;
    let i = t.deltaY;
    const r = Math.pow(2, -i / 300);
    this.rectangleManager.measure(), this.transformer.zoom(e, n, r), t.preventDefault();
  }
}
class Qr {
  constructor(t, e) {
    this.handledOrFilteredEventCollection = t, this.mappingCollection = e;
  }
  setOn(t, e) {
    kt(t) ? this.handledOrFilteredEventCollection.setOn(t, e) : this.mappingCollection.setOn(t, e);
  }
  getOn(t) {
    return kt(t) ? this.handledOrFilteredEventCollection.getOn(t) : this.mappingCollection.getOn(t);
  }
  addEventListener(t, e, n) {
    kt(t) ? this.handledOrFilteredEventCollection.addEventListener(t, e, n) : this.mappingCollection.addEventListener(t, e, n);
  }
  removeEventListener(t, e, n) {
    kt(t) ? this.handledOrFilteredEventCollection.removeEventListener(t, e, n) : this.mappingCollection.removeEventListener(t, e, n);
  }
}
class Jr {
  constructor(t, e, n, i) {
    this.mappedMouseEventCollection = t, this.mappedTouchEventCollection = e, this.mappedOnlyPointerEventCollection = n, this.mappedDragEventCollection = i;
  }
  setOn(t, e) {
    Ht(t) ? this.mappedMouseEventCollection.setOn(t, e) : Nt(t) ? this.mappedTouchEventCollection.setOn(t, e) : Vt(t) ? this.mappedOnlyPointerEventCollection.setOn(t, e) : Mt(t) && this.mappedDragEventCollection.setOn(t, e);
  }
  getOn(t) {
    if (Ht(t))
      return this.mappedMouseEventCollection.getOn(t);
    if (Nt(t))
      return this.mappedTouchEventCollection.getOn(t);
    if (Vt(t))
      return this.mappedOnlyPointerEventCollection.getOn(t);
    if (Mt(t))
      return this.mappedDragEventCollection.getOn(t);
  }
  addEventListener(t, e, n) {
    Ht(t) ? this.mappedMouseEventCollection.addEventListener(t, e, n) : Nt(t) ? this.mappedTouchEventCollection.addEventListener(t, e, n) : Vt(t) ? this.mappedOnlyPointerEventCollection.addEventListener(t, e, n) : Mt(t) && this.mappedDragEventCollection.addEventListener(t, e, n);
  }
  removeEventListener(t, e, n) {
    Ht(t) ? this.mappedMouseEventCollection.removeEventListener(t, e, n) : Nt(t) ? this.mappedTouchEventCollection.removeEventListener(t, e, n) : Vt(t) ? this.mappedOnlyPointerEventCollection.removeEventListener(t, e, n) : Mt(t) && this.mappedDragEventCollection.removeEventListener(t, e, n);
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
    return this.map(W(this.canvasEl, t), (e) => this.createInternalEvent(e));
  }
}
class Zr extends le {
  get dataTransfer() {
    return this.event.dataTransfer;
  }
}
class _r extends vt {
  constructor(t, e) {
    super(t, e), this.props = ot.create(t);
  }
  createResultEvent(t) {
    return new Zr(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
}
class to extends vt {
  createResultEvent() {
    return this.event;
  }
}
class Ke {
  constructor(t, e, n, i) {
    this.drawEventCollection = t, this.transformationEventCollection = e, this.pointerEventCollection = n, this.unmappedEventCollection = i;
  }
  setOn(t, e) {
    t === "draw" ? this.drawEventCollection.setOn("draw", e) : Ft(t) ? this.transformationEventCollection.setOn(t, e) : Wt(t) ? this.pointerEventCollection.setOn(t, e) : this.unmappedEventCollection.setOn(t, e);
  }
  getOn(t) {
    return t === "draw" ? this.drawEventCollection.getOn("draw") : Ft(t) ? this.transformationEventCollection.getOn(t) : Wt(t) ? this.pointerEventCollection.getOn(t) : this.unmappedEventCollection.getOn(t);
  }
  addEventListener(t, e, n) {
    t === "draw" ? this.drawEventCollection.addEventListener("draw", e, n) : Ft(t) ? this.transformationEventCollection.addEventListener(t, e, n) : Wt(t) ? this.pointerEventCollection.addEventListener(t, e, n) : this.unmappedEventCollection.addEventListener(t, e, n);
  }
  removeEventListener(t, e, n) {
    t === "draw" ? this.drawEventCollection.removeEventListener("draw", e, n) : Ft(t) ? this.transformationEventCollection.removeEventListener(t, e, n) : Wt(t) ? this.pointerEventCollection.removeEventListener(t, e, n) : this.unmappedEventCollection.removeEventListener(t, e, n);
  }
  static create(t, e, n, i, r, o) {
    const a = new xr(o, n, i), l = new Or(e, n, i), h = new jr(
      t,
      e,
      n,
      i,
      r
    ), d = new Qr(
      h,
      new Jr(
        new Tt(t, (u) => new xe(u), n, i),
        new Tt(t, (u) => {
          const g = dt(u.targetTouches), v = dt(u.changedTouches);
          return Ot.create(
            n.rectangle,
            u,
            g,
            v
          );
        }, n, i),
        new Tt(t, (u) => new ct(u), n, i),
        new Tt(t, (u) => new _r(u), n, i)
      )
    );
    return new Ke(
      a,
      l,
      d,
      new Tt(t, (u) => new to(u), n, i)
    );
  }
}
function eo(s, t) {
  let e = -1;
  const n = s.canvas.width;
  s.save(), s.fillStyle = "#fff", s.fillRect(0, 0, n, 5), s.filter = `drop-shadow(${t} 0)`, s.fillRect(0, 0, 1, 5);
  const r = s.getImageData(0, 0, n, 3).data;
  for (let o = 0; o < n; o++) {
    const a = 4 * (2 * n + o);
    if (r[a] !== 255) {
      e = o;
      break;
    }
  }
  return s.restore(), e;
}
function no(s, t) {
  const e = s.canvas.width;
  let n = 1, i = 1, r = -1;
  return d(), l(), o(), { numerator: n, denominator: i, pixels: r };
  function o() {
    let u = 0;
    do {
      const g = r;
      if (a(), r === g)
        break;
      u++;
    } while (u < 10);
  }
  function a() {
    const u = e / (r + 1);
    let g = r === 0 ? u : Math.min((e - 1) / r, u), v;
    for (; (v = Math.floor(g)) < 2; )
      g *= 10, i *= 10;
    n *= v, d(), h();
  }
  function l() {
    let u = 0;
    for (; r === -1 && u < 10; )
      i *= 10, d(), u++;
    h();
  }
  function h() {
    if (r === -1)
      throw new Error(`something went wrong while getting measurement for unit '${t}' on canvas with width ${e}`);
  }
  function d() {
    r = eo(s, `${n / i}${t}`);
  }
}
class io {
  constructor(t) {
    this.ctx = t, this.cache = {};
  }
  getNumberOfPixels(t, e) {
    if (t === 0)
      return 0;
    if (e === "px")
      return t;
    let n = this.cache[e];
    return n || (n = no(this.ctx, e), this.cache[e] = n), t * n.pixels * n.denominator / n.numerator;
  }
}
class so {
  constructor(t) {
    this.canvas = t, this.dispatcher = new _(), this.numberOfListeners = 0;
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
function pn(s) {
  const { screenWidth: t, screenHeight: e } = s;
  return t > 0 && e > 0;
}
class ro {
  constructor(t, e, n) {
    this.measurementProvider = t, this.resizes = e, this.viewBox = n, this.currentlyVisible = !1;
  }
  observe() {
    const t = this.measurementProvider.measure();
    this.currentlyVisible = pn(t);
    const e = (n) => {
      const i = pn(n);
      i && !this.currentlyVisible && this.viewBox.draw(), this.currentlyVisible = i;
    };
    this.resizes.addListener(e), this.listener = e;
  }
  disconnect() {
    this.listener && (this.resizes.removeListener(this.listener), this.listener = void 0);
  }
}
const re = class re {
  constructor(t, e) {
    this.canvas = t, this.config = { rotationEnabled: !0, greedyGestureHandling: !1, units: b.CANVAS }, e && Object.assign(this.config, e);
    const n = new so(t);
    this.canvasResizes = n, this.cssUnitsCanvasResizeListener = () => {
      this.canvas.parentElement !== null && this.viewBox.draw();
    };
    const i = new nr(new er()), r = new ir(i), o = new or(t);
    this.rectangleManager = new rr(o, this.config);
    let a;
    const l = t.getContext("2d");
    this.cssLengthConverterFactory = {
      create: () => new io(l)
    };
    const h = new Us(
      this.rectangleManager,
      l,
      r,
      () => r.getLock(),
      () => a.isTransforming
    );
    this.viewBox = h, this.canvasUnitsCanvasResizeObserver = new ro(o, n, h), a = new tr(this.viewBox, this.config), this.eventCollection = Ke.create(t, a, this.rectangleManager, this, this.config, i), this.config.units === b.CSS ? this.canvasResizes.addListener(this.cssUnitsCanvasResizeListener) : this.config.units === b.CANVAS && this.canvasUnitsCanvasResizeObserver.observe();
  }
  setUnits(t) {
    t === b.CSS && this.config.units !== b.CSS && (this.canvasUnitsCanvasResizeObserver.disconnect(), this.canvasResizes.addListener(this.cssUnitsCanvasResizeListener)), t === b.CANVAS && this.config.units !== b.CANVAS && (this.canvasResizes.removeListener(this.cssUnitsCanvasResizeListener), this.canvasUnitsCanvasResizeObserver.observe()), this.config.units = t, this.rectangleManager.measure(), this.viewBox.draw();
  }
  getContext() {
    return this.context || (this.context = new Vs(this.canvas, this.viewBox, this.cssLengthConverterFactory)), this.context;
  }
  get transformation() {
    return pt(this.rectangleManager.rectangle.infiniteCanvasContext.inverseBase);
  }
  get inverseTransformation() {
    return pt(this.rectangleManager.rectangle.infiniteCanvasContext.base);
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
};
re.CANVAS_UNITS = b.CANVAS, re.CSS_UNITS = b.CSS;
let be = re;
const ao = be;
export {
  b as Units,
  ao as default
};
