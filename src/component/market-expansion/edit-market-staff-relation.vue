<template>
    <div class="mui-inner-wrap market-expansion-edit-market-staff-relation">
        <header class="mui-bar">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" id="back"></a>
            <h1 class="mui-title">编辑渠道关系</h1>
            <div class="save-btn" @tap = "save">保存</div>
        </header>
        <div class="mui-content">
            <form class="mui-input-group">
                <div class="mui-input-row">
                    <label class="">旅行社：</label>
                    <input type="number" class="" readonly placeholder="请输入旅行社">
                </div>
                <div class="mui-input-row">
                    <label class="">产品名称：</label>
                    <input type="number" class="" readonly placeholder="请输入产品名称">
                </div>
                <div class="mui-input-row"  id="areaSelector">
                    <label class=""><span class="required">* </span>大区：</label>
                    <input type="text" readonly placeholder="请选择大区">
                </div>
                <div class="mui-input-row"  id="citySelector">
                    <label class=""><span class="required">* </span>城市：</label>
                    <input type="text" placeholder="请选择城市">
                </div>
                <div class="mui-input-row" id="staffSelector">
                    <label class=""><span class="required">* </span>渠道专员：</label>
                    <input type="text" placeholder="请选择渠道专员">
                </div>
                <div class="mui-input-row" id="startDateSelector">
                    <label class=""><span class="required">* </span>有效起始时间：</label>
                    <input type="text" placeholder="请设置有效起始时间">
                </div>
                <div class="mui-input-row" id="endDateSelector">
                    <label class=""><span class="required">* </span>有效结束时间：</label>
                    <input type="text" placeholder="请设置有效结束时间">
                </div>
            </form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            areaId: '',
            cityId: '',
            staffId: '',
            startDate: '',
            endDate: '',
        }
    },
    methods: {
        getAreaList() {

        },
        getCityList() {

        },
        getStaffList() {

        },
        save() {
            // lf.getJSONWithLoading()
        }
    },
    mounted() {
        let that = this;
        lf.ready(() => {
            let dtPicker = new mui.DtPicker({
            });
            mui('body').on('tap', '#startDateSelector', function(){
                // 起始日期选择
                let value = that.startDate ? new Date(that.startDate).format('yyyy-MM-dd') : new Date().format('yyyy-MM-dd');

                let options = {
                    type: 'date',
                    value: value,
                };
                if(that.endDate) {
                    options.endDate = new Date(that.endDate);
                }
                dtPicker.init(options);
                dtPicker.setSelectedValue(that.startDate);
                dtPicker.show(function(selectedItem) {
                    that.startDate = selectedItem.text;
                });
            });
            mui('body').on('tap', '#endDateSelector', function(){
                // 结束日期选择
                let value = that.endDate ? new Date(that.endDate).format('yyyy-MM-dd') : new Date().format('yyyy-MM-dd');
                let options = {
                    type: 'date',
                    value: value,
                };
                if(that.startDate) {
                    options.beginDate = new Date(that.startDate);
                }
                dtPicker.init(options);
                dtPicker.setSelectedValue(that.endDate);
                dtPicker.show(function(selectedItem) {
                    that.endDate = selectedItem.text;
                });
            });
        })
    }
};
</script>
<style lang="scss">
.market-expansion-edit-market-staff-relation {
    font-size: 0.3rem;
    .mui-bar {
        position: relative;
        .save-btn {
            position: absolute;
            padding:4px 10px;
            border: 1px solid #3cb493;
            top: 6px;
            right: 5px;
            border-radius: 3px;
            color: #3cb493;
            background-color: #fff;
            &:active {
                background-color: #3cb493;
                color: #fff;
            }
        }
    }
    .mui-input-row label {
        width: 40%;
        .required {
            color: red;
        }
    }
}
</style>

