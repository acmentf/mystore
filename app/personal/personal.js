/*
 * Description: 个人中心逻辑
 * Author: nishu
 * Email: nishu@foxmail.com
 */

(function() {
	var vm = new Vue({
		el: '#offCanvasContentScroll',
		data: {
			name:'',
			section: '',
			phone: ''
		}
	})
	lf.ready(function(){
		vm.phone = window.Role.phone
		vm.name = window.Role.username
		vm.section = window.Role.userroleName
		console.log(window.Role.phone)
	})
    // event handle
    var handleLogout = function() {
	    console.log('logout')
    }

    var handleGoFeedback = function() {
        lf.window.openWindow('feedback.html', 'feedback.html')
    }

    var handleGoAbout = function() {
        lf.window.openWindow('about.html', 'about.html')
    }
    
    var handleResetPassword = function() {
        lf.window.openWindow('password.html', 'password.html')
    }

    // Add listener
    mui('.personal-content').on('tap', '.logout', handleLogout)
    mui('.personal-content').on('tap', '.feedback-go', handleGoFeedback)
    mui('.personal-content').on('tap', '.about-go', handleGoAbout)
    mui('.personal-content').on('tap', '.reset-password', handleResetPassword)
    mui('body').on('tap','.footer-order-btn',function() {
	lf.window.openWindow('../order/orderlist.html','../order/orderlist.html',{},{},lf.window.currentWebview())
	})
	mui('body').on('tap','.footer-message-btn',function(){
		lf.window.openWindow('../message/message.html','../message/message.html',{},{},lf.window.currentWebview())
		
	})

})()


