import request from 'ecip-web/utils/request'


export const findPage = (params, data) => {
  return request({
    url: 'api/v1/audit/list/laneLogAnalysis/findPage',
    method: 'post',
    params: params,
    data: data
  })
}



export const detail = (laneId, gatherTime) => {
  return request({
    url: `api/v1/audit/list/laneLogAnalysis/detail/${laneId}/${gatherTime}`,
    method: 'get'
  })
}
