import UI from 'sketch/ui';
import { SKETCH_LAYER_KEY, PLUGIN_ID } from './config';

function toJSString(sketchString) {
  return String(sketchString).toString();
}

export default class Bridage {
  constructor(document) {
    this.document = document;
  }
  frame(rect) {
    return {
      left: rect.x(),
      top: rect.y(),
      width: rect.width(),
      height: rect.height()
    }
  }
  export() {
    var tree = this.createPageTree();
    var treeJson = {};
    var appPages = {};

    if (!tree.artboards.length) {
      var errorMsg = `没有在当前页面找到Artboard！`;
      UI.alert('导出信息不完整', errorMsg);
      return;
    }
    
    var invalidateArtboard = tree.artboards.some(artboard => {
      var sketchObject = artboard.sketchObject;

      var hasAppMark = sketchObject.layers().some(topLayer => {
        if (toJSString(topLayer.name()) === `AppGroup`) {
          appPages[artboard.objectID] = topLayer;
          return true;
        }
      });

      if (!hasAppMark) {
        var errorMsg = `${toJSString(sketchObject.name())}Artboard下找不到AppGroup分组，请先标记该分组，用于告诉开发同学App要开发的范围！`;
        UI.alert('导出信息不完整', errorMsg);
        return true;
      }
    });

    if (invalidateArtboard) {
      return;
    }

    treeJson.artboards = tree.artboards.map((artboard, index) => {
      var tree = this.getArtboardTree(appPages[artboard.objectID]);
      var layers = tree.layers;
      var rect = tree.rect;
      var artFrame = this.frame(artboard.sketchObject.frame());
      
      return {
        name: toJSString(artboard.name),
        layers: layers,
        rect: rect,
        artWidth: artFrame.width,
        artHeight: artFrame.height,
        objectID: toJSString(artboard.objectID),
        sketchObject: artboard.sketchObject
      }
    });

    treeJson.name = toJSString(tree.name);

    return JSON.stringify(treeJson);
  }
  abstractUserData(layer) {
    return layer.userInfo() && layer.userInfo()[PLUGIN_ID][SKETCH_LAYER_KEY];
  }
  getArtboardTree(artboard) {
    var layers;
    var result = {
      name: toJSString(artboard.name()),
      type: toJSString(artboard.class()),
      objectID: toJSString(artboard.objectID()),
      rect: this.frame(artboard.frame())
    };

    result.layers = result.layers || [];


    if (artboard.layers) {
      layers = artboard.layers();
    } else {
      if (!result.symbolID || result.layers.length !== 0) {
        return result;
      }
    }

    if (!layers || !layers.count) {
      return result;
    }

    layers.forEach(layer => {
      var userInfoStr;
      var userInfoObj;
      if (typeof layer.name === 'function') {
        if (layer.class() === MSLayerGroup && (userInfoStr = this.abstractUserData(layer))) {
          userInfoObj = JSON.parse(toJSString(userInfoStr));
          result.layers.push({
            name: toJSString(layer.name()),
            compData: userInfoObj,
            parentID: userInfoObj.parentID,
            rect: this.frame(layer.frame()),
            objectID: toJSString(layer.objectID())
          });

          return;
        }
        result.layers.push(this.getArtboardTree(layer));
      }
    });

    return result;
  }
  createPageTree() {
    var currentPage = this.document.currentPage()
    var currentPageJson = {
      name: currentPage.name(),
      objectID: currentPage.objectID(),
      artboards: []
    };

    currentPage.artboards().forEach(subArtboard => {
      currentPageJson.artboards.push({
        name: subArtboard.name(),
        objectID: subArtboard.objectID(),
        sketchObject: subArtboard,
      });
    });

    return currentPageJson;
  }
}


