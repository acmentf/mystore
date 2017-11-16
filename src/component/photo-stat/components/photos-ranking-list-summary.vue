<template>
    <div class="photos-ranking-list-summary">
        <div>
            <div class="count">15</div>
            <div class="tip">
                <div>本月拍摄上传</div>
                <div>摄影师人数</div>
            </div>
        </div>
        <div class="summary-chart-container">
            <div class="summary-chart-wrap">
                <e-charts :options="chartOption" auto-resize ></e-charts>
            </div>
        </div>
        <div>
            <div class="count">24</div>
            <div class="tip">
                <div>本周拍摄未上传</div>
                <div>摄影师人数</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        porps: {
            chartOption: {
                type: Object,
                required: true
            }
        },
        components: {
            ECharts: VueECharts,
        }
    }
</script>
<style lang="scss">
@import "../common.scss";
.photos-ranking-list-summary {
    display: flex;
    height: 2.5rem;
    background: #fff;
    &>div {
        display: flex;
        flex-direction: column;
        padding: $side_padding;
        flex: 1;
        // border-right: 1px solid red;
        .count {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1 0 0;
            font-size: $summary_count_font_size;
            color: $summary_count_color;
        }
        .tip {
            display: flex;
            flex-direction: column;
            flex: 0.8 0 0;
            font-size: $summary_tip_font_size;
            color: $summary_tip_color;
            div {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
    .summary-chart-container {
        .summary-chart-wrap {
            position: relative;
            flex: 1;
            .echarts {
                position: absolute;
                height: 100%;
                width: 100%;
                background: red;
            }
        }
    }
}
</style>

