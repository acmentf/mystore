<template>
    <div class="person-completed-summary">
        <div class="summary-block">
            <div class="label-wrap">
                <div class="label">预期销售额完成率</div>
                <div class="num">{{item.amountComletionRate}}%</div>
            </div>
            <div class="detail-wrap">
                <div class="detail-column">
                    <div>预期销售额</div>
                    <div>{{item.expectAmount}}</div>
                </div>
                <div class="detail-column">
                    <div>计划销售额</div>
                    <div>{{item.planPreAmount}}</div>
                </div>
                <div class="detail-column">
                    <div>前置金额</div>
                    <div>{{item.prePrice}}</div>
                </div>
                <div class="detail-column">
                    <div>实销金额</div>
                    <div>{{item.appSales}}</div>
                </div>
            </div>
        </div>
        <div class="summary-block">
            <div class="label-wrap">
                <div class="label">流量完成率</div>
                <div class="num">{{item.peopleComletionRate}}%</div>
            </div>
            <div class="detail-wrap">
                <div class="detail-column">
                    <div>计划流量数</div>
                    <div>{{item.planPreNum}}</div>
                </div>
                <div class="detail-column">
                    <div>实际服务人数</div>
                    <div>{{item.serverPerNum}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "ExpansionCompletedSummary",
        props: ['item'],
        data: function() {
            return {
                age: 222,
                aa: 11
            }
        },
        computed: {
            afterV: function() {
                return this.age - this.aa; 
            }
        },
        methods: {
            itemTap: function() {
                this.$emit('detail-click');
                document.getElementById("message").innerHTML = 222;

            },
            valueChange: function() {
            }
        },
        mounted: function() {
        }
    }
</script>
<style lang="scss">
    .person-completed-summary {
        background: #fff;
        .summary-block {
            .label-wrap {
                display: flex;
                padding: 0 15px;
                &>div {
                    $height: 0.8rem;
                    font-size: 0.3rem;
                    flex: 1;
                    height: $height;
                    line-height: $height;
                }
                .lable {

                }
                .num {
                    text-align: right;
                }
            }
            .detail-wrap {
                display: flex;
                .detail-column {
                    background: #f9f8f8;
                    flex: 1;
                    font-size: 0.3rem;
                    
                    div {
                        $height: 0.7rem;
                        height: $height;
                        line-height: $height;
                        text-align: center;
                    }
                }
            }
        }
    }
</style>
