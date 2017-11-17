<template>
    <div class="photo-stat-photos-today">
        <excellent-photo-header-summary></excellent-photo-header-summary>
        <photographer-header-summary></photographer-header-summary>
        <auditing-photo-header-summary></auditing-photo-header-summary>
        <photos-ranking-list-summary :chart-option="RankingListSummaryChartOptions"></photos-ranking-list-summary>
        <ranking-list></ranking-list>
        <photos-header-summary :time-range="'当天'"></photos-header-summary>
        <large-chart :height="'4rem'" :chart-option="photoIncreateChartOptions"></large-chart>
        <large-chart :chart-option="uploadPointChartOptions"></large-chart>
        <large-chart :chart-option="accumulativeTrendChartOptions"></large-chart>
        <large-chart :chart-option="noPhotosChartOptions"></large-chart>
    </div>
</template>
<script>
    import PhotosHeaderSummary from '../components/photos-header-summary.vue';
    import LargeChart from "../components/large-chart.vue";
    import RankingList from "../components/ranking-list.vue";
    import PhotosRankingListSummary from "../components/photos-ranking-list-summary.vue";
    import PhotographerHeaderSummary from "../components/photographer-header-summary.vue";
    import AuditingPhotoHeaderSummary from "../components/auditing-photo-header-summary.vue";
    import ExcellentPhotoHeaderSummary from "../components/excellent-photo-header-summary.vue";
    export default {
        components: {
            PhotosHeaderSummary,
            LargeChart,
            RankingList,
            PhotosRankingListSummary,
            PhotographerHeaderSummary,
            AuditingPhotoHeaderSummary,
            ExcellentPhotoHeaderSummary
        },
        data () {
            
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
            noPhotosChartOptions() {
                return {
                    title: {
                        text: "本月99个团未拍摄原因",
                        left: 'center',
                        textStyle: {
                            color: "#505050"
                        }
                    },
                    series: []
                }
            },
            RankingListSummaryChartOptions() {
                return {
                    series: []
                }
            }
        }
    }
</script>
<style lang="scss">
    @import "../common.scss";
    .photo-stat-photos-today {
        padding-top: $side_padding;
    }
</style>