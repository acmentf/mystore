var STYLE = {};

/**
 * @description 窗口关闭开启动画组件
 */
STYLE.animation = {
	ANIMATION_DEFAULT: "slideInRight",
	animationTypeShow: {
		auto: "auto", //自动选择动画效果，使用上次显示窗口设置的动画效果，如果是第一次显示则默认动画效果“none”。
		none: "none", //立即显示页面，无任何动画效果，页面显示默认的动画效果。 此效果忽略动画时间参数，立即显示。 对应关闭动画
		slideInRight: "slide-in-right", //从右侧横向滑动效果  页面从屏幕右侧外向内横向滑动显示。 对应关闭动画"slide-out-right"。
		slideInLeft: "slide-in-left", //从左侧横向滑动效果 页面从屏幕左侧向右横向滑动显示。 对应关闭动画"slide-out-left"。
		slideInTop: "slide-in-bottom", //从上侧竖向滑动效果 页面从屏幕上侧向下竖向滑动显示。 对应关闭动画"slide-out-top"。
		fade: "fade-in", //从透明到不透明逐渐显示效果 页面从完全透明到不透明逐渐显示。 对应关闭动画"fade-out"。
		zoom: "zoom-out", //从小到大逐渐放大显示效果 页面在屏幕中间从小到大逐渐放大显示。 对应关闭动画"zoom-in"。
		zoomFade: "zoom-fade-out", //从小到大逐渐放大并且从透明到不透明逐渐显示效果 页面在屏幕中间从小到大逐渐放大并且从透明到不透明逐渐显示。 对应关闭动画"zoom-fade-in"。
		popIn: "pop-in", //从右侧平移入栈动画效果 页面从屏幕右侧滑入显示，同时上一个页面带阴影效果从屏幕左侧滑出隐藏。 对应关闭动画"pop-out"。
	},
	animationTypeClose: {
		auto: "auto", //自动选择动画效果，使用上次显示窗口设置的动画效果，如果是第一次显示则默认动画效果“none”。
		none: "none", //立即显示页面，无任何动画效果，页面显示默认的动画效果。 此效果忽略动画时间参数，立即显示。 对应关闭动画
		slideInRight: "slide-out-right", //从右侧横向滑动效果  页面从屏幕右侧外向内横向滑动显示。 对应关闭动画"slide-out-right"。
		slideInLeft: "slide-out-left", //从左侧横向滑动效果 页面从屏幕左侧向右横向滑动显示。 对应关闭动画"slide-out-left"。
		slideInTop: "slide-out-bottom", //从上侧竖向滑动效果 页面从屏幕上侧向下竖向滑动显示。 对应关闭动画"slide-out-top"。
		fade: "fade-out", //从透明到不透明逐渐显示效果 页面从完全透明到不透明逐渐显示。 对应关闭动画"fade-out"。
		zoom: "zoom-in",
		zoomFade: "zoom-fade-in", //从小到大逐渐放大并且从透明到不透明逐渐显示效果 页面在屏幕中间从小到大逐渐放大并且从透明到不透明逐渐显示。 对应关闭动画"zoom-fade-in"。
		popIn: "pop-in", //从右侧平移入栈动画效果 页面从屏幕右侧滑入显示，同时上一个页面带阴影效果从屏幕左侧滑出隐藏。 对应关闭动画"pop-out"。
	},
	getOpenAnimation: function() {
		return this.animationTypeShow[this.ANIMATION_DEFAULT];
	},
	getCloseAnimation: function() {
		return this.animationTypeClose[this.ANIMATION_DEFAULT];
	}
};
/**
 * @description JSON对象，原生窗口设置参数的对象
 */
STYLE.webviewStyle = {
	blockNetworkImage: false, //是否阻塞网络图片的加载布尔类型，true表示阻塞，false表示不阻塞
	bounce: "none", //none表示没有反弹效果；vertical表示垂直方向有反弹效果；horizontal表示水平方向有反弹效果；all表示垂直和水平方向都有反弹效果
	//bounceBackground : "",//窗口回弹效果区域的背景窗口回弹效果区域背景可支持颜色值或图片： 颜色值格式为"#RRGGBB"，如"#FFFFFF"为设置白色背景； 背景图为"url(%image path%)"，如"url(./icon.png)"为设置icon.png为背景图，图片采用平铺模式绘制。
	mask: "none", //用于设置Webview窗口的遮罩层样式，遮罩层会覆盖Webview中所有内容，包括子webview，并且截获webview的所有触屏事件，此时Webview窗口的点击操作会触发maskClick事件。 字符串类型，可取值： rgba格式字符串，定义纯色遮罩层样式，如"rgba(0,0,0,0.5)"，表示黑色半透明； "none"，表示不使用遮罩层； 默认值为"none"，即无遮罩层。
	opacity: 1, //窗口的不透明度
	render: "onscreen", //支持以下属性值： "onscreen" - Webview窗口在屏幕区可见时渲染，不可见时不进行渲染，此时能减少内存使用量； "always" - Webview在任何时候都渲染，在内存较大的设备上使用，被遮挡的窗口在此中模式下显示的时候会有更流畅的效果。 默认值为"onscreen"。 仅Android平台支持。
	scrollIndicator: "none", //用于控制窗口滚动条样式，可取值： "all"：垂直和水平滚动条都显示； "vertical"：仅显示垂直滚动条； "horizontal"：仅显示水平滚动条； "none"：垂直和水平滚动条都不显示。 默认值为"all"，即垂直和水平滚动条都显示。 注意：显示滚动条的前提条件是窗口中的内容超过窗口显示的宽或高。
	top: "0px", //支持百分比、像素值，默认值为0px。未设置top属性值时，可设置bottom属性值改变窗口的默认top位置。
	left: "0px", //支持百分比、像素值，默认值为0px。未设置left属性值时，可设置right属性值改变窗口的默认left位置。
	scrollIndicator: "none"
	//		height: "100%", //支持百分比、像素值，默认为100%。未设置height属性值时，可同时设置top和bottom属性值改变窗口的默认高度。
	//		width: "100%", //支持百分比、像素值，默认为100%。未设置width属性值时，可同时设置left和right属性值改变窗口的默认宽度。
};
/**
 		* @description 系统提示消息框要设置的参数
 			icon：String，提示消息框上显示的图标
			duration：String，可选值为"long"、"short"，值为"long"时显示时间约为3.5s，值为"short"时显示时间约为2s，未设置时默认值为"short"。
			align：String，可选值为"left"、"center"、"right"，分别为水平居左、居中、居右，未设置时默认值为"center"。
		  	verticalAlign：String，可选值为"top"、"center"、"bottom"，分别为垂直居顶、居中、居底，未设置时默认值为"bottom"。
		*/
STYLE.toastOption = {
	icon: "系统提示",
	duration: "short",
	align: "center",
	verticalAlign: "bottom"
};