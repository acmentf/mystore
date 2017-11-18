<template>
    <div class="mui-inner-wrap statistics-photo-stat-excellent-photo">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" id="back"></a>
            <h1 class="mui-title">区域月度销售额预期</h1>
        </header>
        <div class="mui-content">
            <excellent-photo-header-summary></excellent-photo-header-summary>
            <ranking-list :list-data="rankingListData"></ranking-list>
            <largechart :chart-option="chartOptions"></largechart>
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
                    text: `精品照片作者`,
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
            this.selectBoutiquePhotosRate();
            this.selectBoutiquePhotosReviewers();
            this.selectBoutiquePhotosPhotographerRate();
            this.selectBoutiquePhotosScenicRate();
        },
        selectBoutiquePhotosRate() {
            // 精品照片总数及占比
            var url = "/report/photo/selectBoutiquePhotosRate";
            var params = {
            };
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
            })
        },
        selectBoutiquePhotosReviewers() {
            // 精品照片评审人列表
            var url = "/report/photo/selectBoutiquePhotosReviewers";
            var params = {
            };
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
            })
        },
        selectBoutiquePhotosPhotographerRate() {
            // 精品照片摄影师排名
            var url = "/report/photo/selectBoutiquePhotosPhotographerRate";
            var params = {
                curPage: 1,
                pageSize: 10
            };
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
            })
        },
        selectBoutiquePhotosScenicRate() {
            // 精品照片景点占比
            var url = "/report/photo/selectBoutiquePhotosScenicRate";
            var params = {
                curPage: 1,
                pageSize: 10
            };
            Request.getJson(url, params, function(res) {
                console.log(url, ":::::", JSON.stringify(res.data));
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
}
</style>

