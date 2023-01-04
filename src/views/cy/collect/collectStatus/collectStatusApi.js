import request from 'ecip-web/utils/request'

const findPage = (params, data) => {
  return request({
    url: 'api/v1/collect/collectStatus/findPage',
    method: 'post',
    params: params,
    data: data,
  })
}


/**
 * 申请
 */
const apply = (params, data) => {
  return request({
    url: '/api/v1/collect/collectStatus/apply',
    method: 'post',
    params: params,
    data: data
  })
}

/**
 * 授权
 */
const auth = (params, data) => {
  return request({
    url: '/api/v1/collect/collectStatus/auth',
    method: 'post',
    params: params,
    data: data
  })
}

/**
 * 退回
 */
const sendBack = (params, data) => {
  return request({
    url: '/api/v1/collect/collectStatus/sendBack',
    method: 'post',
    params: params,
    data: data
  })
}
export const roadAuth = (params,data) => {
  return request({
    url: '/api/v1/collect/collectStatus/roadAuth',
    method: 'post',
    params:params,
    data:data
  })
}

export const roadSendBack = (params,data) => {
  return request({
    url: '/api/v1/collect/collectStatus/roadSendBack',
    method: 'post',
    params:params,
    data:data
  })
}
export default {findPage,apply, auth, sendBack,roadAuth,roadSendBack}