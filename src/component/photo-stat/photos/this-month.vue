<template>
    <div class="photo-stat-photos-this-month">
        <photos-header-summary :time-range="'当天'"></photos-header-summary>
        <chart-photo-increase></chart-photo-increase>
        <large-chart :chart-options="accumulativeTrendChartOptions"></large-chart>
        <chart-upload-point></chart-upload-point>
        <photos-ranking></photos-ranking>
    </div>
</template>
<script>
    import PhotosHeaderSummary from '../components/photos-header-summary.vue';
    import PhotosRanking from "./photos-ranking.vue";
    import ChartPhotoIncrease from "./chart-photo-increase.vue";
    import ChartUploadPoint from "./chart-upload-point.vue";
    import LargeChart from "../components/large-chart.vue";
    export default {
        components: {
            PhotosHeaderSummary,
            PhotosRanking,
            ChartPhotoIncrease,
            ChartUploadPoint,
            LargeChart
        },
        computed: {
            accumulativeTrendChartOptions() {
                return {
                    title: {
                        text: "本月每日照片累积增长趋势",
                        left: 'center',
                        textStyle: {
                            color: "#505050"
                        }
                    },
                    series: []
                }
            },
        }
    }
</script>
<style lang="scss">
    @import "../common.scss";
    .photo-stat-photos-this-month {
        padding-top: $padding_top;
    }
</style>

