<template>
    <div class="mui-inner-wrap statistics-photo-stat-disk-space">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" id="back"></a>
            <h1 class="mui-title">照片空间统计</h1>
        </header>
        <div class="mui-content">
            <large-chart :chart-option="photosSpaceSizeChartOption"></large-chart>
            <large-chart :chart-option="photosSpaceEverydayChartOption"></large-chart>
            <large-chart :chart-option="photosSpaceCumulativeChartOption"></large-chart>
        </div>
    </div>
</template>
<script>
import LargeChart from "./components/large-chart";
import Request from "./Request";

export default {
    name: "ExcellentPhoto",
    components: {
        LargeChart
    },
    data: function() {
        return {
            photosSpaceSizeChartOption: {
                series: []
            },
            photosSpaceEverydayChartOption: {
                series: []
            },
            photosSpaceCumulativeChartOption: {
                series: []
            }
        };
    },
    computed: {
        rankingListData() {
            return {

            }
        }
    },
    methods: {
        init() {
            this.selectPhotosSpaceSize();
            this.selectPhotosSpaceEveryday();
            this.selectPhotosSpaceCumulative();
        },
        selectPhotosSpaceSize() {
            var that = this;
            // 空间统计汇总
            var url = "/report/photo/selectPhotosSpaceSize";
            var params = {
            };
            var defaultChartOption = {
                title: {
                    text: '',
                    textStyle: {
                        fontSize: 36
                    },
                    left: 'center',
                    subtext: '照片空间大小'
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter: '{a} {b}GB {c}%'
                },
                grid: {
                    top: "0%"
                },
                series : [
                    {
                        type: 'pie',
                        radius : '60%',
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
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
                var photoCapacity = (res.data.photoCapacity/1024/1024/1024).toFixed(2);
                var basePhotoCapacity = (res.data.basePhotoCapacity/1024/1024/1024).toFixed(2);
                defaultChartOption.title.text = ((res.data.photoCapacity + res.data.basePhotoCapacity)/1024/1024/1024).toFixed(2) + "GB";
                defaultChartOption.series[0].data = [
                    {
                        value: photoCapacity,
                        name: "原图",
                        label: {
                            normal: {
                                show: true,
                                formatter: '{b}\n{c}GB\n{d}%'
                            }
                        }
                    },
                    {
                        value: basePhotoCapacity,
                        selected: true,
                        name: "压缩图",
                        label: {
                            normal: {
                                show: true,
                                formatter: '{b}\n{c}GB\n{d}%'
                            }
                        }
                    }
                ];
                that.photosSpaceSizeChartOption = defaultChartOption;
            })
        },
        selectPhotosSpaceEveryday() {
            var that = this;

            var defaultChartOption = {
                    title: {
                        text: `照片空间每日分布(GB)`,
                        left: 'center',
                        textStyle: {
                            color: "#505050"
                        }
                    },
                    dataZoom: [{
                        type: 'inside',
                        end: 100
                    }],
                    grid: {
                        left: '15%',
                        right: '10%',
                    },
                    yAxis: {
                        type: "value"
                    },
                    xAxis: {
                        type: 'category',
                        data: [],
                        axisLabel: {
                            rotate: 30
                        },
                    },
                    series: [
                        {
                            type: 'bar',
                            barMaxWidth: '40px',
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
            // 照片空间每日分布
            var url = "/report/photo/selectPhotosSpaceEveryday";
            var params = {
            };
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
                res.data.forEach(function(item, index) {
                    var photoCapacity = (item.photoCapacity/1024/1024/1024).toFixed(2);
                    defaultChartOption.series[0].data.push(photoCapacity);
                    defaultChartOption.xAxis.data.push(item.dateStr);
                });
                defaultChartOption.dataZoom[0].startValue = (res.data.length - 7);
                that.photosSpaceEverydayChartOption = defaultChartOption;
            });
        },
        selectPhotosSpaceCumulative() {
            var that = this;

            var defaultChartOption = {
                title: {
                    text: `照片空间累计增长趋势(GB)`,
                    left: 'center',
                    textStyle: {
                        color: "#505050"
                    }
                },
                dataZoom: [{
                    type: 'inside',
                    end: 100,
                }],
                grid: {
                    right: '10%',
                    left: '15%'
                },
                yAxis: {
                    type: 'value',
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLabel: {
                        rotate: 30
                    },
                },
                series: [
                    {
                        type: 'line',
                        label: {
                            normal: {
                                show: true,
                            }
                        },
                        data: []
                    }
                ]
            }
            // 照片空间累计增长
            var url = "/report/photo/selectPhotosSpaceCumulative";
            var params = {
                curPage: 1,
                pageSize: 10
            };
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
                res.data.forEach((item, index) => {
                    var photoCapacity = (item.photoCapacity/1024/1024/1024).toFixed(2);
                    defaultChartOption.xAxis.data.push(item.dateStr);
                    defaultChartOption.series[0].data.push(photoCapacity);
                });
                defaultChartOption.dataZoom[0].startValue = (res.data.length - 7);
                that.photosSpaceCumulativeChartOption = defaultChartOption;
            });
        },
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
.statistics-photo-stat-disk-space {
    padding-top: 5px;
    .header-summary {
        background: #fff;
        height: 1.6rem;
        display: flex;
        flex-direction: column;
        .count {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            font-size: 0.6rem;
        }
        .tip {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0.6;
            font-size: 0.28rem;
            color: #888;
        }
    }
}
</style>

