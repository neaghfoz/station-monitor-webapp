import moment from 'moment'

/**
 * 获取指定日期
 * @param date 时间
 * @param type 类型 'days' 'months' 'years  '
 * @param n 正数为前几天/月/年 负数为后几天/月/年
 * @param format 返回格式 如'YYYY-MM-DD HH:mm:ss'
 * @returns {string}
 */
function getNextDate(date,type,n,format) {
  return moment(date).subtract(n,type).format(format);
}

/**
 *  * 根据日期维度类型转换统一格式时间段 dateStatisticType day--日 month--月 year--年
 * 报表统计类型 collectType squadDate-- 按工班日统计 naturalDate-- 按自然日统计
 * @param
 * @returns {{endDate: string, startDate: string, collectDateStr: string}}
 */
function collectTypeCombination(startTime,endTime,collectType,dateStatisticType) {

  let startDate='';
  let endDate='';
  let collectDateStr='';

  if (collectType == 'squadDate') {
    collectDateStr = "工班";
  } else if(collectType == 'naturalDate') {
    collectDateStr = "自然";
  }else
  {
    collectDateStr = "未知";
  }

  switch(dateStatisticType)
  {
    case 'day':
      startDate = startTime;
      endDate = endTime;
      collectDateStr = collectDateStr + "日期：" + startDate + " 至 " + endDate;
      break;
    case 'month':
      startDate = moment(moment(startTime)).startOf("month").format("YYYY-MM-DD");
      endDate = moment(moment(endTime)).endOf("month").format("YYYY-MM-DD");
      collectDateStr = collectDateStr + "月份：" + startTime + " 至 " + endTime;
      break;
    case 'year':
      startDate = moment(moment(startTime)).startOf("year").format("YYYY-MM-DD");
      endDate = moment(moment(endTime)).endOf("year").format("YYYY-MM-DD");
      collectDateStr = collectDateStr + "年份：" + startTime + " 至 " + endTime;
    default:
      break;
  }

  return {
    'startDate':startDate,
    'endDate':endDate,
    'collectDateStr':collectDateStr
  }
}


/**
 * * 根据日期维度类型转换统一格式时间段 dateStatisticType day--日 month--月 year--年
 * @param startTime
 * @param endTime
 * @param dateStatisticType
 * @returns {{collectDateStr: string, endDate: string, startDate: string}}
 */
function dateCombination(startTime,endTime,dateStatisticType)
{
  let startDate='';
  let endDate='';
  let collectDateStr='通行交易';

  switch(dateStatisticType)
  {
    case 'day':
      startDate = startTime;
      endDate = endTime;
      collectDateStr = collectDateStr + "日期：" + startDate + " 至 " + endDate;
      break;
    case 'month':
      startDate = moment(moment(startTime)).startOf("month").format("YYYY-MM-DD");
      endDate = moment(moment(endTime)).endOf("month").format("YYYY-MM-DD");
      collectDateStr = collectDateStr + "月份：" + startTime + " 至 " + endTime;
      break;
    case 'year':
      startDate = moment(moment(startTime)).startOf("year").format("YYYY-MM-DD");
      endDate = moment(moment(endTime)).endOf("year").format("YYYY-MM-DD");
      collectDateStr = collectDateStr + "年份：" + startTime + " 至 " + endTime;
    default:
      break;
  }

  return {
    'startDate':startDate,
    'endDate':endDate,
    'collectDateStr':collectDateStr
  }
}

/**

 * * 获取同比日期 dateStatisticType day--日 month--月 year--年
 * @param startTime
 * @param endTime
 * @param dateStatisticType
 * @returns {{startCompareTime: string, endCompareTime: string, isSearch: int}}
 */
function dateCompare( startTime, endTime, dateStatisticType)
{
  let startCompareTime ='';
  let endCompareTime ='';
  let isSearch ='';

  // 日期一致才进行返回
  if( startTime == endTime ) {
    isSearch =1;

    switch(dateStatisticType)
    {
      case 'day':
        startCompareTime = getNextDate(startTime, 'year', 1, "YYYY-MM-DD") ;
        endCompareTime = startCompareTime;
        break;
      case 'month':
        startCompareTime = getNextDate(startTime, 'year', 1, "YYYY-MM-DD") ;
        startCompareTime= moment(moment(startCompareTime)).startOf("month").format("YYYY-MM-DD");
        endCompareTime= moment(moment(startCompareTime)).endOf("month").format("YYYY-MM-DD");
        break;
      case 'year':
        startCompareTime = getNextDate(startTime, 'year', 1, "YYYY-MM-DD") ;
        startCompareTime= moment(moment(startCompareTime)).startOf("year").format("YYYY-MM-DD");
        endCompareTime= moment(moment(startCompareTime)).endOf("year").format("YYYY-MM-DD");
      default:
        break;
    }

  } else {
    isSearch =0;
  }


  return {
    'startCompareTime':startCompareTime,
    'endCompareTime':endCompareTime,
    'isSearch':isSearch
  }

}


/**

 * * 获取环比日期 dateStatisticType day--日 month--月 year--年
 * @param startTime
 * @param endTime
 * @param dateStatisticType
 * @returns {{startCompareTime: string, endCompareTime: string}}
 */
function dateRing( startTime, endTime, dateStatisticType)
{
  let startRingTime ='';
  let endRingTime ='';

  // 日期一致才进行返回
  if( startTime == endTime ) {

    switch(dateStatisticType)
    {
      case 'day':
        startRingTime = getNextDate(startTime, 'day', 1, "YYYY-MM-DD") ;
        endRingTime = startRingTime;
        break;
      case 'month':
        startRingTime = getNextDate(startTime, 'month', 1, "YYYY-MM") ;
        startRingTime= moment(moment(startRingTime)).startOf("month").format("YYYY-MM-DD");
        endRingTime= moment(moment(startRingTime)).endOf("month").format("YYYY-MM-DD");
        //endRingTime = startRingTime;
        break;
      case 'year':
        break;
      default:
        break;
    }

  }

  return {
    'startRingTime':startRingTime,
    'endRingTime':endRingTime
  }

}




export default { getNextDate,collectTypeCombination,dateCombination, dateCompare, dateRing }
