import request from 'ecip-web/utils/request'

export default {
  findFlowData(params,data){
    return request({
      url: 'api/v1/analyse/list/stationFlow/findFlowData',
      method: 'post',
      params: params,
      data: data
    })
  },

  findByRoadOrStation(params,data){
    return request({
      url: 'api/v1/analyse/list/stationFlow/findByRoadOrStation',
      method: 'post',
      params: params,
      data: data
    })
  },

  findByOther(params,data){
    return request({
      url: 'api/v1/analyse/list/stationFlow/findByOther',
      method: 'post',
      params: params,
      data: data
    })
  },
}
