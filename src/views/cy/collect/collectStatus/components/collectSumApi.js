import request from 'ecip-web/utils/request'

export const findList = (params,data) => {
  return request({
    url: '/api/v1/collect/collectStatus/findList',
    method: 'post',
    params:params,
    data:data
  })
}


export const save = (params,data) => {
  return request({
    url: '/api/v1/collect/collectStatus/save',
    method: 'post',
    params:params,
    data:data
  })
}

export const submit = (params,data) => {
  return request({
    url: '/api/v1/collect/collectStatus/submit',
    method: 'post',
    params:params,
    data:data
  })
}

