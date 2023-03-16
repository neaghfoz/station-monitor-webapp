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
      title: "门架名称",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "服务器IP",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "RSU控制器(主)",
      align: 'center',
      headerAlign: 'center',
      children: [
        {
          title: "连通状态",
          field: "stationName",
          align: 'center',
          minWidth: 120 ,
        },
        {
          title: "当天心跳",
          align: 'center',
          field: "roadName",
          minWidth: 120 ,
        }]
     },
     {
      title: "RSU控制器(备)",
      align: 'center',
      headerAlign: 'center',
      children: [
        {
          title: "连通状态",
          field: "stationName",
          align: 'center',
          minWidth: 120 ,
        },
        {
          title: "当天心跳",
          align: 'center',
          field: "roadName",
          minWidth: 120 ,
        }]
     },
     {
      title: "车牌识别连通状态",
      align: 'center',
      headerAlign: 'center',
      children: [
        {
          title: "101",
          field: "stationName",
          align: 'center',
          minWidth: 120 ,
        },
        {
          title: "102",
          align: 'center',
          field: "roadName",
          minWidth: 120 ,
        },
        {
          title: "103",
          align: 'center',
          field: "roadName",
          minWidth: 120 ,
        },
        {
          title: "104",
          align: 'center',
          field: "roadName",
          minWidth: 120 ,
        },
        {
          title: "105",
          align: 'center',
          field: "roadName",
          minWidth: 120 ,
        },
        {
          title: "106",
          align: 'center',
          field: "roadName",
          minWidth: 120 ,
        }
      ]
     },
     {
      title: "交易数据上传",
      align: 'center',
      headerAlign: 'center',
      children: [
        {
          title: "总量",
          field: "stationName",
          align: 'center',
          minWidth: 120 ,
        },
        {
          title: "不及时",
          align: 'center',
          field: "roadName",
          minWidth: 120 ,
        }]
     },
     {
      title: "牌识数据上传",
      align: 'center',
      headerAlign: 'center',
      children: [
        {
          title: "总量",
          field: "stationName",
          align: 'center',
          minWidth: 120 ,
        },
        {
          title: "不及时",
          align: 'center',
          field: "roadName",
          minWidth: 120 ,
        }]
     },
     {
      title: "OBU交易成功率",
      align: 'center',
      headerAlign: 'center',
      children: [
        {
          title: "特情",
          field: "stationName",
          align: 'center',
          minWidth: 120 ,
        },
        {
          title: "总数",
          align: 'center',
          field: "roadName",
          minWidth: 120 ,
        },
        {
          title: "成功",
          align: 'center',
          field: "roadName",
          minWidth: 120 ,
        },
        {
          title: "成功率",
          align: 'center',
          field: "roadName",
          minWidth: 120 ,
        }
      ]
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
