import request from 'ecip-web/utils/request'

export default {
  findStationData(data){
    return request({
      url: 'api/v1/analyse/list/flowTurnover/findStationData',
      method: 'post',
      params: {},
      data: data
    })
  },

  findGantryData(data){
    return request({
      url: 'api/v1/analyse/list/flowTurnover/findGantryData',
      method: 'post',
      params: {},
      data: data
    })
  },

}
