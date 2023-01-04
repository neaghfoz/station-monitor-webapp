import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/lanesummation/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/lanesummation/save',
    method: 'post',
    data: data
  })
}

export const checkById = (orgCode, squadDate, squadNo, opType) => {
  return request({
    url: '/api/v1/lanesummation/check',
    method: 'post',
    data: {
      orgCode: orgCode,
      squadDate: squadDate,
      squadNo: squadNo,
      opType: opType
    }
  })
}

export const getById = (orgCode, squadDate, squadNo) => {
  return request({
    url: '/api/v1/lanesummation/detail',
    method: 'post',
    data: {
      orgCode: orgCode,
      squadDate: squadDate,
      squadNo: squadNo
    }
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/lanesummation/' + ids,
    method: 'delete',
    params: {}
  })
}

export const cancel = (ids) => {
  return request({
    url: '/api/v1/lanesummation/cancel/' + ids,
    method: 'post',
    params: {}
  })
}
