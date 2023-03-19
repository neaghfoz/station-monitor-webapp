import {dataGroup, exportExcel, mapToArray} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default {

  tableColumns: [
    // {
    //   title: "序号",
    //   type: "seq",
    //   width: 50,
    //   align: "center"
    // },
    // {
    //   title: "路段名称",
    //   align: 'center',
    //   field: "roadName",
    //   minWidth: 120,
    // },
    {
      title: "收费站名称",
      align: 'center',
      field: "stationName",
      minWidth: 120,
    },
    {
      title: "起止日期",
      align: 'center',
      field: "startEndDateText",
      minWidth: 120,
    }, {
      title: "收费特情名称",
      align: 'center',
      field: "specialType",
      minWidth: 120,
    }, {
      title: "收费特情流水数量",
      align: 'center',
      field: "count",
      minWidth: 120
    }, {
      title: "收费特情占比",
      align: 'center',
      field: "specialRateText",
      minWidth: 120,
    }],
  tableSpecialTimeColumns: [
    {
      title: "序号",
      type: "seq",
      width: 50,
      align: "center"
    }, {
      title: "收费特情名称",
      align: 'center',
      field: "specialTypeName",
      minWidth: 120,
    }, {
      title: "统计日期",
      align: 'center',
      field: "transDate",
      minWidth: 120,
    }, {
      title: "收费特情流水数量",
      align: 'center',
      field: "specialCnt",
      minWidth: 120
    }, {
      title: "收费特情占比",
      align: 'center',
      field: "specialRate",
      minWidth: 120,
    }],


  getColums: function (tableType, analyseType, columns) {
    let columnsTemp = [];

    switch (tableType) {
      case "road":
        //移除收费统计站列
        Object.assign(columnsTemp, this.tableColumns);
        for (var tmp in columns) {
          if (analyseType == '1') {
            columnsTemp.push(
              {
                title: columns[tmp],
                field: tmp,
                minWidth: 150
              });
          } else if (analyseType == '2') {
            columnsTemp.push(
              {
                title: columns[tmp],
                field: tmp,
                minWidth: 150,
                //formatter: 'integer'
                formatter: (params) => {  //格式化数据的函数
                  console.log('我的参数', params)  //打印出来的数据
                  //未定义 返回  0.00%
                  if (!params.cellValue) {
                    params.cellValue = '0.00%';
                  }
                  return params.cellValue;
                },
              });
          }
        }
        columnsTemp.splice(2, 1);
        break;
      case "station":
        //station 移除
        Object.assign(columnsTemp, this.tableColumns);
        for (var tmp in columns) {
          if (analyseType == '1') {
            columnsTemp.push(
              {
                title: columns[tmp],
                field: tmp,
                minWidth: 150
              });
          } else if (analyseType == '2') {
            columnsTemp.push(
              {
                title: columns[tmp],
                field: tmp,
                minWidth: 150,
                formatter: (params) => {  //格式化数据的函数
                  console.log('我的参数', params)  //打印出来的数据
                  //未定义 返回  0.00%
                  if (!params.cellValue) {
                    params.cellValue = '0.00%';
                  }
                  return params.cellValue;
                },
              });
          }
        }
        break;
      case "special":
        //columnsTemp = roadStationColumnsTemp;
        Object.assign(columnsTemp, this.tableSpecialTimeColumns);
        columnsTemp.splice(2, 1);
        break;
      case "time":
        Object.assign(columnsTemp, this.tableSpecialTimeColumns);
        columnsTemp.splice(1, 1);
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
