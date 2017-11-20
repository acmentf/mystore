<template>
    <div class="photo-stat-photos-today">
        <photos-header-summary :date-str="'昨日'" :time-range="'yesterday'"></photos-header-summary>
        <chart-upload-point :date-str="'昨日'" :time-range="'yesterday'"></chart-upload-point>
        <photos-ranking :date-str="'昨日'" :time-range="'yesterday'"></photos-ranking>
    </div>
</template>
<script>
    import PhotosHeaderSummary from "../components/photos-header-summary.vue";
    import PhotosRanking from "./photos-ranking.vue";
    import ChartUploadPoint from "./chart-upload-point.vue";
    export default {
        components: {
            PhotosHeaderSummary,
            PhotosRanking,
            ChartUploadPoint
        },
        data () {
            
        },
        computed: {
        }
    }
</script>
<style lang="scss">
    @import "../common.scss";
    .photo-stat-photos-today {
        padding-top: $padding_top;
    }
</style>