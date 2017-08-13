/*
 * Description: 个人中心逻辑
 * Author: nishu
 * Email: nishu@foxmail.com
 */

(function() {

    // event handle
    var handleGoSetting = function() {
        lf.window.openWindow('setting.html', 'setting.html')
    }

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
    mui('.personal-content').on('tap', '.setting-go', handleGoSetting)
    mui('.personal-content').on('tap', '.logout', handleLogout)
    mui('.personal-content').on('tap', '.feedback-go', handleGoFeedback)
    mui('.personal-content').on('tap', '.about-go', handleGoAbout)
    mui('.personal-content').on('tap', '.reset-password', handleResetPassword)

})()


