import request from 'ecip-web/utils/request'

export const findList = (params, data) => {
  return request({
    url: 'api/v1/kpi/checkDaily/findList',
    method: 'post',
    params: params,
    data: data
  })
}

export const saveItem = (params, data) => {
  return request({
    url: 'api/v1/kpi/checkDaily/save',
    method: 'post',
    params: params,
    data: data
  })
}

export const checkItem = (params, data) => {
  return request({
    url: 'api/v1/kpi/checkDaily/check',
    method: 'post',
    params: params,
    data: data
  })
}

export const auditItem = (params, data) => {
  return request({
    url: 'api/v1/kpi/checkDaily/audit',
    method: 'post',
    params: params,
    data: data
  })
}

export const deleteItem = (ids) => {
  return request({
    url: `api/v1/kpi/checkDaily/delete/${ids}`,
    method: 'delete',
    params: {},
    data: {}
  })
}
