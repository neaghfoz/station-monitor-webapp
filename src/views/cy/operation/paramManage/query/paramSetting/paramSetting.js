import request from 'ecip-web/utils/request'
export const getList = (params) => {
  return request({
    url: '/api/v1/paramMain',
    method: 'get',
    params: params
  })
}

export const getTableColumns = (params) => {
  return request({
    url: '/api/v1/paramMain/selectTableColumns',
    method: 'get',
    params: params
  })
}

export const selectById = (params) => {
  return request({
    url: '/api/v1/paramMain/selectById/' + params.id,
    method: 'get',
    params: params
  })
}

export const saveParamSet = (data) => {
  return request({
    url: '/api/v1/paramMain/genTable',
    method: 'post',
    data: data
  })
}

export const compareAndGenTable = (data) => {
  return request({
    url: '/api/v1/paramMain/compareAndGenTable',
    method: 'post',
    data: data
  })
}

