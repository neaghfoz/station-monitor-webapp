import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/paper/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

export const count = (data) => {
  return request({
    url: 'api/v1/paper/count',
    method: 'post',
    data: data
  })
}

export const reverseOut = (data) => {
  return request({
    url: '/api/v1/paper/reverseoutstore',
    method: 'post',
    data: data
  })
}

export const save = (data) => {
  return request({
    url: '/api/v1/paper/instore',
    method: 'post',
    data: data
  })
}

export const use = (data) => {
  return request({
    url: '/api/v1/paper/use',
    method: 'post',
    data: data
  })
}

export const returns = (data) => {
  return request({
    url: '/api/v1/paper/return',
    method: 'post',
    data: data
  })
}

export const out = (data) => {
  return request({
    url: '/api/v1/paper/outstore',
    method: 'post',
    data: data
  })
}

export const update = (data) => {
  return request({
    url: '/api/v1/paper/update',
    method: 'post',
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/api/v1/paper/' + id,
    method: 'get',
    params: {}
  })
}

export const deleteByIds = (ids) => {
  return request({
    url: '/api/v1/paper/' + ids,
    method: 'delete',
    params: {}
  })
}

export const cancel = (ids) => {
  return request({
    url: '/api/v1/paper/cancel/' + ids,
    method: 'post',
    params: {}
  })
}

export const checkPaper = (paperStartNo, paperEndNo, row) => {
  // 增加‘’ 、null 和 undefined 判断
  if (paperStartNo === '' || paperStartNo === null || paperStartNo === undefined || paperEndNo === '' || paperEndNo === null || paperEndNo === undefined) {
    return '纸券号段不能为空'
  }
  const start = parseInt(paperStartNo)
  const end = parseInt(paperEndNo)
  if (start <= 0 || end <= 0) {
    return '纸券号必须大于0'
  }
  if (start > end) {
    return '纸券终止号要大于或等于纸券起始号'
  }
  if (row) {
    const oldStart = row.paperStartShowNo
    const oldEnd = row.paperEndShowNo

    if (oldStart > start || start > oldEnd || oldEnd < end || end < oldStart) {
      return '纸券号段' + start + '~' + end + '，必须在记录范围内'
    }
  }
  return ''
}
