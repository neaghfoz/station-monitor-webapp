import request from 'ecip-web/utils/request'

export default {
  // 通行费趋势图
  txfjh(data) {
    return request({
      url: 'api/v1/audit/list/reptStat/feeIdxStatDemo',
      method: 'post',
      params: {},
      data: data
    })
  },
  // 关联记账
  gljz(data) {
    return request({
      url: 'api/v1/audit/list/reptStat/gljzStat',
      method: 'post',
      params: {},
      data: data
    })
  },
  // 按统计路径统计
  txljtype(data) {
    return request({
      url: 'api/v1/audit/list/reptStat/feeStatPathType',
      method: 'post',
      params: {},
      data: data
    })
  },
  // 差异原因分析
  ceyy(data) {
    return request({
      url: 'api/v1/audit/list/reptStat/feeIdxStat',
      method: 'post',
      params: {},
      data: data
    })
  },
  // 拆分按拆分日期统计
  feeSplit(data) {
    return request({
      url: 'api/v1/audit/list/reptStat/topStatDemo',
      method: 'post',
      params: {},
      data: data
    })
  },
  // 按出口计费类型统计
  ckjftype(data) {
    return request({
      url: 'api/v1/audit/list/reptStat/feeStatExitFeeType',
      method: 'post',
      params: {},
      data: data
    })
  }
}
