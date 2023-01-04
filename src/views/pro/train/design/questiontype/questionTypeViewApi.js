import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/train/questiontype/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/train/questiontype/' + id,
    method: 'get',
    params: {}
  })
}

export const list = (type) => {
  return request({
    url: '/api/v1/train/questiontype/list',
    method: 'post',
    data: {
      type: type
    }
  })
}
