import request from 'ecip-web/utils/request'

const doStat = (params, data) => {
  return request({
    url: '/api/v1/kpi/index/stat',
    method: 'get',
    params: params,
    data: data
  })
}

const getLastLogin = (params, data) => {
  return request({
    url: '/api/v1/kpi/index/lastLogin',
    method: 'get',
    params: params,
    data: data
  })
}

export default { doStat, getLastLogin }
