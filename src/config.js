// var devDomain = `https://fusion.design/plugin/cool/panel`;
var devDomain = `http://localhost:8000/sketch/component`;
var prdDomain = `http://172.30.3.6:3000`;
var isDev = process.env.NODE_ENV === 'development';


export var WRBVIEW_FRAME_URL = isDev ? devDomain : prdDomain;
export var SKETCH_LAYER_KEY = 'SKETCH_LAYER_KEY';
export var PLUGIN_ID = 'BM_MICRO_APP_SKETCH_PLUGIN';