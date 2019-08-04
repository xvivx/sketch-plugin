export default function bridge(context, document) {
  return {
    _name: 'sketch',
    message(text) {
      document.showMessage(text);
    },
    onTabChanged(callback) {
      context.tabChangedCallback = callback;
    },
  };
}
