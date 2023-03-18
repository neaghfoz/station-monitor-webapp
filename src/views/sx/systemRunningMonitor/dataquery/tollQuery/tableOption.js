import {dataGroup, exportExcel, mapToArray} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default {

  tableColumns: [
    {
      title: "收费单元编号",
      type: "seq",
      width: 50,
      align: "center"
    },
    {
      title: "收费单元名称",
      field: "name",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "路段性质",
      field: "type",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "上下行",
      field: "direction",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "起止里程",
      field: "length",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "起始计费位置桩号",
      field: "startStakeNum",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "终止计费位置桩号",
      field: "endStakeNum",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "重合收费公路编号",
      field: "tollRoads",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "收费单元类型",
      field: "intervalType",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "开始收费时间",
      field: "beginTime",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "停止收费时间",
      field: "endTime",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "省界标识",
      field: "provinceType",
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
