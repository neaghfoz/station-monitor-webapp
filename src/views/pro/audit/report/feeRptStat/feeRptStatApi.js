import request from 'ecip-web/utils/request'

export const getFeeRptStat = (data) => {
  return request({
    url: '/api/v1/audit/list/reptStat/getFeeRptStat',
    method: 'post',
    data: data
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: '/api/v1/audit/list/reptStat/feeRptStat/exportExcel',
    method: 'post',
    params: params,
    data: data,
  })
}


