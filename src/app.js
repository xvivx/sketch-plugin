
import ObjCClass, { SuperCall } from 'cocoascript-class';
import Panel, { initDocument } from './panel';
import BrowserWindow from 'sketch-module-web-view'


var a
export function onStartup(context) {
  // console.log(__command === context.command); // true
  // console.log(NSUUID.UUID().UUIDString());
  NSDocumentController.sharedDocumentController().documents().forEach(document => {
    Panel(context, document);
  })
  // var docs = NSDocumentController.sharedDocumentController().documents()
  // a = docs[0];
}


export default function (context) {
  // NSDocumentController.sharedDocumentController().documents().forEach(document => {
  //   Panel(document);
  // })
  // NSDocumentController.sharedDocumentController().documents().forEach(document => {
  //   var inspector = document
  //     .documentWindow()
  //     .contentView()
  //     .subviews()
  //     .objectAtIndex(0);


  //   var subviews = inspector.subviews();
  //   var stackView;

  //   for (var count = subviews.count() - 1; count > 0; count--) {
  //     stackView = inspector
  //       .subviews()
  //       .objectAtIndex(count)
  //       .subviews()
  //       .objectAtIndex(0);

  //     if (stackView.class() !== 'NSStackView') {
  //       break;
  //     }
  //   }

  //   stackView.spacing = 8;
  //   stackView.alignment = NSLayoutAttributeCenterX;

  //   var nativeView = stackView.subviews()[1];
  //   var width = nativeView.frame().size.width;

  //   function _(e) {
  //     return (
  //       'undefined' != typeof __command &&
  //         __command.pluginBundle() &&
  //         (e = __command
  //           .pluginBundle()
  //           .urlForResourceNamed(e)
  //           .path()),
  //       ''.concat(e)
  //     );
  //   }

  //   if (nativeView.class() === 'MSInspectorBackgroundView') {
  //     stackView.setWantsLayer(true);
  //     stackView.setBackgroundColor(nativeView.color());
  //   } else {
  //     // this.view.setBackgroundColor(NSColor.colorWithDeviceRed_green_blue_alpha(236 / 255, 236 / 255, 236 / 255, 1));
  //     stackView.removeView(nativeView);
  //   }

  //   var tabView = NSTabView.new();
  //   var tabViewItem = NSTabViewItem.new();
  //   var nsBundle = NSBundle.mainBundle()
  //     .infoDictionary()
  //     .CFBundleShortVersionString.UTF8String();

  //   tabView.tabViewType = NSNoTabsNoBorder;

  //   if (nsBundle && Number(nsBundle) < 52) {
  //     var sv = NSStackView.new();
  //     sv.insertView_atIndex_inGravity(nativeView, 0, NSStackViewGravityTop);
  //     tabViewItem.view = sv;
  //   } else {
  //     tabViewItem.view = nativeView;
  //   }

  //   var myTabView = NSTabViewItem.new();

  //   // myTabView.view = this.view; //

  //   tabView.addTabViewItem(tabViewItem);
  //   tabView.addTabViewItem(myTabView);

  //   tabView.widthAnchor().constraintEqualToConstant(width).active = true;

  //   stackView.insertView_atIndex_inGravity(tabView, 1, NSStackViewGravityTop);

  //   var segc = NSSegmentedControl.new();

  //   (segc.segmentStyle = NSSegmentStyleRounded), (segc.segmentCount = 2);

  //   var sketchLogo = NSImage.new().initWithContentsOfFile(_('./sketch.png'));
  //   var myLogo = NSImage.new().initWithContentsOfFile(_('./micro-app-plugin.png'));

  //   sketchLogo.template = true;
  //   myLogo.template = true;

  //   segc.setImage_forSegment(sketchLogo, 0),
  //     segc.setImage_forSegment(myLogo, 1),
  //     segc.setImageScaling_forSegment(NSImageScaleProportionallyDown, 0),
  //     segc.setImageScaling_forSegment(NSImageScaleProportionallyDown, 1),
  //     segc.setWidth_forSegment(28, 0),
  //     segc.setWidth_forSegment(28, 1),
  //     segc
  //       .heightAnchor()
  //       .constraintEqualToConstant(24)
  //       .setActive(1),
  //     segc.setSelected_forSegment(!0, 0),
  //     segc.setTarget(this),
  //     segc.subviews()[0].setToolTip('Sketch'),
  //     segc.subviews()[1].setToolTip('斑马插件'),
  //     segc.setAction(NSStringFromSelector('onTabChange')),
  //     stackView.insertView_atIndex_inGravity(segc, 1, NSStackViewGravityTop);
    
  // });



  // panel.injectView();
}