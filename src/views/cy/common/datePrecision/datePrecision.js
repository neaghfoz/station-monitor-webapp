import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import XlLSXStyle from 'tibms-xlsx-style'

/**
 * 获取每月的第一天开始时间
 * @param monthValue
 * @returns {string}
 */
export const getMonthFirstDay = (monthValue) => {
  return monthValue+"-01 00:00:00";
}

/**
 * 获取每月的第一天开始日期
 * @param monthValue
 * @returns {string}
 */
export const getMonthFirstDate = (monthValue) => {
  return monthValue+"-01";
}

/**
 * 获取每月的最后一天结束时间
 * @param monthValue
 * @returns {string}
 */
export const getMonthLastDay = (monthValue) => {
  var monthValueArray = monthValue.split("-");
  var yearVar = monthValueArray[0];
  var monthVar = monthValueArray[1];
  var dayVar = 0;
  if(monthVar == 1 || monthVar== 3 || monthVar == 5 || monthVar == 7 || monthVar== 8 || monthVar == 10 || monthVar == 12) {
    dayVar = 31;
  }
  if(monthVar == 4 || monthVar== 6 || monthVar == 9 || monthVar == 11) {
    dayVar = 30;
  }
  if(monthVar == 2) {
    if ((yearVar % 4 == 0 && yearVar % 100 != 0) || (yearVar % 400 == 0)) {
      dayVar = 29;
    } else {
      dayVar = 28;
    }
  }
  return yearVar+"-"+monthVar+"-"+dayVar+" 23:59:59";
}

/**
 * 获取每月的最后一天结束日期
 * @param monthValue
 * @returns {string}
 */
export const getMonthLastDate = (monthValue) => {
  var monthValueArray = monthValue.split("-");
  var yearVar = monthValueArray[0];
  var monthVar = monthValueArray[1];
  var dayVar = 0;
  if(monthVar == 1 || monthVar== 3 || monthVar == 5 || monthVar == 7 || monthVar== 8 || monthVar == 10 || monthVar == 12) {
    dayVar = 31;
  }
  if(monthVar == 4 || monthVar== 6 || monthVar == 9 || monthVar == 11) {
    dayVar = 30;
  }
  if(monthVar == 2) {
    if ((yearVar % 4 == 0 && yearVar % 100 != 0) || (yearVar % 400 == 0)) {
      dayVar = 29;
    } else {
      dayVar = 28;
    }
  }
  return yearVar+"-"+monthVar+"-"+dayVar;
}

/**
 * 获取每年的第一天开始时间
 * @param yearValue
 * @returns {string}
 */
export const getYearFirstDay = (yearValue) => {
  return yearValue+"-01-01 00:00:00";
}

/**
 * 获取每年的最后一天结束时间
 * @param yearValue
 * @returns {string}
 */
export const getYearLastDay = (yearValue) => {
  return yearValue+"-12-31 23:59:59";
}

/**
 * 为月份补充0
 * @param val
 * @returns {*}
 */
export const supplementMonth = (val) => {
  if(val < 10) {
    return "0"+val;
  } else {
    return val;
  }
}
