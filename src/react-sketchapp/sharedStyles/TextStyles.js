// @flow
import * as invariant from 'invariant';
import { appVersionSupported } from 'sketchapp-json-plugin';
import hashStyle from '../utils/hashStyle';
import sharedTextStyles from '../wrappers/sharedTextStyles';
import { makeTextStyle } from '../jsonUtils/hacksForJSONImpl';
import pick from '../utils/pick';
import { INHERITABLE_FONT_STYLES } from '../utils/constants';



let _styles = {};
const _byName = {};

const registerStyle = (name, style) => {
  const safeStyle = pick(style, INHERITABLE_FONT_STYLES);
  const hash = hashStyle(safeStyle);
  const sketchStyle = makeTextStyle(safeStyle);
  const sharedObjectID = sharedTextStyles.addStyle(name, sketchStyle);

  // FIXME(gold): side effect :'(
  _byName[name] = hash;

  _styles[hash] = {
    cssStyle: safeStyle,
    name,
    sketchStyle,
    sharedObjectID,
  };
};



const create = (options, styles) => {
  const { clearExistingStyles, context } = options;

  if (!appVersionSupported()) {
    context.document.showMessage('💎 Requires Sketch 43+ 💎');
    return {};
  }

  invariant(options && options.context, 'Please provide a context');

  sharedTextStyles.setContext(context);

  if (clearExistingStyles) {
    _styles = {};
    sharedTextStyles.setStyles([]);
  }

  Object.keys(styles).forEach(name => registerStyle(name, styles[name]));

  return _styles;
};

const resolve = (style) => {
  const hash = hashStyle(style);

  return _styles[hash];
};

const get = (name) => {
  const hash = _byName[name];
  const style = _styles[hash];

  return style ? style.cssStyle : {};
};

const clear = () => {
  _styles = {};
  sharedTextStyles.setStyles([]);
};

const styles = () => _styles;

const TextStyles = {
  create,
  resolve,
  get,
  styles,
  clear,
};

export default TextStyles;
