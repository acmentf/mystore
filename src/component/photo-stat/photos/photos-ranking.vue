<template>
    <div>
        <photos-ranking-list-summary :chart-option="RankingListSummaryChartOptions"></photos-ranking-list-summary>
        <ranking-list :list-data="rankingListData"></ranking-list>
    </div>
</template>
<script>
    import PhotosRankingListSummary from "../components/photos-ranking-list-summary.vue";
    import RankingList from "../components/ranking-list.vue";
    export default {
        props: {
            startDate: {
                type: String,
                // required: true
            },
            endDate: {
                type: String,
                // required: true
            }
        },
        components: {
            PhotosRankingListSummary,
            RankingList,
        },
        computed: {
            RankingListSummaryChartOptions() {
                return {
                    series: []
                }
            },
            rankingListData() {
                return {

                }
            }
        }
    }
</script>
<style>
    .photos-ranking {

    }
</style>

