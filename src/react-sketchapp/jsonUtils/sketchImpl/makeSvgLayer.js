import { toSJSON } from '@skpm/sketchapp-json-plugin';


// NOTE(gold): toSJSON doesn't recursively parse JS objects
// https://github.com/airbnb/react-sketchapp/pull/73#discussion_r108529703
function encodeSketchJSON(sketchObj) {
  const encoded = toSJSON(sketchObj);
  return encoded ? JSON.parse(encoded) : {};
}

export default function makeSvgLayer(layout, name, svg) {
  const svgString = NSString.stringWithString(svg);
  const svgData = svgString.dataUsingEncoding(NSUTF8StringEncoding);
  const svgImporter = MSSVGImporter.svgImporter();
  svgImporter.prepareToImportFromData(svgData);
  const svgLayer = svgImporter.importAsLayer();
  svgLayer.name = name;
  svgLayer.rect = {
    origin: {
      x: 0,
      y: 0,
    },
    size: {
      width: layout.width,
      height: layout.height,
    },
  };
  return encodeSketchJSON(svgLayer);
}
