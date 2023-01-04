import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/train/subject/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/train/subject/' + id,
    method: 'get',
    params: {}
  })
}
