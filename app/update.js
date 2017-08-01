lf.ready(function() {
	update();
})

function update() {
	var params = {
		"app_id": plus.runtime.appid,
		"version": plus.runtime.version,
		"imei": plus.device.imei,
		"platform": plus.os.name
	};
	lf.net.getJSON("/app/validationversion", params, function(data) {
		var update_desc = "发现新的版本，是否需要立即更新";
		if(data.code == 200) {
			var btns = null;
			if(data.data.isMandatory == 1) {
				update_desc = "发现新的版本，请立即更新";
				btns = ["立即更新"];
			} else {
				btns = ["立即更新", "取　　消"];
			}
			if(data.data.upgrade_desc) {
				update_desc = update_desc + "\n" + data.data.releaseRemark;
			}
			lf.nativeUI.confirm("", update_desc, btns, function(e) {
				if(btns.length == 1) {
					if(0 == e.index) {
						plus.runtime.openURL(data.data.releaseUrl);
					} else {
						plus.runtime.quit();
					}
				} else {
					if(0 == e.index) {
						plus.runtime.openURL(data.data.releaseUrl);
					} else {}
				}
			});
		}
	}, function(res) {});
}