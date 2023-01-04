import request from 'ecip-web/utils/request'

export const favorFind = (data, size, current) => {
  return request({
    url: `api/v1/train/test/favor/findPage?size=${size}&current=${current}`,
    method: 'post',
    data: data
  })
}

// 删除错题集
export const del = (data) => {
  return request({
    url: `/api/v1/train/test/favor/delete`,
    method: 'post',
    data: data
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/train/test/favor/deleteByIds/' + ids,
    method: 'delete',
    params: {}
  })
}
