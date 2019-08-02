import CocoaClass from 'cocoascript-class';
import { setTimeout } from '@skpm/timers/timeout';

import createView from '../views/create-browser-view';


var Panel = CocoaClass({
  className: 'Panel',

  init2(context, document) {
    this.context = context;
    this.document = document;

    this.webview = createView({
      _name: 'sketch',
      message: function(text) {
        document.showMessage(text);
      },
      onAppearanceChanged: function(e) {
        document.appearanceChangedCallback = e;
      },
    });

    this.injectView();
    this.webview.setMainFrameURL('http://172.30.3.254:3000');

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
    return this.context.command.pluginBundle().urlForResourceNamed(dirInAssets).path();
  },
  injectView() {
    // sketch右侧界面, MSSplitView类型
    var sketchRightSidebar = this.document.documentWindow().contentView().subviews().objectAtIndex(0);
    // 检查器容器
    var inspector;
    // sketch检查器顶部除去涂层对齐那一工具栏下面的视图，工具栏那一层是MSAlignmentBackgroundView类型
    var sketchInspectorBackgroundView;
    // 检查器里的所有tab页面的容器
    var tabsContainer = NSTabView.new();
    // sketch自带的属性面板
    var sketchPage = NSTabViewItem.new();
    // webview对应的面板
    var webviewPage = NSTabViewItem.new();
    // 检查器顶部的控制容器
    var controls = NSSegmentedControl.new();
    var version = NSBundle.mainBundle().infoDictionary().CFBundleShortVersionString.UTF8String();
    // 检查器里的sketch的logo
    var sketchIcon = NSImage.new().initWithContentsOfFile(this.loadFile('sketch.png'));
    // 插件的logo
    var webviewIcon = NSImage.new().initWithContentsOfFile(
      this.loadFile('micro-app-plugin.png')
    );
    
    sketchRightSidebar.subviews().some(function (view, index, views) {
      inspector = views.objectAtIndex(index).subviews().objectAtIndex(0);

      return String(inspector.class()) === 'NSStackView';
    });
    
    inspector.spacing = 8;
    inspector.alignment = NSLayoutAttributeCenterX;
    sketchInspectorBackgroundView = inspector.subviews()[1];
    
    if (sketchInspectorBackgroundView.class() + '' === 'MSInspectorBackgroundView') {
      inspector.setWantsLayer(true);
      inspector.setBackgroundColor(sketchInspectorBackgroundView.color());
    } else {
      this.webview.setBackgroundColor(
        NSColor.colorWithDeviceRed_green_blue_alpha(
          236 / 255,
          236 / 255,
          236 / 255,
          1
        )
      );
      inspector.removeView(sketchInspectorBackgroundView);
    }

    if (version && Number(version) < 52) {
      var sv = NSStackView.new();
      sv.insertView_atIndex_inGravity(sketchInspectorBackgroundView, 0, NSStackViewGravityTop);
      sketchPage.view = sv;
    } else {
      sketchPage.view = sketchInspectorBackgroundView;
    }
    
    webviewPage.view = this.webview; //

    tabsContainer.tabViewType = NSNoTabsNoBorder;
    tabsContainer.widthAnchor().constraintEqualToConstant(sketchInspectorBackgroundView.frame().size.width).active = true;
    // 添加之后sketchInspectorBackgroundView宽度为0
    tabsContainer.addTabViewItem(sketchPage);
    tabsContainer.addTabViewItem(webviewPage);

    this.tabsContainer = tabsContainer;

    inspector.insertView_atIndex_inGravity(tabsContainer, 1, NSStackViewGravityTop);

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
    controls.heightAnchor().constraintEqualToConstant(24).setActive(1);
    controls.setSelected_forSegment(true, 0);
    controls.setTarget(this);
    controls.subviews()[0].setToolTip('Sketch');
    controls.subviews()[1].setToolTip('斑马插件');
    controls.setAction(NSStringFromSelector('onTabChange'));
    inspector.insertView_atIndex_inGravity(controls, 1, NSStackViewGravityTop);
  },
  onTabChange: function(e) {
    var selectedSegment = e.selectedSegment();

    this.tabsContainer.selectTabViewItemAtIndex(selectedSegment);
    this.tabChangedCallback && this.tabChangedCallback(t);
  },
});


function onStart(context, document) {
  var threadDictionary = NSThread.mainThread().threadDictionary();
  
  if (!threadDictionary[document]) {
    // 有问题可将下面一行移上去
    COScript.currentCOScript().shouldKeepAround = true;
    threadDictionary[document] = Panel.new().init2(context, document);
  }
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
