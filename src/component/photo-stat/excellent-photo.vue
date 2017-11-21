<template>
    <div class="mui-inner-wrap statistics-photo-stat-excellent-photo">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" id="back"></a>
            <h1 class="mui-title">精品照片</h1>
        </header>
        <div class="mui-content">
            <excellent-photo-header-summary
            :chart-option="chicePhotoChartOptions"
            :chice-photo-counts="chicePhotoCounts"
            ></excellent-photo-header-summary>
            <div>
                <div class="ranking-list-title">精品照片评审人</div>
                <ranking-list :list-data="rankingListData"></ranking-list>
            </div>
            <large-chart :chart-option="boutiquePhotosPhotographerChartOption" v-if="photographerChartOptionShow" :height="photographerChartOptionHeight"></large-chart>
            <large-chart :chart-option="boutiquePhotosScenicRateChartOption"></large-chart>
        </div>
    </div>
</template>
<script>
import ExcellentPhotoHeaderSummary from "./components/excellent-photo-header-summary";
import RankingList from "./components/ranking-list";
import LargeChart from "./components/large-chart";
import Request from "./Request";

export default {
    name: "ExcellentPhoto",
    components: {
        ExcellentPhotoHeaderSummary,
        RankingList,
        LargeChart
    },
    data: function() {
        return {
            chicePhotoCounts: 0,
            chicePhotoChartOptions: {
                title: {
                    subtext: '精品照片占比',
                    left: 'center',
                    bottom: '0'
                },
                series: []
            },
            rankingListData: {
                title: [
                    {
                        text: '',
                        prop: 'index'
                    },
                    {
                        text: '评审人',
                        prop: 'reviewer'
                    },
                    {
                        text: '推荐张数',
                        prop: 'chicePhotoCounts'
                    },
                    {
                        text: '推荐张数占比',
                        prop: 'chicePhotoRate'
                    }
                ],
                data: []
            },
            photographerChartOptionHeight: 0,
            photographerChartOptionShow: false,
            boutiquePhotosPhotographerChartOption: {
                series: []
            },
            boutiquePhotosScenicRateChartOption: {
                series: []
            }
        };
    },
    computed: {
    },
    methods: {
        init() {
            this.selectBoutiquePhotosRate();
            this.selectBoutiquePhotosReviewers();
            this.selectBoutiquePhotosPhotographerRate();
            this.selectBoutiquePhotosScenicRate();
        },
        selectBoutiquePhotosRate() {
            var that = this;
            // 精品照片总数及占比
            var url = "/report/photo/selectBoutiquePhotosRate";
            var params = {
            };
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
                that.chicePhotoCounts = res.data.chicePhotoCounts;
                var chicePhotoRate = res.data.chicePhotoRate;
                var restChicePhotoRate = 100 - chicePhotoRate;
                that.chicePhotoChartOptions = {
                    title: {
                        subtext: '精品照片占比',
                        left: 'center',
                        fontSize: '12px',
                        bottom: '0'
                    },
                    grid: {
                        top: '0%'
                    },
                    series: [
                        {
                            type:'pie',
                            radius: ['50%', '70%'],
                            center: ['50%', '38%'],
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
                                    value: chicePhotoRate,
                                    name:'精品',
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
                                    }
                                },
                                {
                                    value: restChicePhotoRate,
                                    name:'非精品',
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
            })
        },
        selectBoutiquePhotosReviewers() {
            var that = this;
            // 精品照片评审人列表
            var url = "/report/photo/selectBoutiquePhotosReviewers";
            var params = {
            };
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
                var temp = [];
                res.data.forEach((item, index) => {
                    temp.push({
                        index: index + 1,
                        reviewer: item.reviewer,
                        chicePhotoCounts: item.chicePhotoCounts,
                        chicePhotoRate: -(-item.chicePhotoRate).toFixed(2) + "%"
                    })
                })
                that.rankingListData.data = temp;
            })
        },
        selectBoutiquePhotosPhotographerRate() {
            var that = this;
            var defaultChartOption = {
                title: {
                    text: `精品照片作者`,
                    left: 'center',
                    textStyle: {
                        color: "#505050"
                    }
                },
                grid: {
                    left: "15%",
                    bottom: '20%',
                    right: '10%'
                },
                yAxis: {
                    type: 'category',
                    data: []
                },
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        rotate: 30
                    },
                },
                series: [
                    {
                        type: 'bar',
                        barWidth: "30px",
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        data: []
                    }
                ]
            };
            // 精品照片摄影师排名
            var url = "/report/photo/selectBoutiquePhotosPhotographerRate";
            var params = {
                curPage: 1,
                pageSize: 10
            };
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
                res.data.forEach((item, index) => {
                    defaultChartOption.yAxis.data.push(item.photographerName);
                    defaultChartOption.series[0].data.push(item.chicePhotoCounts);
                });
                that.photographerChartOptionHeight = res.data.length * 40 + 120 + 'px';
                that.boutiquePhotosPhotographerChartOption = defaultChartOption;
                that.photographerChartOptionShow = true;
            });
        },
        selectBoutiquePhotosScenicRate() {
            var that = this;
            var defaultChartOption = {
                title : {
                    text: `精品照片景点占比`,
                    left: 'center',
                    textStyle: {
                        color: "#505050"
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: []
                },
                series : [
                    {
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            // {value:335, name:'直接访问'},
                            // {value:310, name:'邮件营销'},
                            // {value:234, name:'联盟广告'},
                            // {value:135, name:'视频广告'},
                            // {value:1548, name:'搜索引擎'}
                        ]
                    }
                ]
            }
            // 精品照片景点占比
            var url = "/report/photo/selectBoutiquePhotosScenicRate";
            var params = {
                curPage: 1,
                pageSize: 10
            };
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
                res.data.forEach((item, index) => {
                    defaultChartOption.legend.data.push(item.scenic);
                    defaultChartOption.series[0].data.push(
                        {
                            value: item.chicePhotoCounts,
                            name: item.scenic,
                            label: {
                                normal: {
                                    show: true,
                                    formatter: '{b}\n{c} ({d}%)'
                                }
                            }
                        }
                    )
                });
                that.boutiquePhotosScenicRateChartOption = defaultChartOption;
            });
        }
    },
    mounted: function() {
        var that = this;
        lf.ready(function() {
            that.init()
        });
    }
};
</script>
<style lang="scss">
.statistics-photo-stat-excellent-photo {
    padding-top: 5px;
    .ranking-list-title {
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 0.3rem;
        background: #fff;
    }
}
</style>

