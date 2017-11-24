<template>
    <div class="mui-inner-wrap market-expansion-market-staff-relation">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" id="back"></a>
            <h1 class="mui-title">渠道关系</h1>
        </header>
        <div class="mui-content">
            <div class="mui-content orderlist-content">
                <div id="slider" class="mui-slider mui-fullscreen">
                    <div id="sliderSegmentedControl" class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
                        <a class="mui-control-item mui-active" href="#tab1">
                            <span class="text">未关联</span>
                        </a>
                        <a class="mui-control-item" href="#tab2">
                            <span class="text">已关联</span>
                        </a>
                    </div>
                    <div class="mui-slider-group">
                        <div id="tab1" class="mui-slider-item mui-control-content mui-active">
                            <div class="mui-scroll-wrapper">
                                <div class="mui-scroll">
                                    <relation-card v-for="(item, index) in notConnectList" :item="item" :key="index"></relation-card>
                                </div>
                            </div>
                        </div>
                        <div id="tab2" class="mui-slider-item mui-control-content">
                            <div class="mui-scroll-wrapper">
                                <div class="mui-scroll">
                                    <relation-card v-for="(item, index) in hadConnectList" :item="item" :key="index"></relation-card>
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
    import RelationCard from './market-staff-relation/relation-card.vue';
    export default {
        components: {
            RelationCard
        },
        data() {
            return {
                notConnectList: [
                    {}
                ],
                hadConnectList: [
                    {

                    }
                ]
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
                this.getOrderProductPurchaserList(1, 'notConnectList');
            },
            getOrderProductPurchaserList(flag, listName) {
                let url = "/purchaser/getOrderProductPurchaserList.htm";
                let params = {
                    flag: flag
                }
                lf.net.getJSONWithLoading(url, params, function(res) {
                    this[listName] = res.data;
                })
            }
        },
        mounted() {
            lf.ready(() =>{
                this.initMui();
            });
            document.querySelector('.mui-slider').addEventListener('slide', (event) => {
                console.log("mui-slider: ", event.detail.slideNumber);
                this.getOrderProductPurchaserList(event.detail.slideNumber + 1);
            });
        }
    }
</script>
<style lang="scss">
.market-expansion-market-staff-relation {
    .mui-slider-indicator {
        background: #fff;
    }
    .mui-control-item.mui-active {
        color: #3cb493 !important;
        border-bottom: 2px solid #3cb493 !important;
    }
}
</style>
