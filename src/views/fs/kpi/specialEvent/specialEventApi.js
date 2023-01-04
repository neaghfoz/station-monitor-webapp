import request from 'ecip-web/utils/request'

export const findList = (params, data) => {
  return request({
    url: 'api/v1/kpi/specialEvent/findList',
    method: 'post',
    params: params,
    data: data
  })
}

export const getDetail = (eventNo) => {
  return request({
    url: `api/v1/kpi/specialEvent/detail/${eventNo}`,
    method: 'get',
    params: {},
    data: {}
  })
}


export const submitEvent = (data) => {
  return request({
    url: `api/v1/kpi/specialEvent/save`,
    method: 'post',
    params: {},
    data: data
  })
}

export const deleteItem = (eventNo) => {
  return request({
    url: `api/v1/kpi/specialEvent/delete`,
    method: 'delete',
    params: {'eventNo': eventNo},
    data: {'eventNo': eventNo}
  })
}
