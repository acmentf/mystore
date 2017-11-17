<template>
    <div class="ranking-list">
        <div class="table-header">
            <div v-for="(item, key) in tableData.title" :key="key">{{item.text}}</div>
        </div>
        <div class="table-body">
            <div class="row" v-for="(itemRow, rowKey) in tableBodyData" :key="rowKey">
                <div class="cell" v-for="(itemCell, cellKey) in itemRow" :key="cellKey+''+rowKey">
                    {{itemCell}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "Rankinglist",
        props: {
            tableData: {
                type: Object
            }
        },
        data() {
            return {
            }
        },
        computed: {
            tableHeader() {
                var result = [];
                if(this.tableData) {
                    return this.tableData.title;
                } else {
                    console.warn("ranking-list tableData.length 为 0");
                }
            },
            tableBodyData() {
                var result = [];
                if(this.tableData) {
                    var tableData = this.tableData;
                    var propArr = [];
                    for(let i = 0; i < tableData.title.length; i++) {
                        propArr.push(tableData.title[i].prop);
                    }
                    for(let i = 0; i < tableData.data.length; i++) {
                        // 将 一维数组 转为 二维数组
                        var item = tableData.data[i];
                        var temp = [];
                        for(let j = 0; j < propArr.length; j++) {
                            var prop = propArr[j];
                            temp.push(item[prop]);
                        }
                        result.push(temp);
                    }
                    return result;
                } else {
                    console.warn("ranking-list tableData.length 为 0");
                }
            }
        }
    }
</script>
<style lang="scss">
    @import "../common.scss";
    .ranking-list {
        $first_column_width: 0.3;
        padding: $side_padding;
        padding-top: 0;
        background: #fff;
        margin-bottom: $margin_bottom;
        .table-header {
            div {
            }
        }
        .table-body .row, .table-header {
            display: flex;
            div {
                font-size: 0.25rem;
                $cell_height: 0.8rem;
                height: $cell_height;
                line-height: $cell_height;
                flex: 1;
                text-align: center;
                border-bottom: 1px solid #dedede;
                &:first-child {
                    flex: $first_column_width;
                }
            }
        }
    }
</style>

