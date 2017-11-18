export default {
    getJson(url, params, successCallback, errorCallback){
        lf.nativeUI.showWaiting();
        lf.net.getJSON(url, params, function(res) {
            lf.nativeUI.closeWaiting()
            if (res.code == 200) {
                if(successCallback) {
                    successCallback(res)
                }
            } else {
                lf.nativeUI.toast(res.msg);
            }
        }, function(error) {
            lf.nativeUI.closeWaiting()
            lf.nativeUI.toast(error.msg);
        });
    }
}