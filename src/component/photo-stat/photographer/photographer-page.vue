<template>
    <div class="statistics-photo-stat-photographer-page">
        <photographer-header-summary
            :photographer-average-upload-photo-count="photographerAverageUploadPhotoCount"
            :photographer-average-chice-photo-count="photographerAverageChicePhotoCount"
        ></photographer-header-summary>
        <div class='photo-grapher-page-table'>
            <div class="table-title">
                <div class="title">
                    <span class="text">摄影师排名</span><span class="subText"> - 上传张数</span>
                </div>
                <div class="operator" @click="changeSelectPhotographerUploadPhotoRank">
                    <span>...</span>
                </div>
            </div>
            <ranking-list :list-data="uploadPhotoRankingListData"></ranking-list>
        </div>
        <div class="photo-grapher-page-table">
            <div class="table-title">
                <div class="title">
                    <span class="text">摄影师排名</span><span class="subText"> - 精品张数</span>
                </div>
                <div class="operator" @click="changeSelectPhotographerChicePhotoRank">
                    <span>...</span>
                </div>
            </div>
            <ranking-list :list-data="chicePhotoRankingListData"></ranking-list>
        </div>
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
        data() {
            return {
                photographerAverageUploadPhotoCount: 0,
                photographerAverageChicePhotoCount: 0,
                // 摄影师上传照片排名
                selectPhotographerUploadPhotoRankLength: 10,
                // 摄影师精品照片排名
                selectPhotographerChicePhotoRankLength: 10,
                uploadPhotoRankingListData: {
                    title: [
                        {
                            text: '',
                            prop: 'index'
                        },
                        {
                            text: '摄影师',
                            prop: 'photographerName'
                        },
                        {
                            text: '照片数',
                            prop: 'photoCounts'
                        },
                        {
                            text: '服务团数',
                            prop: 'groupCounts'
                        }
                    ],
                    data: [

                    ]
                },
                chicePhotoRankingListData: {
                    title: [
                        {
                            text: '',
                            prop: 'index',
                        },
                        {
                            text: '摄影师',
                            prop: 'photographerName'
                        },
                        {
                            text: '照片数',
                            prop: 'chicePhotoCounts'
                        },
                        {
                            text: '精品率',
                            prop: 'chicePhotoRate'
                        }
                    ],
                    data: [

                    ]
                }
            }
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
                };
                Request.getJson(url, params, function(res) {
                    console.log(url, ":::::", JSON.stringify(res.data));
                    that.photographerAverageChicePhotoCount = -(-res.data.photographerAverageChicePhotoCount).toFixed(2);
                    that.photographerAverageUploadPhotoCount = -(-res.data.photographerAverageUploadPhotoCount).toFixed(2);
                })
            },
            changeSelectPhotographerUploadPhotoRank() {
                if(this.selectPhotographerUploadPhotoRankLength == 10) {
                    this.selectPhotographerUploadPhotoRankLength = 20;
                } else {
                    this.selectPhotographerUploadPhotoRankLength = 10;
                }
                this.selectPhotographerUploadPhotoRank();
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
                    pageSize: that.selectPhotographerUploadPhotoRankLength,
                };
                Request.getJson(url, params, function(res) {
                    console.log(url, ":::::", JSON.stringify(res.data));
                    var temp = [];
                    res.data.forEach((item, index) => {
                        temp.push(
                            {
                                index: index + 1,
                                photographerName: item.photographerName,
                                photoCounts: item.photoCounts,
                                groupCounts: item.groupCounts
                            }
                        )
                    });
                    that.uploadPhotoRankingListData.data = temp;
                })
            },
            changeSelectPhotographerChicePhotoRank() {
                if(this.selectPhotographerChicePhotoRankLength == 10) {
                    this.selectPhotographerChicePhotoRankLength == 20;
                } else {
                    this.selectPhotographerChicePhotoRankLength = 10;
                }
                this.selectPhotographerChicePhotoRank();
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
                    pageSize: that.selectPhotographerChicePhotoRankLength,
                };
                Request.getJson(url, params, function(res) {
                    console.log(url, ":::::", JSON.stringify(res.data));
                    var temp = [];
                    res.data.forEach((item, index) => {
                        temp.push({
                            index: index + 1,
                            photographerName: item.photographerName,
                            chicePhotoCounts: item.chicePhotoCounts,
                            chicePhotoRate: -(-item.chicePhotoRate).toFixed(2) + "%"
                        })
                    })
                    that.chicePhotoRankingListData.data = temp;
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
        padding-top: 5px;
        .photo-grapher-page-table {
            $height: 40px;
            background: #fff;
            .table-title {
                height: $height;
                line-height: $height;;
                display: flex;
                position: relative;
                .title {
                    flex: 1;
                    text-align: center;
                    .text {
                        font-size: 0.3rem;
                    }
                    .subText {
                        color: #888;
                    }
                }
                .operator {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 1rem;
                    height: $height;
                    line-height: $height;
                    text-align: center;
                    span {

                    }
                }
            }
        }
    }
</style>

