import CocoaClass from 'cocoascript-class';

function changeOcTypeToJs(oc) {
  var val = oc;

  if (oc.isKindOfClass(NSString.class())) {
    val = ''.concat(oc);
  } else if (oc.isKindOfClass(NSNumber.class())) {
    val = oc + 0;
  } else if (oc.isKindOfClass(NSDictionary.class())) {
    val = {};
    Object.keys(oc).forEach(function(key) {
      val[key] = a(oc[key]);
    });
  } else if (oc.isKindOfClass(NSArray.class())) {
    val = [];
    oc.forEach(function(item) {
      val.push(changeOcTypeToJs(item));
    });
  }

  return val;
}

function unknown(oc) {
  if ('WebScriptObject' === oc.class() + '') {
    var webJs = oc.JSValue();

    if (webJs.hasProperty('call')) {
      return function (...args) {
        oc.callWebScriptMethod_withArguments(
          'call',
          [null].concat(args).map(wrapFunc)
        );
      };
    } else if (webJs.isArray()) {
      return changeOcTypeToJs(webJs.toArray());
    } else {
      return changeOcTypeToJs(webJs.toDictionary());
    }
  }
  return changeOcTypeToJs(oc);
}

var Wrapper = CocoaClass({
  className: 'Wrapper',
  ['invokeDefaultMethodWithArguments:'](...args) {
    var result;
    var core = this.core;
    if (typeof core === 'function') {
      result = core.apply(undefined, ...args.map(s));
    }

    return wrapFunc(result);
  },
  
  ['invokeUndefinedMethodFromWebScript:withArguments:'](name, args) {
    // args为[object MOBoxedObject]对象，不可解构
    var result;
    var core = this.core;
    
    if (name + '' in core && '_' !== name[0]) {
      args = Array.prototype.slice.call(args).map(unknown);

      if ('function' == typeof core[name]) {
        result = core[name].apply(core, [...args]);
      } else {
        if (args[0]) {
          core[name] = args[0];
        } else {
          result = core[name];
        }
      }
    }

    return wrapFunc(result);
  },
});

function wrapFunc(context) {
  switch (Object.prototype.toString.call(context)) {
    case '[object String]': {
      return NSString.stringWithString(context);
    }
    case '[object Object]':
    case '[object Function]': {
      var wrapper = Wrapper.new();
      
      wrapper.core = context;
      return wrapper;
    }
    case '[object Null]':
    case '[object Undefined]':
      return null;
    case '[object Array]':
      return NSArray.arrayWithArray(context.map(wrapFunc));
    default:
      return context;
  }
}

export default wrapFunc;
