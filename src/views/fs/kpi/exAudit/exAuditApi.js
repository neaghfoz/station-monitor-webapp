import request from 'ecip-web/utils/request'

export const findList = (params, data) => {
  return request({
    url: 'api/v1/kpi/relatedExlist/findList',
    method: 'post',
    params: params,
    data: data
  })
}

export const getEnVehicleSigId =(passId,enTime) => {
  return request({
    url: `api/v1/search/list/laneExList/getEnVehicleSigId/${passId}/${enTime}`,
    method: 'get'
  })
}
