// @flow
import * as invariant from 'invariant';
import { fromSJSONDictionary } from '@skpm/sketchapp-json-plugin';
import { generateID } from '../jsonUtils/models';

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

    // generate a dummy shared object id
    // eslint-disable-next-line
    style.sharedObjectID = generateID();

    const textStyle = fromSJSONDictionary(style);

    // Flow doesn't pick up invariant truthies
    const context = _context;

    const container = context.document.documentData().layerTextStyles();

    let sharedStyle;

    // Sketch < 50
    if (container.addSharedStyleWithName_firstInstance) {
      sharedStyle = container.addSharedStyleWithName_firstInstance(name, textStyle);
    } else {
      const allocator = MSSharedStyle.alloc();
      // Sketch 50, 51
      if (allocator.initWithName_firstInstance) {
        sharedStyle = allocator.initWithName_firstInstance(name, textStyle);
      } else {
        sharedStyle = allocator.initWithName_style(name, textStyle);
      }

      container.addSharedObject(sharedStyle);
    }

    // NOTE(gold): the returned object ID changes after being added to the store
    // _don't_ rely on the object ID we pass to it, but we have to have one set
    // otherwise Sketch crashes
    return String(sharedStyle.objectID());
  }
}

export default new TextStyles();
