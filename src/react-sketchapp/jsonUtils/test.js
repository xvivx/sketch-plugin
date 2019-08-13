function a(e, t, n) {
  'use strict';
  n.r(t),
    n.d(t, 'TEXT_ALIGN', function() {
      return s;
    }),
    n.d(t, 'TEXT_DECORATION_UNDERLINE', function() {
      return c;
    }),
    n.d(t, 'TEXT_DECORATION_LINETHROUGH', function() {
      return f;
    }),
    n.d(t, 'TEXT_TRANSFORM', function() {
      return l;
    }),
    n.d(t, 'makeImageDataFromUrl', function() {
      return _;
    }),
    n.d(t, 'makeResizeConstraint', function() {
      return v;
    }),
    n.d(t, 'createAttributedString', function() {
      return m;
    }),
    n.d(t, 'makeEncodedAttributedString', function() {
      return b;
    }),
    n.d(t, 'makeTextStyle', function() {
      return y;
    }),
    n.d(t, 'makeSvgLayer', function() {
      return g;
    });
  var r = require('sketch-constants/lib/index'),
    i = require('sketchapp-json-plugin/lib/index'),
    o = n('./src/_rsmod/utils/findFont.js'),
    u = n('./src/_rsmod/utils/getSketchVersion.js'),
    a = n('./src/_rsmod/jsonUtils/models.js'),
    s = { auto: r.TextAlignment.Left, left: r.TextAlignment.Left, right: r.TextAlignment.Right, center: r.TextAlignment.Center, justify: r.TextAlignment.Justified },
    c = { none: 0, underline: 1, double: 9 },
    f = { none: 0, 'line-through': 1 },
    l = { uppercase: 1, lowercase: 2, initial: 0, inherit: 0, none: 0, capitalize: 0 },
    d = {
      top_left_fixedHeight_fixedWidth: 9,
      top_right_left_fixedHeight: 10,
      top_left_fixedHeight: 11,
      top_right_fixedHeight_fixedWidth: 12,
      top_fixedHeight_fixedWidth: 13,
      top_right_fixedHeight: 14,
      top_fixedHeight: 15,
      top_bottom_left_fixedWidth: 17,
      top_right_bottom_left: 18,
      top_bottom_left: 19,
      top_right_bottom_fixedWidth: 20,
      top_bottom_fixedWidth: 21,
      top_right_bottom: 22,
      top_bottom: 23,
      top_left_fixedWidth: 25,
      top_right_left: 26,
      top_left: 27,
      top_right_fixedWidth: 28,
      top_fixedWidth: 29,
      top_right: 30,
      top: 31,
      bottom_left_fixedHeight_fixedWidth: 33,
      right_bottom_left_fixedHeight: 34,
      bottom_left_fixedHeight: 35,
      right_bottom_fixedHeight_fixedWidth: 36,
      bottom_fixedHeight_fixedWidth: 37,
      right_bottom_fixedHeight: 38,
      bottom_fixedHeight: 39,
      left_fixedHeight_fixedWidth: 41,
      right_left_fixedHeight: 42,
      left_fixedHeight: 43,
      right_fixedHeight_fixedWidth: 44,
      fixedHeight_fixedWidth: 45,
      right_fixedHeight: 46,
      fixedHeight: 47,
      bottom_left_fixedWidth: 49,
      right_bottom_left: 50,
      bottom_left: 51,
      right_bottom_fixedWidth: 52,
      bottom_fixedWidth: 53,
      right_bottom: 54,
      bottom: 55,
      left_fixedWidth: 57,
      right_left: 58,
      left: 59,
      right_fixedWidth: 60,
      fixedWidth: 61,
      right: 62,
      none: 63,
    };

  function p(e) {
    var t = Object(i.toSJSON)(e);
    return t ? JSON.parse(t) : {};
  }
  function h(e) {
    var t = NSMutableParagraphStyle.alloc().init();
    return (
      void 0 !== e.lineHeight && ((t.minimumLineHeight = e.lineHeight), (t.lineHeightMultiple = 1), (t.maximumLineHeight = e.lineHeight)),
      e.textAlign && (t.alignment = s[e.textAlign]),
      t
    );
  }
  var _ = function(e) {
    var t,
      n = NSData.dataWithContentsOfURL(NSURL.URLWithString(e));
    if (n) {
      var r = n.subdataWithRange(NSMakeRange(0, 1)).description();
      '<ff>' != r && '<89>' != r && '<47>' != r && '<49>' != r && '<4d>' != r && (n = null);
    }
    if (n) t = NSImage.alloc().initWithData(n);
    else {
      t = NSImage.alloc().initWithContentsOfURL(
        NSURL.URLWithString('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8w8DwHwAEOQHNmnaaOAAAAABJRU5ErkJggg==')
      );
    }
    return void 0 !== MSImageData.alloc().initWithImage_convertColorSpace ? MSImageData.alloc().initWithImage_convertColorSpace(t, !1) : MSImageData.alloc().initWithImage(t);
  };
  function v(e) {
    if (e) {
      var t = [],
        n = e.top,
        r = e.right,
        i = e.bottom,
        o = e.left,
        u = e.fixedHeight,
        a = e.fixedWidth;
      if ((n && t.push('top'), r && t.push('right'), i && t.push('bottom'), o && t.push('left'), u && t.push('fixedHeight'), a && t.push('fixedWidth'), t.length > 0)) {
        var s = d[t.join('_')];
        if (!s) throw new Error('\n'.concat(JSON.stringify(e, null, 2), '\nconstraint is not a valid combination.'));
        return s;
      }
    }
    return d.none;
  }
  function m(e) {
    var t = e.content,
      n = (function(e) {
        var t = Object(o.default)(e),
          n = {
            MSAttributedStringFontAttribute: t.fontDescriptor(),
            NSFont: t,
            NSParagraphStyle: h(e),
            NSUnderline: c[e.textDecoration] || 0,
            NSStrikethrough: f[e.textDecoration] || 0,
          },
          r = Object(a.makeColorFromCSS)(e.color || 'black');
        return (
          Object(u.default)() >= 50 ? (n.MSAttributedStringColorAttribute = r) : (n.NSColor = NSColor.colorWithDeviceRed_green_blue_alpha(r.red, r.green, r.blue, r.alpha)),
          void 0 !== e.letterSpacing && (n.NSKern = e.letterSpacing),
          void 0 !== e.textTransform && (n.MSAttributedStringTextTransformAttribute = 1 * l[e.textTransform]),
          n
        );
      })(e.textStyles);
    return NSAttributedString.attributedStringWithString_attributes_(t, n);
  }
  function b(e) {
    var t = NSMutableAttributedString.alloc().init();
    e.forEach(function(e) {
      var n = m(e);
      t.appendAttributedString(n);
    });
    var n = MSAttributedString.encodeAttributedString(t);
    return p(MSAttributedString.alloc().initWithEncodedAttributedString(n));
  }
  function y(e) {
    var t = h(e),
      n = Object(o.default)(e),
      r = Object(a.makeColorFromCSS)(e.color || 'black'),
      i = {
        _class: 'textStyle',
        encodedAttributes: {
          MSAttributedStringFontAttribute: p(n.fontDescriptor()),
          NSFont: n,
          NSColor: p(NSColor.colorWithDeviceRed_green_blue_alpha(r.red, r.green, r.blue, r.alpha)),
          NSParagraphStyle: p(t),
          NSKern: e.letterSpacing || 0,
          MSAttributedStringTextTransformAttribute: 1 * l[e.textTransform || 'initial'],
        },
      };
    return { _class: 'style', sharedObjectID: Object(a.generateID)(), miterLimit: 10, startDecorationType: 0, endDecorationType: 0, textStyle: i };
  }
  function g(e, t, n) {
    var r = NSString.stringWithString(n).dataUsingEncoding(NSUTF8StringEncoding),
      i = MSSVGImporter.svgImporter();
    i.prepareToImportFromData(r);
    var o = i.importAsLayer();
    return (o.name = t), (o.rect = { origin: { x: 0, y: 0 }, size: { width: e.width, height: e.height } }), p(o);
  }
}
