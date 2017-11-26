<template>
    <div class="market-staff-relation-relation-card">
        <div class="mui-card" @tap="editRelation">
            <div class="mui-card-header mui-card-media">旅行社：<span v-text="item.purchaser"></span></div>
            <div class="mui-card-content">
                <div>
                    <div class="basic">
                        <div class="block">
                            <div class="mui-row">
                                <div class="title">产品名称： <span v-text="item.p_name"></span></div>
                            </div>
                            <div class="mui-row">
                                <div class="title">渠道专员： <span v-text="item.user_name ? item.user_name : '未关联'"></span></div>
                            </div>
                            <div class="mui-row">
                                <div class="title">有效期：<span>{{item.begin_date|timeFormatter}}</span> - <span>{{item.end_date|timeFormatter}}</span></div>
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
        },
        filters: {
            timeFormatter(val) {
                if(val) {
                    return new Date(val).format('yyyy-MM-dd');
                }
                return '';
            }
        },
        methods: {
            editRelation() {
                // 跳转到 渠道关系列表
                lf.window.openWindow('edit-market-staff-relation.html','./edit-market-staff-relation.html',{},{
                    item: JSON.stringify(this.item)
                })
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

