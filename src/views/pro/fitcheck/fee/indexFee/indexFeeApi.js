import request from 'ecip-web/utils/request'

export default {
  // 通行费趋势图
  txfjh(data) {
    return request({
      url: 'api/v1/fitcheck/list/reptStat/feeIdxStat',
      method: 'post',
      params: {},
      data: data
    })
  },
  // 拆分按拆分日期统计
  feeSplit(data) {
    return request({
      url: 'api/v1/fitcheck/list/reptStat/topStat',
      method: 'post',
      params: {},
      data: data
    })
  }
}
