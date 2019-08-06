import UI from 'sketch/ui';
import { setTimeout } from "@skpm/timers/timeout";
import Panel from './panel';

export function onStartup(context) {
  setTimeout(() => {
    // threadDictionary要在setTimeout之后才能拿到
    var threadDictionary = NSThread.mainThread().threadDictionary();
    
    COScript.currentCOScript().shouldKeepAround = true;
    NSDocumentController.sharedDocumentController().documents().forEach(document => {
      if (!threadDictionary[document]) {
        threadDictionary[document] = Panel.new().create(context, document);
      }
    })
  }, 0);
}


export function onShutdown(context) {
  var threadDictionary = NSThread.mainThread().threadDictionary();
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

export function onOpenDocument(context) {
  COScript.currentCOScript().shouldKeepAround = true;

  setTimeout(() => {
    var document = context.actionContext.document;
    var threadDictionary = NSThread.mainThread().threadDictionary();

    if (!threadDictionary[document]) {
      threadDictionary[document] = Panel.new().create(context, document);
    }
  }, 0);
}

export function onCloseDocument(context) {
  var document = NSThread.mainThread().threadDictionary()[context.actionContext.document];

  document && document.closeDocument();
}

export function onSelectionChangedFinish(context) {
  var document = NSThread.mainThread().threadDictionary()[n.actionContext.document];

  document && document.onSelectionChanged();
}


export default function () {
  var threadDictionary = NSThread.mainThread().threadDictionary();
  console.log(threadDictionary);
  
  UI.message('Hello sketch');
}