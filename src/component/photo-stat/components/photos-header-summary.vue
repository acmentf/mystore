<template>
    <div class="photos-header-summary">
        <div class="top">
            <div class="block">
                <div class="count" v-text="info.photoCounts"></div>
                <div class="tip">
                    <div>{{dateStr}}上传照片数(含历史照片)</div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="block">
                <div class="count" v-text="info.uploadGroupCounts"></div>
                <div class="tip">
                    <div>{{dateStr}}拍摄</div>
                    <div>上传团数</div>
                </div>
            </div>
            <div class="block">
                <div class="count" v-text="info.pendingUploadGroupCounts"></div>
                <div class="tip">
                    <div>{{dateStr}}拍摄</div>
                    <div>待传团数</div>
                </div>
            </div>
            <div class="block">
                <div class="count" v-text="info.shotNumbers"></div>
                <div class="tip">
                    <div>{{dateStr}}拍摄人数</div>
                </div>
            </div>
            <div class="block">
                <div class="count">{{info.averageNumbers|toFixed(2)}}</div>
                <div class="tip">
                    <div>{{dateStr}}客均张数</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import TimeRangeMixin from "../TimeRageMixin";
    export default {
        mixins: [TimeRangeMixin],
        data() {
            return {
                info: {
                    photoCounts: '',
                    uploadGroupCounts: '',
                    pendingUploadGroupCounts: '',
                    shotNumbers: '',
                    averageNumbers: ''
                }
            }
        },
        filters: {
            toFixed(val, n) {
                if(val) {
                    return val.toFixed(n);
                } else {
                    return val;
                }
            }
        },
        computed: {

        },
        methods: {
            init() {
                var that = this;
                var queryTime = this.queryTime;
                lf.nativeUI.showWaiting();
                // 查询照片拍摄统计
                lf.net.getJSON('/report/photo/selectPhotoShotCount', {
                    queryStartDate: queryTime.startDate,
                    queryEndDate: queryTime.endDate
                }, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code == 200) {
                        for(var attr in that.info) {
                            that.info[attr] = res.data[attr];
                        }
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    lf.nativeUI.toast(error.msg);
                });
            }
        },
        mounted() {
            var that = this;
            lf.ready(function() {
                that.init()
            })
        }
    }
</script>
<style lang="scss">
    @import "../common.scss";
    .photos-header-summary {
        background: #fff;
        padding-top: $side_padding;
        padding-bottom: $side_padding;
        margin-bottom: $margin_bottom;
        .top {
            height: 1.6rem;
            display: flex;
            .count {
                font-size: 0.7rem;
            }
        }
        .bottom {
            display: flex;
            height: 1.3rem;
            .count {
                font-size: 0.6rem;
            }
            .tip {
            }
        }
        .block {
            display: flex;
            flex-direction: column;
            flex: 1;
            text-align: center;
            .count {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1.5;
                color: $summary_count_color;
                font-size: $summary_count_font_size;
            }
            .tip {
                display: flex;
                flex: 1;
                align-items: center;
                flex-direction: column;
                font-size: $summary_tip_font_size;
                color: $summary_tip_color;
                div {
                    height: 0.5rem;
                    display: flex;
                    flex: 1;
                    align-items: center;
                    justify-content: center;
                    // height: 1rem;
                    // line-height: 1rem;
                }
            }
        }
    }
</style>

