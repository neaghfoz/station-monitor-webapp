import {dataGroup, exportExcel, mapToArray} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default {

  tableColumns: [
    {
      title: "门架编号",
      field: "id",
      width: 250,
      align: "center"
    },
    {
      title: "门架名称",
      field: "name",
      align: 'center',
      minWidth: 120 ,
    },
    // {
    //   title: "顺序号",
    //   field: "type",
    //   align: 'center',
    //   minWidth: 120 ,
    // },
    {
      title: "控制器序号",
      field: "controllerID",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "前端工控机型号",
      field: "controllerModel",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "前端工控机型系统及版本",
      field: "controllerSysVer",
      align: 'center',
      minWidth: 120 ,
    },
    // {
    //   title: "前端工控机IP",
    //   field: "ip",
    //   align: 'center',
    //   minWidth: 120 ,
    // },
    {
      title: "门架后台编号",
      field: "serverID",
      align: 'center',
      minWidth: 120 ,
    },{
      title: "后台服务器型号",
      field: "serverModel",
      align: 'center',
      minWidth: 120 ,
    },{
      title: "后台服务器系统及版本",
      field: "serverSysVer",
      align: 'center',
      minWidth: 120 ,
    },{
      title: "后天服务器IP",
      field: "ip",
      align: 'center',
      minWidth: 120 ,
    },

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
