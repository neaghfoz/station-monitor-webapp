import {dataGroup, exportExcel, mapToArray} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default {

  tableColumns: [
    {
      title: "序号",
      type: "seq",
      width: 50,
      align: "center"
    },
    {
      field: "stationName",
      title: "收费站名称",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "路段名称",
      align: 'center',
      field: "roadName",
      minWidth: 120 ,
    },
    {
      field: "startEndDateText",
      title: "统计时间",
      align: 'center',
      minWidth: 100 ,
    },
    {
      title: "入口车流量",
      align: 'center',
      field: "enCount",
      minWidth: 120 ,
    },
    {
      field: "enListRate",
      title: "入口交易成功率",
      align: 'center',
      minWidth: 100
    },
    {
      field: "enPlateRate",
      title: "入口车牌识别准确率",
      align: 'center',
      minWidth: 100
    },
    {
      field: "exCount",
      title: "出口车流量",
      align: 'center',
      minWidth: 100
    },
    {
      field: "exListRate",
      title: "出口交易成功率",
      align: 'center',
      minWidth: 100
    },
    {
      field: "exPlateRate",
      title: "出口车牌识别准确率",
      align: 'center',
      minWidth: 100
    },
    {
      field: "avgMilliSecond",
      title: "ETC平均交易耗时（毫秒）",
      align: 'center',
      minWidth: 100
    },
    {
      field: "avgVehSpeed",
      title: "ETC平均同行速度（公里/小时）",
      align: 'center',
      minWidth: 100
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
