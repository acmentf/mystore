var SERVERS = {
	development: 'http://47.96.162.9:8091/shoot-mobile-web',
	sit: 		 'https://tuyi.sit.fingercrm.cn/shoot-mobile-web',
	uat: 		 'https://tuyi.uat.fingercrm.cn/shoot-mobile-web',
	production:  'http://tuyi.fingercrm.cn/shoot-mobile-web'
}

module.exports = {
	HOST: SERVERS[process.env.NODE_ENV],

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