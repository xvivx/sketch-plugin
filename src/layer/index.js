import Layer from './layer';
import Group from './group';
import Shape from './shape';
import Text from './text';

var classes = {
  MSLayerGroup: 'group',
  MSShapeGroup: 'shape',
  MSTextLayer: 'text',
  MSBitmapLayer: 'image',
  MSArtboardGroup: 'artboard',
  MSSliceLayer: 'slice',
  MSHotspotLayer: 'hotspot',
  MSSymbolInstance: 'symbolInstance',
  MSSymbolMaster: 'symbolMaster',
};

var constructors = {
  layer: Layer,
  artboard: Group,
  group: Group,
  shape: Shape,
  text: Text,
};

export default function(layer) {
  var type = layer.isKindOfClass(MSShapePathLayer.class()) ? 'shape' : classes[layer.class()] || 'layer';

  return new (constructors[type] || Layer)(layer, type);
}
