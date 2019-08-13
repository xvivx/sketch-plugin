import Layer from './layer';
import buildTree from '../react-sketchapp/build-tree';
import flexToSketchJSON from '../react-sketchapp/flex-to-sketch-json';
import { fromSJSONDictionary } from 'sketchapp-json-plugin';

export default class Group extends Layer {
  render(data) {
    // render的sketch对象
    var sketchObject;

    if (/^<svg\b/i.test(data)) {
      sketchObject = this.drawSvg(data);
    } else if (data._class) {
      sketchObject = this.drawFromSketchJson(data);
    } else {
      sketchObject = this.drawFromComponent(data);
    }
    
    var layers = sketchObject.layers();
    var width = sketchObject.frame().width();
    var height = sketchObject.frame().height();

    this._layer.removeAllLayers();
    this._layer.frame().setWidth(width);
    this._layer.frame().setHeight(height);
    this._layer.addLayers(layers);
  }
  drawSvg(str) {
    var svg = MSSVGImporter.new();
    // 将字符串参数转化成能生成svg的数据
    var data = NSString.stringWithString(str).dataUsingEncoding(NSUTF8StringEncoding);

    svg.prepareToImportFromData(data);
    
    return svg.importAsLayer();
  }
  drawFromComponent(dataJson) {
    var data = JSON.parse(dataJson);
    var tree = buildTree(data);
    var treeJson = flexToSketchJSON(tree);

    return fromSJSONDictionary(treeJson);
  }
  drawFromSketchJson(json) {
    var layer = MSJSONDictionaryUnarchiver.unarchiveObjectFromDictionary_asVersion_corruptionDetected_error(json, '95', null, null);
    
    return layer.class().mutableClass().alloc().initWithImmutableModelObject(layer);
  }
}
