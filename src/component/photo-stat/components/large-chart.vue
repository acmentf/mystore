<template>
    <div class="large-chart">
        <div class="chart-wrap" :style="{height: height}">
            <e-charts :options="chartOption" auto-resize ></e-charts>
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
            height: {
                default: '7rem',
                type: String
            }
        },
        components: {
            ECharts: VueECharts,
        },
        data() {

        },
        computed: {

        }
    }
</script>
<style lang="scss">
    @import "../common.scss";
    .large-chart {
        background: #fff;
        margin-bottom: $margin_bottom;
        padding: $side_padding;
        .chart-wrap {
            position: relative;
            .echarts {
                position: absolute;
                height: 100%;
                width: 100%;
            }
        }
    }
</style>

