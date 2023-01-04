import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/search/list/vehNotes/getLaneLogs',
    method: 'post',
    params: params,
    data: data
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/search/list/vehNotes/exportExcel',
    method: 'post',
    params: params,
    data: data,
  })
}


