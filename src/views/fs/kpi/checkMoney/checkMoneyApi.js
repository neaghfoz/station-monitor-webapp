import request from 'ecip-web/utils/request'

export const findList = (params, data) => {
  return request({
    url: 'api/v1/kpi/checkMoney/findList',
    method: 'post',
    params: params,
    data: data
  })
}

export const saveItem = (params, data) => {
  return request({
    url: 'api/v1/kpi/checkMoney/save',
    method: 'post',
    params: params,
    data: data
  })
}

export const checkItem = (params, data) => {
  return request({
    url: 'api/v1/kpi/checkMoney/check',
    method: 'post',
    params: params,
    data: data
  })
}

export const auditItem = (params, data) => {
  return request({
    url: 'api/v1/kpi/checkMoney/audit',
    method: 'post',
    params: params,
    data: data
  })
}

export const deleteItem = (ids) => {
  return request({
    url: `api/v1/kpi/checkMoney/delete/${ids}`,
    method: 'delete',
    params: {},
    data: {}
  })
}
