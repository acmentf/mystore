<template>
    <div>
        <photos-ranking-list-summary
            @upload-tap="uploadTap"
            @pending-upload-tap="pendingUploadTap"
            :date-str="dateStr"
            :active-tab="activeTab"
            :photographer-upload-trips="photographerUploadTrips" 
            :photographer-pending-upload-trips="photographerPendingUploadTrips"
            :chart-option="rankingListSummaryChartOptions"></photos-ranking-list-summary>
        <ranking-list :list-data="uploadRankingList" v-show="activeTab == 'uploadTap'"></ranking-list>
        <ranking-list :list-data="pendingUploadRankingList" v-show="activeTab == 'pendingUploadTap'"></ranking-list>
    </div>
</template>
<script>
    import PhotosRankingListSummary from "../components/photos-ranking-list-summary.vue";
    import RankingList from "../components/ranking-list.vue";
    import TimeRangeMixin from "../TimeRageMixin";
    import Request from "../Request";
    export default {
        mixins: [TimeRangeMixin],
        components: {
            PhotosRankingListSummary,
            RankingList,
        },
        data() {
            return {
                photographerUploadTrips: 0,
                photographerPendingUploadTrips: 0,
                rankingListSummaryChartOptions: {
                    series: []
                },
                activeTab: 'uploadTap',
                uploadRankingList: {
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
                            text: '昨日拍摄张数',
                            prop: 'shotPhotos'
                        },
                        {
                            text: '昨日服务团数',
                            prop: 'shotGroups'
                        },
                        {
                            text: '照片占比',
                            prop: 'shotPhotoRate'
                        }
                    ],
                    data: [

                    ]
                },
                pendingUploadRankingList: {
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
                            text: '未上传行程总数',
                            prop: 'shotPhotos'
                        },
                        {
                            text: '照片占比',
                            prop: 'shotPhotoRate'
                        }
                    ],
                    data: [
                        
                    ]
                }
            }
        },
        computed: {
            rankingListData() {
                return {

                }
            },
        },
        methods: {
            init() {
                this.selectPhotographerTripShotCount();
                this.selectPhotographerUploadPersonsList();
                this.selectPhotographerPendingUploadTripList();  
            },
            uploadTap () {
                this.activeTab = 'uploadTap';
            },
            pendingUploadTap () {
                this.activeTab = 'pendingUploadTap';
            },
            selectPhotographerTripShotCount() {
                // 获取摄影师行程拍摄统计
                var that = this;
                var queryTime = this.queryTime;

                lf.nativeUI.showWaiting();
                var url = '/report/photo/selectPhotographerTripShotCount';

                var params = {
                    queryStartDate: queryTime.startDate,
                    queryEndDate: queryTime.endDate,
                };
                Request.getJson(url, params, function(res) {
                    console.log(url, ":::::", JSON.stringify(res.data));
                    that.photographerUploadTrips = res.data.photographerUploadTrips;
                    that.photographerPendingUploadTrips = res.data.photographerPendingUploadTrips;
                    that.rankingListSummaryChartOptions = {
                        series: [
                            {
                                type:'pie',
                                radius: ['70%', '90%'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: false,
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data:[
                                    {
                                        value: res.data.photographerUploadTrips,
                                        name:'已上传',
                                        itemStyle: {
                                            normal: {
                                                color: "#3cb493"
                                            }
                                        },
                                        label: {
                                            normal: {
                                                show: true,
                                                position: 'center',
                                                formatter: '{b}\n{d}%'
                                            }
                                        },
                                    },
                                    {
                                        value: res.data.photographerPendingUploadTrips,
                                        name:'未上传',
                                        itemStyle: {
                                            normal: {
                                                color: "#d0d0d0"
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                });
            },
            selectPhotographerUploadPersonsList() {
                // 上传过照片摄影师列表
                var that = this;
                var queryTime = this.queryTime;

                lf.nativeUI.showWaiting();
                var url = "/report/photo/selectPhotographerUploadPersonsList";
                var params = {
                    queryStartDate: queryTime.startDate,
                    queryEndDate: queryTime.endDate,
                    curPage: 1,
                    pageSize: 10
                };
                Request.getJson(url, params, function(res) {
                    console.log(url, ":::::", JSON.stringify(res.data));
                    var temp = []
                    res.data.forEach(function(item, index) {
                        temp.push({
                            index: index + 1,
                            photographerName: item.photographerName,
                            shotPhotos: item.shotPhotos,
                            shotGroups: item.shotGroups,
                            shotPhotoRate: -(-item.shotPhotoRate).toFixed(2) + '%'
                        })
                    });
                    that.uploadRankingList.data = temp;
                });
            },
            selectPhotographerPendingUploadTripList() {
                // 未上传过照片摄影师行程列表
                var that = this;
                var queryTime = this.queryTime;

                lf.nativeUI.showWaiting();
                var url = "/report/photo/selectPhotographerPendingUploadTripList";
                var params = {
                    queryStartDate: queryTime.startDate,
                    queryEndDate: queryTime.endDate,
                    curPage: 1,
                    pageSize: 10
                };
                Request.getJson(url, params, function(res) {
                    console.log(url, ":::::", JSON.stringify(res.data));
                    var temp = []
                    res.data.forEach(function(item, index) {
                        temp.push({
                            index: index + 1,
                            photographerName: item.photographerName,
                            shotPhotos: item.shotPhotos,
                            shotPhotoRate: -(-item.shotPhotoRate).toFixed(2) + '%'
                        })
                    });
                    that.pendingUploadRankingList.data = temp;
                })
            }
        },
        mounted() {
            var that = this;
            lf.ready(function() {
                that.init()
            })
        }
    }
</script>
<style>
    .photos-ranking {

    }
</style>

