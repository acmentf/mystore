export default {
    __dayMillionSeconds: 1000 * 60 * 60 * 24,
    today: function() {
        var lff = lf;
        var todayStr = lf.util.timeStampToDate2(new Date());
        return {
            startDate: todayStr,
            endDate: todayStr
        }
    },
    yesterday: function() {
        var yesterdayTime = new Date().getTime() - (this.__dayMillionSeconds);
        var yesterdayStr = lf.util.timeStampToDate2(new Date(yesterdayTime));
        return {
            startDate: yesterdayStr,
            endDate: lf.util.timeStampToDate2(new Date())
        }
    },
    thisWeek: function() {
        // 星期计算以 0 开始
        var day = new Date().getDay();
        var startDate = new Date(new Date().getTime() - day * this.__dayMillionSeconds);
        return {
            startDate: lf.util.timeStampToDate2(startDate),
            endDate: lf.util.timeStampToDate2(new Date)
        }
    },
    thisMonth: function() {
        // 月中几号，以1开始
        var date = new Date().getDate();
        var startDate = new Date(new Date().getTime() - (date - 1) * this.__dayMillionSeconds);
        return {
            startDate: lf.util.timeStampToDate2(startDate),
            endDate: lf.util.timeStampToDate2(new Date())
        }
    },
    lastNDay: function(n) {
        var date = new Date();
        var startDate = new Date(new Date().getTime() - n * this.__dayMillionSeconds);
        return {
            startDate: lf.util.timeStampToDate2(startDate),
            endDate: lf.util.timeStampToDate2(new Date())
        }
    }
}