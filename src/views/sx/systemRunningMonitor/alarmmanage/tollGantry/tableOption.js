import {dataGroup, exportExcel, mapToArray} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default {

  roadStationColumns: [
    {
      title: "编号",
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
      field: "stationName",
      title: "报警类型",
      align: 'center',
      minWidth: 120
    },
    {
      field: "stationName",
      title: "报警时间",
      align: 'center',
      minWidth: 120
    },
    {
      field: "stationName",
      title: "详细信息",
      align: 'center',
      minWidth: 120
    }
    ],
    gantryColumns: [
      {
        title: "编号",
        align: 'center',
        field: "roadName",
        minWidth: 120
      },
      {
        field: "stationName",
        title: "门架",
        align: 'center',
        minWidth: 120
      },
      {
        field: "stationName",
        title: "报警类型",
        align: 'center',
        minWidth: 120
      },
      {
        field: "stationName",
        title: "报警时间",
        align: 'center',
        minWidth: 120
      },
      {
        field: "stationName",
        title: "详细信息",
        align: 'center',
        minWidth: 120
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
        columnsTemp = roadStationColumns;
        break;
      case "station":
        columnsTemp = roadStationColumnsTemp;
        break;
      case "gantry":
        // roadStationColumnsTemp.splice(1,1);
        columnsTemp = this.gantryColumns;
        break;
        // columnsTemp = otherColumnsTemp;
        // break;
      case "vehicleClass":
        // roadStationColumnsTemp.splice(1,1);
        columnsTemp = this.vehicleClassColumns;
        break;
        // let vehClassTemp = {
        //   title: "车种",
        //   align: 'center',
        //   field: "vehClassName",
        //   minWidth: 120
        // };
        // //车型改为车种
        // otherColumnsTemp.splice(1,1,vehClassTemp);
        // columnsTemp = otherColumnsTemp;
        // break;
      case "vehicleTypeTrend":
        // roadStationColumnsTemp.splice(1,1);
        columnsTemp = this.vehicleTypeTrendColumns;
        break;
      case "vehicleClassTrend":
        // roadStationColumnsTemp.splice(1,1);
        columnsTemp = this.vehicleClassTrendColumns;
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
