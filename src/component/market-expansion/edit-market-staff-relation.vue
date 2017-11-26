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
                    <input type="text" v-model="productName" class="" readonly placeholder="请输入旅行社">
                </div>
                <div class="mui-input-row">
                    <label class="">产品名称：</label>
                    <input type="text" v-model="purchaser" class="" readonly placeholder="请输入产品名称">
                </div>
                <div class="mui-input-row"  id="areaSelector">
                    <label class=""><span class="required">* </span>大区：</label>
                    <input type="text" v-model="areaName" readonly placeholder="请选择大区">
                </div>
                <div class="mui-input-row"  id="citySelector">
                    <label class=""><span class="required">* </span>城市：</label>
                    <input type="text" v-model="cityName" readonly placeholder="请选择城市">
                </div>
                <div class="mui-input-row" id="staffSelector">
                    <label class=""><span class="required">* </span>渠道专员：</label>
                    <input type="text" v-model="staffName" readonly placeholder="请选择渠道专员">
                </div>
                <div class="mui-input-row" id="startDateSelector">
                    <label class=""><span class="required">* </span>有效起始时间：</label>
                    <input type="text" v-model="startDate" placeholder="请设置有效起始时间">
                </div>
                <div class="mui-input-row" id="endDateSelector">
                    <label class=""><span class="required">* </span>有效结束时间：</label>
                    <input type="text" v-model="endDate" placeholder="请设置有效结束时间">
                </div>
            </form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            cardId: '',
            productName: '',
            purchaser: '',
            areaId: '',
            areaName: '',
            cityId: '',
            cityName: '',
            staffId: '',
            staffName: '',
            positionId: '',
            startDate: '',
            endDate: '',
            areaList: [],
            cityList: [],
            staffList: []
        }
    },
    methods: {
        resetCity() {
            this.cityId = '';
            this.cityName = '';
            this.cityList = [];
        },
        resetStaff() {
            this.staffId = '';
            this.staffName = '';
            this.staffList = []
        },
        getAreaList() {
            this.getArea(null, (res) => {
                console.log(res);
            })
        },
        getCityList(parentId) {
            this.getArea(parentId, (res) => {
                console.log(res)
            });
        },
        getStaffList(id, callBack) {
            let url = "/purchaser/getAreaAllSale.htm";
            let params = {
                id: id
            };
            lf.net.getJSONWithLoading(url, params, (res) => {
                if(callBack) {
                    callBack(res);
                }
            })
        },
        save() {
            let requiredStrArr = [
                
                {
                    str: 'startDate',
                    errMsg: '请设置有效起始时间'
                },
                {
                    str: 'endDate',
                    errMsg: '请设置有效结束时间'
                },
                {
                    str: 'areaId',
                    errMsg: '请选择大区'
                },
                {
                    str: 'cityId',
                    errMsg: '请选择城市'
                },
                {
                    str: 'staffId',
                    errMsg: '请选择渠道专员'
                },
            ]
            var validFlag = true;
            for(let i = 0; i < requiredStrArr.length; i++) {
                if(this[requiredStrArr[i]] == '') {
                    lf.nativeUI.toast(requiredStrArr[i].errMsg);
                    validFlag = false;
                    break;
                }
            }
            if(!validFlag) {
                return;
            }
            let url = "/purchaser/updateSaleUser.htm";
            let params = {
                id: this.cardId,
                user_id: this.staffId,
                begin_date: this.startDate,
                end_date: this.endDate,
                area_dept_id: this.areaId,
                city_dept_id: this.cityId,
                position_id: this.positionId
            }
            lf.net.getJSONWithLoading(url, params, (res) => {
                // 刷新父级窗口 market-staff-relation.html
                lf.event.fire(lf.window.currentWebview().opener(),'refresh')
            })
        },
        getArea(parentId, callBack) {
            let url = "/purchaser/getArea.htm";
            let params = {
                parent_id: parentId
            }
            lf.net.getJSONWithLoading(url, params, (res) => {
                if(callBack) {
                    callBack(res);
                }
            })
        }
    },
    mounted() {
        let that = this;
        lf.ready(() => {
            var itemInfo = JSON.parse(lf.window.currentWebview().item);
            console.log("itemInfo: ",itemInfo);
            that.productName = itemInfo.p_name;
            that.purchaser = itemInfo.purchaser;
            that.cardId = itemInfo.id;
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

            let popPicker = new mui.PopPicker();
            
            mui('body').on('tap', '#areaSelector', function() {
                that.getArea(null, (res) => {
                    that.areaList = res.data.map((item) => {
                        return {
                            value: item.id,
                            text: item.name
                        }
                    });
                    popPicker.setData(that.areaList);
                    popPicker.show(function(selectedItem){
                        that.areaId = selectedItem[0].value;
                        that.areaName = selectedItem[0].text;

                        that.resetCity();
                        that.resetStaff();

                        console.log('areaSelector:', JSON.stringify(selectedItem));
                        that.getArea(that.areaId, (res) =>{
                            that.cityList = res.data.map((item) => {
                                return {
                                    value: item.id,
                                    text: item.name
                                }
                            })
                        })
                    });
                })
            });
            mui('body').on('tap', '#citySelector', function() {
                if(that.areaList.length == 0) {
                    lf.nativeUI.toast('请选择大区')
                } else {
                    popPicker.setData(that.cityList);
                    popPicker.show(function(selectedItem){

                        that.resetStaff();       

                        that.cityId = selectedItem[0].value;
                        that.cityName = selectedItem[0].text;
                        that.getStaffList(that.cityId, (res) =>{
                            that.staffList = res.data.map((item) => {
                                return {
                                    value: item.id,
                                    text: item.name,
                                    positionId: item.positionId
                                }
                            })
                        })
                    });
                }
            });
            mui('body').on('tap', '#staffSelector', function() {
                if(that.areaList.length == 0) {
                    lf.nativeUI.toast('请选择大区');
                    return;
                }
                if(that.cityList.length == 0) {
                    lf.nativeUI.toast('请选择城市');
                    return;
                }
                if(that.staffList.length == 0){
                    lf.nativeUI.toast('没有可选择的渠道人员');
                    return;
                }
                popPicker.setData(that.staffList);
                popPicker.show(function(selectedItem) {
                    that.staffId = selectedItem[0].value;
                    that.staffName = selectedItem[0].text;
                    that.positionId = selectedItem[0].positionId;
                })
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
    .mui-input-row input {
        width: 50%;
    }
}
</style>

