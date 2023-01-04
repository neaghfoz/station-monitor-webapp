import request from 'ecip-web/utils/request'

export default {
  findData(params,data){
    return request({
      url: '/api/v1/analyse/list/analyseIncomeStat/findData',
      method: 'post',
      params: params,
      data: data
    })
  },
}
