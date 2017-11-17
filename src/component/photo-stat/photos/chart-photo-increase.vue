<template>
    <div class="chart-photo-increase">
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
                        text: "本周每日照片增长趋势",
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
    .chart-photo-increase {

    }
</style>

