<template>
    <div class="chart-photo-increase">
        <large-chart :chart-option="trendChartOption"></large-chart>
        <large-chart :chart-option="cumulativeTrendChartOption" v-if="timeRange == 'thisMonth'"></large-chart>
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
                trendChartOption: {
                    title: {
                        text: `${this.dateStr}每日照片增长趋势`,
                        left: 'center',
                        textStyle: {
                            color: "#505050"
                        }
                    },
                    series: []
                },
                cumulativeTrendChartOption: {
                    title: {
                        text: `${this.dateStr}每日照片累积增长趋势`,
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
                var defaultTrendChartOption = {
                    title: {
                        text: `${that.dateStr}每日照片增长趋势`,
                        left: 'center',
                        textStyle: {
                            color: "#505050"
                        }
                    },
                    dataZoom: [{
                        type: 'inside',
                    
                    }],
                    grid: {
                        left: '15%',
                        right: '0%'
                    },
                    yAxis: {
                        type: 'value',
                    },
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    series: [
                        {
                            type: 'bar',
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
                var defaultCumulativeTrendChartOption = {
                    title: {
                        text: `${that.dateStr}每日照片累积增长趋势`,
                        left: 'center',
                        textStyle: {
                            color: "#505050"
                        }
                    },
                    dataZoom: [{
                        startValue: 0,
                        end: 100,
                        type: 'inside',
                    }],
                    grid: {
                        right: '0%',
                        left: '20%'
                    },
                    yAxis: {
                        type: 'value',
                    },
                    xAxis: {
                        type: 'category',
                        data: []
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
                };
                var queryTime = this.queryTime;
                lf.nativeUI.showWaiting();
                // 照片按天统计
                var url = ' /report/photo/selectPhotoCumulativeCount';
                var params = {
                    queryStartDate: queryTime.startDate,
                    queryEndDate: queryTime.endDate,
                };
                Request.getJson(url, params, function(res) {
                    res.data.forEach((item, index) => {
                        var dateStr = item.dateStr.split("-")[2];
                        defaultTrendChartOption.xAxis.data.push(dateStr);
                        defaultTrendChartOption.series[0].data.push(item.photoCounts);
                        defaultCumulativeTrendChartOption.xAxis.data.push(dateStr);
                        defaultCumulativeTrendChartOption.series[0].data.push(item.cumulativeCounts);
                    });
                    that.trendChartOption = defaultTrendChartOption;
                    that.cumulativeTrendChartOption = defaultCumulativeTrendChartOption;
                });
            }
        },
        mounted() {
            var that = this;
            lf.ready(function() {
                that.init();
            })
        }
    }
</script>
<style lang="scss">
    .chart-photo-increase {

    }
</style>

