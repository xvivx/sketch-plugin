

import getSketchVersion from './getSketchVersion';
import sketchMethod from '../jsonUtils/sketchImpl/findFontName';
import nodeMethod from '../jsonUtils/nodeImpl/findFontName';

const findFontName = (style) => {
  if (getSketchVersion() === 'NodeJS') {
    return nodeMethod(style);
  }
  return sketchMethod(style);
};

export default findFontName;
