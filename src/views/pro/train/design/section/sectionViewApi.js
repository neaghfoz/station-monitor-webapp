import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/train/section/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/train/section/' + id,
    method: 'get',
    params: {}
  })
}
