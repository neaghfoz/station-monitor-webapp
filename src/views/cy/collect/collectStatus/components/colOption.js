import collectConstant from "@/views/cy/collect/collectStatus/collectConstant";
import moment from "moment";
import XEUtils from 'xe-utils';

/**
 * 交调站车流量
 */
const dispatchingStationCols = [
  {
    field: "fractureSurfaceName",
    title: "断面名称",
    align: 'center',
    minWidth: 150,
    showOver: true
  },
  {
    title: "东往西",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "eastEquivalent",
        title: "当量合计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType1East",
        title: "中小客车-东往西",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType2East",
        title: "小型货车-东往西",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType3East",
        title: "大客车-东往西",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType4East",
        title: "中型货车-东往西",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType5East",
        title: "大型货车-东往西",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType6East",
        title: "特大型货车-东往西",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType7East",
        title: "集装箱车-东往西",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "eastCnt",
        title: "合计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "passengerEastCnt",
        title: "客车合计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "truckEastCnt",
        title: "货车合计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "eastPassengerProStr",
        title: "客车占总流量比重",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  },
  {
    title: "西往东",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "westEquivalent",
        title: "当量合计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType1West",
        title: "中小客车-西往东",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType2West",
        title: "小型货车-西往东",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType3West",
        title: "大客车-西往东",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType4West",
        title: "中型货车-西往东",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType5West",
        title: "大型货车-西往东",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType6West",
        title: "特大型货车-西往东",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType7West",
        title: "集装箱车-西往东",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "westCnt",
        title: "合计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "passengerWestCnt",
        title: "客车合计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "truckWestCnt",
        title: "货车合计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "westPassengerProStr",
        title: "客车占总流量比重",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  }
];

/**
 * 长益北线各站车流收入
 */
const stationFlowIncomeCols = [
  {
    title: "黄金园",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "enFlow1",
        title: "入口车流",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "exFlow1",
        title: "出口车流",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "income1",
        title: "收入",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  },
  {
    title: "金洲北",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "enFlow2",
        title: "入口车流",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "exFlow2",
        title: "出口车流",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "income2",
        title: "收入",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  },
  {
    title: "宁乡北",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "enFlow3",
        title: "入口车流",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "exFlow3",
        title: "出口车流",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "income3",
        title: "收入",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  },
  {
    title: "泞湖",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "enFlow4",
        title: "入口车流",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "exFlow4",
        title: "出口车流",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "income4",
        title: "收入",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  },
  {
    title: "合计",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "enFlowCnt",
        title: "入口车流",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "exFlowCnt",
        title: "出口车流",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "incomeCnt",
        title: "收入",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  }
];

/**
 * 收费分项指标表
 */
const itemizedChargesCols = [
  {
    title: "收费分项指标表",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "stationName",
        title: "收费站名称",
        align: 'center',
        minWidth: 150
      },
      {
        field: "itemized1",
        title: "机电故障未入系统",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "itemized7",
        title: "其他",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "itemized2",
        title: "补缴（手工票）",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "itemized3",
        title: "备注（机电故障）",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "itemized5",
        title: "冲关车车流量",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "itemized6",
        title: "冲关车损失金额",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "longMoney",
        title: "长款",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "shortMoney",
        title: "短款",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "itemized8Name",
        title: "冲账车型",
        editRender: { name: '$input', props: {type: 'text'} },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "itemized9Name",
        title: "收费方式",
        editRender: { name: '$input', props: {type: 'text'}},
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "itemized4",
        title: "误操作冲账(报告已批)",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  }
];


/**
 * 长益北线各门架流量统计
 */
const cyGantryFlowSumCols = [
  {
    field: "gantryId",
    title: "门架ID",
    align: 'center',
    minWidth: 150,
    showOver: true
  },
  {
    field: "gantryName",
    title: "门架名称",
    align: 'center',
    minWidth: 150,
    showOver: true
  },
  {
    title: "客车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType1",
        title: "客一",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType2",
        title: "客二",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType3",
        title: "客三",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType4",
        title: "客四",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "passengerCarCnt",
        title: "客车小计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }

    ]
  },
  {
    title: "货车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType5",
        title: "货一",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType6",
        title: "货二",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType7",
        title: "货三",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType8",
        title: "货四",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType9",
        title: "货五",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType10",
        title: "货六",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "truckCarCnt",
        title: "货车小计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  },
  {
    title: "专项作业车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType11",
        title: "专一",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType12",
        title: "专二",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType13",
        title: "专三",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType14",
        title: "专四",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType15",
        title: "专五",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "vehType16",
        title: "专六",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "specialCarCnt",
        title: "专项车小计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  },
  {
    field: "vehType17",
    title: "未确定车型",
    editRender: { name: '$input', props: { type: 'integer', min: 0 } },
    align: 'center',
    //formatter: "integer",
    minWidth: 150
  },
  {
    field: "vehClass8",
    title: "军警车",
    editRender: { name: '$input', props: { type: 'integer', min: 0 } },
    align: 'center',
    //formatter: "integer",
    minWidth: 150
  },
  {
    field: "vehClass21",
    title: "绿通车",
    editRender: { name: '$input', props: { type: 'integer', min: 0 } },
    align: 'center',
    //formatter: "integer",
    minWidth: 150
  },
  {
    field: "vehTypeCnt",
    title: "总流量",
    align: 'center',
    //formatter: "integer",
    minWidth: 150
  },
  {
    field: "sectionCnt",
    title: "断面流量",
    align: 'center',
    //formatter: "integer",
    minWidth: 150
  },
  {
    field: "sectionProStr",
    title: "与上一月断面流量相比",
    align: 'center',
    //formatter: "integer",
    minWidth: 150
  }
];

/**
 * 实得（拆分后）通行费征收任务
 */
const actGetFeeCols = [
  {
    field: "stationName",
    title: "月份",
    align: 'center',
    minWidth: 150,
    showOver: true
  },
  // {
  //   title: "各收费站实得（拆分后）通行费征收任务",
  //   align: 'center',
  //   headerAlign: 'center',
  //   children: [
  //     {
  //       field: "fee1",
  //       title: "一月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee2",
  //       title: "二月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee3",
  //       title: "三月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee4",
  //       title: "四月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee5",
  //       title: "五月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee6",
  //       title: "六月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee7",
  //       title: "七月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee8",
  //       title: "八月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee9",
  //       title: "九月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee10",
  //       title: "十月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee11",
  //       title: "十一月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee12",
  //       title: "十二月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "stationFeeCnt",
  //       title: "合计",
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     }
  //   ]
  // },
  {
    title: "公司实得计划",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "fee13",
        title: "一月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee14",
        title: "二月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee15",
        title: "三月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee16",
        title: "四月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee17",
        title: "五月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee18",
        title: "六月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee19",
        title: "七月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee20",
        title: "八月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee21",
        title: "九月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee22",
        title: "十月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee23",
        title: "十一月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee24",
        title: "十二月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "companyFeeCnt",
        title: "合计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  }
];

/**
 * 实收（拆分前）通行费征收任务
 */
const actColFeeCols = [
  {
    field: "stationName",
    title: "月份",
    align: 'center',
    minWidth: 150,
    showOver: true
  },
  // {
  //   title: "各收费站实收（拆分前）通行费征收任务",
  //   align: 'center',
  //   headerAlign: 'center',
  //   children: [
  //     {
  //       field: "fee1",
  //       title: "一月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee2",
  //       title: "二月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee3",
  //       title: "三月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee4",
  //       title: "四月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee5",
  //       title: "五月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee6",
  //       title: "六月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee7",
  //       title: "七月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee8",
  //       title: "八月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee9",
  //       title: "九月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee10",
  //       title: "十月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee11",
  //       title: "十一月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "fee12",
  //       title: "十二月",
  //       editRender: { name: '$input', props: { type: 'number', min: 0 } },
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     },
  //     {
  //       field: "stationFeeCnt",
  //       title: "合计",
  //       align: 'center',
  //       //formatter: "integer",
  //       minWidth: 150
  //     }
  //   ]
  // },
  {
    title: "集团实收计划",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "fee13",
        title: "一月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee14",
        title: "二月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee15",
        title: "三月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee16",
        title: "四月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee17",
        title: "五月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee18",
        title: "六月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee19",
        title: "七月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee20",
        title: "八月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee21",
        title: "九月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee22",
        title: "十月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee23",
        title: "十一月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee24",
        title: "十二月",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "companyFeeCnt",
        title: "合计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  }
];

/**
 * 利息数
 */
const interestAmountSumCols = [
  {
    title: "利息数",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "collectYear",
        title: "年份",
        align: 'center',
        minWidth: 150,
        showOver: true
      },
      {
        field: "fee1",
        title: "第一季度",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee2",
        title: "第二季度",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee3",
        title: "第三季度",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "fee4",
        title: "第四季度",
        editRender: { name: '$input', props: { type:"float",digits:2,min:0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "feeCnt",
        title: "合计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  }
];

/**
 * 各收费站车流量任务
 */
const cyStationFlowSumCols = [
  {
    title: "各收费站车流量任务",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "stationName",
        title: "收费站",
        align: 'center',
        minWidth: 150,
        showOver: true
      },
      {
        field: "flow1",
        title: "一月",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "flow2",
        title: "二月",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "flow3",
        title: "三月",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "flow4",
        title: "四月",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "flow5",
        title: "五月",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "flow6",
        title: "六月",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "flow7",
        title: "七月",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "flow8",
        title: "八月",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "flow9",
        title: "九月",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "flow10",
        title: "十月",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "flow11",
        title: "十一月",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "flow12",
        title: "十二月",
        editRender: { name: '$input', props: { type: 'integer', min: 0 } },
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      },
      {
        field: "flowCnt",
        title: "合计",
        align: 'center',
        //formatter: "integer",
        minWidth: 150
      }
    ]
  }
];

/**
 * 门架
 */
const gantryFlowCols = [
  {
    field: "gantryId",
    title: "门架编码",
    align: 'center',
    fixed: 'left',
    minWidth: 180,
    showOver: true
  },
  {
    field: "gantryName",
    title: "门架名称",
    fixed: 'left',
    align: 'center',
    minWidth: 120,
    showOver: true
  },
  {
    field: "mediaTypeName",
    title: "交易类型",
    fixed: 'left',
    align: 'center',
    minWidth: 100
  },
  {
    title: "客车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType1Toll",
        title: "收费客一",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehType1Free",
        title: "免费客一",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehType2Toll",
        title: "收费客二",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType2Free",
        title: "免费客二",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType3Toll",
        title: "收费客三",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType3Free",
        title: "免费客三",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType4Toll",
        title: "收费客四",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType4Free",
        title: "免费客四",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "货车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType11Toll",
        title: "收费货一",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType11Free",
        title: "免费货一",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType12Toll",
        title: "收费货二",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType12Free",
        title: "免费货二",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType13Toll",
        title: "收费货三",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType13Free",
        title: "免费货三",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType14Toll",
        title: "收费货四",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType14Free",
        title: "免费货四",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType15Toll",
        title: "收费货五",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType15Free",
        title: "免费货五",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType16Toll",
        title: "收费货六",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType16Free",
        title: "免费货六",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "专项作业车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType21Toll",
        title: "收费专一",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType21Free",
        title: "免费专一",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType22Toll",
        title: "收费专二",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType22Free",
        title: "免费专二",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType23Toll",
        title: "收费专三",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType23Free",
        title: "免费专三",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType24Toll",
        title: "收费专四",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType24Free",
        title: "免费专四",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType25Toll",
        title: "收费专五",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType25Free",
        title: "免费专五",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType26Toll",
        title: "收费专六",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType26Free",
        title: "免费专六",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehTypeCnt",
        title: "按车型小计",
        align: 'right',
        headerAlign: 'center',
        minWidth: 120
      },
    ]
  },
  {
    title: "车种",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehClass0",
        title: "普通车",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass24",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "J1类集装箱车",
        headerAlign: 'center',
        align: 'right',
        minWidth: 110
      },
      {
        field: "vehClass28",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "J2类型集装箱",
        headerAlign: 'center',
        align: 'right',
        minWidth: 110
      },
      {
        field: "vehClass25",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "大件运输",
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass27",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "货车列车或半挂汽车列车",
        headerAlign: 'center',
        align: 'right',
        showOver: true,
        minWidth: 175
      },
      {
        field: "vehClass8",
        title: "军警",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass10",
        title: "紧急",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass14",
        title: "车队",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass21",
        title: "绿通车",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass22",
        title: "联合收割机",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 90
      },
      {
        field: "vehClass23",
        title: "抢险救灾",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass26",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "应急车",
        headerAlign: 'center',
        align: 'right',
        minWidth: 90
      },

    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehClassCnt",
        title: "按车种小计",
        align: 'right',
        headerAlign: 'center',
        minWidth: 120
      },
    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "holidayFree",
        title: "节假日免费车",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  // {
  //   title: "",
  //   align: 'center',
  //   headerAlign: 'center',
  //   children: [
  //     {
  //       field: "vehCnt",
  //       title: "合计",
  //       align: 'right',
  //       headerAlign: 'center',
  //       formatter: 'integer',
  //       minWidth: 120
  //     },
  //   ]
  // },
];

/**
 * 门架
 */
const gantryFeeCols = [
  {
    field: "gantryId",
    title: "门架编码",
    align: 'center',
    fixed: 'left',
    minWidth: 180,
    showOver: true
  },
  {
    field: "gantryName",
    title: "门架名称",
    fixed: 'left',
    align: 'center',
    minWidth: 120,
    showOver: true
  },
  {
    field: "mediaTypeName",
    title: "交易类型",
    fixed: 'left',
    align: 'center',
    minWidth: 100
  },
  {
    title: "客车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType1Toll",
        title: "收费客一",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehType1Free",
        title: "免费客一",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehType2Toll",
        title: "收费客二",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType2Free",
        title: "免费客二",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType3Toll",
        title: "收费客三",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType3Free",
        title: "免费客三",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType4Toll",
        title: "收费客四",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType4Free",
        title: "免费客四",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "货车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType11Toll",
        title: "收费货一",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType11Free",
        title: "免费货一",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType12Toll",
        title: "收费货二",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType12Free",
        title: "免费货二",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType13Toll",
        title: "收费货三",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType13Free",
        title: "免费货三",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType14Toll",
        title: "收费货四",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType14Free",
        title: "免费货四",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType15Toll",
        title: "收费货五",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType15Free",
        title: "免费货五",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType16Toll",
        title: "收费货六",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType16Free",
        title: "免费货六",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "专项作业车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType21Toll",
        title: "收费专一",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType21Free",
        title: "免费专一",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType22Toll",
        title: "收费专二",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType22Free",
        title: "免费专二",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType23Toll",
        title: "收费专三",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType23Free",
        title: "免费专三",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType24Toll",
        title: "收费专四",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType24Free",
        title: "免费专四",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType25Toll",
        title: "收费专五",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType25Free",
        title: "免费专五",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType26Toll",
        title: "收费专六",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType26Free",
        title: "免费专六",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehTypeCnt",
        title: "按车型小计",
        align: 'right',
        headerAlign: 'center',
        minWidth: 120
      },
    ]
  },
  {
    title: "车种",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehClass0",
        title: "普通车",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass24",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "J1类集装箱车",
        headerAlign: 'center',
        align: 'right',
        minWidth: 110
      },
      {
        field: "vehClass28",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "J2类型集装箱",
        headerAlign: 'center',
        align: 'right',
        minWidth: 110
      },
      {
        field: "vehClass25",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "大件运输",
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass27",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "货车列车或半挂汽车列车",
        headerAlign: 'center',
        align: 'right',
        showOver: true,
        minWidth: 175
      },
      {
        field: "vehClass8",
        title: "军警",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass10",
        title: "紧急",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass14",
        title: "车队",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass21",
        title: "绿通车",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass22",
        title: "联合收割机",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 90
      },
      {
        field: "vehClass23",
        title: "抢险救灾",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass26",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "应急车",
        headerAlign: 'center',
        align: 'right',
        minWidth: 90
      },

    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehClassCnt",
        title: "按车种小计",
        align: 'right',
        headerAlign: 'center',
        minWidth: 120
      },
    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "holidayFree",
        title: "节假日免费车",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  // {
  //   title: "",
  //   align: 'center',
  //   headerAlign: 'center',
  //   children: [
  //     {
  //       field: "vehCnt",
  //       title: "合计",
  //       align: 'right',
  //       headerAlign: 'center',
  //       formatter: 'integer',
  //       minWidth: 120
  //     },
  //   ]
  // },
];

/**
 * 门架
 */
 const gantryFlowColsPre = [
  {
    field: "gantryId",
    title: "门架编码",
    align: 'center',
    fixed: 'left',
    minWidth: 180,
    showOver: true
  },
  {
    field: "gantryName",
    title: "门架名称",
    fixed: 'left',
    align: 'center',
    minWidth: 120,
    showOver: true
  },
  {
    field: "mediaTypeName",
    title: "交易类型",
    fixed: 'left',
    align: 'center',
    minWidth: 100
  },
  {
    title: "客车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType1Toll",
        title: "收费客一",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehType1Free",
        title: "免费客一",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehType2Toll",
        title: "收费客二",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType2Free",
        title: "免费客二",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType3Toll",
        title: "收费客三",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType3Free",
        title: "免费客三",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType4Toll",
        title: "收费客四",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType4Free",
        title: "免费客四",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "货车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType11Toll",
        title: "收费货一",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType11Free",
        title: "免费货一",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType12Toll",
        title: "收费货二",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType12Free",
        title: "免费货二",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType13Toll",
        title: "收费货三",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType13Free",
        title: "免费货三",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType14Toll",
        title: "收费货四",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType14Free",
        title: "免费货四",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType15Toll",
        title: "收费货五",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType15Free",
        title: "免费货五",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType16Toll",
        title: "收费货六",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType16Free",
        title: "免费货六",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "专项作业车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType21Toll",
        title: "收费专一",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType21Free",
        title: "免费专一",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType22Toll",
        title: "收费专二",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType22Free",
        title: "免费专二",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType23Toll",
        title: "收费专三",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType23Free",
        title: "免费专三",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType24Toll",
        title: "收费专四",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType24Free",
        title: "免费专四",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType25Toll",
        title: "收费专五",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType25Free",
        title: "免费专五",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType26Toll",
        title: "收费专六",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType26Free",
        title: "免费专六",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehTypeCnt",
        title: "按车型小计",
        align: 'right',
        headerAlign: 'center',
        minWidth: 120
      },
    ]
  },
  {
    title: "车种",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehClass0",
        title: "普通车",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass24",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "J1类集装箱车",
        headerAlign: 'center',
        align: 'right',
        minWidth: 110
      },
      {
        field: "vehClass28",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "J2类型集装箱",
        headerAlign: 'center',
        align: 'right',
        minWidth: 110
      },
      {
        field: "vehClass25",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "大件运输",
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass27",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "货车列车或半挂汽车列车",
        headerAlign: 'center',
        align: 'right',
        showOver: true,
        minWidth: 175
      },
      {
        field: "vehClass8",
        title: "军警",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass10",
        title: "紧急",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass14",
        title: "车队",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass21",
        title: "绿通车",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass22",
        title: "联合收割机",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 90
      },
      {
        field: "vehClass23",
        title: "抢险救灾",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass26",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "应急车",
        headerAlign: 'center',
        align: 'right',
        minWidth: 90
      },

    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehClassCnt",
        title: "按车种小计",
        align: 'right',
        headerAlign: 'center',
        minWidth: 120
      },
    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "holidayFree",
        title: "节假日免费车",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "pcu",
        title: "PCU",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  // {
  //   title: "",
  //   align: 'center',
  //   headerAlign: 'center',
  //   children: [
  //     {
  //       field: "vehCnt",
  //       title: "合计",
  //       align: 'right',
  //       headerAlign: 'center',
  //       formatter: 'integer',
  //       minWidth: 120
  //     },
  //   ]
  // },
];

/**
 * 门架
 */
const gantryFeeColsPre = [
  {
    field: "gantryId",
    title: "门架编码",
    align: 'center',
    fixed: 'left',
    minWidth: 180,
    showOver: true
  },
  {
    field: "gantryName",
    title: "门架名称",
    fixed: 'left',
    align: 'center',
    minWidth: 120,
    showOver: true
  },
  {
    field: "mediaTypeName",
    title: "交易类型",
    fixed: 'left',
    align: 'center',
    minWidth: 100
  },
  {
    title: "客车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType1Toll",
        title: "收费客一",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehType1Free",
        title: "免费客一",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehType2Toll",
        title: "收费客二",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType2Free",
        title: "免费客二",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType3Toll",
        title: "收费客三",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType3Free",
        title: "免费客三",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType4Toll",
        title: "收费客四",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType4Free",
        title: "免费客四",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "货车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType11Toll",
        title: "收费货一",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType11Free",
        title: "免费货一",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType12Toll",
        title: "收费货二",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType12Free",
        title: "免费货二",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType13Toll",
        title: "收费货三",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType13Free",
        title: "免费货三",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType14Toll",
        title: "收费货四",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType14Free",
        title: "免费货四",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType15Toll",
        title: "收费货五",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType15Free",
        title: "免费货五",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType16Toll",
        title: "收费货六",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType16Free",
        title: "免费货六",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "专项作业车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType21Toll",
        title: "收费专一",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType21Free",
        title: "免费专一",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType22Toll",
        title: "收费专二",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType22Free",
        title: "免费专二",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType23Toll",
        title: "收费专三",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType23Free",
        title: "免费专三",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType24Toll",
        title: "收费专四",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType24Free",
        title: "免费专四",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType25Toll",
        title: "收费专五",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType25Free",
        title: "免费专五",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType26Toll",
        title: "收费专六",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType26Free",
        title: "免费专六",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehTypeCnt",
        title: "按车型小计",
        align: 'right',
        headerAlign: 'center',
        minWidth: 120
      },
    ]
  },
  {
    title: "车种",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehClass0",
        title: "普通车",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass24",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "J1类集装箱车",
        headerAlign: 'center',
        align: 'right',
        minWidth: 110
      },
      {
        field: "vehClass28",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "J2类型集装箱",
        headerAlign: 'center',
        align: 'right',
        minWidth: 110
      },
      {
        field: "vehClass25",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "大件运输",
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass27",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "货车列车或半挂汽车列车",
        headerAlign: 'center',
        align: 'right',
        showOver: true,
        minWidth: 175
      },
      {
        field: "vehClass8",
        title: "军警",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass10",
        title: "紧急",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass14",
        title: "车队",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass21",
        title: "绿通车",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass22",
        title: "联合收割机",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 90
      },
      {
        field: "vehClass23",
        title: "抢险救灾",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass26",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "应急车",
        headerAlign: 'center',
        align: 'right',
        minWidth: 90
      },

    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehClassCnt",
        title: "按车种小计",
        align: 'right',
        headerAlign: 'center',
        minWidth: 120
      },
    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "holidayFree",
        title: "节假日免费车",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "pcu",
        title: "PCU",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  // {
  //   title: "",
  //   align: 'center',
  //   headerAlign: 'center',
  //   children: [
  //     {
  //       field: "vehCnt",
  //       title: "合计",
  //       align: 'right',
  //       headerAlign: 'center',
  //       formatter: 'integer',
  //       minWidth: 120
  //     },
  //   ]
  // },
];

/**
 * 收费站车流量
 */
const stationCols = [
  {
    field: "stationId",
    title: "收费站编码",
    align: 'center',
    fixed: 'left',
    minWidth: 180,
    showOver: true
  },
  {
    field: "stationName",
    title: "收费站名称",
    fixed: 'left',
    align: 'center',
    minWidth: 120,
    showOver: true
  },
  {
    field: "inOutTypeName",
    title: "出入口类型",
    fixed: 'left',
    align: 'center',
    minWidth: 100
  },
  {
    field: "mediaTypeName",
    title: "通行介质",
    fixed: 'left',
    align: 'center',
    minWidth: 100
  },
  {
    title: "客车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType1Toll",
        title: "收费客一",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehType1Free",
        title: "免费客一",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehType2Toll",
        title: "收费客二",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType2Free",
        title: "免费客二",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType3Toll",
        title: "收费客三",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType3Free",
        title: "免费客三",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType4Toll",
        title: "收费客四",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType4Free",
        title: "免费客四",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "货车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType11Toll",
        title: "收费货一",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType11Free",
        title: "免费货一",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType12Toll",
        title: "收费货二",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType12Free",
        title: "免费货二",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType13Toll",
        title: "收费货三",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType13Free",
        title: "免费货三",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType14Toll",
        title: "收费货四",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType14Free",
        title: "免费货四",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType15Toll",
        title: "收费货五",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType15Free",
        title: "免费货五",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType16Toll",
        title: "收费货六",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType16Free",
        title: "免费货六",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "专项作业车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType21Toll",
        title: "收费专一",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType21Free",
        title: "免费专一",
        align: 'right',
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType22Toll",
        title: "收费专二",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType22Free",
        title: "免费专二",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType23Toll",
        title: "收费专三",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType23Free",
        title: "免费专三",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType24Toll",
        title: "收费专四",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType24Free",
        title: "免费专四",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType25Toll",
        title: "收费专五",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType25Free",
        title: "免费专五",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType26Toll",
        title: "收费专六",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType26Free",
        title: "免费专六",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehTypeCnt",
        title: "按车型小计",
        align: 'right',
        headerAlign: 'center',
        minWidth: 120
      },
    ]
  },
  {
    title: "车种",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehClass0",
        title: "普通车",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass24",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "J1类集装箱车",
        headerAlign: 'center',
        align: 'right',
        minWidth: 110
      },
      {
        field: "vehClass28",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "J2类型集装箱",
        headerAlign: 'center',
        align: 'right',
        minWidth: 110
      },
      {
        field: "vehClass25",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "大件运输",
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass27",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "货车列车或半挂汽车列车",
        headerAlign: 'center',
        align: 'right',
        showOver: true,
        minWidth: 175
      },
      {
        field: "vehClass211",
        title: "收费绿通",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        showOver: true,
        minWidth: 175
      },
      {
        field: "vehClass8",
        title: "军警",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass10",
        title: "紧急",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass14",
        title: "车队",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass212",
        title: "免费绿通",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass22",
        title: "联合收割机",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 90
      },
      {
        field: "vehClass23",
        title: "抢险救灾",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass26",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        title: "应急车",
        headerAlign: 'center',
        align: 'right',
        minWidth: 90
      },
    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehClassCnt",
        title: "按车种小计",
        align: 'right',
        headerAlign: 'center',
        minWidth: 120
      },
    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehBreak",
        title: "闯关车",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "holidayFree",
        title: "节假日免费车",
        editRender: {name: '$input', props: {type: 'integer', min: 0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  }
];

/**
 * 收费站交易额
 */
const stationFeeCols = [
  {
    field: "stationId",
    title: "收费站编码",
    align: 'center',
    fixed: 'left',
    minWidth: 180,
    showOver: true
  },
  {
    field: "stationName",
    title: "收费站名称",
    fixed: 'left',
    align: 'center',
    minWidth: 120,
    showOver: true
  },
  {
    field: "payTypeName",
    title: "支付类型",
    fixed: 'left',
    align: 'center',
    minWidth: 100
  },
  {
    title: "客车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType1Toll",
        title: "收费客一",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehType1Free",
        title: "免费客一",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehType2Toll",
        title: "收费客二",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType2Free",
        title: "免费客二",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType3Toll",
        title: "收费客三",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType3Free",
        title: "免费客三",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType4Toll",
        title: "收费客四",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType4Free",
        title: "免费客四",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "货车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType11Toll",
        title: "收费货一",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType11Free",
        title: "免费货一",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType12Toll",
        title: "收费货二",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType12Free",
        title: "免费货二",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType13Toll",
        title: "收费货三",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType13Free",
        title: "免费货三",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType14Toll",
        title: "收费货四",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType14Free",
        title: "免费货四",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType15Toll",
        title: "收费货五",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType15Free",
        title: "免费货五",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType16Toll",
        title: "收费货六",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType16Free",
        title: "免费货六",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "专项作业车",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehType21Toll",
        title: "收费专一",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType21Free",
        title: "免费专一",
        align: 'right',
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType22Toll",
        title: "收费专二",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType22Free",
        title: "免费专二",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType23Toll",
        title: "收费专三",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType23Free",
        title: "免费专三",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType24Toll",
        title: "收费专四",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType24Free",
        title: "免费专四",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType25Toll",
        title: "收费专五",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType25Free",
        title: "免费专五",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType26Toll",
        title: "收费专六",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "vehType26Free",
        title: "免费专六",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehTypeCnt",
        title: "按车型小计",
        align: 'right',
        headerAlign: 'center',
        minWidth: 120
      },
    ]
  },
  {
    title: "车种",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehClass0",
        title: "普通车",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass24",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "J1类集装箱车",
        headerAlign: 'center',
        align: 'right',
        minWidth: 110
      },
      {
        field: "vehClass28",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "J2类型集装箱",
        headerAlign: 'center',
        align: 'right',
        minWidth: 110
      },
      {
        field: "vehClass25",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "大件运输",
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass27",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "货车列车或半挂汽车列车",
        headerAlign: 'center',
        align: 'right',
        showOver: true,
        minWidth: 175
      },
      {
        field: "vehClass211",
        title: "收费绿通",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        showOver: true,
        minWidth: 175
      },
      {
        field: "vehClass8",
        title: "军警",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass10",
        title: "紧急",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass14",
        title: "车队",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass212",
        title: "免费绿通",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass22",
        title: "联合收割机",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 90
      },
      {
        field: "vehClass23",
        title: "抢险救灾",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        headerAlign: 'center',
        align: 'right',
        minWidth: 100
      },
      {
        field: "vehClass26",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        title: "应急车",
        headerAlign: 'center',
        align: 'right',
        minWidth: 90
      },

    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehClassCnt",
        title: "按车种小计",
        align: 'right',
        headerAlign: 'center',
        minWidth: 120
      },
    ]
  },
  {
    title: "",
    align: 'center',
    headerAlign: 'center',
    children: [
      {
        field: "vehBreak",
        title: "闯关车",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
      {
        field: "holidayFree",
        title: "节假日免费车",
        editRender: {name: '$input', props: {type:"float",digits:2,min:0}},
        align: 'right',
        headerAlign: 'center',
        minWidth: 100
      },
    ]
  }
];

/**
 * 天气
 */
const weatherCols = [
  {
    field: "weatherConditions",
    title: "当日天气情况",
    editRender: {name: '$input', props: {required: true, message: '当日天气情况不能为空!'}},
    align: 'center',
    minWidth: 150
  },
  {
    field: "tollFactor",
    title: "当日收费因素",
    editRender: {name: '$input', props: {required: true, message: '当日收费因素不能为空!'}},
    align: 'center',
    minWidth: 150
  },
  {
    field: "sealRoadTypeName",
    title: "封道类别",
    editRender: {name: '$input', props: {type: 'text'}},
    align: 'center',
    minWidth: 150
  },
  {
    field: "fullLineSealRoad",
    title: "全线封道",
    editRender: {name: '$input', props: {type: 'text'}},
    align: 'center',
    minWidth: 150
  },
  {
    field: "sealRoadCount",
    title: "封道次数",
    editRender: {name: '$input', props: {type: 'number', min: 0}},
    align: 'center',
    minWidth: 150
  },
  {
    field: "sealRoadTimeCount",
    title: "累计封道时长（h)",
    editRender: {name: '$input', props: {type: 'number', min: 0}},
    align: 'center',
    minWidth: 150
  },
  {
    field: "estimatedLoss",
    title: "估算损失（元）",
    editRender: {name: '$input', props: {type: 'number', min: 0}},
    align: 'center',
    minWidth: 150
  },
  {
    field: "createTypeName",
    title: "创收类别",
    editRender: {name: '$input', props: {type: 'text'}},
    align: 'center',
    minWidth: 150
  },
  {
    field: "leadWayCount",
    title: "创收次数",
    editRender: {name: '$input', props: {type: 'number', min: 0}},
    align: 'center',
    minWidth: 150
  },
  {
    field: "leadWayTimeCount",
    title: "累计时长（h)",
    editRender: {name: '$input', props: {type: 'number', min: 0}},
    align: 'center',
    minWidth: 150
  },
  {
    field: "estimatedGive",
    title: "估算创收（元）",
    editRender: {name: '$input', props: {type: 'number', min: 0}},
    align: 'center',
    minWidth: 150
  },
];

/**
 *  实际拆分
 */
const actualSplitIncomeCols = [
  {
    field: "splitTypeName",
    title: "拆分类型",
    fixed: 'left',
    align: 'center',
    minWidth: 100
  },
  {
    field: "splitDays",
    title: "拆分天数",
    editRender: {name: '$input', props: {type: 'integer', min: 0}},
    align: 'right',
    minWidth: 120
  },
  {
    field: "noSplitDays",
    title: "未拆分天数",
    editRender: {name: '$input', props: {type: 'integer', min: 0}},
    align: 'right',
    minWidth: 140
  },
  {
    field: "fee1",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "1日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee2",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "2日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee3",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "3日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee4",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "4日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee5",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "5日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee6",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "6日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee7",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "7日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee8",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "8日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee9",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "9日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee10",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "10日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee11",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "11日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee12",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "12日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee13",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "13日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee14",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "14日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee15",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "15日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee16",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "16日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee17",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "17日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee18",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "18日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee19",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "19日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee20",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "20日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee21",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "21日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee22",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "22日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee23",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "23日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee24",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "24日",
    align: 'right',
    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee25",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "25日",
    align: 'right',
    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee26",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "26日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee27",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "27日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee28",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "28日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee29",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "29日",
    align: 'right',

    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee30",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "30日",
    align: 'right',
    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "fee31",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "31日",
    align: 'right',
    headerAlign: 'center',
    minWidth: 80
  },
  {
    field: "totalFee",
    //editRender: {name: '$input',props: {type: 'float', digits: 2,readonly:true}},
    title: "实际拆分金额月小计",
    align: 'right',
    headerAlign: 'center',
     formatter: ({ cellValue }) => {
       return cellValue.toFixed(2)
     },
    minWidth: 200
  },
  {
    field: "adjustIncome",
    editRender: {name: '$input', props: {type: 'float', digits: 2}},
    title: "备注调整收入",
    align: 'right',
    headerAlign: 'center',
    minWidth: 80
  }
];
/**
 * 断面预算月表
 */
 const fractureSurfacesCols = [
  {
    field: "fractureSurFaceId",
    title: "断面编码",
    align: 'center',
    fixed: 'left',
    minWidth: 150,
    showOver: true
  },
  {
    field: "fractureSurFaceName",
    title: "断面名称",
    fixed: 'left',
    align: 'center',
    minWidth: 120,
    showOver: true
  },
  {
    field: "fractureSurFaceMile",
    title: "断面里程",
    fixed: 'left',
    align: 'center',
    minWidth: 120,
    showOver: true
  },
  {
    field: "dataTypeName",
    title: "数据类型",
    fixed: 'left',
    align: 'center',
    minWidth: 100
  },
  {
      field: "mediaTypeName",
      title: "交易类型",
      fixed: 'left',
      align: 'center',
      minWidth: 100
    },
    {
      field: "vehType1Toll",
      title: "客一",
      // editRender: {name: '$input', props: {type: 'integer', min: 0}},
      align: 'right',
      headerAlign: 'center',
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      minWidth: 100
    }, 
    {
      field: "vehType2Toll",
      title: "客二",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      align: 'right',
      headerAlign: 'center',
      minWidth: 100
    },
    {
      field: "vehType3Toll",
      title: "客三",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      align: 'right',
      headerAlign: 'center',
      minWidth: 100
    },
    {
      field: "vehType4Toll",
      title: "客四",
      align: 'right',
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      headerAlign: 'center',
      minWidth: 100
    },
    {
      field: "vehType5Toll",
      title: "客车小计",
      align: 'right',
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      headerAlign: 'center',
      minWidth: 100
    },
    {
      field: "vehType11Toll",
      title: "货一+专一",
      align: 'right',
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      headerAlign: 'center',
      minWidth: 100
    },
    {
      field: "vehType12Toll",
      title: "货二+专二",
      align: 'right',
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      headerAlign: 'center',
      minWidth: 100
    },
    {
      field: "vehType13Toll",
      title: "货三+专三",
      align: 'right',
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      headerAlign: 'center',
      minWidth: 100
    },
    {
      field: "vehType14Toll",
      title: "货四+专四",
      align: 'right',
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      headerAlign: 'center',
      minWidth: 100
    },
    {
      field: "vehType15Toll",
      title: "货五+专五",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      align: 'right',
      headerAlign: 'center',
      minWidth: 100
    },
    {
      field: "vehType16Toll",
      title: "货六+专六",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      align: 'right',
      headerAlign: 'center',
      minWidth: 100
    },
    {
      field: "vehClass24",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      // formatter:function(cellValue ){ 
      //   if(cellValue.row.dataType == 1){ 
      //     var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
      //     return v;
      //   }else{
      //     return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
      //   }
      // },
      title: "集装箱",
      headerAlign: 'center',
      align: 'right',
      minWidth: 110
    },
    {
      field: "vehClass25",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      title: "大件运输",
      headerAlign: 'center',
      align: 'right',
      minWidth: 100
    },
    {
      field: "vehType17Toll",
      title: "货车小计",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      align: 'right',
      headerAlign: 'center',
      minWidth: 100
    },
    {
      field: "vehType18Toll",
      title: "收费车小计",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      align: 'right',
      headerAlign: 'center',
      minWidth: 100
    },
    {
      field: "vehClass8",
      title: "军警",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      headerAlign: 'center',
      align: 'right',
      minWidth: 100
    },
    {
      field: "vehClass21",
      title: "绿通",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      headerAlign: 'center',
      align: 'right',
      minWidth: 100
    },
    {
      field: "vehClass22",
      title: "联合收割机",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      headerAlign: 'center',
      align: 'right',
      minWidth: 90
    },
    {
      field: "vehClass23",
      title: "抢险救灾",
      editRender: {name: '$input',formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          debugger;
          var v = XEUtils.toInteger(cellValue.cellValue);
          return v;
        }else{
          var c = XEUtils.commafy(cellValue.cellValue, { digits: 2 });
          return c;
        }
      }, props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          debugger;
          var v = XEUtils.toInteger(cellValue.cellValue);
          return v;
        }else{
          var c = XEUtils.commafy(cellValue.cellValue, { digits: 2 });
          return c;
        }
      },
      headerAlign: 'center',
      align: 'right',
      minWidth: 100
    },  
    {
      field: "holidayFree",
      title: "节假日免费车",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      align: 'right',
      headerAlign: 'center',
      minWidth: 100
    }, 
    {
      field: "vehClass10",
      title: "其它免费车",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      headerAlign: 'center',
      align: 'right',
      minWidth: 100
    }, 
    {
      field: "vehClass30",
      title: "免费车小计",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      headerAlign: 'center',
      align: 'right',
      minWidth: 100
    }, 
    {
      field: "vehTypeClassAll",
      title: "总计",
      
      editRender: {name: '$input',props: {type: 'number', min: 0}},
      formatter:function(cellValue ){ 
        if(cellValue.row.dataType == 1){ 
          var v = XEUtils.commafy(cellValue.cellValue, { digits: 0 });
          return v;
        }else{
          return XEUtils.commafy(cellValue.cellValue, { digits: 2 })
        }
      },
      headerAlign: 'center',
      align: 'right',
      minWidth: 100
    }, 
];

var getColumns = (tableId) => {
  let columns = [];
  switch (tableId) {
    case collectConstant.tableId.gantryFlow:
      columns = gantryFlowCols;
      break;
    case collectConstant.tableId.gantryFee:
      columns = gantryFeeCols;
      break;
    case collectConstant.tableId.stationFlow:
      columns = stationCols;
      break;
    case collectConstant.tableId.stationFee:
      columns = stationFeeCols;
      break;
    case collectConstant.tableId.weatherEmergencies:
      columns = weatherCols;
      break;
    case collectConstant.tableId.gantryFlowPrediction:
      columns = gantryFlowColsPre;
      break;
    case collectConstant.tableId.gantryFeePrediction:
      columns = gantryFeeColsPre;
      break;
    case collectConstant.tableId.actualSplitIncome:
      columns = actualSplitIncomeCols;
      break;
    case collectConstant.tableId.dispatchingStationSum:
      columns = dispatchingStationCols;
      break;
    case collectConstant.tableId.stationFlowIncome:
      columns = stationFlowIncomeCols;
      break;
    case collectConstant.tableId.itemizedCharges:
      columns = itemizedChargesCols;
      break;
    case collectConstant.tableId.cyGantryFlow:
      columns = cyGantryFlowSumCols;
      break;
    case collectConstant.tableId.actGetFee:
      columns = actGetFeeCols;
      break;
    case collectConstant.tableId.actColFee:
      columns = actColFeeCols;
      break;
    case collectConstant.tableId.interestAmountSum:
      columns = interestAmountSumCols;
      break;
    case collectConstant.tableId.cyStationFlowSum:
      columns = cyStationFlowSumCols;
      break;
    case collectConstant.tableId.fractureSurfaceSum: 
      columns = fractureSurfacesCols;
      break; 
    default:
      ;
  }
  return columns;
}

export default {
  getColumns
}
