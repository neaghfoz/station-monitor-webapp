import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/audit/comm/evidence/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const count = (params) => {
  return request({
    url: 'api/v1/audit/comm/evidence/count',
    method: 'get',
    params: params
  })
}

export const deleteFile = (params, data) => {
  return request({
    url: 'api/v1/audit/comm/evidence/delete',
    method: 'post',
    params: params,
    data: data
  })
}



export const save = (data) => {
  // return request({
  //   url: 'api/v1/audit/comm/evidence/save',
  //   method: 'post',
  //   params: params,
  //   data: data,
  //   headers:{
  //       'Content-Type':'multipart/form-data'
  //   }
  // })
  // this.$http.post('api/v1/audit/comm/evidence/save', data, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data'
  //   }
  // })
}
