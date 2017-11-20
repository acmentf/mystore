import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import _ from "lodash";
import { store } from "@/redux";
import CommonActions from "@/redux/CommonRedux"
import { setTimeout } from "timers";
import request, { basicUrl } from '@/services/request';
import { message } from 'antd';

const { Types, Creators } = createActions({
    sortOrganizeList: ["params"],
    setOrganizes: ['organizes'],
    getOrganizes: (value, type) => {
        return (dispatch, getState) => {
          
            // dispatch(CommonActions.fetching());
            // const response = {
            //     code: "200",
            //     msg: "success",
            //     data: [
            //       {
            //         id: 1,
            //         name: "途忆",
            //         num: 0,
            //         parentId: 0,
            //         positionUserList: [
            //           {
            //             id: 521,
            //             name: "赵占水",
            //             position: "统计报表"
            //           },
            //           {
            //             id: 516,
            //             name: "运维测试",
            //             position: "总经办 途忆全国摄影总监 摄影师 途忆计调总监 统计报表 修图师 绩效考核 华北摄影总监 华东大区经理 湖南城市经理"
            //           },
            //           {
            //             id: 501,
            //             name: "邬金福",
            //             position: "统计报表 绩效考核"
            //           },
            //           {
            //             id: 481,
            //             name: "陈青青",
            //             position: "总经办"
            //           },
            //           {
            //             id: 480,
            //             name: "李彦林",
            //             position: "统计报表 绩效考核"
            //           },
            //           {
            //             id: 472,
            //             name: "尹晋鹏",
            //             position: "渠道 统计报表"
            //           },
            //           {
            //             id: 458,
            //             name: "王炜",
            //             position: "渠道 渠道 统计报表"
            //           },
            //           {
            //             id: 448,
            //             name: "彭莹",
            //             position: "统计报表"
            //           },
            //           {
            //             id: 422,
            //             name: "苏丹丹",
            //             position: "绩效考核"
            //           },
            //           {
            //             id: 383,
            //             name: "张雪莲",
            //             position: "统计报表"
            //           },
            //           {
            //             id: 381,
            //             name: "卢",
            //             position: "统计报表"
            //           },
            //           {
            //             id: 373,
            //             name: "杨薇",
            //             position: "统计报表 绩效考核"
            //           },
            //           {
            //             id: 350,
            //             name: "冯浩",
            //             position: "输出 销售 统计报表"
            //           },
            //           {
            //             id: 336,
            //             name: "易宇",
            //             position: "统计报表"
            //           },
            //           {
            //             id: 335,
            //             name: "张彦伟",
            //             position: "执行经理 统计报表"
            //           },
            //           {
            //             id: 323,
            //             name: "郭翔",
            //             position: "渠道 统计报表"
            //           },
            //           {
            //             id: 288,
            //             name: "周总",
            //             position: "统计报表"
            //           },
            //           {
            //             id: 272,
            //             name: "魏墨",
            //             position: "摄影经理 修图师 统计报表 绩效考核"
            //           },
            //           {
            //             id: 259,
            //             name: "董千歌",
            //             position: "绩效考核"
            //           },
            //           {
            //             id: 258,
            //             name: "马岩峰",
            //             position: "修图师 统计报表"
            //           },
            //           {
            //             id: 256,
            //             name: "刘子文",
            //             position: "修图师"
            //           },
            //           {
            //             id: 250,
            //             name: "杨耀强",
            //             position: "统计报表 途忆全国摄影总监"
            //           },
            //           {
            //             id: 248,
            //             name: "王明",
            //             position: "摄影师 摄影经理 西安修图师 途忆全国摄影总监"
            //           },
            //           {
            //             id: 238,
            //             name: "崔琴盛",
            //             position: "统计报表"
            //           },
            //           {
            //             id: 237,
            //             name: "徐璟",
            //             position: "统计报表"
            //           },
            //           {
            //             id: 233,
            //             name: "董鹤天",
            //             position: "总经办"
            //           },
            //           {
            //             id: 227,
            //             name: "王鸿",
            //             position: "总经办"
            //           },
            //           {
            //             id: 188,
            //             name: "强哥",
            //             position: "摄影师 摄影经理 摄影师 摄影经理 摄影师 途忆全国摄影总监"
            //           },
            //           {
            //             id: 187,
            //             name: "熊勇",
            //             position: "修图师 华北大区经理 总经办 途忆全国摄影总监"
            //           },
            //           {
            //             id: 176,
            //             name: "阿龙",
            //             position: "摄影师 途忆全国摄影总监"
            //           },
            //           {
            //             id: 98,
            //             name: "曲利平",
            //             position: "执行经理 摄影经理 执行经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售 统计报表"
            //           },
            //           {
            //             id: 94,
            //             name: "黄春杨",
            //             position: "执行经理 摄影经理 输出 销售 执行经理 摄影经理 华北大区经理 执行经理 统计报表"
            //           },
            //           {
            //             id: 84,
            //             name: "华仔",
            //             position: "执行经理 摄影经理 摄影主管 途忆全国摄影总监"
            //           },
            //           {
            //             id: 76,
            //             name: "冯玉龙",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 华北修图师 华北摄影总监 摄影师 摄影经理 修图师"
            //           },
            //           {
            //             id: 47,
            //             name: "陈威",
            //             position: "修图师 执行经理 执行主管 执行主管 执行经理 执行经理 执行经理 执行经理 执行人 执行经理 输出 销售 总经办 途忆全国摄影总监"
            //           },
            //           {
            //             id: 3,
            //             name: "王文岐",
            //             position: "华西大区摄影总监 摄影经理 摄影经理 摄影师 摄影经理 修图师 途忆全国摄影总监"
            //           }
            //         ]
            //       },
            //       {
            //         id: 2,
            //         name: "华西",
            //         num: 0,
            //         parentId: 1,
            //         positionUserList: [
            //           {
            //             id: 3,
            //             name: "王文岐",
            //             position: "华西大区摄影总监 摄影经理 摄影经理 摄影师 摄影经理 修图师 途忆全国摄影总监"
            //           }
            //         ]
            //       },
            //       {
            //         id: 3,
            //         name: "华南",
            //         num: 0,
            //         parentId: 1,
            //         positionUserList: []
            //       },
            //       {
            //         id: 4,
            //         name: "青海项目部",
            //         num: 0,
            //         parentId: 2,
            //         positionUserList: [
            //           {
            //             id: 105,
            //             name: "刘强",
            //             position: "摄影师-刘强"
            //           },
            //           {
            //             id: 101,
            //             name: "代鑫",
            //             position: "输出 销售 执行经理 输出 销售 执行经理 输出 销售"
            //           },
            //           {
            //             id: 98,
            //             name: "曲利平",
            //             position: "执行经理 摄影经理 执行经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售 统计报表"
            //           },
            //           {
            //             id: 97,
            //             name: "陈广明",
            //             position: "摄影经理 摄影师"
            //           }
            //         ]
            //       },
            //       {
            //         id: 5,
            //         name: "西安项目部",
            //         num: 0,
            //         parentId: 35,
            //         positionUserList: [
            //           {
            //             id: 503,
            //             name: "梁佳",
            //             position: "渠道"
            //           },
            //           {
            //             id: 502,
            //             name: "曾瑜",
            //             position: "渠道"
            //           },
            //           {
            //             id: 499,
            //             name: "李竞",
            //             position: "渠道"
            //           },
            //           {
            //             id: 488,
            //             name: "王晖",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 477,
            //             name: "徐明远",
            //             position: "渠道"
            //           },
            //           {
            //             id: 476,
            //             name: "徐晓黎",
            //             position: "渠道"
            //           },
            //           {
            //             id: 403,
            //             name: "李飞龙",
            //             position: "渠道"
            //           },
            //           {
            //             id: 370,
            //             name: "杨立",
            //             position: "销售"
            //           },
            //           {
            //             id: 369,
            //             name: "雷盟盟",
            //             position: "销售"
            //           },
            //           {
            //             id: 358,
            //             name: "赵晓龙",
            //             position: "执行经理 渠道 销售 西安城市经理"
            //           },
            //           {
            //             id: 276,
            //             name: "满立全",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 275,
            //             name: "彭林",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 249,
            //             name: "张斌",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 248,
            //             name: "王明",
            //             position: "摄影师 摄影经理 西安修图师 途忆全国摄影总监"
            //           },
            //           {
            //             id: 247,
            //             name: "陈涛",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 229,
            //             name: "满立全",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 224,
            //             name: "王福磊",
            //             position: "执行人"
            //           },
            //           {
            //             id: 223,
            //             name: "王刚",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 205,
            //             name: "郭宏超",
            //             position: "报表统计 执行经理 摄影师 统计报表 输出"
            //           },
            //           {
            //             id: 197,
            //             name: "李根梁",
            //             position: "执行人"
            //           },
            //           {
            //             id: 196,
            //             name: "杨永青",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 195,
            //             name: "初世成 ",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 194,
            //             name: "宋平福 ",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 192,
            //             name: "贾橙",
            //             position: "输出"
            //           },
            //           {
            //             id: 191,
            //             name: "周涛",
            //             position: "执行经理 输出 销售"
            //           },
            //           {
            //             id: 189,
            //             name: "郑麟童",
            //             position: "摄影师 摄影经理 西安修图师"
            //           },
            //           {
            //             id: 137,
            //             name: "杨毅",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 107,
            //             name: "唐田",
            //             position: "渠道"
            //           },
            //           {
            //             id: 106,
            //             name: "段树国",
            //             position: "渠道"
            //           },
            //           {
            //             id: 98,
            //             name: "曲利平",
            //             position: "执行经理 摄影经理 执行经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售 统计报表"
            //           },
            //           {
            //             id: 94,
            //             name: "黄春杨",
            //             position: "执行经理 摄影经理 输出 销售 执行经理 摄影经理 华北大区经理 执行经理 统计报表"
            //           },
            //           {
            //             id: 65,
            //             name: "石恒",
            //             position: "输出 销售"
            //           }
            //         ]
            //       },
            //       {
            //         id: 6,
            //         name: "九黄项目部",
            //         num: 0,
            //         parentId: 2,
            //         positionUserList: [
            //           {
            //             id: 138,
            //             name: "白马拉姆",
            //             position: "执行人-白马拉姆"
            //           },
            //           {
            //             id: 134,
            //             name: "陈昱迅",
            //             position: "执行人-陈昱迅"
            //           },
            //           {
            //             id: 133,
            //             name: "尹涛",
            //             position: "执行人-尹涛"
            //           },
            //           {
            //             id: 132,
            //             name: "陶仕林",
            //             position: "执行人-陶仕林"
            //           },
            //           {
            //             id: 131,
            //             name: "关文彬",
            //             position: "执行人-关文彬"
            //           },
            //           {
            //             id: 130,
            //             name: "陈攀",
            //             position: "执行人"
            //           },
            //           {
            //             id: 129,
            //             name: "黄旭",
            //             position: "执行人"
            //           },
            //           {
            //             id: 128,
            //             name: "彭勇",
            //             position: "执行人"
            //           },
            //           {
            //             id: 127,
            //             name: "黄健成",
            //             position: "执行人"
            //           },
            //           {
            //             id: 126,
            //             name: "张亮",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 125,
            //             name: "巴霍",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 118,
            //             name: "齐兴洲",
            //             position: "执行经理 摄影经理 执行经理 摄影经理 执行经理 摄影经理 华北修图师 华北大区经理 执行经理 摄影经理 执行经理 摄影经理"
            //           },
            //           {
            //             id: 66,
            //             name: "周涛",
            //             position: "执行人-周涛"
            //           },
            //           {
            //             id: 64,
            //             name: "雍桥",
            //             position: "执行人-雍桥"
            //           },
            //           {
            //             id: 63,
            //             name: "蒲蓉",
            //             position: "执行人-蒲蓉"
            //           },
            //           {
            //             id: 57,
            //             name: "刘宏洲",
            //             position: "执行人-刘宏洲"
            //           },
            //           {
            //             id: 39,
            //             name: "杨帆",
            //             position: "执行人-杨帆"
            //           },
            //           {
            //             id: 35,
            //             name: "小陶",
            //             position: "摄影师-小陶"
            //           },
            //           {
            //             id: 34,
            //             name: "啊维",
            //             position: "摄影师-啊维"
            //           },
            //           {
            //             id: 31,
            //             name: "王可鑫",
            //             position: "摄影师-王可鑫"
            //           },
            //           {
            //             id: 29,
            //             name: "罗巧宇",
            //             position: "执行人-罗巧宇"
            //           }
            //         ]
            //       },
            //       {
            //         id: 7,
            //         name: "新疆项目部",
            //         num: 0,
            //         parentId: 2,
            //         positionUserList: []
            //       },
            //       {
            //         id: 8,
            //         name: "桂林项目部",
            //         num: 0,
            //         parentId: 49,
            //         positionUserList: [
            //           {
            //             id: 527,
            //             name: "欧阳琳琳",
            //             position: "输出"
            //           },
            //           {
            //             id: 517,
            //             name: "黄啟潮",
            //             position: "渠道"
            //           },
            //           {
            //             id: 479,
            //             name: "刘菁",
            //             position: "执行经理 桂林城市经理"
            //           },
            //           {
            //             id: 385,
            //             name: "陈明",
            //             position: "执行经理 输出 执行经理 执行主管 执行经理 执行经理"
            //           },
            //           {
            //             id: 382,
            //             name: "刘朋朋",
            //             position: "输出 输出"
            //           },
            //           {
            //             id: 346,
            //             name: "梁小雨",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 345,
            //             name: "陶小博",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 343,
            //             name: "龙国真",
            //             position: "执行经理 渠道 渠道 渠道"
            //           },
            //           {
            //             id: 342,
            //             name: "廖云龙",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 341,
            //             name: "余席龙",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 320,
            //             name: "严鑫",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 318,
            //             name: "宋杰",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 255,
            //             name: "区良雪",
            //             position: "执行经理 输出 销售 执行主管 销售"
            //           },
            //           {
            //             id: 254,
            //             name: "白志成",
            //             position: "摄影师 摄影师 摄影主管 摄影师"
            //           },
            //           {
            //             id: 253,
            //             name: "周海生",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 252,
            //             name: "雷胜杰",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 246,
            //             name: "何振武",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 245,
            //             name: "胡鹏",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 187,
            //             name: "熊勇",
            //             position: "修图师 华北大区经理 总经办 途忆全国摄影总监"
            //           },
            //           {
            //             id: 181,
            //             name: "谢新文",
            //             position: "摄影师 修图师"
            //           },
            //           {
            //             id: 174,
            //             name: "周俊",
            //             position: "修图师 执行人 输出 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行人 执行经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售 执行经理 摄影经理 输出 销售"
            //           },
            //           {
            //             id: 164,
            //             name: "阿东",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 111,
            //             name: "胡曾",
            //             position: "执行经理 执行经理 执行经理 输出 执行经理 华北大区经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 97,
            //             name: "陈广明",
            //             position: "摄影经理 摄影师"
            //           },
            //           {
            //             id: 89,
            //             name: "大福",
            //             position: "摄影师 摄影师 摄影经理"
            //           },
            //           {
            //             id: 87,
            //             name: "阿富",
            //             position: "摄影师-阿富"
            //           },
            //           {
            //             id: 84,
            //             name: "华仔",
            //             position: "执行经理 摄影经理 摄影主管 途忆全国摄影总监"
            //           },
            //           {
            //             id: 76,
            //             name: "冯玉龙",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 华北修图师 华北摄影总监 摄影师 摄影经理 修图师"
            //           },
            //           {
            //             id: 70,
            //             name: "王振群",
            //             position: "摄影师-王振群"
            //           },
            //           {
            //             id: 69,
            //             name: "唐安琪",
            //             position: "执行人-唐安琪 执行经理 销售"
            //           },
            //           {
            //             id: 67,
            //             name: "张鹏1",
            //             position: "执行人-张鹏1 输出 销售 执行主管 摄影主管 输出 销售"
            //           },
            //           {
            //             id: 59,
            //             name: "刘跃",
            //             position: "摄影师-刘跃"
            //           },
            //           {
            //             id: 53,
            //             name: "蒋俊杰",
            //             position: "摄影师-蒋俊杰"
            //           },
            //           {
            //             id: 52,
            //             name: "阿牛",
            //             position: "摄影师-阿牛"
            //           },
            //           {
            //             id: 51,
            //             name: "馨莹",
            //             position: "摄影师-馨莹"
            //           },
            //           {
            //             id: 48,
            //             name: "易思泽",
            //             position: "执行人-易思泽"
            //           },
            //           {
            //             id: 47,
            //             name: "陈威",
            //             position: "修图师 执行经理 执行主管 执行主管 执行经理 执行经理 执行经理 执行经理 执行人 执行经理 输出 销售 总经办 途忆全国摄影总监"
            //           },
            //           {
            //             id: 42,
            //             name: "凯文",
            //             position: "摄影经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 9,
            //         name: "昆明项目部",
            //         num: 0,
            //         parentId: 38,
            //         positionUserList: [
            //           {
            //             id: 421,
            //             name: "罗晓前",
            //             position: "执行经理 执行经理 执行经理 云南城市经理"
            //           },
            //           {
            //             id: 215,
            //             name: "王俊娥",
            //             position: "渠道 输出 销售 渠道 输出 销售 渠道 销售"
            //           },
            //           {
            //             id: 214,
            //             name: "苏珈玉",
            //             position: "执行经理 渠道 输出 销售 执行经理 渠道 销售 执行经理 渠道 销售"
            //           },
            //           {
            //             id: 207,
            //             name: "彭令",
            //             position: "执行经理 执行经理 摄影经理 执行经理 摄影经理 执行经理 执行经理 执行经理 执行经理 摄影经理"
            //           },
            //           {
            //             id: 172,
            //             name: "唐东平",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 171,
            //             name: "贺剑",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 170,
            //             name: "乔柯达",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 169,
            //             name: "刘建平",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 117,
            //             name: "张维成",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 116,
            //             name: "郑伟强",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 109,
            //             name: "马浩",
            //             position: "摄影师-马浩"
            //           },
            //           {
            //             id: 86,
            //             name: "李懿斌",
            //             position: "摄影师-李懿斌"
            //           },
            //           {
            //             id: 83,
            //             name: "罗建红",
            //             position: "摄影师-罗建红"
            //           },
            //           {
            //             id: 74,
            //             name: "刘宏峰",
            //             position: "摄影师-刘宏峰"
            //           },
            //           {
            //             id: 73,
            //             name: "谢特",
            //             position: "摄影经理"
            //           },
            //           {
            //             id: 47,
            //             name: "陈威",
            //             position: "修图师 执行经理 执行主管 执行主管 执行经理 执行经理 执行经理 执行经理 执行人 执行经理 输出 销售 总经办 途忆全国摄影总监"
            //           },
            //           {
            //             id: 40,
            //             name: "曹佳沛",
            //             position: "渠道 输出 销售 渠道 输出 销售 渠道"
            //           },
            //           {
            //             id: 21,
            //             name: "王利强",
            //             position: "执行经理 离职员工"
            //           },
            //           {
            //             id: 3,
            //             name: "王文岐",
            //             position: "华西大区摄影总监 摄影经理 摄影经理 摄影师 摄影经理 修图师 途忆全国摄影总监"
            //           }
            //         ]
            //       },
            //       {
            //         id: 10,
            //         name: "华北",
            //         num: 0,
            //         parentId: 1,
            //         positionUserList: [
            //           {
            //             id: 516,
            //             name: "运维测试",
            //             position: "总经办 途忆全国摄影总监 摄影师 途忆计调总监 统计报表 修图师 绩效考核 华北摄影总监 华东大区经理 湖南城市经理"
            //           },
            //           {
            //             id: 389,
            //             name: "何京郎",
            //             position: "输出 销售 华北修图师 输出"
            //           },
            //           {
            //             id: 187,
            //             name: "熊勇",
            //             position: "修图师 华北大区经理 总经办 途忆全国摄影总监"
            //           },
            //           {
            //             id: 140,
            //             name: "王慧",
            //             position: "华北离职、闲置员工"
            //           },
            //           {
            //             id: 139,
            //             name: "崔雪姣",
            //             position: "华北离职、闲置员工"
            //           },
            //           {
            //             id: 118,
            //             name: "齐兴洲",
            //             position: "执行经理 摄影经理 执行经理 摄影经理 执行经理 摄影经理 华北修图师 华北大区经理 执行经理 摄影经理 执行经理 摄影经理"
            //           },
            //           {
            //             id: 111,
            //             name: "胡曾",
            //             position: "执行经理 执行经理 执行经理 输出 执行经理 华北大区经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 110,
            //             name: "申旭东",
            //             position: "华北离职、闲置员工"
            //           },
            //           {
            //             id: 95,
            //             name: "石越",
            //             position: "华北修图师 输出 销售 输出 销售 输出 销售"
            //           },
            //           {
            //             id: 94,
            //             name: "黄春杨",
            //             position: "执行经理 摄影经理 输出 销售 执行经理 摄影经理 华北大区经理 执行经理 统计报表"
            //           },
            //           {
            //             id: 79,
            //             name: "杨静",
            //             position: "华北离职、闲置员工"
            //           },
            //           {
            //             id: 76,
            //             name: "冯玉龙",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 华北修图师 华北摄影总监 摄影师 摄影经理 修图师"
            //           },
            //           {
            //             id: 2,
            //             name: "彭铭镝",
            //             position: "摄影经理 华北摄影总监"
            //           }
            //         ]
            //       },
            //       {
            //         id: 11,
            //         name: "秦皇岛项目部",
            //         num: 0,
            //         parentId: 10,
            //         positionUserList: [
            //           {
            //             id: 271,
            //             name: "艾猛",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 270,
            //             name: "王欣",
            //             position: " 输出 销售"
            //           },
            //           {
            //             id: 220,
            //             name: "大鹏",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 205,
            //             name: "郭宏超",
            //             position: "报表统计 执行经理 摄影师 统计报表 输出"
            //           },
            //           {
            //             id: 163,
            //             name: "刘浩",
            //             position: "摄影师-刘浩"
            //           },
            //           {
            //             id: 162,
            //             name: "一鸣",
            //             position: "摄影师-一鸣"
            //           },
            //           {
            //             id: 161,
            //             name: "大国",
            //             position: "摄影师 摄影师-大国 摄影师"
            //           },
            //           {
            //             id: 160,
            //             name: "凯文",
            //             position: "摄影师- 凯文"
            //           },
            //           {
            //             id: 159,
            //             name: "孙凯文",
            //             position: "摄影师-孙凯文"
            //           },
            //           {
            //             id: 158,
            //             name: "李刚",
            //             position: "摄影师-李刚"
            //           },
            //           {
            //             id: 157,
            //             name: "伟建",
            //             position: "摄影师- 伟建"
            //           },
            //           {
            //             id: 156,
            //             name: "小伟",
            //             position: "摄影师-小伟"
            //           },
            //           {
            //             id: 155,
            //             name: "小黑",
            //             position: "摄影师- 小黑"
            //           },
            //           {
            //             id: 154,
            //             name: "东明",
            //             position: "摄影师- 东明"
            //           },
            //           {
            //             id: 153,
            //             name: " 方炳盛",
            //             position: "摄影师-方炳盛"
            //           },
            //           {
            //             id: 152,
            //             name: "张猛",
            //             position: "  摄影师-张猛"
            //           },
            //           {
            //             id: 151,
            //             name: "梓豪",
            //             position: "摄影师-梓豪"
            //           },
            //           {
            //             id: 150,
            //             name: "小波",
            //             position: "摄影师- 小波"
            //           },
            //           {
            //             id: 149,
            //             name: "小龙",
            //             position: "摄影经理 摄影师-小龙 摄影师"
            //           },
            //           {
            //             id: 148,
            //             name: "大吉",
            //             position: "摄影师 摄影师-大吉"
            //           },
            //           {
            //             id: 118,
            //             name: "齐兴洲",
            //             position: "执行经理 摄影经理 执行经理 摄影经理 执行经理 摄影经理 华北修图师 华北大区经理 执行经理 摄影经理 执行经理 摄影经理"
            //           },
            //           {
            //             id: 111,
            //             name: "胡曾",
            //             position: "执行经理 执行经理 执行经理 输出 执行经理 华北大区经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 94,
            //             name: "黄春杨",
            //             position: "执行经理 摄影经理 输出 销售 执行经理 摄影经理 华北大区经理 执行经理 统计报表"
            //           },
            //           {
            //             id: 89,
            //             name: "大福",
            //             position: "摄影师 摄影师 摄影经理"
            //           },
            //           {
            //             id: 76,
            //             name: "冯玉龙",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 华北修图师 华北摄影总监 摄影师 摄影经理 修图师"
            //           }
            //         ]
            //       },
            //       {
            //         id: 12,
            //         name: "平遥项目部",
            //         num: 0,
            //         parentId: 45,
            //         positionUserList: [
            //           {
            //             id: 468,
            //             name: "于福亮",
            //             position: "渠道"
            //           },
            //           {
            //             id: 467,
            //             name: "翟旭东",
            //             position: "渠道"
            //           },
            //           {
            //             id: 389,
            //             name: "何京郎",
            //             position: "输出 销售 华北修图师 输出"
            //           },
            //           {
            //             id: 368,
            //             name: "郭志芳",
            //             position: "销售"
            //           },
            //           {
            //             id: 367,
            //             name: "范亚鑫",
            //             position: "销售"
            //           },
            //           {
            //             id: 366,
            //             name: "薛慧芝",
            //             position: "销售"
            //           },
            //           {
            //             id: 362,
            //             name: "陈伟",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 361,
            //             name: "樊江涛",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 360,
            //             name: "阿聪",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 330,
            //             name: "侯存梅",
            //             position: "销售"
            //           },
            //           {
            //             id: 329,
            //             name: "韩爱萍",
            //             position: "销售"
            //           },
            //           {
            //             id: 328,
            //             name: "刘云霞",
            //             position: "销售"
            //           },
            //           {
            //             id: 326,
            //             name: "橙子",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 324,
            //             name: "雨泽",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 323,
            //             name: "郭翔",
            //             position: "渠道 统计报表"
            //           },
            //           {
            //             id: 321,
            //             name: "明明",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 251,
            //             name: "王生梁",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 218,
            //             name: "刘显晨",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 180,
            //             name: "崔根燕",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 179,
            //             name: "王小凹 ",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 178,
            //             name: "大志",
            //             position: "摄影师 摄影经理 摄影师"
            //           },
            //           {
            //             id: 176,
            //             name: "阿龙",
            //             position: "摄影师 途忆全国摄影总监"
            //           },
            //           {
            //             id: 173,
            //             name: "张立新",
            //             position: "执行人-张立新 输出 销售 输出 销售"
            //           },
            //           {
            //             id: 168,
            //             name: "吴鑫",
            //             position: "摄影师-吴鑫 "
            //           },
            //           {
            //             id: 167,
            //             name: "阿凯",
            //             position: "摄影师-阿凯"
            //           },
            //           {
            //             id: 166,
            //             name: "阿超",
            //             position: "摄影师-阿超"
            //           },
            //           {
            //             id: 165,
            //             name: "雷雷",
            //             position: "摄影师-雷雷 "
            //           },
            //           {
            //             id: 118,
            //             name: "齐兴洲",
            //             position: "执行经理 摄影经理 执行经理 摄影经理 执行经理 摄影经理 华北修图师 华北大区经理 执行经理 摄影经理 执行经理 摄影经理"
            //           },
            //           {
            //             id: 111,
            //             name: "胡曾",
            //             position: "执行经理 执行经理 执行经理 输出 执行经理 华北大区经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 96,
            //             name: "秦建波",
            //             position: "执行人-秦建波"
            //           },
            //           {
            //             id: 76,
            //             name: "冯玉龙",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 华北修图师 华北摄影总监 摄影师 摄影经理 修图师"
            //           },
            //           {
            //             id: 25,
            //             name: "秦建波",
            //             position: "执行人-秦建波"
            //           },
            //           {
            //             id: 22,
            //             name: "张鹏",
            //             position: "执行经理 山西城市经理"
            //           },
            //           {
            //             id: 19,
            //             name: "牟洪",
            //             position: "执行人"
            //           }
            //         ]
            //       },
            //       {
            //         id: 13,
            //         name: "海拉尔项目部",
            //         num: 0,
            //         parentId: 10,
            //         positionUserList: [
            //           {
            //             id: 183,
            //             name: "曲庆满",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 182,
            //             name: "牛星",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 173,
            //             name: "张立新",
            //             position: "执行人-张立新 输出 销售 输出 销售"
            //           },
            //           {
            //             id: 147,
            //             name: "白音",
            //             position: "摄影师-白音"
            //           },
            //           {
            //             id: 146,
            //             name: "张路",
            //             position: "摄影师-张路"
            //           },
            //           {
            //             id: 145,
            //             name: "李润泽",
            //             position: "摄影师-李润泽"
            //           },
            //           {
            //             id: 144,
            //             name: "陈英",
            //             position: "摄影师-陈英 "
            //           },
            //           {
            //             id: 143,
            //             name: "周启旺",
            //             position: "摄影师-周启旺"
            //           },
            //           {
            //             id: 142,
            //             name: "刘安祺",
            //             position: "摄影师-刘安祺"
            //           },
            //           {
            //             id: 141,
            //             name: "钱正宇",
            //             position: "摄影师-钱正宇"
            //           },
            //           {
            //             id: 91,
            //             name: "文烁",
            //             position: "摄影经理"
            //           },
            //           {
            //             id: 76,
            //             name: "冯玉龙",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 华北修图师 华北摄影总监 摄影师 摄影经理 修图师"
            //           }
            //         ]
            //       },
            //       {
            //         id: 14,
            //         name: "北京项目部",
            //         num: 0,
            //         parentId: 46,
            //         positionUserList: [
            //           {
            //             id: 382,
            //             name: "刘朋朋",
            //             position: "输出 输出"
            //           },
            //           {
            //             id: 354,
            //             name: "李扬",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 344,
            //             name: "杨永见",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 335,
            //             name: "张彦伟",
            //             position: "执行经理 统计报表"
            //           },
            //           {
            //             id: 325,
            //             name: "李贝隆",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 303,
            //             name: "王瑶",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 292,
            //             name: "罗立强",
            //             position: "渠道 输出 销售"
            //           },
            //           {
            //             id: 280,
            //             name: "兰顺凯",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 269,
            //             name: "张磊",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 264,
            //             name: "晓龙",
            //             position: "摄影经理 摄影经理"
            //           },
            //           {
            //             id: 263,
            //             name: "张峰涛",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 240,
            //             name: "晓飞",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 232,
            //             name: "李立东",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 231,
            //             name: "子墨",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 222,
            //             name: "龙飞",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 221,
            //             name: "吕中正",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 118,
            //             name: "齐兴洲",
            //             position: "执行经理 摄影经理 执行经理 摄影经理 执行经理 摄影经理 华北修图师 华北大区经理 执行经理 摄影经理 执行经理 摄影经理"
            //           },
            //           {
            //             id: 111,
            //             name: "胡曾",
            //             position: "执行经理 执行经理 执行经理 输出 执行经理 华北大区经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 99,
            //             name: "曲志勇",
            //             position: "输出 销售 执行人-曲志勇"
            //           },
            //           {
            //             id: 93,
            //             name: "康旭",
            //             position: "输出 输出 销售 销售 执行人 输出 销售"
            //           },
            //           {
            //             id: 92,
            //             name: "钟涛",
            //             position: "摄影经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 15,
            //         name: "北京主题项目部",
            //         num: 0,
            //         parentId: 28,
            //         positionUserList: [
            //           {
            //             id: 334,
            //             name: "杨奭伯 ",
            //             position: "离职员工 执行经理"
            //           },
            //           {
            //             id: 325,
            //             name: "李贝隆",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 309,
            //             name: "王晓冉",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 308,
            //             name: "梁保国",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 307,
            //             name: "吴鸿烨",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 306,
            //             name: "马小英",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 305,
            //             name: "党霄宇",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 304,
            //             name: "陈祖德",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 303,
            //             name: "王瑶",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 302,
            //             name: "王文乐",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 301,
            //             name: "封婷婷",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 300,
            //             name: "牛猛",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 299,
            //             name: "黄志鹏",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 298,
            //             name: "凡樊",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 297,
            //             name: "王轶文 ",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 294,
            //             name: "郑凯元",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 293,
            //             name: "李洋",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 292,
            //             name: "罗立强",
            //             position: "渠道 输出 销售"
            //           },
            //           {
            //             id: 291,
            //             name: "纪杰",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 290,
            //             name: "李克",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 281,
            //             name: "孙鹏",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 280,
            //             name: "兰顺凯",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 277,
            //             name: "小磊",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 269,
            //             name: "张磊",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 268,
            //             name: " 张涛",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 267,
            //             name: " 鹤轩",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 264,
            //             name: "晓龙",
            //             position: "摄影经理 摄影经理"
            //           },
            //           {
            //             id: 263,
            //             name: "张峰涛",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 262,
            //             name: "程诚",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 261,
            //             name: "郑文斌",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 260,
            //             name: "马辉",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 244,
            //             name: "小峰",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 240,
            //             name: "晓飞",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 239,
            //             name: "王杰",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 236,
            //             name: "无心",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 235,
            //             name: "小宇",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 234,
            //             name: "邵靓",
            //             position: "执行经理"
            //           },
            //           {
            //             id: 222,
            //             name: "龙飞",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 221,
            //             name: "吕中正",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 186,
            //             name: "阳阳",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 184,
            //             name: "王志光",
            //             position: "摄影经理 摄影师 摄影经理 摄影师 摄影经理"
            //           },
            //           {
            //             id: 118,
            //             name: "齐兴洲",
            //             position: "执行经理 摄影经理 执行经理 摄影经理 执行经理 摄影经理 华北修图师 华北大区经理 执行经理 摄影经理 执行经理 摄影经理"
            //           },
            //           {
            //             id: 111,
            //             name: "胡曾",
            //             position: "执行经理 执行经理 执行经理 输出 执行经理 华北大区经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 95,
            //             name: "石越",
            //             position: "华北修图师 输出 销售 输出 销售 输出 销售"
            //           },
            //           {
            //             id: 93,
            //             name: "康旭",
            //             position: "输出 输出 销售 销售 执行人 输出 销售"
            //           }
            //         ]
            //       },
            //       {
            //         id: 16,
            //         name: "赤峰项目部",
            //         num: 0,
            //         parentId: 10,
            //         positionUserList: [
            //           {
            //             id: 185,
            //             name: "斯文",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 184,
            //             name: "王志光",
            //             position: "摄影经理 摄影师 摄影经理 摄影师 摄影经理"
            //           },
            //           {
            //             id: 111,
            //             name: "胡曾",
            //             position: "执行经理 执行经理 执行经理 输出 执行经理 华北大区经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 71,
            //             name: "解悦",
            //             position: "执行人"
            //           }
            //         ]
            //       },
            //       {
            //         id: 17,
            //         name: "长沙研发部",
            //         num: 0,
            //         parentId: 50,
            //         positionUserList: [
            //           {
            //             id: 489,
            //             name: "许勤杰",
            //             position: "输出"
            //           },
            //           {
            //             id: 474,
            //             name: "测试",
            //             position: "渠道"
            //           },
            //           {
            //             id: 408,
            //             name: "郑杨阳",
            //             position: "执行经理 执行经理"
            //           },
            //           {
            //             id: 243,
            //             name: "彭春华",
            //             position: "输出 销售 摄影师"
            //           },
            //           {
            //             id: 205,
            //             name: "郭宏超",
            //             position: "报表统计 执行经理 摄影师 统计报表 输出"
            //           },
            //           {
            //             id: 204,
            //             name: "段胜跃",
            //             position: "摄影师 输出"
            //           },
            //           {
            //             id: 203,
            //             name: "张波",
            //             position: "摄影经理 输出"
            //           },
            //           {
            //             id: 202,
            //             name: "邓波",
            //             position: "执行人 销售"
            //           },
            //           {
            //             id: 201,
            //             name: "何志",
            //             position: "执行人 销售"
            //           },
            //           {
            //             id: 200,
            //             name: "张曙晖",
            //             position: "执行经理"
            //           },
            //           {
            //             id: 2,
            //             name: "彭铭镝",
            //             position: "摄影经理 华北摄影总监"
            //           }
            //         ]
            //       },
            //       {
            //         id: 18,
            //         name: "成都项目部",
            //         num: 0,
            //         parentId: 39,
            //         positionUserList: []
            //       },
            //       {
            //         id: 19,
            //         name: "稻城亚丁项目部",
            //         num: 0,
            //         parentId: 39,
            //         positionUserList: [
            //           {
            //             id: 504,
            //             name: "李艳",
            //             position: "执行经理 执行经理 执行经理 执行经理 执行经理 执行经理"
            //           },
            //           {
            //             id: 475,
            //             name: "王星海",
            //             position: "渠道 渠道 渠道 渠道"
            //           },
            //           {
            //             id: 376,
            //             name: "韩龙",
            //             position: "执行经理 执行经理 输出 销售 执行经理"
            //           },
            //           {
            //             id: 273,
            //             name: "盛铭轩",
            //             position: "执行经理 执行经理 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 摄影经理 执行经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 241,
            //             name: "何天中",
            //             position: "执行经理 输出 销售 执行人 执行经理 输出 销售 执行经理 执行经理 执行经理 四川城市经理"
            //           },
            //           {
            //             id: 217,
            //             name: "陶洛齐",
            //             position: "摄影师 摄影经理"
            //           },
            //           {
            //             id: 216,
            //             name: "郑林",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 209,
            //             name: "李坤译",
            //             position: "渠道 执行经理 渠道 执行经理 渠道 渠道 渠道 渠道"
            //           },
            //           {
            //             id: 207,
            //             name: "彭令",
            //             position: "执行经理 执行经理 摄影经理 执行经理 摄影经理 执行经理 执行经理 执行经理 执行经理 摄影经理"
            //           },
            //           {
            //             id: 174,
            //             name: "周俊",
            //             position: "修图师 执行人 输出 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行人 执行经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售 执行经理 摄影经理 输出 销售"
            //           },
            //           {
            //             id: 101,
            //             name: "代鑫",
            //             position: "输出 销售 执行经理 输出 销售 执行经理 输出 销售"
            //           },
            //           {
            //             id: 62,
            //             name: "赵古欢",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影主管 摄影经理"
            //           },
            //           {
            //             id: 23,
            //             name: "杨康",
            //             position: "执行经理 渠道 执行经理 渠道 执行经理 渠道 渠道 渠道 执行经理 渠道"
            //           },
            //           {
            //             id: 5,
            //             name: "潘文",
            //             position: "摄影经理 摄影师 摄影经理 摄影经理 摄影经理 摄影经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 20,
            //         name: "云南项目部",
            //         num: 0,
            //         parentId: 38,
            //         positionUserList: [
            //           {
            //             id: 421,
            //             name: "罗晓前",
            //             position: "执行经理 执行经理 执行经理 云南城市经理"
            //           },
            //           {
            //             id: 273,
            //             name: "盛铭轩",
            //             position: "执行经理 执行经理 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 摄影经理 执行经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 215,
            //             name: "王俊娥",
            //             position: "渠道 输出 销售 渠道 输出 销售 渠道 销售"
            //           },
            //           {
            //             id: 214,
            //             name: "苏珈玉",
            //             position: "执行经理 渠道 输出 销售 执行经理 渠道 销售 执行经理 渠道 销售"
            //           },
            //           {
            //             id: 207,
            //             name: "彭令",
            //             position: "执行经理 执行经理 摄影经理 执行经理 摄影经理 执行经理 执行经理 执行经理 执行经理 摄影经理"
            //           },
            //           {
            //             id: 62,
            //             name: "赵古欢",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影主管 摄影经理"
            //           },
            //           {
            //             id: 40,
            //             name: "曹佳沛",
            //             position: "渠道 输出 销售 渠道 输出 销售 渠道"
            //           },
            //           {
            //             id: 6,
            //             name: "李刚",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 5,
            //             name: "潘文",
            //             position: "摄影经理 摄影师 摄影经理 摄影经理 摄影经理 摄影经理"
            //           },
            //           {
            //             id: 3,
            //             name: "王文岐",
            //             position: "华西大区摄影总监 摄影经理 摄影经理 摄影师 摄影经理 修图师 途忆全国摄影总监"
            //           }
            //         ]
            //       },
            //       {
            //         id: 21,
            //         name: "泸沽湖项目部",
            //         num: 0,
            //         parentId: 38,
            //         positionUserList: [
            //           {
            //             id: 421,
            //             name: "罗晓前",
            //             position: "执行经理 执行经理 执行经理 云南城市经理"
            //           },
            //           {
            //             id: 340,
            //             name: "庞春",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 331,
            //             name: "肖林峰",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 322,
            //             name: "林志华",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 319,
            //             name: "刘建",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 296,
            //             name: "陈利朋",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 287,
            //             name: "李岩",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 286,
            //             name: "陈英伟",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 285,
            //             name: "郭于洋",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 284,
            //             name: "周小龙",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 279,
            //             name: "鲁伟",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 278,
            //             name: "伍磊 ",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 274,
            //             name: "李嘉庆",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 273,
            //             name: "盛铭轩",
            //             position: "执行经理 执行经理 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 摄影经理 执行经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 266,
            //             name: "宋观辉",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 265,
            //             name: "李松林",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 215,
            //             name: "王俊娥",
            //             position: "渠道 输出 销售 渠道 输出 销售 渠道 销售"
            //           },
            //           {
            //             id: 214,
            //             name: "苏珈玉",
            //             position: "执行经理 渠道 输出 销售 执行经理 渠道 销售 执行经理 渠道 销售"
            //           },
            //           {
            //             id: 213,
            //             name: "张雪",
            //             position: "执行人 输出"
            //           },
            //           {
            //             id: 212,
            //             name: "张鹏",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 211,
            //             name: "杨召",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 210,
            //             name: "曾晓波",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 207,
            //             name: "彭令",
            //             position: "执行经理 执行经理 摄影经理 执行经理 摄影经理 执行经理 执行经理 执行经理 执行经理 摄影经理"
            //           },
            //           {
            //             id: 136,
            //             name: "张晓龙",
            //             position: "销售"
            //           },
            //           {
            //             id: 135,
            //             name: "曾奎",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 124,
            //             name: "张建军",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 123,
            //             name: "刘茂苑",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 122,
            //             name: "江渗发",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 121,
            //             name: "卢迪",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 120,
            //             name: "朱垒",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 119,
            //             name: "董建",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 62,
            //             name: "赵古欢",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影主管 摄影经理"
            //           },
            //           {
            //             id: 46,
            //             name: "阿左",
            //             position: "摄影师 摄影经理"
            //           },
            //           {
            //             id: 41,
            //             name: "采臣",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 40,
            //             name: "曹佳沛",
            //             position: "渠道 输出 销售 渠道 输出 销售 渠道"
            //           },
            //           {
            //             id: 36,
            //             name: "叶帅",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 20,
            //             name: "罗腾",
            //             position: "执行经理 销售"
            //           },
            //           {
            //             id: 5,
            //             name: "潘文",
            //             position: "摄影经理 摄影师 摄影经理 摄影经理 摄影经理 摄影经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 22,
            //         name: "成都周边项目部",
            //         num: 0,
            //         parentId: 39,
            //         positionUserList: [
            //           {
            //             id: 504,
            //             name: "李艳",
            //             position: "执行经理 执行经理 执行经理 执行经理 执行经理 执行经理"
            //           },
            //           {
            //             id: 475,
            //             name: "王星海",
            //             position: "渠道 渠道 渠道 渠道"
            //           },
            //           {
            //             id: 376,
            //             name: "韩龙",
            //             position: "执行经理 执行经理 输出 销售 执行经理"
            //           },
            //           {
            //             id: 355,
            //             name: "王皓",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 352,
            //             name: "张奇",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 313,
            //             name: "老辉",
            //             position: "摄影师 离职员工"
            //           },
            //           {
            //             id: 273,
            //             name: "盛铭轩",
            //             position: "执行经理 执行经理 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 摄影经理 执行经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 241,
            //             name: "何天中",
            //             position: "执行经理 输出 销售 执行人 执行经理 输出 销售 执行经理 执行经理 执行经理 四川城市经理"
            //           },
            //           {
            //             id: 209,
            //             name: "李坤译",
            //             position: "渠道 执行经理 渠道 执行经理 渠道 渠道 渠道 渠道"
            //           },
            //           {
            //             id: 207,
            //             name: "彭令",
            //             position: "执行经理 执行经理 摄影经理 执行经理 摄影经理 执行经理 执行经理 执行经理 执行经理 摄影经理"
            //           },
            //           {
            //             id: 174,
            //             name: "周俊",
            //             position: "修图师 执行人 输出 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行人 执行经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售 执行经理 摄影经理 输出 销售"
            //           },
            //           {
            //             id: 114,
            //             name: "吴连侠",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 100,
            //             name: "张鹏",
            //             position: "执行人 执行经理 输出 销售"
            //           },
            //           {
            //             id: 62,
            //             name: "赵古欢",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影主管 摄影经理"
            //           },
            //           {
            //             id: 38,
            //             name: "袁语涛",
            //             position: "摄影师 摄影师 摄影师"
            //           },
            //           {
            //             id: 37,
            //             name: "刘路华",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 23,
            //             name: "杨康",
            //             position: "执行经理 渠道 执行经理 渠道 执行经理 渠道 渠道 渠道 执行经理 渠道"
            //           },
            //           {
            //             id: 8,
            //             name: "郑伟",
            //             position: "摄影师 摄影经理 摄影师 摄影经理 摄影经理 摄影主管"
            //           },
            //           {
            //             id: 5,
            //             name: "潘文",
            //             position: "摄影经理 摄影师 摄影经理 摄影经理 摄影经理 摄影经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 23,
            //         name: "海螺沟项目部",
            //         num: 0,
            //         parentId: 39,
            //         positionUserList: [
            //           {
            //             id: 504,
            //             name: "李艳",
            //             position: "执行经理 执行经理 执行经理 执行经理 执行经理 执行经理"
            //           },
            //           {
            //             id: 475,
            //             name: "王星海",
            //             position: "渠道 渠道 渠道 渠道"
            //           },
            //           {
            //             id: 465,
            //             name: "瞿强",
            //             position: "执行经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售"
            //           },
            //           {
            //             id: 376,
            //             name: "韩龙",
            //             position: "执行经理 执行经理 输出 销售 执行经理"
            //           },
            //           {
            //             id: 273,
            //             name: "盛铭轩",
            //             position: "执行经理 执行经理 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 摄影经理 执行经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 241,
            //             name: "何天中",
            //             position: "执行经理 输出 销售 执行人 执行经理 输出 销售 执行经理 执行经理 执行经理 四川城市经理"
            //           },
            //           {
            //             id: 209,
            //             name: "李坤译",
            //             position: "渠道 执行经理 渠道 执行经理 渠道 渠道 渠道 渠道"
            //           },
            //           {
            //             id: 208,
            //             name: "郑伟",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 207,
            //             name: "彭令",
            //             position: "执行经理 执行经理 摄影经理 执行经理 摄影经理 执行经理 执行经理 执行经理 执行经理 摄影经理"
            //           },
            //           {
            //             id: 174,
            //             name: "周俊",
            //             position: "修图师 执行人 输出 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行人 执行经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售 执行经理 摄影经理 输出 销售"
            //           },
            //           {
            //             id: 113,
            //             name: "吴亮",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 104,
            //             name: "萧世杰",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 101,
            //             name: "代鑫",
            //             position: "输出 销售 执行经理 输出 销售 执行经理 输出 销售"
            //           },
            //           {
            //             id: 62,
            //             name: "赵古欢",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影主管 摄影经理"
            //           },
            //           {
            //             id: 38,
            //             name: "袁语涛",
            //             position: "摄影师 摄影师 摄影师"
            //           },
            //           {
            //             id: 23,
            //             name: "杨康",
            //             position: "执行经理 渠道 执行经理 渠道 执行经理 渠道 渠道 渠道 执行经理 渠道"
            //           },
            //           {
            //             id: 8,
            //             name: "郑伟",
            //             position: "摄影师 摄影经理 摄影师 摄影经理 摄影经理 摄影主管"
            //           },
            //           {
            //             id: 7,
            //             name: "曾宇",
            //             position: "摄影师 摄影经理"
            //           },
            //           {
            //             id: 5,
            //             name: "潘文",
            //             position: "摄影经理 摄影师 摄影经理 摄影经理 摄影经理 摄影经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 24,
            //         name: "重庆项目部",
            //         num: 0,
            //         parentId: 39,
            //         positionUserList: [
            //           {
            //             id: 273,
            //             name: "盛铭轩",
            //             position: "执行经理 执行经理 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 摄影经理 执行经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 207,
            //             name: "彭令",
            //             position: "执行经理 执行经理 摄影经理 执行经理 摄影经理 执行经理 执行经理 执行经理 执行经理 摄影经理"
            //           },
            //           {
            //             id: 23,
            //             name: "杨康",
            //             position: "执行经理 渠道 执行经理 渠道 执行经理 渠道 渠道 渠道 执行经理 渠道"
            //           }
            //         ]
            //       },
            //       {
            //         id: 25,
            //         name: "阳朔人文大印项目部",
            //         num: 0,
            //         parentId: 49,
            //         positionUserList: [
            //           {
            //             id: 385,
            //             name: "陈明",
            //             position: "执行经理 输出 执行经理 执行主管 执行经理 执行经理"
            //           },
            //           {
            //             id: 343,
            //             name: "龙国真",
            //             position: "执行经理 渠道 渠道 渠道"
            //           },
            //           {
            //             id: 255,
            //             name: "区良雪",
            //             position: "执行经理 输出 销售 执行主管 销售"
            //           },
            //           {
            //             id: 246,
            //             name: "何振武",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 226,
            //             name: "桓公",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 164,
            //             name: "阿东",
            //             position: "摄影师 摄影师"
            //           },
            //           {
            //             id: 84,
            //             name: "华仔",
            //             position: "执行经理 摄影经理 摄影主管 途忆全国摄影总监"
            //           },
            //           {
            //             id: 67,
            //             name: "张鹏1",
            //             position: "执行人-张鹏1 输出 销售 执行主管 摄影主管 输出 销售"
            //           },
            //           {
            //             id: 47,
            //             name: "陈威",
            //             position: "修图师 执行经理 执行主管 执行主管 执行经理 执行经理 执行经理 执行经理 执行人 执行经理 输出 销售 总经办 途忆全国摄影总监"
            //           }
            //         ]
            //       },
            //       {
            //         id: 26,
            //         name: "阳朔一日游项目部",
            //         num: 0,
            //         parentId: 49,
            //         positionUserList: [
            //           {
            //             id: 343,
            //             name: "龙国真",
            //             position: "执行经理 渠道 渠道 渠道"
            //           },
            //           {
            //             id: 230,
            //             name: "李文杰",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 47,
            //             name: "陈威",
            //             position: "修图师 执行经理 执行主管 执行主管 执行经理 执行经理 执行经理 执行经理 执行人 执行经理 输出 销售 总经办 途忆全国摄影总监"
            //           }
            //         ]
            //       },
            //       {
            //         id: 28,
            //         name: "主题旅游事业部",
            //         num: 0,
            //         parentId: 0,
            //         positionUserList: []
            //       },
            //       {
            //         id: 30,
            //         name: "华东",
            //         num: 0,
            //         parentId: 1,
            //         positionUserList: [
            //           {
            //             id: 516,
            //             name: "运维测试",
            //             position: "总经办 途忆全国摄影总监 摄影师 途忆计调总监 统计报表 修图师 绩效考核 华北摄影总监 华东大区经理 湖南城市经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 31,
            //         name: "上海项目部",
            //         num: 0,
            //         parentId: 57,
            //         positionUserList: [
            //           {
            //             id: 349,
            //             name: "徐业才",
            //             position: "执行人"
            //           },
            //           {
            //             id: 282,
            //             name: "许行洲",
            //             position: "渠道"
            //           },
            //           {
            //             id: 188,
            //             name: "强哥",
            //             position: "摄影师 摄影经理 摄影师 摄影经理 摄影师 途忆全国摄影总监"
            //           },
            //           {
            //             id: 94,
            //             name: "黄春杨",
            //             position: "执行经理 摄影经理 输出 销售 执行经理 摄影经理 华北大区经理 执行经理 统计报表"
            //           }
            //         ]
            //       },
            //       {
            //         id: 32,
            //         name: "北京",
            //         num: 0,
            //         parentId: 1,
            //         positionUserList: [
            //           {
            //             id: 333,
            //             name: "赵海成",
            //             position: "销售总监"
            //           },
            //           {
            //             id: 332,
            //             name: "张彦伟",
            //             position: "渠道总监"
            //           }
            //         ]
            //       },
            //       {
            //         id: 33,
            //         name: "海南项目部",
            //         num: 0,
            //         parentId: 47,
            //         positionUserList: [
            //           {
            //             id: 519,
            //             name: "云聘",
            //             position: "执行经理 销售"
            //           },
            //           {
            //             id: 518,
            //             name: "夏飞",
            //             position: "销售"
            //           },
            //           {
            //             id: 458,
            //             name: "王炜",
            //             position: "渠道 渠道 统计报表"
            //           },
            //           {
            //             id: 417,
            //             name: "王美",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 385,
            //             name: "陈明",
            //             position: "执行经理 输出 执行经理 执行主管 执行经理 执行经理"
            //           },
            //           {
            //             id: 219,
            //             name: "原利平",
            //             position: "执行经理 海南城市经理"
            //           },
            //           {
            //             id: 193,
            //             name: "郑军",
            //             position: "执行经理"
            //           },
            //           {
            //             id: 178,
            //             name: "大志",
            //             position: "摄影师 摄影经理 摄影师"
            //           },
            //           {
            //             id: 177,
            //             name: "李聪",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 98,
            //             name: "曲利平",
            //             position: "执行经理 摄影经理 执行经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售 统计报表"
            //           },
            //           {
            //             id: 94,
            //             name: "黄春杨",
            //             position: "执行经理 摄影经理 输出 销售 执行经理 摄影经理 华北大区经理 执行经理 统计报表"
            //           },
            //           {
            //             id: 90,
            //             name: "赵天",
            //             position: "摄影师 摄影经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 34,
            //         name: "福建项目部",
            //         num: 0,
            //         parentId: 48,
            //         positionUserList: [
            //           {
            //             id: 423,
            //             name: "何太昌",
            //             position: "执行经理 执行经理"
            //           },
            //           {
            //             id: 408,
            //             name: "郑杨阳",
            //             position: "执行经理 执行经理"
            //           },
            //           {
            //             id: 407,
            //             name: "陈赢",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 406,
            //             name: "汪书伟",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 389,
            //             name: "何京郎",
            //             position: "输出 销售 华北修图师 输出"
            //           },
            //           {
            //             id: 385,
            //             name: "陈明",
            //             position: "执行经理 输出 执行经理 执行主管 执行经理 执行经理"
            //           },
            //           {
            //             id: 375,
            //             name: "杨恩吉",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 372,
            //             name: "陈佳淇",
            //             position: "销售 输出 销售"
            //           },
            //           {
            //             id: 363,
            //             name: "钱炜强",
            //             position: "执行经理 渠道 福建城市经理"
            //           },
            //           {
            //             id: 184,
            //             name: "王志光",
            //             position: "摄影经理 摄影师 摄影经理 摄影师 摄影经理"
            //           },
            //           {
            //             id: 161,
            //             name: "大国",
            //             position: "摄影师 摄影师-大国 摄影师"
            //           },
            //           {
            //             id: 149,
            //             name: "小龙",
            //             position: "摄影经理 摄影师-小龙 摄影师"
            //           },
            //           {
            //             id: 95,
            //             name: "石越",
            //             position: "华北修图师 输出 销售 输出 销售 输出 销售"
            //           },
            //           {
            //             id: 76,
            //             name: "冯玉龙",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 华北修图师 华北摄影总监 摄影师 摄影经理 修图师"
            //           }
            //         ]
            //       },
            //       {
            //         id: 35,
            //         name: "西安",
            //         num: 0,
            //         parentId: 2,
            //         positionUserList: [
            //           {
            //             id: 471,
            //             name: "赵鸿祥",
            //             position: "渠道"
            //           },
            //           {
            //             id: 470,
            //             name: "陈永石",
            //             position: "渠道"
            //           },
            //           {
            //             id: 469,
            //             name: "徐向中",
            //             position: "渠道"
            //           },
            //           {
            //             id: 363,
            //             name: "钱炜强",
            //             position: "执行经理 渠道 福建城市经理"
            //           },
            //           {
            //             id: 358,
            //             name: "赵晓龙",
            //             position: "执行经理 渠道 销售 西安城市经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 36,
            //         name: "峨眉山项目部",
            //         num: 0,
            //         parentId: 39,
            //         positionUserList: [
            //           {
            //             id: 504,
            //             name: "李艳",
            //             position: "执行经理 执行经理 执行经理 执行经理 执行经理 执行经理"
            //           },
            //           {
            //             id: 475,
            //             name: "王星海",
            //             position: "渠道 渠道 渠道 渠道"
            //           },
            //           {
            //             id: 465,
            //             name: "瞿强",
            //             position: "执行经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售"
            //           },
            //           {
            //             id: 273,
            //             name: "盛铭轩",
            //             position: "执行经理 执行经理 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 摄影经理 执行经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 241,
            //             name: "何天中",
            //             position: "执行经理 输出 销售 执行人 执行经理 输出 销售 执行经理 执行经理 执行经理 四川城市经理"
            //           },
            //           {
            //             id: 209,
            //             name: "李坤译",
            //             position: "渠道 执行经理 渠道 执行经理 渠道 渠道 渠道 渠道"
            //           },
            //           {
            //             id: 174,
            //             name: "周俊",
            //             position: "修图师 执行人 输出 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行人 执行经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售 执行经理 摄影经理 输出 销售"
            //           },
            //           {
            //             id: 62,
            //             name: "赵古欢",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影主管 摄影经理"
            //           },
            //           {
            //             id: 38,
            //             name: "袁语涛",
            //             position: "摄影师 摄影师 摄影师"
            //           },
            //           {
            //             id: 23,
            //             name: "杨康",
            //             position: "执行经理 渠道 执行经理 渠道 执行经理 渠道 渠道 渠道 执行经理 渠道"
            //           },
            //           {
            //             id: 8,
            //             name: "郑伟",
            //             position: "摄影师 摄影经理 摄影师 摄影经理 摄影经理 摄影主管"
            //           }
            //         ]
            //       },
            //       {
            //         id: 37,
            //         name: "西南",
            //         num: 0,
            //         parentId: 1,
            //         positionUserList: [
            //           {
            //             id: 214,
            //             name: "苏珈玉",
            //             position: "执行经理 渠道 输出 销售 执行经理 渠道 销售 执行经理 渠道 销售"
            //           },
            //           {
            //             id: 20,
            //             name: "罗腾",
            //             position: "执行经理 销售"
            //           }
            //         ]
            //       },
            //       {
            //         id: 38,
            //         name: "云南",
            //         num: 0,
            //         parentId: 37,
            //         positionUserList: [
            //           {
            //             id: 421,
            //             name: "罗晓前",
            //             position: "执行经理 执行经理 执行经理 云南城市经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 39,
            //         name: "四川",
            //         num: 0,
            //         parentId: 37,
            //         positionUserList: [
            //           {
            //             id: 241,
            //             name: "何天中",
            //             position: "执行经理 输出 销售 执行人 执行经理 输出 销售 执行经理 执行经理 执行经理 四川城市经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 40,
            //         name: "离职员工部",
            //         num: 0,
            //         parentId: 1,
            //         positionUserList: [
            //           {
            //             id: 482,
            //             name: "刘雪亮",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 395,
            //             name: "苗凯",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 379,
            //             name: "小新",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 371,
            //             name: "廖建才",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 351,
            //             name: "唐薇",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 347,
            //             name: "田野",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 339,
            //             name: "祥子",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 338,
            //             name: "阿k",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 334,
            //             name: "杨奭伯 ",
            //             position: "离职员工 执行经理"
            //           },
            //           {
            //             id: 327,
            //             name: "陈兴灿",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 317,
            //             name: "乔治",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 316,
            //             name: "王超仲",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 315,
            //             name: "艾伦",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 314,
            //             name: "艾凡",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 313,
            //             name: "老辉",
            //             position: "摄影师 离职员工"
            //           },
            //           {
            //             id: 312,
            //             name: "周伟",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 311,
            //             name: "周枫",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 310,
            //             name: "肖斌",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 295,
            //             name: "翟晓波",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 289,
            //             name: "黄术杰",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 283,
            //             name: "高博",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 257,
            //             name: "代玉杰",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 228,
            //             name: "卢沭霖",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 82,
            //             name: "王彬",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 81,
            //             name: "刘丽",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 72,
            //             name: "吴明星",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 33,
            //             name: "张子松",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 32,
            //             name: "强子",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 30,
            //             name: "付宏伟",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 24,
            //             name: "郑泞忠",
            //             position: "离职员工"
            //           },
            //           {
            //             id: 21,
            //             name: "王利强",
            //             position: "执行经理 离职员工"
            //           },
            //           {
            //             id: 9,
            //             name: "木子",
            //             position: "离职员工"
            //           }
            //         ]
            //       },
            //       {
            //         id: 42,
            //         name: "海外",
            //         num: 0,
            //         parentId: 1,
            //         positionUserList: []
            //       },
            //       {
            //         id: 43,
            //         name: "印尼",
            //         num: 0,
            //         parentId: 42,
            //         positionUserList: [
            //           {
            //             id: 387,
            //             name: "沈嘉铭",
            //             position: "执行经理 输出 销售 印尼城市经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 44,
            //         name: "巴厘岛项目部",
            //         num: 0,
            //         parentId: 43,
            //         positionUserList: [
            //           {
            //             id: 472,
            //             name: "尹晋鹏",
            //             position: "渠道 统计报表"
            //           },
            //           {
            //             id: 441,
            //             name: "Yusfinvs",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 440,
            //             name: "Ropih",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 439,
            //             name: "Iyonx",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 438,
            //             name: "Baskara",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 437,
            //             name: "文子",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 436,
            //             name: "Agung",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 435,
            //             name: "Pasek",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 434,
            //             name: "Andre",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 433,
            //             name: "Willy",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 432,
            //             name: "Aris",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 431,
            //             name: "AJ",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 430,
            //             name: "David",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 420,
            //             name: "Herman",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 402,
            //             name: "Mr. Agung",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 401,
            //             name: "Mr. Aris",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 400,
            //             name: "Mr. Daniel",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 399,
            //             name: "Mr. Andre",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 398,
            //             name: "Mr. Baskara",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 397,
            //             name: "Mr. Pasek",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 396,
            //             name: "巴厘岛摄影师1",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 388,
            //             name: "Hardi",
            //             position: "执行经理 摄影经理 输出 销售"
            //           },
            //           {
            //             id: 387,
            //             name: "沈嘉铭",
            //             position: "执行经理 输出 销售 印尼城市经理"
            //           },
            //           {
            //             id: 188,
            //             name: "强哥",
            //             position: "摄影师 摄影经理 摄影师 摄影经理 摄影师 途忆全国摄影总监"
            //           },
            //           {
            //             id: 98,
            //             name: "曲利平",
            //             position: "执行经理 摄影经理 执行经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售 统计报表"
            //           },
            //           {
            //             id: 95,
            //             name: "石越",
            //             position: "华北修图师 输出 销售 输出 销售 输出 销售"
            //           },
            //           {
            //             id: 47,
            //             name: "陈威",
            //             position: "修图师 执行经理 执行主管 执行主管 执行经理 执行经理 执行经理 执行经理 执行人 执行经理 输出 销售 总经办 途忆全国摄影总监"
            //           },
            //           {
            //             id: 3,
            //             name: "王文岐",
            //             position: "华西大区摄影总监 摄影经理 摄影经理 摄影师 摄影经理 修图师 途忆全国摄影总监"
            //           }
            //         ]
            //       },
            //       {
            //         id: 45,
            //         name: "山西",
            //         num: 0,
            //         parentId: 10,
            //         positionUserList: [
            //           {
            //             id: 22,
            //             name: "张鹏",
            //             position: "执行经理 山西城市经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 46,
            //         name: "北京",
            //         num: 0,
            //         parentId: 32,
            //         positionUserList: [
            //           {
            //             id: 520,
            //             name: "刘哲",
            //             position: "北京城市经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 47,
            //         name: "海南",
            //         num: 0,
            //         parentId: 3,
            //         positionUserList: [
            //           {
            //             id: 219,
            //             name: "原利平",
            //             position: "执行经理 海南城市经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 48,
            //         name: "福建",
            //         num: 0,
            //         parentId: 30,
            //         positionUserList: [
            //           {
            //             id: 363,
            //             name: "钱炜强",
            //             position: "执行经理 渠道 福建城市经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 49,
            //         name: "桂林",
            //         num: 0,
            //         parentId: 3,
            //         positionUserList: [
            //           {
            //             id: 479,
            //             name: "刘菁",
            //             position: "执行经理 桂林城市经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 50,
            //         name: "湖南",
            //         num: 0,
            //         parentId: 3,
            //         positionUserList: [
            //           {
            //             id: 516,
            //             name: "运维测试",
            //             position: "总经办 途忆全国摄影总监 摄影师 途忆计调总监 统计报表 修图师 绩效考核 华北摄影总监 华东大区经理 湖南城市经理"
            //           },
            //           {
            //             id: 529,
            //             name: "任雷",
            //             position: "渠道"
            //           },
            //           {
            //             id: 530,
            //             name: "任雷理",
            //             position: "渠道经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 51,
            //         name: "杭州项目部",
            //         num: 0,
            //         parentId: 52,
            //         positionUserList: [
            //           {
            //             id: 487,
            //             name: "赵洪霞",
            //             position: "执行经理"
            //           },
            //           {
            //             id: 486,
            //             name: "王川宁",
            //             position: "销售"
            //           },
            //           {
            //             id: 485,
            //             name: "杜加水",
            //             position: "摄影师 输出"
            //           },
            //           {
            //             id: 484,
            //             name: "陆天",
            //             position: "销售"
            //           },
            //           {
            //             id: 473,
            //             name: "景绍春",
            //             position: "渠道 渠道"
            //           },
            //           {
            //             id: 454,
            //             name: "朱妍艳",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 447,
            //             name: "李俊",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 426,
            //             name: "戈运格",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 425,
            //             name: "谢国富",
            //             position: "输出 执行经理 输出 销售"
            //           },
            //           {
            //             id: 424,
            //             name: "陈贤录",
            //             position: "执行经理"
            //           },
            //           {
            //             id: 423,
            //             name: "何太昌",
            //             position: "执行经理 执行经理"
            //           },
            //           {
            //             id: 412,
            //             name: "李欣",
            //             position: "摄影经理"
            //           },
            //           {
            //             id: 410,
            //             name: "童力",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 372,
            //             name: "陈佳淇",
            //             position: "销售 输出 销售"
            //           },
            //           {
            //             id: 272,
            //             name: "魏墨",
            //             position: "摄影经理 修图师 统计报表 绩效考核"
            //           },
            //           {
            //             id: 254,
            //             name: "白志成",
            //             position: "摄影师 摄影师 摄影主管 摄影师"
            //           },
            //           {
            //             id: 190,
            //             name: "邢伟",
            //             position: "摄影师"
            //           },
            //           {
            //             id: 184,
            //             name: "王志光",
            //             position: "摄影经理 摄影师 摄影经理 摄影师 摄影经理"
            //           },
            //           {
            //             id: 47,
            //             name: "陈威",
            //             position: "修图师 执行经理 执行主管 执行主管 执行经理 执行经理 执行经理 执行经理 执行人 执行经理 输出 销售 总经办 途忆全国摄影总监"
            //           }
            //         ]
            //       },
            //       {
            //         id: 52,
            //         name: "杭州",
            //         num: 0,
            //         parentId: 30,
            //         positionUserList: []
            //       },
            //       {
            //         id: 53,
            //         name: "徐州项目部",
            //         num: 0,
            //         parentId: 62,
            //         positionUserList: [
            //           {
            //             id: 473,
            //             name: "景绍春",
            //             position: "渠道 渠道"
            //           },
            //           {
            //             id: 425,
            //             name: "谢国富",
            //             position: "输出 执行经理 输出 销售"
            //           },
            //           {
            //             id: 413,
            //             name: "章瑜聪",
            //             position: "输出 销售"
            //           },
            //           {
            //             id: 254,
            //             name: "白志成",
            //             position: "摄影师 摄影师 摄影主管 摄影师"
            //           },
            //           {
            //             id: 99,
            //             name: "曲志勇",
            //             position: "输出 销售 执行人-曲志勇"
            //           },
            //           {
            //             id: 47,
            //             name: "陈威",
            //             position: "修图师 执行经理 执行主管 执行主管 执行经理 执行经理 执行经理 执行经理 执行人 执行经理 输出 销售 总经办 途忆全国摄影总监"
            //           }
            //         ]
            //       },
            //       {
            //         id: 54,
            //         name: "川南项目部",
            //         num: 0,
            //         parentId: 39,
            //         positionUserList: [
            //           {
            //             id: 504,
            //             name: "李艳",
            //             position: "执行经理 执行经理 执行经理 执行经理 执行经理 执行经理"
            //           },
            //           {
            //             id: 465,
            //             name: "瞿强",
            //             position: "执行经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售"
            //           },
            //           {
            //             id: 273,
            //             name: "盛铭轩",
            //             position: "执行经理 执行经理 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 摄影经理 执行经理 执行经理 摄影经理 执行经理"
            //           },
            //           {
            //             id: 241,
            //             name: "何天中",
            //             position: "执行经理 输出 销售 执行人 执行经理 输出 销售 执行经理 执行经理 执行经理 四川城市经理"
            //           },
            //           {
            //             id: 209,
            //             name: "李坤译",
            //             position: "渠道 执行经理 渠道 执行经理 渠道 渠道 渠道 渠道"
            //           },
            //           {
            //             id: 174,
            //             name: "周俊",
            //             position: "修图师 执行人 输出 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行人 执行经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售 执行经理 摄影经理 输出 销售"
            //           },
            //           {
            //             id: 62,
            //             name: "赵古欢",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影主管 摄影经理"
            //           },
            //           {
            //             id: 23,
            //             name: "杨康",
            //             position: "执行经理 渠道 执行经理 渠道 执行经理 渠道 渠道 渠道 执行经理 渠道"
            //           },
            //           {
            //             id: 8,
            //             name: "郑伟",
            //             position: "摄影师 摄影经理 摄影师 摄影经理 摄影经理 摄影主管"
            //           }
            //         ]
            //       },
            //       {
            //         id: 55,
            //         name: "湖南项目部",
            //         num: 0,
            //         parentId: 50,
            //         positionUserList: [
            //           {
            //             id: 525,
            //             name: " 洪莹",
            //             position: "输出"
            //           },
            //           {
            //             id: 522,
            //             name: "吴国辉",
            //             position: "执行经理"
            //           },
            //           {
            //             id: 505,
            //             name: "9张伟强",
            //             position: "输出"
            //           },
            //           {
            //             id: 458,
            //             name: "王炜",
            //             position: "渠道 渠道 统计报表"
            //           },
            //           {
            //             id: 385,
            //             name: "陈明",
            //             position: "执行经理 输出 执行经理 执行主管 执行经理 执行经理"
            //           },
            //           {
            //             id: 350,
            //             name: "冯浩",
            //             position: "输出 销售 统计报表"
            //           },
            //           {
            //             id: 161,
            //             name: "大国",
            //             position: "摄影师 摄影师-大国 摄影师"
            //           },
            //           {
            //             id: 149,
            //             name: "小龙",
            //             position: "摄影经理 摄影师-小龙 摄影师"
            //           },
            //           {
            //             id: 148,
            //             name: "大吉",
            //             position: "摄影师 摄影师-大吉"
            //           },
            //           {
            //             id: 47,
            //             name: "陈威",
            //             position: "修图师 执行经理 执行主管 执行主管 执行经理 执行经理 执行经理 执行经理 执行人 执行经理 输出 销售 总经办 途忆全国摄影总监"
            //           }
            //         ]
            //       },
            //       {
            //         id: 56,
            //         name: "卧龙项目部",
            //         num: 0,
            //         parentId: 39,
            //         positionUserList: [
            //           {
            //             id: 504,
            //             name: "李艳",
            //             position: "执行经理 执行经理 执行经理 执行经理 执行经理 执行经理"
            //           },
            //           {
            //             id: 209,
            //             name: "李坤译",
            //             position: "渠道 执行经理 渠道 执行经理 渠道 渠道 渠道 渠道"
            //           },
            //           {
            //             id: 174,
            //             name: "周俊",
            //             position: "修图师 执行人 输出 执行经理 摄影经理 输出 销售 执行经理 摄影经理 输出 销售 执行人 执行经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售 执行经理 摄影经理 输出 销售"
            //           },
            //           {
            //             id: 62,
            //             name: "赵古欢",
            //             position: "摄影师 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影经理 摄影主管 摄影经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 57,
            //         name: "上海",
            //         num: 0,
            //         parentId: 30,
            //         positionUserList: [
            //           {
            //             id: 466,
            //             name: "肖宝军",
            //             position: "上海城市经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 58,
            //         name: "广州",
            //         num: 0,
            //         parentId: 3,
            //         positionUserList: [
            //           {
            //             id: 419,
            //             name: "徐方伟",
            //             position: "广州城市经理"
            //           }
            //         ]
            //       },
            //       {
            //         id: 59,
            //         name: "广州项目部",
            //         num: 0,
            //         parentId: 58,
            //         positionUserList: []
            //       },
            //       {
            //         id: 60,
            //         name: "泰国",
            //         num: 0,
            //         parentId: 42,
            //         positionUserList: []
            //       },
            //       {
            //         id: 61,
            //         name: "泰国项目部",
            //         num: 0,
            //         parentId: 60,
            //         positionUserList: [
            //           {
            //             id: 98,
            //             name: "曲利平",
            //             position: "执行经理 摄影经理 执行经理 输出 销售 执行经理 摄影经理 输出 销售 执行经理 输出 销售 执行经理 输出 销售 统计报表"
            //           }
            //         ]
            //       },
            //       {
            //         id: 62,
            //         name: "江苏",
            //         num: 0,
            //         parentId: 30,
            //         positionUserList: []
            //       }
            //     ]
            // };
            // dispatch(Creators.setOrganizes(response.data));
            // dispatch(Creators.sortOrganizeList({value, type}));
            // dispatch(CommonActions.fetched());

            dispatch(CommonActions.fetching());
            const params = {
                tokenId: localStorage.getItem('signaturePwd'),
                data: {}
            };
            request(basicUrl + 'user/getAllPositionUser', params)
                .then(response => {
                    dispatch(CommonActions.fetched());
                    if(response && response.data){
                        dispatch(Creators.setOrganizes(response.data));
                        dispatch(Creators.sortOrganizeList({value, type}));
                    } else {
                        console.log("组织架构请求失败", response.msg || '系统异常');
                    }
                });
        }
    }
});

// types
export const OrganizeTypes = Types;

// actions
export default Creators;

// init state
const INITIAL_STATE = Immutable({
    organizes: [],
    sortDepartment: [],
    sortEmployee: []
});

// reducers
export const updateSearchId = (state = INITIAL_STATE, { id }) => {
  return Immutable.merge(state, { searchId: id });
}

export const setOrganizes = (state = INITIAL_STATE, { organizes }) => {
    return Immutable.merge(state, { organizes });
}

export const sortOrganizeList = (state = INITIAL_STATE, { params }) => {
  let department = [],
      employee = [];

  const { value, type } = params;

  if( type == "id" ){
    const finded = state.organizes.find(item => {
      return item.id == value;
    });

    if( finded ){
      employee = finded.positionUserList
    }

    department = state.organizes.filter(item => {
        return item.parentId == value;
    });
  } else if( type == "name" ){
    state.organizes.map(item => {
      item.positionUserList.map(v => {
        if( v.name.indexOf(value) !== -1 ) {
          const exist = employee.findIndex(element => element.id === v.id );
          if( exist === -1 ){
            employee.push(v);
          }
        }
      });
    });
  }
  
  console.log(department, employee);
  return Immutable.merge(state, {
    sortDepartment: department,
    sortEmployee: employee
  });
}

// reducers to types
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SORT_ORGANIZE_LIST]: sortOrganizeList,
  [Types.SET_ORGANIZES]: setOrganizes
})