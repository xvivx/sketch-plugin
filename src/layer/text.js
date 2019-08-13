import Layer from './layer';
import * as util from './util';

export default class Text extends Layer {
  style(text) {
    var layer = this._layer;

    if (text) {
      if (text.color) {
        layer.setTextColor(util.MakeMSColor(text.color));
      }

      if (text.fontFamily) {
        var font;
        var fonts = text.fontFamily.split(',').map(function(font) {
          return font.replace(/^\s*"?(.*?)"?\s*$/, '$1');
        });
        var fontSize = layer.fontSize();

        fonts.push('Helvetica');

        for (var index = 0, length = fonts.length; index < length; index++) {
          font = NSFont.fontWithName_size(fonts[index], fontSize);

          if (font) {
            break;
          }
        }

        layer.setFont(font);
      }

      if (text.fontSize) {
        layer.setFontSize(text.fontSize);
      }

      if (text.lineHeight) {
        layer.setLineHeight(text.lineHeight);
      }

      return null;
    }

    return {
      color: util.MSColor2RGBA(layer.textColor()),
      fontFamily: String(layer.font().displayName()),
      fontSize: layer.fontSize(),
      lineHeight: layer.lineHeight(),
    };
  }
}
