<template>
    <div class="photo-stat-photos-this-month">
        <photos-header-summary :date-str="'本月'" :time-range="'thisMonth'"></photos-header-summary>
        <chart-photo-increase :date-str="'本月'" :time-range="'thisMonth'"></chart-photo-increase>
        <chart-upload-point :date-str="'本月'" :time-range="'thisMonth'"></chart-upload-point>
        <photos-ranking :date-str="'本月'" :time-range="'thisMonth'"></photos-ranking>
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
        },
        computed: {
        }
    }
</script>
<style lang="scss">
    @import "../common.scss";
    .photo-stat-photos-this-month {
        padding-top: $padding_top;
    }
</style>

