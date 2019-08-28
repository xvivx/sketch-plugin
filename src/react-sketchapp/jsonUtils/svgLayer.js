
import getSketchVersion from '../utils/getSketchVersion';
import sketchMethod from './sketchImpl/makeSvgLayer';
import nodeMethod from './nodeImpl/makeSvgLayer';

const makeSvgLayer = (layout, name, svg) => {
  if (getSketchVersion() === 'NodeJS') {
    return nodeMethod(layout, name, svg);
  }
  return sketchMethod(layout, name, svg);
};

export default makeSvgLayer;
