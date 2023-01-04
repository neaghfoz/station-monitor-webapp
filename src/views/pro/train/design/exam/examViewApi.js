import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/train/exam/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/train/exam/detail/' + id,
    method: 'get',
    params: {}
  })
}

export const save = (data) => {
  return request({
    url: 'api/v1/train/exam/save',
    method: 'post',
    data: data
  })
}

export const update = (id, data) => {
  return request({
    url: `api/v1/train/exam/modify/${id}`,
    method: 'put',
    data: data
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: `api/v1/train/exam/delete/${ids}`,
    method: 'delete',
    // data: ids || []
    params: {}
  })
}
