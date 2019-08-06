import CocoaClass from 'cocoascript-class';
import createWebview from '../webview';
import createBridge from './bridge';
import { WRBVIEW_FRAME_URL } from '../config';

function v(e){
  var t=[];
  if("MSLayerArray"==e.class()){
    for(var n=0,r=e.containedLayersCount();n<r;++n){
      t.push(e.layerAtIndex(n))
    };
  }else t.push(e);
  return t.map(s.default);
}

var Panel = CocoaClass({
  className: 'Panel',
  create(context, document) {
    this.context = context;
    this.document = document;
    this.webview = createWebview(createBridge(context, document));
    this.webview.setMainFrameURL(WRBVIEW_FRAME_URL);
    this.render();

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
  render() {
    var version = NSBundle.mainBundle().infoDictionary().CFBundleShortVersionString.UTF8String();
    // sketch右侧界面, MSSplitView类型
    var sketchRightInterface = this.document.documentWindow().contentView().subviews().objectAtIndex(0);
    // 检查器视图面板，用来存放自定义界面
    var sketchInspectorPanel;
    // 检查器顶部除去图层对齐那一工具栏下面的视图，工具栏那一层是MSAlignmentBackgroundView类型
    var sketchOriginalInspectorBackgroundView;
    // 检查器里的所有tab页面的容器
    var sketchAndWebviewPanelContainer = NSTabView.new();
    // sketch自带的属性面板
    var sketchTabPanel = NSTabViewItem.new();
    // webview对应的面板
    var webviewTabPanel = NSTabViewItem.new();
    // 检查器顶部的控制容器
    var controls = NSSegmentedControl.new();
    // 检查器里的sketch的logo
    var sketchIcon = NSImage.new().initWithContentsOfFile(this.loadFile('sketch.png'));
    // 插件的logo
    var webviewIcon = NSImage.new().initWithContentsOfFile(this.loadFile('micro-app-plugin.png'));
    
    sketchRightInterface.subviews().some(function (view, index, views) {
      sketchInspectorPanel = views.objectAtIndex(index).subviews().objectAtIndex(0);

      return String(sketchInspectorPanel.class()) === 'NSStackView';
    });
    
    sketchInspectorPanel.spacing = 8;
    sketchInspectorPanel.alignment = NSLayoutAttributeCenterX;
    sketchOriginalInspectorBackgroundView = sketchInspectorPanel.subviews()[1];
    
    if (sketchOriginalInspectorBackgroundView.class() + '' === 'MSInspectorBackgroundView') {
      sketchInspectorPanel.setWantsLayer(true);
      sketchInspectorPanel.setBackgroundColor(sketchOriginalInspectorBackgroundView.color());
    } else {
      this.webview.setBackgroundColor(
        NSColor.colorWithDeviceRed_green_blue_alpha(
          236 / 255,
          236 / 255,
          236 / 255,
          1
        )
      );
      sketchInspectorPanel.removeView(sketchOriginalInspectorBackgroundView);
    }

    // 设置sketch自带的属性面板
    if (version && Number(version) < 52) {
      var sv = NSStackView.new();
      sv.insertView_atIndex_inGravity(sketchOriginalInspectorBackgroundView, 0, NSStackViewGravityTop);
      sketchTabPanel.view = sv;
    } else {
      sketchTabPanel.view = sketchOriginalInspectorBackgroundView;
    }
    
    // 设置webview
    webviewTabPanel.view = this.webview;

    // 设置webview面板和sketch属性面板
    sketchAndWebviewPanelContainer.tabViewType = NSNoTabsNoBorder;
    sketchAndWebviewPanelContainer.widthAnchor().constraintEqualToConstant(sketchOriginalInspectorBackgroundView.frame().size.width).active = true;
    // 添加之后sketchInspectorBackgroundView宽度为0
    sketchAndWebviewPanelContainer.addTabViewItem(sketchTabPanel);
    sketchAndWebviewPanelContainer.addTabViewItem(webviewTabPanel);

    
    sketchIcon.template = true;
    webviewIcon.template = true;
    

    controls.segmentStyle = NSSegmentStyleRounded;
    controls.segmentCount = 2;
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
    

    sketchInspectorPanel.insertView_atIndex_inGravity(sketchAndWebviewPanelContainer, 1, NSStackViewGravityTop);
    sketchInspectorPanel.insertView_atIndex_inGravity(controls, 1, NSStackViewGravityTop);
    

    this.sketchAndWebviewPanelContainer = sketchAndWebviewPanelContainer;
    this.sketchInspectorPanel = sketchInspectorPanel;
    this.sketchOriginalInspectorBackgroundView = sketchOriginalInspectorBackgroundView;
  },
  onTabChange(action) {
    var selectedSegment = action.selectedSegment();

    this.sketchAndWebviewPanelContainer.selectTabViewItemAtIndex(selectedSegment);
    this.tabChangedCallback && this.tabChangedCallback(selectedSegment);
  },
  destroy(){
    var sketchInspectorPanel = this.sketchInspectorPanel;

    if(!sketchInspectorPanel || !sketchInspectorPanel.subviews || sketchInspectorPanel.subviews().count() !== 3) {
      return ;
    }

    var subviews = sketchInspectorPanel.subviews();
    var bgView = subviews[0];
    var tabView = subviews[1];
    var control = subviews[2];
    var bgViewSize = bgView.frame().size;
    var tabViewSize = tabView.frame().size;
    var inspectorSize = sketchInspectorPanel.frame().size;
    var cbHeightDiff = inspectorSize.height - bgViewSize.height;
    var cbuHeightDiff = inspectorSize.height - bgViewSize.height - tabViewSize.height;

    
    bgView.removeFromSuperview();
    tabView.removeFromSuperview();
    control.removeFromSuperview();
    
    
    bgView.widthAnchor().constraintEqualToConstant(inspectorSize.width).setActive(1);
    bgView.heightAnchor().constraintEqualToConstant(bgViewSize.height).setActive(1);
    
    this.webview.close();
    this.sketchOriginalInspectorBackgroundView.widthAnchor().constraintEqualToConstant(inspectorSize.width).setActive(1);
    this.sketchOriginalInspectorBackgroundView.heightAnchor().constraintEqualToConstant(cbHeightDiff).setActive(1);
    this.sketchOriginalInspectorBackgroundView.heightAnchor().constraintEqualToConstant(cbHeightDiff - cbuHeightDiff).setActive(1);

    sketchInspectorPanel.spacing = 0;
    sketchInspectorPanel.addArrangedSubview(bgView);
    sketchInspectorPanel.addArrangedSubview(this.sketchOriginalInspectorBackgroundView)
    COScript.currentCOScript().shouldKeepAround = false;
  },
  closeDocument(){
    this.webview.close();
    NSDistributedNotificationCenter.defaultCenter().removeObserver(this);
    COScript.currentCOScript().shouldKeepAround = false;
  },
  onSelectionChanged() {
    var selection = this.document.selectedLayers();
    var choosed = selection.layerAtIndex(0);
    var isValid = selection.containedLayersCount() === 1 && choosed.class() === 'MSLayerGroup';
    var loading = choosed.layers() && choosed.layers()[0] || {};
    var componentName = /^__magic:(.*?)(?:,(.*))?$/.exec(loading.name());
  
    console.log('匹配到的组件名称1: ' + componentName[1] + '-2-' + componentName[2]);
    
    if(isValid && componentName) {
      if(componentName[2] === 'artboard') {
        var ancestor = choosed.ancestors()[choosed.ancestors().length-1];
        var artboard = MSArtboardGroup.alloc().init();
  
        artboard.frame().setX(choosed.frame().x());
        artboard.frame().setY(choosed.frame().y());
        artboard.frame().setWidth(choosed.frame().width());
        artboard.frame().setHeight(choosed.frame().height());
  
        ancestor.removeLayer(choosed);
        ancestor.addLayer(artboard);
  
        artboard.select_byExpandingSelection(true, false);
        choosed = artboard;
      }
  
      choosed.name = componentName[1];
    }
  
    this.selectionChangedCallback && this.selectionChangedCallback(v(e));
  }
});


export default Panel;
