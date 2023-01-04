import request from 'ecip-web/utils/request'
export const updateStatusList = (params, data) => {
  return request({
    url: '/api/v1/config/updateStatus/list',
    method: 'post',
    params: params,
    data: data
  })
}

export const detail = (id) => {
  return request({
    url: '/api/v1/config/updateStatus/' + id,
    method: 'get',
    params: {}
  })
}
export const allSystems = () => {
  return request({
    url: '/api/v1/version/systemInfo/allSystems',
    method: 'get',
    params: {}
  })
}
