import Layer from './layer';
import * as util from './util';

export default class Shape extends Layer {
  style(style) {
    var layer = this._layer;
    var fill = layer.style().firstEnabledFill();
    var border = layer.style().firstEnabledBorder();
    var shadow = layer.style().firstEnabledShadow();

    if (style) {
      if (style.fillColor) {
        fill = fill || layer.style().addStylePartOfType(0);
        fill.color = util.MakeMSColor(style.fillColor);
      }

      if (style.borderColor) {
        border = border || layer.style().addStylePartOfType(1);
        border.color = util.MakeMSColor(style.borderColor);
      }

      if (style.borderWidth != undefined) {
        border = border || layer.style().addStylePartOfType(1);
        border.thickness = style.borderWidth;
      }

      if (style.shadow) {
        var arr = style.shadow.trim().split(' ');
        arr.push(arr.splice(4).join(''));
        shadow = shadow || layer.style().addStylePartOfType(2);
        shadow.offsetX = parseFloat(arr[0], 10);
        shadow.offsetY = parseFloat(arr[1], 10);
        shadow.blurRadius = parseFloat(arr[2], 10);
        shadow.spread = parseFloat(arr[3], 10);
        shadow.color = util.MakeMSColor(arr[4]);
      }

      if(style.radius != undefined) {
        if(layer.cornerRadiusFloat) {
          layer.cornerRadiusFloat = style.radius;
        } else {
          if(layer.layers && layer.layers()[0] && layer.layers()[0].cornerRadiusFloat) {
            layer.layers()[0].cornerRadiusFloat = style.radius;
          }
        }
      }

      if(style.width != undefined) {
        layer.frame().setWidth(style.width);
      }

      if(style.height != undefined) {
        layer.frame().setHeight(style.height);
      }

      return null;
    }

    if(shadow) {
      shadow = `${shadow.offsetX()} ${shadow.offsetY()} ${shadow.blurRadius()} ${shadow.spread()} ${util.MSColor2RGBA(shadow.color())}`;
    }

    var fillColor;
    var borderColor;
    var borderWidth;
    var radius;

    if(fill) {
      fillColor = util.MSColor2RGBA(layer.style().firstEnabledFill().color());
    }

    if(border) {
      borderColor = util.MSColor2RGBA(layer.style().firstEnabledBorder().color());
      borderWidth = layer.style().firstEnabledBorder().thickness();
    }

    if(layer.cornerRadiusFloat) {
      radius = layer.cornerRadiusFloat();
    } else {
      try {
        radius = layer.layers()[0].cornerRadiusFloat();
      } catch(error) {
        console.log(error);
        radius = null;
      }
    }

    return {
      fillColor,
      borderColor,
      borderWidth,
      radius,
      width: layer.frame().width(),
      height: layer.frame().height(),
      shadow
    };
  }
}
