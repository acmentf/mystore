<template>
    <div class="mui-off-canvas-wrap mui-draggable orderlist-content-box statistics-daily-paper">
        <!--侧滑菜单部分-->
        <switch-role-position></switch-role-position>

        <div class="mui-inner-wrap" style="background:#efeff4">
            <header class="mui-bar mui-bar-nav" style="background:#fff;">
                <a href="#offCanvasSide" style="color:#333"
                   class="mui-icon mui-action-menu mui-icon-bars mui-pull-left"></a>
                <h1 class="mui-title" style="color: #333;" v-text="showTitle"></h1>
            </header>
            <nav class="mui-bar mui-bar-tab">
                <a class="mui-tab-item mui-active" href="#tab-income" id="income">
                <span class="mui-icon">
                    <img :src="'../../assets/images/statistics/'+ (pageTypeActive === pageTypeConstant.income ? 'income-active.png' : 'income.png')">
                </span>
                    <span class="mui-tab-label">收入</span>
                </a>
                <a class="mui-tab-item" href="#tab-flow" id="flow">
                <span class="mui-icon">
                     <img :src="'../../assets/images/statistics/'+ (pageTypeActive === pageTypeConstant.flow ? 'flow-active.png' : 'flow.png')">
                </span>
                    <span class="mui-tab-label">流量</span>
                </a>
                <a class="mui-tab-item" href="#tab-history" id="history">
                <span class="mui-icon">
                     <img :src="'../../assets/images/statistics/'+ (pageTypeActive === pageTypeConstant.history ? 'history-active.png' : 'history.png')">
                </span>
                    <span class="mui-tab-label">历史数据</span>
                </a>
            </nav>
            <div class="mui-scroll-wrapper mui-content" id="page-scroll">
                <div class="mui-scroll">
                    <div class="daily-content">
                        <div id="tab-income" class="mui-control-content mui-active">
                            <div class="income-page" v-if="pageTypeActive === pageTypeConstant.income">
                                <div class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
                                    <a class="mui-control-item mui-active" href="#tab-income-area">
                                        <span class="text">全国与大区</span>
                                    </a>
                                    <a class="mui-control-item" href="#tab-income-line">
                                        <span class="text">线路产品</span>
                                    </a>
                                    <a class="mui-control-item" href="#tab-income-travel">
                                        <span class="text">旅行社</span>
                                    </a>
                                </div>
                                <div id="tab-income-area" class="mui-slider-item mui-control-content mui-active">
                                    <div class="mui-slider info-box-mui-slider">
                                        <div class="mui-slider-group">
                                            <div class="mui-slider-item">
                                                <ul class="mui-table-view mui-grid-view">
                                                    <li class="mui-table-view-cell mui-media mui-col-xs-6">
                                                        <a href="#">
                                                            <div class="info-box">
                                                                <div class="title">今日收入</div>
                                                                <div class="value-wrap">
                                                                    <span class="currency"></span>
                                                                    <span class="number" v-text="incomeTotal.saleAmt"></span>
                                                                </div>
                                                                <div class="ring-wrap" :class="getNumberClassName(incomeTotal.saleAmtRate)">
                                                                    <div class="r-box">
                                                                        <span class="sign" v-if="incomeTotal.saleAmtRate"></span>
                                                                        <span class="number" v-text="getAbs(incomeTotal.saleAmtRate)"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li class="mui-table-view-cell mui-media mui-col-xs-6">
                                                        <a href="#">
                                                            <div class="info-box">
                                                                <div class="title">昨日收入</div>
                                                                <div class="value-wrap">
                                                                    <span class="currency"></span>
                                                                    <span class="number" v-text="incomeYesterdayTotal.saleAmt"></span>
                                                                </div>
                                                                <div class="ring-wrap" :class="getNumberClassName(incomeYesterdayTotal.saleAmtRate)">
                                                                    <div class="r-box">
                                                                        <span class="sign" v-if="incomeYesterdayTotal.saleAmtRate"></span>
                                                                        <span class="number" v-text="getAbs(incomeYesterdayTotal.saleAmtRate)"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="mui-slider-item">
                                                <ul class="mui-table-view mui-grid-view">
                                                    <li class="mui-table-view-cell mui-media mui-col-xs-6">
                                                        <a href="#">
                                                            <div class="info-box">
                                                                <div class="title">今日销售</div>
                                                                <div class="value-wrap">
                                                                    <span class="currency"></span>
                                                                    <span class="number" v-text="incomeTotal.appAmt"></span>
                                                                </div>
                                                                <div class="ring-wrap" :class="getNumberClassName(incomeTotal.appAmtRate)">
                                                                    <div class="r-box">
                                                                        <span class="sign" v-if="incomeTotal.appAmtRate"></span>
                                                                        <span class="number" v-text="getAbs(incomeTotal.appAmtRate)"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li class="mui-table-view-cell mui-media mui-col-xs-6">
                                                        <a href="#">
                                                            <div class="info-box">
                                                                <div class="title">昨日销售</div>
                                                                <div class="value-wrap">
                                                                    <span class="currency"></span>
                                                                    <span class="number" v-text="incomeYesterdayTotal.appAmt"></span>
                                                                </div>
                                                                <div class="ring-wrap" :class="getNumberClassName(incomeYesterdayTotal.appAmtRate)">
                                                                    <div class="r-box">
                                                                        <span class="sign" v-if="incomeYesterdayTotal.appAmtRate"></span>
                                                                        <span class="number" v-text="getAbs(incomeYesterdayTotal.appAmtRate)"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="mui-slider-item">
                                                <ul class="mui-table-view mui-grid-view">
                                                    <li class="mui-table-view-cell mui-media mui-col-xs-6">
                                                        <a href="#">
                                                            <div class="info-box">
                                                                <div class="title">今日前置</div>
                                                                <div class="value-wrap">
                                                                    <span class="currency"></span>
                                                                    <span class="number" v-text="incomeTotal.saleAmtPer"></span>
                                                                </div>
                                                                <div class="ring-wrap" :class="getNumberClassName(incomeTotal.saleAmtPerRate)">
                                                                    <div class="r-box">
                                                                        <span class="sign" v-if="incomeTotal.saleAmtPerRate"></span>
                                                                        <span class="number" v-text="getAbs(incomeTotal.saleAmtPerRate)"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li class="mui-table-view-cell mui-media mui-col-xs-6">
                                                        <a href="#">
                                                            <div class="info-box">
                                                                <div class="title">昨日前置</div>
                                                                <div class="value-wrap">
                                                                    <span class="currency"></span>
                                                                    <span class="number" v-text="incomeYesterdayTotal.saleAmtPer"></span>
                                                                </div>
                                                                <div class="ring-wrap" :class="getNumberClassName(incomeYesterdayTotal.saleAmtPerRate)">
                                                                    <div class="r-box">
                                                                        <span class="sign" v-if="incomeYesterdayTotal.saleAmtPerRate"></span>
                                                                        <span class="number" v-text="getAbs(incomeYesterdayTotal.saleAmtPerRate)"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <!--全国收入（实时）-->
                                    <div class="section-box">
                                        <div class="section-title clearfix">
                                            <div class="text" v-text="incomeAllTitle"></div>
                                            <div class="tool">
                                                <i class="item icon-more-select" id="incomeAll_RP"></i>
                                            </div>
                                        </div>
                                        <div class="section-content">
                                            <e-charts ref="incomeChart_1" :options="incomeAllChart" auto-resize></e-charts>
                                        </div>
                                    </div>
                                    <!--各大区收入（今日实时/昨日）-->
                                    <div class="section-box">
                                        <div class="section-title clearfix">
                                            <div class="text" v-text="incomeRegionTitle"></div>
                                            <div class="tool">
                                                <i class="item icon-more-select" id="incomeRegion_RP"></i>
                                            </div>
                                        </div>
                                        <div class="section-content">
                                            <e-charts :style="calcBarChartStyle(incomeRegionChart)"
                                                      ref="incomeChart_2" class="axis-label-long" :options="incomeRegionChart" auto-resize></e-charts>
                                        </div>
                                    </div>
                                </div>
                                <div id="tab-income-line" class="mui-slider-item mui-control-content">
                                    <div class="section-box">
                                        <div class="section-title clearfix">
                                            <div class="text">线路产品收入（{{realTitleExplainText}}）</div>
                                        </div>
                                        <div class="section-content">
                                            <e-charts :style="calcBarChartStyle(incomeLineChart)"
                                                      ref="incomeChart_3" class="axis-label-long" :options="incomeLineChart" auto-resize></e-charts>
                                        </div>
                                    </div>
                                </div>
                                <div id="tab-income-travel" class="mui-slider-item mui-control-content">
                                    <div class="section-box">
                                        <div class="section-title clearfix">
                                            <div class="text">旅行社收入转化（{{realTitleExplainText}}）</div>
                                        </div>
                                        <div class="section-content">
                                            <e-charts :style="calcBarChartStyle(incomeTravelChart)"
                                                      ref="incomeChart_4" class="axis-label-long" :options="incomeTravelChart" auto-resize></e-charts>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="tab-flow" class="mui-control-content">
                            <div class="flow-page" v-if="pageTypeActive === pageTypeConstant.flow">
                                <div class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
                                    <a class="mui-control-item mui-active" href="#tab-flow-area">
                                        <span class="text">全国与大区</span>
                                    </a>
                                    <a class="mui-control-item" href="#tab-flow-line">
                                        <span class="text">线路产品</span>
                                    </a>
                                    <a class="mui-control-item" href="#tab-flow-travel">
                                        <span class="text">旅行社</span>
                                    </a>
                                </div>
                                <div id="tab-flow-area" class="mui-slider-item mui-control-content mui-active">
                                    <ul class="mui-table-view mui-grid-view">
                                        <li class="mui-table-view-cell mui-media mui-col-xs-6">
                                            <a href="#">
                                                <div class="info-box">
                                                    <div class="title">今日拍摄人数</div>
                                                    <div class="value-wrap">
                                                        <span class="number" v-text="flowShootInfo.shootPerples || 0"></span>
                                                    </div>
                                                    <div class="ring-wrap" :class="getNumberClassName(flowShootInfo.shootPerplesRate)">
                                                        <div class="r-box">
                                                            <span class="sign" v-if="flowShootInfo.shootPerplesRate"></span>
                                                            <span class="number" v-text="getAbs(flowShootInfo.shootPerplesRate)"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li class="mui-table-view-cell mui-media mui-col-xs-6">
                                            <a href="#">
                                                <div class="info-box">
                                                    <div class="title">昨日拍摄人数</div>
                                                    <div class="value-wrap">
                                                        <span class="number" v-text="flowYesterdayShootInfo.shootPerples || 0"></span>
                                                    </div>
                                                    <div class="ring-wrap" :class="getNumberClassName(flowYesterdayShootInfo.shootPerplesRate)">
                                                        <div class="r-box">
                                                            <span class="sign" v-if="flowYesterdayShootInfo.shootPerplesRate"></span>
                                                            <span class="number" v-text="getAbs(flowYesterdayShootInfo.shootPerplesRate)"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                    <!--全国拍摄人数（实时）-->
                                    <div class="section-box">
                                        <div class="section-title clearfix">
                                            <div class="text" v-text="flowShootAllTitle"></div>
                                            <div class="tool">
                                                <i class="item icon-more-select" id="flowShootAll_RP"></i>
                                            </div>
                                        </div>
                                        <div class="section-content">
                                            <e-charts ref="flowChart_1" :options="flowShootAllChart" auto-resize></e-charts>
                                        </div>
                                    </div>
                                    <!--各大区拍摄人数（今日实时/昨日）-->
                                    <div class="section-box">
                                        <div class="section-title clearfix">
                                            <div class="text" v-text="flowShootRegionTitle"></div>
                                            <div class="tool">
                                                <i class="item icon-more-select" id="flowShootRegion_RP"></i>
                                            </div>
                                        </div>
                                        <div class="section-content">
                                            <e-charts :style="calcBarChartStyle(flowShootRegionChart)"
                                                      ref="flowChart_2" class="axis-label-long" :options="flowShootRegionChart" auto-resize></e-charts>
                                        </div>
                                    </div>
                                </div>
                                <div id="tab-flow-line" class="mui-slider-item mui-control-content">
                                    <div class="section-box">
                                        <div class="section-title clearfix">
                                            <div class="text">线路产品拍摄人数（{{realTitleExplainText}}）</div>
                                        </div>
                                        <div class="section-content">
                                            <e-charts :style="calcBarChartStyle(flowShootLineChart)"
                                                      ref="flowChart_3" class="axis-label-long" :options="flowShootLineChart" auto-resize></e-charts>
                                        </div>
                                    </div>
                                </div>
                                <div id="tab-flow-travel" class="mui-slider-item mui-control-content">
                                    <div class="section-box">
                                        <div class="section-title clearfix">
                                            <div class="text">旅行社拍摄人数（{{realTitleExplainText}}）</div>
                                        </div>
                                        <div class="section-content">
                                            <e-charts :style="calcBarChartStyle(flowShootTravelChart)"
                                                      ref="flowChart_4" class="axis-label-long" :options="flowShootTravelChart" auto-resize></e-charts>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="tab-history" class="mui-control-content">
                            <div class="history-page" v-if="pageTypeActive === pageTypeConstant.history">
                                <div class="info-box center" style="position: relative;top: 3px;">
                                    累积收入
                                    <span class="currency single-value" v-text="historyIncomeTotal.saleAmt"></span>
                                    <button type="button" class="item mui-btn check-more"
                                            v-tap="{ methods : goPageMore, pageType: pageTypeConstant.income }">
                                        更多数据
                                    </button>
                                </div>
                                <div class="section-box">
                                    <div class="section-title clearfix">
                                        <div class="text">前置&销售收入对比</div>
                                    </div>
                                    <div class="section-content">
                                        <e-charts :options="historyIncomeTotalChart" auto-resize></e-charts>
                                    </div>
                                </div>
                                <!--近30天每日收入-->
                                <div class="section-box">
                                    <div class="section-title clearfix">
                                        <div class="text" v-text="historyIncomeDayTitle"></div>
                                        <div class="tool">
                                            <button type="button" class="item mui-btn switchover"
                                                    v-text="historyIncomeDayTypeTitle"
                                                    v-tap="{ methods : switchChartType, key: 'historyIncomeDay' }">
                                            </button>
                                            <i class="item icon-more-select" id="historyIncomeDay_RP"></i>
                                        </div>
                                    </div>
                                    <div class="section-content">
                                        <e-charts class="axis-label-long" :options="historyIncomeDayChart" auto-resize></e-charts>
                                    </div>
                                </div>
                                <!--近3月收入统计-->
                                <div class="section-box">
                                    <div class="section-title clearfix">
                                        <div class="text" v-text="historyThreeMonthIncomeTitle"></div>
                                        <div class="tool">
                                            <button type="button" class="item mui-btn switchover"
                                                    v-text="historyThreeMonthIncomeTypeTitle"
                                                    v-tap="{ methods : switchChartType, key: 'historyThreeMonthIncome' }">
                                            </button>
                                            <i class="item icon-more-select" id="historyThreeMonthIncome_RP"></i>
                                        </div>
                                    </div>
                                    <div class="section-content"
                                         v-show="regionProvinceMap.historyThreeMonthIncome.chartType === chartTypeConstant.day">
                                        <div class="mui-slider info-box-mui-slider">
                                            <div class="mui-slider-group">
                                                <div class="mui-slider-item"  v-for="(item,index) in historyThreeMonthIncome" v-if="index % 2 === 0">
                                                    <ul class="mui-table-view mui-grid-view">
                                                        <li class="mui-table-view-cell mui-media mui-col-xs-6">
                                                            <a href="#">
                                                                <div class="info-box">
                                                                    <div class="title" v-text="item.date"></div>
                                                                    <div class="value-wrap">
                                                                        <span class="currency"></span>
                                                                        <span class="number" v-text="item.totalAmt || 0"></span>
                                                                    </div>
                                                                    <div class="ring-wrap" :class="getNumberClassName(item.amtRate)">
                                                                        <div class="r-box">
                                                                            <span class="sign" v-if="item.amtRate"></span>
                                                                            <span class="number" v-text="getAbs(item.amtRate)"></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </li>
                                                        <li class="mui-table-view-cell mui-media mui-col-xs-6" v-if="index + 1 < historyThreeMonthIncome.length">
                                                            <a href="#">
                                                                <div class="info-box">
                                                                    <div class="title" v-text="historyThreeMonthIncome[index + 1].date"></div>
                                                                    <div class="value-wrap">
                                                                        <span class="currency"></span>
                                                                        <span class="number" v-text="historyThreeMonthIncome[index + 1].totalAmt || 0"></span>
                                                                    </div>
                                                                    <div class="ring-wrap" :class="getNumberClassName(historyThreeMonthIncome[index + 1].amtRate)">
                                                                        <div class="r-box">
                                                                            <span class="sign" v-if="historyThreeMonthIncome[index + 1].amtRate"></span>
                                                                            <span class="number" v-text="getAbs(historyThreeMonthIncome[index + 1].amtRate)"></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="section-content"
                                         v-show="regionProvinceMap.historyThreeMonthIncome.chartType === chartTypeConstant.acc">
                                        <e-charts ref="historyChart_1" :options="historyThreeMonthIncomeAccChart" auto-resize></e-charts>
                                    </div>
                                </div>
                                <div class="info-box center">
                                    累积拍摄人数
                                    <span class="single-value" v-text="historyShootCount.shoot"></span>
                                    <button type="button" class="item mui-btn check-more"
                                            v-tap="{ methods : goPageMore, pageType: pageTypeConstant.flow }">
                                        更多数据
                                    </button>
                                </div>
                                <!--近30天每日拍摄人数-->
                                <div class="section-box">
                                    <div class="section-title clearfix">
                                        <div class="text" v-text="historyShootDayTitle"></div>
                                        <div class="tool">
                                            <button type="button" class="item mui-btn switchover"
                                                    v-text="historyShootDayTypeTitle"
                                                    v-tap="{ methods : switchChartType, key: 'historyShootDay' }">
                                            </button>
                                            <i class="item icon-more-select" id="historyShootDay_RP"></i>
                                        </div>
                                    </div>
                                    <div class="section-content">
                                        <e-charts class="axis-label-long" :options="historyShootDayChart" auto-resize></e-charts>
                                    </div>
                                </div>
                                <div class="section-box">
                                    <div class="section-title clearfix" style="border-bottom: 1px solid #F5F5F5">
                                        <div class="text">旅行社累积发团人数排行</div>
                                    </div>
                                    <div class="section-content list-num-icon-wrap">
                                        <div class="item clearfix" v-for="(item, index) in historyTravelRanking">
                                            <span class="lf num-icon" v-if="index < 3" :class="['num-icon-' + (index + 1)]"></span>
                                            <span class="lf num" v-else v-text="index + 1"></span>
                                            <span class="lf" v-text="item.travelName"></span>
                                            <span class="rt" v-text="item.total" style="color: #6666"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mui-off-canvas-backdrop"></div>
        </div>
    </div>
</template>
<script>
    import utils from '../../js/utils'
    import {pageTypeConstant, chartTypeConstant, totalMoreTypeConstant} from './daily-paper/commom'
    import switchRolePosition from '../public/switchRolePosition.vue'
    const titleMap = {
        [pageTypeConstant.income]: '收入',
        [pageTypeConstant.flow]: '流量',
        [pageTypeConstant.history]: '历史数据'
    }
    //大区省份选择
    const cityPicker = new mui.PopPicker({
        layer: 2
    })
    const EACH_SCREEN_COUNT = 8
    const X_AXIS_NAME_COUNT = 7
    const DATA_ZOOM_INSIDE = {
        show: true,
        realtime: true,
        type: 'inside',
        orient: 'horizontal',
        zoomLock: false,
        startValue: 0,
        endValue: EACH_SCREEN_COUNT - 1
    }
    const EMPTY_CHART = {series: []}
    const LINE_Y_AXIS = {
        name: '',
        show: false,
        type: 'value'
    }
    const BAR_TOOLTIP = {
        trigger: 'axis',
        show: true
    }
    const BAR_Y_AXIS_TICK = {
        show: false
    }
    const BAR_X_AXIS = {
        name: '',
        show: false,
        type: 'value'
    }
    const AXIS_LABEL = {
        interval: 0,
        rotate: 30
    }
    const GRID_TOP = 20
    const GRID_LEFT = 14
    const GRID_RIGHT = 10
    const GRID_BOTTOM = 30
    const AXIS_LABEL_LEFT = 50
    const AXIS_LABEL_BOTTOM = 70
    const BAR_AXIS_LABEL_LEFT = 100
    const BAR_AXIS_LABEL_RIGHT = 70
    const ALL_RP = 'all'
    const ALL_NAME_RP = '全部'
    const MERGE_SERIES_SUFFIX = '_newKey'
    const TODAY_COLOR = '#c23531'
    const YESTERDAY_COLOR = '#2f4554'
    const INCOME_SERIES_OPTS = {
        seriesName: '收入',
        color: TODAY_COLOR,
        categoryKey: 'category',
        valueKey: 'value'
    }
    const FLOW_SERIES_OPTS = {
        seriesName: '人数',
        color: TODAY_COLOR,
        categoryKey: 'category',
        valueKey: 'value'
    }

    // 获取大区省份
    function getRegionProvince(options, text) {
        let ret = options.areaName && options.areaName !== ALL_NAME_RP ? options.areaName : ''
        if (ret && options.provinceName && options.provinceName !==  ALL_NAME_RP) {
            ret += options.provinceName
        }
        return ret || text
    }
    // 设置大区省份
    function setRegionProvince(regionProvince, items) {
        regionProvince.areaCode = items[0].value
        regionProvince.areaName = items[0].text
        regionProvince.provinceCode = items[1].value || ALL_RP
        regionProvince.provinceName = items[1].text || ALL_NAME_RP
    }
    //合并序列数据
    function mergeSeriesData(options) {
        let fromList = options.fromList;
        let toList = options.toList;
        let categoryKey = options.categoryKey;
        let valueKey = options.valueKey;
        let baseMap = {}
        let ret = []
        ;(toList || []).forEach(function (item) {
            baseMap[item[categoryKey]] = {
                category: item[categoryKey],
                value: item[valueKey]
            }
        })
        ;(fromList || []).forEach(function (item) {
            let data = baseMap[item[categoryKey]]
            if (!data) {
                baseMap[item[categoryKey]] = data = {
                    category: item[categoryKey],
                    value: 0
                }
            }
            data['value' + MERGE_SERIES_SUFFIX] = item[valueKey]
        })
        Object.keys(baseMap).forEach(function (key) {
            ret.push(baseMap[key])
        })
        return ret
    }
    // 过滤（或）
    function filterSeriesByOr(item) {
        return isValidValue(item.value) || isValidValue(item['value' + MERGE_SERIES_SUFFIX])
    }
    // 排序
    function baseSortSeries(a, b) {
        let key = 'value' + MERGE_SERIES_SUFFIX
        return a[key] - b[key]
    }
    //获取line的chart option
    function getLineChartOption(list, seriesOpts) {
        let xAxisData = []
        let series = []
        seriesOpts = Array.isArray(seriesOpts) ? seriesOpts : [seriesOpts]
        seriesOpts.forEach(function (opt, groupIndex) {
            let categoryKey = opt.categoryKey;
            let valueKey = opt.valueKey
            let seriesData = []

            list.forEach(function(item) {
                let value = +item[valueKey]
                if (groupIndex === 0) {
                    xAxisData.push(item.noTruncation ? item[categoryKey] : truncationStr(item[categoryKey], X_AXIS_NAME_COUNT))
                }
                seriesData.push(value)
            })
            series.push({
                name: opt.seriesName,
                type: 'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: opt.color
                    }
                },
                data: seriesData
            })
        })

        return {
            tooltip: {
                trigger: 'axis'
            },
            dataZoom: DATA_ZOOM_INSIDE,
            grid: {
                top: GRID_TOP,
                left: GRID_LEFT,
                right:GRID_RIGHT,
                bottom: GRID_BOTTOM
            },
            yAxis: LINE_Y_AXIS,
            xAxis: {
                type: 'category',
                data: xAxisData
            },
            series: series
        }
    }
    //获取两条line的chart option
    function getTwoLineChartOption(list) {
        return getLineChartOption(list, [
            {
                seriesName: '今日',
                color: TODAY_COLOR,
                categoryKey: 'category',
                valueKey: 'value'
            },
            {
                seriesName: '昨日',
                color: YESTERDAY_COLOR,
                categoryKey: 'category',
                valueKey: 'value'+ MERGE_SERIES_SUFFIX
            }
        ])
    }
    //获取line的chart option(长category)
    function getLineLongCategoryChartOption(list, seriesOpts) {
        let xAxisData = []
        let series = []
        seriesOpts = Array.isArray(seriesOpts) ? seriesOpts : [seriesOpts]
        seriesOpts.forEach(function (opt, groupIndex) {
            let categoryKey = opt.categoryKey;
            let valueKey = opt.valueKey
            let seriesData = []

            list.forEach(function(item) {
                let value = +item[valueKey]
                if (groupIndex === 0) {
                    xAxisData.push(item.noTruncation ? item[categoryKey] : truncationStr(item[categoryKey], X_AXIS_NAME_COUNT))
                }
                seriesData.push(value)
            })
            series.push({
                name: opt.seriesName,
                type: 'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: opt.color
                    }
                },
                data: seriesData
            })
        })

        return {
            tooltip: {
                trigger: 'axis'
            },
            dataZoom: DATA_ZOOM_INSIDE,
            grid: {
                top: GRID_TOP,
                left: AXIS_LABEL_LEFT,
                right:GRID_RIGHT,
                bottom: AXIS_LABEL_BOTTOM
            },
            yAxis: LINE_Y_AXIS,
            xAxis: {
                type: 'category',
                axisLabel: AXIS_LABEL,
                data: xAxisData
            },
            series: series
        }
    }
    //获取两条line的chart option(长category)
    function getTwoLineLongCategoryChartOption(list) {
        return getLineLongCategoryChartOption(list, [
            {
                seriesName: '今日',
                color: TODAY_COLOR,
                categoryKey: 'category',
                valueKey: 'value'
            },
            {
                seriesName: '昨日',
                color: YESTERDAY_COLOR,
                categoryKey: 'category',
                valueKey: 'value'+ MERGE_SERIES_SUFFIX
            }
        ])
    }
    //获取Bar的chart option(长category)
    function getBarLongCategoryChartOption(list, seriesOpts) {
        let xAxisData = []
        let series = []
        seriesOpts = Array.isArray(seriesOpts) ? seriesOpts : [seriesOpts]
        seriesOpts.forEach(function (opt, groupIndex) {
            let categoryKey = opt.categoryKey;
            let valueKey = opt.valueKey
            let seriesData = []

            list.forEach(function(item) {
                let value = +item[valueKey]
                if (groupIndex) {
                    xAxisData.push(item.noTruncation ? item[categoryKey] : truncationStr(item[categoryKey], X_AXIS_NAME_COUNT))
                }
                seriesData.push(value)
            })
            series.push({
                name: opt.seriesName,
                type: 'bar',
                barMaxWidth: 30,
                label: {
                    normal: {
                        show: true,
                        position: 'right'
                    }
                },
                itemStyle: {
                    normal: {
                        color: opt.color
                    }
                },
                data: seriesData
            })
        })

        return {
            tooltip: BAR_TOOLTIP,
            grid: {
                top: GRID_TOP-10,
                left: BAR_AXIS_LABEL_LEFT,
                right:BAR_AXIS_LABEL_RIGHT,
                bottom: GRID_BOTTOM - 10
            },
            yAxis: {
                type: 'category',
                axisTick: BAR_Y_AXIS_TICK,
                data: xAxisData
            },
            xAxis: BAR_X_AXIS,
            series: series
        }
    }
    //获取两条Bar的chart option(长category)
    function getTwoBarLongCategoryChartOption(list) {
        return getBarLongCategoryChartOption(list, [
            {
                seriesName: '今日',
                color: TODAY_COLOR,
                categoryKey: 'category',
                valueKey: 'value'
            },
            {
                seriesName: '昨日',
                color: YESTERDAY_COLOR,
                categoryKey: 'category',
                valueKey: 'value'+ MERGE_SERIES_SUFFIX
            }
        ])
    }
    //校验值
    function isValidValue(v) {
        v = +v
        return !!v && !isNaN(v)
    }
    //是否定义
    function isDef(v) {
        return v !== undefined && v !== null
    }
    // 截断字符串
    function truncationStr(str, count) {
        str = str + ''
        return str.length > count ? str.slice(0, count - 1) + '...' : str
    }

    export default {
        name: 'dailyPaper',
        components: {
            ECharts: VueECharts,
            switchRolePosition
        },
        data () {
            return {
                //激活模块
                pageTypeActive: pageTypeConstant.income,
                queryDate: new Date(/*new Date() - 1000*60*60*24*/),
                historyDate: utils.recentDay(30),
                //大区省份code
                //regionProvinceActive: '',
                regionProvinceMap: {
                    incomeAll: {
                        areaCode: ALL_RP,
                        areaName: ALL_NAME_RP,
                        provinceCode: ALL_RP,
                        provinceName: ALL_NAME_RP
                    },
                    incomeRegion: {
                        areaCode: ALL_RP,
                        areaName: ALL_NAME_RP,
                        provinceCode: ALL_RP,
                        provinceName: ALL_NAME_RP
                    },
                    flowShootAll: {
                        areaCode: ALL_RP,
                        areaName: ALL_NAME_RP,
                        provinceCode: ALL_RP,
                        provinceName: ALL_NAME_RP
                    },
                    flowShootRegion: {
                        areaCode: ALL_RP,
                        areaName: ALL_NAME_RP,
                        provinceCode: ALL_RP,
                        provinceName: ALL_NAME_RP
                    },
                    historyIncomeDay: {
                        chartType: chartTypeConstant.day,
                        areaCode: ALL_RP,
                        areaName: ALL_NAME_RP,
                        provinceCode: ALL_RP,
                        provinceName: ALL_NAME_RP
                    },
                    historyThreeMonthIncome: {
                        chartType: chartTypeConstant.day,
                        areaCode: ALL_RP,
                        areaName: ALL_NAME_RP,
                        provinceCode: ALL_RP,
                        provinceName: ALL_NAME_RP
                    },
                    historyShootDay: {
                        chartType: chartTypeConstant.day,
                        areaCode: ALL_RP,
                        areaName: ALL_NAME_RP,
                        provinceCode: ALL_RP,
                        provinceName: ALL_NAME_RP
                    }
                },
                regionProvinceList: [],
                //
                realTitleExplainText: '今日实时/昨日',
                /*收入模块 start*/
                // 统计汇总
                incomeTotal: {
                    saleAmt: '',//	收入
                    saleAmtRate: '',//	收入涨幅
                    saleAmtPer: '',//	前置金额
                    saleAmtPerRate: '',//	前置金额涨幅
                    appAmt: '',//	销售金额
                    appAmtRate: ''//	销售金额涨幅
                },
                incomeYesterdayTotal: {
                    saleAmt: '',//	收入
                    saleAmtRate: '',//	收入涨幅
                    saleAmtPer: '',//	前置金额
                    saleAmtPerRate: '',//	前置金额涨幅
                    appAmt: '',//	销售金额
                    appAmtRate: ''//	销售金额涨幅
                },
                //线路产品收入
                /*productName	线路名称
                 saleAmt	收入金额*/
                incomeLine: [],
                //旅行社收入转化
                /*travelName	旅行社名称
                 saleAmt	收入金额*/
                incomeTravel: [],
                //全国收入（实时）
                /*hour	小时
                 saleAmt	收入金额*/
                incomeAll: [],
                //各大区收入
                /*areaName	大区名称
                 saleAmt	收入金额*/
                incomeRegion: [],
                /*收入模块 end*/
                /*流量模块 start*/
                //拍摄统计
                flowShootInfo: {
                    shootPerples: '',//	拍摄人数
                    shootPerplesRate: ''//	拍摄人数涨幅
                },
                flowYesterdayShootInfo: {
                    shootPerples: '',//	拍摄人数
                    shootPerplesRate: ''//	拍摄人数涨幅
                },
                //线路产品拍摄人数
                /*productName	线路名称
                 shootPerples	拍摄人数*/
                flowShootLine: [],
                //旅行社拍摄人数
                /*travelName	旅行社名称
                 shootPerples	拍摄人数*/
                flowShootTravel: [],
                //全国拍摄人数实时
                /*hour	小时
                 shootPerples	拍摄人数*/
                flowShootAll: [],
                //大区拍摄人数(实时)
                /*areaName	大区名称
                 shootPerples	拍摄人数*/
                flowShootRegion: [],
                /*流量模块 end*/
                /*历史模块 start*/
                //累计收入
                historyIncomeTotal: {
                    saleAmt: '',//	累计收入
                    saleAmtPer: '',//	前置收入
                    appAmt: ''//	销售收入
                },
                //近30天每日收入
                /*date	日期
                 saleAmt	收入金额*/
                historyIncomeDay: [],
                //近3个月收入统计
                /*date	日期
                 totalAmt	总收入
                 amtRate	涨幅*/
                historyThreeMonthIncome: [],
                historyThreeMonthIncomeAcc: {},
                //累计拍摄人数
                historyShootCount: {
                    shoot: ''//	累计拍摄人数
                },
                //近30天拍摄人数
                /*hour	日期
                 shootPerples	拍摄人数*/
                historyShootDay: [],
                //旅行社发团人数排行
                /*travelName	旅行社名称
                 total	人数*/
                historyTravelRanking: []
                /*历史模块 end*/
            }
        },
        computed:{
            showTitle: function () {
                return titleMap[this.pageTypeActive] || '日报'
            },
            pageTypeConstant: function () {
                return pageTypeConstant
            },
            chartTypeConstant () {
                return chartTypeConstant
            },
            incomeAllTitle: function () {
                return getRegionProvince(this.regionProvinceMap.incomeAll, '全国') + '收入（' + this.realTitleExplainText + '）'
            },
            incomeRegionTitle: function () {
                return getRegionProvince(this.regionProvinceMap.incomeRegion, '各大区') + '收入（' + this.realTitleExplainText + '）'
            },
            flowShootAllTitle: function () {
                return getRegionProvince(this.regionProvinceMap.flowShootAll, '全国拍摄人数') + '（' + this.realTitleExplainText + '）'
            },
            flowShootRegionTitle: function () {
                return getRegionProvince(this.regionProvinceMap.flowShootRegion, '大区拍摄人数') + '（' + this.realTitleExplainText + '）'
            },
            historyIncomeDayTitle: function () {
                return '近30天每日收入'
            },
            historyThreeMonthIncomeTitle: function () {
                return '近3月收入统计'
            },
            historyShootDayTitle: function () {
                return '近30天每日拍摄人数'
            },
            historyIncomeDayTypeTitle: function () {
                return this.getChartTypeTitle(this.regionProvinceMap.historyIncomeDay.chartType, '每日收入')
            },
            historyThreeMonthIncomeTypeTitle: function () {
                return this.getChartTypeTitle(this.regionProvinceMap.historyThreeMonthIncome.chartType, '每日拍摄')
            },
            historyShootDayTypeTitle: function () {
                return this.getChartTypeTitle(this.regionProvinceMap.historyShootDay.chartType, '每月统计')
            },
            incomeLineChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return EMPTY_CHART
                }
                return getTwoBarLongCategoryChartOption(this.incomeLine)
            },
            incomeTravelChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return EMPTY_CHART
                }
                return getTwoBarLongCategoryChartOption(this.incomeTravel)
            },
            incomeAllChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return EMPTY_CHART
                }
                let options = getTwoLineChartOption(this.incomeAll)
                options.dataZoom = lf.extend({},DATA_ZOOM_INSIDE,{
                    start: 0,
                    end: 100
                })
                return options
            },
            incomeRegionChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return EMPTY_CHART
                }
                return getTwoBarLongCategoryChartOption(this.incomeRegion)
            },
            flowShootLineChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.flow) {
                    return EMPTY_CHART
                }
                return getTwoBarLongCategoryChartOption(this.flowShootLine)
            },
            flowShootTravelChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.flow) {
                    return EMPTY_CHART
                }
                return getTwoBarLongCategoryChartOption(this.flowShootTravel)
            },
            flowShootAllChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.flow) {
                    return EMPTY_CHART
                }
                let options = getTwoLineChartOption(this.flowShootAll)
                options.dataZoom = lf.extend({},DATA_ZOOM_INSIDE,{
                    start: 0,
                    end: 100
                })
                return options
            },
            flowShootRegionChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.flow) {
                    return EMPTY_CHART
                }
                return getTwoBarLongCategoryChartOption(this.flowShootRegion)
            },
            historyIncomeDayChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.history) {
                    return EMPTY_CHART
                }
                let options = getLineLongCategoryChartOption(this.historyIncomeDay, INCOME_SERIES_OPTS)
                options.dataZoom = lf.extend({},DATA_ZOOM_INSIDE,{
                    startValue: options.xAxis.data.length - EACH_SCREEN_COUNT,
                    end: 100
                })
                return options
            },
            historyThreeMonthIncomeAccChart: function () {
                let regionProvince = this.regionProvinceMap.historyThreeMonthIncome
                if (this.pageTypeActive !== pageTypeConstant.flow || regionProvince.chartType === chartTypeConstant.day) {
                    return EMPTY_CHART
                }
                let {seriesOpts, list} = this.historyThreeMonthIncomeAcc
                let options = getLineChartOption(list,seriesOpts)
                options.dataZoom = lf.extend({},DATA_ZOOM_INSIDE,{
                    start: 0,
                    endValue: 9
                })
                return options
            },
            historyShootDayChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.history) {
                    return EMPTY_CHART
                }
                let options =  getLineLongCategoryChartOption(this.historyShootDay, FLOW_SERIES_OPTS)
                options.dataZoom = lf.extend({},DATA_ZOOM_INSIDE,{
                    startValue: options.xAxis.data.length - EACH_SCREEN_COUNT,
                    end: 100
                })
                return options
            },
            historyIncomeTotalChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.history) {
                    return EMPTY_CHART
                }
                let income = this.historyIncomeTotal
                return {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        top: 'middle',
                        left: 30,
                        data: ['前置收入','销售收入']
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '75%',
                            center: ['65%', '50%'],
                            label: {
                                normal: {
                                    show: true,
                                    formatter: '{d}%',
                                    position: 'inner'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {value: income.saleAmtPer, name: '前置收入', selected: true},
                                {value: income.appAmt, name: '销售收入'}
                            ]
                        }
                    ]
                }
            }
        },
        watch: {
            rolePositionId: function(val, oldVal) {
                if (oldVal === '') return
                switchRolePostion(val)
            },
            'regionProvinceMap.incomeAll': {
                deep: true,
                handler: function () {
                    this.refreshDataByIncomeAll()
                }
            },
            'regionProvinceMap.incomeRegion': {
                deep: true,
                handler: function () {
                    this.refreshDataByIncomeRegion()
                }
            },
            'regionProvinceMap.flowShootAll': {
                deep: true,
                handler: function () {
                    this.refreshDataByShootAll()
                }
            },
            'regionProvinceMap.flowShootRegion': {
                deep: true,
                handler: function () {
                    this.refreshDataByShootRegion()
                }
            },
            'regionProvinceMap.historyIncomeDay': {
                deep: true,
                handler: function () {
                    this.refreshDataByThirtyIncome()
                }
            },
            'regionProvinceMap.historyThreeMonthIncome': {
                deep: true,
                handler: function () {
                    this.refreshDataByThreeMonthIncome()
                }
            },
            'regionProvinceMap.historyShootDay': {
                deep: true,
                handler: function () {
                    this.refreshDataByThirtyShoot()
                }
            }
        },
        methods: {
            getAbs: function (value) {
                return isDef(value) ? Math.abs(value) : 0
            },
            isSign: function(value) {
                value = value + ''
                return value[0] !== '-'
            },
            getNumberClassName: function (value) {
                return [this.isSign(value) ? 'number-sign' : 'number-lose']
            },
            getChartTypeTitle(type, text) {
                return type === pageTypeConstant.day ? '查看累积趋势' : '查看' + text
            },
            switchChartType (params) {
                const key = params.key
                const s = this.regionProvinceMap[key]
                s.chartType = s.chartType === chartTypeConstant.day ? chartTypeConstant.acc :chartTypeConstant.day
            },
            calcBarChartHeight: function (options) {
                let height = 0
                let yAxis = options.yAxis
                if (yAxis) {
                    height = yAxis.data.length * 38 + GRID_TOP + GRID_BOTTOM
                }
                return height
            },
            calcBarChartStyle: function (options) {
                return {
                    height: this.calcBarChartHeight(options) + 'px'
                }
            },
            refreshChart: function (key) {
                let self = this
                let chartMap = {
                    income: {
                        prefix: 'incomeChart_',
                        list: ['1','2','3','4']
                    },
                    flow: {
                        prefix: 'flowChart_',
                        list: ['1','2','3','4']
                    },
                    history: {
                        prefix: 'historyChart_',
                        list: ['1']
                    }
                }
                let item = chartMap[key]
                item && this.$nextTick(function () {
                    let prefix = item.prefix
                    item.list.forEach(function (index) {
                        let chart = self.$refs[prefix + index]
                        chart && chart.resize()
                    })
                })
            },
            /*下拉数据*/
            //初始化大区省份列表
            initRegionProvince: function (cb) {
                let self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/queryRegionAndProvince', {}, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.regionProvinceList = (res.data || []).map(function (item) {
                            return {
                                value: item.areaCode,
                                text: item.areaName,
                                children: (item.province || []).map(function (chd) {
                                    return {
                                        value: chd.provinceCode,
                                        text: chd.provinceName
                                    }
                                })
                            }
                        })
                        cityPicker.setData(self.regionProvinceList);
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*收入模块 start*/
            initIncome: function (cb) {
                let self = this
                self.refreshDataByIncome(function () {
                    self.refreshDataByIncomeAll(function () {
                        self.refreshDataByIncomeRegion(function () {
                            cb && cb()
                            self.refreshChart('income')
                        })
                    })
                })
            },
            //收入统计
            refreshDataByIncome: function (cb) {
                let self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/income', {
                    queryDate: this.queryDate.format('yyyy-MM-dd')
                }, function(res) {
                    let data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.incomeTotal = data.incomeTotal || {}
                        self.incomeYesterdayTotal = data.yesterdayIncomeTotal || {}
                        self.incomeLine = mergeSeriesData({
                            toList: data.incomeProduct,
                            fromList:data.yesterdayIncomeProduct,
                            categoryKey: 'productName',
                            valueKey: 'saleAmt'
                        }).filter(filterSeriesByOr).sort(baseSortSeries)

                        self.incomeTravel = mergeSeriesData({
                            toList: data.incomeTravel,
                            fromList:data.yesterdayIncomeTravel,
                            categoryKey: 'travelName',
                            valueKey: 'saleAmt'
                        }).filter(filterSeriesByOr).sort(baseSortSeries)
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //全国收入（实时）
            refreshDataByIncomeAll: function (cb) {
                let self = this
                let regionProvince = this.regionProvinceMap.incomeAll
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/incomeAll', {
                    queryDate: this.queryDate.format('yyyy-MM-dd'),
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    let data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.incomeAll = mergeSeriesData({
                            toList: data.toDay,
                            fromList:data.yesterday,
                            categoryKey: 'hour',
                            valueKey: 'saleAmt'
                        }).sort(function (a, b) {
                            return a.category - b.category
                        })
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //各大区收入
            refreshDataByIncomeRegion: function (cb) {
                let self = this
                let regionProvince = this.regionProvinceMap.incomeRegion
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/incomeRegion', {
                    queryDate: this.queryDate.format('yyyy-MM-dd'),
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    let data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.incomeRegion = mergeSeriesData({
                            toList: (data.toDay || []).map(function (item) {
                                item.areaName = item.areaName || item.provinceName || item.lineName
                                return item
                            }),
                            fromList:(data.yesterday || []).map(function (item) {
                                item.areaName = item.areaName || item.provinceName || item.lineName
                                return item
                            }),
                            categoryKey: 'areaName',
                            valueKey: 'saleAmt'
                        }).filter(filterSeriesByOr).sort(baseSortSeries)
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*收入模块 end*/
            /*流量模块 start*/
            initFlow: function (cb) {
                let self = this
                self.refreshDataByShoot(function () {
                    self.refreshDataByShootAll(function () {
                        self.refreshDataByShootRegion(function () {
                            cb && cb()
                            self.refreshChart('flow')
                        })
                    })
                })
            },
            //拍摄信息统计
            refreshDataByShoot: function (cb) {
                let self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/shoot', {
                    queryDate: this.queryDate.format('yyyy-MM-dd')
                }, function(res) {
                    let data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.flowShootInfo = data.shootInfo || {}
                        self.flowYesterdayShootInfo = data.yesterdayShootInfo || {}
                        self.flowShootLine = mergeSeriesData({
                            toList: data.shootProduct,
                            fromList:data.yesterdayShootProduct,
                            categoryKey: 'productName',
                            valueKey: 'shootPerples'
                        }).filter(filterSeriesByOr).sort(baseSortSeries)

                        self.flowShootTravel = mergeSeriesData({
                            toList: data.shootTravel,
                            fromList:data.yesterdayShootTravel,
                            categoryKey: 'travelName',
                            valueKey: 'shootPerples'
                        }).filter(filterSeriesByOr).sort(baseSortSeries)
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //全国拍摄人数实时
            refreshDataByShootAll: function (cb) {
                let self = this
                let regionProvince = this.regionProvinceMap.flowShootAll
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/shootAll', {
                    queryDate: this.queryDate.format('yyyy-MM-dd'),
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    let data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.flowShootAll = mergeSeriesData({
                            toList: data.toDay,
                            fromList:data.yesterday,
                            categoryKey: 'hour',
                            valueKey: 'shootPerples'
                        }).sort(function (a, b) {
                            return a.category - b.category
                        })
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //大区拍摄人数(实时)
            refreshDataByShootRegion: function (cb) {
                let self = this
                let regionProvince = this.regionProvinceMap.flowShootRegion
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/shootRegion', {
                    queryDate: this.queryDate.format('yyyy-MM-dd'),
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    let data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.flowShootRegion = mergeSeriesData({
                            toList: (data.toDay || []).map(function (item) {
                                item.areaName = item.areaName || item.provinceName || item.lineName
                                return item
                            }),
                            fromList:(data.yesterday || []).map(function (item) {
                                item.areaName = item.areaName || item.provinceName || item.lineName
                                return item
                            }),
                            categoryKey: 'areaName',
                            valueKey: 'shootPerples'
                        }).filter(filterSeriesByOr).sort(baseSortSeries)
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*流量模块 end*/
            /*历史模块 start*/
            initHistory: function (cb) {
                let self = this
                self.refreshDataByHistoryIncome(function () {
                    self.refreshDataByThirtyIncome(function () {
                        self.refreshDataByThreeMonthIncome(function () {
                            self.refreshDataByHistoryShoot(function () {
                                self.refreshDataByThirtyShoot(function () {
                                    self.refreshDataByTravelRanking(function () {
                                        cb && cb()
                                    })
                                })
                            })
                        })
                    })
                })
            },
            goPageMore (params) {
                const pageType = params.pageType
                lf.window.openWindow('statistics/daily-paper-more.html', '../statistics/daily-paper-more.html', {}, {
                    pageType: pageType,
                })
            },
            queryTotalMoreData (options, cb) {
                const {historyDate} = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/totalMore.htm', {
                    startDate: historyDate[0] ? historyDate[0].format('yyyy-MM-dd') : '',
                    endDate: historyDate[1] ? historyDate[1].format('yyyy-MM-dd') : '',
                    ...options
                }, res => {
                    let data
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        data = (res.data || []).map(v => {
                            return {
                                noTruncation: true,
                                category: v.date,
                                value: v.value
                            }
                        })
                    } else {
                        lf.nativeUI.toast(res.msg)
                    }
                    cb && cb(data)
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg)
                })
            },
            //累计收入
            refreshDataByHistoryIncome: function (cb) {
                let self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/historyIncome', {}, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.historyIncomeTotal = res.data || {}
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //近30天每日收入
            refreshDataByThirtyIncome: function (cb) {
                let self = this
                let regionProvince = this.regionProvinceMap.historyIncomeDay
                if (regionProvince.chartType === chartTypeConstant.day) {
                    lf.nativeUI.showWaiting()
                    lf.net.getJSON('newReport/analysisMobile/thirtyIncome', {
                        areaCode: regionProvince.areaCode,
                        provinceCode: regionProvince.provinceCode
                    }, function(res) {
                        lf.nativeUI.closeWaiting()
                        if (res.code === '200') {
                            self.historyIncomeDay = (res.data || []).map(function (item) {
                                return {
                                    noTruncation: true,
                                    category: item.date,
                                    value: item.saleAmt
                                }
                            }).filter(filterSeriesByOr)
                        } else {
                            lf.nativeUI.toast(res.msg)
                        }
                        cb && cb()
                    }, function(error) {
                        lf.nativeUI.closeWaiting()
                        cb && cb()
                        lf.nativeUI.toast(error.msg)
                    })
                } else {
                    this.queryTotalMoreData({
                        type: totalMoreTypeConstant.incomeAcc,
                        areaCode: regionProvince.areaCode,
                        provinceCode: regionProvince.provinceCode
                    },  data => {
                        if (data) {
                            this.historyIncomeDay = data.filter(filterSeriesByOr)
                        }
                        cb && cb()
                    })
                }

            },
            //近3个月收入统计
            refreshDataByThreeMonthIncome: function (cb) {
                let self = this
                let regionProvince = this.regionProvinceMap.historyThreeMonthIncome
                if (regionProvince.chartType === chartTypeConstant.day) {
                    lf.nativeUI.showWaiting()
                    lf.net.getJSON('newReport/analysisMobile/threeMonthIncome', {
                        areaCode: regionProvince.areaCode,
                        provinceCode: regionProvince.provinceCode
                    }, function(res) {
                        let data = res.data || {}
                        lf.nativeUI.closeWaiting()
                        if (res.code === '200') {
                            self.historyThreeMonthIncome = ['1','2','3'].map(function (index) {
                                return {
                                    date: data['date' + index],
                                    totalAmt: data['totalAmt' + index],
                                    amtRate: data['amtRate' + index]
                                }
                            })
                        } else {
                            lf.nativeUI.toast(res.msg)
                        }
                        cb && cb()
                    }, function(error) {
                        lf.nativeUI.closeWaiting()
                        cb && cb()
                        lf.nativeUI.toast(error.msg)
                    })
                } else {
                    lf.nativeUI.showWaiting()
                    lf.net.getJSON('newReport/analysisMobile/threeMonthIncomeTrend.htm', {
                        areaCode: regionProvince.areaCode,
                        provinceCode: regionProvince.provinceCode
                    }, function(res) {
                        lf.nativeUI.closeWaiting()
                        if (res.code === '200') {
                            let seriesOpts = []
                            let listMap =  {}
                            let valuePrefix = 'value_'
                            ;(res.data || []).forEach((item, index) => {
                                seriesOpts.push({
                                    seriesName: item.month,
                                    categoryKey: 'category',
                                    valueKey: valuePrefix + index
                                })
                                ;(item.dataList || []).forEach(({date, value}) => {
                                    if (date) {
                                        let key = date.slice(8)
                                        let temp = listMap[key]
                                        if (!temp) {
                                            temp = listMap[key] = {
                                                category: key
                                            }
                                        }
                                        temp[valuePrefix + index] = value
                                    }
                                })
                            })
                            self.historyThreeMonthIncomeAcc =  {
                                seriesOpts,
                                list: Object.keys(listMap).map(key => {
                                    return listMap[key]
                                })
                            }
                        } else {
                            lf.nativeUI.toast(res.msg)
                        }
                        cb && cb()
                    }, function(error) {
                        lf.nativeUI.closeWaiting()
                        cb && cb()
                        lf.nativeUI.toast(error.msg)
                    })
                }
            },
            //累计拍摄人数
            refreshDataByHistoryShoot: function (cb) {
                let self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/totalShoot', {}, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.historyShootCount = {
                            shoot: isDef(res.data) ? res.data : 0
                        }
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //近30天每日拍摄人数
            refreshDataByThirtyShoot: function (cb) {
                let self = this
                let regionProvince = this.regionProvinceMap.historyShootDay
                if (regionProvince.chartType === chartTypeConstant.day) {
                    lf.nativeUI.showWaiting()
                    lf.net.getJSON('newReport/analysisMobile/thirtyShoot', {
                        areaCode: regionProvince.areaCode,
                        provinceCode: regionProvince.provinceCode
                    }, function(res) {
                        lf.nativeUI.closeWaiting()
                        if (res.code === '200') {
                            self.historyShootDay = (res.data || []).map(function (item) {
                                return {
                                    noTruncation: true,
                                    category: item.hour,
                                    value: item.shootPerples
                                }
                            }).filter(filterSeriesByOr)
                        } else {
                            lf.nativeUI.toast(res.msg)
                        }
                        cb && cb()
                    }, function(error) {
                        lf.nativeUI.closeWaiting()
                        cb && cb()
                        lf.nativeUI.toast(error.msg)
                    })
                } else {
                    this.queryTotalMoreData({
                        type: totalMoreTypeConstant.peopleAcc,
                        areaCode: regionProvince.areaCode,
                        provinceCode: regionProvince.provinceCode
                    },  data => {
                        if (data) {
                            this.historyShootDay = data.filter(filterSeriesByOr)
                        }
                        cb && cb()
                    })
                }
            },
            //旅行社发团人数排行
            refreshDataByTravelRanking: function (cb) {
                let self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/travelRanking', {}, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.historyTravelRanking = res.data || []
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*历史模块 end*/
            init: function (cb) {
                this.initRegionProvince(() => {
                    this.initTabData(cb)
                })
            },
            initTabData (cb) {
                switch (this.pageTypeActive){
                    case pageTypeConstant.income:
                        this.initIncome(cb)
                        break
                    case pageTypeConstant.flow:
                        this.initFlow(cb)
                        break
                    case pageTypeConstant.history:
                        this.initHistory(cb)
                        break
                }
            },
            initMui () {
                const self = this
                Vue.nextTick(function() {
                    self.init(refreshSlider)
                })
                let deceleration = mui.os.ios ? 0.003 : 0.0009;
                mui('.mui-scroll-wrapper').scroll({
                    bounce: false,
                    indicators: true, //是否显示滚动条
                    deceleration: deceleration
                });
                refreshSlider()
                function goPageTop() {
                    mui('#page-scroll').scroll().scrollTo(0,0,0)
                }
                function refreshSlider() {
                    Vue.nextTick(function() {
                        mui('.info-box-mui-slider').slider();
                    })
                }
                function switchTab() {
                    goPageTop()
                    self.initTabData(refreshSlider)
                }

                // 收入
                mui('body').on('tap', '#income', function(){
                    self.pageTypeActive = pageTypeConstant.income
                    switchTab()
                })
                mui('#tab-income').on('tap', '.mui-control-item', function(){
                    self.refreshChart('income')
                })
                mui('body').on('tap', '#incomeAll_RP', function(){
                    cityPicker.show(function(items) {
                        setRegionProvince(self.regionProvinceMap.incomeAll, items)
                    });
                })
                mui('body').on('tap', '#incomeRegion_RP', function(){
                    cityPicker.show(function(items) {
                        setRegionProvince(self.regionProvinceMap.incomeRegion, items)
                    });
                })
                // 流量
                mui('body').on('tap', '#flow', function(){
                    self.pageTypeActive = pageTypeConstant.flow
                    switchTab()
                })
                mui('#tab-flow').on('tap', '.mui-control-item', function(){
                    self.refreshChart('flow')
                })
                mui('body').on('tap', '#flowShootAll_RP', function(){
                    cityPicker.show(function(items) {
                        setRegionProvince(self.regionProvinceMap.flowShootAll, items)
                    });
                })
                mui('body').on('tap', '#flowShootRegion_RP', function(){
                    cityPicker.show(function(items) {
                        setRegionProvince(self.regionProvinceMap.flowShootRegion, items)
                    });
                })
                // 历史
                mui('body').on('tap', '#history', function(){
                    self.pageTypeActive = pageTypeConstant.history
                    switchTab()
                })
                mui('body').on('tap', '#historyIncomeDay_RP', function(){
                    cityPicker.show(function(items) {
                        setRegionProvince(self.regionProvinceMap.historyIncomeDay, items)
                    });
                })
                mui('body').on('tap', '#historyThreeMonthIncome_RP', function(){
                    cityPicker.show(function(items) {
                        setRegionProvince(self.regionProvinceMap.historyThreeMonthIncome, items)
                    });
                })
                mui('body').on('tap', '#historyShootDay_RP', function(){
                    cityPicker.show(function(items) {
                        setRegionProvince(self.regionProvinceMap.historyShootDay, items)
                    });
                })

                lf.event.listener('dailyPaper', function(e) {
                    switchTab();
                    lf.event.fire(lf.window.currentWebview().opener(), 'dailyPaper', {})
                })
            }
        },
        created: function () {
            lf.ready(() => {
                this.initMui()
            })
        }
    }
</script>
<style lang="scss">
    html,
    body {
        background-color: #efeff4;
    }
    .statistics-daily-paper{
        $primary-color: #3CB493;
        .clearfix:before, .clearfix:after {
            content: " ";
            display: table;
        }
        .clearfix:after {
            clear: both;
        }
        .lf{
            float: left;
        }
        .rt{
            float: right;
        }
        .currency{
            top: -2px;
            position: relative;
            &:before{
                content: '￥';
                font-size: 12px;
            }
        }
        .number-sign,.number-lose{
            .sign{
                display: inline-block;
                width: 12px;
                height: 14px;
                background-repeat: no-repeat;
                background-position: center;
            }
            .number{
                &:after{
                    content: '%';
                }
            }
        }

        .number-sign{
            color: #F17175;
            .r-box{
                border-color: #F17175;
            }
            .sign{
                background-image: url("../../assets/images/statistics/arrow-up.png");
            }
        }
        .number-lose{
            color: #81D6BB;
            .r-box{
                border-color: #81D6BB;
            }
            .sign{
                background-image: url("../../assets/images/statistics/arrow-down.png");
            }
        }
        .ring-wrap{
            text-align: center;
            .r-box{
                border-radius: 18px;
                border-width: 1px;
                border-style: solid;
                display: inline-block;
                padding: 2px 12px;
                .number{
                    font-size: 18px;
                }
            }
        }
        .sep-line{
            border-bottom: 1px solid #ddd;
            margin: 5px 0;
        }
        .mui-bar-tab{
            .mui-tab-item{
                height: 62px;
                color: #AAB0B1;
                &.mui-active{
                    color: $primary-color;
                }
                .mui-icon{
                    width: 24px;
                    height: 24px;
                    img{
                        width: 100%;
                    }
                }
            }
        }
        .mui-segmented-control{
            &.mui-segmented-control-inverted{
                background-color: #fff;
                margin-bottom: 5px;
                .mui-control-item {
                    color: #333;
                    &.mui-active{
                        color: inherit;
                        border-bottom: none;
                        .text{
                            display: inline-block;
                            width: 90px;
                            color: $primary-color;
                            border-bottom: 2px solid $primary-color;
                        }
                    }
                }
            }
        }
        .daily-content{
            padding-bottom: 20px;
            .section-box{
                margin-bottom: 5px;
                background-color: #fff;
                .section-title {
                    padding: 18px 14px 16px;
                    color: #919191;
                    .text {
                        float: left;
                        font-size: 15px;
                        color: #666;
                    }
                    .tool {
                        float: right;
                        height: 21px;
                        .item{
                            display: inline-block;
                            height: 21px;
                        }
                        .item + .item {
                            cursor: pointer;
                            margin-left: 10px;
                        }
                        .switchover{
                            padding: 1px 4px;
                        }
                        .icon-more-select{
                            width: 26px;
                            background-repeat: no-repeat;
                            background-position: center;
                            background-size: contain;
                            background-image: url("../../assets/images/statistics/more.png");
                        }
                    }
                }
                .section-content{
                    .echarts{
                        width: 100%;
                        height: 240px;
                    }
                    .echarts.axis-label-long{
                        height: 280px;
                    }
                }
            }
            .info-box-mui-slider{
                margin-bottom: 5px;
            }
            .info-box{
                color: #363636;
                background-color: #fff;
                padding: 20px;
                margin-bottom: 5px;
                position: relative;
                &.center{
                    text-align: center;
                }
                .title{
                    color: #666;
                    font-size: 15px;
                    margin-bottom: 10px;
                }
                .value-wrap{
                    color: #333;
                    height: 24px;
                    line-height: 24px;
                    margin-bottom: 4px;
                    .number{
                        font-size: 20px;
                        font-weight: bold;
                    }
                }
                .single-value{
                    display: block;
                    padding-top: 10px;
                    color: #F17175;
                    font-size: 15px;
                    font-weight: bold;
                    &.currency:before{
                        font-size: 12px;
                    }
                }
                .content{
                    font-size: 24px;
                }
                .check-more{
                    cursor: pointer;
                    position: absolute;
                    top: 22%;
                    right: 10%;
                }
            }
            .list-show-wrap{
                .item{
                    padding: 10px;
                    font-size: 14px;
                    .content{
                        .currency{
                            top: 0;
                        }
                    }
                }
            }
            .list-num-icon-wrap{
                padding-top: 10px;
                .item{
                    color: #333;
                    padding: 8px 14px;
                    font-size: 14px;
                    line-height: 54px;
                    .num,.num-icon{
                        width: 24px;//36px;
                        height: 54px;
                        text-align: center;
                        margin-right: 20px;
                    }
                    .num-icon {
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: contain;
                        &.num-icon-1{
                            background-image: url("../../assets/images/statistics/ranking-first.png");
                        }
                        &.num-icon-2{
                            background-image: url("../../assets/images/statistics/ranking-second.png");
                        }
                        &.num-icon-3{
                            background-image: url("../../assets/images/statistics/ranking-third.png");
                        }
                    }
                }
            }
        }
    }
</style>