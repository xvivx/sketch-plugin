// @flow
import SketchRenderer from './SketchRenderer';
import makeTextLayer from '../jsonUtils/textLayers';
import { makeRect } from '../jsonUtils/models';
import TextStyles from '../sharedStyles/TextStyles';

export default class TextRenderer extends SketchRenderer {
  getDefaultGroupName(props) {
    return props.name || 'Text';
  }

  renderBackingLayers(
    layout,
    style,
    textStyle,
    props,
  ) {
    let { name } = props;

    // Append all text nodes's content into one string
    if (!name && props.textNodes) {
      name = '';
      props.textNodes.forEach(textNode => {
        name += textNode.content;
      });
    }

    const frame = makeRect(0, 0, layout.width, layout.height);
    const layer = makeTextLayer(frame, name, props.textNodes, props.resizingConstraint);

    const resolvedTextStyle = TextStyles.resolve(textStyle);
    if (resolvedTextStyle) {
      layer.style = resolvedTextStyle.sketchStyle;
      layer.style.sharedObjectID = resolvedTextStyle.sharedObjectID;
    } else {
      const resolvedStyle = TextStyles.resolve(props.style);
      if (resolvedStyle) {
        layer.style = resolvedStyle.sketchStyle;
        layer.style.sharedObjectID = resolvedStyle.sharedObjectID;
      }
    }

    return [layer];
  }
}
