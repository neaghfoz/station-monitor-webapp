import {dataGroup, exportExcel, mapToArray} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default {

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
          field: "tollFeeType1",
          title: "客一",
          align: 'right',

          minWidth: 80
        },
        {
          field: "tollFeeType2",
          title: "客二",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType3",
          title: "客三",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType4",
          title: "客四",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType11",
          title: "货一",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType12",
          title: "货二",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType13",
          title: "货三",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType14",
          title: "货四",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType15",
          title: "货五",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType16",
          title: "货六",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType21",
          title: "专一",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType22",
          title: "专二",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType23",
          title: "专三",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType24",
          title: "专四",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType25",
          title: "专五",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType26",
          title: "专六",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeType99",
          title: "其他车型",
          align: 'right',
          headerAlign: 'center',

          minWidth: 80
        }]
    },
    // {
    //   title: "车种",
    //   align: 'center',
    //   headerAlign: 'center',
    //   children: [
    //     {
    //       field: "tollFeeClass0",
    //       title: "普通车",
    //       align: 'right',
    //
    //       minWidth: 80
    //     },
    //     {
    //       field: "tollFeeClass8",
    //       title: "军警",
    //       headerAlign: 'center',
    //       align: 'right',
    //
    //       minWidth: 80
    //     },
    //     {
    //       field: "tollFeeClass10",
    //       title: "紧急",
    //       headerAlign: 'center',
    //
    //       align: 'right',
    //       minWidth: 80
    //     },
    //     {
    //       field: "tollFeeClass14",
    //       title: "车队",
    //
    //       headerAlign: 'center',
    //       align: 'right',
    //       minWidth: 80
    //     },
    //     {
    //       field: "tollFeeClass21",
    //       title: "绿通车",
    //
    //       headerAlign: 'center',
    //       align: 'right',
    //       minWidth: 80
    //     },
    //     {
    //       field: "tollFeeClass22",
    //       title: "联合收割机",
    //
    //       headerAlign: 'center',
    //       align: 'right',
    //       minWidth: 80
    //     },
    //     {
    //       field: "tollFeeClass23",
    //       title: "抢险救灾",
    //
    //       headerAlign: 'center',
    //       align: 'right',
    //       minWidth: 80
    //     },
    //     {
    //       field: "tollFeeClass24",
    //       title: "J1类集装箱车",
    //
    //       headerAlign: 'center',
    //       align: 'right',
    //       minWidth: 80
    //     },
    //     {
    //       field: "tollFeeClass25",
    //       title: "大件运输",
    //
    //       headerAlign: 'center',
    //       align: 'right',
    //       minWidth: 80
    //     },
    //     {
    //       field: "tollFeeClass26",
    //       title: "应急保障车",
    //
    //       headerAlign: 'center',
    //       align: 'right',
    //       minWidth: 80
    //     },
    //     {
    //       field: "tollFeeClass27",
    //       title: "货车列车或半挂汽车列车",
    //
    //       headerAlign: 'center',
    //       align: 'right',
    //       minWidth: 80
    //     },
    //     {
    //       field: "tollFeeClass28",
    //       title: "J2类型集装箱",
    //
    //       headerAlign: 'center',
    //       align: 'right',
    //       minWidth: 80
    //     },
    //     {
    //       field: "tollFeeClass99",
    //       title: "其他车种",
    //
    //       headerAlign: 'center',
    //       align: 'right',
    //       minWidth: 80
    //     }
    //   ]
    // },
    // {
    //   title: "合计",
    //   align: 'right',
    //   headerAlign: 'center',
    //   field: "totalFee",
    //   minWidth: 80
    // }
    ],
  otherColumns: [
    {
      title: "序号",
      type: "seq",
      width: 50,
      align: "center"
    },
    {
      title: "车型",
      align: 'center',
      field: "vehTypeName",
      minWidth: 120
    },
    {
      title: "交易类型(单位:元)",
      align: 'center',
      headerAlign: 'center',
      children: [
        {
          field: "tollFeeTransETC",
          title: "ETC",
          align: 'center',

          minWidth: 80
        },
        {
          field: "tollFeeTransOther",
          title: "其他",
          align: 'center',

          minWidth: 80
        }
        ]
    },
    {
      title: "合计",
      align: 'center',

      headerAlign: 'center',
      field: "totalFee",
      minWidth: 80
    }
  ],
  getColums: function (tableType){
    let columnsTemp=[];
    let roadStationColumnsTemp=[];
    let otherColumnsTemp=[];
    Object.assign(roadStationColumnsTemp,this.roadStationColumns);
    Object.assign(otherColumnsTemp,this.otherColumns);
    switch (tableType) {
      case "road":
        //移除收费站列
        roadStationColumnsTemp.splice(1,1);
        columnsTemp = roadStationColumnsTemp;
        break;
      case "station":
        columnsTemp = roadStationColumnsTemp;
        break;
      case "vehicleType":
        columnsTemp = otherColumnsTemp;
        break;
      case "vehicleClass":
        let vehClassTemp = {
          title: "车种",
          align: 'center',
          field: "vehClassName",
          minWidth: 120
        };
        //车型改为车种
        otherColumnsTemp.splice(1,1,vehClassTemp);
        columnsTemp = otherColumnsTemp;
        break;
      case "time":
        let timeTemp = {
          title: "时间",
          align: 'center',
          field: "collectDateText",
          minWidth: 120,
          slots: {
            default: ({row}, h) => {
              if (row.collectDateText == '2099-12-31'){
                return '合计'
              } else {
                return row.collectDateText;
              }
            }
          }
        };
        //车型改为时间
        otherColumnsTemp.splice(1,1,timeTemp);
        columnsTemp = otherColumnsTemp;
        break;
    }
    return columnsTemp;
  },
  dataFormat: function (dataArr) {
    let datas = dataArr
    return datas
  },
  export: function (refTable, fileName) {
    exportExcel(refTable, fileName)
  }
}
