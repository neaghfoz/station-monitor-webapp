import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/train/examnum/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: 'api/v1/train/examnum/detail/' + id,
    method: 'get',
    params: {}
  })
}

export const save = (data) => {
  return request({
    url: 'api/v1/train/examnum/save',
    method: 'post',
    data: data
  })
}

export const update = (id, data) => {
  return request({
    url: `api/v1/train/examnum/modify/${id}`,
    method: 'put',
    data: data
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: `api/v1/train/examnum/delete/${ids}`,
    method: 'delete',
    // data: ids || []
    params: {}
  })
}

// 查询所有考试信息
export const examList = (params, data) => {
  return request({
    url: `api/v1/train/exam/list`,
    method: 'post',
    params: params,
    data: data
  })
}

export const settingScope = (id, data) => {
  return request({
    url: `api/v1/train/examnum/settingScope/${id}`,
    method: 'PUT',
    data: data
  })
}
