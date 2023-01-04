import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: '/api/v1/toll/cardUnit/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const findList = (params,data) => {
  return request({
    url: '/api/v1/toll/cardUnit/findList',
    method: 'post',
    params: params,
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/toll/cardUnit/save',
    method: 'post',
    data: data
  })
}


export const update = (unitNo, data) => {
  return request({
    url: '/api/v1/toll/cardUnit/update/'+unitNo,
    method: 'post',
    data: data
  })
}

export const getById = (unitNo) => {
  return request({
    url: '/api/v1/toll/cardUnit/getById/'+unitNo,
    method: 'get',
    params: {}
  })
}

export const checkIsUsed = (unitNo, opType) => {
  return request({
    url: '/api/v1/toll/cardUnit/checkIsUsed/'+unitNo+'/'+opType,
    method: 'get',
    params: {}
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/toll/cardUnit/' + ids,
    method: 'delete',
    params: {}
  })
}

export const clear = (unitNo) => {
  return request({
    url: '/api/v1/toll/cardUnit/clear/'+unitNo,
    method: 'get',
    params: {}
  })
}

export const getCardUnitMessage = (data) => {
  return request({
    url: '/api/v1/toll/cardUnit/getCardUnitMessage',
    method: 'post',
    data: data
  })
}

export const detail = (unitNo) => {
  return request({
    url: '/api/v1/toll/cardUnit/detail/'+unitNo,
    method: 'get',
    params: {}
  })
}


