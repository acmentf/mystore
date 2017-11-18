<template>
    <div class="photo-stat-photos-this-week">
        <photos-header-summary :date-str="'本周'" :time-range="'thisWeek'"></photos-header-summary>
        <chart-photo-increase :date-str="'本周'" :time-range="'thisWeek'"></chart-photo-increase>
        <chart-upload-point :date-str="'本周'" :time-range="'thisWeek'"></chart-upload-point>
        <photos-ranking :date-str="'本周'" :time-range="'thisWeek'"></photos-ranking>
    </div>
</template>
<script>
    import PhotosHeaderSummary from '../components/photos-header-summary.vue';
    import PhotosRanking from "./photos-ranking.vue";
    import ChartPhotoIncrease from "./chart-photo-increase.vue";
    import ChartUploadPoint from "./chart-upload-point.vue";
    export default {
        components: {
            PhotosHeaderSummary,
            PhotosRanking,
            ChartPhotoIncrease,
            ChartUploadPoint
        },
        computed: {
            photoIncreateChartOptions() {
                return {
                    title: {
                        text: "本周照片每日增长趋势",
                        left: 'center',
                        textStyle: {
                            color: "#505050"
                        }
                    },
                    series: []
                }
            },
            uploadPointChartOptions() {
                return {
                    title: {
                        text: "本周拍摄照片上传景点分布",
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
    .photo-stat-photos-this-week {
        padding-top: $padding_top;
    }
</style>

