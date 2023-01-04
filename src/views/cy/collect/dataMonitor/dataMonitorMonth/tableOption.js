import moment from 'moment'
import {exportExcel} from "@/views/pro/common/util/dataUtil";
import dataMonitorApi from "@/views/cy/collect/dataMonitor/dataMonitorMonth/dataMonitorApi";

export default {
  returnData:{},
  columns1: [
    {
      title: "序号",
      type: "seq",
      width: 50,
      headerAlign: 'center',
      align: "center"
    },
    {
      title: "路段名称",
      align: 'center',
      field: "roadName",
      minWidth: 120
    },
    {
      field: "tableName",
      title: "数据表名称",
      align: 'center',
      minWidth: 280
    },
    {
      title: "统计时间",
      align: 'center',
      field: "collectDateRange",
      minWidth: 200
    },
    {
      title: "需填报",
      align: 'center',
      field: "totalCnt",
      minWidth: 90
    },
    {
      title: "已填报",
      align: 'center',
      field: "completeCnt",
      minWidth: 90
    },
    {
      title: "待填报",
      align: 'center',
      field: "inCompleteCnt",
      minWidth: 90
    },
    {
      title: "完成率(%)",
      align: 'center',
      field: "completionRate",
      minWidth: 90
    },
    {
      title: "待填报日期",
      align: 'center',
      field: "inCompleteDateStr",
      minWidth: 300,
      showOverflow: true
    }],
  columns2: [
    {
      title: "序号",
      type: "seq",
      width: 50,
      headerAlign: 'center',
      align: "center"
    },
    {
      title: "路段名称",
      align: 'center',
      field: "roadName",
      minWidth: 100
    },
    {
      field: "tableName",
      title: "数据表名称",
      align: 'center',
      minWidth: 215
    }],

  /**
   * 根据类型获取列
   * @param type
   * @returns {[]}
   */
  getColumn (colSettings, params)
  {
    let type = params.showDefault;
    let columnsTemp=[];
    if(type === 'table') {
      Object.assign(columnsTemp, this.columns1);
    }else {
      Object.assign(columnsTemp, this.columns2);

      colSettings.forEach(x => {
        columnsTemp.push(
          {title: x.colTitle,
            field: x.colField,
            align: 'center',
            minWidth: 45,
            slots: {
              default: ({row}, h) => {
                if (row[x.colField] == '0') {
                  return [h('i',{class:"el-icon-plus",style: {color: 'green'}})]
                } else if (row[x.colField] == '1') {
                  return [h('i',{class:"el-icon-edit-outline",style: {color: 'blue'}})]
                } else if (row[x.colField] == '2' || row[x.colField] == '5' || row[x.colField] == '6' || row[x.colField] == '7') {
                  return [h('i',{class:"el-icon-edit-outline",style: {color: 'blue'}})]
                }else if (row[x.colField] == '3' || row[x.colField] == '4') {
                  return [h('i',{class:"el-icon-success",style: {color: 'green'}})]
                }else if (row[x.colField] == '-1') {
                  return [h('i',{class:"el-icon-circle-check",style: {color: 'black'}})]
                }else{
                  return ''
                }
              }
            }
          });
      });
    }
    return columnsTemp;

  },

  /**
   * 根据类型获取数据
   * @param params
   * @param data
   * @returns {Promise<void>}
   */
  async getData(params,data)
  {
    let resultData = {};
    resultData  = await dataMonitorApi.findData(params,data);
    this.returnData = resultData;
  },
  export:function (refTable,fileName) {
    exportExcel(refTable,fileName)
  }


}
