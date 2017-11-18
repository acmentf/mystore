<template>
    <div class="statistics-photo-stat-photographer-page">
        <photographer-header-summary></photographer-header-summary>
        <ranking-list :list-data="rankingListData"></ranking-list>
        <ranking-list :list-data="rankingListData"></ranking-list>
    </div>
</template>
<script>
    import PhotographerHeaderSummary from "../components/photographer-header-summary.vue";
    import RankingList from "../components/ranking-list.vue";
    import TimeRangeMixin from "../TimeRageMixin";
    import Request from "../Request";
    export default {
        mixins: [TimeRangeMixin],
        components: {
            PhotographerHeaderSummary,
            RankingList
        },
        computed: {
            rankingListData() {

            }
        },
        methods: {
            init() {
                this.selectPhotographerAverageCount();
                this.selectPhotographerUploadPhotoRank();
                this.selectPhotographerChicePhotoRank();
            },
            selectPhotographerAverageCount() {
                // 统计摄影师人均上传
                var that = this;
                var queryTime = this.queryTime;

                var url = '/report/photo/selectPhotographerAverageCount';
                var params = {
                    queryStartDate: queryTime.startDate,
                    queryEndDate: queryTime.endDate,
                }
                Request.getJson(url, params, function(res) {
                    console.log(url, ":::::", JSON.stringify(res.data));
                })
            },
            selectPhotographerUploadPhotoRank() {
                // 摄影师上传照片排名
                var that = this;
                var queryTime = this.queryTime;

                var url = '/report/photo/selectPhotographerUploadPhotoRank';
                var params = {
                    queryStartDate: queryTime.startDate,
                    queryEndDate: queryTime.endDate,
                    curPage: 1,
                    pageSize: 20,
                };
                Request.getJson(url, params, function(res) {
                    console.log(url, ":::::", JSON.stringify(res.data));
                })
            },
            selectPhotographerChicePhotoRank() {
                // 摄影师精品照片排名
                var that = this;
                var queryTime = this.queryTime;

                var url = '/report/photo/selectPhotographerChicePhotoRank';
                var params = {
                    queryStartDate: queryTime.startDate,
                    queryEndDate: queryTime.endDate,
                    curPage: 1,
                    pageSize: 20,
                };
                Request.getJson(url, params, function(res) {
                    console.log(url, ":::::", JSON.stringify(res.data));
                })
            }
        },
        mounted() {
            var that = this;
            lf.ready(function() {
                that.init()
            });
        }
    }
</script>
<style lang="scss">
    .statistics-photo-stat-photographer-page {

    }
</style>

