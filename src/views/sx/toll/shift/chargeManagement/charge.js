import request from 'ecip-web/utils/request'
export const list = (params, data) => {
  return request({
    url: '/api/v1/shift/shiftCharge/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/shift/shiftCharge/save?_ignore_error=true',
    method: 'post',
    data: data
  })
}

export const update = (data) => {
  return request({
    url: '/api/v1/shift/shiftCharge/update?_ignore_error=true',
    method: 'post',
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/shift/shiftCharge/' + id,
    method: 'get',
    params: {}
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/shift/shiftCharge/delete/' + ids,
    method: 'delete',
    params: {}
  })
}

export const submitByIds = (ids) => {
  return request({
    url: '/api/v1/shift/shiftCharge/submit/' + ids,
    method: 'post',
    params: {}
  })
}

export const transvoidByIds = (ids) => {
  return request({
    url: '/api/v1/shift/shiftCharge/transvoid/' + ids,
    method: 'post',
    params: {}
  })
}

export const updatePrintCount = (id) => {
  return request({
    url: '/api/v1/shift/shiftCharge/updatePrintCount/' + id,
    method: 'post',
    params: {}
  })
}

