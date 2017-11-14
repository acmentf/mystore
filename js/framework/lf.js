/**
 * lf app js framework
 * liyu - v2.0.0 (2017-04-11)
 */
/**
 * lf核心JS
 * @type _L4.$|Function
 */
var lf = (function(document, undefined) {
	var readyRE = /complete|loaded|interactive/;
	var idSelectorRE = /^#([\w-]+)$/;
	var classSelectorRE = /^\.([\w-]+)$/;
	var tagSelectorRE = /^[\w-]+$/;
	var translateRE = /translate(?:3d)?\((.+?)\)/;
	var translateMatrixRE = /matrix(3d)?\((.+?)\)/;

	var $ = function(selector, context) {
		context = context || document;
		if (!selector)
			return wrap();
		if (typeof selector === 'object')
			if ($.isArrayLike(selector)) {
				return wrap($.slice.call(selector), null);
			} else {
				return wrap([selector], null);
			}
		if (typeof selector === 'function')
			return $.ready(selector);
		if (typeof selector === 'string') {
			try {
				selector = selector.trim();
				if (idSelectorRE.test(selector)) {
					var found = document.getElementById(RegExp.$1);
					return wrap(found ? [found] : []);
				}
				return wrap($.qsa(selector, context), selector);
			} catch (e) {}
		}
		return wrap();
	};

	var wrap = function(dom, selector) {
		dom = dom || [];
		Object.setPrototypeOf(dom, $.fn);
		dom.selector = selector || '';
		return dom;
	};

	$.uuid = 0;

	$.data = {};
	/**
	 * extend(simple)
	 * @param {type} target
	 * @param {type} source
	 * @param {type} deep
	 * @returns {unresolved}
	 */
	$.extend = function() { //from jquery2
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if (typeof target === "boolean") {
			deep = target;

			target = arguments[i] || {};
			i++;
		}

		if (typeof target !== "object" && !$.isFunction(target)) {
			target = {};
		}

		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];

					if (target === copy) {
						continue;
					}

					if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && $.isArray(src) ? src : [];

						} else {
							clone = src && $.isPlainObject(src) ? src : {};
						}

						target[name] = $.extend(deep, clone, copy);

					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		return target;
	};
	/**
	 * lf noop(function)
	 */
	$.noop = function() {};
	/**
	 * lf slice(array)
	 */
	$.slice = [].slice;
	/**
	 * lf filter(array)
	 */
	$.filter = [].filter;

	$.type = function(obj) {
		return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
	};
	/**
	 * lf isArray
	 */
	$.isArray = Array.isArray ||
		function(object) {
			return object instanceof Array;
		};
	/**
	 * lf isArrayLike
	 * @param {Object} obj
	 */
	$.isArrayLike = function(obj) {
		var length = !!obj && "length" in obj && obj.length;
		var type = $.type(obj);
		if (type === "function" || $.isWindow(obj)) {
			return false;
		}
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj;
	};
	/**
	 * lf isWindow(需考虑obj为undefined的情况)
	 */
	$.isWindow = function(obj) {
		return obj != null && obj === obj.window;
	};
	/**
	 * lf isObject
	 */
	$.isObject = function(obj) {
		return $.type(obj) === "object";
	};
	/**
	 * lf isPlainObject
	 */
	$.isPlainObject = function(obj) {
		return $.isObject(obj) && !$.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
	};
	/**
	 * lf isEmptyObject
	 * @param {Object} o
	 */
	$.isEmptyObject = function(o) {
		for (var p in o) {
			if (p !== undefined) {
				return false;
			}
		}
		return true;
	};
	/**
	 * lf isFunction
	 */
	$.isFunction = function(value) {
		return $.type(value) === "function";
	};
	/**
	 * lf querySelectorAll
	 * @param {type} selector
	 * @param {type} context
	 * @returns {Array}
	 */
	$.qsa = function(selector, context) {
		context = context || document;
		return $.slice.call(classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
	};
	/**
	 * ready(DOMContentLoaded)
	 * @param {type} callback
	 * @returns {_L6.$}
	 */
	$.ready = function(callback) {
		if($.os.plus){
			mui.plusReady(function(){
				callback($);
			})
		}else{
			mui.ready(function(){
				callback($);
			})
		}
		return this;
	};
	/**
	 * 将 fn 缓存一段时间后, 再被调用执行
	 * 此方法为了避免在 ms 段时间内, 执行 fn 多次. 常用于 resize , scroll , mousemove 等连续性事件中;
	 * 当 ms 设置为 -1, 表示立即执行 fn, 即和直接调用 fn 一样;
	 * 调用返回函数的 stop 停止最后一次的 buffer 效果
	 * @param {Object} fn
	 * @param {Object} ms
	 * @param {Object} context
	 */
	$.buffer = function(fn, ms, context) {
		var timer;
		var lastStart = 0;
		var lastEnd = 0;
		var ms = ms || 150;

		function run() {
			if (timer) {
				timer.cancel();
				timer = 0;
			}
			lastStart = $.now();
			fn.apply(context || this, arguments);
			lastEnd = $.now();
		}

		return $.extend(function() {
			if (
				(!lastStart) || // 从未运行过
				(lastEnd >= lastStart && $.now() - lastEnd > ms) || // 上次运行成功后已经超过ms毫秒
				(lastEnd < lastStart && $.now() - lastStart > ms * 8) // 上次运行或未完成，后8*ms毫秒
			) {
				run();
			} else {
				if (timer) {
					timer.cancel();
				}
				timer = $.later(run, ms, null, arguments);
			}
		}, {
			stop: function() {
				if (timer) {
					timer.cancel();
					timer = 0;
				}
			}
		});
	};
	/**
	 * each
	 * @param {type} elements
	 * @param {type} callback
	 * @returns {_L8.$}
	 */
	$.each = function(elements, callback, hasOwnProperty) {
		if (!elements) {
			return this;
		}
		if (typeof elements.length === 'number') {
			[].every.call(elements, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
		} else {
			for (var key in elements) {
				if (hasOwnProperty) {
					if (elements.hasOwnProperty(key)) {
						if (callback.call(elements[key], key, elements[key]) === false) return elements;
					}
				} else {
					if (callback.call(elements[key], key, elements[key]) === false) return elements;
				}
			}
		}
		return this;
	};
	$.focus = function(element) {
		if ($.os.ios) {
			setTimeout(function() {
				element.focus();
			}, 10);
		} else {
			element.focus();
		}
	};
	/**
	 * trigger event
	 * @param {type} element
	 * @param {type} eventType
	 * @param {type} eventData
	 * @returns {_L8.$}
	 */
	$.trigger = function(element, eventType, eventData) {
		element.dispatchEvent(new CustomEvent(eventType, {
			detail: eventData,
			bubbles: true,
			cancelable: true
		}));
		return this;
	};
	/**
	 * getStyles
	 * @param {type} element
	 * @param {type} property
	 * @returns {styles}
	 */
	$.getStyles = function(element, property) {
		var styles = element.ownerDocument.defaultView.getComputedStyle(element, null);
		if (property) {
			return styles.getPropertyValue(property) || styles[property];
		}
		return styles;
	};
	/**
	 * parseTranslate
	 * @param {type} translateString
	 * @param {type} position
	 * @returns {Object}
	 */
	$.parseTranslate = function(translateString, position) {
		var result = translateString.match(translateRE || '');
		if (!result || !result[1]) {
			result = ['', '0,0,0'];
		}
		result = result[1].split(",");
		result = {
			x: parseFloat(result[0]),
			y: parseFloat(result[1]),
			z: parseFloat(result[2])
		};
		if (position && result.hasOwnProperty(position)) {
			return result[position];
		}
		return result;
	};
	/**
	 * parseTranslateMatrix
	 * @param {type} translateString
	 * @param {type} position
	 * @returns {Object}
	 */
	$.parseTranslateMatrix = function(translateString, position) {
		var matrix = translateString.match(translateMatrixRE);
		var is3D = matrix && matrix[1];
		if (matrix) {
			matrix = matrix[2].split(",");
			if (is3D === "3d")
				matrix = matrix.slice(12, 15);
			else {
				matrix.push(0);
				matrix = matrix.slice(4, 7);
			}
		} else {
			matrix = [0, 0, 0];
		}
		var result = {
			x: parseFloat(matrix[0]),
			y: parseFloat(matrix[1]),
			z: parseFloat(matrix[2])
		};
		if (position && result.hasOwnProperty(position)) {
			return result[position];
		}
		return result;
	};
	$.hooks = {};
	$.addAction = function(type, hook) {
		var hooks = $.hooks[type];
		if (!hooks) {
			hooks = [];
		}
		hook.index = hook.index || 1000;
		hooks.push(hook);
		hooks.sort(function(a, b) {
			return a.index - b.index;
		});
		$.hooks[type] = hooks;
		return $.hooks[type];
	};
	$.doAction = function(type, callback) {
		if ($.isFunction(callback)) { //指定了callback
			$.each($.hooks[type], callback);
		} else { //未指定callback，直接执行
			$.each($.hooks[type], function(index, hook) {
				return !hook.handle();
			});
		}
	};
	/**
	 * setTimeout封装
	 * @param {Object} fn
	 * @param {Object} when
	 * @param {Object} context
	 * @param {Object} data
	 */
	$.later = function(fn, when, context, data) {
		when = when || 0;
		var m = fn;
		var d = data;
		var f;
		var r;

		if (typeof fn === 'string') {
			m = context[fn];
		}

		f = function() {
			m.apply(context, $.isArray(d) ? d : [d]);
		};

		r = setTimeout(f, when);

		return {
			id: r,
			cancel: function() {
				clearTimeout(r);
			}
		};
	};
	$.now = Date.now || function() {
		return +new Date();
	};
	var class2type = {};
	$.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function(i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});
	if (window.JSON) {
		$.parseJSON = JSON.parse;
	}
	/**
	 * $.fn
	 */
	$.fn = {
		each: function(callback) {
			[].every.call(this, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
			return this;
		}
	};

	/**
	 * 兼容 AMD 模块
	 **/
	if (typeof define === 'function' && define.amd) {
		define('lf', [], function() {
			return $;
		});
	}

	return $;
})(document);
(function($, window) {
	var level = {
		"OFF":0,
		"ERROR":2,
		"WARN":3,
		"INFO":4,
		"DEBUG":5,
		"ALL":9,
	};
	var logLevel = "ALL";
	if(window.debug){
		logLevel = window.debug;
	}
	logLevel = level[logLevel];
	$.log = {
		/**
		 * 信息分组开始
		 * @param {String} d
		 */
		group: function(d) {
			logLevel&&console.group(d)
		},
		/**
		 * 信息分组结束
		 */
		groupEnd: function() {
			logLevel&&console.groupEnd();
		},
		/**
		 * 查询对象
		 * @param {String} d
		 */
		dir: function(d) {
			logLevel&&console.dir(d);
		},
		/**
		 * 追踪函数的调用轨迹
		 */
		trace: function() {
			logLevel&&console.trace()
		},
		/**
		 * @description 打印log日志
		 * @param {String} d 打印内容
		 * @param 可变参数 用于格式刷打印日志，比如：LF.log.log("%d年%d月%d日",2011,3,26); 结果是：2011年3月26日
		 * 支持的占位符有：字符（%s）、整数（%d或%i）、浮点数（%f）和对象（%o）
		 */
		log: function() {
			logLevel&&console.log.apply(console, arguments);
		},
		/**
		 * @description 打印debug日志
		 * @param {String} d 打印内容
		 */
		debug: function() {
			logLevel&&(logLevel>=5)&&console.debug.apply(console, arguments);
		},
		/**
		 * @description 打印info日志
		 * @param {String} d 打印内容
		 */
		info: function() {
			logLevel&&(logLevel>=4)&&console.info.apply(console, arguments);
		},
		/**
		 * @description 打印warn日志
		 * @param {String} d 打印内容
		 */
		warn: function() {
			logLevel&&(logLevel>=3)&&console.warn.apply(console, arguments);
		},
		/**
		 * @description 打印error日志
		 * @param {String} d 打印内容
		 */
		error: function() {
			logLevel&&(logLevel>=2)&&console.error.apply(console, arguments);
		}
	};
})(lf, window);
/**
 * $.os 判断平台环境 from mui
 * @param {type} $
 * @returns {undefined}
 */
(function($, window) {
	function detect(ua) {
		this.os = {};
		var funcs = [
			function(){//phone or pad
				 if( ua.match(/Android/i)  
	                || ua.match(/webOS/i)  
	                || ua.match(/iPhone/i)  
	                || ua.match(/iPad/i)  
	                || ua.match(/iPod/i)  
	                || ua.match(/BlackBerry/i)  
	                || ua.match(/Windows Phone/i)  
	                ){
	                	this.os.mobile = true;
	                }else{
	                	this.os.pc = true;
	                	var ret = "";
	                	var uasplit = null;
	                	if(/Firefox/g.test(ua)){ 
							uasplit=ua.split(" "); 
							ret="Firefox|"+uasplit[uasplit.length-1].split("/")[1]; 
						}else if(/MSIE/g.test(ua)){ 
							uasplit=ua.split(";"); 
							ret="IE|"+uasplit[1].split(" ")[2]; 
						}else if(/Opera/g.test(ua)){ 
							uasplit=ua.split(" "); 
							ret="Opera|"+uasplit[uasplit.length-1].split("/")[1]; 
						}else if(/Chrome/g.test(ua)){ 
							uasplit=ua.split(" "); 
							ret="Chrome|"+uasplit[uasplit.length-2].split("/")[1]; 
						}else if(/^apple\s+/i.test(navigator.vendor)){ 
							uasplit=ua.split(" "); 
							ret="Safair|"+uasplit[uasplit.length-2].split("/")[1]; 
						}else if (!!window.ActiveXObject || "ActiveXObject" in window) {
							if (/rv:11.0/g.test(ua)){
								ret = "IE|11";
							}else if (/rv:10.0/g.test(ua)){
								ret = "IE|10";
							}else if (/rv:9.0/g.test(ua)){
								ret = "IE|9";
							}else {
								ret = "IE|0";
							}
						}else{
							ret="unkown|0"; 
						} 
						ret = ret.split("|");
						this.os.browser = ret[0];
	                	this.os.version = ret[1];
	                }
			},
			function() { //wechat
				var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
				if(wechat) { //wechat
					this.os.wechat = {
						version: wechat[2].replace(/_/g, '.')
					};
				}
				return false;
			},
			function() { //android
				var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
				if(android) {
					this.os.android = true;
					this.os.version = android[2];

					this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
				}
				return this.os.android === true;
			},
			function() { //ios
				var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
				if(iphone) { //iphone
					this.os.ios = this.os.iphone = true;
					this.os.version = iphone[2].replace(/_/g, '.');
				} else {
					var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
					if(ipad) { //ipad
						this.os.ios = this.os.ipad = true;
						this.os.version = ipad[2].replace(/_/g, '.');
					}
				}
				return this.os.ios === true;
			}
		];
		[].every.call(funcs, function(func) {
			return !func.call($);
		});
	};
	detect.call($, navigator.userAgent);
})(lf, window);
/**
 * $.os.plus 判断H5+环境 from mui
 * @param {type} $
 * @returns {undefined}
 */
(function($, document) {
	function detect(ua) {
		this.os = this.os || {};
		var plus = ua.match(/Html5Plus/i); //TODO 5\+Browser?
		if(plus) {
			this.os.plus = true;
			if(ua.match(/StreamApp/i)) { //TODO 最好有流应用自己的标识
				this.os.stream = true;
			}
		}
	}
	detect.call($, navigator.userAgent);
})(lf, document);
/**
 * @description 缓存模块
 * storage：兼容H5+和H5环境
 * sessionstorage
 * cookie
 */
(function($, window) {
	var _storage = null;
	_storage = localStorage;
	$.storage = {
		/**
		 * @description 存储key-value
		 * @param {String} key 存储的键值
		 * @param {String} value 存储的内容
		 */
		put: function(key, value) {
			_storage.removeItem(key);
			_storage.setItem(key, value);
		},
		/**
		 * @description 通过key值检索键值
		 * @param {String} key 存储的键值
		 * @return {String}
		 */
		get: function(key) {
			return _storage.getItem(key);
		},
		/**
		 * @description 通过key值删除键值对
		 * @param {String} key 存储的键值
		 */
		removeItem: function(key) {
			_storage.removeItem(key);
		},
		/**
		 * @description 获取storage中保存的键值对的数量
		 * @return {Number}
		 */
		getItemCount: function() {
			return _storage.getLength();
		},
		/**
		 * @description 获取键值对中指定索引值的key值
		 * @return {String}
		 */
		key: function(index) {
			return _storage.key(index);
		},
		/**
		 * @description 清除应用所有的键值对,不建议使用
		 */
		clearAll: function() {
			_storage.clear();
		}
	};
})(lf, window);

(function($, window) {
	var _storage = sessionStorage;
	$.sessionStorage = {
		/**
		 * @description 存储key-value
		 * @param {String} key 存储的键值
		 * @param {String} value 存储的内容
		 */
		put: function(key, value) {
			_storage.removeItem(key);
			_storage.setItem(key, value);
		},
		/**
		 * @description 通过key值检索键值
		 * @param {String} key 存储的键值
		 * @return {String}
		 */
		get: function(key) {
			return _storage.getItem(key);
		},
		/**
		 * @description 通过key值删除键值对
		 * @param {String} key 存储的键值
		 */
		removeItem: function(key) {
			_storage.removeItem(key);
		},
		/**
		 * @description 获取storage中保存的键值对的数量
		 * @return {Number}
		 */
		getItemCount: function() {
			return _storage.getLength();
		},
		/**
		 * @description 获取键值对中指定索引值的key值
		 * @return {String}
		 */
		key: function(index) {
			return _storage.key(index);
		},
		/**
		 * @description 清除应用所有的键值对,不建议使用
		 */
		clearAll: function() {
			_storage.clear();
		}
	};
})(lf, window);

(function($, window) {
	$.cookie = {
		set: function(c_name, value, expiredays) {
			var exdate = new Date()
			if(!expiredays) {
				document.cookie = c_name + "=" + escape(value);
			} else {
				exdate.setDate(exdate.getDate() + expiredays * 1);
				document.cookie = c_name + "=" + escape(value) +
					";expires=" + exdate.toGMTString()
			}
		},
		get: function(c_name) {
			if(document.cookie.length > 0) {
				var c_start = document.cookie.indexOf(c_name + "=");
				if(c_start != -1) {
					c_start = c_start + c_name.length + 1
					var c_end = document.cookie.indexOf(";", c_start)
					if(c_end == -1) c_end = document.cookie.length
					return unescape(document.cookie.substring(c_start, c_end))
				}
			}
			return "";
		},
		del: function(c_name) {
			var exp = new Date();
			exp.setDate(exp.getDate() - 1);
			var cval = this.get(c_name);
			if(cval != null) {
				document.cookie = c_name + "=" + escape(cval) + ";expires=" + exp.toGMTString();
			}
		},
		clear: function() {
			var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
			if(keys) {
				for(var i = keys.length; i--;) {
					this.del(keys[i]);
				}
			}
		}
	};
})(lf, window);
/*
 * app 平台信息
 * 初始化平台信息，保存平台到：KEY_SYSTEM_TYPE
 */
(function($, window, undefined) {
	var platformName = "";
	var app = $.app = {
		init:function(){
			if($.os.plus) {
				platformName = plus.os.name;
				$.log.info("webview  id = [" + plus.webview.currentWebview().id + "]");
				$.log.info("webview url = [" + plus.webview.currentWebview().getURL() + "]");
			} else {
				$.log.info("windows url = [" + window.location.href + "]");
			}
			$.storage.put("KEY_SYSTEM_TYPE", platformName);
		},
		getPlatform:function(){
			return $.storage.get("KEY_SYSTEM_TYPE");
		}
	};
	
	$.ready(function() {
		app.init();
	})
})(lf, window);
/*
 * util工具类
 */
(function($, window) {
	var randomNum = function(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}
	var randomColor = function(min, max) {
		var r = randomNum(min, max);
		var g = randomNum(min, max);
		var b = randomNum(min, max);
		return "rgb(" + r + "," + g + "," + b + ")";
	}
	$.util = {
		detectmob: function() {
			if(navigator.userAgent.match(/Android/i) ||
				navigator.userAgent.match(/webOS/i) ||
				navigator.userAgent.match(/iPhone/i) ||
				navigator.userAgent.match(/iPad/i) ||
				navigator.userAgent.match(/iPod/i) ||
				navigator.userAgent.match(/BlackBerry/i) ||
				navigator.userAgent.match(/Windows Phone/i)
			) {
				return true;
			} else {
				return false;
			}
		},
		replaceTemplate: function(i, j) {
			var k = i;
			for(var l in j) {
				var m = eval("/\\$\\{" + l.replace(/\//g, "\\/") + "\\}/ig");
				k = k.replace(m, j[l]);
			};
			return k;
		},
		strToJson: function(jsonStr) {
			return JSON.parse(jsonStr);
		},
		timeStampToDate: function(timestamp) { //时间戳转换成正常日期格式
			function add0(m) {
				return m < 10 ? '0' + m : m
			}
			//timestamp是整数，否则要parseInt转换,不会出现少个0的情况
			var time = new Date(timestamp);
			var year = time.getFullYear();
			var month = time.getMonth() + 1;
			var date = time.getDate();
			var hours = time.getHours();
			var minutes = time.getMinutes();
			var seconds = time.getSeconds();
			return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
		},
		timeStampToDate2: function(timestamp) { //时间戳转换成年月日
			function add0(m) {
				return m < 10 ? '0' + m : m
			}
			//timestamp是整数，否则要parseInt转换,不会出现少个0的情况
			var time = new Date(timestamp);
			var year = time.getFullYear();
			var month = time.getMonth() + 1;
			var date = time.getDate();
//			var hours = time.getHours();
//			var minutes = time.getMinutes();
//			var seconds = time.getSeconds();
			return year + '-' + add0(month) + '-' + add0(date);
		},
		jsonToStr: function(jsonObj) {
			return JSON.stringify(jsonObj);
		},
		isUndefined: function(value) {
			if(typeof(value) == "undefined" || value == null) {
				return true;
			} else {
				return false;
			}
		},
		isEmpty: function(value) {
			if(value) {
				return false;
			} else {
				return true;
			}
		},
		isString: function(value) {
			return Object.prototype.toString.call(value) == "[object String]";
		},
		isFormData: function(e) {
			return "undefined" != typeof FormData && e instanceof FormData
		},
		getNowDay: function() {
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() * 1 + 1;
			var day = date.getDate();
			return year + "-" + month + "-" +
				day;
		},
		getSFM: function(time) {
			var date = new Date();
			date.setTime(time);
			var h = date.getHours();
			if(h < 10) {
				h = "0" + h;
			}
			var m = date.getMinutes();
			if(m < 10) {
				m = "0" + m;
			}
			var s = date.getSeconds();
			if(s < 10) {
				s = "0" + s;
			}
			return h + ":" + m + ":" +
				s;
		},
		getZDTime: function(time) {
			var date = new Date();
			date.setHours(time.split(":")[0]);
			date.setMinutes(time.split(":")[1]);
			date.setSeconds(time.split(":")[2]);
			return date;
		},
		checkRate: function(value) {
			var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
			if(!re.test(value)) {
				return false;
			} else {
				return true;
			}
		},
		decToHex: function(str) {
			str = str.replace(/\n/g, " ");
			var res = [];
			for(var i = 0; i < str.length; i++)
				res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
			return "\\u" + res.join("\\u");
		},
		createUUID: function(g) {
			var s = [];
			var hexDigits = "0123456789abcdef";
			for(var i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
			s[8] = s[13] = s[18] = s[23] = "-";

			var uuid = s.join("");
			return uuid.replace(/-/g, "");;
		},
		getStringLen: function(Str) {
			var i, len, code;
			if(Str == null || Str == "") return 0;
			len = Str.length;
			for(i = 0; i < Str.length; i++) {
				code = Str.charCodeAt(i);
				if(code > 255) {
					len++;
				}
			}
			return len;
		},
		addNum: function(num1, num2) {
			var sq1, sq2, m;
			try {
				sq1 = num1.toString().split(".")[1].length;
			} catch(e) {
				sq1 = 0;
			}
			try {
				sq2 = num2.toString().split(".")[1].length;
			} catch(e) {
				sq2 = 0;
			}
			m = Math.pow(10, Math.max(sq1, sq2));
			return(this.multNum(num1, m) + this.multNum(num2, m)) / m;
		},
		multNum: function(arg1, arg2) {
			var m = 0,
				s1 = arg1.toString(),
				s2 = arg2.toString();
			try {
				m += s1.split(".")[1].length
			} catch(e) {}
			try {
				m += s2.split(".")[1].length
			} catch(e) {}
			return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
		},
		getCodeImg: function(width, height, type) {
			width = width || 120;
			height = height || 40;
			type = type || 1;
			var canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext('2d');
			ctx.textBaseline = 'bottom';

			/**绘制背景色**/
			ctx.fillStyle = randomColor(180, 240); //颜色若太深可能导致看不清
			ctx.fillRect(0, 0, width, height);
			/**绘制文字**/
			var str = "";
			if(type == 1) {
				str = '1234567890';
			} else if(type == 2) {
				str = 'ABCEFGHJKLMNPQRSTWXY123456789';
			} else {
				str = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ1234567890';
			}
			var code = "";
			for(var i = 0; i < 4; i++) {
				var txt = str[randomNum(0, str.length)];
				code = code + txt;
				ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
				ctx.font = randomNum(15, 40) + 'px SimHei'; //随机生成字体大小
				var x = 10 + i * 25;
				var y = randomNum(25, 45);
				var deg = randomNum(-45, 45);
				//修改坐标原点和旋转角度
				ctx.translate(x, y);
				ctx.rotate(deg * Math.PI / 180);
				ctx.fillText(txt, 0, 0);
				//恢复坐标原点和旋转角度
				ctx.rotate(-deg * Math.PI / 180);
				ctx.translate(-x, -y);
			}
			/**绘制干扰线**/
			for(var i = 0; i < 8; i++) {
				ctx.strokeStyle = randomColor(40, 180);
				ctx.beginPath();
				ctx.moveTo(randomNum(0, width), randomNum(0, height));
				ctx.lineTo(randomNum(0, width), randomNum(0, height));
				ctx.stroke();
			}
			/**绘制干扰点**/
			for(var i = 0; i < 100; i++) {
				ctx.fillStyle = randomColor(0, 255);
				ctx.beginPath();
				ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
				ctx.fill();
			}
			var data = canvas.toDataURL("image/jpeg");
			return {
				code: code,
				codeUrl: data
			};
		}
	};
})(lf, window);
/**
 * lf ajax
 * @param {type} $
 * @returns {undefined}
 */
(function($, window, undefined) {
	var jsonType = 'application/json';
	var htmlType = 'text/html';
	var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	var scriptTypeRE = /^(?:text|application)\/javascript/i;
	var xmlTypeRE = /^(?:text|application)\/xml/i;
	var blankRE = /^\s*$/;

	$.ajaxSettings = {
		type: 'GET',
		beforeSend: $.noop,
		success: $.noop,
		error: $.noop,
		complete: $.noop,
		context: null,
		xhr: function(protocol) {
			return new window.XMLHttpRequest();
		},
		accepts: {
			script: 'text/javascript, application/javascript, application/x-javascript',
			json: jsonType,
			xml: 'application/xml, text/xml',
			html: htmlType,
			text: 'text/plain'
		},
		timeout: 0,
		processData: true,
		cache: true
	};
	var ajaxBeforeSend = function(xhr, settings) {
		var context = settings.context
		if(settings.beforeSend.call(context, xhr, settings) === false) {
			return false;
		}
	};
	var ajaxSuccess = function(data, xhr, settings) {
		settings.success.call(settings.context, data, 'success', xhr);
		ajaxComplete('success', xhr, settings);
	};
	// type: "timeout", "error", "abort", "parsererror"
	var ajaxError = function(error, type, xhr, settings) {
		settings.error.call(settings.context, xhr, type, error);
		ajaxComplete(type, xhr, settings);
	};
	// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
	var ajaxComplete = function(status, xhr, settings) {
		settings.complete.call(settings.context, xhr, status);
	};

	var serialize = function(params, obj, traditional, scope) {
		var type, array = $.isArray(obj),
			hash = $.isPlainObject(obj);
		$.each(obj, function(key, value) {
			type = $.type(value);
			if(scope) {
				key = traditional ? scope :
					scope + '[' + (hash || array || type === 'object' || type === 'array' ? key : '') + ']';
			}
			// handle data in serializeArray() format
			if(!scope && array) {
				params.add(value.name, value.value);
			}
			// recurse into nested objects
			else if(type === "array" || (!traditional && type === "object")) {
				serialize(params, value, traditional, key);
			} else {
				params.add(key, value);
			}
		});
	};
	var reverseSerialize = function(obj,scope,value){
		if(!scope){
			return;
		}
		var i = scope.indexOf("[");
		var l = scope.indexOf("]");
		var ii = scope.lastIndexOf("[")
		var key = scope.substring(0,i);
		var newscope = scope.substring(i+1,l);
		if(/^\+?[0-9][0-9]*$/.test(newscope)){//如果为数字,表示数组
			var list = obj[key];
			if(!list){
				list = [];
			}
			obj[key] = list;
			if(ii != i){//还存在下一级
				var last = scope.substring(ii,scope.length);
				reverseSerialize(obj[key],newscope+last,value)
			}else{
				list[newscope] = value;
			}
		}else{
			var childObj = obj[key];
			if(!childObj){
				childObj = {};
			}
			obj[key] = childObj;
			if(ii != i){//还存在下一级
				var last = scope.substring(ii,scope.length);
				reverseSerialize(obj[key],newscope+last,value)
			}else{
				childObj[newscope] = value;
			}
		}
	};
	var serializeData = function(options) {
		if(options.processData && options.data && typeof options.data !== "string") {
			var contentType = options.contentType;
			if(!contentType && options.headers) {
				contentType = options.headers['Content-Type'];
			}
			if(contentType && ~contentType.indexOf(jsonType)) { //application/json
				options.data = JSON.stringify(options.data);
			} else {
				options.data = $.param(options.data, options.traditional);
			}
		}
		if(options.data && (!options.type || options.type.toUpperCase() === 'GET')) {
			options.url = appendQuery(options.url, options.data);
			options.data = undefined;
		}
	};
	var appendQuery = function(url, query) {
		if(query === '') {
			return url;
		}
		return(url + '&' + query).replace(/[&?]{1,2}/, '?');
	};
	var mimeToDataType = function(mime) {
		if(mime) {
			mime = mime.split(';', 2)[0];
		}
		return mime && (mime === htmlType ? 'html' :
			mime === jsonType ? 'json' :
			scriptTypeRE.test(mime) ? 'script' :
			xmlTypeRE.test(mime) && 'xml') || 'text';
	};
	var parseArguments = function(url, data, success, dataType) {
		if($.isFunction(data)) {
			dataType = success, success = data, data = undefined;
		}
		if(!$.isFunction(success)) {
			dataType = success, success = undefined;
		}
		return {
			url: url,
			data: data,
			success: success,
			dataType: dataType
		};
	};
	$.ajax = function(url, options) {
		if(typeof url === "object") {
			options = url;
			url = undefined;
		}
		var settings = options || {};
		settings.url = url || settings.url;
		for(var key in $.ajaxSettings) {
			if(settings[key] === undefined) {
				settings[key] = $.ajaxSettings[key];
			}
		}
		serializeData(settings);
		var dataType = settings.dataType;

		if(settings.cache === false || ((!options || options.cache !== true) && ('script' === dataType))) {
			settings.url = appendQuery(settings.url, '_=' + $.now());
		}
		var mime = settings.accepts[dataType && dataType.toLowerCase()];
		var headers = {};
		var setHeader = function(name, value) {
			headers[name.toLowerCase()] = [name, value];
		};
		var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
		var xhr = settings.xhr(settings);
		var nativeSetHeader = xhr.setRequestHeader;
		var abortTimeout;

		setHeader('X-Requested-With', 'XMLHttpRequest');
		setHeader('Accept', mime || '*/*');
		if(!!(mime = settings.mimeType || mime)) {
			if(mime.indexOf(',') > -1) {
				mime = mime.split(',', 2)[0];
			}
			xhr.overrideMimeType && xhr.overrideMimeType(mime);
		}
		if(settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() !== 'GET')) {
			setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
		}
		if(settings.headers) {
			for(var name in settings.headers)
				setHeader(name, settings.headers[name]);
		}
		xhr.setRequestHeader = setHeader;

		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4) {
				xhr.onreadystatechange = $.noop;
				clearTimeout(abortTimeout);
				var result, error = false;
				var isLocal = protocol === 'file:';
				if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || (xhr.status === 0 && isLocal && xhr.responseText)) {
					dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));
					result = xhr.responseText;
					try {
						// http://perfectionkills.com/global-eval-what-are-the-options/
						if(dataType === 'script') {
							(1, eval)(result);
						} else if(dataType === 'xml') {
							result = xhr.responseXML;
						} else if(dataType === 'json') {
							result = blankRE.test(result) ? null : $.parseJSON(result);
						}
					} catch(e) {
						error = e;
					}

					if(error) {
						ajaxError(error, 'parsererror', xhr, settings);
					} else {
						ajaxSuccess(result, xhr, settings);
					}
				} else {
					var status = xhr.status ? 'error' : 'abort';
					var statusText = xhr.statusText || null;
					if(isLocal) {
						status = 'error';
						statusText = '404';
					}
					ajaxError(statusText, status, xhr, settings);
				}
			}
		};
		if(ajaxBeforeSend(xhr, settings) === false) {
			xhr.abort();
			ajaxError(null, 'abort', xhr, settings);
			return xhr;
		}

		if(settings.xhrFields) {
			for(var name in settings.xhrFields) {
				xhr[name] = settings.xhrFields[name];
			}
		}

		var async = 'async' in settings ? settings.async : true;

		xhr.open(settings.type.toUpperCase(), settings.url, async, settings.username, settings.password);

		for(var name in headers) {
			if(headers.hasOwnProperty(name)) {
				nativeSetHeader.apply(xhr, headers[name]);
			}
		}
		if(settings.timeout > 0) {
			abortTimeout = setTimeout(function() {
				xhr.onreadystatechange = $.noop;
				xhr.abort();
				ajaxError(null, 'timeout', xhr, settings);
			}, settings.timeout);
		}
		xhr.send(settings.data ? settings.data : null);
		return xhr;
	};

	$.param = function(obj, traditional) {
		var params = [];
		params.add = function(k, v) {
			this.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
		};
		serialize(params, obj, traditional);
		return params.join('&').replace(/%20/g, '+');
	};
	$.parsingParam = function(paramsStr){
		if(!paramsStr){
			return null;
		}
		paramsStr = decodeURIComponent(paramsStr);
		var paramsList = paramsStr.split("&");
		var r = {};
		var temp,key,value;
		paramsList.forEach(function(v,i){
			temp = v.split("=");
			key = temp[0];
			value = temp[1];
			if(key.indexOf("[") == -1){
				r[key] = value;
			}else{
				reverseSerialize(r,key,value);
			}
		});
		return r;
	};
	$.get = function( /* url, data, success, dataType */ ) {
		return $.ajax(parseArguments.apply(null, arguments));
	};

	$.post = function( /* url, data, success, dataType */ ) {
		var options = parseArguments.apply(null, arguments);
		options.type = 'POST';
		return $.ajax(options);
	};

	$.getJSON = function( /* url, data, success */ ) {
		var options = parseArguments.apply(null, arguments);
		options.dataType = 'json';
		return $.ajax(options);
	};

	$.fn.load = function(url, data, success) {
		if(!this.length)
			return this;
		var self = this,
			parts = url.split(/\s/),
			selector,
			options = parseArguments(url, data, success),
			callback = options.success;
		if(parts.length > 1)
			options.url = parts[0], selector = parts[1];
		options.success = function(response) {
			if(selector) {
				var div = document.createElement('div');
				div.innerHTML = response.replace(rscript, "");
				var selectorDiv = document.createElement('div');
				var childs = div.querySelectorAll(selector);
				if(childs && childs.length > 0) {
					for(var i = 0, len = childs.length; i < len; i++) {
						selectorDiv.appendChild(childs[i]);
					}
				}
				self[0].innerHTML = selectorDiv.innerHTML;
			} else {
				self[0].innerHTML = response;
			}
			callback && callback.apply(self, arguments);
		};
		$.ajax(options);
		return this;
	};
})(lf, window);
/*
 * 基于lf.ajax.js扩展自己业务逻辑封装
 */
(function($, window, undefined) {
	$.net = {
		ajax: function(url, options) {
			if(!options.dataType) {
				options.dataType = "json";
			}
			if(!options.type) {
				options.type = "post";
			}
			if(!options.data) {
				options.data = {};
			}
			if(!options.timeout) {
				options.timeout = 30000;
			}
			if(!options.crossDomain) {
				options.crossDomain = true;
			}
			if(!options.headers) {
				//  			options.headers = {'Content-Type':'application/x-www-form-urlencoded'};
				options.headers = {
					'Content-Type': 'application/json;charset=UTF-8'
				};
			}
			var action = url;
			if(url.indexOf("http") == -1&&window.SERVER_BAS_URL) {
				if(url.indexOf("/") != 0){
					url = window.SERVER_BAS_URL+ "/" + url;
				}else{
					url = window.SERVER_BAS_URL+ url;
				}
			}
			$.log.debug("send[" + action + "][" + options.data.tokenId + "]:" + $.util.jsonToStr(options.data));
			var success = options.success;
			var error = options.error;
			var _success = function(data, textStatus, xhr) {
				$.log.debug("received[" + action + "]：" + JSON.stringify(data));
				if(data.code == '401') {
					window.Role.logout();
					plus.runtime.restart();
				} else {
					if(!(success === undefined)) {
						success(data);
					}
				}
			};
			var _error = function(xhr, type, errorThrown) {
				$.log.error("received[" + action + "]：" + type + "，errorThrown：" + errorThrown);
				if(!(error === undefined)) {
					var o = '';
					if(type == 'abort') {
						o = '{"code":"-1", "msg":"请求不到服务器！"}';
					} else if(type == 'timeout') {
						o = '{"code":"-1", "msg":"请求超时！"}';
					} else {
						o = '{"code":"-1", "msg":"系统异常！"}';
					}
					$.log.error("received[" + action + "]：" + o);
					o = JSON.parse(o);
					error(o);
				}
			};
			options.data = $.util.jsonToStr(options.data);
			options.success = _success;
			options.error = _error;
			mui.ajax(url, options);
		},
		getJSON: function(url, data, success, error, async) {
			if(!async){
				async = true
			}
			var type = "post";
			var timeout = 30000;
			var defaule = $.util.strToJson($.util.jsonToStr(REQUESTDATA));
			var tempData = {
				data: data
			}
			data = $.extend(true, defaule, tempData);
			this.doData(data);
			var options = {};
			options.data = data;
			options.success = success;
			options.error = error;
			options.type = type;
			options.timeout = timeout;
			options.async = async;
			this.ajax(url, options);
		},
		doData: function(data) {
			data.timestamp = new Date().getTime();
			var token = window.Role.getSignature();
			if(token) {
				data.tokenId = token;
			}
			//第一步提取业务数据
			var paramstr = JSON.stringify(data.data);
//			$.log.info("业务数据待base64字符串：" + paramstr)
			var basep = lf.base64encode(paramstr);
//			$.log.log("业务数据base64：" + basep)
			var ts = basep + data.appKey + data.timestamp + data.tokenId;
//			$.log.log("代签名字符串:" + ts);
			var sign = lf.hex_md5(ts)
//			$.log.log("sign:" + sign);
			data.sign = sign;
		},
		/**
		 * @description 上传
		 * @param {String} url 上传服务器路径
		 * @param {Array} files 文件，可以是多个或者一个,数组中存放对象，对象模式为：{path:"",key:""}
		 * @param {Object} data 参数
		 * @param {Function} successBC 上传成功回调函数
		 */
		upload: function(url, data, success, error, uploadProgress, uploadComplete, uploadFailed, uploadCanceled) {
			if(!$.util.isFormData(data)) {
				var formData = new FormData();
				if($.isObject(data)) {
					formData.append(data.file_name, data.file);
					data = formData;
				} else if($.isArray(data)) {
					data.forEach(function(v) {
						formData.append(v.file_name, v.file);
					})
					data = formData;
				} else {
					$.log.error("无上传文件数据或格式错误");
					return;
				}
			}
			var action = url;
			if(url.indexOf("http") == -1 && SERVER_BAS_URL) {
				if(url.indexOf("/") != 0) {
					url = SERVER_BAS_URL + "/" + url;
				} else {
					url = SERVER_BAS_URL + url;
				}
			}
			var requestData = data;
			var request = new XMLHttpRequest();
			var xDomain = false;
			request.open("POST", url, true);

			//			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8")
			request.timeout = 0;
			$.log.info("send[" + action + "]文件上传");
			request.onreadystatechange = function handleLoad() {
				if(!request || (request.readyState !== 4 && !xDomain)) {
					return;
				}
				if(request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
					return;
				}
				var responseData = request.responseText;
				$.log.info("received[" + action + "]：" + responseData);
				var rs = JSON.parse(responseData);
				if(typeof success === 'function') {
					success(rs);
				}
				request = null;
			};
			request.onerror = function handleError() {
				$.log.error("received[" + action + "]：error");
				var rs = {
					code: '900',
					errorMessage: "系统异常"
				}
				if(typeof error === 'function') {
					error(rs);
				}
				request = null;
			};
			request.ontimeout = function handleTimeout() {
				$.log.error("received[" + action + "]：timeout");
				var rs = {
					code: '901',
					errorMessage: "系统请求超时"
				}
				if(typeof error === 'function') {
					error(rs);
				}
				request = null;
			};

			request.setRequestHeader("Accept", "application/json, text/plain, */*");
			if(typeof uploadProgress === 'function') {
				request.addEventListener('progress', uploadProgress);
			}
			request.send(requestData);
		},
	}
})(lf, window);

/**
 * @description 窗口模块
 */
(function($, window) {
	$.window = {
		/**
		 * @description 获取url路径都带的请求参数
		 * @return {Object}
		 */
		getParams: function() {
			var url = window.location.search;
			var theRequest = null;
			if(url.indexOf("?") != -1) {
				theRequest = new Object();
				var str = url.substr(1);
				var strs = str.split("&");
				for(var i = 0; i < strs.length; i++) {
					theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
				}
			}
			if(theRequest != null)
				return theRequest;
			else
				return null;
		},
		/**
		 * @description 初始化子页面
		 * @param {Object} options 
		 */
		init: function(options) {
			mui.init(options);
		},
		/**
		 * @description 创建Webview窗口
		 * @param {String} id 窗口标识可用于在其它页面中通过getWebviewById来查找指定的窗口，为了保持窗口标识的唯一性，应该避免使用相同的标识来创建多个Webview窗口。 如果传入无效的字符串则使用url参数作为WebviewObject窗口的id值。
		 * @param {String} url 新打开Webview窗口要加载的HTML页面地址，可支持本地地址和网络地址。
		 * @param {Object} styles 创建Webview窗口的样式（如窗口宽、高、位置等信息）
		 * @param {Object} extras 值为JSON类型，设置扩展参数后可以直接通过Webview的点（“.”）操作符获取扩展参数属性值，如： var w=plus.webview.create('url.html','id',{},{preload:"preload webview"}); // 可直接通过以下方法获取preload值 console.log(w.preload); // 输出值为“preload webview”
		 * @return {plus.webview.WebviewObject}
		 */
		create: function(id, url, styles, extras) {
			if(!$.os.plus) {
				return;
			}
			var settings = $.extend({}, STYLE.webviewStyle, styles);
			var wv = $.window.getWebviewById(id);
			if(!$.util.isUndefined(wv)) {
				wv.setStyle(settings);
				return wv;
			}
			return plus.webview.create(url, id, settings, extras);
		},
		/**
		 * @description 网站跳转
		 * @param {String} url 网站url
		 * @param {String} 打开方式
		 */
		open: function(url, type) {
			if(!url) {
				return;
			}
			type = type || "_blank";
			window.open(url, type);
		},
		/**
		 * @description 预加载webview并在webview页面创建完成之后显示
		 * @param {String} id 窗口标识可用于在其它页面中通过getWebviewById来查找指定的窗口，为了保持窗口标识的唯一性，应该避免使用相同的标识来创建多个Webview窗口。 如果传入无效的字符串则使用url参数作为WebviewObject窗口的id值。
		 * @param {String} url 新打开Webview窗口要加载的HTML页面地址，可支持本地地址和网络地址。
		 * @param {Object} styles 创建Webview窗口的样式（如窗口宽、高、位置等信息）
		 * @param {Object} extras 值为JSON类型，设置扩展参数后可以直接通过Webview的点（“.”）操作符获取扩展参数属性值，如： var w=plus.webview.create('url.html','id',{},{preload:"preload webview"}); // 可直接通过以下方法获取preload值 console.log(w.preload); // 输出值为“preload webview”
		 * @return {plus.webview.WebviewObject}
		 */
		openWindow: function(id, url, styles, extras, closeWV) {
			if(!$.os.plus) {
				//TODO 先临时这么处理：手机上顶层跳，PC上parent跳
				if($.os.ios || $.os.android) {
					window.top.location.href = url;
				} else {
					window.parent.location.href = url;
				}
				return;
			}
			
			var settings = $.extend({}, STYLE.webviewStyle, styles);
			var wv = $.window.getWebviewById(id);
			if(!$.util.isUndefined(wv)) {
				wv.setStyle(settings);
			} else {
				wv = plus.webview.create(url, id, settings, extras);
			}
			wv.addEventListener("loaded", function() {
				$.window.show(wv);
				if(closeWV) {
					setTimeout(function() {
						closeWV.close();
					}, 500);
				}
			});
			return wv;
		},
		_openWindow: function(id, url, styles, extras, closeWV) {
			if(!$.os.plus) {
				//TODO 先临时这么处理：手机上顶层跳，PC上parent跳
				if($.os.ios || $.os.android) {
					window.top.location.href = url;
				} else {
					window.parent.location.href = url;
				}
				return;
			}
			
			// var settings = $.extend({}, STYLE.webviewStyle, styles);
			var wv = $.window.getWebviewById(id);
			// if(!$.util.isUndefined(wv)) {
			// 	wv.setStyle(settings);
			// } else {
			// 	wv = plus.webview.create(url, id, settings, extras);
			// }
			wv = plus.webview.create(url, id, styles, extras);
			wv.addEventListener("loaded", function() {
				wv.show();
				if(closeWV) {
					setTimeout(function() {
						closeWV.close()
					}, 500);
				}
			});
			return wv;
		},
		setPageParams: function(key, params) {
			localStorage.removeItem(key)
			localStorage.setItem(key, JSON.stringify(params))
		},
		getPageParams: function(key) {
			return JSON.parse(localStorage.getItem(key))
		},
		/**
		 * @description 打开Webview窗口
		 * @param {String} id_wvobj 若操作Webview窗口对象显示，则无任何效果。 使用窗口id时，则查找对应id的窗口，如果有多个相同id的窗口则操作最先创建的窗口，若没有查找到对应id的WebviewObject对象，则无任何效果。
		 * @param {String} aniShow 如果没有指定窗口动画类型，则使用默认值“fade-in”，即自动选择上一次显示窗口的动画效果，如果之前没有显示过，则使用“none”动画效果。
		 * @param {Number} duration 单位为ms，如果没有设置则使用默认窗口动画时间600ms。
		 * @param {Function} showedCB 当指定Webview窗口动画时，在动画执行完毕，窗口完全显示时触发回调。
		 */
		_show: function(id_wvobj, aniShow, duration, showedCB) {
			if($.util.isUndefined(aniShow)) {
				aniShow = STYLE.animation.getOpenAnimation();
			}
			plus.webview.show(id_wvobj, aniShow, duration, showedCB);
		},
		/**
		 * @description 打开Webview窗口
		 * @param {plus.webview.WebviewObject} wv 若操作Webview窗口对象显示，则无任何效果。 使用窗口id时，则查找对应id的窗口，如果有多个相同id的窗口则操作最先创建的窗口，若没有查找到对应id的WebviewObject对象，则无任何效果。
		 */
		show: function(wv) {
			wv.show(STYLE.animation.getOpenAnimation());
		},
		/**
		 * @description 隐藏Webview窗口
		 * @param {String} id_wvobj 要隐藏的Webview窗口id或窗口对象,使用窗口对象时，若窗口对象已经隐藏，则无任何效果。 使用窗口id时，则查找对应id的窗口，如果有多个相同id的窗口则操作最先打开的，若没有查找到对应id的WebviewObject对象，则无任何效果。
		 * @param {String} aniHide 隐藏Webview窗口的动画效果,如果没有指定窗口动画，则使用默认动画效果“none”。
		 * @param {Number} duration 隐藏Webview窗口动画的持续时间
		 */
		hide: function(id_wvobj, aniHide, duration) {
			if($.util.isUndefined(aniHide)) {
				aniHide = STYLE.animation.getCloseAnimation();
			}
			plus.webview.hide(id_wvobj, aniHide, duration);
		},
		/**
		 * @description 关闭Webview窗口
		 * @param {String} id 窗口标识可用于在其它页面中通过getWebviewById来查找指定的窗口，为了保持窗口标识的唯一性，应该避免使用相同的标识来创建多个Webview窗口。 如果传入无效的字符串则使用url参数作为WebviewObject窗口的id值。
		 * @param {String} url 新打开Webview窗口要加载的HTML页面地址，可支持本地地址和网络地址。
		 * @param {Object} styles 创建Webview窗口的样式（如窗口宽、高、位置等信息）
		 * @param {String} aniClose 如果没有指定窗口动画，则使用默认无动画效果“none”。
		 * @param {Number} duration 单位为ms，如果没有设置则使用默认窗口动画时间600ms。
		 * @param {Function} showedCB 当指定Webview窗口动画时，在动画执行完毕，窗口完全显示时触发回调。
		 */
		_close: function(id_wvobj, aniClose, duration) {
			if($.util.isUndefined(aniClose)) {
				aniClose = STYLE.animation.getCloseAnimation();
			}
			plus.webview.close(id_wvobj, aniClose, duration);
		},
		/**
		 * @description 关闭Webview窗口
		 * @param {plus.webview.WebviewObject} id 窗口标识可用于在其它页面中通过getWebviewById来查找指定的窗口，为了保持窗口标识的唯一性，应该避免使用相同的标识来创建多个Webview窗口。 如果传入无效的字符串则使用url参数作为WebviewObject窗口的id值。
		 */
		close: function(wv) {
			wv.close(STYLE.animation.getCloseAnimation())
		},
		/**
		 * @description 获取当前窗口的WebviewObject对象
		 * @return {plus.webview.WebviewObject}
		 */
		currentWebview: function() {
			if(!$.os.plus) {
				return;
			}
			return plus.webview.currentWebview();
		},
		/**
		 * @description 隐藏当前窗口的WebviewObject对象
		 */
		hideCurrentWebview: function() {
			if(!$.os.plus) {
				return;
			}
			$.log.info("hide webview id = [" + plus.webview.currentWebview().id + "]");
			$.log.info("hide webview url = [" + plus.webview.currentWebview().getURL() + "]");
			return plus.webview.currentWebview().hide(STYLE.animation.getCloseAnimation());
		},
		/**
		 * @description 关闭当前窗口的WebviewObject对象
		 */
		closeCurrentWebview: function() {
			if(!$.os.plus) {
				return;
			}
			$.log.info("close webview id = [" + plus.webview.currentWebview().id + "]");
			$.log.info("close webview url = [" + plus.webview.currentWebview().getURL() + "]");
			return plus.webview.currentWebview().close(STYLE.animation.getCloseAnimation());
		},

		/**
		 * @description 查找指定标识的WebviewObject窗口
		 * @param {String} id
		 * @return {plus.webview}
		 */
		getWebviewById: function(id) {
			if(!$.os.plus) {
				return;
			}
			return plus.webview.getWebviewById(id);
		},
		/**
		 * @description 获取应用首页WebviewObject窗口对象
		 * @return {plus.webview}
		 */
		getLaunchWebview: function() {
			if(!$.os.plus) {
				return;
			}
			return plus.webview.getLaunchWebview();
		}
	}
})(lf, window);
/*
 * event
 */
(function($, window) {
	$.event = {
		/**
		 * @description 上拉下拉刷新
		 * @param {Object} webviewObj对象或者webview的ID 通知目标窗口
		 * @param {String} eventString 通知代码
		 * @param {JSON} data 通知内容
		 */
		fire: function(webview, eventString, data) {
			if(!$.os.plus) {
				return;
			}
			$.log.debug("通知事件[" + webview + "][" + eventString + "]");
			if($.util.isString(webview)) {
				$.log.debug("通知类型[string]:" + webview);
				mui.fire($.window.getWebviewById(webview), eventString, data);
			} else {
				if(webview != null) {
					$.log.debug("通知类型[webviewObk]:" + webview.id);
					mui.fire(webview, eventString, data);
				} else {
					$.log.debug("通知类型[webviewObk]:is null");
				}
			}
		},
		listener: function(eventString, eventListener) {
			if(!$.os.plus) {
				return;
			}
			window.addEventListener(eventString, eventListener);
		}
	}
})(lf, window);
/**
 * @description 原生调用API
 */
(function($, window) {

})(lf, window);
/**
 * @description 原生UI调用API
 */
(function($, window) {
	$.nativeUI = {
		/**
		 * @description 显示系统等待对话框
		 * @param {String} title 等待对话框上显示的提示标题内容
		 * @param {Object} options 可设置等待对话框的宽、高、边距、背景等样式
		 */
		showWaiting: function(title, options) { //弹出没有进度条消息提示框
			if($.os.plus) {
				plus.nativeUI.showWaiting(title, options)
			}

		},
		/**
		 * @description 关闭系统等待对话框
		 */
		closeWaiting: function() { //关闭消息提示框
			if($.os.plus) {
				plus.nativeUI.closeWaiting();
			}
		},
		/**
		 * @description 显示自动消失的提示消息
		 * @param {String} message 提示消息上显示的文字内容
		 * @param {Object} options 可设置提示消息显示的图标、持续时间、位置等
		 */
		toast: function(message, options) { //弹出有进度条消息提示框
			var settings = $.extend({}, STYLE.toastOption, options);
			mui.toast(message, settings);
		},
		/**
		 * @description 创建并显示系统样式确认对话框，可设置确认对话框的标题、内容、按钮数目及其文字。 弹出的确认对话框为非阻塞模式，用户点击确认对话框上的按钮后关闭，并通过confirmCB回调函数通知用户点击的按钮索引值。
		 * @param {String} title 确认对话框上显示的标题
		 * @param {String} message 确认对话框上显示的内容
		 * @param {Array} buttons 字符串数组，每项对应在确认对话框上显示一个按钮，用户点击后通过confirmCB返回用户点击按钮的在数组中的索引值
		 * @param {Function} confirmCB 回调函数中包括Event参数，可通过其index属性（Number类型）获取用户点击按钮的索引值。
		 * @example
		 LF.window.confirm("nativeUI", "Are you sure ready?",  ["Yes","No"] ,function(e)｛
		 console.log( (e.index==0)?"Yes!":"No!" );
		 });
		 */
		confirm: function(title, message, buttons, confirmCB, type) { //弹出至少包含一个至多包含3个按钮的对话框
			mui.confirm(message, title, buttons, confirmCB, type);
		},
		/**
		 * @description 创建并显示系统样式确认对话框，可设置确认对话框的标题、内容、按钮数目及其文字。 弹出的确认对话框为非阻塞模式，用户点击确认对话框上的按钮后关闭，并通过confirmCB回调函数通知用户点击的按钮索引值。
		 * @param {String} title 确认对话框上显示的标题
		 * @param {String} message 确认对话框上显示的内容
		 * @param {String} tip 编辑框显示的提示文字
		 * @param {Array} buttons 字符串数组，每项对应在确认对话框上显示一个按钮，用户点击后通过confirmCB返回用户点击按钮的在数组中的索引值
		 * @param {Function} confirmCB 回调函数中包括Event参数，可通过其index属性（Number类型）获取用户点击按钮的索引值。
		 * @example
		 lf.nativeUI.confirm("nativeUI", "Are you sure ready?",  ["Yes","No"] ,function(e){
	 		console.log( (e.index==0)?"Yes!":"No!" );
	  	});
		 */
		prompt: function(title, message, tip, buttons, confirmCB, type) { //弹出至少包含一个至多包含3个按钮的对话框
			mui.prompt(message, tip, title, buttons, confirmCB, type);
		},
		/**
		 * @description 创建并显示系统样式确认对话框，可设置确认对话框的标题、内容、按钮数目及其文字。 弹出的确认对话框为非阻塞模式，用户点击确认对话框上的按钮后关闭，并通过confirmCB回调函数通知用户点击的按钮索引值。
		 * @param {String} title 确认对话框上显示的标题
		 * @param {String} message 确认对话框上显示的内容
		 * @param {String} buttonCapture  提示对话框上按钮显示的内容
		 * @param {Array} buttons 字符串数组，每项对应在确认对话框上显示一个按钮，用户点击后通过confirmCB返回用户点击按钮的在数组中的索引值
		 * @param {Function} confirmCB 回调函数中包括Event参数，可通过其index属性（Number类型）获取用户点击按钮的索引值。
		 * @example
		 LF.window.confirm("nativeUI", "Are you sure ready?",  ["Yes","No"] ,function(e)｛
		 	console.log( (e.index==0)?"Yes!":"No!" );
		 });
		 */
		alert: function(title, message, confirmCB, type) { //弹出至少包含一个至多包含3个按钮的对话框
			mui.alert(message, title, confirmCB, type);
		}
	};
})(lf, window);
(function($) {
	var initializing = false,
		fnTest = /xyz/.test(function() {
			xyz;
		}) ? /\b_super\b/ : /.*/;

	var Class = function() {};
	Class.extend = function(prop) {
		var _super = this.prototype;
		initializing = true;
		var prototype = new this();
		initializing = false;
		for (var name in prop) {
			prototype[name] = typeof prop[name] == "function" &&
				typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn) {
					return function() {
						var tmp = this._super;

						this._super = _super[name];

						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, prop[name]) :
				prop[name];
		}
		function Class() {
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}
		Class.prototype = prototype;
		Class.prototype.constructor = Class;
		Class.extend = arguments.callee;
		return Class;
	};
	$.Class = Class;
})(lf);
/*
 * base64
 */
(function($, window, undefined) {
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

	var utf16to8 = function(str) {
		var out, i, len, c;
		out = "";
		len = str.length;
		for(i = 0; i < len; i++) {
			c = str.charCodeAt(i);
			if((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i);
			} else {
				if(c > 0x07FF) {
					out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
					out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
					out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
				} else {
					out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
					out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
				}
			}
		}
		return out;
	};
	var utf8to16 = function(str) {
		var out, i, len, c;
		var char2, char3;
		out = "";
		len = str.length;
		i = 0;
		while(i < len) {
			c = str.charCodeAt(i++);
			switch(c >> 4) {
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
					// 0xxxxxxx
					out += str.charAt(i - 1);
					break;
				case 12:
				case 13:
					// 110x xxxx 10xx xxxx
					char2 = str.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
					break;
				case 14:
					// 1110 xxxx10xx xxxx10xx xxxx
					char2 = str.charCodeAt(i++);
					char3 = str.charCodeAt(i++);
					out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
					break;
			}
		}
		return out;
	};
	$.base64encode = function(str) {
		str = utf16to8(str);
		var out, i, len;
		var c1, c2, c3;
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if(i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt((c1 & 0x3) << 4);
				out += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if(i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
				out += base64EncodeChars.charAt((c2 & 0xF) << 2);
				out += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
			out += base64EncodeChars.charAt(c3 & 0x3F);
		}
		return out;
	};
	$.base64decode = function(str) {
		str = utf8to16(str);
		var c1, c2, c3, c4;
		var i, len, out;
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
			/* c1 */
			do {
				c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			}
			while (i < len && c1 == -1);
			if(c1 == -1)
				break;
			/* c2 */
			do {
				c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			}
			while (i < len && c2 == -1);
			if(c2 == -1)
				break;
			out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
			/* c3 */
			do {
				c3 = str.charCodeAt(i++) & 0xff;
				if(c3 == 61)
					return out;
				c3 = base64DecodeChars[c3];
			}
			while (i < len && c3 == -1);
			if(c3 == -1)
				break;
			out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
			/* c4 */
			do {
				c4 = str.charCodeAt(i++) & 0xff;
				if(c4 == 61)
					return out;
				c4 = base64DecodeChars[c4];
			}
			while (i < len && c4 == -1);
			if(c4 == -1)
				break;
			out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		}
		return out;
	};
})(lf, window);
/*
 * md5
 */
(function($, window, undefined) {
	var rotateLeft = function(lValue, iShiftBits) {
		return(lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	}
	var addUnsigned = function(lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if(lX4 & lY4) return(lResult ^ 0x80000000 ^ lX8 ^ lY8);
		if(lX4 | lY4) {
			if(lResult & 0x40000000) return(lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			else return(lResult ^ 0x40000000 ^ lX8 ^ lY8);
		} else {
			return(lResult ^ lX8 ^ lY8);
		}
	}

	var F = function(x, y, z) {
		return(x & y) | ((~x) & z);
	}

	var G = function(x, y, z) {
		return(x & z) | (y & (~z));
	}

	var H = function(x, y, z) {
		return(x ^ y ^ z);
	}

	var I = function(x, y, z) {
		return(y ^ (x | (~z)));
	}

	var FF = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var GG = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var HH = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var II = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var convertToWordArray = function(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWordsTempOne = lMessageLength + 8;
		var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
		var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
		var lWordArray = Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while(lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	};

	var wordToHex = function(lValue) {
		var WordToHexValue = "",
			WordToHexValueTemp = "",
			lByte, lCount;
		for(lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			WordToHexValueTemp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
		}
		return WordToHexValue;
	};

	var uTF8Encode = function(string) {
		string = string.replace(/\x0d\x0a/g, "\x0a");
		var output = "";
		for(var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if(c < 128) {
				output += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				output += String.fromCharCode((c >> 6) | 192);
				output += String.fromCharCode((c & 63) | 128);
			} else {
				output += String.fromCharCode((c >> 12) | 224);
				output += String.fromCharCode(((c >> 6) & 63) | 128);
				output += String.fromCharCode((c & 63) | 128);
			}
		}
		return output;
	};
	$.hex_md5 = function(string){
		var x = Array();
		var k, AA, BB, CC, DD, a, b, c, d;
		var S11 = 7,
			S12 = 12,
			S13 = 17,
			S14 = 22;
		var S21 = 5,
			S22 = 9,
			S23 = 14,
			S24 = 20;
		var S31 = 4,
			S32 = 11,
			S33 = 16,
			S34 = 23;
		var S41 = 6,
			S42 = 10,
			S43 = 15,
			S44 = 21;
		string = uTF8Encode(string);
		x = convertToWordArray(string);
		a = 0x67452301;
		b = 0xEFCDAB89;
		c = 0x98BADCFE;
		d = 0x10325476;
		for(k = 0; k < x.length; k += 16) {
			AA = a;
			BB = b;
			CC = c;
			DD = d;
			a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
			d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
			c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
			b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
			a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
			d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
			c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
			b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
			a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
			d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
			c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
			b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
			a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
			d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
			c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
			b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
			a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
			d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
			c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
			b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
			a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
			d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
			c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
			b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
			a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
			d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
			c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
			b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
			a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
			d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
			c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
			b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
			a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
			d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
			c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
			b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
			a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
			d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
			c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
			b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
			a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
			d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
			c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
			b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
			a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
			d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
			c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
			b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
			a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
			d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
			c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
			b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
			a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
			d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
			c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
			b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
			a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
			d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
			c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
			b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
			a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
			d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
			c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
			b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
			a = addUnsigned(a, AA);
			b = addUnsigned(b, BB);
			c = addUnsigned(c, CC);
			d = addUnsigned(d, DD);
		}
		var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
		return tempValue.toLowerCase();

	};
})(lf, window);
/**
 * @description 用户类
 */
(function($, window) {
	var s = "signaturePwd";
	var j = "LfRole";
	var Role = $.Role = $.Class.extend({
		usercode:"",
		username:"",
		userrole:"",
		userroleName:"",
		userroleId:"",
		phone:"",
		companyId:"",
		loginsign:"",
		auths:[],
		positions:[],
		photograherId:'',
		currentPositions: [],
		init:function(){
			this._init();
		},
		_init:function(){
			var k = $.storage.get(j);
			if(typeof(k) != "undefined") {
				var l = null;
				try {
					l = $.util.strToJson(k);
					this.usercode = l.usercode;
					this.username = l.username;
					this.userrole = l.userrole;
					this.userroleName = l.userroleName;
					this.userroleId = l.userroleId;
					this.phone = l.phone;
					this.companyId = l.companyId;
					this.loginsign = l.loginsign;
					this.auths = l.auths;
					this.positions = l.positions;
					this.currentPositions = l.currentPositions;
					this.photograherId = l.photograherId;
				} catch(e) {
					this.loginsign = "";
					this.username = "";
					this.userrole = "";
					this.userroleName = "";
					this.userroleId = "";
					this.usercode = "";
					this.phone = "";
					this.companyId = "";
					this.auths = [];
					this.positions = [];
					this.currentPositions = [];
					this.photograherId = '';
				}
			} else {
				this.loginsign = "";
				this.username = "";
				this.userrole = "";
				this.userroleName = "";
				this.userroleId = "";
				this.usercode = "";
				this.phone = "";
				this.companyId = "";
				this.auths = [];
				this.positions = [];
				this.currentPositions = [];
				this.photograherId = '';
			}
			$.log.info("complete loading role data is ："+k);
		},
		save:function(k){
			this.usercode = k.usercode;
			this.username = k.username;
			this.userrole = k.userrole;
			this.userroleName = k.userroleName;
			this.userroleId = k.userroleId;
			this.phone = k.phone;
			this.companyId = k.companyId;
			this.loginsign = k.loginsign;
			this.auths = k.auths;
			this.positions = k.positions;
			this.currentPositions = k.currentPositions;
			this.photograherId = k.photograherId;
			$.storage.put(j, JSON.stringify(k));
			$.storage.put(s, k.tonken);
		},
		logout:function(){
			$.storage.removeItem(s);
			$.storage.removeItem(j);
			this._init();
		},
		hasAuth:function(key){
			var flag = false;
			for(var i in this.auths){
				if(this.auths[i] == key){
					flag = true;
					break;
				}
			}
			return flag
		},
		getSignature:function(){
			var signaturePwd = $.storage.get(s);
			if($.util.isUndefined(signaturePwd)) {
				signaturePwd = DEFAULTSIGNATUREPWD;
			}
			return signaturePwd;
		}
	});
	
	$.ready(function(){
		window.Role = new Role();
	});
})(lf, window);
/**
 * @description 扩展js
 */
(function($, window) {
	Date.prototype.format = function(fmt){
	  var o = {
	    "M+" : this.getMonth()+1,                 //月份
	    "d+" : this.getDate(),                    //日
	    "H+" : this.getHours(),                   //小时
	    "h+" : this.getHours(),                   //小时
	    "m+" : this.getMinutes(),                 //分
	    "s+" : this.getSeconds(),                 //秒
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度
	    "S"  : this.getMilliseconds()             //毫秒
	  };
	  if(/(y+)/.test(fmt))
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	  for(var k in o)
	    if(new RegExp("("+ k +")").test(fmt))
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	  return fmt;
	}
})(lf, window);
//# sourceMappingURL=lf.js.map
