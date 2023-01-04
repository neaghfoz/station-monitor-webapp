import request from 'ecip-web/utils/request'

export const getTree = (data) => {
  return request({
    url: `/api/v1/train/hexmapping/tree`,
    method: 'post',
    data: data
  })
}
