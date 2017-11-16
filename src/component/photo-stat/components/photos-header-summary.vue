<template>
    <div class="photos-header-summary">
        <div class="top">
            <div class="block">
                <div class="count">2500</div>
                <div class="tip">
                    <div>{{timeRange}}上传照片数(含历史照片)</div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="block">
                <div class="count">200</div>
                <div class="tip">
                    <div>{{timeRange}}拍摄</div>
                    <div>上传团数</div>
                </div>
            </div>
            <div class="block">
                <div class="count">200</div>
                <div class="tip">
                    <div>{{timeRange}}拍摄</div>
                    <div>待传团数</div>
                </div>
            </div>
            <div class="block">
                <div class="count">200</div>
                <div class="tip">
                    <div>{{timeRange}}拍摄人数</div>
                </div>
            </div>
            <div class="block">
                <div class="count">200</div>
                <div class="tip">
                    <div>{{timeRange}}客均张数</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["data", "timeRange"],
        data() {

        }
    }
</script>
<style lang="scss">
    @import "../common.scss";
    .photos-header-summary {
        background: #fff;
        padding-top: $side_padding;
        padding-bottom: $side_padding;
        margin-bottom: $margin_bottom;
        .top {
            height: 1.6rem;
            display: flex;
            .count {
                font-size: 0.7rem;
            }
        }
        .bottom {
            display: flex;
            .count {
                font-size: 0.6rem;
            }
            .tip {
            }
        }
        .block {
            display: flex;
            flex-direction: column;
            flex: 1;
            text-align: center;
            .count {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1.5;
                color: $summary_count_color;
                font-size: $summary_count_font_size;
            }
            .tip {
                display: flex;
                flex: 1;
                align-items: center;
                flex-direction: column;
                font-size: $summary_tip_font_size;
                color: $summary_tip_color;
                div {
                    height: 0.5rem;
                    display: flex;
                    flex: 1;
                    align-items: center;
                    justify-content: center;
                    // height: 1rem;
                    // line-height: 1rem;
                }
            }
        }
    }
</style>

