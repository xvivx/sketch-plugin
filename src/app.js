import UI from 'sketch/ui';
import Panel from './panel';

var threadDictionary = NSThread.mainThread().threadDictionary();


export function onStartup(context) {
  NSDocumentController.sharedDocumentController().documents().forEach(document => {
    if (!threadDictionary[document]) {
      COScript.currentCOScript().shouldKeepAround = true;
      threadDictionary[document] = Panel.new().create(context, document);
    }
  })
}


export function onShutdown() {
  var documents = NSDocumentController.sharedDocumentController().documents();

  if (!documents || !documents.count()) {
    return;
  }

  documents.forEach((document) => {
    if (!threadDictionary[document]) {
      return;
    }

    try {
      threadDictionary[document].destroy();
      delete threadDictionary[document];
    } catch (error) {
      console.log(error);
    }
  });
}

export default function () {
  UI.message('Hello sketch');
}