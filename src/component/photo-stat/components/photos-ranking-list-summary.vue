<template>
    <div class="photos-ranking-list-summary">
        <div v-on:tap="uploadTap" :class="active == 'uploadTap'">
            <div class="count" v-text="photographerUploadTrips"></div>
            <div class="tip">
                <div>{{dateStr}}拍摄上传</div>
                <div>摄影师人数</div>
            </div>
        </div>
        <div class="summary-chart-container">
            <div class="summary-chart-wrap">
                <e-charts :options="chartOption" auto-resize ></e-charts>
            </div>
        </div>
        <div v-on:tap="pendingUploadTap" :class="active == 'pendingUploadTap'">
            <div class="count" v-text="photographerPendingUploadTrips"></div>
            <div class="tip">
                <div>{{dateStr}}拍摄未上传</div>
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
            },
            dateStr: {
                type: String,
                required: true,
            },
            photographerUploadTrips: {
                // 摄影师上传过照片行程数
                type: Number,
                required: true,
            },
            photographerPendingUploadTrips: {
                // 摄影师未上传过照片行程数
                type: Number,
                required: true
            }
        },
        data() {
            return {
                active: 'uploadTap'
            }
        },
        methods: {
            uploadTap() {
                this.$emit('upload-tap');
            },
            pendingUploadTap() {
                this.$emit('pending-upload-tap');
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
        color: #888;
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
        &:active {
            .count {
                color: #000;
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
                // background: red;
            }
        }
    }
}
</style>

