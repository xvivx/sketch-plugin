// @flow
import * as invariant from 'invariant';
import { fromSJSONDictionary } from 'sketchapp-json-plugin';

class TextStyles {
  _context;

  constructor() {
    this._context = null;
  }

  setContext(context) {
    invariant(context, 'Please provide a context');

    this._context = context;
    return this;
  }

  setStyles(styles) {
    invariant(this._context, 'Please provide a context');

    this._context.document
      .documentData()
      .layerTextStyles()
      .setObjects(styles);

    return this;
  }

  addStyle(name, style) {
    const { _context } = this;
    invariant(_context, 'Please provide a context');

    const textStyle = fromSJSONDictionary(style);

    // Flow doesn't pick up invariant truthies
    const context = _context;

    const container = context.document.documentData().layerTextStyles();

    if (container.addSharedStyleWithName_firstInstance) {
      const s = container.addSharedStyleWithName_firstInstance(name, textStyle);

      // NOTE(gold): the returned object ID changes after being added to the store
      // _don't_ rely on the object ID we pass to it, but we have to have one set
      // otherwise Sketch crashes
      return s.objectID();
    }
    // addSharedStyleWithName_firstInstance was removed in Sketch 50
    const s = MSSharedStyle.alloc().initWithName_firstInstance(name, textStyle);
    container.addSharedObject(s);

    return s.objectID();
  }
}

export default new TextStyles();
