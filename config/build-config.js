// webim的服务器列表
var SERVERS = {
	development: 'https://tuyi.uat.fingercrm.cn',
	sit: 		 'https://tuyi.sit.fingercrm.cn',
	uat: 		 'https://tuyi.uat.fingercrm.cn',
	production:  'https://tuyi.fingercrm.cn'
}

module.exports = {
	WEBIMHOST: SERVERS[process.env.NODE_ENV],

	devPublicPath: '/',

	prodPublicPath: '/',

	inlineFileLimit: 1000,

	autoOpenBrowser: false,

	productionSourceMap: true,

	enableReactHot: true,

	cssModulesSetting: '?modules&localIdentName=[name]__[local]-[hash:base64:5]',

	providePlugin: {},

	proxy: {
		"/api": {
			target: "http://localhost:5000",
			secure: false,
			pathRewrite: {
				"^/api": ""
			}
		}
	}
}