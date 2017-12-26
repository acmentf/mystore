<template>
    <div class="linkage-picker-wrapper" v-show="visible">
        <div class="linkage-picker-content">
            <div class="linkage-picker-header">
                <h3 class="title">{{title}}</h3>
                <span class="cancel" v-show="showCancel" v-tap="{ methods: handleCancel }">取消</span>
                <span class="confirm" v-show="showConfirm" v-tap="{ methods: handleConfirm }">确定</span>
            </div>
            <div class="linkage-picker-chosen">
                <ul>
                    <li v-for="(item, index) in chosen" v-tap="{ methods: handleChosen, index: index }" :class="{ current: point === index }">
                        {{item[keys.label]}}
                    </li>
                </ul>
            </div>
            <div class="linkage-picker-list">
                <ul>
                    <li v-for="(item, index) in items[point]" v-tap="{ methods: handleItem, value: item }">
                        {{item[keys.label]}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="linkage-picker-mask"></div>
    </div>
</template>

<script>
export default {
    name: 'linkagePicker',
    props: {
        keys: {
            type: Object,
            default: {
                key: 'id',
                pkey: 'pid',
                label: 'label'
            }
        },
        title: {
            type: String
        },
        visible: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default: [],
            required: true
        },
        showCancel: {
            type: Boolean,
            default: true
        },
        showConfirm: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            point: 0,
            tips: null,
            items: null,
            chosen: []
        }
    },
    methods: {
        handleCancel() {
            this.clear()
            this.$emit('update:visible', false)
        },
        handleConfirm() {
            this.chosen.pop()
            this.$emit('change', this.chosen, this.handleCancel)
        },
        handleItem(params) {
            this.chosen[this.point] = params.value
            this.chosen.splice(this.point + 1)
            
            this.chosen.push(this.tips)

            if (this.items.length - 1 === this.point) {
                this.handleConfirm()
            } else {
                this.point++
                this.items[this.point] = this.filterItem(params)
            }
        },
        handleChosen(params) {
            this.point = params.index
        },
        filterItem(params) {
            const preId = params.value[this.keys.key]

            const filterArr = this.data[this.point].filter((item) => {
                return item[this.keys.pkey] === preId
            })
            
            return filterArr.length ? filterArr : this.data[this.point]
        },
        clear() {
            this.visible = false
            this.point = 0
            this.chosen = []
        }
    },
    watch: {
        visible(val) {
            if (!val) return
            this.chosen.push(this.tips)
        }
    },
    created() {
        this.tips = {
            [this.keys.label]: '请选择'
        }
        this.items = JSON.parse(JSON.stringify(this.data))
    }
}
</script>

<style lang="scss">
    $mainColor: #3CB493;
    $maskColor: #000;

    $mainHeight: 400px;
    $headerHeight: 40px;
    $chosenHeight: 35px;
    
    $maskAlpha: 0.7;

    .linkage-picker-wrapper {
        font-size: 14px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;

        .linkage-picker-content {
            width: 100%;
            height: $mainHeight;
            position: absolute;
            z-index: 999;
            bottom: 0;

            .linkage-picker-header {
                position: relative;
                color: #fff;
                height: $headerHeight;
                background: $mainColor;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 20px;
                border-radius: 4px 4px 0 0;

                .title {
                    margin: 0;
                    padding: 0;
                    text-align: center;
                    font-size: 16px;
                    font-weight: normal;
                }

                .cancel {
                    position: absolute;
                    left: 10px;
                    font-size: 12px;
                    color: #71dbbc;
                    border: 1px solid #1c8a6b;
                    background: #209473;
                    padding: 2px 10px;
                    border-radius: 6px;
                }
                
                .confirm {
                    position: absolute;
                    right: 10px;
                    font-size: 12px;
                    color: #71dbbc;
                    border: 1px solid #1c8a6b;
                    background: #209473;
                    padding: 2px 10px;
                    border-radius: 6px;
                }
            }

            .linkage-picker-chosen {
                height: $chosenHeight;
                background: #f5f5f5;
                border-bottom: 1px solid #eee;

                & > ul {
                    padding: 0;
                    margin: 0;
                    display: flex;

                    & > li {
                        color: #666;
                        line-height: $chosenHeight;
                        margin: 0 10px;
                        list-style-type: none;

                        &.current {
                            color: $mainColor;
                            position: relative;

                            &::after {
                                content: '';
                                position: absolute;
                                height: 2px;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background: $mainColor;
                            }
                        }
                    }
                }
            }

            .linkage-picker-list {
                background: #fff;
                position: absolute;
                overflow-y: auto;
                top: $headerHeight + $chosenHeight;
                left: 0px;
                right: 0px;
                bottom: 0;

                & > ul {
                    padding: 0;
                    margin: 10px 0;

                    & > li {
                        color: #666;
                        line-height: 36px;
                        list-style-type: none;
                        padding: 0 10px;
                    }
                }
            }
        }

        .linkage-picker-mask {
            background: rgba($maskColor, $maskAlpha);
            position: absolute;
            z-index: 99;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>
