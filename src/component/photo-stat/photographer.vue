<template>
    <div class="mui-inner-wrap statistics-photo-stat-photographer">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" id="back"></a>
            <h1 class="mui-title">摄影师上传数据</h1>
        </header>
        <div class="mui-content">
            <div class="mui-content orderlist-content">
                <div id="slider" class="mui-slider mui-fullscreen">
                    <div id="sliderSegmentedControl" class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
                        <a class="mui-control-item mui-active" href="#day">
                            <span class="text">昨日</span>
                        </a>
                        <a class="mui-control-item" href="#week">
                            <span class="text">本周</span>
                        </a>
                        <a class="mui-control-item" href="#month">
                            <span class="text">本月</span>
                        </a>
                    </div>
                    <div class="mui-slider-group">
                        <div id="day" class="mui-slider-item mui-control-content mui-active">
                            <div class="mui-scroll-wrapper">
                                <div class="mui-scroll">
                                    <photographer-page 
                                    v-if="todayShow"
                                    :date-str="'昨日'" :time-range="'yesterday'"></photographer-page>
                                </div>
                            </div>
                        </div>
                        <div id="week" class="mui-slider-item mui-control-content">
                            <div class="mui-scroll-wrapper">
                                <div class="mui-scroll">
                                    <photographer-page 
                                    v-if="thisWeekShow"
                                    :date-str="'本周'" :time-range="'thisWeek'"></photographer-page>
                                </div>
                            </div>
                        </div>
                        <div id="month" class="mui-slider-item mui-control-content">
                            <div class="mui-scroll-wrapper">
                                <div class="mui-scroll">
                                    <photographer-page 
                                    v-if="thisMonthShow"
                                    :date-str="'本月'" :time-range="'thisMonth'"></photographer-page>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PhotographerPage from "./photographer/photographer-page";
export default {
    name: "Photographer",
    components: {
        PhotographerPage
    },
    data: function() {
        return {
            currentTab: [0]
        };
    },
    computed: {
        todayShow() {
            return this.currentTab.indexOf(0) != -1;
        },
        thisWeekShow() {
            return this.currentTab.indexOf(1) != -1;

        },
        thisMonthShow() {
            return this.currentTab.indexOf(2) != -1;
        }
    },
    methods: {
        initMui: function() {
            lf.ready(function() {
                mui(".mui-scroll-wrapper").scroll({
                    bounce: false,
                    indicators: true, //是否显示滚动条
                    deceleration: mui.os.ios ? 0.003 : 0.0009
                });
            });
        },
        switchTab(index) {
            this.currentTab.push(index);
        }
    },
    mounted: function() {
        var that = this;
        lf.ready(function() {
            that.initMui();
            document.querySelector('.mui-slider').addEventListener('slide', function(event) {
                console.log(event.detail.slideNumber);
                that.switchTab(event.detail.slideNumber);
            });
        })
    }
};
</script>
<style lang="scss">
.statistics-photo-stat-photographer {
    .mui-slider-indicator {
        background: #fff;
    }
    .mui-control-item.mui-active {
        color: #3cb493 !important;
        border-bottom: 2px solid #3cb493 !important;
    }
}
</style>

