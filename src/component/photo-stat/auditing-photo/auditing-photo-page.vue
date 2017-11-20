<template>
    <div class="statistics-photo-stat-auditing-photo-page">
        <div style="height: 5px;"></div>
        <auditing-photo-header-summary
        :photo-audit-counts="photoAuditCounts"
        :photo-audit-tour-counts="photoAuditTourCounts"
        ></auditing-photo-header-summary>
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
            AuditingPhotoHeaderSummary,
            RankingList
        },
        data() {
            return {
                photoAuditCounts: 0,
                photoAuditTourCounts: 0,
                rankingListData: {
                    title: [
                        {
                            text: '',
                            prop: 'index'
                        },
                        {
                            text: '审核员',
                            prop: 'reviewer'
                        },
                        {
                            text: '审核照片数',
                            prop: 'photoAuditCounts'
                        },
                        {
                            text: '审核团数',
                            prop: 'photoAuditTourCounts'
                        }
                    ],
                    data: [

                    ]
                }
            }
        },
        computed: {
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

                var url = '/report/photo/selectAuditPhotosTotal';
                var params = {
                    queryStartDate: queryTime.startDate,
                    queryEndDate: queryTime.endDate,
                };
                Request.getJson(url, params, function(res) {
                    console.log(url, ":::::", JSON.stringify(res.data));
                    that.photoAuditCounts = res.data.photoAuditCounts;
                    that.photoAuditTourCounts = res.data.photoAuditTourCounts;
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
                    var temp = [];
                    res.data.forEach((item, index) => {
                        temp.push({
                            index: index + 1,
                            reviewer: item.reviewer,
                            photoAuditCounts: item.photoAuditCounts,
                            photoAuditTourCounts: item.photoAuditTourCounts
                        })
                    });
                    that.rankingListData.data = temp;
                });
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

