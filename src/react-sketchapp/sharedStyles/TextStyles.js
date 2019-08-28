
import getSketchVersion from '../utils/getSketchVersion';
import hashStyle from '../utils/hashStyle';
import sharedTextStyles from '../wrappers/sharedTextStyles';
import { makeTextStyle } from '../jsonUtils/textLayers';
import pick from '../utils/pick';
import { INHERITABLE_FONT_STYLES } from '../utils/constants';


let _styles = {};
const _byName = {};

const sketchVersion = getSketchVersion();

const registerStyle = (name, style, id) => {
  const safeStyle = pick(style, INHERITABLE_FONT_STYLES);
  const hash = hashStyle(safeStyle);
  const sketchStyle = makeTextStyle(safeStyle);
  const sharedObjectID =
    sketchVersion !== 'NodeJS' ? sharedTextStyles.addStyle(name, sketchStyle) : id;

  if (!sharedObjectID) {
    throw new Error(
      `Missing id for the style named: ${name}. Please provide it using the idMap option`,
    );
  }

  sketchStyle.sharedObjectID = sharedObjectID;

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
  const { clearExistingStyles, context, idMap } = options;

  if (sketchVersion !== 'NodeJS' && sketchVersion < 50) {
    context.document.showMessage('💎 Requires Sketch 50+ 💎');
    return {};
  }

  if (sketchVersion !== 'NodeJS') {
    sharedTextStyles.setContext(context);

    if (clearExistingStyles) {
      _styles = {};
      sharedTextStyles.setStyles([]);
    }
  }

  Object.keys(styles).forEach(name => registerStyle(name, styles[name], (idMap || {})[name]));

  return _styles;
};

const resolve = (style) => {
  const safeStyle = pick(style, INHERITABLE_FONT_STYLES);
  const hash = hashStyle(safeStyle);

  return _styles[hash];
};

const get = (name) => {
  const hash = _byName[name];
  const style = _styles[hash];

  return style ? style.cssStyle : undefined;
};

const clear = () => {
  _styles = {};
  if (sketchVersion !== 'NodeJS') {
    sharedTextStyles.setStyles([]);
  }
};

const toJSON = () =>
  Object.keys(_styles).map(k => ({
    _class: 'sharedStyle',
    do_objectID: _styles[k].sharedObjectID,
    name: _styles[k].name,
    value: _styles[k].sketchStyle,
  }));

const styles = () => _styles;

const TextStyles = {
  create,
  resolve,
  get,
  styles,
  clear,
  toJSON,
};

export default TextStyles;
