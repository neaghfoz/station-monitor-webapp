import {dataGroup, exportExcel, mapToArray} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default {

  tableColumns: [
    {
      title: "门架编号",
      type: "seq",
      width: 50,
      align: "center"
    },
    {
      title: "在用计费模块和计费参数版本号",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "门架前端运行参数版本号",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "前端积压通行流水数",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "前端积压牌识流水数",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "门架前端软件运行状态",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "前端数据盘剩余容量",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "门架后台编号",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "控制器序号",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "后台积压通行流水数",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "后台积压牌识流水数",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "后台数据盘剩余容量",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
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
