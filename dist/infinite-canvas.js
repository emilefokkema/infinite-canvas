let gi = class {
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
const ve = class at {
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
    return new at(this.x - t.x, this.y - t.y);
  }
  plus(t) {
    return new at(this.x + t.x, this.y + t.y);
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
    return new at(-this.y, this.x);
  }
  scale(t) {
    return new at(t * this.x, t * this.y);
  }
  projectOn(t) {
    return t.scale(this.dot(t) / t.modSq());
  }
  matrix(t, e, n, i) {
    return new at(t * this.x + e * this.y, n * this.x + i * this.y);
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
ve.origin = new ve(0, 0);
let h = ve;
function ot(s) {
  return s.toFixed(10).replace(/\.?0+$/, "");
}
const we = class B {
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
    return new h(this.a * t.x + this.c * t.y + this.e, this.b * t.x + this.d * t.y + this.f);
  }
  untranslated() {
    const { x: t, y: e } = this.apply(h.origin);
    return this.before(B.translation(-t, -e));
  }
  before(t) {
    const e = t.a * this.a + t.c * this.b, n = t.b * this.a + t.d * this.b, i = t.a * this.c + t.c * this.d, r = t.b * this.c + t.d * this.d, o = t.a * this.e + t.c * this.f + t.e, a = t.b * this.e + t.d * this.f + t.f;
    return new B(e, n, i, r, o, a);
  }
  equals(t) {
    return this.a === t.a && this.b === t.b && this.c === t.c && this.d === t.d && this.e === t.e && this.f === t.f;
  }
  inverse() {
    var t = this.a * this.d - this.b * this.c;
    if (t == 0)
      throw new Error("error calculating inverse: zero determinant");
    const e = this.d / t, n = -this.b / t, i = -this.c / t, r = this.a / t, o = (this.c * this.f - this.d * this.e) / t, a = (this.b * this.e - this.a * this.f) / t;
    return new B(e, n, i, r, o, a);
  }
  static translation(t, e) {
    return new B(1, 0, 0, 1, t, e);
  }
  static scale(t) {
    return new B(t, 0, 0, t, 0, 0);
  }
  static zoom(t, e, n, i, r) {
    const o = 1 - n;
    return i !== void 0 ? new B(n, 0, 0, n, t * o + i, e * o + r) : new B(n, 0, 0, n, t * o, e * o);
  }
  static translateZoom(t, e, n, i, r, o, a, l) {
    const c = n - t, d = i - e, u = c * c + d * d;
    if (u === 0)
      throw new Error("divide by 0");
    const g = a - r, v = l - o, P = g * g + v * v, T = Math.sqrt(P / u);
    return B.zoom(t, e, T, r - t, o - e);
  }
  static rotation(t, e, n) {
    const i = Math.cos(n), r = Math.sin(n), o = 1 - i;
    return new B(
      i,
      r,
      -r,
      i,
      t * o + e * r,
      -t * r + e * o
    );
  }
  static translateRotateZoom(t, e, n, i, r, o, a, l) {
    const c = n - t, d = i - e, u = c * c + d * d;
    if (u === 0)
      throw new Error("divide by 0");
    const g = a - r, v = l - o, P = t * i - e * n, T = n * c + i * d, L = t * c + e * d, k = (c * g + d * v) / u, N = (c * v - d * g) / u, _ = -N, vt = k, wt = (r * T - a * L - P * v) / u, Pt = (o * T - l * L + P * g) / u;
    return new B(k, N, _, vt, wt, Pt);
  }
  static create(t) {
    if (t instanceof B)
      return t;
    const { a: e, b: n, c: i, d: r, e: o, f: a } = t;
    return new B(e, n, i, r, o, a);
  }
  toString() {
    return `x: (${ot(this.a)}, ${ot(this.b)}), y: (${ot(this.c)}, ${ot(this.d)}), d: (${ot(this.e)}, ${ot(this.f)})`;
  }
};
we.identity = new we(1, 0, 0, 1, 0, 0);
let p = we;
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
class mi extends S {
  valuesAreEqual(t, e) {
    return t.equals(e);
  }
  changeToNewValue(t) {
    return (e, n) => {
      const { a: i, b: r, c: o, d: a, e: l, f: c } = n.getTransformationForInstruction(t);
      e.setTransform(i, r, o, a, l, c);
    };
  }
}
const Mt = new mi("transformation", y);
class pi {
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
    this.viewBox.changeState((t) => Mt.changeInstanceValue(t, p.identity));
  }
  rotate(t) {
    this.addTransformation(p.rotation(0, 0, t));
  }
  scale(t, e) {
    this.addTransformation(new p(t, 0, 0, e, 0, 0));
  }
  setTransform(t, e, n, i, r, o) {
    let a, l, c, d, u, g;
    typeof t == "number" ? (a = t, l = e, c = n, d = i, u = r, g = o) : t.a !== void 0 ? (a = t.a, l = t.b, c = t.c, d = t.d, u = t.e, g = t.f) : (a = t.m11, l = t.m12, c = t.m21, d = t.m22, u = t.m41, g = t.m42), this.viewBox.changeState((v) => Mt.changeInstanceValue(v, new p(a, l, c, d, u, g)));
  }
  transform(t, e, n, i, r, o) {
    this.addTransformation(new p(t, e, n, i, r, o));
  }
  translate(t, e) {
    this.addTransformation(p.translation(t, e));
  }
  addTransformation(t) {
    const e = this.viewBox.state.current.transformation, n = t.before(e);
    this.viewBox.changeState((i) => Mt.changeInstanceValue(i, n));
  }
}
class vi extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.globalAlpha = t;
  }
}
const pn = new vi("globalAlpha", y);
class wi extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.globalCompositeOperation = t;
  }
}
const vn = new wi("globalCompositeOperation", y);
class Pi {
  constructor(t) {
    this.viewBox = t;
  }
  get globalAlpha() {
    return this.viewBox.state.current.globalAlpha;
  }
  set globalAlpha(t) {
    this.viewBox.changeState((e) => pn.changeInstanceValue(e, t));
  }
  get globalCompositeOperation() {
    return this.viewBox.state.current.globalCompositeOperation;
  }
  set globalCompositeOperation(t) {
    this.viewBox.changeState((e) => vn.changeInstanceValue(e, t));
  }
}
class Ci extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.imageSmoothingEnabled = t;
    };
  }
}
const wn = new Ci("imageSmoothingEnabled", y);
class Ii extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.imageSmoothingQuality = t;
    };
  }
}
const Pn = new Ii("imageSmoothingQuality", y);
class Ti {
  constructor(t) {
    this.viewBox = t;
  }
  get imageSmoothingEnabled() {
    return this.viewBox.state.current.imageSmoothingEnabled;
  }
  set imageSmoothingEnabled(t) {
    this.viewBox.changeState((e) => wn.changeInstanceValue(e, t));
  }
  get imageSmoothingQuality() {
    return this.viewBox.state.current.imageSmoothingQuality;
  }
  set imageSmoothingQuality(t) {
    this.viewBox.changeState((e) => Pn.changeInstanceValue(e, t));
  }
}
class qt {
}
class Cn extends qt {
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
class In {
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
    return this.isEqualForInstances(t, e) ? !(n instanceof qt) || t.fillAndStrokeStylesTransformed === e.fillAndStrokeStylesTransformed ? () => {
    } : e.fillAndStrokeStylesTransformed ? n.getInstructionToSetTransformed(this.propName) : n.getInstructionToSetUntransformed(this.propName) : n instanceof qt ? e.fillAndStrokeStylesTransformed ? n.getInstructionToSetTransformed(this.propName) : n.getInstructionToSetUntransformed(this.propName) : (i) => {
      i[this.propName] = e[this.propName];
    };
  }
  valueIsTransformableForInstance(t) {
    return !(t[this.propName] instanceof Cn);
  }
}
const Tn = new In("fillStyle"), Sn = new In("strokeStyle");
class Si {
  constructor(t) {
    this.viewBox = t;
  }
  set fillStyle(t) {
    this.viewBox.changeState((e) => Tn.changeInstanceValue(e, t));
  }
  set strokeStyle(t) {
    this.viewBox.changeState((e) => Sn.changeInstanceValue(e, t));
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
class yi extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.shadowColor = t;
    };
  }
}
const yn = new yi("shadowColor", y);
class xi extends S {
  changeToNewValue(t) {
    return (e, n) => {
      const i = p.translation(t.x, t.y), r = n.translateInfiniteCanvasContextTransformationToBitmapTransformation(i), { x: o, y: a } = r.apply(h.origin);
      e.shadowOffsetX = o, e.shadowOffsetY = a;
    };
  }
  valuesAreEqual(t, e) {
    return t.x === e.x && t.y == e.y;
  }
}
const Pe = new xi("shadowOffset", y);
class bi extends S {
  changeToNewValue(t) {
    return (e, n) => {
      const i = p.translation(t, 0), o = n.translateInfiniteCanvasContextTransformationToBitmapTransformation(i).apply(h.origin).mod();
      e.shadowBlur = o;
    };
  }
  valuesAreEqual(t, e) {
    return t === e;
  }
}
const xn = new bi("shadowBlur", y);
class Oi {
  constructor(t) {
    this.viewBox = t;
  }
  get shadowBlur() {
    return this.viewBox.state.current.shadowBlur;
  }
  set shadowBlur(t) {
    this.viewBox.changeState((e) => xn.changeInstanceValue(e, t));
  }
  get shadowOffsetX() {
    return this.viewBox.state.current.shadowOffset.x;
  }
  set shadowOffsetX(t) {
    const e = new h(t, this.viewBox.state.current.shadowOffset.y);
    this.viewBox.changeState((n) => Pe.changeInstanceValue(n, e));
  }
  get shadowOffsetY() {
    return this.viewBox.state.current.shadowOffset.y;
  }
  set shadowOffsetY(t) {
    const e = new h(this.viewBox.state.current.shadowOffset.x, t);
    this.viewBox.changeState((n) => Pe.changeInstanceValue(n, e));
  }
  get shadowColor() {
    return this.viewBox.state.current.shadowColor;
  }
  set shadowColor(t) {
    this.viewBox.changeState((e) => yn.changeInstanceValue(e, t));
  }
}
const bn = "[+-]?(?:\\d*\\.)?\\d+(?:e[+-]?\\d+)?", On = "[+-]?(?:0*\\.)?0+(?:e[+-]?\\d+)?", Ln = "(?:ch|em|ex|ic|rem|vh|vw|vmax|vmin|vb|vi|cqw|cqh|cqi|cqb|cqmin|cqmax|px|cm|mm|Q|in|pc|pt)", Nt = `(?:${On}|${bn}${Ln})`, Bn = `blur\\((${Nt})\\)`, Ze = "[^())\\s]+(?:\\([^)]*?\\))?", An = `drop-shadow\\((${Nt})\\s+(${Nt})\\s*?(?:(?:(${Nt})\\s*?(${Ze})?)|(${Ze}))?\\)`, _e = `${Bn}|${An}`;
function R(s, t) {
  const e = s.match(new RegExp(`(?:(${On})|(${bn})(${Ln}))`));
  return e[1] ? 0 : t.getNumberOfPixels(Number.parseFloat(e[2]), e[3]);
}
class Dn {
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
class be {
  constructor(t, e) {
    this.stringRepresentation = t, this.size = e;
  }
  toTransformedString(t) {
    return `blur(${t.translateInfiniteCanvasContextTransformationToBitmapTransformation(p.translation(this.size, 0)).apply(h.origin).mod()}px)`;
  }
  getShadowOffset() {
    return null;
  }
  static tryCreate(t, e) {
    const n = t.match(new RegExp(Bn));
    return n === null ? null : new be(t, R(n[1], e));
  }
}
class ht {
  constructor(t, e, n, i, r) {
    this.stringRepresentation = t, this.offsetX = e, this.offsetY = n, this.blurRadius = i, this.color = r;
  }
  toTransformedString(t) {
    const e = t.translateInfiniteCanvasContextTransformationToBitmapTransformation(p.translation(this.offsetX, this.offsetY)), { x: n, y: i } = e.apply(h.origin);
    if (this.blurRadius !== null) {
      const o = t.translateInfiniteCanvasContextTransformationToBitmapTransformation(p.translation(this.blurRadius, 0)).apply(h.origin).mod();
      return this.color ? `drop-shadow(${n}px ${i}px ${o}px ${this.color})` : `drop-shadow(${n}px ${i}px ${o}px)`;
    }
    return this.color ? `drop-shadow(${n}px ${i}px ${this.color})` : `drop-shadow(${n}px ${i}px)`;
  }
  getShadowOffset() {
    return new h(this.offsetX, this.offsetY);
  }
  static tryCreate(t, e) {
    const n = t.match(new RegExp(An));
    return n === null ? null : n[5] ? new ht(
      t,
      R(n[1], e),
      R(n[2], e),
      null,
      n[5]
    ) : n[4] ? new ht(
      t,
      R(n[1], e),
      R(n[2], e),
      R(n[3], e),
      n[4]
    ) : n[3] ? new ht(
      t,
      R(n[1], e),
      R(n[2], e),
      R(n[3], e),
      null
    ) : new ht(
      t,
      R(n[1], e),
      R(n[2], e),
      null,
      null
    );
  }
}
const Ce = class En {
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
    return new En(t, i);
  }
  static createPart(t, e) {
    let n = be.tryCreate(t, e);
    return n !== null || (n = ht.tryCreate(t, e), n != null) ? n : new Dn(t);
  }
};
Ce.none = new Ce("none", [new Dn("none")]);
let Fn = Ce;
class Li extends S {
  valuesAreEqual(t, e) {
    return t.stringRepresentation === e.stringRepresentation;
  }
  changeToNewValue(t) {
    return (e, n) => e.filter = t.toTransformedString(n);
  }
}
const Rn = new Li("filter", y);
class Bi {
  constructor(t, e) {
    this.viewBox = t, this.cssLengthConverterFactory = e;
  }
  get filter() {
    return this.viewBox.state.current.filter.stringRepresentation;
  }
  set filter(t) {
    const e = Fn.create(t, this.cssLengthConverterFactory.create());
    this.viewBox.changeState((n) => Rn.changeInstanceValue(n, e));
  }
}
class Ai {
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
class Di {
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
class Ei {
  drawFocusIfNeeded(t, e) {
  }
  scrollPathIntoView(t) {
  }
}
var M = /* @__PURE__ */ ((s) => (s[s.None = 0] = "None", s[s.Relative = 1] = "Relative", s[s.Absolute = 2] = "Absolute", s))(M || {}), I = /* @__PURE__ */ ((s) => (s[s.Positive = 0] = "Positive", s[s.Negative = 1] = "Negative", s))(I || {});
const zt = { direction: new h(0, 1) }, Gt = { direction: new h(0, -1) }, Yt = { direction: new h(-1, 0) }, Xt = { direction: new h(1, 0) };
function Fi(s, t, e, n) {
  const i = e.minus(s), r = n.cross(t), o = n.getPerpendicular().dot(i) / r;
  return s.plus(t.scale(o));
}
class it {
  constructor(t, e, n) {
    this.point = t, this.leftHalfPlane = e, this.rightHalfPlane = n, this.leftNormal = e.normalTowardInterior, this.rightNormal = n.normalTowardInterior;
  }
  replaceLeftHalfPlane(t) {
    return new it(this.point, t, this.rightHalfPlane);
  }
  replaceRightHalfPlane(t) {
    return new it(this.point, this.leftHalfPlane, t);
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
    return e.normalTowardInterior.cross(n.normalTowardInterior) >= 0 ? new it(t, e, n) : new it(t, n, e);
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
      point: Fi(this.base, this.normalTowardInterior.getPerpendicular(), t, e),
      halfPlane: this
    };
  }
  isParallelToLine(t, e) {
    return this.normalTowardInterior.getPerpendicular().cross(e) === 0;
  }
  getIntersectionWith(t) {
    const e = this.intersectWithLine(t.base, t.normalTowardInterior.getPerpendicular());
    return it.create(e.point, this, t);
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
class Ri {
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
const gt = new Ri();
class Wi {
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
const O = new Wi();
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
    let l, c;
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
      c = d.expandToIncludePoint(t);
    } else
      c = r.getContainingHalfPlaneThroughPoint(t), c !== r.rightHalfPlane && o.push(r.replaceLeftHalfPlane(c));
    return a.add(l), a.add(c), o.push(new it(t, l, c)), new m([...a], o);
  }
  expandToIncludeInfinityInDirection(t) {
    if (this.containsInfinityInDirection(t))
      return this;
    let e = this.halfPlanes.filter((n) => n.containsInfinityInDirection(t)).concat(this.getTangentPlanesThroughInfinityInDirection(t));
    return e = m.getHalfPlanesNotContainingAnyOther(e), e.length === 0 ? gt : new m(e);
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
      return O;
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
        for (let c = 0; c < t.length; c++) {
          if (c === n || c === i)
            continue;
          if (!t[c].containsPoint(a.point)) {
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
function $(...s) {
  return (...t) => {
    for (const e of s)
      e && e(...t);
  };
}
function ki(s, t) {
  return t ? (e, n) => {
    e.save(), t(e, n), s(e, n), e.restore();
  } : s;
}
function Hi(s) {
  return s === M.Relative ? (t, e) => {
    const { a: n, b: i, c: r, d: o, e: a, f: l } = e.getBitmapTransformationToTransformedInfiniteCanvasContext();
    t.transform(n, i, r, o, a, l);
  } : s === M.Absolute ? (t, e) => {
    const { a: n, b: i, c: r, d: o, e: a, f: l } = e.getBitmapTransformationToInfiniteCanvasContext();
    t.setTransform(n, i, r, o, a, l);
  } : null;
}
function Vi(s, t) {
  let e = s.area;
  return e && t.lineWidth > 0 && (e = e.expandByDistance(t.lineWidth / 2)), e;
}
function Mi(s) {
  return {
    lineWidth: s.current.getMaximumLineWidth(),
    lineDashPeriod: s.current.getLineDashPeriod(),
    shadowOffsets: s.current.getShadowOffsets()
  };
}
function Ni(s) {
  return {
    lineWidth: 0,
    lineDashPeriod: 0,
    shadowOffsets: s.current.getShadowOffsets()
  };
}
class H {
  constructor(t, e, n, i, r, o, a) {
    this.instruction = t, this.area = e, this.build = n, this.takeClippingRegionIntoAccount = i, this.transformationKind = r, this.state = o, this.tempState = a;
  }
  static forStrokingPath(t, e, n) {
    return H.forPath(t, e, Mi, n);
  }
  static forFillingPath(t, e, n) {
    return H.forPath(t, e, Ni, n);
  }
  static forPath(t, e, n, i) {
    const r = e.current.isTransformable(), o = r ? M.None : M.Relative, a = e.currentlyTransformed(r), l = n(a), c = i(a), d = Vi(c, l);
    return new H(
      t,
      d,
      (u) => c.drawPath(u, a, l),
      !0,
      o,
      a
    );
  }
  getDrawnArea() {
    let t = this.area;
    const e = this.state;
    if (e.current.shadowBlur !== 0 || !e.current.shadowOffset.equals(h.origin)) {
      const n = t.expandByDistance(e.current.shadowBlur).transform(p.translation(e.current.shadowOffset.x, e.current.shadowOffset.y));
      t = t.join(n);
    }
    return e.current.clippingRegion && this.takeClippingRegionIntoAccount && (t = t.intersectWith(e.current.clippingRegion)), t;
  }
  getModifiedInstruction() {
    let t = Hi(this.transformationKind);
    if (this.tempState) {
      const n = this.takeClippingRegionIntoAccount ? this.state.getInstructionToConvertToStateWithClippedPath(this.tempState) : this.state.getInstructionToConvertToState(this.tempState);
      t = $(t, n);
    }
    return ki(this.instruction, t);
  }
}
class Oe {
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
class Le {
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
class U extends Le {
  constructor(t, e, n, i) {
    super(t, e), this.instruction = n, this.stateConversion = i;
  }
  execute(t, e) {
    this.stateConversion && this.stateConversion(t, e), this.instruction(t, e);
  }
  static create(t, e) {
    return new U(t, t, e, () => {
    });
  }
}
class ft extends Le {
  constructor(t, e, n, i) {
    super(t, e), this.instruction = n, this.stateConversion = i;
  }
  makeExecutable() {
    return new U(this.initialState, this.state, this.instruction, this.stateConversion);
  }
  static create(t, e) {
    return new ft(t, t, e, () => {
    });
  }
}
function C(s) {
  return s.direction !== void 0;
}
function Q(s, t) {
  return C(s) ? t.applyToPointAtInfinity(s) : t.apply(s);
}
class qi {
  constructor(t, e) {
    this.areaBuilder = t, this.transformation = e;
  }
  addPosition(t) {
    this.areaBuilder.addPosition(Q(t, this.transformation));
  }
}
class Be {
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
class ie extends Be {
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
      return O;
    if (this.isContainedByConvexPolygon(t))
      return this;
    const e = t.getIntersectionsWithLine(this.base, this.direction);
    let n, i;
    for (let r of e)
      (!n && !i || !n && this.comesBefore(r.point, i) || !i && this.comesBefore(n, r.point) || n && i && this.pointIsBetweenPoints(r.point, n, i)) && (r.halfPlane.normalTowardInterior.dot(this.direction) > 0 ? n = r.point : i = r.point);
    return n && i ? new D(n, i) : n ? new V(n, this.direction) : new V(i, this.direction.scale(-1));
  }
  intersectWithLine(t) {
    return this.intersectsLine(t) ? this : O;
  }
  intersectWithLineSegment(t) {
    return this.lineSegmentIsOnSameLine(t) ? t : O;
  }
  intersectWithRay(t) {
    return this.intersectsRay(t) ? t : O;
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
    return new ie(e, t.apply(this.base.plus(this.direction)).minus(e));
  }
  interiorContainsPoint(t) {
    return this.pointIsOnSameLine(t);
  }
}
class V extends Be {
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
      return O;
    if (this.isContainedByConvexPolygon(t))
      return this;
    const e = t.getIntersectionsWithLine(this.base, this.direction);
    let n = this.base, i;
    for (let r of e)
      (!i && this.comesBefore(n, r.point) || i && this.pointIsBetweenPoints(r.point, n, i)) && (r.halfPlane.normalTowardInterior.dot(this.direction) > 0 ? n = r.point : i = r.point);
    return i ? new D(n, i) : new V(n, this.direction);
  }
  intersectWithRay(t) {
    return this.isContainedByRay(t) ? this : t.isContainedByRay(this) ? t : this.interiorContainsPoint(t.base) ? new D(this.base, t.base) : O;
  }
  intersectWithLine(t) {
    return t.intersectWithRay(this);
  }
  intersectWithLineSegment(t) {
    if (t.isContainedByRay(this))
      return t;
    if (!this.lineSegmentIsOnSameLine(t))
      return O;
    let { point2: e } = this.getPointsInSameDirection(t.point1, t.point2);
    return this.comesBefore(e, this.base) ? O : new D(this.base, e);
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
    return this.containsPoint(t) ? this : this.pointIsOnSameLine(t) ? new V(t, this.direction) : m.createTriangleWithInfinityInDirection(this.base, t, this.direction);
  }
  expandByDistance(t) {
    const e = this.expandLineByDistance(t), n = new w(this.base, this.direction).expandByDistance(t);
    return e.intersectWithConvexPolygon(new m([n]));
  }
  expandToIncludeInfinityInDirection(t) {
    return t.inSameDirectionAs(this.direction) ? this : this.direction.cross(t) === 0 ? new ie(this.base, this.direction) : m.createTriangleWithInfinityInTwoDirections(this.base, this.direction, t);
  }
  transform(t) {
    const e = t.apply(this.base);
    return new V(e, t.apply(this.base.plus(this.direction)).minus(e));
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
class D extends Be {
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
      return O;
    let { point1: e, point2: n } = this.getPointsInSameDirection(t.point1, t.point2);
    return this.comesBefore(n, this.point1) || this.comesBefore(this.point2, e) ? O : this.comesBefore(this.point1, e) ? new D(e, this.point2) : new D(this.point1, n);
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
      return O;
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
    return t.inSameDirectionAs(this.direction) ? new V(this.point1, t) : t.cross(this.direction) === 0 ? new V(this.point2, t) : m.createTriangleWithInfinityInDirection(this.point1, this.point2, t);
  }
  transform(t) {
    return new D(t.apply(this.point1), t.apply(this.point2));
  }
}
class zi {
  addPoint(t) {
    return gt;
  }
  addPointAtInfinity(t) {
    return this;
  }
  addArea(t) {
    return gt;
  }
}
const Ae = new zi();
class Ie {
  constructor(t) {
    this.towardsMiddle = t;
  }
  addPoint(t) {
    return m.createFromHalfPlane(new w(t, this.towardsMiddle));
  }
  addPointAtInfinity(t) {
    return t.dot(this.towardsMiddle) >= 0 ? this : Ae;
  }
  addArea(t) {
    const e = this.towardsMiddle.getPerpendicular();
    return t.expandToIncludeInfinityInDirection(this.towardsMiddle).expandToIncludeInfinityInDirection(e).expandToIncludeInfinityInDirection(e.scale(-1));
  }
}
class $t {
  constructor(t, e) {
    this.direction1 = t, this.direction2 = e;
  }
  addPoint(t) {
    return m.createTriangleWithInfinityInTwoDirections(t, this.direction1, this.direction2);
  }
  addPointAtInfinity(t) {
    return t.isInSmallerAngleBetweenPoints(this.direction1, this.direction2) ? this : t.cross(this.direction1) === 0 ? new Ie(this.direction2.projectOn(this.direction1.getPerpendicular())) : t.cross(this.direction2) === 0 ? new Ie(this.direction1.projectOn(this.direction2.getPerpendicular())) : this.direction1.isInSmallerAngleBetweenPoints(t, this.direction2) ? new $t(t, this.direction2) : this.direction2.isInSmallerAngleBetweenPoints(t, this.direction1) ? new $t(t, this.direction1) : Ae;
  }
  addArea(t) {
    return t.expandToIncludeInfinityInDirection(this.direction1).expandToIncludeInfinityInDirection(this.direction2);
  }
}
class Gi {
  constructor(t) {
    this.direction = t;
  }
  addPoint(t) {
    return new ie(t, this.direction);
  }
  addPointAtInfinity(t) {
    return t.cross(this.direction) === 0 ? this : new Ie(t.projectOn(this.direction.getPerpendicular()));
  }
  addArea(t) {
    return t.expandToIncludeInfinityInDirection(this.direction).expandToIncludeInfinityInDirection(this.direction.scale(-1));
  }
}
class Yi {
  constructor(t) {
    this.direction = t;
  }
  addPointAtInfinity(t) {
    return t.inSameDirectionAs(this.direction) ? this : t.cross(this.direction) === 0 ? new Gi(this.direction) : new $t(this.direction, t);
  }
  addPoint(t) {
    return new V(t, this.direction);
  }
  addArea(t) {
    return t.expandToIncludeInfinityInDirection(this.direction);
  }
}
class Xi {
  constructor(t, e, n) {
    this._area = t, this.firstPoint = e, this.subsetOfLineAtInfinity = n;
  }
  get area() {
    return this._area || O;
  }
  addPoint(t) {
    this._area ? this._area = this._area.expandToIncludePoint(t) : this.firstPoint ? t.equals(this.firstPoint) || (this._area = new D(this.firstPoint, t)) : this.subsetOfLineAtInfinity ? this._area = this.subsetOfLineAtInfinity.addPoint(t) : this.firstPoint = t;
  }
  addPosition(t) {
    C(t) ? this.addInfinityInDirection(t.direction) : this.addPoint(t);
  }
  addInfinityInDirection(t) {
    this._area ? this._area = this._area.expandToIncludeInfinityInDirection(t) : this.firstPoint ? this._area = new V(this.firstPoint, t) : this.subsetOfLineAtInfinity ? (this.subsetOfLineAtInfinity = this.subsetOfLineAtInfinity.addPointAtInfinity(t), this.subsetOfLineAtInfinity === Ae && (this._area = gt)) : this.subsetOfLineAtInfinity = new Yi(t);
  }
  transformedWith(t) {
    return new qi(this, t);
  }
}
class Ut extends Le {
  constructor(t, e, n, i) {
    super(t, e), this.instruction = n, this.stateConversion = i;
  }
  replaceInstruction(t) {
    this.instruction = t;
  }
  makeExecutable(t) {
    const e = t.getInfinity(this.state), n = this.instruction, i = (r, o) => n(r, o, e);
    return new U(this.initialState, this.state, i, this.stateConversion);
  }
  static create(t, e) {
    return new Ut(t, t, e, () => {
    });
  }
}
function $i(s, t) {
  return s ? t ? C(s) ? C(t) && s.direction.equals(t.direction) : !C(t) && s.equals(t) : !s : !t;
}
class bt {
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
class se {
  constructor(t, e, n, i) {
    this.initialPosition = t, this.firstFinitePoint = e, this.lastFinitePoint = n, this.currentPosition = i;
  }
  transform(t) {
    return new se(
      t.applyToPointAtInfinity(this.initialPosition),
      t.apply(this.firstFinitePoint),
      t.apply(this.lastFinitePoint),
      t.applyToPointAtInfinity(this.currentPosition)
    );
  }
}
class Ot {
  constructor(t, e, n) {
    this.initialPosition = t, this.firstFinitePoint = e, this.currentPosition = n;
  }
  transform(t) {
    return new Ot(
      t.applyToPointAtInfinity(this.initialPosition),
      t.apply(this.firstFinitePoint),
      t.apply(this.currentPosition)
    );
  }
}
class Ui extends bt {
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
    return C(e) ? this.lineToInfinityFromInfinityFromPoint(t.lastFinitePoint, t.currentPosition.direction, e.direction) : $(
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
    return C(t) ? this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(new se(this.shape.initialPosition, this.shape.firstFinitePoint, this.shape.lastFinitePoint, t)) : this.pathBuilderProvider.fromPointAtInfinityToPoint(new Ot(this.shape.initialPosition, this.shape.firstFinitePoint, t));
  }
}
class Ki extends bt {
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
    return C(t) ? this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(new se(this.shape.initialPosition, this.shape.firstFinitePoint, this.shape.currentPosition, t)) : this.pathBuilderProvider.fromPointAtInfinityToPoint(new Ot(this.shape.initialPosition, this.shape.firstFinitePoint, t));
  }
}
class re {
  constructor(t, e) {
    this.initialPoint = t, this.currentPosition = e;
  }
  transform(t) {
    return new re(
      t.apply(this.initialPoint),
      t.applyToPointAtInfinity(this.currentPosition)
    );
  }
}
class Lt {
  constructor(t, e) {
    this.initialPoint = t, this.currentPosition = e;
  }
  transform(t) {
    return new Lt(
      t.apply(this.initialPoint),
      t.apply(this.currentPosition)
    );
  }
}
class ji extends bt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    return this.moveTo(t.initialPoint);
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    return C(e) ? e.direction.inSameDirectionAs(t.currentPosition.direction) ? () => {
    } : this.lineToInfinityFromInfinityFromPoint(t.initialPoint, t.currentPosition.direction, e.direction) : $(this.lineFromInfinityFromPointToInfinityFromPoint(t.initialPoint, e, t.currentPosition.direction), this.lineFromInfinityFromPointToPoint(e, t.currentPosition.direction));
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
    return C(t) ? this.pathBuilderProvider.fromPointToPointAtInfinity(new re(this.shape.initialPoint, t)) : this.pathBuilderProvider.fromPointToPoint(new Lt(this.shape.initialPoint, t));
  }
}
class tn extends bt {
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
    return C(t) ? this.pathBuilderProvider.fromPointToPointAtInfinity(new re(this.shape.initialPoint, t)) : this.pathBuilderProvider.fromPointToPoint(new Lt(this.shape.initialPoint, t));
  }
}
class oe {
  constructor(t, e, n, i) {
    this.initialPosition = t, this.surroundsFinitePoint = e, this.positionsSoFar = n, this.currentPosition = i;
  }
  transform(t) {
    return new oe(
      t.applyToPointAtInfinity(this.initialPosition),
      this.surroundsFinitePoint,
      this.positionsSoFar.map((e) => t.applyToPointAtInfinity(e)),
      t.applyToPointAtInfinity(this.currentPosition)
    );
  }
}
class en extends bt {
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
    return $($(...r), this.lineFromInfinityFromPointToPoint(e, i.direction));
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
      return this.pathBuilderProvider.atInfinity(new oe(this.shape.initialPosition, n, this.shape.positionsSoFar.concat([t]), t));
    }
    return this.pathBuilderProvider.fromPointAtInfinityToPoint(new Ot(this.shape.initialPosition, t, t));
  }
}
class Qi {
  fromPointAtInfinityToPointAtInfinity(t) {
    return new Ui(this, t);
  }
  fromPointAtInfinityToPoint(t) {
    return new Ki(this, t);
  }
  fromPointToPointAtInfinity(t) {
    return new ji(this, t);
  }
  fromPointToPoint(t) {
    return new tn(this, t);
  }
  atInfinity(t) {
    return new en(this, t);
  }
  getBuilderFromPosition(t) {
    return C(t) ? new en(this, new oe(t, !1, [t], t)) : new tn(this, new Lt(t, t));
  }
}
class De extends Oe {
  constructor(t) {
    super(t), this._initiallyWithState = t;
  }
  execute(t, e) {
    this._initiallyWithState.execute(t, e);
    for (const n of this.added)
      n.execute(t, e);
  }
}
class Ee extends Oe {
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
    const t = ft.create(this.state, (e) => {
      e.closePath();
    });
    this.add(t);
  }
  makeExecutable(t) {
    const e = new De(this._initiallyWithState.makeExecutable(t));
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
    const n = Q(t, e.current.transformation);
    (!C(t) || this.pathInstructionBuilder.containsFinitePoint()) && this.addInstructionToDrawLineTo(t, e), this.pathInstructionBuilder = this.pathInstructionBuilder.addPosition(n);
    const i = this.pathInstructionBuilder.getInstructionToMoveToBeginning(this._initiallyWithState.state);
    this._initiallyWithState.replaceInstruction((r, o, a) => {
      i(r, o, a);
    });
  }
  addInstructionToDrawLineTo(t, e) {
    const n = this.pathInstructionBuilder.getInstructionToDrawLineTo(t, e), i = Ut.create(e, n);
    i.setInitialState(this.state), this.add(i);
  }
  addPathInstruction(t, e, n) {
    t.initialPoint && !$i(this.pathInstructionBuilder.currentPosition, t.initialPoint) && this.lineTo(t.initialPoint, n), t.positionChange && (this.pathInstructionBuilder = this.pathInstructionBuilder.addPosition(Q(t.positionChange, n.current.transformation))), e.setInitialState(this.state), this.add(e);
  }
  static create(t, e) {
    const n = Q(e, t.current.transformation), i = new Qi().getBuilderFromPosition(n), r = i.getInstructionToMoveToBeginning(t), o = Ut.create(t, r);
    return new Ee(o, i);
  }
}
function Ji(s, t, e) {
  let n = 0, i;
  for (let r of s) {
    const o = r.minus(t).dot(e);
    o > n && (i = r, n = o);
  }
  return i ? t.plus(i.minus(t).projectOn(e)) : t;
}
function F(s, t, e) {
  return Ji(s.getVertices(), t, e);
}
class Zi {
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
    const a = this.getTransformedViewbox(e), { a: l, b: c, c: d, d: u, e: g, f: v } = e.userTransformation;
    t.save(), t.transform(l, c, d, u, g, v);
    const P = Number.isFinite(n) ? n : F(a, new h(0, 0), n > 0 ? Xt.direction : Yt.direction).x, T = Number.isFinite(r) ? n + r : F(a, new h(0, 0), r > 0 ? Xt.direction : Yt.direction).x, L = Number.isFinite(i) ? i : F(a, new h(0, 0), i > 0 ? zt.direction : Gt.direction).y, k = Number.isFinite(o) ? i + o : F(a, new h(0, 0), o > 0 ? zt.direction : Gt.direction).y;
    t.clearRect(P, L, T - P, k - L), t.restore();
  }
  moveToInfinityFromPointInDirection(t, e, n, i) {
    const r = F(this.getTransformedViewbox(e), n, i);
    this.moveToTransformed(t, r, e.userTransformation);
  }
  drawLineToInfinityFromInfinityFromPoint(t, e, n, i, r) {
    const o = this.getTransformedViewbox(e), a = F(o, n, i), l = F(o, n, r), c = e.userTransformation, u = o.expandToIncludePoint(n).expandToIncludePoint(a).expandToIncludePoint(l).getVertices().filter((P) => !P.equals(a) && !P.equals(l) && !P.equals(n) && P.minus(n).isInSmallerAngleBetweenPoints(i, r));
    u.sort((P, T) => P.minus(n).isInSmallerAngleBetweenPoints(T.minus(n), i) ? -1 : 1);
    let g = a, v = 0;
    for (let P of u)
      v += P.minus(g).mod(), this.lineToTransformed(t, P, c), g = P;
    v += l.minus(g).mod(), this.lineToTransformed(t, l, c), this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, c, v, l, r);
  }
  drawLineFromInfinityFromPointToInfinityFromPoint(t, e, n, i, r) {
    const o = this.getTransformedViewbox(e), a = F(o, n, r), l = e.userTransformation, c = F(o, i, r);
    this.lineToTransformed(t, c, l);
    const d = c.minus(a).mod();
    this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, l, d, c, r);
  }
  drawLineFromInfinityFromPointToPoint(t, e, n, i) {
    const r = F(this.getTransformedViewbox(e), n, i), o = n.minus(r).mod(), a = e.userTransformation;
    this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, a, o, r, i), this.lineToTransformed(t, n, a);
  }
  drawLineToInfinityFromPointInDirection(t, e, n, i) {
    const r = F(this.getTransformedViewbox(e), n, i), o = e.userTransformation;
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
    return new Zi(t, this.drawnPathProperties);
  }
}
class _i {
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
class Tt extends Oe {
  constructor(t) {
    super(t), this._initiallyWithState = t, this.areaBuilder = new Xi();
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
    const i = U.create(e, t), r = this.makeExecutable(n);
    return i.setInitialState(r.state), r.add(i), r;
  }
  makeExecutable(t) {
    const e = new De(this._initiallyWithState.makeExecutable()), n = new Fe(t);
    for (const i of this.added)
      e.add(i.makeExecutable(n));
    return e;
  }
  getInstructionsToClip() {
    const t = this.makeExecutable({ lineWidth: 0, lineDashPeriod: 0, shadowOffsets: [] });
    return t.setInitialState(t.stateOfFirstInstruction), new _i(t, this.area);
  }
  clipPath(t, e) {
    if (this.added.length === 0)
      return;
    const n = this.added[this.added.length - 1], i = ft.create(e, t);
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
    const n = Q(t, e.current.transformation);
    this.areaBuilder.addPosition(n);
    const i = Ee.create(e, t);
    i.setInitialState(this.state), this.add(i);
  }
  canAddLineTo(t, e) {
    if (this.added.length === 0)
      return !0;
    const n = Q(t, e.current.transformation);
    return this.added[this.added.length - 1].canAddLineTo(n);
  }
  lineTo(t, e) {
    if (this.added.length === 0) {
      this.moveTo(t, e);
      return;
    }
    const n = this.added[this.added.length - 1], i = Q(t, e.current.transformation);
    this.areaBuilder.addPosition(i), n.lineTo(t, e);
  }
  addPathInstruction(t, e) {
    if (this.added.length === 0)
      if (t.initialPoint)
        this.moveTo(t.initialPoint, e);
      else
        return;
    const n = this.added[this.added.length - 1], i = n.currentPosition, r = Q(i, e.current.transformation.inverse());
    t.changeArea(this.areaBuilder.transformedWith(e.current.transformation), r);
    const o = ft.create(e, t.instruction);
    n.addPathInstruction(t, o, e);
  }
  static create(t) {
    return new Tt(ft.create(t, (e) => {
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
    return H.forStrokingPath(e, t, (n) => {
      const i = Tt.create(n);
      return this.addSubpaths(i, n), i;
    });
  }
  fill(t, e) {
    return H.forFillingPath(e, t, (n) => {
      const i = Tt.create(n);
      return this.addSubpaths(i, n), i;
    });
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
class es extends E {
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
class ns extends E {
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
class is extends E {
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
function ss(s) {
  return s.x !== void 0;
}
function nn(s) {
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
function At(s, t) {
  const { x: e, y: n, circular: i } = s;
  return { x: e * t, y: n * t, circular: i };
}
function Re(s, t) {
  const { upperLeft: e, upperRight: n, lowerLeft: i, lowerRight: r } = s;
  return {
    upperLeft: At(e, t),
    upperRight: At(n, t),
    lowerLeft: At(i, t),
    lowerRight: At(r, t)
  };
}
function rs(s) {
  if (typeof s == "number" || ss(s)) {
    const n = nn(s);
    return n ? { upperLeft: n, upperRight: n, lowerLeft: n, lowerRight: n } : void 0;
  }
  const t = [...s], e = t.slice(0, 4).map(nn);
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
class os extends E {
  constructor(t, e, n, i, r) {
    super(n, i, r), this.horizontal = t, this.vertical = e, this.topLeft = n, this.topRightCorner = i, this.bottom = r;
  }
  getRoundRect(t) {
    const e = this.horizontal.getLength(), n = t.upperLeft.x + t.upperRight.x, i = e / n;
    i < 1 && (t = Re(t, i));
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
class as extends E {
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
class cs extends E {
  constructor(t, e, n, i, r) {
    super(n, i, r), this.vertical = t, this.horizontal = e, this.topLeft = n, this.right = i, this.bottomLeftCorner = r;
  }
  getRoundRect(t) {
    const e = this.vertical.getLength(), n = t.upperLeft.y + t.lowerLeft.y, i = e / n;
    i < 1 && (t = Re(t, i));
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
class hs extends E {
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
    i < 1 && (t = Re(t, i));
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
class Kt {
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
class ls {
  constructor() {
    this.area = gt;
  }
  drawPath(t, e, n) {
    const r = new Fe(n).getInfinity(e);
    return U.create(e, (o, a) => {
      o.beginPath(), r.addPathAroundViewbox(o, a), t(o, a);
    });
  }
}
const us = new ls();
function Wn(s, t) {
  throw new Error(`The starting coordinates provided (${s.start} and ${t.start}) do not determine a direction.`);
}
class ds {
  constructor(t, e) {
    this.horizontal = t, this.vertical = e;
  }
  addSubpaths() {
    Wn(this.horizontal, this.vertical);
  }
  getRoundRect() {
    return this;
  }
  getArea() {
    return gt;
  }
  stroke() {
  }
  fill(t, e) {
    return H.forFillingPath(e, t, () => us);
  }
}
class Te {
  constructor(t, e) {
    this.horizontal = t, this.vertical = e;
  }
  addSubpaths() {
    Wn(this.horizontal, this.vertical);
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
class nt {
  static arc(t, e, n, i, r, o) {
    return {
      instruction: (c, d) => {
        const u = d.userTransformation, { x: g, y: v } = u.apply(new h(t, e)), { a: P, b: T, c: L, d: k, e: N, f: _ } = u.untranslated().before(p.translation(g, v));
        c.save(), c.transform(P, T, L, k, N, _), c.arc(0, 0, n, i, r, o), c.restore();
      },
      changeArea: (c) => {
        c.addPosition(new h(t - n, e - n)), c.addPosition(new h(t - n, e + n)), c.addPosition(new h(t + n, e - n)), c.addPosition(new h(t + n, e + n));
      },
      positionChange: new h(t, e).plus(p.rotation(0, 0, r).apply(new h(n, 0))),
      initialPoint: new h(t, e).plus(p.rotation(0, 0, i).apply(new h(n, 0)))
    };
  }
  static arcTo(t, e, n, i, r) {
    const o = new h(t, e), a = new h(n, i);
    return {
      instruction: (d, u) => {
        const g = u.userTransformation, v = g.apply(o), P = g.apply(a);
        d.arcTo(v.x, v.y, P.x, P.y, r * g.scale);
      },
      changeArea: (d) => {
        d.addPosition(o), d.addPosition(a);
      },
      positionChange: new h(n, i)
    };
  }
  static ellipse(t, e, n, i, r, o, a, l) {
    return {
      instruction: (c, d) => {
        const u = d.userTransformation, g = u.apply(new h(t, e)), v = u.getRotationAngle();
        c.ellipse(g.x, g.y, n * u.scale, i * u.scale, r + v, o, a, l);
      },
      changeArea: (c) => {
        c.addPosition(new h(t - n, e - i)), c.addPosition(new h(t - n, e + i)), c.addPosition(new h(t + n, e - i)), c.addPosition(new h(t + n, e + i));
      },
      positionChange: new h(t, e).plus(
        p.rotation(0, 0, a).before(
          new p(n, 0, 0, i, 0, 0)
        ).before(
          p.rotation(0, 0, r)
        ).apply(new h(1, 0))
      ),
      initialPoint: new h(t, e).plus(
        p.rotation(0, 0, o).before(
          new p(n, 0, 0, i, 0, 0)
        ).before(
          p.rotation(0, 0, r)
        ).apply(new h(1, 0))
      )
    };
  }
  static bezierCurveTo(t, e, n, i, r, o) {
    return {
      instruction: (a, l) => {
        const c = l.userTransformation, d = c.apply(new h(t, e)), u = c.apply(new h(n, i)), g = c.apply(new h(r, o));
        a.bezierCurveTo(d.x, d.y, u.x, u.y, g.x, g.y);
      },
      changeArea: (a, l) => {
        C(l) || (a.addPosition(new h((l.x + t) / 2, (l.y + e) / 2)), a.addPosition(new h((t + n) / 2, (e + i) / 2)), a.addPosition(new h((n + r) / 2, (i + o) / 2)), a.addPosition(new h(r, o)));
      },
      positionChange: new h(r, o)
    };
  }
  static quadraticCurveTo(t, e, n, i) {
    return {
      instruction: (r, o) => {
        const a = o.userTransformation, l = a.apply(new h(t, e)), c = a.apply(new h(n, i));
        r.quadraticCurveTo(l.x, l.y, c.x, c.y);
      },
      changeArea: (r, o) => {
        C(o) || (r.addPosition(new h((o.x + t) / 2, (o.y + e) / 2)), r.addPosition(new h((t + n) / 2, (e + i) / 2)), r.addPosition(new h(n, i)));
      },
      positionChange: new h(n, i)
    };
  }
}
var X = /* @__PURE__ */ ((s) => (s[s.TOPLEFT = 0] = "TOPLEFT", s[s.TOPRIGHT = 1] = "TOPRIGHT", s[s.BOTTOMLEFT = 2] = "BOTTOMLEFT", s[s.BOTTOMRIGHT = 3] = "BOTTOMRIGHT", s))(X || {});
function fs(s) {
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
function gs(s) {
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
class kn {
  constructor(t, e, n, i, r) {
    this.corner = e, n = ps(n, i, r);
    const o = r === i;
    let { center: a, start: l, end: c } = vs(n, e, t);
    o || ({ start: l, end: c } = { start: c, end: l }), this.radii = t, this.clockwise = o, this.center = a, this.start = l, this.end = c;
  }
  draw(t, e) {
    t.lineTo(this.start.point, e), this.radii.circular ? t.addPathInstruction(nt.arc(
      this.center.x,
      this.center.y,
      this.radii.x,
      this.start.angle,
      this.end.angle,
      !this.clockwise
    ), e) : t.addPathInstruction(nt.ellipse(
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
class ms extends kn {
  moveToEndingPoint(t, e) {
    t.moveTo(this.end.point, e);
  }
  finishRect(t, e) {
    this.draw(t, e), t.moveTo(this.corner, e);
  }
}
function ps(s, t, e) {
  return t === I.Negative && (s = gs(s)), e === I.Negative && (s = fs(s)), s;
}
function vs(s, t, e) {
  switch (s) {
    case X.TOPLEFT:
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
    case X.TOPRIGHT:
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
    case X.BOTTOMRIGHT:
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
    case X.BOTTOMLEFT:
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
    return t.x === 0 || t.y === 0 ? this : new kn(
      t,
      this.corner,
      this.cornerOrientation,
      this.horizontalOrientation,
      this.verticalOrientation
    );
  }
}
class ws {
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
    return t.x === 0 || t.y === 0 ? this : new ms(
      t,
      this.corner,
      this.cornerOrientation,
      this.horizontalOrientation,
      this.verticalOrientation
    );
  }
}
class We {
  constructor(t, e) {
    this.point = t, this.direction = e;
  }
  draw(t, e) {
    t.lineTo(this.point, e), t.lineTo(this.direction, e);
  }
}
class Ps {
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
class Cs {
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
class ke {
  constructor(t, e) {
    this.start = t, this.orientation = e, this.horizontalLineStart = e === I.Positive ? Yt : Xt, this.horizontalLineEnd = e === I.Positive ? Xt : Yt, this.verticalLineStart = e === I.Positive ? Gt : zt, this.verticalLineEnd = e === I.Positive ? zt : Gt;
  }
  createTopLeftAtVerticalInfinity(t) {
    return new Ps(new h(t.finiteStart, 0), this.verticalLineStart);
  }
  createBottomRightAtInfinity(t) {
    return new We(new h(t.end, 0), this.verticalLineEnd);
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
    return new ds(t, this);
  }
  addHorizontalDimensionAtInfinity(t) {
    return new Te(t, this);
  }
  addHorizontalDimensionWithStart(t) {
    const e = this.createTopLeftAtVerticalInfinity(t), n = this.createRightAtInfinity(t), i = this.createBottomAtInfinity();
    return new ts(t, e, n, i);
  }
  addHorizontalDimensionWithStartAndEnd(t) {
    const e = this.createTopLeftAtVerticalInfinity(t), n = this.createBottomRightAtInfinity(t);
    return new is(t, e, n);
  }
}
class Dt extends ke {
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
    return new Kt(this.verticalLineEnd);
  }
  addHorizontalDimensionWithStartAndEnd() {
    return new Kt(this.verticalLineEnd);
  }
}
class Hn extends ke {
  constructor(t, e) {
    super(e, t), this.finiteStart = e;
  }
  createBottomLeftAtInfinity(t) {
    return new ye(t.horizontalLineStart);
  }
  createLeftAtInfinity(t) {
    return new Cs(t.horizontalLineStart);
  }
  createTopRightAtHorizontalInfinity(t) {
    return new We(new h(0, this.finiteStart), t.horizontalLineEnd);
  }
  createTopLeft(t) {
    return new ws(
      new h(t.finiteStart, this.finiteStart),
      X.TOPLEFT,
      t.orientation,
      this.orientation
    );
  }
  createTopRight(t) {
    return new Se(
      new h(t.end, this.finiteStart),
      X.TOPRIGHT,
      t.orientation,
      this.orientation
    );
  }
  getStartingHalfPlaneWithHorizontalCrossSection() {
    const t = this.orientation === I.Positive ? new h(1, 0) : new h(-1, 0), e = new h(this.finiteStart, 0);
    return new w(e, t);
  }
  getStartingHalfPlaneWithVerticalCrossSection() {
    const t = this.orientation === I.Positive ? new h(0, 1) : new h(0, -1), e = new h(0, this.finiteStart);
    return new w(e, t);
  }
  addVerticalDimension(t) {
    return t.addHorizontalDimensionWithStart(this);
  }
  addEntireHorizontalDimension(t) {
    const e = this.createLeftAtInfinity(t), n = this.createTopRightAtHorizontalInfinity(t), i = this.createBottomAtInfinity(), r = this.createBottomLeftAtInfinity(t);
    return new es(this, e, n, i, r);
  }
  addHorizontalDimensionAtInfinity(t) {
    return new Kt(t.horizontalLineEnd);
  }
  addHorizontalDimensionWithStart(t) {
    const e = this.createRightAtInfinity(t), n = this.createBottomAtInfinity(), i = this.createTopLeft(t);
    return new ns(t, this, i, e, n);
  }
  addHorizontalDimensionWithStartAndEnd(t) {
    const e = this.createBottomAtInfinity(), n = this.createTopLeft(t), i = this.createTopRight(t);
    return new os(t, this, n, i, e);
  }
  getHalfPlanesWithHorizontalCrossSection() {
    return [this.getStartingHalfPlaneWithHorizontalCrossSection()];
  }
  getHalfPlanesWithVerticalCrossSection() {
    return [this.getStartingHalfPlaneWithVerticalCrossSection()];
  }
}
class Vn extends Hn {
  constructor(t, e, n) {
    super(t, e), this.end = n;
  }
  createBottomLeftAtHorizontalInfinity(t) {
    return new We(new h(0, this.end), t.horizontalLineStart);
  }
  getEndingHalfPlaneWithHorizontalCrossSection() {
    const t = this.orientation === I.Positive ? new h(-1, 0) : new h(1, 0), e = new h(this.end, 0);
    return new w(e, t);
  }
  getEndingHalfPlaneWithVerticalCrossSection() {
    const t = this.orientation === I.Positive ? new h(0, -1) : new h(0, 1), e = new h(0, this.end);
    return new w(e, t);
  }
  createBottomLeft(t) {
    return new Se(
      new h(t.finiteStart, this.end),
      X.BOTTOMLEFT,
      t.orientation,
      this.orientation
    );
  }
  createBottomRight(t) {
    return new Se(
      new h(t.end, this.end),
      X.BOTTOMRIGHT,
      t.orientation,
      this.orientation
    );
  }
  getLength() {
    return Math.abs(this.end - this.finiteStart);
  }
  addEntireHorizontalDimension(t) {
    const e = this.createLeftAtInfinity(t), n = this.createTopRightAtHorizontalInfinity(t), i = this.createBottomLeftAtHorizontalInfinity(t);
    return new as(this, e, n, i);
  }
  addHorizontalDimensionAtInfinity(t) {
    return new Kt(t.horizontalLineEnd);
  }
  addVerticalDimension(t) {
    return t.addHorizontalDimensionWithStartAndEnd(this);
  }
  addHorizontalDimensionWithStart(t) {
    const e = this.createRightAtInfinity(t), n = this.createTopLeft(t), i = this.createBottomLeft(t);
    return new cs(this, t, n, e, i);
  }
  addHorizontalDimensionWithStartAndEnd(t) {
    const e = this.createTopLeft(t), n = this.createTopRight(t), i = this.createBottomLeft(t), r = this.createBottomRight(t);
    return new hs(
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
function sn(s, t) {
  const e = t > 0 ? I.Positive : I.Negative;
  return new Vn(e, s, s + t);
}
function rn(s, t) {
  const e = t > 0 ? I.Positive : I.Negative, n = new ke(s, e);
  return Number.isFinite(s) ? Number.isFinite(t) ? new Vn(e, s, s + t) : new Hn(e, s) : Number.isFinite(t) ? s < 0 ? new Dt(s, I.Negative) : new Dt(s, I.Positive) : s > 0 ? e === I.Positive ? new Dt(s, I.Positive) : n : e === I.Positive ? n : new Dt(s, I.Negative);
}
function J(s, t, e, n) {
  const i = rn(s, e), r = rn(t, n);
  return i.addVerticalDimension(r);
}
function on(s, t, e, n) {
  const i = sn(s, e);
  return sn(t, n).addHorizontalDimensionWithStartAndEnd(i);
}
class Is {
  constructor(t) {
    this.viewBox = t;
  }
  fillText(t, e, n, i) {
    let r = i === void 0 ? (o) => {
      o.fillText(t, e, n);
    } : (o) => {
      o.fillText(t, e, n, i);
    };
    this.viewBox.addDrawing(r, this.getDrawnRectangle(e, n, t), M.Relative, !0);
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
    this.viewBox.addDrawing(r, this.getDrawnRectangle(e, n, t), M.Relative, !0);
  }
  getDrawnRectangle(t, e, n) {
    const i = this.viewBox.measureText(n);
    let r;
    i.actualBoundingBoxRight !== void 0 ? r = Math.abs(i.actualBoundingBoxRight - i.actualBoundingBoxLeft) : r = i.width;
    const o = i.actualBoundingBoxAscent !== void 0 ? i.actualBoundingBoxAscent + i.actualBoundingBoxDescent : 1, a = i.actualBoundingBoxAscent !== void 0 ? i.actualBoundingBoxAscent : 0;
    return J(t, e - a, r, o).getArea();
  }
}
function Ts(s) {
  return typeof s.duration < "u";
}
function Ss(s) {
  return Ts(s) ? {
    width: s.displayWidth,
    height: s.displayHeight
  } : {
    width: s.width,
    height: s.height
  };
}
class ys {
  constructor(t) {
    this.viewBox = t;
  }
  drawImage() {
    const t = Array.prototype.slice.apply(arguments);
    let e, n, i, r, o, a, l, c, d;
    arguments.length <= 5 ? [e, a, l, c, d] = t : [e, n, i, r, o, a, l, c, d] = t;
    const { width: u, height: g } = Ss(e), v = this.getDrawnLength(u, n, r, c), P = this.getDrawnLength(g, i, o, d), T = J(a, l, v, P).getArea(), L = this.getDrawImageInstruction(arguments.length, e, n, i, r, o, a, l, c, d);
    this.viewBox.addDrawing(L, T, M.Relative, !0);
  }
  getDrawImageInstruction(t, e, n, i, r, o, a, l, c, d) {
    switch (t) {
      case 3:
        return (u) => {
          u.drawImage(e, a, l);
        };
      case 5:
        return (u) => {
          u.drawImage(e, a, l, c, d);
        };
      case 9:
        return (u) => {
          u.drawImage(e, n, i, r, o, a, l, c, d);
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
function xs(s, t, e, n, i) {
  t = t === void 0 ? 0 : t, e = e === void 0 ? 0 : e, n = n === void 0 ? s.width : n, i = i === void 0 ? s.height : i;
  const r = s.data, o = new Uint8ClampedArray(4 * n * i);
  for (let a = 0; a < i; a++)
    for (let l = 0; l < n; l++) {
      const c = 4 * ((e + a) * s.width + t + l), d = 4 * (a * n + l);
      o[d] = r[c], o[d + 1] = r[c + 1], o[d + 2] = r[c + 2], o[d + 3] = r[c + 3];
    }
  return new ImageData(o, n, i);
}
class jt {
  constructor(t, e, n) {
    this.area = t, this.latestClippedPath = e, this.previouslyClippedPaths = n;
  }
  withClippedPath(t) {
    const e = t.area.intersectWith(this.area);
    return new jt(e, t, this);
  }
  get initialState() {
    return this.previouslyClippedPaths ? this.previouslyClippedPaths.initialState : this.latestClippedPath.initialState;
  }
  except(t) {
    if (t !== this)
      return this.previouslyClippedPaths ? new jt(this.area, this.latestClippedPath, this.previouslyClippedPaths.except(t)) : this;
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
class bs extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.direction = t;
    };
  }
}
const He = new bs("direction", y);
class Os extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.font = t;
    };
  }
}
const Ve = new Os("font", y);
class Mn {
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
class Nn extends Mn {
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
const qn = new Nn("lineWidth"), zn = new Nn("lineDashOffset");
class Ls extends Mn {
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
const Gn = new Ls("lineDash");
class Bs extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.textAlign = t;
    };
  }
}
const Me = new Bs("textAlign", y);
class As extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.textBaseline = t;
    };
  }
}
const Ne = new As("textBaseline", y);
class Ds extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.lineCap = t;
  }
}
const Yn = new Ds("lineCap", y);
class Es extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.lineJoin = t;
  }
}
const Xn = new Es("lineJoin", y);
class Fs extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.miterLimit = t;
  }
}
const $n = new Fs("miterLimit", y), fe = [
  He,
  wn,
  Pn,
  Tn,
  zn,
  Gn,
  Yn,
  Xn,
  $n,
  pn,
  vn,
  Rn,
  qn,
  Sn,
  Me,
  Ne,
  Mt,
  Ve,
  Pe,
  xn,
  yn
], Rs = [
  Ve,
  Me,
  Ne,
  He
], Qt = class Un {
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
      miterLimit: c,
      globalAlpha: d,
      globalCompositeOperation: u,
      filter: g,
      strokeStyle: v,
      lineDashOffset: P,
      transformation: T,
      direction: L,
      imageSmoothingEnabled: k,
      imageSmoothingQuality: N,
      font: _,
      textAlign: vt,
      textBaseline: wt,
      clippedPaths: Pt,
      fillAndStrokeStylesTransformed: ce,
      shadowOffset: he,
      shadowColor: le,
      shadowBlur: ue
    } = this, Ct = {
      fillStyle: n,
      fontKerning: i,
      lineWidth: r,
      lineDash: o,
      lineCap: a,
      lineJoin: l,
      miterLimit: c,
      globalAlpha: d,
      globalCompositeOperation: u,
      filter: g,
      strokeStyle: v,
      lineDashOffset: P,
      transformation: T,
      direction: L,
      imageSmoothingEnabled: k,
      imageSmoothingQuality: N,
      font: _,
      textAlign: vt,
      textBaseline: wt,
      clippedPaths: Pt,
      fillAndStrokeStylesTransformed: ce,
      shadowOffset: he,
      shadowColor: le,
      shadowBlur: ue
    };
    return Ct[t] = e, new Un(Ct);
  }
  get clippingRegion() {
    return this.clippedPaths ? this.clippedPaths.area : void 0;
  }
  equals(t) {
    for (let e of fe)
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
    for (let t of fe)
      if (!t.valueIsTransformableForInstance(this))
        return !1;
    return !0;
  }
  getShadowOffsets() {
    const t = [], e = this.filter.getShadowOffset();
    return e !== null && t.push(e), this.shadowOffset.equals(h.origin) || t.push(this.shadowOffset), t;
  }
  getInstructionToConvertToState(t) {
    return this.getInstructionToConvertToStateOnDimensions(t, fe);
  }
  withClippedPath(t) {
    const e = this.clippedPaths ? this.clippedPaths.withClippedPath(t) : new jt(t.area, t);
    return this.changeProperty("clippedPaths", e);
  }
  getInstructionToConvertToStateOnDimensions(t, e) {
    const n = e.map((i) => i.getInstructionToChange(this, t));
    return $(...n);
  }
};
Qt.default = new Qt({
  fillStyle: "#000",
  fontKerning: "auto",
  lineWidth: 1,
  lineDash: [],
  lineCap: "butt",
  lineJoin: "miter",
  miterLimit: 10,
  globalAlpha: 1,
  globalCompositeOperation: "source-over",
  filter: Fn.none,
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
  shadowOffset: h.origin,
  shadowColor: "rgba(0, 0, 0, 0)",
  shadowBlur: 0
});
Qt.setDefault = () => {
};
let G = Qt;
class Ws {
  constructor(t) {
    this.viewBox = t;
  }
  createImageData(t, e) {
  }
  getImageData(t, e, n, i) {
  }
  putImageData(t, e, n, i, r, o, a) {
    t = xs(t, i, r, o, a);
    let l, c = this.viewBox.getDrawingLock();
    this.viewBox.createPatternFromImageData(t).then((u) => {
      l = u, c.release();
    }), this.viewBox.addDrawing((u) => {
      u.translate(e, n), u.fillStyle = l, u.fillRect(0, 0, t.width, t.height);
    }, J(e, n, t.width, t.height).getArea(), M.Absolute, !1, (u) => u.changeProperty("shadowColor", G.default.shadowColor).changeProperty("shadowOffset", G.default.shadowOffset).changeProperty("shadowBlur", G.default.shadowBlur).changeProperty("globalAlpha", G.default.globalAlpha).changeProperty("globalCompositeOperation", G.default.globalCompositeOperation).changeProperty("imageSmoothingEnabled", !1).changeProperty("filter", G.default.filter));
  }
}
class ks {
  constructor(t) {
    this.viewBox = t;
  }
  get lineCap() {
    return this.viewBox.state.current.lineCap;
  }
  set lineCap(t) {
    this.viewBox.changeState((e) => Yn.changeInstanceValue(e, t));
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
    this.viewBox.changeState((e) => Xn.changeInstanceValue(e, t));
  }
  get lineWidth() {
    return this.viewBox.state.current.lineWidth;
  }
  set lineWidth(t) {
    this.viewBox.changeState((e) => qn.changeInstanceValue(e, t));
  }
  get miterLimit() {
    return this.viewBox.state.current.miterLimit;
  }
  set miterLimit(t) {
    this.viewBox.changeState((e) => $n.changeInstanceValue(e, t));
  }
  getLineDash() {
    return this.viewBox.state.current.lineDash;
  }
  setLineDash(t) {
    t.length % 2 === 1 && (t = t.concat(t)), this.viewBox.changeState((e) => Gn.changeInstanceValue(e, t));
  }
}
class Hs extends S {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.fontKerning = t;
  }
}
const Vs = new Hs("fontKerning", y);
class Ms {
  constructor(t) {
    this.viewBox = t;
  }
  set direction(t) {
    this.viewBox.changeState((e) => He.changeInstanceValue(e, t));
  }
  set font(t) {
    this.viewBox.changeState((e) => Ve.changeInstanceValue(e, t));
  }
  set textAlign(t) {
    this.viewBox.changeState((e) => Me.changeInstanceValue(e, t));
  }
  set textBaseline(t) {
    this.viewBox.changeState((e) => Ne.changeInstanceValue(e, t));
  }
  set fontKerning(t) {
    this.viewBox.changeState((e) => Vs.changeInstanceValue(e, t));
  }
}
class Ns {
  constructor(t) {
    this.viewBox = t;
  }
  arc(t, e, n, i, r, o) {
    this.viewBox.addPathInstruction(nt.arc(t, e, n, i, r, o));
  }
  arcTo(t, e, n, i, r) {
    this.viewBox.addPathInstruction(nt.arcTo(t, e, n, i, r));
  }
  closePath() {
    this.viewBox.closePath();
  }
  ellipse(t, e, n, i, r, o, a, l) {
    this.viewBox.addPathInstruction(nt.ellipse(t, e, n, i, r, o, a, l));
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
    this.viewBox.addPathInstruction(nt.quadraticCurveTo(t, e, n, i));
  }
  bezierCurveTo(t, e, n, i, r, o) {
    this.viewBox.addPathInstruction(nt.bezierCurveTo(t, e, n, i, r, o));
  }
  rect(t, e, n, i) {
    this.viewBox.rect(t, e, n, i);
  }
  roundRect(t, e, n, i, r) {
    this.viewBox.roundRect(t, e, n, i, r);
  }
}
class qs {
  constructor(t, e, n) {
    this.canvas = t, this.canvasState = new gi(e), this.canvasTransform = new pi(e), this.canvasCompositing = new Pi(e), this.canvasImageSmoothing = new Ti(e), this.canvasStrokeStyles = new Si(e), this.canvasShadowStyles = new Oi(e), this.canvasFilters = new Bi(e, n), this.canvasRect = new Ai(e), this.canvasDrawPath = new Di(e), this.canvasUserInterface = new Ei(), this.canvasText = new Is(e), this.canvasDrawImage = new ys(e), this.canvasImageData = new Ws(e), this.canvasPathDrawingStyles = new ks(e), this.canvasTextDrawingStyles = new Ms(e), this.canvasPath = new Ns(e);
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
class qe extends qt {
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
class zs extends qe {
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
class Gs extends qe {
  constructor(t, e, n, i, r, o, a) {
    super(), this.context = t, this.x0 = e, this.y0 = n, this.r0 = i, this.x1 = r, this.y1 = o, this.r1 = a;
  }
  createTransformedGradient(t) {
    const { x: e, y: n } = t.apply(new h(this.x0, this.y0)), { x: i, y: r } = t.apply(new h(this.x1, this.y1)), o = this.r0 * t.scale, a = this.r1 * t.scale, l = this.context.createRadialGradient(e, n, o, i, r, a);
    return this.addColorStopsToGradient(l), l;
  }
  createGradient() {
    const t = this.context.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1);
    return this.addColorStopsToGradient(t), t;
  }
}
class Kn {
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
class ze extends Kn {
  changeCurrentInstanceTo(t) {
    if (!this.currentState.current.equals(t)) {
      if (!ze.canConvert(this.currentState.current, t))
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
class j {
  constructor(t, e = []) {
    this.current = t, this.stack = e;
  }
  replaceCurrent(t) {
    return new j(t, this.stack);
  }
  withCurrentState(t) {
    return new j(t, this.stack);
  }
  currentlyTransformed(t) {
    return this.withCurrentState(this.current.changeProperty("fillAndStrokeStylesTransformed", t));
  }
  withClippedPath(t) {
    return new j(this.current.withClippedPath(t), this.stack);
  }
  saved() {
    return new j(this.current, (this.stack || []).concat([this.current]));
  }
  restored() {
    if (!this.stack || this.stack.length === 0)
      return this;
    const t = this.stack[this.stack.length - 1];
    return new j(t, this.stack.slice(0, this.stack.length - 1));
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
    const n = j.findIndexOfHighestCommon(this.stack, e.stack);
    return this.convertToLastSavedInstance(t, n), e.convertFromLastSavedInstance(t, n), t.instruction;
  }
  getInstructionToConvertToState(t) {
    return this.getInstructionToConvertToStateUsingConversion(new Kn(this), t);
  }
  getInstructionToConvertToStateWithClippedPath(t) {
    return this.getInstructionToConvertToStateUsingConversion(new ze(this), t);
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
const an = new j(G.default, []);
class Ys {
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
class Ge extends U {
  constructor(t, e, n, i, r) {
    super(t, e, n, i), this.drawingArea = new Ys(r);
  }
  static createClearRect(t, e, n, i, r, o, a) {
    return new Ge(t, t, (l, c) => {
      n.clearRect(l, c, i, r, o, a);
    }, () => {
    }, e);
  }
}
class Jt extends De {
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
    const l = new Fe({ lineWidth: 0, lineDashPeriod: 0, shadowOffsets: [] }).getInfinity(e), c = Ge.createClearRect(e, t, l, n, i, r, o);
    c.setInitialState(this.state), this.add(c);
  }
  clearContentsInsideArea(t) {
    this.removeAll((e) => e.drawingArea.isContainedBy(t));
  }
  static create() {
    return new Jt(new U(an, an, G.setDefault, () => {
    }));
  }
}
class Xs {
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
class $s {
  constructor(t, e) {
    this.instructions = t, this.drawingArea = new Xs(e);
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
function Us(s, t, e, n) {
  if (e === void 0) {
    t.addSubpaths(s, n);
    return;
  }
  let i = rs(e);
  if (!i)
    return;
  t.getRoundRect(i).addSubpaths(s, n);
}
class Ks {
  constructor(t) {
    this.onChange = t, this.previousInstructionsWithPath = Jt.create(), this.state = this.previousInstructionsWithPath.state;
  }
  beginPath() {
    const t = Tt.create(this.state);
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
    this.previousInstructionsWithPath = Jt.create(), this.state = this.previousInstructionsWithPath.state, this.currentInstructionsWithPath = void 0, this.onChange();
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
    const e = H.forFillingPath(t, this.state, () => this.currentInstructionsWithPath);
    this.state = e.state, this.incorporateDrawingInstruction(e);
  }
  strokePath() {
    if (!this.currentInstructionsWithPath)
      return;
    const t = H.forStrokingPath((e) => {
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
    n === M.Relative && (e = e.transform(this.state.current.transformation));
    let a;
    r && (a = o.withCurrentState(r(o.current))), this.incorporateDrawingInstruction(new H(
      t,
      e,
      (l) => U.create(o, l),
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
    if (e === O)
      return;
    const n = t.getModifiedInstruction();
    this.addToPreviousInstructions(n, e, t.build), this.currentInstructionsWithPath || (this.state = this.previousInstructionsWithPath.state), this.onChange();
  }
  addToPreviousInstructions(t, e, n) {
    const i = new $s(n(t), e);
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
    this.currentInstructionsWithPath && Us(this.currentInstructionsWithPath, t, e, this.state);
  }
  intersects(t) {
    return this.previousInstructionsWithPath.intersects(t);
  }
  clearContentsInsideArea(t) {
    this.previousInstructionsWithPath.clearContentsInsideArea(t), this.currentInstructionsWithPath && this.currentInstructionsWithPath.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
  }
  clearArea(t, e, n, i) {
    const o = J(t, e, n, i).getArea();
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
class js extends qe {
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
class Qs {
  constructor(t, e, n, i, r) {
    this.rectangleManager = t, this.context = e, this.drawingIterationProvider = n, this.drawLockProvider = i, this.isTransforming = r, this.instructionSet = new Ks(() => this.draw());
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
    this.context.save(), G.default.getInstructionToConvertToStateOnDimensions(this.state.currentlyTransformed(!1).current, Rs)(this.context);
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
    const r = J(t, e, n, i);
    this.instructionSet.rect(r);
  }
  roundRect(t, e, n, i, r) {
    const o = J(t, e, n, i);
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
    const o = J(t, e, n, i);
    this.instructionSet.fillRect(o, r);
  }
  strokeRect(t, e, n, i) {
    const r = J(t, e, n, i);
    this.instructionSet.strokeRect(r);
  }
  clipPath(t) {
    this.instructionSet.clipPath(t);
  }
  clearArea(t, e, n, i) {
    this.instructionSet.clearArea(t, e, n, i);
  }
  createLinearGradient(t, e, n, i) {
    return new zs(this.context, t, e, n, i);
  }
  createRadialGradient(t, e, n, i, r, o) {
    return new Gs(this.context, t, e, n, i, r, o);
  }
  createConicGradient(t, e, n) {
    return new js(this.context, t, e, n);
  }
  createPattern(t, e) {
    let n;
    return n = new Cn(this.context.createPattern(t, e)), n;
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
class Js {
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
class Zs {
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
class _s {
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
class jn {
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
class tr extends jn {
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
class er extends jn {
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
class Bt {
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
class Z extends Bt {
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
class nr {
  constructor(t, e) {
    this.setNewValue = t, this.timeoutInMs = e, this._changing = !1, this._firstChange = new Z(), this._subsequentChange = new Z(), this._changeEnd = new Z();
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
class ir {
  constructor(t, e) {
    this.viewBox = t, this.config = e, this._transformationChangeMonitor = new nr((n) => this.viewBox.transformation = n, 100);
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
    return new _s(t, this);
  }
  getGestureForTwoAnchors(t, e) {
    return this.config.rotationEnabled ? new er(t, e, this) : new tr(t, e, this);
  }
  releaseAnchor(t) {
    this.gesture && (this.gesture = this.gesture.withoutAnchor(t));
  }
  zoom(t, e, n) {
    this._zoom && this._zoom.cancel(), this._zoom = new Zs(this, t, e, n, () => {
      this._zoom = void 0;
    });
  }
  addRotationAnchor(t) {
    this.gesture = new Js(t, this);
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
class sr {
  constructor() {
    this.animationFrameRequested = !1;
  }
  provideDrawingIteration(t) {
    this.animationFrameRequested || (this.animationFrameRequested = !0, requestAnimationFrame(() => {
      t(), this.animationFrameRequested = !1;
    }));
  }
}
class rr {
  constructor(t) {
    this.drawingIterationProvider = t, this._drawHappened = new Z();
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
class or {
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
var x = /* @__PURE__ */ ((s) => (s[s.CSS = 0] = "CSS", s[s.CANVAS = 1] = "CANVAS", s))(x || {});
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
class St {
  constructor(t, e, n) {
    this.userCoordinates = t, this.canvasBitmap = e, this.virtualBitmapBase = n, this.setDerivedProperties();
  }
  withCanvasBitmapDistortion(t) {
    const e = this.canvasBitmap.representBase(t), n = this.userCoordinates.representSimilarTransformation(e), i = this.virtualBitmapBase.before(n), r = new A(t);
    return new St(this.userCoordinates, r, i);
  }
  withUserTransformation(t) {
    return new St(new A(t), this.canvasBitmap, this.virtualBitmapBase);
  }
  setDerivedProperties() {
    this.infiniteCanvasContext = new A(this.virtualBitmapBase.before(this.userCoordinates.base)), this.userCoordinatesInsideCanvasBitmap = new A(this.userCoordinates.base.before(this.canvasBitmap.base)), this.initialBitmapTransformation = this.canvasBitmap.representBase(this.userCoordinates.getSimilarTransformation(this.virtualBitmapBase)), this.icContextFromCanvasBitmap = new A(this.infiniteCanvasContext.base.before(this.canvasBitmap.inverseBase));
  }
}
class yt {
  constructor(t, e) {
    this.userCoordinates = t, this.canvasBitmap = e, this.setDerivedProperties();
  }
  get infiniteCanvasContext() {
    return this.userCoordinates;
  }
  withUserTransformation(t) {
    return new yt(new A(t), this.canvasBitmap);
  }
  withCanvasBitmapDistortion(t) {
    return new yt(this.userCoordinates, new A(t));
  }
  setDerivedProperties() {
    this.userCoordinatesInsideCanvasBitmap = new A(this.userCoordinates.base.before(this.canvasBitmap.base)), this.initialBitmapTransformation = this.canvasBitmap.inverseBase, this.icContextFromCanvasBitmap = new A(this.userCoordinates.base.before(this.canvasBitmap.inverseBase));
  }
}
function cn(s) {
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
    const e = cn(t), n = this.coordinates.withCanvasBitmapDistortion(e);
    return new lt(this.units, n);
  }
  withUnits(t) {
    if (t === this.units)
      return this;
    let e;
    return t === x.CANVAS ? e = new St(this.coordinates.userCoordinates, this.coordinates.canvasBitmap, this.coordinates.canvasBitmap.base) : e = new yt(this.coordinates.userCoordinates, this.coordinates.canvasBitmap), new lt(t, e);
  }
  static create(t, e) {
    const n = cn(e), i = t === x.CANVAS ? new St(new A(p.identity), new A(n), n) : new yt(new A(p.identity), new A(n));
    return new lt(t, i);
  }
}
function ar(s, t) {
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
    if (ar(this.measurement, t))
      return this;
    const { viewboxWidth: n, viewboxHeight: i } = t, r = on(0, 0, n, i).getArea(), o = this.coordinates.withCanvasMeasurement(t);
    return new ut(o, t, r);
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
  addPathAroundViewbox(t, e) {
    const n = this.viewboxWidth + 2 * e, i = this.viewboxHeight + 2 * e;
    t.save(), t.setTransform(1, 0, 0, 1, 0, 0), t.rect(-e, -e, n, i), t.restore();
  }
  static create(t, e) {
    const { viewboxWidth: n, viewboxHeight: i } = t, r = on(0, 0, n, i).getArea(), o = lt.create(e, t);
    return new ut(o, t, r);
  }
}
class cr {
  constructor(t, e) {
    this.measurementProvider = t, this.config = e, this.transformation = p.identity;
  }
  setTransformation(t) {
    this.rectangle ? this.rectangle = this.rectangle.withTransformation(t) : this.transformation = t;
  }
  measure() {
    const t = this.config.units === x.CSS ? x.CSS : x.CANVAS, e = this.measurementProvider.measure();
    e.screenWidth === 0 || e.screenHeight === 0 ? this.rectangle = void 0 : this.rectangle ? this.rectangle = this.rectangle.withUnits(t).withMeasurement(e) : this.rectangle = ut.create(e, t).withTransformation(this.transformation);
  }
}
class hr {
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
function mt(s) {
  const { a: t, b: e, c: n, d: i, e: r, f: o } = s;
  return { a: t, b: e, c: n, d: i, e: r, f: o };
}
const lr = {
  transformationstart: null,
  transformationchange: null,
  transformationend: null
}, Qn = {
  auxclick: null,
  click: null,
  contextmenu: null,
  dblclick: null,
  mouseenter: null,
  mouseleave: null,
  mouseout: null,
  mouseover: null,
  mouseup: null
}, Jn = {
  gotpointercapture: null,
  lostpointercapture: null,
  pointerenter: null,
  pointerout: null,
  pointerover: null
}, Zn = {
  drag: null,
  dragend: null,
  dragenter: null,
  dragleave: null,
  dragover: null,
  dragstart: null,
  drop: null
}, _n = {
  touchcancel: null,
  touchend: null
}, ur = {
  ...Qn,
  ...Jn,
  ...Zn,
  ..._n
}, ti = {
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
function Et(s) {
  return lr.hasOwnProperty(s);
}
function Ft(s) {
  return ur.hasOwnProperty(s) || ti.hasOwnProperty(s);
}
function Rt(s) {
  return ti.hasOwnProperty(s);
}
function Wt(s) {
  return Qn.hasOwnProperty(s);
}
function kt(s) {
  return Jn.hasOwnProperty(s);
}
function Ht(s) {
  return Zn.hasOwnProperty(s);
}
function Vt(s) {
  return _n.hasOwnProperty(s);
}
class dr extends Bt {
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
class fr extends Bt {
  constructor(t, e) {
    super(), this.transform = e, this.old = new dr(t);
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
function st(s, t) {
  return new fr(s, t);
}
function Y(s, t) {
  return st(s, (e) => (n) => {
    e(t(n));
  });
}
function Zt(s) {
  return !!s && typeof s.handleEvent == "function";
}
class gr extends Bt {
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
class mr {
  constructor(t) {
    this.source = t, this.listenerObjectCollection = new gr(t);
  }
  addListener(t, e) {
    Zt(t) ? this.listenerObjectCollection.add({ listenerObject: t, removedCallback: e }) : this.source.addListener(t, e);
  }
  removeListener(t) {
    Zt(t) ? this.listenerObjectCollection.remove({ listenerObject: t }) : this.source.removeListener(t);
  }
}
function hn(s) {
  return new mr(s);
}
function pr(s, t, e) {
  Zt(t), s.addListener(t, e);
}
function vr(s, t, e) {
  Zt(t), s.removeListener(t, e);
}
function wr(s) {
  const t = st(s, (e) => (n) => {
    e(n), t.removeListener(e);
  });
  return t;
}
function Pr(s, t) {
  return st(s, (e) => (n) => {
    e.apply(t, [n]);
  });
}
class Cr {
  constructor(t) {
    this.source = t, this.firstDispatcher = new Z(), this.secondDispatcher = new Z(), this.numberOfListeners = 0, this.sourceListener = (e) => this.dispatchEvent(e);
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
      first: st(this.firstDispatcher, (t, e) => (this.add(), e(() => this.remove()), t)),
      second: st(this.secondDispatcher, (t, e) => (this.add(), e(() => this.remove()), t))
    };
  }
}
function ln(s) {
  return new Cr(s).build();
}
function z(s, t) {
  return st(s, (e) => (n) => {
    t(n) && e(n);
  });
}
class un {
  constructor(t, e) {
    t = Pr(t, e), this._onceSource = hn(wr(t)), this.source = hn(t);
  }
  addListener(t, e) {
    e && e.once ? this._onceSource.addListener(t) : this.source.addListener(t);
  }
  removeListener(t) {
    this.source.removeListener(t), this._onceSource.removeListener(t);
  }
}
class Ir {
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
function Tr(s, t, e) {
  return new Ir(
    new un(s, e),
    new un(t, e)
  );
}
function tt(s, t, e, n) {
  const i = Y(z(s, (o) => !o.immediatePropagationStopped), (o) => o.getResultEvent(e.rectangle)), r = Y(z(t, (o) => !o.propagationStopped && !o.immediatePropagationStopped), (o) => o.getResultEvent(e.rectangle));
  return Tr(i, r, n);
}
function et(s) {
  const { first: t, second: e } = ln(s), { first: n, second: i } = ln(e);
  return {
    captureSource: t,
    bubbleSource: n,
    afterBubble: i
  };
}
function Sr(s, t, e) {
  const { captureSource: n, bubbleSource: i } = et(s);
  return tt(
    n,
    i,
    t,
    e
  );
}
class Ye {
  constructor(t, e) {
    this.rectangleManager = t, this.infiniteCanvas = e, this.cache = {};
  }
  map(t, e) {
    return Sr(Y(t, e), this.rectangleManager, this.infiniteCanvas);
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
    this.cache[t] || (this.cache[t] = this.getEventSource(t)), pr(this.cache[t], e, n);
  }
  removeEventListener(t, e, n) {
    this.cache[t] && vr(this.cache[t], e, n);
  }
}
class ei extends Ye {
  getEventSource(t) {
    return (!this.cache || !this.cache[t]) && (this.cache = this.createEvents()), this.cache[t];
  }
}
class ni {
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
class Xe extends ni {
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
class ii {
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
class yr {
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
class xr {
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
class $e extends ii {
  constructor(t) {
    super(t ? new yr() : new xr());
  }
}
class br extends Xe {
  constructor(t, e) {
    super(t, e, "draw"), this.transformation = t.transformation, this.inverseTransformation = t.inverseTransformation;
  }
}
class Or extends $e {
  constructor() {
    super(!1);
  }
  createResultEvent(t) {
    return this.transformation = mt(t.infiniteCanvasContext.inverseBase), this.inverseTransformation = mt(t.infiniteCanvasContext.base), new br(this, this.preventableDefault);
  }
}
class Lr extends ei {
  constructor(t, e, n) {
    super(e, n), this.drawingIterationProvider = t;
  }
  createEvents() {
    return {
      draw: this.map(this.drawingIterationProvider.drawHappened, () => new Or())
    };
  }
}
class Br extends Xe {
  constructor(t, e, n) {
    super(t, e, n), this.transformation = t.transformation, this.inverseTransformation = t.inverseTransformation;
  }
}
class ge extends $e {
  constructor(t) {
    super(!1), this.type = t;
  }
  createResultEvent(t) {
    return this.transformation = mt(t.infiniteCanvasContext.inverseBase), this.inverseTransformation = mt(t.infiniteCanvasContext.base), new Br(this, this.preventableDefault, this.type);
  }
}
class Ar extends ei {
  constructor(t, e, n) {
    super(e, n), this.transformer = t;
  }
  createEvents() {
    return {
      transformationstart: this.map(this.transformer.transformationStart, () => new ge("transformationstart")),
      transformationchange: this.map(this.transformer.transformationChange, () => new ge("transformationchange")),
      transformationend: this.map(this.transformer.transformationEnd, () => new ge("transformationend"))
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
class Dr {
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
class Er {
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
class pt extends ii {
  constructor(t, e) {
    super(e ? new Er(t) : new Dr(t)), this.event = t;
  }
  stopPropagation() {
    super.stopPropagation(), this.event && this.event.stopPropagation();
  }
  stopImmediatePropagation() {
    super.stopImmediatePropagation(), this.event && this.event.stopImmediatePropagation();
  }
}
class rt {
  constructor(t, e, n, i) {
    this.offsetX = t, this.offsetY = e, this.movementX = n, this.movementY = i;
  }
  toInfiniteCanvasCoordinates(t) {
    const { x: e, y: n } = t.infiniteCanvasContext.inverseBase.apply(new h(this.offsetX, this.offsetY)), { x: i, y: r } = t.infiniteCanvasContext.inverseBase.untranslated().apply(new h(this.movementX, this.movementY));
    return new rt(e, n, i, r);
  }
  static create(t) {
    return new rt(t.offsetX, t.offsetY, t.movementX, t.movementY);
  }
}
class Fr extends ni {
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
class si extends Fr {
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
class ae extends si {
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
  initMouseEvent(t, e, n, i, r, o, a, l, c, d, u, g, v, P, T) {
  }
}
class xe extends pt {
  constructor(t, e) {
    super(t, e), this.props = rt.create(t);
  }
  createResultEvent(t) {
    return new ae(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
}
class _t extends rt {
  constructor(t, e, n, i, r, o) {
    super(t, e, n, i), this.width = r, this.height = o;
  }
  toInfiniteCanvasCoordinates(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: r } = super.toInfiniteCanvasCoordinates(t), { x: o, y: a } = t.infiniteCanvasContext.inverseBase.untranslated().apply(new h(this.width, this.height));
    return new _t(
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
    return new _t(
      e,
      n,
      i,
      r,
      t.width,
      t.height
    );
  }
}
class Rr extends ae {
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
class ct extends pt {
  constructor(t, e) {
    super(t, e), this.props = _t.create(t);
  }
  createResultEvent(t) {
    return new Rr(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
}
class Wr {
  constructor(t, e) {
    this.initial = t, this.cancel = e, this.current = t;
  }
}
class kr {
  constructor(t) {
    this.point = t, this.moveEventDispatcher = new Z(), this._fixedOnInfiniteCanvas = !1;
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
    return this.moveEventDispatcher.addListener(i), n = new Wr(this.point, () => (this.removeHandler(i), this._fixedOnInfiniteCanvas = !1, this)), n;
  }
}
class Hr {
  constructor(t) {
    this.pointerEvent = t, this._defaultPrevented = !1, this.anchor = new kr(new h(t.offsetX, t.offsetY));
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
class Vr {
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
    const e = new Hr(t);
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
class te extends rt {
  constructor(t, e, n, i, r, o) {
    super(t, e, n, i), this.deltaX = r, this.deltaY = o;
  }
  toInfiniteCanvasCoordinates(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: r } = super.toInfiniteCanvasCoordinates(t), { x: o, y: a } = t.infiniteCanvasContext.inverseBase.untranslated().apply(new h(this.deltaX, this.deltaY));
    return new te(
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
    return new te(
      e,
      n,
      i,
      r,
      t.deltaX,
      t.deltaY
    );
  }
}
class Mr extends ae {
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
class Nr extends pt {
  constructor(t, e) {
    super(t, e), this.props = te.create(t);
  }
  createResultEvent(t) {
    return new Mr(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
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
class ee {
  constructor(t, e, n, i, r, o) {
    this.x = t, this.y = e, this.radiusX = n, this.radiusY = i, this.rotationAngle = r, this.identifier = o;
  }
  toInfiniteCanvasCoordinates(t) {
    const e = t.infiniteCanvasContext.inverseBase, { x: n, y: i } = e.apply(new h(this.x, this.y)), r = this.radiusX * e.scale, o = this.radiusY * e.scale, a = this.rotationAngle + e.getRotationAngle();
    return new ee(
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
    return new ee(
      n,
      i,
      t.radiusX,
      t.radiusY,
      t.rotationAngle,
      t.identifier
    );
  }
}
class dn {
  constructor() {
    this.translatedProps = [], this.createdProps = [];
  }
  toInfiniteCanvasCoordinates(t, e) {
    let n = this.translatedProps.find((i) => i.identifier === t.identifier);
    return n || (n = t.toInfiniteCanvasCoordinates(e), this.translatedProps.push(n), n);
  }
  createProps(t, e) {
    let n = this.createdProps.find((i) => i.identifier === t.identifier);
    return n || (n = ee.create(t, e), this.createdProps.push(n), n);
  }
  dispose() {
    this.translatedProps.splice(0, this.translatedProps.length), this.createdProps.splice(0, this.createdProps.length);
  }
}
class ne {
  constructor(t, e, n) {
    this.targetTouches = t, this.changedTouches = e, this.touches = n;
  }
  toInfiniteCanvasCoordinates(t) {
    const e = new dn(), n = new ne(
      this.targetTouches.map((i) => e.toInfiniteCanvasCoordinates(i, t)),
      this.changedTouches.map((i) => e.toInfiniteCanvasCoordinates(i, t)),
      this.touches.map((i) => e.toInfiniteCanvasCoordinates(i, t))
    );
    return e.dispose(), n;
  }
  static create(t, e, n) {
    const i = new dn(), r = e.map((a) => i.createProps(a, t)), o = n.map((a) => i.createProps(a, t));
    return i.dispose(), new ne(
      r,
      o,
      r
    );
  }
}
class qr {
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
class zr extends Array {
  item(t) {
    return this[t];
  }
}
function Gr(s, t) {
  const e = s.length;
  for (let n = 0; n < e; n++) {
    const i = s[n];
    if (i.identifier === t)
      return i;
  }
}
function Yr(s, t) {
  for (let e of s) {
    const n = Gr(e, t);
    if (n)
      return n;
  }
}
function me(s, t) {
  const e = [];
  for (const n of t) {
    const i = Yr(s, n.identifier);
    i && e.push(new qr(i, n));
  }
  return new zr(...e);
}
class Xr extends si {
  constructor(t, e, n, i) {
    super(t, e, n), this.touches = me([n.touches], i.touches), this.targetTouches = me([n.touches], i.targetTouches), this.changedTouches = me([n.touches, n.changedTouches], i.changedTouches);
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
class xt extends pt {
  constructor(t, e, n) {
    super(t, n), this.props = e;
  }
  createResultEvent(t) {
    return new Xr(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
  static create(t, e, n, i, r) {
    const o = ne.create(t, n, i);
    return new xt(e, o, r);
  }
}
class fn {
  constructor(t, e) {
    this.source = t, this.listener = e, t.addListener(e);
  }
  remove() {
    this.source.removeListener(this.listener);
  }
}
class $r {
  constructor(t, e, n, i) {
    this.listener = n, this.onRemoved = i;
    let r;
    this.otherSubscription = new fn(e, (o) => {
      r = o;
    }), this.subscription = new fn(t, (o) => {
      n([o, r]);
    });
  }
  remove() {
    this.subscription.remove(), this.otherSubscription.remove(), this.onRemoved && this.onRemoved();
  }
}
class Ur extends Bt {
  constructor(t, e) {
    super(), this.source = t, this.otherSource = e;
  }
  map(t) {
    return new $r(this.source, this.otherSource, t.listener, t.onRemoved);
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
function pe(s, t) {
  return new Ur(s, t);
}
function Kr(s, t) {
  for (let e = 0; e < s.length; e++) {
    const n = s[e];
    if (t(n))
      return !0;
  }
  return !1;
}
function jr(s, t) {
  return st(s, (e) => {
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
class Qr {
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
function Jr(s) {
  return new Qr(s);
}
class gn extends $e {
  constructor(t) {
    super(!0), this.type = t;
  }
  createResultEvent() {
    return new Xe(this, this.preventableDefault, this.type);
  }
}
class Zr extends Ye {
  constructor(t, e, n, i, r) {
    super(n, i), this.transformer = e, this.config = r, this.anchorSet = new Vr();
    const o = W(t, "pointerdown"), a = W(t, "pointerleave"), l = W(t, "pointermove"), c = W(t, "pointerup"), d = W(t, "pointercancel"), u = z(
      W(t, "touchmove"),
      (f) => Kr(f.targetTouches, (b) => !this.hasFixedAnchorForTouch(b.identifier))
    );
    o.addListener((f) => this.anchorSet.updateAnchorForPointerEvent(f)), l.addListener((f) => this.anchorSet.updateAnchorForPointerEvent(f)), c.addListener((f) => this.removePointer(f)), a.addListener((f) => this.removePointer(f));
    const g = Y(W(t, "mousedown"), (f) => new xe(f, !0)), v = Y(W(t, "wheel"), (f) => new Nr(f, !0)), P = Y(W(t, "touchstart"), (f) => {
      const b = dt(f.targetTouches), q = dt(f.changedTouches);
      return xt.create(
        this.rectangleManager.rectangle,
        f,
        b,
        q,
        !0
      );
    }), T = Y(o, (f) => new ct(f, !0)), { captureSource: L, bubbleSource: k, afterBubble: N } = et(T), { captureSource: _, bubbleSource: vt, afterBubble: wt } = et(g), { captureSource: Pt, bubbleSource: ce, afterBubble: he } = et(P), { captureSource: le, bubbleSource: ue, afterBubble: Ct } = et(v), ri = Y(
      z(Ct, (f) => !this.config.greedyGestureHandling && !f.event.ctrlKey && !f.infiniteCanvasDefaultPrevented),
      () => new gn("wheelignored")
    ), { captureSource: oi, bubbleSource: ai, afterBubble: ci } = et(ri);
    Ct.addListener((f) => {
      f.infiniteCanvasDefaultPrevented || this.zoom(f.event);
    }), ci.addListener((f) => {
      f.infiniteCanvasDefaultPrevented || console.warn("use ctrl + scroll to zoom");
    }), pe(wt, N).addListener(([f, b]) => {
      !f.infiniteCanvasDefaultPrevented && !b.infiniteCanvasDefaultPrevented && this.transformUsingPointer(f.event, b.event);
    });
    const hi = z(he, (f) => f.event.changedTouches.length === 1), je = pe(hi, N);
    je.addListener(([f, b]) => {
      const q = f.event.changedTouches[0], K = this.anchorSet.getAnchorForPointerEvent(b.event);
      if (K)
        if (K.setTouchId(q.identifier), !f.infiniteCanvasDefaultPrevented && !b.infiniteCanvasDefaultPrevented)
          if (this.config.greedyGestureHandling)
            this.rectangleManager.measure(), this.transformer.addAnchor(K.anchor), f.event.preventDefault();
          else {
            const Je = this.anchorSet.find((de) => de.touchId !== void 0 && de !== K && !de.defaultPrevented);
            if (!Je)
              return;
            this.rectangleManager.measure(), this.transformer.addAnchor(Je.anchor), this.transformer.addAnchor(K.anchor), f.event.preventDefault();
          }
        else
          K.preventDefault();
    });
    const Qe = z(
      pe(d, je),
      ([f, [b, q]]) => f.pointerId === q.event.pointerId
    );
    Qe.addListener(([f]) => {
      this.removePointer(f);
    });
    const li = Y(
      z(Qe, ([f, [b, q]]) => !this.config.greedyGestureHandling && !b.infiniteCanvasDefaultPrevented && !q.infiniteCanvasDefaultPrevented),
      () => new gn("touchignored")
    ), { captureSource: ui, bubbleSource: di, afterBubble: fi } = et(li);
    fi.addListener((f) => {
      f.infiniteCanvasDefaultPrevented || console.warn("use two fingers to move");
    }), this.cache = {
      mousemove: this.map(z(W(t, "mousemove"), () => !this.mouseAnchorIsFixed()), (f) => new xe(f)),
      mousedown: tt(_, vt, n, i),
      pointerdown: tt(L, k, n, i),
      pointermove: this.map(
        jr(
          z(l, () => this.hasNonFixedAnchorForSomePointer()),
          () => Jr(this.anchorSet.getAll((f) => !f.anchor.fixedOnInfiniteCanvas).map((f) => f.pointerEvent))
        ),
        (f) => new ct(f)
      ),
      pointerleave: this.map(a, (f) => new ct(f)),
      pointerup: this.map(c, (f) => new ct(f)),
      pointercancel: this.map(d, (f) => new ct(f)),
      wheel: tt(le, ue, n, i),
      wheelignored: tt(oi, ai, n, i),
      touchstart: tt(Pt, ce, n, i),
      touchignored: tt(ui, di, n, i),
      touchmove: this.map(u, (f) => {
        const b = dt(f.targetTouches), q = dt(f.targetTouches, (K) => !this.hasFixedAnchorForTouch(K.identifier));
        return xt.create(
          this.rectangleManager.rectangle,
          f,
          b,
          q
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
    e.button === 1 && this.config.rotationEnabled ? (t.preventDefault(), this.transformer.addRotationAnchor(n.anchor)) : e.button === 0 && this.transformer.addAnchor(n.anchor);
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
class _r {
  constructor(t, e) {
    this.handledOrFilteredEventCollection = t, this.mappingCollection = e;
  }
  setOn(t, e) {
    Rt(t) ? this.handledOrFilteredEventCollection.setOn(t, e) : this.mappingCollection.setOn(t, e);
  }
  getOn(t) {
    return Rt(t) ? this.handledOrFilteredEventCollection.getOn(t) : this.mappingCollection.getOn(t);
  }
  addEventListener(t, e, n) {
    Rt(t) ? this.handledOrFilteredEventCollection.addEventListener(t, e, n) : this.mappingCollection.addEventListener(t, e, n);
  }
  removeEventListener(t, e, n) {
    Rt(t) ? this.handledOrFilteredEventCollection.removeEventListener(t, e, n) : this.mappingCollection.removeEventListener(t, e, n);
  }
}
class to {
  constructor(t, e, n, i) {
    this.mappedMouseEventCollection = t, this.mappedTouchEventCollection = e, this.mappedOnlyPointerEventCollection = n, this.mappedDragEventCollection = i;
  }
  setOn(t, e) {
    Wt(t) ? this.mappedMouseEventCollection.setOn(t, e) : Vt(t) ? this.mappedTouchEventCollection.setOn(t, e) : kt(t) ? this.mappedOnlyPointerEventCollection.setOn(t, e) : Ht(t) && this.mappedDragEventCollection.setOn(t, e);
  }
  getOn(t) {
    if (Wt(t))
      return this.mappedMouseEventCollection.getOn(t);
    if (Vt(t))
      return this.mappedTouchEventCollection.getOn(t);
    if (kt(t))
      return this.mappedOnlyPointerEventCollection.getOn(t);
    if (Ht(t))
      return this.mappedDragEventCollection.getOn(t);
  }
  addEventListener(t, e, n) {
    Wt(t) ? this.mappedMouseEventCollection.addEventListener(t, e, n) : Vt(t) ? this.mappedTouchEventCollection.addEventListener(t, e, n) : kt(t) ? this.mappedOnlyPointerEventCollection.addEventListener(t, e, n) : Ht(t) && this.mappedDragEventCollection.addEventListener(t, e, n);
  }
  removeEventListener(t, e, n) {
    Wt(t) ? this.mappedMouseEventCollection.removeEventListener(t, e, n) : Vt(t) ? this.mappedTouchEventCollection.removeEventListener(t, e, n) : kt(t) ? this.mappedOnlyPointerEventCollection.removeEventListener(t, e, n) : Ht(t) && this.mappedDragEventCollection.removeEventListener(t, e, n);
  }
}
class It extends Ye {
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
class eo extends ae {
  get dataTransfer() {
    return this.event.dataTransfer;
  }
}
class no extends pt {
  constructor(t, e) {
    super(t, e), this.props = rt.create(t);
  }
  createResultEvent(t) {
    return new eo(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
}
class io extends pt {
  createResultEvent() {
    return this.event;
  }
}
class Ue {
  constructor(t, e, n, i) {
    this.drawEventCollection = t, this.transformationEventCollection = e, this.pointerEventCollection = n, this.unmappedEventCollection = i;
  }
  setOn(t, e) {
    t === "draw" ? this.drawEventCollection.setOn("draw", e) : Et(t) ? this.transformationEventCollection.setOn(t, e) : Ft(t) ? this.pointerEventCollection.setOn(t, e) : this.unmappedEventCollection.setOn(t, e);
  }
  getOn(t) {
    return t === "draw" ? this.drawEventCollection.getOn("draw") : Et(t) ? this.transformationEventCollection.getOn(t) : Ft(t) ? this.pointerEventCollection.getOn(t) : this.unmappedEventCollection.getOn(t);
  }
  addEventListener(t, e, n) {
    t === "draw" ? this.drawEventCollection.addEventListener("draw", e, n) : Et(t) ? this.transformationEventCollection.addEventListener(t, e, n) : Ft(t) ? this.pointerEventCollection.addEventListener(t, e, n) : this.unmappedEventCollection.addEventListener(t, e, n);
  }
  removeEventListener(t, e, n) {
    t === "draw" ? this.drawEventCollection.removeEventListener("draw", e, n) : Et(t) ? this.transformationEventCollection.removeEventListener(t, e, n) : Ft(t) ? this.pointerEventCollection.removeEventListener(t, e, n) : this.unmappedEventCollection.removeEventListener(t, e, n);
  }
  static create(t, e, n, i, r, o) {
    const a = new Lr(o, n, i), l = new Ar(e, n, i), c = new Zr(
      t,
      e,
      n,
      i,
      r
    ), d = new _r(
      c,
      new to(
        new It(t, (u) => new xe(u), n, i),
        new It(t, (u) => {
          const g = dt(u.targetTouches), v = dt(u.changedTouches);
          return xt.create(
            n.rectangle,
            u,
            g,
            v
          );
        }, n, i),
        new It(t, (u) => new ct(u), n, i),
        new It(t, (u) => new no(u), n, i)
      )
    );
    return new Ue(
      a,
      l,
      d,
      new It(t, (u) => new io(u), n, i)
    );
  }
}
function so(s, t) {
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
function ro(s, t) {
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
    n *= v, d(), c();
  }
  function l() {
    let u = 0;
    for (; r === -1 && u < 10; )
      i *= 10, d(), u++;
    c();
  }
  function c() {
    if (r === -1)
      throw new Error(`something went wrong while getting measurement for unit '${t}' on canvas with width ${e}`);
  }
  function d() {
    r = so(s, `${n / i}${t}`);
  }
}
class oo {
  constructor(t) {
    this.ctx = t, this.cache = {};
  }
  getNumberOfPixels(t, e) {
    if (t === 0)
      return 0;
    if (e === "px")
      return t;
    let n = this.cache[e];
    return n || (n = ro(this.ctx, e), this.cache[e] = n), t * n.pixels * n.denominator / n.numerator;
  }
}
class ao {
  constructor(t) {
    this.canvas = t, this.dispatcher = new Z(), this.numberOfListeners = 0;
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
function mn(s) {
  const { screenWidth: t, screenHeight: e } = s;
  return t > 0 && e > 0;
}
class co {
  constructor(t, e, n) {
    this.measurementProvider = t, this.resizes = e, this.viewBox = n, this.currentlyVisible = !1;
  }
  observe() {
    const t = this.measurementProvider.measure();
    this.currentlyVisible = mn(t);
    const e = (n) => {
      const i = mn(n);
      i && !this.currentlyVisible && this.viewBox.draw(), this.currentlyVisible = i;
    };
    this.resizes.addListener(e), this.listener = e;
  }
  disconnect() {
    this.listener && (this.resizes.removeListener(this.listener), this.listener = void 0);
  }
}
class Ke {
  constructor(t, e) {
    this.canvas = t, this.config = { rotationEnabled: !0, greedyGestureHandling: !1, units: x.CANVAS }, e && Object.assign(this.config, e);
    const n = new ao(t);
    this.canvasResizes = n, this.cssUnitsCanvasResizeListener = () => {
      this.canvas.parentElement !== null && this.viewBox.draw();
    };
    const i = new rr(new sr()), r = new or(i), o = new hr(t);
    this.rectangleManager = new cr(o, this.config);
    let a;
    const l = t.getContext("2d");
    this.cssLengthConverterFactory = {
      create: () => new oo(l)
    };
    const c = new Qs(
      this.rectangleManager,
      l,
      r,
      () => r.getLock(),
      () => a.isTransforming
    );
    this.viewBox = c, this.canvasUnitsCanvasResizeObserver = new co(o, n, c), a = new ir(this.viewBox, this.config), this.eventCollection = Ue.create(t, a, this.rectangleManager, this, this.config, i), this.config.units === x.CSS ? this.canvasResizes.addListener(this.cssUnitsCanvasResizeListener) : this.config.units === x.CANVAS && this.canvasUnitsCanvasResizeObserver.observe();
  }
  setUnits(t) {
    t === x.CSS && this.config.units !== x.CSS && (this.canvasUnitsCanvasResizeObserver.disconnect(), this.canvasResizes.addListener(this.cssUnitsCanvasResizeListener)), t === x.CANVAS && this.config.units !== x.CANVAS && (this.canvasResizes.removeListener(this.cssUnitsCanvasResizeListener), this.canvasUnitsCanvasResizeObserver.observe()), this.config.units = t, this.rectangleManager.measure(), this.viewBox.draw();
  }
  getContext() {
    return this.context || (this.context = new qs(this.canvas, this.viewBox, this.cssLengthConverterFactory)), this.context;
  }
  get transformation() {
    return mt(this.rectangleManager.rectangle.infiniteCanvasContext.inverseBase);
  }
  get inverseTransformation() {
    return mt(this.rectangleManager.rectangle.infiniteCanvasContext.base);
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
Ke.CANVAS_UNITS = x.CANVAS;
Ke.CSS_UNITS = x.CSS;
const lo = Ke;
export {
  x as Units,
  lo as default
};
