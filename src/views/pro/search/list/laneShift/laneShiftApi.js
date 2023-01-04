import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/search/list/laneShift/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const detail = (id) => {
  return request({
    url: `api/v1/search/list/laneShift/detail/${id}`,
    method: 'get'
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/search/list/laneShift/exportExcel',
    method: 'post',
    params: params,
    data: data,
  })
}

export const getByEntity = (data) => {
  return request({
    url: 'api/v1/search/list/laneShift/getByEntity',
    method: 'post',
    data:data
  })
}


