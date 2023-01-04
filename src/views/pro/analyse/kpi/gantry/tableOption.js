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
      title: "路段名称",
      align: 'center',
      field: "roadName",
      minWidth: 120 ,
    },
    {
      field: "gantryName",
      title: "收费门架名称",
      align: 'center',
      minWidth: 120 ,
    },
    {
      field: "transDate",
      title: "统计日期",
      align: 'center',
      minWidth: 100 ,
    },
    {
      field: "gantryTransSignRate",
      title: "标签交易成功率",
      align: 'center',
      minWidth: 100
    },
    {
      field: "gantryTransCardRate",
      title: "用户卡交易成功率",
      align: 'center',
      minWidth: 100
    },
    {
      field: "gantryTransCpcRate",
      title: "CPC计费成功率",
      align: 'center',
      minWidth: 100
    },
    {
      field: "gantryTransSignPlateRate",
      title: "ETC车牌识别准确率",
      align: 'center',
      minWidth: 100
    },
    {
      field: "gantryTransCpcPlateRate",
      title: "CPC车牌识别准确率",
      align: 'center',
      minWidth: 100
    }],
  getColums: function (tableType){
    let columnsTemp=[];

    Object.assign(columnsTemp,this.tableColumns);
    switch (tableType) {
      case "road":
        //移除收费统计站列
        columnsTemp.splice(2,2);
        break;
      case "gantry":
        //columnsTemp = roadStationColumnsTemp;
        columnsTemp.splice(3,1);
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
