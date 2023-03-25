import {dataGroup, exportExcel, mapToArray} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default {

  tableColumns: [
    {
      title: "收费站",
      field: "stationName",
      width: 120,
      align: "center"
    },
    {
      title: "在线车道数",
      field: "onlineLanesCount",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "离线车道数",
      field: "offlineLanesCount",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车道总数",
      field: "lanesCount",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "入口流水数",
      field: "enLaneListCount",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "出口流水数",
      field: "exLaneListCount",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "滞留流水数",
      field: "strandedLaneListCount",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "报警数",
      field: "alarmCount",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车牌识别率",
      field: "plateRecognitionRate",
      align: 'center',
      minWidth: 120 ,
    },
    // {
    //   title: "ETC交易成功率",
    //   field: "etcSuccessRate",
    //   align: 'center',
    //   minWidth: 120 ,
    // },
    // {
    //   title: "ETC交易耗时",
    //   field: "etcTimeConsuming",
    //   align: 'center',
    //   minWidth: 120 ,
    // },
    // {
    //   title: "ETC通行速度",
    //   field: "etcSpeed",
    //   align: 'center',
    //   minWidth: 120 ,
    // }
    // ,
    {
      title: "操作",
      slots: { default: 'operation' },
      align: 'center',
      minWidth: 120 ,
      fixed: 'right'
    }
  ],
  getColums: function (tableType){
    let columnsTemp=[];

    Object.assign(columnsTemp,this.tableColumns);
    switch (tableType) {
      case "road":
        //移除收费统计站列
        columnsTemp.splice(2,2);
        break;
      case "station":
        //columnsTemp = roadStationColumnsTemp;
        //columnsTemp.splice(3,1);
        break;
      case "time":
        columnsTemp.splice(1,2);
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
