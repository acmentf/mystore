<template>
    <div class="photo-stat-photos-today">
        <photos-header-summary :time-range="'当天'"></photos-header-summary>
        <chart-upload-point></chart-upload-point>
        <photos-ranking></photos-ranking>
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