<template>
    <div class="excellent-photo-header-summary">
        <div class="container-wrap">
            <div class="chart-container">
                <div class="chart-wrap">
                    <e-charts :options="chartOption" auto-resize ></e-charts>
                </div>
            </div>
            <div>
                <div class="count" v-text="chicePhotoCounts"></div>
                <div class="tip">
                    <div>审片团数</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            chartOption: {
                type: Object,
                required: true
            },
            chicePhotoCounts: {
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
.excellent-photo-header-summary {
    display: flex;
    height: 2rem;
    background: #fff;
    margin-bottom: $margin-bottom;
    .container-wrap {
        height: 2rem;
        width: 4rem;
        margin: 0 auto;
        display: flex;
        &>div {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 10px 0;
            &>div {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .count {
                flex: 1;
                color: $summary_count_color;
                font-size: $summary_count_font_size;
            }
            .tip {
                flex: 0.8;
                font-size: $summary_tip_font_size;
                color: $summary_tip_color;
            }
        }
    }
    
    .chart-container {
        padding: 0;
        .chart-wrap {
            position: relative;
            flex: 1;
            .echarts {
                position: absolute;
                height: 100%;
                width: 100%;
            }
        }
    }
    .blank-div {
        flex: 1;
        background: red;
    }
}
</style>
