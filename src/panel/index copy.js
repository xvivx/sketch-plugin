import CocoaClass from 'cocoascript-class';
import { setTimeout } from '@skpm/timers/timeout';

import createView from '../views/create-browser-view';


var Panel = CocoaClass({
  className: 'Panel',

  init2(context, document) {
    this.context = context;
    this.document = document;

    this.view = createView({
      _name: 'sketch',
      message: function(text) {
        document.showMessage(text);
      },
      onAppearanceChanged: function(e) {
        document.appearanceChangedCallback = e;
      },
    });

    this.injectView();

    this.view.setMainFrameURL('http://172.30.3.6:3000');
    NSDistributedNotificationCenter.defaultCenter().addObserver_selector_name_object(
      this,
      NSStringFromSelector('onAppearanceChanged'),
      NSString.stringWithString('AppleInterfaceThemeChangedNotification'),
      nil
    );

    return this;
  },
  loadFile(dirInAssets) {
    // 入参是相对于assets目录下的文件路径
    try {
      return NSString.stringWithString(this.context.command.pluginBundle().urlForResourceNamed(dirInAssets).path());
    } catch(error) {
      console.log(error);
      return '';
    }
  },
  injectView() {
    // 右侧检查器
    var container = this.document.documentWindow().contentView().subviews().objectAtIndex(0);
    // 右侧检查器视图
    var sketchInspectorView;
    // sketch默认检查器视图，添加该插件前的视图
    var sketchInspectorBackgroundView;
    // 检查器里的页面容器
    var inspectorPages = NSTabView.new();
    // sketch自带的属性面板
    var sketchPage = NSTabViewItem.new();
    // webview对应的面板
    var webviewPage = NSTabViewItem.new();
    // 检查器顶部的控制容器
    var controls = NSSegmentedControl.new();
    // 检查器里的sketch的logo
    var sketchIcon = NSImage.new().initWithContentsOfFile(this.loadFile('./sketch.png'));
    // 插件的logo
    var webviewIcon = NSImage.new().initWithContentsOfFile(
      this.loadFile('./micro-app-plugin.png')
    );

    for (var count = container.subviews().count() - 1; count > 0; count--) {
      sketchInspectorView = container.subviews().objectAtIndex(count).subviews().objectAtIndex(0);

      if (sketchInspectorView.class() + '' === 'NSStackView') {
        break;
      }
    }

    sketchInspectorView.spacing = 8;
    sketchInspectorView.alignment = NSLayoutAttributeCenterX;

    sketchInspectorBackgroundView = sketchInspectorView.subviews()[1];


    if (sketchInspectorBackgroundView.class() + '' === 'MSInspectorBackgroundView') {
      sketchInspectorView.setWantsLayer(true);
      sketchInspectorView.setBackgroundColor(sketchInspectorBackgroundView.color());
    } else {
      this.view.setBackgroundColor(
        NSColor.colorWithDeviceRed_green_blue_alpha(
          236 / 255,
          236 / 255,
          236 / 255,
          1
        )
      );
      sketchInspectorView.removeView(sketchInspectorBackgroundView);
    }

    var sketchVersion = NSBundle.mainBundle()
      .infoDictionary()
      .CFBundleShortVersionString.UTF8String();

    inspectorPages.tabViewType = NSNoTabsNoBorder;

    if (sketchVersion && Number(sketchVersion) < 52) {
      var sv = NSStackView.new();
      sv.insertView_atIndex_inGravity(sketchInspectorBackgroundView, 0, NSStackViewGravityTop);
      sketchPage.view = sv;
    } else {
      sketchPage.view = sketchInspectorBackgroundView;
    }
    
    webviewPage.view = this.view; //

    inspectorPages.addTabViewItem(sketchPage);
    inspectorPages.addTabViewItem(webviewPage);
    inspectorPages.widthAnchor().constraintEqualToConstant(sketchInspectorBackgroundView.frame().size.width).active = true;

    this.inspectorPages = inspectorPages;

    sketchInspectorView.insertView_atIndex_inGravity(inspectorPages, 1, NSStackViewGravityTop);

    controls.segmentStyle = NSSegmentStyleRounded;
    controls.segmentCount = 2;
    
    sketchIcon.template = true;
    webviewIcon.template = true;
    controls.setImage_forSegment(sketchIcon, 0);
    controls.setImage_forSegment(webviewIcon, 1);
    controls.setImageScaling_forSegment(NSImageScaleProportionallyDown, 0);
    controls.setImageScaling_forSegment(NSImageScaleProportionallyDown, 1);
    controls.setWidth_forSegment(28, 0);
    controls.setWidth_forSegment(28, 1);
    controls
      .heightAnchor()
      .constraintEqualToConstant(24)
      .setActive(1);
    controls.setSelected_forSegment(true, 0);
    controls.setTarget(this);
    controls.subviews()[0].setToolTip('Sketch');
    controls.subviews()[1].setToolTip('斑马插件');
    controls.setAction(NSStringFromSelector('onTabChange'));
    sketchInspectorView.insertView_atIndex_inGravity(controls, 1, NSStackViewGravityTop);
  },
  onTabChange: function(e) {
    var selectedSegment = e.selectedSegment();
    this.inspectorPages.selectTabViewItemAtIndex(selectedSegment),
      this.tabChangedCallback && this.tabChangedCallback(t);
  },
});


function onStart(context, document) {
  
  var threadDictionary;

  if (!document) {
    return;
  }

  COScript.currentCOScript().shouldKeepAround = true;
  threadDictionary = NSThread.mainThread().threadDictionary();

  if (threadDictionary[document]) {
    return;
  }

  setTimeout(function() {
    threadDictionary[document] = Panel.new().init2(context, document);
  }, 0);
}

function k() {
  var t = NSThread.mainThread().threadDictionary(),
    n = NSDocumentController.sharedDocumentController().documents();
  if (n && n.count()) {
    var r = n.slice(0);
    !(function n() {
      if (r.length) {
        var i = r.pop();
        if (t[i])
          try {
            t[i].closeFusionCool(), delete t[i];
          } catch (e) {
            log(e);
          }
        e(n);
      }
    })();
  }
}

export default onStart;
