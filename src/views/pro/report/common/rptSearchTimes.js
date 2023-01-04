import request from 'ecip-web/utils/request'

export const updateRptSearchTimes = (id) => {
  return request({
    url: '/api/v1/search/rpt/updateRptSearchTimes',
    method: 'post',
    params: {id: id}
  })
}
