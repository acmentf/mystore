<template>
    <div class="chart-upload-point">
        <large-chart :chart-option="chartOption"></large-chart>
    </div>
</template>
<script>
    import LargeChart from "../components/large-chart.vue";
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
            LargeChart
        },
        computed: {
            chartOption() {
                return {
                    title: {
                        text: "本周拍摄照片上传景点分布",
                        left: 'center',
                        textStyle: {
                            color: "#505050"
                        }
                    },
                    series: []
                }
            }
        }
    }
</script>
<style lang="scss">
    .chart-upload-point {

    }
</style>

