import TimeRange from "./TimeRange";

export  default{
    props: {
        dateStr: {
            type: String,
            required: true
        },
        timeRange: {
            type: String,
            required: true,
            default: 'today'
        }
    },
    computed: {
        queryTime() {
            return TimeRange[this.timeRange]()
        }
    }
}