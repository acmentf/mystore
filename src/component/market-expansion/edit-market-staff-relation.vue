<template>
    <div class="mui-inner-wrap market-expansion-edit-market-staff-relation">
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
    export default {

    }
</script>
<style lang="scss">

</style>

