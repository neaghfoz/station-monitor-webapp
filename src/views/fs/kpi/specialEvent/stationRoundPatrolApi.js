import request from 'ecip-web/utils/request'

export const findList = (params, data) => {
  return request({
    url: 'api/v1/kpi/stationRoundPatrol/findList',
    method: 'post',
    params: params,
    data: data
  })
}

export const saveItem = (params, data) => {
  return request({
    url: 'api/v1/kpi/stationRoundPatrol/save',
    method: 'post',
    params: params,
    data: data
  })
}

export const deleteItem = (eventNo) => {
  return request({
    url: `api/v1/kpi/stationRoundPatrol/delete`,
    method: 'delete',
    params: {'eventNo': eventNo},
    data: {'eventNo': eventNo}
  })
}
