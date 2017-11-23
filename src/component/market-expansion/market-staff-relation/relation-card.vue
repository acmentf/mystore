<template>
    <div class="market-staff-relation-relation-card">
        <div class="mui-card">
            <div class="mui-card-header mui-card-media">旅行社：<span v-text="item.purchaser"></span></div>
            <div class="mui-card-content">
                <div>
                    <div class="basic">
                        <div class="block">
                            <div class="mui-row">
                                <div class="title">产品名称: <span v-text="item.createTime"></span></div>
                            </div>
                            <div class="mui-row">
                                <div class="title">渠道专员: <span v-text="item.personCount"></span></div>
                            </div>
                            <div class="mui-row">
                                <div class="title">有效期: <span v-text="item.tourGuide"></span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            item: {
                type: Object,
                required: true
            }
        }
    }
</script>
<style lang="scss">
.market-staff-relation-relation-card {
    .mui-card-header{
        background: #3eb392;
    }

    .mui-card-content .block{
        margin: 0 15px;
        padding-bottom: 10px;
    }
    .mui-card-content .block, .count{
        padding: 10px 0 8px 0;
    }
    .mui-card-content .block > .mui-row{
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
    }
    .mui-card-content .block .title{
        flex: 1;
    }
    .mui-card-content .text{
        padding: 5px 0;
        text-align: center;
    }
    .mui-card-content .num{
        color:#3eb392;
        font-size: 16px;
    }

    .mui-card{
        cursor: pointer;
    }
}
</style>

