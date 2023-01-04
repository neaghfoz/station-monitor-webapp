import {
  dataGroup,
  exportExcel,
  mapToArray,
  transferVehicleClass,
  transferVehicleType,
  transferPathType,
  transfer
} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default {
  // 统计数据
  totalSum: (groupField, item, hjsum, field, oriField, lstField, isSum, istune) => {
    const pathField = "pathV" + oriField.substring(1)
    const lastField = "lastV" + oriField.substring(1)

    // 门架原始车流量
    hjsum[item[groupField] + "_1"] = hjsum[item[groupField] + "_1"] || {}
    hjsum[item[groupField] + "_1"][field] = hjsum[item[groupField] + "_1"][field] || 0
    hjsum[item[groupField] + "_1"][field] += item[oriField]
    // 最后一列合计
    if (isSum) {
      hjsum[item[groupField] + "_1"][lstField] = hjsum[item[groupField] + "_1"][lstField] || 0
      hjsum[item[groupField] + "_1"][lstField] += item[oriField]
    }


    // 门架修正车流量
    hjsum[item[groupField] + "_2"] = hjsum[item[groupField] + "_2"] || {}
    hjsum[item[groupField] + "_2"][field] = hjsum[item[groupField] + "_2"][field] || 0
    hjsum[item[groupField] + "_2"][field] += item[pathField]
    // 最后一列合计
    if (isSum) {
      hjsum[item[groupField] + "_2"][lstField] = hjsum[item[groupField] + "_2"][lstField] || 0
      hjsum[item[groupField] + "_2"][lstField] += item[pathField]
    }


    // 门架拟合补全车流量
    hjsum[item[groupField] + "_3"] = hjsum[item[groupField] + "_3"] || {}
    hjsum[item[groupField] + "_3"][field] = hjsum[item[groupField] + "_3"][field] || 0
    hjsum[item[groupField] + "_3"][field] += item[lastField]
    // 最后一列合计
    if (isSum) {
      hjsum[item[groupField] + "_3"][lstField] = hjsum[item[groupField] + "_3"][lstField] || 0
      hjsum[item[groupField] + "_3"][lstField] += item[lastField]
    }

    // 交调站合计车流量
    hjsum[item[groupField]+"_4"] = hjsum[item[groupField]+"_4"]||{}
    //hjsum[item[groupField]+"_4"][field] = hjsum[item[groupField]+"_4"][field]||0
    //hjsum[item[groupField]+"_4"][field] += item.tuneNum
    // 最后一列合计
    if(isSum && istune){
      hjsum[item[groupField]+"_4"][lstField] = hjsum[item[groupField]+"_4"][lstField]||0
      hjsum[item[groupField]+"_4"][lstField] += item.tuneNum
    }

    // 总合计原始车流量
    hjsum["Z999999999999999999_1"] = hjsum["Z999999999999999999_1"] || {}
    hjsum["Z999999999999999999_1"][field] = hjsum["Z999999999999999999_1"][field] || 0
    hjsum["Z999999999999999999_1"][field] += item[oriField]
    // 总合计最后一列合计
    if (isSum) {
      hjsum["Z999999999999999999_1"][lstField] = hjsum["Z999999999999999999_1"][lstField] || 0
      hjsum["Z999999999999999999_1"][lstField] += item[oriField]
    }

    // 总合计修正车流量
    hjsum["Z999999999999999999_2"] = hjsum["Z999999999999999999_2"] || {}
    hjsum["Z999999999999999999_2"][field] = hjsum["Z999999999999999999_2"][field] || 0
    hjsum["Z999999999999999999_2"][field] += item[pathField]
    // 总合计最后一列合计
    if (isSum) {
      hjsum["Z999999999999999999_2"][lstField] = hjsum["Z999999999999999999_2"][lstField] || 0
      hjsum["Z999999999999999999_2"][lstField] += item[pathField]
    }

    // 总合计拟合补全车流量
    hjsum["Z999999999999999999_3"] = hjsum["Z999999999999999999_3"] || {}
    hjsum["Z999999999999999999_3"][field] = hjsum["Z999999999999999999_3"][field] || 0
    hjsum["Z999999999999999999_3"][field] += item[lastField]
    // 总合计最后一列合计
    if (isSum) {
      hjsum["Z999999999999999999_3"][lstField] = hjsum["Z999999999999999999_3"][lstField] || 0
      hjsum["Z999999999999999999_3"][lstField] += item[lastField]
    }

    // 交调站合计车流量
    hjsum["Z999999999999999999_4"] = hjsum["Z999999999999999999_4"]||{}
    //hjsum["Z999999999999999999_4"][field] = hjsum["Z999999999999999999_4"][field]||0
    //hjsum["Z999999999999999999_4"][field] += item.tuneNum
    // 总合计最后一列合计
    if(isSum && istune){
      hjsum["Z999999999999999999_4"][lstField] = hjsum["Z999999999999999999_4"][lstField]||0
      hjsum["Z999999999999999999_4"][lstField] += item.tuneNum
    }
  },
  vcColumns: (gantryId,tableInfo) => {
    return [{
        title: () => { return tableInfo.roadName?tableInfo.roadName+'['+tableInfo.beginDay+':'+tableInfo.endDay+']':'门架信息' },
        align: 'center',
        children: [{
            title: "门架名称",
            align: 'center',
            field: "gantryName",
            type: 'html',
            formatter: ({
              cellValue
            }) => {
              return `<span style="text-decoration:underline;cursor: pointer;">${cellValue}</span>`
            },
            visible: gantryId ? false : true,
            minWidth: 120
          },
          {
            field: "tollGantryId",
            title: "门架编码",
            align: 'center',
            visible: gantryId ? false : true,
            minWidth: 120
          }
        ]
      },
      {
        title: () => { return tableInfo.gantryName?tableInfo.gantryName+'['+tableInfo.beginDay+':'+tableInfo.endDay+']':'#' },
        align: 'center',
        children: [
          {
            title: "通行日期",
            align: 'center',
            field: "transDay",
            visible: gantryId ? true : false,
            minWidth: 91
          },
          {
            field: "typeName",
            title: "类型",
            align: 'center',
            visible: gantryId ? true : false,
            minWidth: 120
          }
        ]
      },
      {
        field: "typeName",
        title: "类型",
        align: 'center',
        visible: gantryId ? false : true,
        minWidth: 120
      },
      {
        title: "车种",
        align: 'center',
        headerAlign: 'center',
        children: [{
            field: "vcNum0",
            title: "普通车",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vcNum8",
            title: "军警",
            headerAlign: 'center',
            align: 'right',
            minWidth: 80
          },
          {
            field: "vcNum10",
            title: "紧急",
            headerAlign: 'center',
            align: 'right',
            minWidth: 80
          },
          {
            field: "vcNum14",
            title: "车队",
            headerAlign: 'center',
            align: 'right',
            minWidth: 80
          },
          {
            field: "vcNum21",
            title: "绿通车",
            headerAlign: 'center',
            align: 'right',
            minWidth: 80
          },
          {
            field: "vcNum22",
            title: "联合收割机",
            headerAlign: 'center',
            align: 'right',
            minWidth: 80
          },
          {
            field: "vcNum23",
            title: "抢险救灾",
            headerAlign: 'center',
            align: 'right',
            minWidth: 80
          },
          {
            field: "vcNum24",
            title: "J1类集装箱车",
            headerAlign: 'center',
            align: 'right',
            minWidth: 80
          },
          {
            field: "vcNum25",
            title: "大件运输",
            headerAlign: 'center',
            align: 'right',
            minWidth: 80
          },
          {
            field: "vcNum26",
            title: "应急保障车",
            headerAlign: 'center',
            align: 'right',
            minWidth: 80
          },
          {
            field: "vcNum27",
            title: "货车列车或半挂汽车列车",
            headerAlign: 'center',
            align: 'right',
            minWidth: 80
          },
          {
            field: "vcNum28",
            title: "J2类型集装箱",
            headerAlign: 'center',
            align: 'right',
            minWidth: 80
          },
          {
            field: "vcNumDef",
            title: "其他车种",
            headerAlign: 'center',
            align: 'right',
            minWidth: 80
          }
        ]
      },
      {
        title: "合计",
        align: 'right',
        headerAlign: 'center',
        field: "vcsum",
        minWidth: 80
      }
    ]
  },
  vtColumns: (gantryId,tableInfo) => {
    return [{
        title: () => { return tableInfo.roadName?tableInfo.roadName+'['+tableInfo.beginDay+':'+tableInfo.endDay+']':'门架信息' },
        align: 'center',
        children: [{
            title: "门架名称",
            align: 'center',
            field: "gantryName",
            type: 'html',
            formatter: ({
              cellValue
            }) => {
              return `<span style="text-decoration:underline;cursor: pointer;">${cellValue}</span>`
            },
            visible: gantryId ? false : true,
            minWidth: 120
          },
          {
            field: "tollGantryId",
            title: "门架编码",
            align: 'center',
            visible: gantryId ? false : true,
            minWidth: 120
          }
        ]
      },
      {
        title: () => { return tableInfo.gantryName?tableInfo.gantryName+'['+tableInfo.beginDay+':'+tableInfo.endDay+']':'#' },
        align: 'center',
        children: [
          {
            title: "通行日期",
            align: 'center',
            field: "transDay",
            visible: gantryId ? true : false,
            minWidth: 91
          },
          {
            field: "typeName",
            title: "类型",
            align: 'center',
            visible: gantryId ? true : false,
            minWidth: 120
          }
        ]
      },
      {
        field: "typeName",
        title: "类型",
        align: 'center',
        visible: gantryId ? false : true,
        minWidth: 120
      },
      {
        title: "客车",
        align: 'center',
        headerAlign: 'center',
        children: [{
            field: "vtNum1",
            title: "客一",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vtNum2",
            title: "客二",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vtNum3",
            title: "客三",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vtNum4",
            title: "客四",
            align: 'right',
            minWidth: 80
          },
          {
            field: "kchj",
            title: "小计",
            align: 'right',
            minWidth: 80
          }
        ]
      },
      {
        title: "货车",
        align: 'center',
        headerAlign: 'center',
        children: [{
            field: "vtNum11",
            title: "货一",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vtNum12",
            title: "货二",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vtNum13",
            title: "货三",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vtNum14",
            title: "货四",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vtNum15",
            title: "货五",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vtNum16",
            title: "货六",
            align: 'right',
            minWidth: 80
          },
          {
            field: "hchj",
            title: "小计",
            align: 'right',
            minWidth: 80
          }
        ]
      },
      {
        title: "专项作业车",
        align: 'center',
        headerAlign: 'center',
        children: [{
            field: "vtNum21",
            title: "专一",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vtNum22",
            title: "专二",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vtNum23",
            title: "专三",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vtNum24",
            title: "专四",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vtNum25",
            title: "专五",
            align: 'right',
            minWidth: 80
          },
          {
            field: "vtNum26",
            title: "专六",
            align: 'right',
            minWidth: 80
          },
          {
            field: "zxhj",
            title: "小计",
            align: 'right',
            minWidth: 80
          }
        ]
      },
      {
        field: "vtNumDef",
        title: "其它",
        align: 'right',
        minWidth: 80
      },
      {
        title: "合计",
        align: 'right',
        headerAlign: 'center',
        field: "vtsum",
        minWidth: 80
      }
    ]
  },
  dataFormat: function (dataArr, gantryId, gantryMap) {
    let hjsum = {} // 小计 合计
    let groupByField = null
    let whereFn = null
    if (gantryId) {
      groupByField = 'transDay'
      whereFn = (item) => {
        return item['tollGantryId'] == gantryId
      }
    } else {
      groupByField = 'tollGantryId'
    }
    let $totalSum = this.totalSum
    let datas = dataGroup(dataArr, null, function (item) {
      return [item[groupByField]]
    }, function (item, sum) {
      let vehicleClassArr = ["vcNum0", "vcNum8", "vcNum10", "vcNum14", "vcNum21", "vcNum22", "vcNum23", "vcNum24", "vcNum25", "vcNum26", "vcNum27", "vcNum28", "vcNumDef"]
      for (let index = 0; index < vehicleClassArr.length; index++) {
        const columnName = vehicleClassArr[index];
        // 按车种统计
        let field = columnName
        let oriField = columnName
        let lstField = 'vcsum'
        let istune = false;
        if(index+1 == vehicleClassArr.length) {
          istune = true
        }
        $totalSum(groupByField, item, hjsum, field, oriField, lstField, true,istune)
      }

      let vehicleTypeArr = [1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, -1]
      for (let index = 0; index < vehicleTypeArr.length; index++) {
        const vehTypeVal = vehicleTypeArr[index];
        const columnName = "vtNum" + (vehTypeVal == -1 ? "Def" : vehTypeVal)

        // 按车型统计
        let field = columnName
        let oriField = columnName
        let lstField = 'vtsum'
        let istune = false;
        if(index+1 == vehicleClassArr.length) {
          istune = true
        }
        $totalSum(groupByField, item, hjsum, field, oriField, lstField, true,istune)

        // 客货专小计
        let hasType = false;
        if (vehTypeVal > 0 && vehTypeVal < 5) {
          field = 'kchj';
          hasType = true;
        } else if (vehTypeVal > 10 && vehTypeVal < 17) {
          field = 'hchj';
          hasType = true;
        } else if (vehTypeVal > 20 && vehTypeVal < 27) {
          field = 'zxhj';
          hasType = true;
        }
        if (hasType) {
          $totalSum(groupByField, item, hjsum, field, oriField, lstField, false,false)
        }
      }

      /* if (item.vehicleClass != null) {
        // 不合法车种，转为其它
        if (transferVehicleClass(item.vehicleClass, true) == '') {
          item.vehicleClass = 99
        }
        // 按车种统计
        let field = 'vc' + item.vehicleClass
        let lstField = 'vcsum'
        $totalSum(groupByField, item, hjsum, field, lstField, true)
      }
      if (item.vehicleType != null) {
        // 不合法车型，转为其它
        if (transferVehicleType(item.vehicleType, true) == '') {
          item.vehicleType = 99
        }
        // 按车型统计
        let field = 'vt' + item.vehicleType;
        let lstField = 'vtsum'
        $totalSum(groupByField, item, hjsum, field, lstField, true)

        // 客货专小计
        let hasType = false;
        if (item.vehicleType > 0 && item.vehicleType < 5) {
          field = 'kchj';
          hasType = true;
        } else if (item.vehicleType > 10 && item.vehicleType < 17) {
          field = 'hchj';
          hasType = true;
        } else if (item.vehicleType > 20 && item.vehicleType < 27) {
          field = 'zxhj';
          hasType = true;
        }
        if (hasType) {
          $totalSum(groupByField, item, hjsum, field, lstField, false)
        }
      } */
    }, whereFn);
    datas = mapToArray(hjsum, function (key, row) {
      let arr = key.split('_')
      let gFieldVal = arr[0]
      let type = arr[1]
      row[groupByField] = gFieldVal
      // 转换 和 新增列
      row['type'] = type
      //row['typeName'] = type == 1 ? '门架原始车流量' : (type == 2 ? '清洗修正车流量' : '拟合补全车流量')
      row['typeName'] = type==1?'门架原始车流量':(type==2?'清洗修正车流量':(type==3?'拟合补全车流量':'交调站车流量'))

      if (groupByField == 'tollGantryId') {
        // 翻译门架名称
        row['gantryName'] = gantryMap[gFieldVal] || gFieldVal
        if (gFieldVal == 'Z999999999999999999') {
          row['gantryName'] = ''
        }
      }
    })
    datas.sort(function (a, b) {
      return a[groupByField].localeCompare(b[groupByField]) || a['type'] - b['type']
    })
    if (datas.length > 0) {
      datas[datas.length - 1][groupByField] = '合计'
      datas[datas.length - 2][groupByField] = '合计'
      datas[datas.length - 3][groupByField] = '合计'
      datas[datas.length - 4][groupByField] = '合计'
    }
    return datas
  },
  export: function (refTable, fileName) {
    exportExcel(refTable, fileName)
  }
}
