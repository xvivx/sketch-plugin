export default function bridge(context, document) {
  return {
    _name: 'sketch',
    message(text) {
      document.showMessage(text);
    },
    onTabChanged(callback) {
      context.tabChangedCallback = callback;
    },
    onSelectionChanged(callback) {
      context.selectionChangedCallback = callback;
    },
    version() {
      return {
        sketch: NSBundle.mainBundle()
          .infoDictionary()
          .CFBundleShortVersionString.UTF8String(),
        plugin: '1.0.0',
      };
    },
  };
}
