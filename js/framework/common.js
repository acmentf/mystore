var deviceWidth = document.documentElement.clientWidth
console.log(deviceWidth)
//if(deviceWidth > 640) deviceWidth = 640
document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px'
window.onresize = function() {
	var deviceWidth = document.documentElement.clientWidth
//	if(deviceWidth > 640) deviceWidth = 640
	document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px'
}