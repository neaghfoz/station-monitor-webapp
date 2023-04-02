import {dataGroup, exportExcel, mapToArray} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default {

  tableColumns: [
    {
      title: "编号",
      type: "seq",
      width: 50,
      align: "center"
    },
    {
      title: "路段名称",
      field: "roadName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "收费站名称",
      field: "stationName",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车道号",
      field: "laneId",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车道类型",
      field: "laneType",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车道标志",
      field: "laneSign",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "当前信用灰名单版本号",
      field: "vehicleGreyListVersion",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "当前信用黑名单版本号",
      field: "vehicleBlackListVersion",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "当前OBU状态名单版本号",
      field: "obuBlackListVersion",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "用户卡状态名单版本号",
      field: "cpuBlackListVersion",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "当前CPC卡灰名单版本号",
      field: "cpcGreyListVersion",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "在用最小费额计费参数版本号",
      field: "spcRateVersion",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车道状态",
      field: "laneStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "RSU状态",
      field: "rsuStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "读卡器状态",
      field: "cardReaderStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "移动支付设备",
      field: "payEquipmentStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车牌识别状态",
      field: "VPLRStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车检器状态",
      field: "vehDetectorStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "轴型检测器状态",
      field: "axleDetectorStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "光栅状态",
      field: "lightDetectorStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车道摄像机状态",
      field: "HDVideoStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "费额显示屏状态",
      field: "feeBoardStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "信息提示屏状态",
      field: "hintsBoardStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "通行信号灯状态",
      field: "tradfficLight1Status",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "ETC情报板状态",
      field: "infoBoardStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "入口治超设施状态",
      field: "entryOverloadStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "当前操作系统版本号",
      field: "sysVer",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车道软件厂商编号",
      field: "opsVer",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "当前信用灰名单更新时间",
      field: "vehicleGreyListRecTime",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "当前信用黑名单更新时间",
      field: "vehicleBlackListRecTime",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "当前OBU状态名单更新时间",
      field: "obuBlackListRecTime",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "用户卡状态名单更新时间",
      field: "cpuBlackListRecTime",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "当前CPC卡灰名单更新时间",
      field: "cpcGreyListRecTime",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "待启用最小费额计费参数版本号",
      field: "notenableSpcRateVersion",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "待启用最小费额计费参数接收时间",
      field: "notenableSpcRateRecTime",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车道控制器",
      field: "laneControllerStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "对应站级服务器",
      field: "serverStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "自动栏杆机",
      field: "railerStatus",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车道控制器厂商代码",
      field: "laneControllerManuID",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车道软件厂商编号",
      field: "opsCode",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "路侧单元厂商代码",
      field: "RSUManuID",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "路侧单元硬件版本",
      field: "RSUHardwareVersion",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "路侧单元软件版本",
      field: "RSUSoftwareVersion",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "读写器厂商代码",
      field: "cardReaderManuID",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "读写器固件版本",
      field: "cardReaderVersion",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "车牌识别厂商代码",
      field: "VPLRManuID",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "创建时间",
      field: "createTime",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "序列号",
      field: "hgSeq",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "入库时间",
      field: "hgInsertTableTime",
      align: 'center',
      minWidth: 120 ,
    },
    {
      title: "优免参数版本号",
      field: "appointVersion",
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
