import Export from '../export';

export default function bridge(context, document) {
  var exportor;

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
        sketch: NSBundle.mainBundle().infoDictionary().CFBundleShortVersionString.UTF8String(),
        plugin: '1.0.0',
      };
    },
    exportSketchJson() {
      exportor = exportor || new Export(NSDocumentController.sharedDocumentController().currentDocument());
      if(exportor) {
        document.showMessage('导出');
      }
      return exportor.export();
    }
  };
}
