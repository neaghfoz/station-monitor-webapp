import moment from 'moment'
import stationFlowApi from "@/views/pro/analyse/flow/stationFlow/stationFlowApi"
import {exportExcel} from "@/views/pro/common/util/dataUtil";

export default {
    returnData:{},
    roadStationColumns: [
        {
          title: "路段名称",
          align: 'center',
          field: "roadName",
          minWidth: 120
        },
        {
          field: "stationName",
          title: "收费站名称",
          align: 'center',
          minWidth: 120
        },
        {
          field: "naturalDate",
          title: "日期",
          align: 'center',
          minWidth: 100
        },
      {
        field: "flowType",
        title: "出入口类型",
        align: 'center',
        minWidth: 100
      },
        {
          title: "车型",
          align: 'center',
          headerAlign: 'center',
          children: [
            {
              field: "vehType1",
              title: "客一",
              align: 'right',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType2",
              title: "客二",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType3",
              title: "客三",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType4",
              title: "客四",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType11",
              title: "货一",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType12",
              title: "货二",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType13",
              title: "货三",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType14",
              title: "货四",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType15",
              title: "货五",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType16",
              title: "货六",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType21",
              title: "专一",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType22",
              title: "专二",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType23",
              title: "专三",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType24",
              title: "专四",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType25",
              title: "专五",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType26",
              title: "专六",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehType99",
              title: "其他车型",
              align: 'right',
              headerAlign: 'center',
              //formatter: 'integer',
              minWidth: 80
            }]
        },
/*        {
          title: "车种",
          align: 'center',
          headerAlign: 'center',
          children: [
            {
              field: "vehClass0",
              title: "普通车",
              align: 'right',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehClass8",
              title: "军警",
              headerAlign: 'center',
              align: 'right',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              field: "vehClass10",
              title: "紧急",
              headerAlign: 'center',
              //formatter: 'integer',
              align: 'right',
              minWidth: 80
            },
            {
              field: "vehClass14",
              title: "车队",
              //formatter: 'integer',
              headerAlign: 'center',
              align: 'right',
              minWidth: 80
            },
            {
              field: "vehClass21",
              title: "绿通车",
              //formatter: 'integer',
              headerAlign: 'center',
              align: 'right',
              minWidth: 80
            },
            {
              field: "vehClass22",
              title: "联合收割机",
              //formatter: 'integer',
              headerAlign: 'center',
              align: 'right',
              minWidth: 90
            },
            {
              field: "vehClass23",
              title: "抢险救灾",
              //formatter: 'integer',
              headerAlign: 'center',
              align: 'right',
              minWidth: 80
            },
            {
              field: "vehClass24",
              title: "J1类集装箱车",
              //formatter: 'integer',
              headerAlign: 'center',
              align: 'right',
              minWidth: 110
            },
            {
              field: "vehClass25",
              title: "大件运输",
              //formatter: 'integer',
              headerAlign: 'center',
              align: 'right',
              minWidth: 80
            },
            {
              field: "vehClass26",
              title: "应急保障车",
              //formatter: 'integer',
              headerAlign: 'center',
              align: 'right',
              minWidth: 90
            },
            {
              field: "vehClass27",
              title: "货车列车或半挂汽车列车",
              //formatter: 'integer',
              headerAlign: 'center',
              align: 'right',
              showOverflow: true,
              minWidth: 175
            },
            {
              field: "vehClass28",
              title: "J2类型集装箱",
              //formatter: 'integer',
              headerAlign: 'center',
              align: 'right',
              minWidth: 110
            },
            {
              field: "vehClass99",
              title: "其他车种",
              //formatter: 'integer',
              headerAlign: 'center',
              align: 'right',
              minWidth: 80
            }
          ]
        },
        {
          title: "合计",
          align: 'right',
          //formatter: 'integer',
          headerAlign: 'center',
          field: "passCnt",
          minWidth: 100
        }*/
        ],

      otherColumns:[
        {
          title: "序号",
          type: "seq",
          width: 50,
          headerAlign: 'center',
          align: "center"
        },
        {
          field: "vehTypeName",
          title: "车型",
          headerAlign: 'center',
          align: 'center',
          minWidth: 80
        },
        {
          title: "入口车流量",
          align: 'center',
          minWidth: 80,
          children: [
            {
              field: "transEnEtcSum",
              title: "ETC",
              headerAlign: 'center',
              align: 'right',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              title: "其它",
              field: "transEnOtherSum",
              headerAlign: 'center',
              align: 'right',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              title: "合计",
              field: "transEnTotalSum",
              headerAlign: 'center',
              align: 'right',
              //formatter: 'integer',
              minWidth: 100
            },
          ]
        },
        {
          title: "出口车流量",
          align: 'center',
          minWidth: 80,
          children: [
            {
              field: "transExEtcSum",
              title: "ETC",
              headerAlign: 'center',
              align: 'right',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              title: "其它",
              field: "transExOtherSum",
              headerAlign: 'center',
              align: 'right',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              title: "合计",
              field: "transExTotalSum",
              headerAlign: 'center',
              align: 'right',
              //formatter: 'integer',
              minWidth: 100
            },
          ]
        },
        {
          title: "总车流量",
          align: 'center',
          minWidth: 80,
          children: [
            {
              title: "ETC",
              field: "transEtcTotalSum",
              headerAlign: 'center',
              align: 'right',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              title: "其它",
              field: "transOtherTotalSum",
              headerAlign: 'center',
              align: 'right',
              //formatter: 'integer',
              minWidth: 80
            },
            {
              title: "合计",
              field: "transTotalSum",
              headerAlign: 'center',
              align: 'right',
              //formatter: 'integer',
              minWidth: 120
            },
          ]
        },
      ],
      vehicleTypeColumns:[
        {
          title: "路段名称",
          align: 'center',
          field: "roadName",
          minWidth: 120
        },
        {
          field: "stationName",
          title: "收费站名称",
          align: 'center',
          minWidth: 120
        },
        {
          field: "flowType",
          title: "车道类型",
          align: 'center',
          minWidth: 120
        },
        {
          field: "naturalDate",
          title: "日期",
          align: 'center',
          minWidth: 120
        },
        // {
        //   field: "transType",
        //   title: "交易类型",
        //   align: 'center',
        //   minWidth: 100
        // },
        {
          title: "车型",
          align: 'center',
          headerAlign: 'center',
          children: [
            {
              field: "vehType1",
              title: "客一",
              align: 'right',
    
              minWidth: 80
            },
            {
              field: "vehType2",
              title: "客二",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType3",
              title: "客三",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType4",
              title: "客四",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType11",
              title: "货一",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType12",
              title: "货二",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType13",
              title: "货三",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType14",
              title: "货四",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType15",
              title: "货五",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType16",
              title: "货六",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType21",
              title: "专一",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType22",
              title: "专二",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType23",
              title: "专三",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType24",
              title: "专四",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType25",
              title: "专五",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType26",
              title: "专六",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType99",
              title: "其他车型",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            }]
        }
        ],
      vehicleClassColumns:[
        {
          title: "路段名称",
          align: 'center',
          field: "roadName",
          minWidth: 120
        },
        {
          field: "stationName",
          title: "收费站名称",
          align: 'center',
          minWidth: 120
        },
        {
          field: "flowType",
          title: "车道类型",
          align: 'center',
          minWidth: 120
        },
        {
          field: "naturalDate",
          title: "日期",
          align: 'center',
          minWidth: 120
        },
        // {
        //   field: "transType",
        //   title: "交易类型",
        //   align: 'center',
        //   minWidth: 100
        // },
        {
          title: "车种",
          align: 'center',
          headerAlign: 'center',
          children: [
            {
              field: "vehClass0",
              title: "普通",
              align: 'right',
    
              minWidth: 80
            },
            {
              field: "vehClass8",
              title: "军警",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass10",
              title: "紧急",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass14",
              title: "车队",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass21",
              title: "绿通车",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass22",
              title: "联合收割机",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass23",
              title: "抢险救灾",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass24",
              title: "J1类型集装箱",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass25",
              title: "大件运输",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass26",
              title: "应急车",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass27",
              title: "货车列车或半挂汽车列车",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass28",
              title: "J2类型集装箱",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            }]
        }
        ],
      vehicleTypeTrendColumns:[
        {
          title: "路段名称",
          align: 'center',
          field: "roadName",
          minWidth: 120
        },
        {
          field: "stationName",
          title: "收费站名称",
          align: 'center',
          minWidth: 120
        },
        {
          field: "flowType",
          title: "车道类型",
          align: 'center',
          minWidth: 120
        },
        {
          field: "datePointText",
          title: "时间点",
          align: 'center',
          minWidth: 120
        },
        {
          field: "naturalDate",
          title: "日期",
          align: 'center',
          minWidth: 120
        },
        // {
        //   field: "transType",
        //   title: "交易类型",
        //   align: 'center',
        //   minWidth: 100
        // },
        {
          title: "车型趋势",
          align: 'center',
          headerAlign: 'center',
          children: [
            {
              field: "vehType1",
              title: "客一",
              align: 'right',
    
              minWidth: 80
            },
            {
              field: "vehType2",
              title: "客二",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType3",
              title: "客三",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType4",
              title: "客四",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType11",
              title: "货一",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType12",
              title: "货二",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType13",
              title: "货三",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType14",
              title: "货四",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType15",
              title: "货五",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType16",
              title: "货六",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType21",
              title: "专一",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType22",
              title: "专二",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType23",
              title: "专三",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType24",
              title: "专四",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType25",
              title: "专五",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType26",
              title: "专六",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehType99",
              title: "其他车型",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            }]
        }
        ],
      vehicleClassTrendColumns:[
        {
          title: "路段名称",
          align: 'center',
          field: "roadName",
          minWidth: 120
        },
        {
          field: "stationName",
          title: "收费站名称",
          align: 'center',
          minWidth: 120
        },
        {
          field: "flowType",
          title: "车道类型",
          align: 'center',
          minWidth: 120
        },
        {
          field: "datePointText",
          title: "时间点",
          align: 'center',
          minWidth: 120
        },
        {
          field: "naturalDate",
          title: "日期",
          align: 'center',
          minWidth: 120
        },
        // {
        //   field: "transType",
        //   title: "交易类型",
        //   align: 'center',
        //   minWidth: 100
        // },
        {
          title: "车种趋势",
          align: 'center',
          headerAlign: 'center',
          children: [
            {
              field: "vehClass0",
              title: "普通",
              align: 'center',
              minWidth: 80
            },
            {
              field: "vehClass8",
              title: "军警",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass10",
              title: "紧急",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass14",
              title: "车队",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass21",
              title: "绿通车",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass22",
              title: "联合收割机",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass23",
              title: "抢险救灾",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass24",
              title: "J1类型集装箱",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass25",
              title: "大件运输",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass26",
              title: "应急车",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass27",
              title: "货车列车或半挂汽车列车",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            },
            {
              field: "vehClass28",
              title: "J2类型集装箱",
              align: 'right',
              headerAlign: 'center',
    
              minWidth: 80
            }]
        }
        ],

  /**
   * 根据类型获取列
   * @param type
   * @returns {[]}
   */
  getColumn (type)
    {
      let roadStationColumnsTemp=[];
      let otherColumnsTemp = [];
      Object.assign(roadStationColumnsTemp,this.roadStationColumns);
      Object.assign(otherColumnsTemp,this.otherColumns);
      // if(type === 'road')
      // {
      //   roadStationColumnsTemp.splice(1,1);
      //   console.log("this.roadStationColumns:",this.roadStationColumns);
      //   return roadStationColumnsTemp;
      // }else if(type === 'station')
      // {
      //  return roadStationColumnsTemp;
      // }else 
      if(type === 'vehicleType')
      {
        otherColumnsTemp = this.vehicleTypeColumns;
        return otherColumnsTemp
      }else if(type === 'vehicleClass')
      {
        otherColumnsTemp = this.vehicleClassColumns;
        return otherColumnsTemp
        // otherColumnsTemp[1] =  {
        //   field: "vehClassName",
        //   title: "车种",
        //   headerAlign: 'center',
        //   align: 'center',
        //   minWidth: 80
        // };
        // return otherColumnsTemp;
      }else if(type === 'collectDate')
      {
        otherColumnsTemp[1] =  {
          field: "transTime",
          title: "时间",
          headerAlign: 'center',
          align: 'center',
          minWidth: 100
        };
        return otherColumnsTemp;
      }else if(type === 'vehicleTypeTrend')
      {
        otherColumnsTemp = this.vehicleTypeTrendColumns;
        return otherColumnsTemp
      }else if(type === 'vehicleClassTrend')
      {
        otherColumnsTemp = this.vehicleClassTrendColumns;
        return otherColumnsTemp
      }
    },

  /**
   * 根据类型获取数据
   * @param type
   */
  async getData(type,params,data)
    {
      //let resultData = {};
      // switch (type) {
      //   case 'road':
      //   case 'station':
      //     resultData = await stationFlowApi.findByRoadOrStation(params,data);
      //     break;
      //   case 'vehicleType':
      //   case 'vehicleClass':
      //   case 'collectDate':
      //     resultData = await stationFlowApi.findByOther(params,data);
      //     break;
      //   default:
      //     break;
      // }
      this.returnData = await stationFlowApi.findFlowData(params,data);;
      // return  resultData;
    },
    export:function (refTable,fileName) {
      exportExcel(refTable,fileName)
    }


}
