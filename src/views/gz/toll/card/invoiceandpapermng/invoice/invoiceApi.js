import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/invoice/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const count = (data) => {
  return request({
    url: 'api/v1/invoice/count',
    method: 'post',
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/invoice/instore',
    method: 'post',
    data: data
  })
}

export const use = (data) => {
  return request({
    url: '/api/v1/invoice/use',
    method: 'post',
    data: data
  })
}

export const returns = (data) => {
  return request({
    url: '/api/v1/invoice/return',
    method: 'post',
    data: data
  })
}

export const out = (data) => {
  return request({
    url: '/api/v1/invoice/outstore',
    method: 'post',
    data: data
  })
}

export const reverseOut = (data) => {
  return request({
    url: '/api/v1/invoice/reverseoutstore',
    method: 'post',
    data: data
  })
}

export const update = (data) => {
  return request({
    url: '/api/v1/invoice/update',
    method: 'post',
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/invoice/' + id,
    method: 'get',
    params: {}
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/invoice/' + ids,
    method: 'delete',
    params: {}
  })
}

export const cancel = (ids) => {
  return request({
    url: '/api/v1/invoice/cancel/' + ids,
    method: 'post',
    params: {}
  })
}

export const findLanes = () => {
  return request({
    url: '/api/v1/common/lane/listWithUserAuth',
    method: 'get',
    params: {}
  })
}

export const checkNewInv = (invCode, invStartNo, invEndNo) => {
  if (invCode === '' || invCode === null || invCode === undefined) {
    return '发票代码不能为空'
  }
  // 增加‘’ 、null 和 undefined 判断
  if (invStartNo === '' || invStartNo === null || invStartNo === undefined || invEndNo === '' || invEndNo === null || invEndNo === undefined) {
    return '发票号段不能为空'
  }
  const start = parseInt(invStartNo)
  const end = parseInt(invEndNo)
  if (start <= 0 || end <= 0) {
    return '发票号段' + start + '~' + end + '，必须大于0'
  }
  if (start > end) {
    return '发票号段' + start + '~' + end + '，发票终止号要大于或等于发票起始号'
  }
  return ''
}

export const checkExistsInv = (invStartNo, invEndNo, row) => {
  // 增加‘’ 、null 和 undefined 判断
  if (invStartNo === '' || invStartNo === null || invStartNo === undefined || invEndNo === '' || invEndNo === null || invEndNo === undefined) {
    return '发票号段不能为空'
  }
  const start = parseInt(invStartNo)
  const end = parseInt(invEndNo)
  if (start <= 0 || end <= 0) {
    return '发票号段' + start + '~' + end + '，必须大于0'
  }
  if (start > end) {
    return '发票号段' + start + '~' + end + '，发票终止号要大于或等于发票起始号'
  }
  const oldStart = row.invStartShowNo
  const oldEnd = row.invEndShowNo

  if (oldStart > start || start > oldEnd || oldEnd < end || end < oldStart) {
    return '发票号段' + start + '~' + end + '，必须在记录范围内'
  }
  return ''
}
