// @flow
import layerGroup from '../jsonUtils/layerGroup';
import processTransform from '../utils/processTransform';

const DEFAULT_OPACITY = 1.0;

export default class SketchRenderer {
  getDefaultGroupName(
    // eslint-disable-next-line no-unused-vars
    props,
  ) {
    return 'Group';
  }

  renderGroupLayer(layout, style, textStyle, props) {
    // Default SketchRenderer just renders an empty group

    const transform = processTransform(layout, style);

    const opacity = style.opacity !== undefined ? style.opacity : DEFAULT_OPACITY;

    return {
      ...layerGroup(
        layout.left,
        layout.top,
        layout.width,
        layout.height,
        opacity,
        props.resizingConstraint,
      ),
      name: props.name || this.getDefaultGroupName(props),
      ...transform,
    };
  }

  /* eslint-disable no-unused-vars */
  renderBackingLayers(
    layout,
    style,
    textStyle,
    props,
    children,
  ) {
    return [];
  }
  /* eslint-enable */
}
