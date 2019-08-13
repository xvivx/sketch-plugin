import { PLUGIN_ID } from '../config';

export default class Layer {
  constructor(layer, type) {
    this._layer = layer;
    this._type = type;
  }
  data(key, value) {
    var command = context.command;

    if (value !== undefined) {
      command.setValue_forKey_onLayer_forPluginIdentifier(String(value), key, this._layer, PLUGIN_ID);
      return null;
    } else {
      return command.valueForKey_onLayer_forPluginIdentifier(key, this._layer, PLUGIN_ID);
    }
  }
  get type() {
    return this._type;
  }
  get id() {
    return String(this._layer.objectID());
  }
  get name() {
    return String(this._layer.name());
  }
  set name(name) {
    this._layer.name = name;
  }
}
