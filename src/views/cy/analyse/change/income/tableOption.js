import moment from 'moment'
import {exportExcel} from "@/views/pro/common/util/dataUtil";
import gantrySpecialApi from "@/views/cy/analyse/change/income/stationIncomeApi";

export default {
  returnData:{},
  baseColumns: [
    {
      title: "序号",
      type: "seq",
      width: 50,
      headerAlign: 'center',
      align: "center"
    },
    {
      title: "年份",
      align: 'center',
      field: "countYear",
      minWidth: 120
    },
    {
      title: "一月",
      field: "sumOfJanuary",
      align: 'center',
      minWidth: 100
    },
    {
      title: "二月",
      field: "sumOfFebruary",
      align: 'center',
      minWidth: 100
    },
    {
      title: "三月",
      field: "sumOfMarch",
      align: 'center',
      minWidth: 100
    },
    {
      title: "四月",
      field: "sumOfApril",
      align: 'center',
      minWidth: 100
    },
    {
      title: "五月",
      field: "sumOfMay",
      align: 'center',
      minWidth: 100
    },
    {
      title: "六月",
      field: "sumOfJune",
      align: 'center',
      minWidth: 100
    },
    {
      title: "七月",
      field: "sumOfJuly",
      align: 'center',
      minWidth: 100
    },
    {
      title: "八月",
      field: "sumOfAugust",
      align: 'center',
      minWidth: 100
    },
    {
      title: "九月",
      field: "sumOfSeptember",
      align: 'center',
      minWidth: 100
    },
    {
      title: "十月",
      field: "sumOfOctober",
      align: 'center',
      minWidth: 100
    },
    {
      title: "十一月",
      field: "sumOfNovember",
      align: 'center',
      minWidth: 100
    },
    {
      title: "十二月",
      field: "sumOfDecember",
      align: 'center',
      minWidth: 100
    }],
 
  /**
   * 根据类型获取列
   * @param type
   * @returns {[]}
   */
  getColumn (colSettings, params)
  {
     return this.baseColumns;
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
    resultData  = await gantrySpecialApi.findData(params,data);
    console.log(resultData)
    this.returnData = resultData;
    return  resultData;
  },
  export:function (refTable,fileName) {
    exportExcel(refTable,fileName)
  }

}
