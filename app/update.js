lf.ready(function(){
	update();
})
function update() {
	var params = {
		"data": {
			"app_id": plus.runtime.appid,
			"version": plus.runtime.version,
			"imei": plus.device.imei,
			"platform": plus.os.name
		}
	};
	lf.net.getJSON("/version", params, function(data) {
		var update_desc = "发现新的版本，是否需要立即更新";
		if(data.result_code == 0) {
			if(data.result_data.no_version == 0) {
				var btns = null;
				if(data.result_data.upgrade_type == 2) {
					update_desc = "发现新的版本，请立即更新";
					btns = ["立即更新"];
				} else {
					btns = ["立即更新", "取　　消"];
				}
				if(data.result_data.upgrade_desc) {
					update_desc = update_desc + "\n" + data.result_data.upgrade_desc;
				}
				lf.nativeUI.confirm("", update_desc, btns, function(e) {
					if(btns.length == 1) {
						if(0 == e.index) {
							plus.runtime.openURL(data.result_data.upgrade_url);
						} else {
							plus.runtime.quit();
						}
					} else {
						if(0 == e.index) {
							plus.runtime.openURL(data.result_data.upgrade_url);
						} else {
						}
					}
				});
			}
		} else {
		}
	}, function(res) {
	});
}