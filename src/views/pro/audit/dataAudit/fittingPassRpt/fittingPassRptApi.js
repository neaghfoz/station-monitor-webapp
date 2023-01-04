import request from 'ecip-web/utils/request'


const findReport = (params, data) => {
  return request({
    url: '/api/v1/audit/comm/fittingPassRpt/findReport',
    method: 'post',
    params: params,
    data: data
  })
}
const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/audit/comm/fittingPassRpt/exp',
    method: 'post',
    params: params,
    data: data,
  })
}

export default {findReport,exportExcel}


