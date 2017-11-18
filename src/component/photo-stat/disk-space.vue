<template>
    <div class="mui-inner-wrap statistics-photo-stat-disk-space">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" id="back"></a>
            <h1 class="mui-title">照片空间统计</h1>
        </header>
        <div class="mui-content">
            <largechart :chart-option="chartOptions"></largechart>
            <largechart :chart-option="chartOptions"></largechart>
            <largechart :chart-option="chartOptions"></largechart>
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
        return {};
    },
    computed: {
        rankingListData() {
            return {

            }
        },
        chartOptions() {
            return {
                title: {
                    text: `照片空间统计`,
                    left: 'center',
                    textStyle: {
                        color: "#505050"
                    }
                },
                series: []
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
            // 空间统计汇总
            var url = "/report/photo/selectPhotosSpaceSize";
            var params = {
            };
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
            })
        },
        selectPhotosSpaceEveryday() {
            // 照片空间每日分布
            var url = "/report/photo/selectPhotosSpaceEveryday";
            var params = {
            };
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
            })
        },
        selectPhotosSpaceCumulative() {
            // 照片空间累计增长
            var url = "/report/photo/selectPhotosSpaceCumulative";
            var params = {
                curPage: 1,
                pageSize: 10
            };
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
            })
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
}
</style>

