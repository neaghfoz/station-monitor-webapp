import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/search/list/laneShift/fillLaneShift/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const fill = (data) => {
  return request({
    url: 'api/v1/search/list/laneShift/fillLaneShift/fill',
    method: 'post',
    data: data
  })
}




