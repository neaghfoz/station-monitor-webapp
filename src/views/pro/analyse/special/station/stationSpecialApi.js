import request from 'ecip-web/utils/request'

export const getData = (data) => {
  return request({
    url: '/api/v1/analyse/list/stationSpecial/findStationSpecialStat/',
    method: 'post',
    data: data
  })
}

export const exportExcel = (params, data) => {
  return request({
    url: '/api/v1/analyse/list/kpi/exportExcel',
    method: 'post',
    params: params,
    data: data,
  })
}


