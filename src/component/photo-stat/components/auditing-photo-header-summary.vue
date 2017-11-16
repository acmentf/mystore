<template>
    <div class="auditing-photo-header-summary">
        <div class="blank-div"></div>
        <div>
            <div class="count">205</div>
            <div class="tip">
                <div>审片数</div>
            </div>
        </div>
        <div>
            <div class="count">2333</div>
            <div class="tip">
                <div>审片团数</div>
            </div>
        </div>
        <div class="blank-div"></div>
    </div>
</template>
<script>
    export default {

    }
</script>
<style lang="scss">
@import "../common.scss";
.auditing-photo-header-summary {
    display: flex;
    height: 1.6rem;
    background: #fff;
    margin-bottom: $margin-bottom;
    &>div {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 10px 0;
        &>div {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .count {
            flex: 1;
            color: $summary_count_color;
            font-size: $summary_count_font_size;
        }
        .tip {
            flex: 0.8;
            font-size: $summary_tip_font_size;
            color: $summary_tip_color;
        }
    }
    .blank-div {
        flex: 0.4;
    }
}
</style>
