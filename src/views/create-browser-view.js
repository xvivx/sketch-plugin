import CocoaClass from 'cocoascript-class';
import wrap from '../wrap';

var BrowserView = CocoaClass({
  className: 'BrowserView',
  superclass: WebView,
  init() {
    this.drawsBackground = false;
    this.shouldCloseWithWindow = true;
    this.setFrameLoadDelegate(this);
  },
  ['webView:didCreateJavaScriptContext:forFrame:']() {
    if (!this.bridge) {
      return;
    }
    
    this.windowScriptObject().setValue_forKey_(
      wrap(this.bridge),
      this.bridge._name
    );
  },
});

export default function(bridge) {
  return Object.assign(BrowserView.new(), { bridge });
}
