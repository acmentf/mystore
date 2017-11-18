<template>
    <div class="statistics-photo-stat-auditing-photo-page">
        <auditing-photo-header-summary></auditing-photo-header-summary>
        <ranking-list :list-data="rankingListData"></ranking-list>
    </div>
</template>
<script>
    import AuditingPhotoHeaderSummary from "../components/auditing-photo-header-summary.vue";
    import RankingList from "../components/ranking-list.vue";
    import TimeRangeMixin from "../TimeRageMixin";
    import Request from "../Request";
    export default {
        mixins: [TimeRangeMixin],
        components: {
            AuditingPhotoHeaderSummary
        },
        computed: {
            rankingListData() {
                return {
                    
                }
            }
        },
        methods: {
            init() {
                this.selectAuditPhotosTotal();
                this.selectAuditPhotosList();
            },
            selectAuditPhotosTotal() {
                // 照片审核汇总
                var that = this;
                var queryTime = this.queryTime;

                var url = '/report/photo/selectPhotographerAverageCount';
                var params = {
                    queryStartDate: queryTime.startDate,
                    queryEndDate: queryTime.endDate,
                };
                Request.getJson(url, params, function(res) {
                    console.log(url, ":::::", JSON.stringify(res.data));
                })
            },
            selectAuditPhotosList() {
                // 照片审核列表
                var that = this;
                var queryTime = this.queryTime;

                var url = '/report/photo/selectAuditPhotosList';
                var params = {
                    queryStartDate: queryTime.startDate,
                    queryEndDate: queryTime.endDate,
                    curPage: 1,
                    pageSize: 10
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
    .statistics-photo-stat-auditing-photo-page {

    }
</style>

