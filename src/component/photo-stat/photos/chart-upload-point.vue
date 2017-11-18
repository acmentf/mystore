<template>
    <div class="chart-upload-point">
        <large-chart :chart-option="chartOption" ></large-chart>
    </div>
</template>
<script>
    import LargeChart from "../components/large-chart.vue";
    import TimeRangeMixin from "../TimeRageMixin";
    import Request from "../Request";
    export default {
        mixins: [TimeRangeMixin],
        components: {
            LargeChart
        },
        data() {
            return {
                chartOption: {
                    title: {
                        text: `${this.dateStr}拍摄照片上传景点分布`,
                        left: 'center',
                        textStyle: {
                            color: "#505050"
                        }
                    },
                    series: []
                }
            }
        },
        computed: {
        },
        methods: {
            init() {
                var that = this;
                var defaultChartOption = {
                    title: {
                        text: `${that.dateStr}拍摄照片上传景点分布`,
                        left: 'center',
                        textStyle: {
                            color: "#505050"
                        }
                    },
                    grid: {
                        left: "30%",
                        bottom: '10%'
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
                            barMaxWidth: '30px',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                }
                            },
                            data: []
                        }
                    ]
                };

                var queryTime = this.queryTime;
                // 查询景点照片统计
                var url = "/report/photo/selectPlacePhotoCount";
                var params = {
                    queryStartDate: queryTime.startDate,
                    queryEndDate: queryTime.endDate,
                    curPage: 1,
                    pageSize: 10
                };
                Request.getJson(url, params, function(res) {
                    res.data.forEach((item, index) => {
                        var palce = (function(){
                            var result = "";
                            result = item.palce.length > 7 ? item.palce.slice(0, 6) + ' ...' : item.palce;
                            return result;  
                        }());
                        defaultChartOption.yAxis.data.push(palce);
                        defaultChartOption.series[0].data.push(item.photoCounts)
                    })
                    that.chartOption = defaultChartOption;
                });
            },
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
    .chart-upload-point {

    }
</style>

