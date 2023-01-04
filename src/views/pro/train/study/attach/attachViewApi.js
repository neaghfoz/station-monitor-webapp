import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/train/attach/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/train/attach/delete/' + ids,
    method: 'delete',
    params: {}
  })
}

export const studyHistorySave = (data) => {
  return request({
    url: 'api/v1/train/studyHistory/save',
    method: 'post',
    data: data
  })
}
export const findAttachById = (id) => {
  return request({
    url: 'api/v1/train/attach/findAttachById/'+id,
    method: 'post',
    params: {}
  })
}
