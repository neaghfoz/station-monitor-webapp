import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/search/list/bulkVehReserveList/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const detail = (id) => {
  return request({
    url: `api/v1/search/list/bulkVehReserveList/detail/${id}`,
    method: 'get'
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/search/list/bulkVehReserveList/exportExcel',
    method: 'post',
    params: params,
    data: data,
  })
}


