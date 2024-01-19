let Jn = class {
  constructor(t) {
    this.viewBox = t;
  }
  restore() {
    this.viewBox.restoreState();
  }
  save() {
    this.viewBox.saveState();
  }
};
const he = class rt {
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
    return new rt(this.x - t.x, this.y - t.y);
  }
  plus(t) {
    return new rt(this.x + t.x, this.y + t.y);
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
    return new rt(-this.y, this.x);
  }
  scale(t) {
    return new rt(t * this.x, t * this.y);
  }
  projectOn(t) {
    return t.scale(this.dot(t) / t.modSq());
  }
  matrix(t, e, n, i) {
    return new rt(t * this.x + e * this.y, n * this.x + i * this.y);
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
he.origin = new he(0, 0);
let c = he;
function st(r) {
  return r.toFixed(10).replace(/\.?0+$/, "");
}
const le = class O {
  constructor(t, e, n, i, s, o) {
    this.a = t, this.b = e, this.c = n, this.d = i, this.e = s, this.f = o, this.scale = Math.sqrt(t * i - e * n);
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
    return this.before(O.translation(-t, -e));
  }
  before(t) {
    const e = t.a * this.a + t.c * this.b, n = t.b * this.a + t.d * this.b, i = t.a * this.c + t.c * this.d, s = t.b * this.c + t.d * this.d, o = t.a * this.e + t.c * this.f + t.e, a = t.b * this.e + t.d * this.f + t.f;
    return new O(e, n, i, s, o, a);
  }
  equals(t) {
    return this.a === t.a && this.b === t.b && this.c === t.c && this.d === t.d && this.e === t.e && this.f === t.f;
  }
  inverse() {
    var t = this.a * this.d - this.b * this.c;
    if (t == 0)
      throw new Error("error calculating inverse: zero determinant");
    const e = this.d / t, n = -this.b / t, i = -this.c / t, s = this.a / t, o = (this.c * this.f - this.d * this.e) / t, a = (this.b * this.e - this.a * this.f) / t;
    return new O(e, n, i, s, o, a);
  }
  static translation(t, e) {
    return new O(1, 0, 0, 1, t, e);
  }
  static scale(t) {
    return new O(t, 0, 0, t, 0, 0);
  }
  static zoom(t, e, n, i, s) {
    const o = 1 - n;
    return i !== void 0 ? new O(n, 0, 0, n, t * o + i, e * o + s) : new O(n, 0, 0, n, t * o, e * o);
  }
  static translateZoom(t, e, n, i, s, o, a, h) {
    const l = n - t, f = i - e, u = l * l + f * f;
    if (u === 0)
      throw new Error("divide by 0");
    const g = a - s, p = h - o, P = g * g + p * p, x = Math.sqrt(P / u);
    return O.zoom(t, e, x, s - t, o - e);
  }
  static rotation(t, e, n) {
    const i = Math.cos(n), s = Math.sin(n), o = 1 - i;
    return new O(
      i,
      s,
      -s,
      i,
      t * o + e * s,
      -t * s + e * o
    );
  }
  static translateRotateZoom(t, e, n, i, s, o, a, h) {
    const l = n - t, f = i - e, u = l * l + f * f;
    if (u === 0)
      throw new Error("divide by 0");
    const g = a - s, p = h - o, P = t * i - e * n, x = n * l + i * f, k = t * l + e * f, G = (l * g + f * p) / u, Q = (l * p - f * g) / u, gt = -Q, mt = G, vt = (s * x - a * k - P * p) / u, pt = (o * x - h * k + P * g) / u;
    return new O(G, Q, gt, mt, vt, pt);
  }
  static create(t) {
    if (t instanceof O)
      return t;
    const { a: e, b: n, c: i, d: s, e: o, f: a } = t;
    return new O(e, n, i, s, o, a);
  }
  toString() {
    return `x: (${st(this.a)}, ${st(this.b)}), y: (${st(this.c)}, ${st(this.d)}), d: (${st(this.e)}, ${st(this.f)})`;
  }
};
le.identity = new le(1, 0, 0, 1, 0, 0);
let v = le;
class I {
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
const T = () => {
};
class Zn extends I {
  valuesAreEqual(t, e) {
    return t.equals(e);
  }
  changeToNewValue(t) {
    return (e, n) => {
      const { a: i, b: s, c: o, d: a, e: h, f: l } = n.getTransformationForInstruction(t);
      e.setTransform(i, s, o, a, h, l);
    };
  }
}
const Nt = new Zn("transformation", T);
class _n {
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
    this.viewBox.changeState((t) => Nt.changeInstanceValue(t, v.identity));
  }
  rotate(t) {
    this.addTransformation(v.rotation(0, 0, t));
  }
  scale(t, e) {
    this.addTransformation(new v(t, 0, 0, e, 0, 0));
  }
  setTransform(t, e, n, i, s, o) {
    let a, h, l, f, u, g;
    typeof t == "number" ? (a = t, h = e, l = n, f = i, u = s, g = o) : t.a !== void 0 ? (a = t.a, h = t.b, l = t.c, f = t.d, u = t.e, g = t.f) : (a = t.m11, h = t.m12, l = t.m21, f = t.m22, u = t.m41, g = t.m42), this.viewBox.changeState((p) => Nt.changeInstanceValue(p, new v(a, h, l, f, u, g)));
  }
  transform(t, e, n, i, s, o) {
    this.addTransformation(new v(t, e, n, i, s, o));
  }
  translate(t, e) {
    this.addTransformation(v.translation(t, e));
  }
  addTransformation(t) {
    const e = this.viewBox.state.current.transformation, n = t.before(e);
    this.viewBox.changeState((i) => Nt.changeInstanceValue(i, n));
  }
}
class ti extends I {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.globalAlpha = t;
  }
}
const tn = new ti("globalAlpha", T);
class ei extends I {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.globalCompositeOperation = t;
  }
}
const en = new ei("globalCompositeOperation", T);
class ni {
  constructor(t) {
    this.viewBox = t;
  }
  get globalAlpha() {
    return this.viewBox.state.current.globalAlpha;
  }
  set globalAlpha(t) {
    this.viewBox.changeState((e) => tn.changeInstanceValue(e, t));
  }
  get globalCompositeOperation() {
    return this.viewBox.state.current.globalCompositeOperation;
  }
  set globalCompositeOperation(t) {
    this.viewBox.changeState((e) => en.changeInstanceValue(e, t));
  }
}
class ii extends I {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.imageSmoothingEnabled = t;
    };
  }
}
const nn = new ii("imageSmoothingEnabled", T);
class si extends I {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.imageSmoothingQuality = t;
    };
  }
}
const sn = new si("imageSmoothingQuality", T);
class ri {
  constructor(t) {
    this.viewBox = t;
  }
  get imageSmoothingEnabled() {
    return this.viewBox.state.current.imageSmoothingEnabled;
  }
  set imageSmoothingEnabled(t) {
    this.viewBox.changeState((e) => nn.changeInstanceValue(e, t));
  }
  get imageSmoothingQuality() {
    return this.viewBox.state.current.imageSmoothingQuality;
  }
  set imageSmoothingQuality(t) {
    this.viewBox.changeState((e) => sn.changeInstanceValue(e, t));
  }
}
class Vt {
}
class rn extends Vt {
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
class on {
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
    return this.isEqualForInstances(t, e) ? !(n instanceof Vt) || t.fillAndStrokeStylesTransformed === e.fillAndStrokeStylesTransformed ? () => {
    } : e.fillAndStrokeStylesTransformed ? n.getInstructionToSetTransformed(this.propName) : n.getInstructionToSetUntransformed(this.propName) : n instanceof Vt ? e.fillAndStrokeStylesTransformed ? n.getInstructionToSetTransformed(this.propName) : n.getInstructionToSetUntransformed(this.propName) : (i) => {
      i[this.propName] = e[this.propName];
    };
  }
  valueIsTransformableForInstance(t) {
    return !(t[this.propName] instanceof rn);
  }
}
const an = new on("fillStyle"), cn = new on("strokeStyle");
class oi {
  constructor(t) {
    this.viewBox = t;
  }
  set fillStyle(t) {
    this.viewBox.changeState((e) => an.changeInstanceValue(e, t));
  }
  set strokeStyle(t) {
    this.viewBox.changeState((e) => cn.changeInstanceValue(e, t));
  }
  createLinearGradient(t, e, n, i) {
    return this.viewBox.createLinearGradient(t, e, n, i);
  }
  createPattern(t, e) {
    return this.viewBox.createPattern(t, e);
  }
  createRadialGradient(t, e, n, i, s, o) {
    return this.viewBox.createRadialGradient(t, e, n, i, s, o);
  }
  createConicGradient(t, e, n) {
    return this.viewBox.createConicGradient(t, e, n);
  }
}
class ai extends I {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.shadowColor = t;
    };
  }
}
const hn = new ai("shadowColor", T);
class ci extends I {
  changeToNewValue(t) {
    return (e, n) => {
      const i = v.translation(t.x, t.y), s = n.translateInfiniteCanvasContextTransformationToBitmapTransformation(i), { x: o, y: a } = s.apply(c.origin);
      e.shadowOffsetX = o, e.shadowOffsetY = a;
    };
  }
  valuesAreEqual(t, e) {
    return t.x === e.x && t.y == e.y;
  }
}
const ue = new ci("shadowOffset", T);
class hi extends I {
  changeToNewValue(t) {
    return (e, n) => {
      const i = v.translation(t, 0), o = n.translateInfiniteCanvasContextTransformationToBitmapTransformation(i).apply(c.origin).mod();
      e.shadowBlur = o;
    };
  }
  valuesAreEqual(t, e) {
    return t === e;
  }
}
const ln = new hi("shadowBlur", T);
class li {
  constructor(t) {
    this.viewBox = t;
  }
  get shadowBlur() {
    return this.viewBox.state.current.shadowBlur;
  }
  set shadowBlur(t) {
    this.viewBox.changeState((e) => ln.changeInstanceValue(e, t));
  }
  get shadowOffsetX() {
    return this.viewBox.state.current.shadowOffset.x;
  }
  set shadowOffsetX(t) {
    const e = new c(t, this.viewBox.state.current.shadowOffset.y);
    this.viewBox.changeState((n) => ue.changeInstanceValue(n, e));
  }
  get shadowOffsetY() {
    return this.viewBox.state.current.shadowOffset.y;
  }
  set shadowOffsetY(t) {
    const e = new c(this.viewBox.state.current.shadowOffset.x, t);
    this.viewBox.changeState((n) => ue.changeInstanceValue(n, e));
  }
  get shadowColor() {
    return this.viewBox.state.current.shadowColor;
  }
  set shadowColor(t) {
    this.viewBox.changeState((e) => hn.changeInstanceValue(e, t));
  }
}
const un = "[+-]?(?:\\d*\\.)?\\d+(?:e[+-]?\\d+)?", dn = "[+-]?(?:0*\\.)?0+(?:e[+-]?\\d+)?", fn = "(?:ch|em|ex|ic|rem|vh|vw|vmax|vmin|vb|vi|cqw|cqh|cqi|cqb|cqmin|cqmax|px|cm|mm|Q|in|pc|pt)", Mt = `(?:${dn}|${un}${fn})`, gn = `blur\\((${Mt})\\)`, Ve = "[^())\\s]+(?:\\([^)]*?\\))?", mn = `drop-shadow\\((${Mt})\\s+(${Mt})\\s*?(?:(?:(${Mt})\\s*?(${Ve})?)|(${Ve}))?\\)`, qe = `${gn}|${mn}`;
function L(r, t) {
  const e = r.match(new RegExp(`(?:(${dn})|(${un})(${fn}))`));
  return e[1] ? 0 : t.getNumberOfPixels(Number.parseFloat(e[2]), e[3]);
}
class vn {
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
class me {
  constructor(t, e) {
    this.stringRepresentation = t, this.size = e;
  }
  toTransformedString(t) {
    return `blur(${t.translateInfiniteCanvasContextTransformationToBitmapTransformation(v.translation(this.size, 0)).apply(c.origin).mod()}px)`;
  }
  getShadowOffset() {
    return null;
  }
  static tryCreate(t, e) {
    const n = t.match(new RegExp(gn));
    return n === null ? null : new me(t, L(n[1], e));
  }
}
class at {
  constructor(t, e, n, i, s) {
    this.stringRepresentation = t, this.offsetX = e, this.offsetY = n, this.blurRadius = i, this.color = s;
  }
  toTransformedString(t) {
    const e = t.translateInfiniteCanvasContextTransformationToBitmapTransformation(v.translation(this.offsetX, this.offsetY)), { x: n, y: i } = e.apply(c.origin);
    if (this.blurRadius !== null) {
      const o = t.translateInfiniteCanvasContextTransformationToBitmapTransformation(v.translation(this.blurRadius, 0)).apply(c.origin).mod();
      return this.color ? `drop-shadow(${n}px ${i}px ${o}px ${this.color})` : `drop-shadow(${n}px ${i}px ${o}px)`;
    }
    return this.color ? `drop-shadow(${n}px ${i}px ${this.color})` : `drop-shadow(${n}px ${i}px)`;
  }
  getShadowOffset() {
    return new c(this.offsetX, this.offsetY);
  }
  static tryCreate(t, e) {
    const n = t.match(new RegExp(mn));
    return n === null ? null : n[5] ? new at(
      t,
      L(n[1], e),
      L(n[2], e),
      null,
      n[5]
    ) : n[4] ? new at(
      t,
      L(n[1], e),
      L(n[2], e),
      L(n[3], e),
      n[4]
    ) : n[3] ? new at(
      t,
      L(n[1], e),
      L(n[2], e),
      L(n[3], e),
      null
    ) : new at(
      t,
      L(n[1], e),
      L(n[2], e),
      null,
      null
    );
  }
}
const de = class pn {
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
    const i = t.match(new RegExp(`${qe}|((?!\\s|${qe}).)+`, "g")).map((s) => this.createPart(s, e));
    return new pn(t, i);
  }
  static createPart(t, e) {
    let n = me.tryCreate(t, e);
    return n !== null || (n = at.tryCreate(t, e), n != null) ? n : new vn(t);
  }
};
de.none = new de("none", [new vn("none")]);
let wn = de;
class ui extends I {
  valuesAreEqual(t, e) {
    return t.stringRepresentation === e.stringRepresentation;
  }
  changeToNewValue(t) {
    return (e, n) => e.filter = t.toTransformedString(n);
  }
}
const Pn = new ui("filter", T);
class di {
  constructor(t, e) {
    this.viewBox = t, this.cssLengthConverterFactory = e;
  }
  get filter() {
    return this.viewBox.state.current.filter.stringRepresentation;
  }
  set filter(t) {
    const e = wn.create(t, this.cssLengthConverterFactory.create());
    this.viewBox.changeState((n) => Pn.changeInstanceValue(n, e));
  }
}
class fi {
  constructor(t) {
    this.viewBox = t;
  }
  clearRect(t, e, n, i) {
    this.viewBox.clearArea(t, e, n, i);
  }
  fillRect(t, e, n, i) {
    let s = (o) => o.fill();
    this.viewBox.fillRect(t, e, n, i, s);
  }
  strokeRect(t, e, n, i) {
    this.viewBox.strokeRect(t, e, n, i);
  }
}
class gi {
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
class mi {
  drawFocusIfNeeded(t, e) {
  }
  scrollPathIntoView(t) {
  }
}
var W = /* @__PURE__ */ ((r) => (r[r.None = 0] = "None", r[r.Relative = 1] = "Relative", r[r.Absolute = 2] = "Absolute", r))(W || {});
function vi(r, t, e, n) {
  const i = e.minus(r), s = n.cross(t), o = n.getPerpendicular().dot(i) / s;
  return r.plus(t.scale(o));
}
class pi {
  constructor(t, e, n) {
    this.point = t, this.halfPlane1 = e, this.halfPlane2 = n, this.normal1 = e.normalTowardInterior, this.normal2 = n.normalTowardInterior;
  }
  isContainedByHalfPlaneWithNormal(t) {
    return t.isInSmallerAngleBetweenPoints(this.normal1, this.normal2);
  }
  containsPoint(t) {
    return this.halfPlane1.containsPoint(t) && this.halfPlane2.containsPoint(t);
  }
  containsLineSegmentWithDirection(t) {
    return this.containsPoint(this.point.plus(t)) || this.containsPoint(this.point.minus(t));
  }
  isContainedByVertex(t) {
    return this.isContainedByHalfPlaneWithNormal(t.normal1) && this.isContainedByHalfPlaneWithNormal(t.normal2);
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
      point: vi(this.base, this.normalTowardInterior.getPerpendicular(), t, e),
      halfPlane: this
    };
  }
  isParallelToLine(t, e) {
    return this.normalTowardInterior.getPerpendicular().cross(e) === 0;
  }
  getIntersectionWith(t) {
    const e = this.intersectWithLine(t.base, t.normalTowardInterior.getPerpendicular());
    return new pi(e.point, this, t);
  }
  static throughPointsAndContainingPoint(t, e, n) {
    const i = w.withBorderPoints(t, e);
    for (let s of i)
      if (s.containsPoint(n))
        return s;
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
class wi {
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
const Ct = new wi();
class Pi {
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
const b = new Pi();
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
      const s = n.getIntersectionWith(t), o = i.find((a) => a.point.equals(s.point));
      if (o) {
        if (!o.isContainedByHalfPlaneWithNormal(t.normalTowardInterior))
          return !1;
      } else {
        if (i.length === 0)
          return !1;
        if (this.containsPoint(s.point))
          return !1;
      }
    }
    return !this.containsHalfPlane(t);
  }
  getVertices() {
    return this.vertices.map((t) => t.point);
  }
  expandToIncludePoint(t) {
    if (this.containsPoint(t))
      return this;
    const e = new Set(this.halfPlanes);
    for (const i of this.halfPlanes) {
      if (!this.hasAtMostOneVertex(i) || i.containsPoint(t))
        continue;
      const s = i.expandToIncludePoint(t);
      e.delete(i), e.add(s);
    }
    for (const i of this.vertices) {
      const s = i.halfPlane1.containsPoint(t), o = i.halfPlane2.containsPoint(t);
      if (s && o || (s || e.delete(i.halfPlane1), o || e.delete(i.halfPlane2), !s && !o))
        continue;
      let a = t.minus(i.point).getPerpendicular();
      i.isContainedByHalfPlaneWithNormal(a) || (a = a.scale(-1));
      const h = new w(t, a);
      e.add(h);
    }
    const n = [];
    return e.forEach((i) => n.push(i)), new m(m.getHalfPlanesNotContainingAnyOther(n));
  }
  expandToIncludeInfinityInDirection(t) {
    if (this.containsInfinityInDirection(t))
      return this;
    let e = this.halfPlanes.filter((n) => n.containsInfinityInDirection(t)).concat(this.getTangentPlanesThroughInfinityInDirection(t));
    return e = m.getHalfPlanesNotContainingAnyOther(e), e.length === 0 ? Ct : new m(e);
  }
  getIntersectionsWithLine(t, e) {
    const n = [];
    for (let i of this.halfPlanes) {
      if (i.isParallelToLine(t, e))
        continue;
      const s = i.intersectWithLine(t, e), o = this.findVertex(s.point);
      o && !o.containsLineSegmentWithDirection(e) || this.containsPoint(s.point) && n.push(s);
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
      return b;
    const e = m.getHalfPlanesNotContainingAnyOther(this.halfPlanes.concat(t.halfPlanes)), s = m.groupVerticesByPoint(m.getVertices(e)).map((a) => m.getVerticesNotContainingAnyOther(a)).reduce((a, h) => a.concat(h), []);
    if (s.length === 0)
      return new m(e);
    const o = m.getHalfPlanes(s);
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
      (n.halfPlane1 === t || n.halfPlane2 === t) && e.push(n);
    return e;
  }
  hasAtMostOneVertex(t) {
    let e = 0;
    for (let n of this.vertices)
      if ((n.halfPlane1 === t || n.halfPlane2 === t) && (e++, e > 1))
        return !1;
    return !0;
  }
  getTangentPlanesThroughInfinityInDirection(t) {
    const e = [];
    for (let n of this.vertices) {
      const i = w.withBorderPointAndInfinityInDirection(n.point, t);
      for (let s of i)
        this.isContainedByHalfPlane(s) && e.push(s);
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
      e.indexOf(n.halfPlane1) === -1 && e.push(n.halfPlane1), e.indexOf(n.halfPlane2) === -1 && e.push(n.halfPlane2);
    return e;
  }
  static getVerticesNotContainingAnyOther(t) {
    const e = [];
    for (let n = 0; n < t.length; n++) {
      let i = !0;
      for (let s = 0; s < t.length; s++)
        if (n !== s && t[s].isContainedByVertex(t[n])) {
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
      for (let s of e)
        if (s.isContainedByHalfPlane(n)) {
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
      for (let s of e)
        if (s[0].point.equals(n.point)) {
          i = s;
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
        if (t[n].complement().isContainedByHalfPlane(t[i]))
          continue;
        const s = t[n].getIntersectionWith(t[i]);
        let o = !0;
        for (let a = 0; a < t.length; a++)
          if (a !== n && a !== i && !t[a].containsPoint(s.point)) {
            o = !1;
            break;
          }
        o && e.push(s);
      }
    return e;
  }
  static createTriangleWithInfinityInTwoDirections(t, e, n) {
    const i = e.getPerpendicular(), s = n.getPerpendicular();
    return e.cross(n) < 0 ? new m([
      new w(t, i.scale(-1)),
      new w(t, s)
    ]) : new m([
      new w(t, i),
      new w(t, s.scale(-1))
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
  static createRectangle(t, e, n, i) {
    const s = [];
    return Number.isFinite(t) && (s.push(new w(new c(t, 0), n > 0 ? new c(1, 0) : new c(-1, 0))), Number.isFinite(n) && s.push(new w(new c(t + n, 0), n > 0 ? new c(-1, 0) : new c(1, 0)))), Number.isFinite(e) && (s.push(new w(new c(0, e), i > 0 ? new c(0, 1) : new c(0, -1))), Number.isFinite(i) && s.push(new w(new c(0, e + i), i > 0 ? new c(0, -1) : new c(0, 1)))), new m(s);
  }
}
class Ci {
  constructor(t) {
    this.viewBox = t;
  }
  fillText(t, e, n, i) {
    let s = i === void 0 ? (o) => {
      o.fillText(t, e, n);
    } : (o) => {
      o.fillText(t, e, n, i);
    };
    this.viewBox.addDrawing(s, this.getDrawnRectangle(e, n, t), W.Relative, !0);
  }
  measureText(t) {
    return this.viewBox.measureText(t);
  }
  strokeText(t, e, n, i) {
    let s = i === void 0 ? (o) => {
      o.strokeText(t, e, n);
    } : (o) => {
      o.strokeText(t, e, n, i);
    };
    this.viewBox.addDrawing(s, this.getDrawnRectangle(e, n, t), W.Relative, !0);
  }
  getDrawnRectangle(t, e, n) {
    const i = this.viewBox.measureText(n);
    let s;
    i.actualBoundingBoxRight !== void 0 ? s = Math.abs(i.actualBoundingBoxRight - i.actualBoundingBoxLeft) : s = i.width;
    const o = i.actualBoundingBoxAscent !== void 0 ? i.actualBoundingBoxAscent + i.actualBoundingBoxDescent : 1, a = i.actualBoundingBoxAscent !== void 0 ? i.actualBoundingBoxAscent : 0;
    return m.createRectangle(t, e - a, s, o);
  }
}
class Ii {
  constructor(t) {
    this.viewBox = t;
  }
  drawImage() {
    const t = Array.prototype.slice.apply(arguments);
    let e, n, i, s, o, a, h, l, f;
    arguments.length <= 5 ? [e, a, h, l, f] = t : [e, n, i, s, o, a, h, l, f] = t;
    const u = this.getDrawnLength(e.width, n, s, l), g = this.getDrawnLength(e.height, i, o, f), p = m.createRectangle(a, h, u, g), P = this.getDrawImageInstruction(arguments.length, e, n, i, s, o, a, h, l, f);
    this.viewBox.addDrawing(P, p, W.Relative, !0);
  }
  getDrawImageInstruction(t, e, n, i, s, o, a, h, l, f) {
    switch (t) {
      case 3:
        return (u) => {
          u.drawImage(e, a, h);
        };
      case 5:
        return (u) => {
          u.drawImage(e, a, h, l, f);
        };
      case 9:
        return (u) => {
          u.drawImage(e, n, i, s, o, a, h, l, f);
        };
      default:
        throw new TypeError(`Failed to execute 'drawImage' on 'CanvasRenderingContext2D': Valid arities are: [3, 5, 9], but ${t} arguments provided.`);
    }
  }
  getDrawnLength(t, e, n, i) {
    const s = this.getLength(t);
    return i !== void 0 ? i : e !== void 0 ? n !== void 0 ? n : s - e : s;
  }
  getLength(t) {
    return typeof t == "number" ? t : t.baseVal.value;
  }
}
function Ti(r, t, e, n, i) {
  t = t === void 0 ? 0 : t, e = e === void 0 ? 0 : e, n = n === void 0 ? r.width : n, i = i === void 0 ? r.height : i;
  const s = r.data, o = new Uint8ClampedArray(4 * n * i);
  for (let a = 0; a < i; a++)
    for (let h = 0; h < n; h++) {
      const l = 4 * ((e + a) * r.width + t + h), f = 4 * (a * n + h);
      o[f] = s[l], o[f + 1] = s[l + 1], o[f + 2] = s[l + 2], o[f + 3] = s[l + 3];
    }
  return new ImageData(o, n, i);
}
class qt {
  constructor(t, e, n) {
    this.area = t, this.latestClippedPath = e, this.previouslyClippedPaths = n;
  }
  withClippedPath(t) {
    const e = t.area.intersectWith(this.area);
    return new qt(e, t, this);
  }
  get initialState() {
    return this.previouslyClippedPaths ? this.previouslyClippedPaths.initialState : this.latestClippedPath.initialState;
  }
  except(t) {
    if (t !== this)
      return this.previouslyClippedPaths ? new qt(this.area, this.latestClippedPath, this.previouslyClippedPaths.except(t)) : this;
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
      return (i, s) => {
        e(i, s), n(i, s), t(i, s);
      };
    }
    return t;
  }
}
class Si extends I {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.direction = t;
    };
  }
}
const ve = new Si("direction", T);
class yi extends I {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.font = t;
    };
  }
}
const pe = new yi("font", T);
class Cn {
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
class In extends Cn {
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
const Tn = new In("lineWidth"), Sn = new In("lineDashOffset");
class bi extends Cn {
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
      e.setLineDash(t.map((s) => s * i.scale));
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
const yn = new bi("lineDash");
class xi extends I {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.textAlign = t;
    };
  }
}
const we = new xi("textAlign", T);
class Oi extends I {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => {
      e.textBaseline = t;
    };
  }
}
const Pe = new Oi("textBaseline", T);
class Bi extends I {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.lineCap = t;
  }
}
const bn = new Bi("lineCap", T);
class Ai extends I {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.lineJoin = t;
  }
}
const xn = new Ai("lineJoin", T);
class Di extends I {
  valuesAreEqual(t, e) {
    return t === e;
  }
  changeToNewValue(t) {
    return (e) => e.miterLimit = t;
  }
}
const On = new Di("miterLimit", T), re = [
  ve,
  nn,
  sn,
  an,
  Sn,
  yn,
  bn,
  xn,
  On,
  tn,
  en,
  Pn,
  Tn,
  cn,
  we,
  Pe,
  Nt,
  pe,
  ue,
  ln,
  hn
], Li = [
  pe,
  we,
  Pe,
  ve
];
function H(...r) {
  return (...t) => {
    for (const e of r)
      e && e(...t);
  };
}
function Ei(r, t) {
  return t ? (e, n) => {
    e.save(), t(e, n), r(e, n), e.restore();
  } : r;
}
function Fi(r) {
  return r === W.Relative ? (t, e) => {
    const { a: n, b: i, c: s, d: o, e: a, f: h } = e.getBitmapTransformationToTransformedInfiniteCanvasContext();
    t.transform(n, i, s, o, a, h);
  } : r === W.Absolute ? (t, e) => {
    const { a: n, b: i, c: s, d: o, e: a, f: h } = e.getBitmapTransformationToInfiniteCanvasContext();
    t.setTransform(n, i, s, o, a, h);
  } : null;
}
const Ht = class Bn {
  constructor(t) {
    this.fillStyle = t.fillStyle, this.lineWidth = t.lineWidth, this.lineCap = t.lineCap, this.lineJoin = t.lineJoin, this.lineDash = t.lineDash, this.miterLimit = t.miterLimit, this.globalAlpha = t.globalAlpha, this.globalCompositeOperation = t.globalCompositeOperation, this.filter = t.filter, this.strokeStyle = t.strokeStyle, this.lineDashOffset = t.lineDashOffset, this.transformation = t.transformation, this.direction = t.direction, this.imageSmoothingEnabled = t.imageSmoothingEnabled, this.imageSmoothingQuality = t.imageSmoothingQuality, this.font = t.font, this.textAlign = t.textAlign, this.textBaseline = t.textBaseline, this.clippedPaths = t.clippedPaths, this.fillAndStrokeStylesTransformed = t.fillAndStrokeStylesTransformed, this.shadowOffset = t.shadowOffset, this.shadowColor = t.shadowColor, this.shadowBlur = t.shadowBlur;
  }
  changeProperty(t, e) {
    const {
      fillStyle: n,
      lineWidth: i,
      lineDash: s,
      lineCap: o,
      lineJoin: a,
      miterLimit: h,
      globalAlpha: l,
      globalCompositeOperation: f,
      filter: u,
      strokeStyle: g,
      lineDashOffset: p,
      transformation: P,
      direction: x,
      imageSmoothingEnabled: k,
      imageSmoothingQuality: G,
      font: Q,
      textAlign: gt,
      textBaseline: mt,
      clippedPaths: vt,
      fillAndStrokeStylesTransformed: pt,
      shadowOffset: ee,
      shadowColor: ne,
      shadowBlur: ie
    } = this, At = {
      fillStyle: n,
      lineWidth: i,
      lineDash: s,
      lineCap: o,
      lineJoin: a,
      miterLimit: h,
      globalAlpha: l,
      globalCompositeOperation: f,
      filter: u,
      strokeStyle: g,
      lineDashOffset: p,
      transformation: P,
      direction: x,
      imageSmoothingEnabled: k,
      imageSmoothingQuality: G,
      font: Q,
      textAlign: gt,
      textBaseline: mt,
      clippedPaths: vt,
      fillAndStrokeStylesTransformed: pt,
      shadowOffset: ee,
      shadowColor: ne,
      shadowBlur: ie
    };
    return At[t] = e, new Bn(At);
  }
  get clippingRegion() {
    return this.clippedPaths ? this.clippedPaths.area : void 0;
  }
  equals(t) {
    for (let e of re)
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
    for (let t of re)
      if (!t.valueIsTransformableForInstance(this))
        return !1;
    return !0;
  }
  getShadowOffsets() {
    const t = [], e = this.filter.getShadowOffset();
    return e !== null && t.push(e), this.shadowOffset.equals(c.origin) || t.push(this.shadowOffset), t;
  }
  getInstructionToConvertToState(t) {
    return this.getInstructionToConvertToStateOnDimensions(t, re);
  }
  withClippedPath(t) {
    const e = this.clippedPaths ? this.clippedPaths.withClippedPath(t) : new qt(t.area, t);
    return this.changeProperty("clippedPaths", e);
  }
  getInstructionToConvertToStateOnDimensions(t, e) {
    const n = e.map((i) => i.getInstructionToChange(this, t));
    return H(...n);
  }
};
Ht.default = new Ht({
  fillStyle: "#000",
  lineWidth: 1,
  lineDash: [],
  lineCap: "butt",
  lineJoin: "miter",
  miterLimit: 10,
  globalAlpha: 1,
  globalCompositeOperation: "source-over",
  filter: wn.none,
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
  shadowOffset: c.origin,
  shadowColor: "rgba(0, 0, 0, 0)",
  shadowBlur: 0
});
Ht.setDefault = () => {
};
let M = Ht;
class Wi {
  constructor(t) {
    this.viewBox = t;
  }
  createImageData(t, e) {
  }
  getImageData(t, e, n, i) {
  }
  putImageData(t, e, n, i, s, o, a) {
    t = Ti(t, i, s, o, a);
    let h, l = this.viewBox.getDrawingLock();
    this.viewBox.createPatternFromImageData(t).then((u) => {
      h = u, l.release();
    }), this.viewBox.addDrawing((u) => {
      u.translate(e, n), u.fillStyle = h, u.fillRect(0, 0, t.width, t.height);
    }, m.createRectangle(e, n, t.width, t.height), W.Absolute, !1, (u) => u.changeProperty("shadowColor", M.default.shadowColor).changeProperty("shadowOffset", M.default.shadowOffset).changeProperty("shadowBlur", M.default.shadowBlur).changeProperty("globalAlpha", M.default.globalAlpha).changeProperty("globalCompositeOperation", M.default.globalCompositeOperation).changeProperty("imageSmoothingEnabled", !1).changeProperty("filter", M.default.filter));
  }
}
class ki {
  constructor(t) {
    this.viewBox = t;
  }
  get lineCap() {
    return this.viewBox.state.current.lineCap;
  }
  set lineCap(t) {
    this.viewBox.changeState((e) => bn.changeInstanceValue(e, t));
  }
  get lineDashOffset() {
    return this.viewBox.state.current.lineDashOffset;
  }
  set lineDashOffset(t) {
    this.viewBox.changeState((e) => Sn.changeInstanceValue(e, t));
  }
  get lineJoin() {
    return this.viewBox.state.current.lineJoin;
  }
  set lineJoin(t) {
    this.viewBox.changeState((e) => xn.changeInstanceValue(e, t));
  }
  get lineWidth() {
    return this.viewBox.state.current.lineWidth;
  }
  set lineWidth(t) {
    this.viewBox.changeState((e) => Tn.changeInstanceValue(e, t));
  }
  get miterLimit() {
    return this.viewBox.state.current.miterLimit;
  }
  set miterLimit(t) {
    this.viewBox.changeState((e) => On.changeInstanceValue(e, t));
  }
  getLineDash() {
    return this.viewBox.state.current.lineDash;
  }
  setLineDash(t) {
    t.length % 2 === 1 && (t = t.concat(t)), this.viewBox.changeState((e) => yn.changeInstanceValue(e, t));
  }
}
class Ri {
  constructor(t) {
    this.viewBox = t;
  }
  set direction(t) {
    this.viewBox.changeState((e) => ve.changeInstanceValue(e, t));
  }
  set font(t) {
    this.viewBox.changeState((e) => pe.changeInstanceValue(e, t));
  }
  set textAlign(t) {
    this.viewBox.changeState((e) => we.changeInstanceValue(e, t));
  }
  set textBaseline(t) {
    this.viewBox.changeState((e) => Pe.changeInstanceValue(e, t));
  }
}
function C(r) {
  return r.direction !== void 0;
}
class wt {
  static arc(t, e, n, i, s, o) {
    return {
      instruction: (l, f) => {
        const u = f.userTransformation, g = u.getRotationAngle(), { x: p, y: P } = u.apply(new c(t, e));
        l.arc(p, P, n * u.scale, i + g, s + g, o);
      },
      changeArea: (l) => {
        l.addPosition(new c(t - n, e - n)), l.addPosition(new c(t - n, e + n)), l.addPosition(new c(t + n, e - n)), l.addPosition(new c(t + n, e + n));
      },
      positionChange: new c(t, e).plus(v.rotation(0, 0, s).apply(new c(n, 0))),
      initialPoint: new c(t, e).plus(v.rotation(0, 0, i).apply(new c(n, 0)))
    };
  }
  static arcTo(t, e, n, i, s) {
    const o = new c(t, e), a = new c(n, i);
    return {
      instruction: (f, u) => {
        const g = u.userTransformation, p = g.apply(o), P = g.apply(a);
        f.arcTo(p.x, p.y, P.x, P.y, s * g.scale);
      },
      changeArea: (f) => {
        f.addPosition(o), f.addPosition(a);
      },
      positionChange: new c(n, i)
    };
  }
  static ellipse(t, e, n, i, s, o, a, h) {
    return {
      instruction: (l, f) => {
        const u = f.userTransformation, g = u.apply(new c(t, e)), p = u.getRotationAngle();
        l.ellipse(g.x, g.y, n * u.scale, i * u.scale, s + p, o, a, h);
      },
      changeArea: (l) => {
        l.addPosition(new c(t - n, e - i)), l.addPosition(new c(t - n, e + i)), l.addPosition(new c(t + n, e - i)), l.addPosition(new c(t + n, e + i));
      },
      positionChange: new c(t, e).plus(
        v.rotation(0, 0, a).before(
          new v(n, 0, 0, i, 0, 0)
        ).before(
          v.rotation(0, 0, s)
        ).apply(new c(1, 0))
      ),
      initialPoint: new c(t, e).plus(
        v.rotation(0, 0, o).before(
          new v(n, 0, 0, i, 0, 0)
        ).before(
          v.rotation(0, 0, s)
        ).apply(new c(1, 0))
      )
    };
  }
  static bezierCurveTo(t, e, n, i, s, o) {
    return {
      instruction: (a, h) => {
        const l = h.userTransformation, f = l.apply(new c(t, e)), u = l.apply(new c(n, i)), g = l.apply(new c(s, o));
        a.bezierCurveTo(f.x, f.y, u.x, u.y, g.x, g.y);
      },
      changeArea: (a, h) => {
        C(h) || (a.addPosition(new c((h.x + t) / 2, (h.y + e) / 2)), a.addPosition(new c((t + n) / 2, (e + i) / 2)), a.addPosition(new c((n + s) / 2, (i + o) / 2)), a.addPosition(new c(s, o)));
      },
      positionChange: new c(s, o)
    };
  }
  static quadraticCurveTo(t, e, n, i) {
    return {
      instruction: (s, o) => {
        const a = o.userTransformation, h = a.apply(new c(t, e)), l = a.apply(new c(n, i));
        s.quadraticCurveTo(h.x, h.y, l.x, l.y);
      },
      changeArea: (s, o) => {
        C(o) || (s.addPosition(new c((o.x + t) / 2, (o.y + e) / 2)), s.addPosition(new c((t + n) / 2, (e + i) / 2)), s.addPosition(new c(n, i)));
      },
      positionChange: new c(n, i)
    };
  }
}
class Ni {
  constructor(t) {
    this.viewBox = t;
  }
  arc(t, e, n, i, s, o) {
    this.viewBox.addPathInstruction(wt.arc(t, e, n, i, s, o));
  }
  arcTo(t, e, n, i, s) {
    this.viewBox.addPathInstruction(wt.arcTo(t, e, n, i, s));
  }
  closePath() {
    this.viewBox.closePath();
  }
  ellipse(t, e, n, i, s, o, a, h) {
    this.viewBox.addPathInstruction(wt.ellipse(t, e, n, i, s, o, a, h));
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
    this.viewBox.addPathInstruction(wt.quadraticCurveTo(t, e, n, i));
  }
  bezierCurveTo(t, e, n, i, s, o) {
    this.viewBox.addPathInstruction(wt.bezierCurveTo(t, e, n, i, s, o));
  }
  rect(t, e, n, i) {
    this.viewBox.rect(t, e, n, i);
  }
}
class Mi {
  constructor(t, e, n) {
    this.canvas = t, this.canvasState = new Jn(e), this.canvasTransform = new _n(e), this.canvasCompositing = new ni(e), this.canvasImageSmoothing = new ri(e), this.canvasStrokeStyles = new oi(e), this.canvasShadowStyles = new li(e), this.canvasFilters = new di(e, n), this.canvasRect = new fi(e), this.canvasDrawPath = new gi(e), this.canvasUserInterface = new mi(), this.canvasText = new Ci(e), this.canvasDrawImage = new Ii(e), this.canvasImageData = new Wi(e), this.canvasPathDrawingStyles = new ki(e), this.canvasTextDrawingStyles = new Ri(e), this.canvasPath = new Ni(e);
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
  setTransform(t, e, n, i, s, o) {
    this.canvasTransform.setTransform(t, e, n, i, s, o);
  }
  transform(t, e, n, i, s, o) {
    this.canvasTransform.transform(t, e, n, i, s, o);
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
  createRadialGradient(t, e, n, i, s, o) {
    return this.canvasStrokeStyles.createRadialGradient(t, e, n, i, s, o);
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
  putImageData(t, e, n, i, s, o, a) {
    this.canvasImageData.putImageData(t, e, n, i, s, o, a);
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
  arc(t, e, n, i, s, o) {
    this.canvasPath.arc(t, e, n, i, s, o);
  }
  arcTo(t, e, n, i, s) {
    this.canvasPath.arcTo(t, e, n, i, s);
  }
  bezierCurveTo(t, e, n, i, s, o) {
    this.canvasPath.bezierCurveTo(t, e, n, i, s, o);
  }
  closePath() {
    this.canvasPath.closePath();
  }
  ellipse(t, e, n, i, s, o, a, h) {
    this.canvasPath.ellipse(t, e, n, i, s, o, a);
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
    if (!Number.isFinite(t) && !Number.isFinite(e))
      throw new Error(`The starting coordinates provided (${t} and ${e}) do not determine a direction.`);
    this.canvasPath.rect(t, e, n, i);
  }
}
class Ce extends Vt {
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
class Vi extends Ce {
  constructor(t, e, n, i, s) {
    super(), this.context = t, this.x0 = e, this.y0 = n, this.x1 = i, this.y1 = s;
  }
  createTransformedGradient(t) {
    const { x: e, y: n } = t.apply(new c(this.x0, this.y0)), { x: i, y: s } = t.apply(new c(this.x1, this.y1)), o = this.context.createLinearGradient(e, n, i, s);
    return this.addColorStopsToGradient(o), o;
  }
  createGradient() {
    const t = this.context.createLinearGradient(this.x0, this.y0, this.x1, this.y1);
    return this.addColorStopsToGradient(t), t;
  }
}
class qi extends Ce {
  constructor(t, e, n, i, s, o, a) {
    super(), this.context = t, this.x0 = e, this.y0 = n, this.r0 = i, this.x1 = s, this.y1 = o, this.r1 = a;
  }
  createTransformedGradient(t) {
    const { x: e, y: n } = t.apply(new c(this.x0, this.y0)), { x: i, y: s } = t.apply(new c(this.x1, this.y1)), o = this.r0 * t.scale, a = this.r1 * t.scale, h = this.context.createRadialGradient(e, n, o, i, s, a);
    return this.addColorStopsToGradient(h), h;
  }
  createGradient() {
    const t = this.context.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1);
    return this.addColorStopsToGradient(t), t;
  }
}
class Ie {
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
class Te extends Ie {
  constructor(t) {
    super(t), this._initiallyWithState = t;
  }
  execute(t, e) {
    this._initiallyWithState.execute(t, e);
    for (const n of this.added)
      n.execute(t, e);
  }
}
class An {
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
class Se extends An {
  changeCurrentInstanceTo(t) {
    if (!this.currentState.current.equals(t)) {
      if (!Se.canConvert(this.currentState.current, t))
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
class Y {
  constructor(t, e = []) {
    this.current = t, this.stack = e;
  }
  replaceCurrent(t) {
    return new Y(t, this.stack);
  }
  withCurrentState(t) {
    return new Y(t, this.stack);
  }
  currentlyTransformed(t) {
    return this.withCurrentState(this.current.changeProperty("fillAndStrokeStylesTransformed", t));
  }
  withClippedPath(t) {
    return new Y(this.current.withClippedPath(t), this.stack);
  }
  saved() {
    return new Y(this.current, (this.stack || []).concat([this.current]));
  }
  restored() {
    if (!this.stack || this.stack.length === 0)
      return this;
    const t = this.stack[this.stack.length - 1];
    return new Y(t, this.stack.slice(0, this.stack.length - 1));
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
    const n = Y.findIndexOfHighestCommon(this.stack, e.stack);
    return this.convertToLastSavedInstance(t, n), e.convertFromLastSavedInstance(t, n), t.instruction;
  }
  getInstructionToConvertToState(t) {
    return this.getInstructionToConvertToStateUsingConversion(new An(this), t);
  }
  getInstructionToConvertToStateWithClippedPath(t) {
    return this.getInstructionToConvertToStateUsingConversion(new Se(this), t);
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
const He = new Y(M.default, []);
class ye {
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
class it extends ye {
  constructor(t, e, n, i) {
    super(t, e), this.instruction = n, this.stateConversion = i;
  }
  execute(t, e) {
    this.stateConversion && this.stateConversion(t, e), this.instruction(t, e);
  }
  static create(t, e) {
    return new it(t, t, e, () => {
    });
  }
}
class Hi {
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
class be extends it {
  constructor(t, e, n, i, s) {
    super(t, e, n, i), this.drawingArea = new Hi(s);
  }
  static createClearRect(t, e, n, i, s, o, a) {
    return new be(t, t, (h, l) => {
      n.clearRect(h, l, i, s, o, a);
    }, () => {
    }, e);
  }
}
const z = { direction: new c(0, 1) }, U = { direction: new c(0, -1) }, _ = { direction: new c(-1, 0) }, tt = { direction: new c(1, 0) };
function Gi(r, t, e) {
  let n = 0, i;
  for (let s of r) {
    const o = s.minus(t).dot(e);
    o > n && (i = s, n = o);
  }
  return i ? t.plus(i.minus(t).projectOn(e)) : t;
}
function D(r, t, e) {
  return Gi(r.getVertices(), t, e);
}
class Xi {
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
      const s = n.transform(v.translation(-i.x, -i.y));
      n = n.join(s);
    }
    return n;
  }
  clearRect(t, e, n, i, s, o) {
    const a = this.getTransformedViewbox(e), { a: h, b: l, c: f, d: u, e: g, f: p } = e.userTransformation;
    t.save(), t.transform(h, l, f, u, g, p);
    const P = Number.isFinite(n) ? n : D(a, new c(0, 0), n > 0 ? tt.direction : _.direction).x, x = Number.isFinite(s) ? n + s : D(a, new c(0, 0), s > 0 ? tt.direction : _.direction).x, k = Number.isFinite(i) ? i : D(a, new c(0, 0), i > 0 ? z.direction : U.direction).y, G = Number.isFinite(o) ? i + o : D(a, new c(0, 0), o > 0 ? z.direction : U.direction).y;
    t.clearRect(P, k, x - P, G - k), t.restore();
  }
  moveToInfinityFromPointInDirection(t, e, n, i) {
    const s = D(this.getTransformedViewbox(e), n, i);
    this.moveToTransformed(t, s, e.userTransformation);
  }
  drawLineToInfinityFromInfinityFromPoint(t, e, n, i, s) {
    const o = this.getTransformedViewbox(e), a = D(o, n, i), h = D(o, n, s), l = e.userTransformation, u = o.expandToIncludePoint(n).expandToIncludePoint(a).expandToIncludePoint(h).getVertices().filter((P) => !P.equals(a) && !P.equals(h) && !P.equals(n) && P.minus(n).isInSmallerAngleBetweenPoints(i, s));
    u.sort((P, x) => P.minus(n).isInSmallerAngleBetweenPoints(x.minus(n), i) ? -1 : 1);
    let g = a, p = 0;
    for (let P of u)
      p += P.minus(g).mod(), this.lineToTransformed(t, P, l), g = P;
    p += h.minus(g).mod(), this.lineToTransformed(t, h, l), this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, l, p, h, s);
  }
  drawLineFromInfinityFromPointToInfinityFromPoint(t, e, n, i, s) {
    const o = this.getTransformedViewbox(e), a = D(o, n, s), h = e.userTransformation, l = D(o, i, s);
    this.lineToTransformed(t, l, h);
    const f = l.minus(a).mod();
    this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, h, f, l, s);
  }
  drawLineFromInfinityFromPointToPoint(t, e, n, i) {
    const s = D(this.getTransformedViewbox(e), n, i), o = n.minus(s).mod(), a = e.userTransformation;
    this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, a, o, s, i), this.lineToTransformed(t, n, a);
  }
  drawLineToInfinityFromPointInDirection(t, e, n, i) {
    const s = D(this.getTransformedViewbox(e), n, i), o = e.userTransformation;
    this.lineToTransformed(t, s, o);
    const a = s.minus(n).mod();
    this.ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, o, a, s, i);
  }
  ensureDistanceCoveredIsMultipleOfLineDashPeriod(t, e, n, i, s) {
    const o = this.drawnPathProperties.lineDashPeriod;
    if (o === 0)
      return;
    const a = this.getDistanceLeft(n, o);
    if (a === 0)
      return;
    const h = i.plus(s.scale(a / (2 * s.mod())));
    this.lineToTransformed(t, h, e), this.lineToTransformed(t, i, e);
  }
  lineToTransformed(t, e, n) {
    const { x: i, y: s } = n.apply(e);
    t.lineTo(i, s);
  }
  moveToTransformed(t, e, n) {
    const { x: i, y: s } = n.apply(e);
    t.moveTo(i, s);
  }
  getDistanceLeft(t, e) {
    if (e === 0)
      return 0;
    const n = t / e | 0;
    return t - e * n === 0 ? 0 : (n + 1) * e - t;
  }
}
class Dn {
  constructor(t) {
    this.drawnPathProperties = t;
  }
  getInfinity(t) {
    return new Xi(t, this.drawnPathProperties);
  }
}
class xe extends Te {
  reconstructState(t, e) {
    e.setInitialStateWithClippedPaths(t);
  }
  hasDrawingAcrossBorderOf(t) {
    return this.contains((e) => e.drawingArea.hasDrawingAcrossBorderOf(t));
  }
  intersects(t) {
    return this.contains((e) => e.drawingArea.intersects(t));
  }
  addClearRect(t, e, n, i, s, o) {
    const h = new Dn({ lineWidth: 0, lineDashPeriod: 0, shadowOffsets: [] }).getInfinity(e), l = be.createClearRect(e, t, h, n, i, s, o);
    l.setInitialState(this.state), this.add(l);
  }
  clearContentsInsideArea(t) {
    this.removeAll((e) => e.drawingArea.isContainedBy(t));
  }
  static create() {
    return new xe(new it(He, He, M.setDefault, () => {
    }));
  }
}
class $ extends ye {
  constructor(t, e, n, i) {
    super(t, e), this.instruction = n, this.stateConversion = i;
  }
  copy() {
    return new $(this.initialState, this.state, this.instruction, this.stateConversion);
  }
  makeExecutable() {
    return new it(this.initialState, this.state, this.instruction, this.stateConversion);
  }
  static create(t, e) {
    return new $(t, t, e, () => {
    });
  }
}
function K(r, t) {
  return C(r) ? t.applyToPointAtInfinity(r) : t.apply(r);
}
class Yi {
  constructor(t, e) {
    this.areaBuilder = t, this.transformation = e;
  }
  addPosition(t) {
    this.areaBuilder.addPosition(K(t, this.transformation));
  }
}
class Oe {
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
class Qt extends Oe {
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
      return b;
    if (this.isContainedByConvexPolygon(t))
      return this;
    const e = t.getIntersectionsWithLine(this.base, this.direction);
    let n, i;
    for (let s of e)
      (!n && !i || !n && this.comesBefore(s.point, i) || !i && this.comesBefore(n, s.point) || n && i && this.pointIsBetweenPoints(s.point, n, i)) && (s.halfPlane.normalTowardInterior.dot(this.direction) > 0 ? n = s.point : i = s.point);
    return n && i ? new A(n, i) : n ? new F(n, this.direction) : new F(i, this.direction.scale(-1));
  }
  intersectWithLine(t) {
    return this.intersectsLine(t) ? this : b;
  }
  intersectWithLineSegment(t) {
    return this.lineSegmentIsOnSameLine(t) ? t : b;
  }
  intersectWithRay(t) {
    return this.intersectsRay(t) ? t : b;
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
    return new Qt(e, t.apply(this.base.plus(this.direction)).minus(e));
  }
  interiorContainsPoint(t) {
    return this.pointIsOnSameLine(t);
  }
}
class F extends Oe {
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
      return b;
    if (this.isContainedByConvexPolygon(t))
      return this;
    const e = t.getIntersectionsWithLine(this.base, this.direction);
    let n = this.base, i;
    for (let s of e)
      (!i && this.comesBefore(n, s.point) || i && this.pointIsBetweenPoints(s.point, n, i)) && (s.halfPlane.normalTowardInterior.dot(this.direction) > 0 ? n = s.point : i = s.point);
    return i ? new A(n, i) : new F(n, this.direction);
  }
  intersectWithRay(t) {
    return this.isContainedByRay(t) ? this : t.isContainedByRay(this) ? t : this.interiorContainsPoint(t.base) ? new A(this.base, t.base) : b;
  }
  intersectWithLine(t) {
    return t.intersectWithRay(this);
  }
  intersectWithLineSegment(t) {
    if (t.isContainedByRay(this))
      return t;
    if (!this.lineSegmentIsOnSameLine(t))
      return b;
    let { point2: e } = this.getPointsInSameDirection(t.point1, t.point2);
    return this.comesBefore(e, this.base) ? b : new A(this.base, e);
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
    return this.containsPoint(t) ? this : this.pointIsOnSameLine(t) ? new F(t, this.direction) : m.createTriangleWithInfinityInDirection(this.base, t, this.direction);
  }
  expandByDistance(t) {
    const e = this.expandLineByDistance(t), n = new w(this.base, this.direction).expandByDistance(t);
    return e.intersectWithConvexPolygon(new m([n]));
  }
  expandToIncludeInfinityInDirection(t) {
    return t.inSameDirectionAs(this.direction) ? this : this.direction.cross(t) === 0 ? new Qt(this.base, this.direction) : m.createTriangleWithInfinityInTwoDirections(this.base, this.direction, t);
  }
  transform(t) {
    const e = t.apply(this.base);
    return new F(e, t.apply(this.base.plus(this.direction)).minus(e));
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
class A extends Oe {
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
      return b;
    let { point1: e, point2: n } = this.getPointsInSameDirection(t.point1, t.point2);
    return this.comesBefore(n, this.point1) || this.comesBefore(this.point2, e) ? b : this.comesBefore(this.point1, e) ? new A(e, this.point2) : new A(this.point1, n);
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
      return b;
    if (this.isContainedByConvexPolygon(t))
      return this;
    const e = t.getIntersectionsWithLine(this.point1, this.direction);
    let n = this.point1, i = this.point2;
    for (let s of e)
      this.pointIsBetweenPoints(s.point, n, i) && (s.halfPlane.normalTowardInterior.dot(this.direction) > 0 ? n = s.point : i = s.point);
    return new A(n, i);
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
    return this.containsPoint(t) ? this : this.pointIsOnSameLine(t) ? this.comesBefore(t, this.point1) ? new A(t, this.point2) : new A(this.point1, t) : m.createTriangle(this.point1, t, this.point2);
  }
  expandToIncludeInfinityInDirection(t) {
    return t.inSameDirectionAs(this.direction) ? new F(this.point1, t) : t.cross(this.direction) === 0 ? new F(this.point2, t) : m.createTriangleWithInfinityInDirection(this.point1, this.point2, t);
  }
  transform(t) {
    return new A(t.apply(this.point1), t.apply(this.point2));
  }
}
class zi {
  addPoint(t) {
    return Ct;
  }
  addPointAtInfinity(t) {
    return this;
  }
  addArea(t) {
    return Ct;
  }
}
const Be = new zi();
class fe {
  constructor(t) {
    this.towardsMiddle = t;
  }
  addPoint(t) {
    return m.createFromHalfPlane(new w(t, this.towardsMiddle));
  }
  addPointAtInfinity(t) {
    return t.dot(this.towardsMiddle) >= 0 ? this : Be;
  }
  addArea(t) {
    const e = this.towardsMiddle.getPerpendicular();
    return t.expandToIncludeInfinityInDirection(this.towardsMiddle).expandToIncludeInfinityInDirection(e).expandToIncludeInfinityInDirection(e.scale(-1));
  }
}
class Gt {
  constructor(t, e) {
    this.direction1 = t, this.direction2 = e;
  }
  addPoint(t) {
    return m.createTriangleWithInfinityInTwoDirections(t, this.direction1, this.direction2);
  }
  addPointAtInfinity(t) {
    return t.isInSmallerAngleBetweenPoints(this.direction1, this.direction2) ? this : t.cross(this.direction1) === 0 ? new fe(this.direction2.projectOn(this.direction1.getPerpendicular())) : t.cross(this.direction2) === 0 ? new fe(this.direction1.projectOn(this.direction2.getPerpendicular())) : this.direction1.isInSmallerAngleBetweenPoints(t, this.direction2) ? new Gt(t, this.direction2) : this.direction2.isInSmallerAngleBetweenPoints(t, this.direction1) ? new Gt(t, this.direction1) : Be;
  }
  addArea(t) {
    return t.expandToIncludeInfinityInDirection(this.direction1).expandToIncludeInfinityInDirection(this.direction2);
  }
}
class Ui {
  constructor(t) {
    this.direction = t;
  }
  addPoint(t) {
    return new Qt(t, this.direction);
  }
  addPointAtInfinity(t) {
    return t.cross(this.direction) === 0 ? this : new fe(t.projectOn(this.direction.getPerpendicular()));
  }
  addArea(t) {
    return t.expandToIncludeInfinityInDirection(this.direction).expandToIncludeInfinityInDirection(this.direction.scale(-1));
  }
}
class $i {
  constructor(t) {
    this.direction = t;
  }
  addPointAtInfinity(t) {
    return t.inSameDirectionAs(this.direction) ? this : t.cross(this.direction) === 0 ? new Ui(this.direction) : new Gt(this.direction, t);
  }
  addPoint(t) {
    return new F(t, this.direction);
  }
  addArea(t) {
    return t.expandToIncludeInfinityInDirection(this.direction);
  }
}
class Ae {
  constructor(t, e, n) {
    this._area = t, this.firstPoint = e, this.subsetOfLineAtInfinity = n;
  }
  get area() {
    return this._area || b;
  }
  addPoint(t) {
    this._area ? this._area = this._area.expandToIncludePoint(t) : this.firstPoint ? t.equals(this.firstPoint) || (this._area = new A(this.firstPoint, t)) : this.subsetOfLineAtInfinity ? this._area = this.subsetOfLineAtInfinity.addPoint(t) : this.firstPoint = t;
  }
  addPosition(t) {
    C(t) ? this.addInfinityInDirection(t.direction) : this.addPoint(t);
  }
  addInfinityInDirection(t) {
    this._area ? this._area = this._area.expandToIncludeInfinityInDirection(t) : this.firstPoint ? this._area = new F(this.firstPoint, t) : this.subsetOfLineAtInfinity ? (this.subsetOfLineAtInfinity = this.subsetOfLineAtInfinity.addPointAtInfinity(t), this.subsetOfLineAtInfinity === Be && (this._area = Ct)) : this.subsetOfLineAtInfinity = new $i(t);
  }
  transformedWith(t) {
    return new Yi(this, t);
  }
  copy() {
    return new Ae(this._area, this.firstPoint, this.subsetOfLineAtInfinity);
  }
}
class It extends ye {
  constructor(t, e, n, i) {
    super(t, e), this.instruction = n, this.stateConversion = i;
  }
  replaceInstruction(t) {
    this.instruction = t;
  }
  copy() {
    return new It(this.initialState, this.state, this.instruction, this.stateConversion);
  }
  makeExecutable(t) {
    const e = t.getInfinity(this.state), n = this.instruction, i = (s, o) => n(s, o, e);
    return new it(this.initialState, this.state, i, this.stateConversion);
  }
  static create(t, e) {
    return new It(t, t, e, () => {
    });
  }
}
function Ki(r, t) {
  return r ? t ? C(r) ? C(t) && r.direction.equals(t.direction) : !C(t) && r.equals(t) : !r : !t;
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
    return (n, i, s) => {
      s.moveToInfinityFromPointInDirection(n, i, t, e);
    };
  }
  lineFromInfinityFromPointToInfinityFromPoint(t, e, n) {
    return (i, s, o) => {
      o.drawLineFromInfinityFromPointToInfinityFromPoint(i, s, t, e, n);
    };
  }
  lineFromInfinityFromPointToPoint(t, e) {
    return (n, i, s) => {
      s.drawLineFromInfinityFromPointToPoint(n, i, t, e);
    };
  }
  lineToInfinityFromPointInDirection(t, e) {
    return (n, i, s) => {
      s.drawLineToInfinityFromPointInDirection(n, i, t, e);
    };
  }
  lineToInfinityFromInfinityFromPoint(t, e, n) {
    return (i, s, o) => {
      o.drawLineToInfinityFromInfinityFromPoint(i, s, t, e, n);
    };
  }
  lineTo(t) {
    return (e, n) => {
      const { x: i, y: s } = n.userTransformation.apply(t);
      e.lineTo(i, s);
    };
  }
  moveTo(t) {
    return (e, n) => {
      const { x: i, y: s } = n.userTransformation.apply(t);
      e.moveTo(i, s);
    };
  }
}
class Jt {
  constructor(t, e, n, i) {
    this.initialPosition = t, this.firstFinitePoint = e, this.lastFinitePoint = n, this.currentPosition = i;
  }
  transform(t) {
    return new Jt(
      t.applyToPointAtInfinity(this.initialPosition),
      t.apply(this.firstFinitePoint),
      t.apply(this.lastFinitePoint),
      t.applyToPointAtInfinity(this.currentPosition)
    );
  }
}
class xt {
  constructor(t, e, n) {
    this.initialPosition = t, this.firstFinitePoint = e, this.currentPosition = n;
  }
  transform(t) {
    return new xt(
      t.applyToPointAtInfinity(this.initialPosition),
      t.apply(this.firstFinitePoint),
      t.apply(this.currentPosition)
    );
  }
}
class ji extends bt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    return t.initialPosition.direction.cross(t.currentPosition.direction) === 0 ? this.moveToInfinityFromPointInDirection(t.firstFinitePoint, t.initialPosition.direction) : H(
      this.moveToInfinityFromPointInDirection(t.lastFinitePoint, t.currentPosition.direction),
      this.lineToInfinityFromInfinityFromPoint(t.lastFinitePoint, t.currentPosition.direction, t.initialPosition.direction),
      this.lineFromInfinityFromPointToInfinityFromPoint(t.lastFinitePoint, t.firstFinitePoint, t.initialPosition.direction)
    );
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    return C(e) ? this.lineToInfinityFromInfinityFromPoint(t.lastFinitePoint, t.currentPosition.direction, e.direction) : H(
      this.lineFromInfinityFromPointToInfinityFromPoint(t.lastFinitePoint, e, t.currentPosition.direction),
      this.lineFromInfinityFromPointToPoint(e, t.currentPosition.direction)
    );
  }
  containsFinitePoint() {
    return !0;
  }
  isClosable() {
    return !this.shape.initialPosition.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
  }
  canAddLineTo(t) {
    return !C(t) || !t.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
  }
  addPosition(t) {
    return C(t) ? this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(new Jt(this.shape.initialPosition, this.shape.firstFinitePoint, this.shape.lastFinitePoint, t)) : this.pathBuilderProvider.fromPointAtInfinityToPoint(new xt(this.shape.initialPosition, this.shape.firstFinitePoint, t));
  }
}
class Qi extends bt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    const e = this.moveToInfinityFromPointInDirection(t.currentPosition, t.initialPosition.direction);
    if (t.currentPosition.equals(t.firstFinitePoint))
      return e;
    const n = this.lineFromInfinityFromPointToInfinityFromPoint(t.currentPosition, t.firstFinitePoint, t.initialPosition.direction);
    return H(e, n);
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
  isClosable() {
    return !0;
  }
  addPosition(t) {
    return C(t) ? this.pathBuilderProvider.fromPointAtInfinityToPointAtInfinity(new Jt(this.shape.initialPosition, this.shape.firstFinitePoint, this.shape.currentPosition, t)) : this.pathBuilderProvider.fromPointAtInfinityToPoint(new xt(this.shape.initialPosition, this.shape.firstFinitePoint, t));
  }
}
class Zt {
  constructor(t, e) {
    this.initialPoint = t, this.currentPosition = e;
  }
  transform(t) {
    return new Zt(
      t.apply(this.initialPoint),
      t.applyToPointAtInfinity(this.currentPosition)
    );
  }
}
class Ot {
  constructor(t, e) {
    this.initialPoint = t, this.currentPosition = e;
  }
  transform(t) {
    return new Ot(
      t.apply(this.initialPoint),
      t.apply(this.currentPosition)
    );
  }
}
class Ji extends bt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    return this.moveTo(t.initialPoint);
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    return C(e) ? e.direction.inSameDirectionAs(t.currentPosition.direction) ? () => {
    } : this.lineToInfinityFromInfinityFromPoint(t.initialPoint, t.currentPosition.direction, e.direction) : H(this.lineFromInfinityFromPointToInfinityFromPoint(t.initialPoint, e, t.currentPosition.direction), this.lineFromInfinityFromPointToPoint(e, t.currentPosition.direction));
  }
  canAddLineTo(t) {
    return !C(t) || !t.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
  }
  containsFinitePoint() {
    return !0;
  }
  isClosable() {
    return !0;
  }
  addPosition(t) {
    return C(t) ? this.pathBuilderProvider.fromPointToPointAtInfinity(new Zt(this.shape.initialPoint, t)) : this.pathBuilderProvider.fromPointToPoint(new Ot(this.shape.initialPoint, t));
  }
}
class Ge extends bt {
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
      return H(n, i);
    }
    return this.lineTo(e);
  }
  canAddLineTo(t) {
    return !0;
  }
  containsFinitePoint() {
    return !0;
  }
  isClosable() {
    return !0;
  }
  addPosition(t) {
    return C(t) ? this.pathBuilderProvider.fromPointToPointAtInfinity(new Zt(this.shape.initialPoint, t)) : this.pathBuilderProvider.fromPointToPoint(new Ot(this.shape.initialPoint, t));
  }
}
class _t {
  constructor(t, e, n, i) {
    this.initialPosition = t, this.containsFinitePoint = e, this.positionsSoFar = n, this.currentPosition = i;
  }
  transform(t) {
    return new _t(
      t.applyToPointAtInfinity(this.initialPosition),
      this.containsFinitePoint,
      this.positionsSoFar.map((e) => t.applyToPointAtInfinity(e)),
      t.applyToPointAtInfinity(this.currentPosition)
    );
  }
}
class Xe extends bt {
  constructor(t, e) {
    super(e), this.pathBuilderProvider = t;
  }
  getInstructionToMoveToBeginningOfShape(t) {
    return t.containsFinitePoint ? (e, n, i) => i.addPathAroundViewbox(e, n) : () => {
    };
  }
  getInstructionToExtendShapeWithLineTo(t, e) {
    if (C(e))
      return;
    if (t.positionsSoFar.length === 1)
      return this.lineFromInfinityFromPointToPoint(e, t.positionsSoFar[0].direction);
    const n = t.positionsSoFar.slice(1);
    let i = t.initialPosition;
    const s = [];
    for (let o of n)
      s.push(this.lineToInfinityFromInfinityFromPoint(e, i.direction, o.direction)), i = o;
    return H(H(...s), this.lineFromInfinityFromPointToPoint(e, i.direction));
  }
  canAddLineTo(t) {
    return !C(t) || !t.direction.isInOppositeDirectionAs(this.shape.currentPosition.direction);
  }
  containsFinitePoint() {
    return this.shape.containsFinitePoint;
  }
  isClosable() {
    return !0;
  }
  addPosition(t) {
    if (C(t)) {
      const n = t.direction.isOnSameSideOfOriginAs(this.shape.initialPosition.direction, this.shape.currentPosition.direction) ? this.shape.containsFinitePoint : !this.shape.containsFinitePoint;
      return this.pathBuilderProvider.atInfinity(new _t(this.shape.initialPosition, n, this.shape.positionsSoFar.concat([t]), t));
    }
    return this.pathBuilderProvider.fromPointAtInfinityToPoint(new xt(this.shape.initialPosition, t, t));
  }
}
class Zi {
  fromPointAtInfinityToPointAtInfinity(t) {
    return new ji(this, t);
  }
  fromPointAtInfinityToPoint(t) {
    return new Qi(this, t);
  }
  fromPointToPointAtInfinity(t) {
    return new Ji(this, t);
  }
  fromPointToPoint(t) {
    return new Ge(this, t);
  }
  atInfinity(t) {
    return new Xe(this, t);
  }
  getBuilderFromPosition(t) {
    return C(t) ? new Xe(this, new _t(t, !1, [t], t)) : new Ge(this, new Ot(t, t));
  }
}
class Xt extends Ie {
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
    const t = $.create(this.state, (e) => {
      e.closePath();
    });
    t.setInitialState(this.state), this.add(t);
  }
  copy() {
    const t = new Xt(this._initiallyWithState.copy(), this.pathInstructionBuilder);
    for (const e of this.added)
      t.add(e.copy());
    return t;
  }
  makeExecutable(t) {
    const e = new Te(this._initiallyWithState.makeExecutable(t));
    for (const n of this.added)
      e.add(n.makeExecutable(t));
    return e;
  }
  containsFinitePoint() {
    return this.pathInstructionBuilder.containsFinitePoint();
  }
  isClosable() {
    return this.pathInstructionBuilder.isClosable();
  }
  canAddLineTo(t) {
    return this.pathInstructionBuilder.canAddLineTo(t);
  }
  lineTo(t, e) {
    const n = K(t, e.current.transformation);
    (!C(t) || this.pathInstructionBuilder.containsFinitePoint()) && this.addInstructionToDrawLineTo(t, e), this.pathInstructionBuilder = this.pathInstructionBuilder.addPosition(n);
    const i = this.pathInstructionBuilder.getInstructionToMoveToBeginning(this._initiallyWithState.state);
    this._initiallyWithState.replaceInstruction((s, o, a) => {
      i(s, o, a);
    });
  }
  addInstructionToDrawLineTo(t, e) {
    const n = this.pathInstructionBuilder.getInstructionToDrawLineTo(t, e), i = It.create(e, n);
    i.setInitialState(this.state), this.add(i);
  }
  addPathInstruction(t, e, n) {
    t.initialPoint && !Ki(this.pathInstructionBuilder.currentPosition, t.initialPoint) && this.lineTo(t.initialPoint, n), t.positionChange && (this.pathInstructionBuilder = this.pathInstructionBuilder.addPosition(K(t.positionChange, n.current.transformation))), e.setInitialState(this.state), this.add(e);
  }
  static create(t, e) {
    const n = K(e, t.current.transformation), i = new Zi().getBuilderFromPosition(n), s = i.getInstructionToMoveToBeginning(t), o = It.create(t, s);
    return new Xt(o, i);
  }
}
function Ye(r, t) {
  return Number.isFinite(r) ? !0 : Number.isFinite(t) ? !1 : r < 0 && t > 0 || r > 0 && t < 0;
}
function Yt(r, t, e, n) {
  return Ye(r, e) && Ye(t, n);
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
class ut extends Ie {
  constructor(t) {
    super(t), this._initiallyWithState = t, this.areaBuilder = new Ae();
  }
  get area() {
    return this.areaBuilder.area;
  }
  containsFinitePoint() {
    for (const t of this.added)
      if (t.containsFinitePoint())
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
    const i = this.added[this.added.length - 1], s = $.create(e, t);
    return i.addInstruction(s), this.makeExecutable(n);
  }
  makeExecutable(t) {
    const e = new Te(this._initiallyWithState.makeExecutable()), n = new Dn(t);
    for (const i of this.added)
      e.add(i.makeExecutable(n));
    return e;
  }
  clipPath(t, e) {
    if (this.added.length === 0)
      return;
    const n = this.added[this.added.length - 1], i = $.create(e, t);
    n.addInstruction(i);
    const s = this.recreatePath();
    this.addClippedPath(s.getInstructionsToClip());
  }
  closePath() {
    if (this.added.length === 0)
      return;
    this.added[this.added.length - 1].closePath();
  }
  moveTo(t, e) {
    const n = K(t, e.current.transformation);
    this.areaBuilder.addPosition(n);
    const i = Xt.create(e, t);
    i.setInitialState(this.state), this.add(i);
  }
  canAddLineTo(t, e) {
    if (this.added.length === 0)
      return !0;
    const n = K(t, e.current.transformation);
    return this.added[this.added.length - 1].canAddLineTo(n);
  }
  lineTo(t, e) {
    if (this.added.length === 0) {
      this.moveTo(t, e);
      return;
    }
    const n = this.added[this.added.length - 1], i = K(t, e.current.transformation);
    this.areaBuilder.addPosition(i), n.lineTo(t, e);
  }
  moveToPositionDeterminedBy(t, e, n) {
    Number.isFinite(t) ? Number.isFinite(e) ? this.moveTo(new c(t, e), n) : this.moveTo(e < 0 ? U : z, n) : this.moveTo(t < 0 ? _ : tt, n);
  }
  rect(t, e, n, i, s) {
    if (!Number.isFinite(t) && !Number.isFinite(e)) {
      this.moveTo({ direction: new c(1, 0) }, s), this.lineTo({ direction: new c(0, 1) }, s), this.lineTo({ direction: new c(-1, -1) }, s);
      return;
    }
    this.moveToPositionDeterminedBy(t, e, s), Yt(t, e, n, i) && (Number.isFinite(t) ? Number.isFinite(e) ? (Number.isFinite(n) ? (this.lineTo(new c(t + n, e), s), Number.isFinite(i) ? (this.lineTo(new c(t + n, e + i), s), this.lineTo(new c(t, e + i), s)) : this.lineTo(i > 0 ? z : U, s)) : (this.lineTo(n > 0 ? tt : _, s), Number.isFinite(i) ? this.lineTo(new c(t, e + i), s) : this.lineTo(i > 0 ? z : U, s)), this.lineTo(new c(t, e), s)) : (Number.isFinite(n) ? this.lineTo(new c(t + n, 0), s) : this.lineTo(n > 0 ? tt : _, s), this.lineTo(i > 0 ? z : U, s), this.lineTo(new c(t, 0), s), this.lineTo(e < 0 ? U : z, s)) : (this.lineTo(new c(0, e), s), this.lineTo(n > 0 ? tt : _, s), Number.isFinite(i) ? this.lineTo(new c(0, e + i), s) : this.lineTo(i > 0 ? z : U, s), this.lineTo(t < 0 ? _ : tt, s)), this.closePath(), this.moveToPositionDeterminedBy(t, e, s));
  }
  addPathInstruction(t, e) {
    if (this.added.length === 0)
      if (t.initialPoint)
        this.moveTo(t.initialPoint, e);
      else
        return;
    const n = this.added[this.added.length - 1], i = n.currentPosition, s = K(i, e.current.transformation.inverse());
    t.changeArea(this.areaBuilder.transformedWith(e.current.transformation), s);
    const o = $.create(e, t.instruction);
    n.addPathInstruction(t, o, e);
  }
  getInstructionsToClip() {
    return new _i(this.makeExecutable({ lineWidth: 0, lineDashPeriod: 0, shadowOffsets: [] }), this.area);
  }
  recreatePath() {
    const t = new ut(this._initiallyWithState.copy());
    for (const e of this.added)
      t.add(e.copy());
    return t.areaBuilder = this.areaBuilder.copy(), t.setInitialState(t.stateOfFirstInstruction), t;
  }
  static create(t) {
    return new ut($.create(t, (e) => {
      e.beginPath();
    }));
  }
}
function ze(r, t) {
  return Number.isFinite(r) || Number.isFinite(t) ? !1 : r < 0 && t > 0 || r > 0 && t < 0;
}
function Ln(r, t, e, n) {
  return ze(r, e) && ze(t, n);
}
class ts {
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
class es {
  constructor(t, e) {
    this.instructions = t, this.drawingArea = new ts(e);
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
function ns(r, t) {
  let e = r.area;
  return e && t.lineWidth > 0 && (e = e.expandByDistance(t.lineWidth / 2)), e;
}
function is(r) {
  return {
    lineWidth: r.current.getMaximumLineWidth(),
    lineDashPeriod: r.current.getLineDashPeriod(),
    shadowOffsets: r.current.getShadowOffsets()
  };
}
function ss(r) {
  return {
    lineWidth: 0,
    lineDashPeriod: 0,
    shadowOffsets: r.current.getShadowOffsets()
  };
}
class q {
  constructor(t, e, n, i, s, o, a) {
    this.instruction = t, this.area = e, this.build = n, this.takeClippingRegionIntoAccount = i, this.transformationKind = s, this.state = o, this.tempState = a;
  }
  static forStrokingPath(t, e, n) {
    return q.forPath(t, e, is, n);
  }
  static forFillingPath(t, e, n) {
    return q.forPath(t, e, ss, n);
  }
  static forPath(t, e, n, i) {
    const s = e.current.isTransformable(), o = s ? W.None : W.Relative, a = e.currentlyTransformed(s), h = n(a), l = i(a), f = ns(l, h);
    return new q(
      t,
      f,
      (u) => l.drawPath(u, a, h),
      !0,
      o,
      a
    );
  }
  getDrawnArea() {
    let t = this.area;
    const e = this.state;
    if (e.current.shadowBlur !== 0 || !e.current.shadowOffset.equals(c.origin)) {
      const n = t.expandByDistance(e.current.shadowBlur).transform(v.translation(e.current.shadowOffset.x, e.current.shadowOffset.y));
      t = t.join(n);
    }
    return e.current.clippingRegion && this.takeClippingRegionIntoAccount && (t = t.intersectWith(e.current.clippingRegion)), t;
  }
  getModifiedInstruction() {
    let t = Fi(this.transformationKind);
    if (this.tempState) {
      const n = this.takeClippingRegionIntoAccount ? this.state.getInstructionToConvertToStateWithClippedPath(this.tempState) : this.state.getInstructionToConvertToState(this.tempState);
      t = H(t, n);
    }
    return Ei(this.instruction, t);
  }
}
class rs {
  constructor(t) {
    this.onChange = t, this.previousInstructionsWithPath = xe.create(), this.state = this.previousInstructionsWithPath.state;
  }
  beginPath() {
    const t = ut.create(this.state);
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
  allSubpathsAreClosable() {
    return !this.currentInstructionsWithPath || this.currentInstructionsWithPath.allSubpathsAreClosable();
  }
  currentPathContainsFinitePoint() {
    return this.currentInstructionsWithPath && this.currentInstructionsWithPath.containsFinitePoint();
  }
  currentSubpathIsClosable() {
    return !this.currentInstructionsWithPath || this.currentInstructionsWithPath.currentSubpathIsClosable();
  }
  fillPath(t) {
    if (!this.currentInstructionsWithPath)
      return;
    const e = q.forFillingPath(t, this.state, () => this.currentInstructionsWithPath);
    this.state = e.state, this.incorporateDrawingInstruction(e);
  }
  strokePath() {
    if (!this.currentInstructionsWithPath)
      return;
    const t = q.forStrokingPath((e) => {
      e.stroke();
    }, this.state, () => this.currentInstructionsWithPath);
    this.state = t.state, this.incorporateDrawingInstruction(t);
  }
  fillRect(t, e, n, i, s) {
    const o = q.forFillingPath(s, this.state, (a) => {
      const h = ut.create(a);
      return h.rect(t, e, n, i, a), h;
    });
    this.incorporateDrawingInstruction(o);
  }
  strokeRect(t, e, n, i) {
    const s = q.forStrokingPath((o) => {
      o.stroke();
    }, this.state, (o) => {
      const a = ut.create(o);
      return a.rect(t, e, n, i, o), a;
    });
    this.incorporateDrawingInstruction(s);
  }
  addDrawing(t, e, n, i, s) {
    const o = this.state.currentlyTransformed(!1);
    n === W.Relative && (e = e.transform(this.state.current.transformation));
    let a;
    s && (a = o.withCurrentState(s(o.current))), this.incorporateDrawingInstruction(new q(
      t,
      e,
      (h) => it.create(o, h),
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
    if (e === b)
      return;
    const n = t.getModifiedInstruction();
    if (this.currentInstructionsWithPath) {
      const i = this.currentInstructionsWithPath.recreatePath();
      this.addToPreviousInstructions(n, e, t.build), i.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state), this.currentInstructionsWithPath = i;
    } else
      this.addToPreviousInstructions(n, e, t.build), this.state = this.previousInstructionsWithPath.state;
    this.onChange();
  }
  addToPreviousInstructions(t, e, n) {
    const i = new es(n(t), e);
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
  rect(t, e, n, i) {
    this.currentInstructionsWithPath && this.currentInstructionsWithPath.rect(t, e, n, i, this.state);
  }
  intersects(t) {
    return this.previousInstructionsWithPath.intersects(t);
  }
  clearContentsInsideArea(t) {
    this.previousInstructionsWithPath.clearContentsInsideArea(t), this.currentInstructionsWithPath && this.currentInstructionsWithPath.setInitialStateWithClippedPaths(this.previousInstructionsWithPath.state);
  }
  clearArea(t, e, n, i) {
    if (!Yt(t, e, n, i))
      return;
    const s = Ln(t, e, n, i) ? Ct : m.createRectangle(t, e, n, i), o = s.transform(this.state.current.transformation);
    this.intersects(o) && (this.clearContentsInsideArea(o), this.previousInstructionsWithPath.hasDrawingAcrossBorderOf(o) && (this.previousInstructionsWithPath.addClearRect(s, this.state, t, e, n, i), this.currentInstructionsWithPath && this.currentInstructionsWithPath.setInitialStateWithClippedPaths(this.state)), this.onChange());
  }
  execute(t, e) {
    this.previousInstructionsWithPath.length && this.previousInstructionsWithPath.execute(t, e);
    const i = this.previousInstructionsWithPath.state.stack.length;
    for (let s = 0; s < i; s++)
      t.restore();
  }
}
class os extends Ce {
  constructor(t, e, n, i) {
    super(), this.context = t, this.startAngle = e, this.x = n, this.y = i;
  }
  createTransformedGradient(t) {
    const { x: e, y: n } = t.apply(new c(this.x, this.y)), i = t.getRotationAngle(), s = this.context.createConicGradient(this.startAngle + i, e, n);
    return this.addColorStopsToGradient(s), s;
  }
  createGradient() {
    const t = this.context.createConicGradient(this.startAngle, this.x, this.y);
    return this.addColorStopsToGradient(t), t;
  }
}
class as {
  constructor(t, e, n, i, s) {
    this.rectangleManager = t, this.context = e, this.drawingIterationProvider = n, this.drawLockProvider = i, this.isTransforming = s, this.instructionSet = new rs(() => this.draw());
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
    this.context.save(), M.default.getInstructionToConvertToStateOnDimensions(this.state.currentlyTransformed(!1).current, Li)(this.context);
    const n = this.context.measureText(t);
    return this.context.restore(), n;
  }
  saveState() {
    this.instructionSet.saveState();
  }
  restoreState() {
    this.instructionSet.restoreState();
  }
  beginPath() {
    this.instructionSet.beginPath();
  }
  async createPatternFromImageData(t) {
    const e = await createImageBitmap(t);
    return this.context.createPattern(e, "no-repeat");
  }
  addDrawing(t, e, n, i, s) {
    this.instructionSet.addDrawing(t, e, n, i, s);
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
    this.instructionSet.rect(t, e, n, i);
  }
  currentPathCanBeFilled() {
    return this.instructionSet.allSubpathsAreClosable() && this.instructionSet.currentPathContainsFinitePoint();
  }
  fillPath(t) {
    this.instructionSet.fillPath(t);
  }
  strokePath() {
    this.instructionSet.strokePath();
  }
  fillRect(t, e, n, i, s) {
    Yt(t, e, n, i) && this.instructionSet.fillRect(t, e, n, i, s);
  }
  strokeRect(t, e, n, i) {
    !Yt(t, e, n, i) || Ln(t, e, n, i) || this.instructionSet.strokeRect(t, e, n, i);
  }
  clipPath(t) {
    this.instructionSet.clipPath(t);
  }
  clearArea(t, e, n, i) {
    this.instructionSet.clearArea(t, e, n, i);
  }
  createLinearGradient(t, e, n, i) {
    return new Vi(this.context, t, e, n, i);
  }
  createRadialGradient(t, e, n, i, s, o) {
    return new qi(this.context, t, e, n, i, s, o);
  }
  createConicGradient(t, e, n) {
    return new os(this.context, t, e, n);
  }
  createPattern(t, e) {
    let n;
    return n = new rn(this.context.createPattern(t, e)), n;
  }
  draw() {
    this.drawingIterationProvider.provideDrawingIteration(() => {
      this.isTransforming() || this.rectangleManager.measure(), this.rectangleManager.rectangle && (this.context.restore(), this.context.save(), this.context.clearRect(0, 0, this.width, this.height), this.setInitialTransformation(), this.instructionSet.execute(this.context, this.rectangleManager.rectangle));
    });
  }
  setInitialTransformation() {
    const t = this.rectangleManager.rectangle.initialBitmapTransformation;
    if (t.equals(v.identity))
      return;
    const { a: e, b: n, c: i, d: s, e: o, f: a } = t;
    this.context.setTransform(e, n, i, s, o, a);
  }
}
class cs {
  constructor(t, e) {
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
class hs {
  constructor(t, e, n, i, s) {
    this.transformable = t, this.centerX = e, this.centerY = n, this.onFinish = s, this.initialTransformation = t.transformation, this.maxScaleLogStep = 0.1, this.currentScaleLog = 0, this.targetScaleLog = Math.log(i), this.makeStep();
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
class ls {
  constructor(t, e) {
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
class En {
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
class us extends En {
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
class ds extends En {
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
class j extends Bt {
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
class fs {
  constructor(t, e) {
    this.setNewValue = t, this.timeoutInMs = e, this._changing = !1, this._firstChange = new j(), this._subsequentChange = new j(), this._changeEnd = new j();
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
class gs {
  constructor(t, e) {
    this.viewBox = t, this.config = e, this._transformationChangeMonitor = new fs((n) => this.viewBox.transformation = n, 100);
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
    return new ls(t, this);
  }
  getGestureForTwoAnchors(t, e) {
    return this.config.rotationEnabled ? new ds(t, e, this) : new us(t, e, this);
  }
  releaseAnchor(t) {
    this.gesture && (this.gesture = this.gesture.withoutAnchor(t));
  }
  zoom(t, e, n) {
    this._zoom && this._zoom.cancel(), this._zoom = new hs(this, t, e, n, () => {
      this._zoom = void 0;
    });
  }
  addRotationAnchor(t) {
    this.gesture = new cs(t, this);
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
class ms {
  constructor() {
    this.animationFrameRequested = !1;
  }
  provideDrawingIteration(t) {
    this.animationFrameRequested || (this.animationFrameRequested = !0, requestAnimationFrame(() => {
      t(), this.animationFrameRequested = !1;
    }));
  }
}
class vs {
  constructor(t) {
    this.drawingIterationProvider = t, this._drawHappened = new j();
  }
  get drawHappened() {
    return this._drawHappened;
  }
  provideDrawingIteration(t) {
    this.drawingIterationProvider.provideDrawingIteration(() => {
      t(), this._drawHappened.dispatch();
    });
  }
}
class ps {
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
var S = /* @__PURE__ */ ((r) => (r[r.CSS = 0] = "CSS", r[r.CANVAS = 1] = "CANVAS", r))(S || {});
class B {
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
class Tt {
  constructor(t, e, n) {
    this.userCoordinates = t, this.canvasBitmap = e, this.virtualBitmapBase = n, this.setDerivedProperties();
  }
  withCanvasBitmapDistortion(t) {
    const e = this.canvasBitmap.representBase(t), n = this.userCoordinates.representSimilarTransformation(e), i = this.virtualBitmapBase.before(n), s = new B(t);
    return new Tt(this.userCoordinates, s, i);
  }
  withUserTransformation(t) {
    return new Tt(new B(t), this.canvasBitmap, this.virtualBitmapBase);
  }
  setDerivedProperties() {
    this.infiniteCanvasContext = new B(this.virtualBitmapBase.before(this.userCoordinates.base)), this.userCoordinatesInsideCanvasBitmap = new B(this.userCoordinates.base.before(this.canvasBitmap.base)), this.initialBitmapTransformation = this.canvasBitmap.representBase(this.userCoordinates.getSimilarTransformation(this.virtualBitmapBase)), this.icContextFromCanvasBitmap = new B(this.infiniteCanvasContext.base.before(this.canvasBitmap.inverseBase));
  }
}
class St {
  constructor(t, e) {
    this.userCoordinates = t, this.canvasBitmap = e, this.setDerivedProperties();
  }
  get infiniteCanvasContext() {
    return this.userCoordinates;
  }
  withUserTransformation(t) {
    return new St(new B(t), this.canvasBitmap);
  }
  withCanvasBitmapDistortion(t) {
    return new St(this.userCoordinates, new B(t));
  }
  setDerivedProperties() {
    this.userCoordinatesInsideCanvasBitmap = new B(this.userCoordinates.base.before(this.canvasBitmap.base)), this.initialBitmapTransformation = this.canvasBitmap.inverseBase, this.icContextFromCanvasBitmap = new B(this.userCoordinates.base.before(this.canvasBitmap.inverseBase));
  }
}
function Ue(r) {
  const { screenWidth: t, screenHeight: e, viewboxWidth: n, viewboxHeight: i } = r;
  return new v(t / n, 0, 0, e / i, 0, 0);
}
class ct {
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
    return new ct(this.units, e);
  }
  withCanvasMeasurement(t) {
    const e = Ue(t), n = this.coordinates.withCanvasBitmapDistortion(e);
    return new ct(this.units, n);
  }
  withUnits(t) {
    if (t === this.units)
      return this;
    let e;
    return t === S.CANVAS ? e = new Tt(this.coordinates.userCoordinates, this.coordinates.canvasBitmap, this.coordinates.canvasBitmap.base) : e = new St(this.coordinates.userCoordinates, this.coordinates.canvasBitmap), new ct(t, e);
  }
  static create(t, e) {
    const n = Ue(e), i = t === S.CANVAS ? new Tt(new B(v.identity), new B(n), n) : new St(new B(v.identity), new B(n));
    return new ct(t, i);
  }
}
function ws(r, t) {
  return r ? t ? r.viewboxWidth === t.viewboxWidth && r.viewboxHeight === t.viewboxHeight && r.screenWidth === t.screenWidth && r.screenHeight === t.screenHeight : !1 : !t;
}
class ht {
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
    return new ht(e, this.measurement, this.polygon);
  }
  withTransformation(t) {
    const e = this.coordinates.withUserTransformation(v.create(t));
    return new ht(e, this.measurement, this.polygon);
  }
  withMeasurement(t) {
    if (ws(this.measurement, t))
      return this;
    const { viewboxWidth: n, viewboxHeight: i } = t, s = m.createRectangle(0, 0, n, i), o = this.coordinates.withCanvasMeasurement(t);
    return new ht(o, t, s);
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
    const { viewboxWidth: n, viewboxHeight: i } = t, s = m.createRectangle(0, 0, n, i), o = ct.create(e, t);
    return new ht(o, t, s);
  }
}
class Ps {
  constructor(t, e) {
    this.measurementProvider = t, this.config = e, this.transformation = v.identity;
  }
  setTransformation(t) {
    this.rectangle ? this.rectangle = this.rectangle.withTransformation(t) : this.transformation = t;
  }
  measure() {
    const t = this.config.units === S.CSS ? S.CSS : S.CANVAS, e = this.measurementProvider.measure();
    e.screenWidth === 0 || e.screenHeight === 0 ? this.rectangle = void 0 : this.rectangle ? this.rectangle = this.rectangle.withUnits(t).withMeasurement(e) : this.rectangle = ht.create(e, t).withTransformation(this.transformation);
  }
}
class Cs {
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
function dt(r) {
  const { a: t, b: e, c: n, d: i, e: s, f: o } = r;
  return { a: t, b: e, c: n, d: i, e: s, f: o };
}
const Is = {
  transformationstart: null,
  transformationchange: null,
  transformationend: null
}, Fn = {
  auxclick: null,
  click: null,
  contextmenu: null,
  dblclick: null,
  mouseenter: null,
  mouseleave: null,
  mouseout: null,
  mouseover: null,
  mouseup: null
}, Wn = {
  gotpointercapture: null,
  lostpointercapture: null,
  pointerenter: null,
  pointerout: null,
  pointerover: null
}, kn = {
  drag: null,
  dragend: null,
  dragenter: null,
  dragleave: null,
  dragover: null,
  dragstart: null,
  drop: null
}, Rn = {
  touchcancel: null,
  touchend: null
}, Ts = {
  ...Fn,
  ...Wn,
  ...kn,
  ...Rn
}, Nn = {
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
function Dt(r) {
  return Is.hasOwnProperty(r);
}
function Lt(r) {
  return Ts.hasOwnProperty(r) || Nn.hasOwnProperty(r);
}
function Et(r) {
  return Nn.hasOwnProperty(r);
}
function Ft(r) {
  return Fn.hasOwnProperty(r);
}
function Wt(r) {
  return Wn.hasOwnProperty(r);
}
function kt(r) {
  return kn.hasOwnProperty(r);
}
function Rt(r) {
  return Rn.hasOwnProperty(r);
}
class Ss extends Bt {
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
class ys extends Bt {
  constructor(t, e) {
    super(), this.transform = e, this.old = new Ss(t);
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
function et(r, t) {
  return new ys(r, t);
}
function V(r, t) {
  return et(r, (e) => (n) => {
    e(t(n));
  });
}
function zt(r) {
  return !!r && typeof r.handleEvent == "function";
}
class bs extends Bt {
  constructor(t) {
    super(), this.source = t;
  }
  mapsTo(t, e) {
    return t.listenerObject === e.listenerObject;
  }
  map(t) {
    const { listenerObject: e, removedCallback: n } = t, i = (o) => {
      e.handleEvent(o);
    }, s = () => {
      this.remove(t), n && n();
    };
    return this.source.addListener(i, s), { listener: i, listenerObject: e, removedCallback: s };
  }
  onRemoved(t) {
    this.source.removeListener(t.listener), t.removedCallback();
  }
}
class xs {
  constructor(t) {
    this.source = t, this.listenerObjectCollection = new bs(t);
  }
  addListener(t, e) {
    zt(t) ? this.listenerObjectCollection.add({ listenerObject: t, removedCallback: e }) : this.source.addListener(t, e);
  }
  removeListener(t) {
    zt(t) ? this.listenerObjectCollection.remove({ listenerObject: t }) : this.source.removeListener(t);
  }
}
function $e(r) {
  return new xs(r);
}
function Os(r, t, e) {
  zt(t), r.addListener(t, e);
}
function Bs(r, t, e) {
  zt(t), r.removeListener(t, e);
}
function As(r) {
  const t = et(r, (e) => (n) => {
    e(n), t.removeListener(e);
  });
  return t;
}
function Ds(r, t) {
  return et(r, (e) => (n) => {
    e.apply(t, [n]);
  });
}
class Ls {
  constructor(t) {
    this.source = t, this.firstDispatcher = new j(), this.secondDispatcher = new j(), this.numberOfListeners = 0, this.sourceListener = (e) => this.dispatchEvent(e);
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
      first: et(this.firstDispatcher, (t, e) => (this.add(), e(() => this.remove()), t)),
      second: et(this.secondDispatcher, (t, e) => (this.add(), e(() => this.remove()), t))
    };
  }
}
function Ke(r) {
  return new Ls(r).build();
}
function N(r, t) {
  return et(r, (e) => (n) => {
    t(n) && e(n);
  });
}
class je {
  constructor(t, e) {
    t = Ds(t, e), this._onceSource = $e(As(t)), this.source = $e(t);
  }
  addListener(t, e) {
    e && e.once ? this._onceSource.addListener(t) : this.source.addListener(t);
  }
  removeListener(t) {
    this.source.removeListener(t), this._onceSource.removeListener(t);
  }
}
class Es {
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
function Fs(r, t, e) {
  return new Es(
    new je(r, e),
    new je(t, e)
  );
}
function J(r, t, e, n) {
  const i = V(N(r, (o) => !o.immediatePropagationStopped), (o) => o.getResultEvent(e.rectangle)), s = V(N(t, (o) => !o.propagationStopped && !o.immediatePropagationStopped), (o) => o.getResultEvent(e.rectangle));
  return Fs(i, s, n);
}
function Z(r) {
  const { first: t, second: e } = Ke(r), { first: n, second: i } = Ke(e);
  return {
    captureSource: t,
    bubbleSource: n,
    afterBubble: i
  };
}
function Ws(r, t, e) {
  const { captureSource: n, bubbleSource: i } = Z(r);
  return J(
    n,
    i,
    t,
    e
  );
}
class De {
  constructor(t, e) {
    this.rectangleManager = t, this.infiniteCanvas = e, this.cache = {};
  }
  map(t, e) {
    return Ws(V(t, e), this.rectangleManager, this.infiniteCanvas);
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
    this.cache[t] || (this.cache[t] = this.getEventSource(t)), Os(this.cache[t], e, n);
  }
  removeEventListener(t, e, n) {
    this.cache[t] && Bs(this.cache[t], e, n);
  }
}
class Mn extends De {
  getEventSource(t) {
    return (!this.cache || !this.cache[t]) && (this.cache = this.createEvents()), this.cache[t];
  }
}
class Vn {
  constructor(t, e) {
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
  get AT_TARGET() {
    return Event.AT_TARGET;
  }
  get BUBBLING_PHASE() {
    return Event.BUBBLING_PHASE;
  }
  get CAPTURING_PHASE() {
    return Event.CAPTURING_PHASE;
  }
  get NONE() {
    return Event.NONE;
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
class Le extends Vn {
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
class qn {
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
class ks {
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
class Rs {
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
class Ee extends qn {
  constructor(t) {
    super(t ? new ks() : new Rs());
  }
}
class Ns extends Le {
  constructor(t, e) {
    super(t, e, "draw"), this.transformation = t.transformation, this.inverseTransformation = t.inverseTransformation;
  }
}
class Ms extends Ee {
  constructor() {
    super(!1);
  }
  createResultEvent(t) {
    return this.transformation = dt(t.infiniteCanvasContext.inverseBase), this.inverseTransformation = dt(t.infiniteCanvasContext.base), new Ns(this, this.preventableDefault);
  }
}
class Vs extends Mn {
  constructor(t, e, n) {
    super(e, n), this.drawingIterationProvider = t;
  }
  createEvents() {
    return {
      draw: this.map(this.drawingIterationProvider.drawHappened, () => new Ms())
    };
  }
}
class qs extends Le {
  constructor(t, e, n) {
    super(t, e, n), this.transformation = t.transformation, this.inverseTransformation = t.inverseTransformation;
  }
}
class oe extends Ee {
  constructor(t) {
    super(!1), this.type = t;
  }
  createResultEvent(t) {
    return this.transformation = dt(t.infiniteCanvasContext.inverseBase), this.inverseTransformation = dt(t.infiniteCanvasContext.base), new qs(this, this.preventableDefault, this.type);
  }
}
class Hs extends Mn {
  constructor(t, e, n) {
    super(e, n), this.transformer = t;
  }
  createEvents() {
    return {
      transformationstart: this.map(this.transformer.transformationStart, () => new oe("transformationstart")),
      transformationchange: this.map(this.transformer.transformationChange, () => new oe("transformationchange")),
      transformationend: this.map(this.transformer.transformationEnd, () => new oe("transformationend"))
    };
  }
}
function E(r, t) {
  return {
    addListener(e) {
      r.addEventListener(t, e);
    },
    removeListener(e) {
      r.removeEventListener(t, e);
    }
  };
}
class Gs {
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
class Xs {
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
class ft extends qn {
  constructor(t, e) {
    super(e ? new Xs(t) : new Gs(t)), this.event = t;
  }
  stopPropagation() {
    super.stopPropagation(), this.event && this.event.stopPropagation();
  }
  stopImmediatePropagation() {
    super.stopImmediatePropagation(), this.event && this.event.stopImmediatePropagation();
  }
}
class nt {
  constructor(t, e, n, i) {
    this.offsetX = t, this.offsetY = e, this.movementX = n, this.movementY = i;
  }
  toInfiniteCanvasCoordinates(t) {
    const { x: e, y: n } = t.infiniteCanvasContext.inverseBase.apply(new c(this.offsetX, this.offsetY)), { x: i, y: s } = t.infiniteCanvasContext.inverseBase.untranslated().apply(new c(this.movementX, this.movementY));
    return new nt(e, n, i, s);
  }
  static create(t) {
    return new nt(t.offsetX, t.offsetY, t.movementX, t.movementY);
  }
}
class Ys extends Vn {
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
class Hn extends Ys {
  get detail() {
    return this.event.detail;
  }
  get view() {
    return this.event.view;
  }
  get which() {
    return this.event.which;
  }
  initUIEvent(t, e, n, i, s) {
  }
}
class te extends Hn {
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
  initMouseEvent(t, e, n, i, s, o, a, h, l, f, u, g, p, P, x) {
  }
}
class ge extends ft {
  constructor(t, e) {
    super(t, e), this.props = nt.create(t);
  }
  createResultEvent(t) {
    return new te(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
}
class Ut extends nt {
  constructor(t, e, n, i, s, o) {
    super(t, e, n, i), this.width = s, this.height = o;
  }
  toInfiniteCanvasCoordinates(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: s } = super.toInfiniteCanvasCoordinates(t), { x: o, y: a } = t.infiniteCanvasContext.inverseBase.untranslated().apply(new c(this.width, this.height));
    return new Ut(
      e,
      n,
      i,
      s,
      o,
      a
    );
  }
  static create(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: s } = super.create(t);
    return new Ut(
      e,
      n,
      i,
      s,
      t.width,
      t.height
    );
  }
}
class zs extends te {
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
class ot extends ft {
  constructor(t, e) {
    super(t, e), this.props = Ut.create(t);
  }
  createResultEvent(t) {
    return new zs(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
}
class Us {
  constructor(t, e) {
    this.initial = t, this.cancel = e, this.current = t;
  }
}
class $s {
  constructor(t) {
    this.point = t, this.moveEventDispatcher = new j(), this._fixedOnInfiniteCanvas = !1;
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
    const i = (s) => {
      n.current = s, t();
    };
    return this.moveEventDispatcher.addListener(i), n = new Us(this.point, () => (this.removeHandler(i), this._fixedOnInfiniteCanvas = !1, this)), n;
  }
}
class Ks {
  constructor(t) {
    this.pointerEvent = t, this._defaultPrevented = !1, this.anchor = new $s(new c(t.offsetX, t.offsetY));
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
class js {
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
    const e = new Ks(t);
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
class $t extends nt {
  constructor(t, e, n, i, s, o) {
    super(t, e, n, i), this.deltaX = s, this.deltaY = o;
  }
  toInfiniteCanvasCoordinates(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: s } = super.toInfiniteCanvasCoordinates(t), { x: o, y: a } = t.infiniteCanvasContext.inverseBase.untranslated().apply(new c(this.deltaX, this.deltaY));
    return new $t(
      e,
      n,
      i,
      s,
      o,
      a
    );
  }
  static create(t) {
    const { offsetX: e, offsetY: n, movementX: i, movementY: s } = super.create(t);
    return new $t(
      e,
      n,
      i,
      s,
      t.deltaX,
      t.deltaY
    );
  }
}
class Qs extends te {
  constructor(t, e, n, i) {
    super(t, e, n, i), this.deltaX = i.deltaX, this.deltaY = i.deltaY;
  }
  get deltaMode() {
    return this.event.deltaMode;
  }
  get deltaZ() {
    return this.event.deltaZ;
  }
  get DOM_DELTA_LINE() {
    return this.event.DOM_DELTA_LINE;
  }
  get DOM_DELTA_PAGE() {
    return this.event.DOM_DELTA_PAGE;
  }
  get DOM_DELTA_PIXEL() {
    return this.event.DOM_DELTA_PIXEL;
  }
}
class Js extends ft {
  constructor(t, e) {
    super(t, e), this.props = $t.create(t);
  }
  createResultEvent(t) {
    return new Qs(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
}
function lt(r, t) {
  const e = [];
  for (let n = 0; n < r.length; n++) {
    const i = r[n];
    (!t || t(i)) && e.push(i);
  }
  return e;
}
class Kt {
  constructor(t, e, n, i, s, o) {
    this.x = t, this.y = e, this.radiusX = n, this.radiusY = i, this.rotationAngle = s, this.identifier = o;
  }
  toInfiniteCanvasCoordinates(t) {
    const e = t.infiniteCanvasContext.inverseBase, { x: n, y: i } = e.apply(new c(this.x, this.y)), s = this.radiusX * e.scale, o = this.radiusY * e.scale, a = this.rotationAngle + e.getRotationAngle();
    return new Kt(
      n,
      i,
      s,
      o,
      a,
      this.identifier
    );
  }
  static create(t, e) {
    const { x: n, y: i } = e.getCSSPosition(t.clientX, t.clientY);
    return new Kt(
      n,
      i,
      t.radiusX,
      t.radiusY,
      t.rotationAngle,
      t.identifier
    );
  }
}
class Qe {
  constructor() {
    this.translatedProps = [], this.createdProps = [];
  }
  toInfiniteCanvasCoordinates(t, e) {
    let n = this.translatedProps.find((i) => i.identifier === t.identifier);
    return n || (n = t.toInfiniteCanvasCoordinates(e), this.translatedProps.push(n), n);
  }
  createProps(t, e) {
    let n = this.createdProps.find((i) => i.identifier === t.identifier);
    return n || (n = Kt.create(t, e), this.createdProps.push(n), n);
  }
  dispose() {
    this.translatedProps.splice(0, this.translatedProps.length), this.createdProps.splice(0, this.createdProps.length);
  }
}
class jt {
  constructor(t, e, n) {
    this.targetTouches = t, this.changedTouches = e, this.touches = n;
  }
  toInfiniteCanvasCoordinates(t) {
    const e = new Qe(), n = new jt(
      this.targetTouches.map((i) => e.toInfiniteCanvasCoordinates(i, t)),
      this.changedTouches.map((i) => e.toInfiniteCanvasCoordinates(i, t)),
      this.touches.map((i) => e.toInfiniteCanvasCoordinates(i, t))
    );
    return e.dispose(), n;
  }
  static create(t, e, n) {
    const i = new Qe(), s = e.map((a) => i.createProps(a, t)), o = n.map((a) => i.createProps(a, t));
    return i.dispose(), new jt(
      s,
      o,
      s
    );
  }
}
class Zs {
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
class _s extends Array {
  item(t) {
    return this[t];
  }
}
function tr(r, t) {
  const e = r.length;
  for (let n = 0; n < e; n++) {
    const i = r[n];
    if (i.identifier === t)
      return i;
  }
}
function er(r, t) {
  for (let e of r) {
    const n = tr(e, t);
    if (n)
      return n;
  }
}
function ae(r, t) {
  const e = [];
  for (const n of t) {
    const i = er(r, n.identifier);
    i && e.push(new Zs(i, n));
  }
  return new _s(...e);
}
class nr extends Hn {
  constructor(t, e, n, i) {
    super(t, e, n), this.touches = ae([n.touches], i.touches), this.targetTouches = ae([n.touches], i.targetTouches), this.changedTouches = ae([n.touches, n.changedTouches], i.changedTouches);
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
class yt extends ft {
  constructor(t, e, n) {
    super(t, n), this.props = e;
  }
  createResultEvent(t) {
    return new nr(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
  static create(t, e, n, i, s) {
    const o = jt.create(t, n, i);
    return new yt(e, o, s);
  }
}
class Je {
  constructor(t, e) {
    this.source = t, this.listener = e, t.addListener(e);
  }
  remove() {
    this.source.removeListener(this.listener);
  }
}
class ir {
  constructor(t, e, n, i) {
    this.listener = n, this.onRemoved = i;
    let s;
    this.otherSubscription = new Je(e, (o) => {
      s = o;
    }), this.subscription = new Je(t, (o) => {
      n([o, s]);
    });
  }
  remove() {
    this.subscription.remove(), this.otherSubscription.remove(), this.onRemoved && this.onRemoved();
  }
}
class sr extends Bt {
  constructor(t, e) {
    super(), this.source = t, this.otherSource = e;
  }
  map(t) {
    return new ir(this.source, this.otherSource, t.listener, t.onRemoved);
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
function ce(r, t) {
  return new sr(r, t);
}
function rr(r, t) {
  for (let e = 0; e < r.length; e++) {
    const n = r[e];
    if (t(n))
      return !0;
  }
  return !1;
}
function or(r, t) {
  return et(r, (e) => {
    let n = !1;
    const i = [];
    function s() {
      n || i.length === 0 || (n = !0, t(i.shift()).addListener(e, () => {
        n = !1, s();
      }));
    }
    return (o) => {
      i.push(o), s();
    };
  });
}
class ar {
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
function cr(r) {
  return new ar(r);
}
class Ze extends Ee {
  constructor(t) {
    super(!0), this.type = t;
  }
  createResultEvent() {
    return new Le(this, this.preventableDefault, this.type);
  }
}
class hr extends De {
  constructor(t, e, n, i, s) {
    super(n, i), this.transformer = e, this.config = s, this.anchorSet = new js();
    const o = E(t, "pointerdown"), a = E(t, "pointerleave"), h = E(t, "pointermove"), l = E(t, "pointerup"), f = E(t, "pointercancel"), u = N(
      E(t, "touchmove"),
      (d) => rr(d.targetTouches, (y) => !this.hasFixedAnchorForTouch(y.identifier))
    );
    o.addListener((d) => this.anchorSet.updateAnchorForPointerEvent(d)), h.addListener((d) => this.anchorSet.updateAnchorForPointerEvent(d)), l.addListener((d) => this.removePointer(d)), a.addListener((d) => this.removePointer(d));
    const g = V(E(t, "mousedown"), (d) => new ge(d, !0)), p = V(E(t, "wheel"), (d) => new Js(d, !0)), P = V(E(t, "touchstart"), (d) => {
      const y = lt(d.targetTouches), R = lt(d.changedTouches);
      return yt.create(
        this.rectangleManager.rectangle,
        d,
        y,
        R,
        !0
      );
    }), x = V(o, (d) => new ot(d, !0)), { captureSource: k, bubbleSource: G, afterBubble: Q } = Z(x), { captureSource: gt, bubbleSource: mt, afterBubble: vt } = Z(g), { captureSource: pt, bubbleSource: ee, afterBubble: ne } = Z(P), { captureSource: ie, bubbleSource: At, afterBubble: ke } = Z(p), Gn = V(
      N(ke, (d) => !this.config.greedyGestureHandling && !d.event.ctrlKey && !d.infiniteCanvasDefaultPrevented),
      () => new Ze("wheelignored")
    ), { captureSource: Xn, bubbleSource: Yn, afterBubble: zn } = Z(Gn);
    ke.addListener((d) => {
      d.infiniteCanvasDefaultPrevented || this.zoom(d.event);
    }), zn.addListener((d) => {
      d.infiniteCanvasDefaultPrevented || console.warn("use ctrl + scroll to zoom");
    }), ce(vt, Q).addListener(([d, y]) => {
      !d.infiniteCanvasDefaultPrevented && !y.infiniteCanvasDefaultPrevented && this.transformUsingPointer(d.event, y.event);
    });
    const Un = N(ne, (d) => d.event.changedTouches.length === 1), Re = ce(Un, Q);
    Re.addListener(([d, y]) => {
      const R = d.event.changedTouches[0], X = this.anchorSet.getAnchorForPointerEvent(y.event);
      if (X)
        if (X.setTouchId(R.identifier), !d.infiniteCanvasDefaultPrevented && !y.infiniteCanvasDefaultPrevented)
          if (this.config.greedyGestureHandling)
            this.rectangleManager.measure(), this.transformer.addAnchor(X.anchor), d.event.preventDefault();
          else {
            const Me = this.anchorSet.find((se) => se.touchId !== void 0 && se !== X && !se.defaultPrevented);
            if (!Me)
              return;
            this.rectangleManager.measure(), this.transformer.addAnchor(Me.anchor), this.transformer.addAnchor(X.anchor), d.event.preventDefault();
          }
        else
          X.preventDefault();
    });
    const Ne = N(
      ce(f, Re),
      ([d, [y, R]]) => d.pointerId === R.event.pointerId
    );
    Ne.addListener(([d]) => {
      this.removePointer(d);
    });
    const $n = V(
      N(Ne, ([d, [y, R]]) => !this.config.greedyGestureHandling && !y.infiniteCanvasDefaultPrevented && !R.infiniteCanvasDefaultPrevented),
      () => new Ze("touchignored")
    ), { captureSource: Kn, bubbleSource: jn, afterBubble: Qn } = Z($n);
    Qn.addListener((d) => {
      d.infiniteCanvasDefaultPrevented || console.warn("use two fingers to move");
    }), this.cache = {
      mousemove: this.map(N(E(t, "mousemove"), () => !this.mouseAnchorIsFixed()), (d) => new ge(d)),
      mousedown: J(gt, mt, n, i),
      pointerdown: J(k, G, n, i),
      pointermove: this.map(
        or(
          N(h, () => this.hasNonFixedAnchorForSomePointer()),
          () => cr(this.anchorSet.getAll((d) => !d.anchor.fixedOnInfiniteCanvas).map((d) => d.pointerEvent))
        ),
        (d) => new ot(d)
      ),
      pointerleave: this.map(a, (d) => new ot(d)),
      pointerup: this.map(l, (d) => new ot(d)),
      pointercancel: this.map(f, (d) => new ot(d)),
      wheel: J(ie, At, n, i),
      wheelignored: J(Xn, Yn, n, i),
      touchstart: J(pt, ee, n, i),
      touchignored: J(Kn, jn, n, i),
      touchmove: this.map(u, (d) => {
        const y = lt(d.targetTouches), R = lt(d.targetTouches, (X) => !this.hasFixedAnchorForTouch(X.identifier));
        return yt.create(
          this.rectangleManager.rectangle,
          d,
          y,
          R
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
    const s = Math.pow(2, -i / 300);
    this.rectangleManager.measure(), this.transformer.zoom(e, n, s), t.preventDefault();
  }
}
class lr {
  constructor(t, e) {
    this.handledOrFilteredEventCollection = t, this.mappingCollection = e;
  }
  setOn(t, e) {
    Et(t) ? this.handledOrFilteredEventCollection.setOn(t, e) : this.mappingCollection.setOn(t, e);
  }
  getOn(t) {
    return Et(t) ? this.handledOrFilteredEventCollection.getOn(t) : this.mappingCollection.getOn(t);
  }
  addEventListener(t, e, n) {
    Et(t) ? this.handledOrFilteredEventCollection.addEventListener(t, e, n) : this.mappingCollection.addEventListener(t, e, n);
  }
  removeEventListener(t, e, n) {
    Et(t) ? this.handledOrFilteredEventCollection.removeEventListener(t, e, n) : this.mappingCollection.removeEventListener(t, e, n);
  }
}
class ur {
  constructor(t, e, n, i) {
    this.mappedMouseEventCollection = t, this.mappedTouchEventCollection = e, this.mappedOnlyPointerEventCollection = n, this.mappedDragEventCollection = i;
  }
  setOn(t, e) {
    Ft(t) ? this.mappedMouseEventCollection.setOn(t, e) : Rt(t) ? this.mappedTouchEventCollection.setOn(t, e) : Wt(t) ? this.mappedOnlyPointerEventCollection.setOn(t, e) : kt(t) && this.mappedDragEventCollection.setOn(t, e);
  }
  getOn(t) {
    if (Ft(t))
      return this.mappedMouseEventCollection.getOn(t);
    if (Rt(t))
      return this.mappedTouchEventCollection.getOn(t);
    if (Wt(t))
      return this.mappedOnlyPointerEventCollection.getOn(t);
    if (kt(t))
      return this.mappedDragEventCollection.getOn(t);
  }
  addEventListener(t, e, n) {
    Ft(t) ? this.mappedMouseEventCollection.addEventListener(t, e, n) : Rt(t) ? this.mappedTouchEventCollection.addEventListener(t, e, n) : Wt(t) ? this.mappedOnlyPointerEventCollection.addEventListener(t, e, n) : kt(t) && this.mappedDragEventCollection.addEventListener(t, e, n);
  }
  removeEventListener(t, e, n) {
    Ft(t) ? this.mappedMouseEventCollection.removeEventListener(t, e, n) : Rt(t) ? this.mappedTouchEventCollection.removeEventListener(t, e, n) : Wt(t) ? this.mappedOnlyPointerEventCollection.removeEventListener(t, e, n) : kt(t) && this.mappedDragEventCollection.removeEventListener(t, e, n);
  }
}
class Pt extends De {
  constructor(t, e, n, i) {
    super(n, i), this.canvasEl = t, this.createInternalEvent = e, this.cache = {};
  }
  getEventSource(t) {
    return this.cache[t] || (this.cache[t] = this.createEventSource(t)), this.cache[t];
  }
  createEventSource(t) {
    return this.map(E(this.canvasEl, t), (e) => this.createInternalEvent(e));
  }
}
class dr extends te {
  get dataTransfer() {
    return this.event.dataTransfer;
  }
}
class fr extends ft {
  constructor(t, e) {
    super(t, e), this.props = nt.create(t);
  }
  createResultEvent(t) {
    return new dr(this, this.preventableDefault, this.event, this.props.toInfiniteCanvasCoordinates(t));
  }
}
class gr extends ft {
  createResultEvent() {
    return this.event;
  }
}
class Fe {
  constructor(t, e, n, i) {
    this.drawEventCollection = t, this.transformationEventCollection = e, this.pointerEventCollection = n, this.unmappedEventCollection = i;
  }
  setOn(t, e) {
    t === "draw" ? this.drawEventCollection.setOn("draw", e) : Dt(t) ? this.transformationEventCollection.setOn(t, e) : Lt(t) ? this.pointerEventCollection.setOn(t, e) : this.unmappedEventCollection.setOn(t, e);
  }
  getOn(t) {
    return t === "draw" ? this.drawEventCollection.getOn("draw") : Dt(t) ? this.transformationEventCollection.getOn(t) : Lt(t) ? this.pointerEventCollection.getOn(t) : this.unmappedEventCollection.getOn(t);
  }
  addEventListener(t, e, n) {
    t === "draw" ? this.drawEventCollection.addEventListener("draw", e, n) : Dt(t) ? this.transformationEventCollection.addEventListener(t, e, n) : Lt(t) ? this.pointerEventCollection.addEventListener(t, e, n) : this.unmappedEventCollection.addEventListener(t, e, n);
  }
  removeEventListener(t, e, n) {
    t === "draw" ? this.drawEventCollection.removeEventListener("draw", e, n) : Dt(t) ? this.transformationEventCollection.removeEventListener(t, e, n) : Lt(t) ? this.pointerEventCollection.removeEventListener(t, e, n) : this.unmappedEventCollection.removeEventListener(t, e, n);
  }
  static create(t, e, n, i, s, o) {
    const a = new Vs(o, n, i), h = new Hs(e, n, i), l = new hr(
      t,
      e,
      n,
      i,
      s
    ), f = new lr(
      l,
      new ur(
        new Pt(t, (u) => new ge(u), n, i),
        new Pt(t, (u) => {
          const g = lt(u.targetTouches), p = lt(u.changedTouches);
          return yt.create(
            n.rectangle,
            u,
            g,
            p
          );
        }, n, i),
        new Pt(t, (u) => new ot(u), n, i),
        new Pt(t, (u) => new fr(u), n, i)
      )
    );
    return new Fe(
      a,
      h,
      f,
      new Pt(t, (u) => new gr(u), n, i)
    );
  }
}
function mr(r, t) {
  let e = -1;
  const n = r.canvas.width;
  r.save(), r.fillStyle = "#fff", r.fillRect(0, 0, n, 5), r.filter = `drop-shadow(${t} 0)`, r.fillRect(0, 0, 1, 5);
  const s = r.getImageData(0, 0, n, 3).data;
  for (let o = 0; o < n; o++) {
    const a = 4 * (2 * n + o);
    if (s[a] !== 255) {
      e = o;
      break;
    }
  }
  return r.restore(), e;
}
function vr(r, t) {
  const e = r.canvas.width;
  let n = 1, i = 1, s = -1;
  return f(), h(), o(), { numerator: n, denominator: i, pixels: s };
  function o() {
    let u = 0;
    do {
      const g = s;
      if (a(), s === g)
        break;
      u++;
    } while (u < 10);
  }
  function a() {
    const u = e / (s + 1);
    let g = s === 0 ? u : Math.min((e - 1) / s, u), p;
    for (; (p = Math.floor(g)) < 2; )
      g *= 10, i *= 10;
    n *= p, f(), l();
  }
  function h() {
    let u = 0;
    for (; s === -1 && u < 10; )
      i *= 10, f(), u++;
    l();
  }
  function l() {
    if (s === -1)
      throw new Error(`something went wrong while getting measurement for unit '${t}' on canvas with width ${e}`);
  }
  function f() {
    s = mr(r, `${n / i}${t}`);
  }
}
class pr {
  constructor(t) {
    this.ctx = t, this.cache = {};
  }
  getNumberOfPixels(t, e) {
    if (t === 0)
      return 0;
    if (e === "px")
      return t;
    let n = this.cache[e];
    return n || (n = vr(this.ctx, e), this.cache[e] = n), t * n.pixels * n.denominator / n.numerator;
  }
}
class wr {
  constructor(t) {
    this.canvas = t, this.dispatcher = new j(), this.numberOfListeners = 0;
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
function _e(r) {
  const { screenWidth: t, screenHeight: e } = r;
  return t > 0 && e > 0;
}
class Pr {
  constructor(t, e, n) {
    this.measurementProvider = t, this.resizes = e, this.viewBox = n, this.currentlyVisible = !1;
  }
  observe() {
    const t = this.measurementProvider.measure();
    this.currentlyVisible = _e(t);
    const e = (n) => {
      const i = _e(n);
      i && !this.currentlyVisible && this.viewBox.draw(), this.currentlyVisible = i;
    };
    this.resizes.addListener(e), this.listener = e;
  }
  disconnect() {
    this.listener && (this.resizes.removeListener(this.listener), this.listener = void 0);
  }
}
class We {
  constructor(t, e) {
    this.canvas = t, this.config = { rotationEnabled: !0, greedyGestureHandling: !1, units: S.CANVAS }, e && Object.assign(this.config, e);
    const n = new wr(t);
    this.canvasResizes = n, this.cssUnitsCanvasResizeListener = () => {
      this.canvas.parentElement !== null && this.viewBox.draw();
    };
    const i = new vs(new ms()), s = new ps(i), o = new Cs(t);
    this.rectangleManager = new Ps(o, this.config);
    let a;
    const h = t.getContext("2d");
    this.cssLengthConverterFactory = {
      create: () => new pr(h)
    };
    const l = new as(
      this.rectangleManager,
      h,
      s,
      () => s.getLock(),
      () => a.isTransforming
    );
    this.viewBox = l, this.canvasUnitsCanvasResizeObserver = new Pr(o, n, l), a = new gs(this.viewBox, this.config), this.eventCollection = Fe.create(t, a, this.rectangleManager, this, this.config, i), this.config.units === S.CSS ? this.canvasResizes.addListener(this.cssUnitsCanvasResizeListener) : this.config.units === S.CANVAS && this.canvasUnitsCanvasResizeObserver.observe();
  }
  setUnits(t) {
    t === S.CSS && this.config.units !== S.CSS && (this.canvasUnitsCanvasResizeObserver.disconnect(), this.canvasResizes.addListener(this.cssUnitsCanvasResizeListener)), t === S.CANVAS && this.config.units !== S.CANVAS && (this.canvasResizes.removeListener(this.cssUnitsCanvasResizeListener), this.canvasUnitsCanvasResizeObserver.observe()), this.config.units = t, this.rectangleManager.measure(), this.viewBox.draw();
  }
  getContext() {
    return this.context || (this.context = new Mi(this.canvas, this.viewBox, this.cssLengthConverterFactory)), this.context;
  }
  get transformation() {
    return dt(this.rectangleManager.rectangle.infiniteCanvasContext.inverseBase);
  }
  get inverseTransformation() {
    return dt(this.rectangleManager.rectangle.infiniteCanvasContext.base);
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
We.CANVAS_UNITS = S.CANVAS;
We.CSS_UNITS = S.CSS;
const Ir = We;
export {
  S as Units,
  Ir as default
};
